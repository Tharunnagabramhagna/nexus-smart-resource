
import React, { useState, useEffect } from 'react';

const Splash: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0c] flex flex-col items-center justify-center z-50">
      {/* NEXUS Circular HUD Logo */}
      <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100" style={{ animationDuration: '20s' }}>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-20" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="1 10" className="opacity-40" />
          <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />
        </svg>
        
        {/* Central Brand */}
        <div className="text-center z-10 flex flex-col items-center">
          <svg width="40" height="40" viewBox="0 0 100 100" className="text-blue-500 mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="6" />
            <path d="M50 10 L50 50 M85 30 L50 50 M15 30 L50 50" stroke="currentColor" strokeWidth="4" />
            <rect x="42" y="42" width="16" height="16" fill="currentColor" fillOpacity="0.8" />
          </svg>
          <div className="text-white font-black tracking-[0.6em] text-2xl uppercase ml-[0.6em] animate-pulse">NEXUS</div>
          <div className={`text-[8px] text-blue-400 font-bold mt-2 mono tracking-[0.4em] uppercase opacity-60`}>System Initializing</div>
        </div>
      </div>

      <div className="w-72 space-y-4">
        <div className="flex justify-between items-end mb-1">
           <span className="text-white/20 text-[9px] uppercase tracking-[0.3em] mono font-bold">Establishing Secure Link...</span>
           <span className="text-blue-500 text-xs mono font-black">{progress}%</span>
        </div>
        <div className="w-full h-[1px] bg-white/5 overflow-hidden rounded-full relative">
          <div 
            className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-100 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
          {/* Subtle moving light effect */}
          <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[scan-horizontal_2s_infinite]" style={{ left: `${progress - 10}%` }}></div>
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="flex gap-1">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-1 h-1 rounded-full bg-blue-500/30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
           ))}
        </div>
        <div className="text-white/20 mono text-[8px] tracking-[0.4em] uppercase font-bold">
          CORE MODULES: AUTH // MAP // ANALYTICS
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Splash;
