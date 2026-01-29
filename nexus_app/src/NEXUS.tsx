import { useState } from "react";

/* ================= MOCK DATA ================= */

const RESOURCES = [
  {
    name: "AI / ML Computing Lab",
    type: "Lab",
    capacity: "60 Seats",
    floor: "Block A · Floor 2",
    equipment: "NVIDIA A100 GPUs",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
  },
  {
    name: "IoT Prototyping Lab",
    type: "Lab",
    capacity: "40 Seats",
    floor: "Block C · Floor 1",
    equipment: "Sensors, Arduino, ESP32",
    image: "https://images.unsplash.com/photo-1581092588429-33a58c86c6c9",
  },
  {
    name: "Cyber Security Lab",
    type: "Lab",
    capacity: "30 Seats",
    floor: "Block D · Floor 3",
    equipment: "Isolated Network, SOC Tools",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  },
  {
    name: "Newton Lecture Hall",
    type: "Classroom",
    capacity: "180 Seats",
    floor: "Main Block · Ground",
    equipment: "4K Projector, Smart Board",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  },
  {
    name: "Tesla Seminar Room",
    type: "Classroom",
    capacity: "80 Seats",
    floor: "Main Block · Floor 2",
    equipment: "Hybrid Conferencing",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
  },
  {
    name: "Aryabhatta Research Hall",
    type: "Classroom",
    capacity: "120 Seats",
    floor: "Innovation Wing",
    equipment: "Interactive Panels",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
  },
];

/* ================= MAIN ================= */

export default function NEXUS() {
  const [user, setUser] = useState<null | "admin" | "user">(null);
  const [view, setView] = useState("dashboard");

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen flex bg-[#050507] text-white animate-fadeIn">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#070b14] border-r border-white/10 p-6 flex flex-col">
        <h1 className="text-blue-500 font-black tracking-widest text-xl mb-10">
          NEXUS
        </h1>

        <nav className="space-y-3">
          <Btn onClick={() => setView("dashboard")}>Dashboard</Btn>
          <Btn onClick={() => setView("map")}>Live Map</Btn>
          <Btn onClick={() => setView("resources")}>Resources</Btn>
        </nav>

        <div className="mt-auto text-xs text-white/40">
          ROLE: {user.toUpperCase()}
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        {view === "dashboard" &&
          (user === "admin" ? <AdminDashboard /> : <UserDashboard />)}
        {view === "map" && <LiveMap />}
        {view === "resources" && <Resources />}
      </main>
    </div>
  );
}

/* ================= LOGIN ================= */

function Login({ onLogin }: { onLogin: (r: "admin" | "user") => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black animate-fadeIn">
      <div className="bg-white/[0.03] border border-white/10 p-10 rounded-3xl text-center space-y-6">
        <h2 className="text-3xl font-black tracking-widest text-blue-500">
          NEXUS LOGIN
        </h2>
        <button onClick={() => onLogin("admin")} className="login-btn">
          Login as Admin
        </button>
        <button onClick={() => onLogin("user")} className="login-btn">
          Login as User
        </button>
      </div>
    </div>
  );
}

/* ================= DASHBOARDS ================= */

function AdminDashboard() {
  return (
    <>
      <Title>ADMIN COMMAND CENTER</Title>
      <Stats />
      <Insight text="AI recommends reallocating Seminar Rooms between 11:00–13:00 to reduce congestion." />
    </>
  );
}

function UserDashboard() {
  return (
    <>
      <Title>USER DASHBOARD</Title>
      <Stats />
      <Insight text="Most available labs right now: AI/ML Lab, Cyber Security Lab." />
    </>
  );
}

/* ================= LIVE MAP ================= */

function LiveMap() {
  return (
    <>
      <Title>LIVE CAMPUS MAP</Title>
      <div className="grid grid-cols-3 gap-6">
        {["AI Lab", "IoT Lab", "Lecture Hall", "Seminar", "Parking", "Library"].map(
          (n) => (
            <div
              key={n}
              className="p-8 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-blue-600 transition-all hover:scale-105"
            >
              <h3 className="font-black">{n}</h3>
              <p className="text-xs text-white/40 mt-2">STATUS: LIVE</p>
            </div>
          )
        )}
      </div>
    </>
  );
}

/* ================= RESOURCES ================= */

function Resources() {
  return (
    <>
      <Title>CAMPUS RESOURCES</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {RESOURCES.map((r) => (
          <div
            key={r.name}
            className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all"
          >
            <img src={r.image} className="h-44 w-full object-cover" />
            <div className="p-5 space-y-1">
              <h3 className="font-black">{r.name}</h3>
              <p className="text-xs text-white/40">{r.type}</p>
              <p className="text-xs">Capacity: {r.capacity}</p>
              <p className="text-xs">Floor: {r.floor}</p>
              <p className="text-xs text-blue-400">{r.equipment}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= UI HELPERS ================= */

function Title({ children }: { children: string }) {
  return (
    <h2 className="text-3xl font-black tracking-widest mb-8 animate-slideUp">
      {children}
    </h2>
  );
}

function Stats() {
  return (
    <div className="grid grid-cols-4 gap-6 mb-10">
      {[
        ["Active Nodes", 18],
        ["Available", 11],
        ["Occupied", 5],
        ["Health", "99.9%"],
      ].map(([l, v]) => (
        <div
          key={l}
          className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl"
        >
          <p className="text-xs text-white/40">{l}</p>
          <p className="text-3xl font-black text-blue-500">{v}</p>
        </div>
      ))}
    </div>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <div className="p-6 bg-blue-600/10 border border-blue-500/30 rounded-2xl animate-pulse">
      <p className="text-xs uppercase tracking-widest text-blue-400">
        AI INSIGHT
      </p>
      <p className="text-white/80 mt-2">{text}</p>
    </div>
  );
}

function Btn({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-xl text-xs font-black tracking-widest text-white/60 hover:bg-white/5 hover:text-white transition"
    >
      {children}
    </button>
  );
}

/* ================= GLOBAL STYLES ================= */

const style = document.createElement("style");
style.innerHTML = `
.login-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: rgba(59,130,246,0.2);
  border: 1px solid rgba(59,130,246,0.4);
  font-weight: 700;
}
.animate-fadeIn { animation: fade 0.6s ease; }
.animate-slideUp { animation: slide 0.5s ease; }
@keyframes fade { from {opacity:0} to {opacity:1} }
@keyframes slide { from {opacity:0; transform:translateY(20px)} to {opacity:1; transform:none} }
`;
document.head.appendChild(style);