import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('pavan@srmap.edu.in');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [offlineReady, setOfflineReady] = useState<null | { email: string; role: 'admin' | 'student' }>(null);
  const API_BASE = import.meta.env.VITE_API_BASE || '/api';

  const syncIdentity = async (identity: string, role: 'admin' | 'student') => {
    setBusy(role);
    setError(null);
    setOfflineReady(null);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identity, role }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Authentication failed.');
      }

      onLogin({
        ...payload.user,
        isLoggedIn: true,
      } as User);
    } catch (issue) {
      const message = issue instanceof Error ? issue.message : 'Unable to sync identity.';
      setError(message);
      setOfflineReady({ email: identity, role });
    } finally {
      setBusy(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const finalEmail = normalizedEmail || 'pavan@srmap.edu.in';
    const role = finalEmail.includes('admin') || finalEmail === 'pavan@srmap.edu.in' ? 'admin' : 'student';
    await syncIdentity(finalEmail, role);
  };

  const handleGoogleLogin = async () => {
    await syncIdentity('student@srmap.edu.in', 'student');
  };

  const handleAdminQuickLink = async () => {
    await syncIdentity('admin@nexus.ai', 'admin');
  };

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/5 blur-[120px] rounded-full" />

      {/* Branding */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 relative z-10">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <svg
              width="120"
              height="120"
              viewBox="0 0 100 100"
              className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
              <path
                d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
              />
              <path
                d="M50 10 L50 50 M85 30 L50 50 M15 30 L50 50"
                stroke="#3b82f6"
                strokeWidth="3"
              />
              <rect x="42" y="42" width="16" height="16" fill="#3b82f6" />
            </svg>
          </div>

          <h1 className="text-7xl font-black tracking-[0.2em] text-white mb-2 uppercase">
            NEXUS
          </h1>

          <p className="text-xs text-white/40 tracking-[0.2em] uppercase max-w-md mx-auto mb-20">
            Architecting the future of campus intelligence
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-500 uppercase tracking-widest">
              Global Sync Status: Nominal
            </span>
          </div>
        </div>
      </div>

      {/* Auth Card */}
      <div className="w-full md:w-[500px] flex items-center justify-center p-8 relative z-20">
        <div className="w-full bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/5 p-10 rounded-[40px] shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-xs text-white/30">
              Authenticate your academic node access
            </p>
          </div>

          {error ? (
            <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {offlineReady ? (
            <button
              onClick={() =>
                onLogin({
                  email: offlineReady.email,
                  role: offlineReady.role,
                  name: offlineReady.role === 'admin' ? 'ADMIN' : offlineReady.email.split('@')[0],
                  isLoggedIn: true,
                } as User)
              }
              className="mb-6 w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 py-4 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200 hover:bg-cyan-500/15"
            >
              Continue in demo mode
            </button>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">
              Institutional Identity
            </label>

            <input
              type="email"
              placeholder="pavan@srmap.edu.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50"
            />

            <button
              type="submit"
              disabled={!!busy}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all"
            >
              {busy === 'admin' || busy === 'student' ? 'Syncing...' : 'Sync Identity'}
            </button>
          </form>

          <div className="my-10 border-t border-white/5" />

          <button
            onClick={handleGoogleLogin}
            disabled={!!busy}
            className="w-full bg-white/[0.02] border border-white/5 text-white py-4 rounded-2xl mb-6 disabled:opacity-60"
          >
            Sign in with Google
          </button>

          <button onClick={handleAdminQuickLink} disabled={!!busy} className="w-full text-center disabled:opacity-60">
            <span className="text-[9px] text-white/30 uppercase tracking-widest hover:text-blue-400">
              Systems Administrator Access
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Auth;
