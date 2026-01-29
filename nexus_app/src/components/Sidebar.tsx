export default function Sidebar({ setView }: any) {
  return (
    <aside className="w-64 bg-[#070b14] border-r border-white/10 p-6">
      <h1 className="text-blue-500 font-black tracking-widest mb-10">
        NEXUS
      </h1>

      {["Dashboard", "Resources", "Live Map"].map((v) => (
        <button
          key={v}
          onClick={() => setView(v)}
          className="block w-full mb-3 py-3 rounded-xl text-xs font-bold text-left hover:bg-white/[0.05]"
        >
          {v}
        </button>
      ))}
    </aside>
  );
}