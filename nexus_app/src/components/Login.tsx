import React, { useState } from "react";

export default function Login({ onLogin }: { onLogin: (role: "admin" | "student") => void }) {
  const [role, setRole] = useState<"admin" | "student">("admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050507] text-white">
      <div className="w-96 p-8 bg-white/[0.03] border border-white/10 rounded-3xl">
        <h1 className="text-3xl font-black tracking-widest text-blue-500 mb-2">
          NEXUS
        </h1>
        <p className="text-xs text-white/40 mono mb-8">
          SMART CAMPUS OS
        </p>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="w-full mb-6 p-3 bg-black border border-white/10 rounded-xl text-white"
        >
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>

        <button
          onClick={() => onLogin(role)}
          className="w-full py-3 bg-blue-600 rounded-xl font-black tracking-widest"
        >
          ACCESS SYSTEM
        </button>
      </div>
    </div>
  );
}