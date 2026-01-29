export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {[
        { label: "Active Nodes", value: 12 },
        { label: "Occupied", value: 4 },
        { label: "Available", value: 8 },
        { label: "System Health", value: "99.8%" },
      ].map((c) => (
        <div
          key={c.label}
          className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl"
        >
          <p className="text-xs text-white/40">{c.label}</p>
          <p className="text-3xl font-black text-blue-500">{c.value}</p>
        </div>
      ))}
    </div>
  );
}