export default function LiveMap() {
  return (
    <div className="relative bg-[#0a0a0f] border border-white/10 rounded-3xl h-full">
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      <div className="relative p-6">
        <h2 className="font-black tracking-widest mb-4">LIVE CAMPUS MAP</h2>

        <div className="grid grid-cols-3 gap-4">
          {["AI LAB", "IOT LAB", "LECTURE HALL", "SEMINAR", "PARKING", "GPU CLUSTER"].map(
            (n) => (
              <div
                key={n}
                className="p-6 bg-white/[0.03] rounded-2xl text-xs text-center font-bold hover:bg-blue-600 transition"
              >
                {n}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}