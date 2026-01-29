import React, { useState } from "react";

const resources = [
  { id: 1, name: "AI/ML Lab", status: "Available" },
  { id: 2, name: "Newton Lecture Hall", status: "Occupied" },
  { id: 3, name: "IoT Prototyping Lab", status: "Available" },
];

const ResourceGrid: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="p-10">
      <h2 className="text-3xl font-black tracking-widest text-blue-500 mb-8">
        RESOURCE EXPLORER
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {resources.map((r) => (
          <div
            key={r.id}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition"
          >
            <h3 className="text-lg font-black">{r.name}</h3>
            <p className="text-xs mono text-white/40 mt-1">
              Status: {r.status}
            </p>

            <button
              onClick={() => setSelected(r.id)}
              className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black tracking-widest"
            >
              BOOK
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mono">
          Booking confirmed (demo simulation)
        </div>
      )}
    </div>
  );
};

export default ResourceGrid;