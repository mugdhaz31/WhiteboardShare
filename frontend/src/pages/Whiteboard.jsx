import React, { useState, useRef, useEffect } from "react";
import Toolbar from "../components/Toolbar";
import Canvas from "../components/Canvas";
import { socket } from "../socket";
import { useParams } from "react-router-dom";
import Chat from "../components/Chat";

const Whiteboard = ({ user, users }) => {
  const { roomid } = useParams();
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#ff0000");
  const [brushSize, setBrushSize] = useState(3);
  const [fill, setFill] = useState(false); 
  const [elements, setElements] = useState([]);
  const [currentElement, setCurrentElement] = useState(null);
  const [redoElements, setRedoElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [showUsersSidebar, setShowUsersSidebar] = useState(false);


  const canvasRef = useRef(null);
  const roomCode = window.location.pathname.split("/")[1]; // get room code

  // Sync elements with other users
  useEffect(() => {
    if (user?.host) {
      socket.emit("updateElements", { roomCode, elements });
    }
  }, [elements]);

  useEffect(() => {
    socket.on("receiveElements", (updatedElements) => {
      setElements(updatedElements);
    });

    return () => {
      socket.off("receiveElements");
    };
  }, []);

  const handleUndo = () => {
    setElements((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = updated.pop();
      setRedoElements((r) => [...r, last]);
      socket.emit("updateElements", { roomCode, elements: updated });
      return updated;
    });
  };

  const handleRedo = () => {
    setRedoElements((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = updated.pop();
      setElements((e) => {
        const updatedElements = [...e, last];
        socket.emit("updateElements", { roomCode, elements: updatedElements });
        return updatedElements;
      });
      return updated;
    });
  };

  const handleClear = () => {
    setElements([]);
    setCurrentElement(null);
    setRedoElements([]);
    socket.emit("updateElements", { roomCode, elements: [] });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "whiteboard-drawing.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
      <div onClick={() => setShowUsersSidebar(!showUsersSidebar)} className="fixed top-6 right-6 flex items-center gap-2 bg-white shadow-md rounded-full px-4 py-2 border border-gray-200 z-50 cursor-pointer">
        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        <span className="text-gray-700 font-medium">
          {Array.isArray(users) ? users.length : 0} Online
        </span>
      </div>

      {showUsersSidebar && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Users in Room</h3>
            <button className="text-gray-500" onClick={() => setShowUsersSidebar(false)}>✕</button>
          </div>
          <ul className="flex-1 overflow-y-auto space-y-2">
            {Array.isArray(users) && users.length > 0 ? (
              users.map((u, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  {u.name || "Anonymous"}
                  {u.host && (
                    <span className="ml-auto text-xs bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded">
                      Host
                    </span>
                  )}
                  {u.presenter && !u.host && (
                    <span className="ml-auto text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded">
                      Presenter
                    </span>
                  )}
                </li>

              ))
            ) : (
              <li className="text-sm text-gray-400">No users online</li>
            )}
          </ul>
        </div>
      )}

      {/* Toolbar */}
      {user && user.presenter && (
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          elements={elements}
          handleClear={handleClear}
          handleDownload={handleDownload}
          fill={fill}
  setFill={setFill}
        />
      )}

      {/* Canvas */}
      <Canvas
        ref={canvasRef}
        tool={tool}
        color={color}
        brushSize={brushSize}
        fill={fill} 
        elements={elements}
        setElements={setElements}
        currentElement={currentElement}
        setCurrentElement={setCurrentElement}
        redoElements={redoElements}
        setRedoElements={setRedoElements}
        drawing={drawing}
        setDrawing={setDrawing}
        user={user}
        roomCode={roomCode}
      />

      {/* Undo / Redo below canvas */}
      {user && user.presenter && (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4 bg-white shadow-md rounded-2xl px-6 py-3 border border-gray-200">
          <button
            onClick={handleUndo}
            disabled={elements.length === 0}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={redoElements.length === 0}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redo
          </button>
        </div>
      )}
      {user && roomid && <Chat user={user} roomCode={roomid} />}
    </div>
  );
};

export default Whiteboard;
