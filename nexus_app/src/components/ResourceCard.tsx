export default function ResourceCard({ r }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
      <img src={r.image} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-black text-sm">{r.name}</h3>
        <p className="text-xs text-white/40 mono">{r.type}</p>
        <p className="text-xs mt-2">
          Status: <span className="text-blue-400">{r.status}</span>
        </p>
        <p className="text-xs text-white/40">
          Capacity: {r.capacity}
        </p>
      </div>
    </div>
  );
}