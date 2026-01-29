import React, { useState, useMemo, useRef, useEffect } from 'react';

interface SystemGuideProps {
  isDarkMode: boolean;
}

const SystemGuide: React.FC<SystemGuideProps> = ({ isDarkMode }) => {
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const demoTimerRef = useRef<number | null>(null);

  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-white/40' : 'text-slate-500';
  const cardBg = isDarkMode
    ? 'bg-[#0a0a16]/60 border-white/5'
    : 'bg-white border-slate-200 shadow-sm';

  const architectureItems = useMemo(
    () => [
      {
        id: 'frontend',
        title: 'FRONTEND',
        desc:
          'The digital dashboard where users explore resources and admins manage the facility.',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        id: 'backend',
        title: 'BACKEND',
        desc:
          'The engine room that calculates schedules and prevents double-bookings in real-time.',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        ),
      },
      {
        id: 'database',
        title: 'DATABASE',
        desc:
          'A centralized library that securely stores all resource details, user roles, and booking history.',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
            />
          </svg>
        ),
      },
      {
        id: 'ai',
        title: 'AI LAYER',
        desc:
          'A smart brain powered by Gemini that provides spatial insights and prevents scheduling conflicts.',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
            />
          </svg>
        ),
      },
    ],
    []
  );

  const handleRunDemo = () => {
    if (isDemoRunning) return;

    setIsDemoRunning(true);

    demoTimerRef.current = window.setTimeout(() => {
      setIsDemoRunning(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (demoTimerRef.current) {
        clearTimeout(demoTimerRef.current);
        demoTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-10 max-w-[1400px] mx-auto animate-in fade-in duration-700 h-full overflow-y-auto custom-scrollbar pb-32">
      {/* Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {architectureItems.map(item => (
          <div
            key={item.id}
            className={`p-10 rounded-[32px] border ${cardBg} group hover:border-blue-500/30 transition-all duration-500 flex flex-col items-start gap-4 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
            <div className="p-4 bg-blue-500/10 border border-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-105 transition-transform">
              {item.icon}
            </div>
            <h3 className={`text-base font-black uppercase tracking-[0.2em] ${textPrimary}`}>
              {item.title}
            </h3>
            <p
              className={`text-[13px] leading-relaxed ${textSecondary} font-medium tracking-tight max-w-[90%]`}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Demo Button */}
      <button
        onClick={handleRunDemo}
        disabled={isDemoRunning}
        className={`w-full p-8 rounded-[40px] border transition-all text-left flex items-center gap-6 ${
          isDemoRunning
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-blue-600/40 bg-blue-600/10 hover:bg-blue-600/20'
        }`}
      >
        <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white">
          {isDemoRunning ? 'RESOLVING CONFLICTS…' : 'CONFLICT RESOLUTION DEMO'}
        </h2>
      </button>
    </div>
  );
};

export default SystemGuide;