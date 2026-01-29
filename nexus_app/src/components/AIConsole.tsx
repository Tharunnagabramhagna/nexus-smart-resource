import React, { useState } from "react";

const AIConsole: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="p-10">
      <h2 className="text-3xl font-black tracking-widest text-purple-400 mb-8">
        AI ASSISTANT
      </h2>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask AI to find a room..."
        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-xs mono"
      />

      <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs mono">
        AI Recommendation: Use <b>AI/ML Lab</b> — available and optimal.
      </div>
    </div>
  );
};

export default AIConsole;