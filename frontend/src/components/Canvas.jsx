import React, { useRef, useEffect, forwardRef } from "react";
import rough from "roughjs/bin/rough";
import { socket } from "../socket";

const Canvas = forwardRef(({
  tool,
  color,
  brushSize,
  fill,
  elements,
  setElements,
  currentElement,
  setCurrentElement,
  redoElements,
  setRedoElements,
  drawing,
  setDrawing,
  user, roomCode
}, ref) => {
  const canvasRef = useRef(null);
  const rc = useRef(null);

  // Initialize canvas & redraw, also handle resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const context = canvas.getContext("2d");
      context.scale(window.devicePixelRatio, window.devicePixelRatio);

      rc.current = rough.canvas(canvas);
      drawElements();
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
    };
  }, [elements, currentElement]);

  const drawElements = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const allElements = currentElement ? [...elements, currentElement] : elements;

    allElements.forEach(el => {
      const { type, points, color, size, fill } = el;
      context.strokeStyle = color;
      context.lineWidth = size;
      context.fillStyle = color;

      if (type === "pencil" || type === "brush") {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        points.forEach(p => context.lineTo(p.x, p.y));
        context.stroke();
      } else if (type === "line") {
        rc.current.line(points[0].x, points[0].y, points[1].x, points[1].y, {
          stroke: color,
          strokeWidth: size,
        });
      } else if (type === "rectangle") {
        const x = points[0].x;
        const y = points[0].y;
        const width = points[1].x - x;
        const height = points[1].y - y;

        if (fill) {
          context.fillRect(x, y, width, height);
        } else {
          rc.current.rectangle(x, y, width, height, {
            stroke: color,
            strokeWidth: size,
          });
        }
      } else if (type === "circle") {
        const x1 = points[0].x;
        const y1 = points[0].y;
        const x2 = points[1].x;
        const y2 = points[1].y;
        const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        context.beginPath();
        context.arc(x1, y1, radius, 0, 2 * Math.PI);
        if (fill) context.fill();
        else context.stroke();
      }
    });
  };

  const getEventCoordinates = (e) => {
    if (e.touches) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    } else {
      return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    }
  };

  const startDrawing = (e) => {
    if (!user?.host) return;
    e.preventDefault();
    const { offsetX, offsetY } = getEventCoordinates(e);
    setDrawing(true);

    let newEl;
    if (tool === "pencil" || tool === "brush") {
      newEl = { type: tool, points: [{ x: offsetX, y: offsetY }], color, size: brushSize, fill };
    } else {
      newEl = { type: tool, points: [{ x: offsetX, y: offsetY }, { x: offsetX, y: offsetY }], color, size: brushSize, fill };
    }

    setCurrentElement(newEl);
  };

  const draw = (e) => {
    if (!drawing || !currentElement || !user?.host) return;
    e.preventDefault();
    const { offsetX, offsetY } = getEventCoordinates(e);

    if (tool === "pencil" || tool === "brush") {
      setCurrentElement(prev => ({ ...prev, points: [...prev.points, { x: offsetX, y: offsetY }] }));
    } else {
      setCurrentElement(prev => ({ ...prev, points: [prev.points[0], { x: offsetX, y: offsetY }] }));
    }
  };

  const stopDrawing = (e) => {
    if (!user?.host) return;
    e?.preventDefault();
    if (currentElement) {
      setElements(prev => [...prev, currentElement]);
      socket.emit("drawing", { roomCode, element: currentElement });
      setCurrentElement(null);
      setRedoElements([]);
    }
    setDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e) => startDrawing(e);
    const handleTouchMove = (e) => draw(e);
    const handleTouchEnd = (e) => stopDrawing(e);

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startDrawing, draw, stopDrawing]);

  useEffect(() => {
    socket.on("receiveDrawing", (element) => {
      setElements(prev => [...prev, element]);
    });
    return () => socket.off("receiveDrawing");
  }, []);

  const getCursor = () => {
    if (!user?.host) return "not-allowed";
    return "crosshair";
  };

  return (
    <canvas
      ref={(node) => {
        canvasRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      style={{ cursor: getCursor() }}
      className="bg-white border-2 border-dashed border-gray-300 rounded-2xl shadow-lg w-[90%] h-[70vh]"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
});

export default Canvas;
