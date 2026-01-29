import React, { useState } from "react";

const AIChat: React.FC = () => {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  const ask = () => {
    setA("AI Insight: IoT Lab is free and fits 20+ capacity.");
  };

  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-xl font-black tracking-widest mb-4">
        AI ASSISTANT
      </h2>

      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Ask about rooms, labs, capacity..."
        className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-sm"
      />

      <button
        onClick={ask}
        className="mt-4 px-6 py-3 bg-blue-600/20 rounded-xl text-xs font-black tracking-widest text-blue-400"
      >
        ASK AI
      </button>

      {a && (
        <div className="mt-6 p-4 border border-white/10 rounded-xl text-sm">
          {a}
        </div>
      )}
    </div>
  );
};

export default AIChat;