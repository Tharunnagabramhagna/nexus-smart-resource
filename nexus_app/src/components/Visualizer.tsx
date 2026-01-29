import React, { useState } from "react";

const Visualizer: React.FC = () => {
  const [prompt, setPrompt] = useState("AI Computing Lab");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateMock = () => {
    setLoading(true);
    setTimeout(() => {
      setImage(
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
      );
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="p-8 border border-white/10 rounded-3xl bg-white/[0.03] max-w-4xl">
      <h3 className="text-xl font-black tracking-widest mb-2">
        FACILITY VISUALIZER
      </h3>
      <p className="text-xs mono text-white/40 mb-6">
        AI-GENERATED SPATIAL CONCEPT RENDERING
      </p>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm mb-4"
        placeholder="Enter facility name..."
      />

      <button
        onClick={generateMock}
        disabled={loading}
        className="px-6 py-3 rounded-xl text-xs font-black tracking-widest bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition"
      >
        {loading ? "GENERATING..." : "GENERATE VISUAL"}
      </button>

      {image && (
        <div className="mt-6">
          <img
            src={image}
            alt="Facility"
            className="rounded-2xl border border-white/10"
          />
        </div>
      )}
    </div>
  );
};

export default Visualizer;