
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.email.toLowerCase();
    const isAdmin = email.includes('admin') || email === 'pavan@srmap.edu.in';
    
    onLogin({
      email: email || 'pavan@srmap.edu.in',
      name: isAdmin ? 'Nexus Administrator' : 'Campus Student',
      role: isAdmin ? 'admin' : 'student',
      isLoggedIn: true
    });
  };

  const handleGoogleLogin = () => {
    onLogin({
      email: 'student@srmap.edu.in',
      name: 'Google User',
      role: 'student',
      isLoggedIn: true
    });
  };

  const handleAdminQuickLink = () => {
    onLogin({
      email: 'admin@nexus.ai',
      name: 'Systems Administrator',
      role: 'admin',
      isLoggedIn: true
    });
  };

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/5 blur-[120px] rounded-full"></div>

      {/* Left Section: Branding */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 relative z-10">
        <div className="text-center">
          {/* Geometric Logo */}
          <div className="mb-8 flex justify-center">
            <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
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
              <rect x="42" y="42" width="16" height="16" fill="#3b82f6" fillOpacity="0.8" />
            </svg>
          </div>

          <h1 className="text-7xl font-black tracking-[0.2em] text-white mb-2 uppercase">NEXUS</h1>
          <div className="text-[10px] font-bold text-cyan-400/80 tracking-[0.4em] uppercase mb-12 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-cyan-400/30"></span>
            Smart Resource and Space Management System
            <span className="w-8 h-[1px] bg-cyan-400/30"></span>
          </div>

          <p className="text-xs font-medium text-white/40 tracking-[0.2em] uppercase max-w-md mx-auto mb-20 leading-loose">
            Architecting the future of campus intelligence
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] mono font-bold text-emerald-500/80 uppercase tracking-widest">Global Sync Status: Nominal</span>
          </div>
        </div>
      </div>

      {/* Right Section: Auth Card */}
      <div className="w-full md:w-[500px] flex items-center justify-center p-8 relative z-20">
        <div className="w-full bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/5 p-10 rounded-[40px] shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-xs text-white/30 tracking-wide">Authenticate your academic node access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Institutional Identity</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  placeholder="pavan@srmap.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium placeholder:text-white/10"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span className="uppercase text-xs tracking-[0.2em]">Sync Identity</span>
              <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[8px]">
              <span className="px-4 bg-[#0a0a0f] text-white/10 uppercase tracking-[0.4em] font-bold">OR</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] text-white/60 hover:text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] mb-8"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.6"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" opacity="0.6"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity="0.6"/>
            </svg>
            <span className="uppercase text-[10px] tracking-[0.2em]">Sign in with Google</span>
          </button>

          <button onClick={handleAdminQuickLink} className="w-full text-center group">
            <span className="text-[9px] font-bold text-white/20 group-hover:text-blue-400 uppercase tracking-[0.3em] transition-colors">Systems Administrator Access</span>
          </button>
        </div>
      </div>
      
      {/* Footer Info (Matching bottom of screen in image) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] mono text-white/20 tracking-widest text-center px-4 w-full">
        THIS APP WAS DEVELOPED BY ANOTHER USER. IT MAY BE INACCURATE OR UNSAFE. REPORT LEGAL ISSUE
      </div>
    </div>
  );
};

export default Auth;
