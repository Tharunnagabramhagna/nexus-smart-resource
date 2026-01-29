
import React, { useState } from 'react';

const SystemGuide: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-white/40' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-[#0a0a16]/60 border-white/5' : 'bg-white border-slate-200 shadow-sm';
  
  const architectureItems = [
    {
      title: 'FRONTEND',
      desc: 'The digital dashboard where users explore resources and admins manage the facility.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'BACKEND',
      desc: 'The engine room that calculates schedules and prevents double-bookings in real-time.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      title: 'DATABASE',
      desc: 'A centralized library that securely stores all resource details, user roles, and booking history.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    },
    {
      title: 'AI LAYER',
      desc: 'A smart brain powered by Gemini that provides spatial insights and prevents scheduling conflicts.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
        </svg>
      )
    }
  ];

  const handleRunDemo = () => {
    setIsDemoRunning(true);
    setTimeout(() => setIsDemoRunning(false), 3000);
  };

  return (
    <div className="p-10 max-w-[1400px] mx-auto animate-in fade-in duration-700 h-full overflow-y-auto custom-scrollbar pb-32">
      {/* HUD Headers */}
      <div className="flex flex-col mb-12">
        <div className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-1">
          NEXUS - SMART RESOURCE AND SPACE MANAGEMENT SYSTEM
        </div>
        <div className="text-white/30 text-[8px] mono uppercase tracking-widest mb-10">
          ARCHITECTING THE FUTURE OF CAMPUS INTELLIGENCE
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-500">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
             </svg>
          </div>
          <h2 className={`text-3xl font-black uppercase tracking-[0.1em] ${textPrimary}`}>SYSTEM ARCHITECTURE</h2>
        </div>
      </div>

      {/* Architecture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {architectureItems.map((item, i) => (
          <div 
            key={i} 
            className={`p-10 rounded-[32px] border ${cardBg} group hover:border-blue-500/30 transition-all duration-500 flex flex-col items-start gap-4 relative overflow-hidden`}
          >
            {/* Subtle Gradient Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-105 transition-transform group-hover:border-blue-500/30">
              {item.icon}
            </div>
            
            <h3 className={`text-base font-black uppercase tracking-[0.2em] ${textPrimary}`}>{item.title}</h3>
            <p className={`text-[13px] leading-relaxed ${textSecondary} font-medium tracking-tight max-w-[90%]`}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Conflict Resolution Demo Section */}
      <div className="relative mt-8 group">
        <button 
          onClick={handleRunDemo}
          className={`w-full relative overflow-hidden p-8 rounded-[40px] border transition-all text-left flex items-center gap-6 ${
            isDemoRunning 
            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
            : 'border-blue-600/40 bg-blue-600/10 hover:bg-blue-600/20 shadow-[0_0_30px_rgba(37,99,235,0.05)]'
          }`}
        >
          <div className={`p-5 rounded-3xl text-white transition-all duration-500 ${isDemoRunning ? 'bg-emerald-500 shadow-[0_0_30px_#10b981]' : 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.3)]'}`}>
            {isDemoRunning ? (
              <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white">
              {isDemoRunning ? 'RESOLVING CONFLICTS...' : 'CONFLICT RESOLUTION DEMO'}
            </h2>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-1 transition-colors ${isDemoRunning ? 'text-emerald-400' : 'text-blue-400'}`}>
              {isDemoRunning ? 'INTERVENTION SEQUENCE IN PROGRESS' : 'SIMULATED INTERVENTION SEQUENCE'}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 pr-4">
             <div className={`w-12 h-1 bg-white/10 rounded-full overflow-hidden`}>
                <div className={`h-full transition-all duration-300 ${isDemoRunning ? 'bg-emerald-500 w-full animate-pulse' : 'bg-blue-500 w-1/3'}`}></div>
             </div>
             <span className="text-[10px] mono text-white/20 font-bold">V4.2</span>
          </div>
          
          {/* Animated Scanning Light Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[scan-horizontal_3s_linear_infinite] pointer-events-none"></div>
        </button>
      </div>

      {/* Footer System Meta */}
      <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
        <div className="flex gap-2">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-1 h-1 rounded-full bg-blue-500/40 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}></div>
           ))}
        </div>
        <div className="text-[10px] mono uppercase tracking-[0.5em] text-white/10 font-black">
          CORE MODULES: AUTH // MAP // ANALYTICS // ARCHITECTURE
        </div>
      </div>
    </div>
  );
};

export default SystemGuide;
