const Toolbar = ({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  elements,
  handleClear,
  handleDownload,
  fill,
  setFill,
  tools = ["pencil", "circle", "rectangle", "line"]
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 bg-white shadow-md rounded-2xl px-6 py-3 border border-gray-200">
        <button
          onClick={handleClear}
          disabled={elements.length === 0}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
        <button
          onClick={handleDownload}
          disabled={elements.length === 0}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed "
        >
          Download
        </button>

        {/* Color + Fill Toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Color</span>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-8 h-8 border rounded cursor-pointer"
            />
          </label>
          <button
            onClick={() => setFill(!fill)}
            className={`px-3 py-1 rounded-lg border transition ${
              fill
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
            }`}
          >
            {fill ? "Fill On" : "Fill Off"}
          </button>
        </div>

        {/* Brush Size */}
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Size</span>
          <input
            type="range"
            min="1"
            max="10"
            value={brushSize}
            onChange={e => setBrushSize(Number(e.target.value))}
            className="cursor-pointer accent-black"
          />
        </label>
      </div>

      {/* Tool Selector */}
      <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-6 py-3 border border-gray-200">
        {tools.map(t => (
          <button
            key={t}
            onClick={() => setTool(t)}
            className={`px-4 py-2 rounded-lg transition active:scale-95 ${
              tool === t
                ? "bg-black text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
