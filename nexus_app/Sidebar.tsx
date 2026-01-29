import React from 'react';
import { User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  activeTab: 'matrix' | 'live-map' | 'audit' | 'guide' | 'repository';
  setActiveTab: (tab: SidebarProps['activeTab']) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setOpen,
  user,
  onLogout,
  isDarkMode,
  activeTab,
  setActiveTab
}) => {
  const menuItems = [
    { id: 'matrix', label: 'EXPLORE RESOURCES', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2', roles: ['admin', 'student'] },
    { id: 'live-map', label: 'LIVE MAP', icon: 'M12 21l-8-18h16l-8 18z M12 11a2 2 0 100-4 2 2 0 000 4z', roles: ['admin', 'student'] },
    { id: 'audit', label: 'ADMIN DASHBOARD', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7', roles: ['admin'] },
    { id: 'guide', label: 'SYSTEM GUIDE', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5', roles: ['admin', 'student'] },
  ] as const;

  const visibleItems = menuItems.filter(item =>
    item.roles.includes(user.role)
  );

  return (
    <div
      className={`h-screen border-r flex flex-col transition-all duration-500 relative z-50
      ${isOpen ? 'w-80' : 'w-0 overflow-hidden pointer-events-none opacity-0'}
      ${isDarkMode ? 'bg-[#070b14] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 100 100" className="text-blue-500">
            <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="6" />
            <path d="M50 10 L50 50 M85 30 L50 50 M15 30 L50 50" stroke="currentColor" strokeWidth="4" />
            <rect x="42" y="42" width="16" height="16" fill="currentColor" fillOpacity="0.8" />
          </svg>
          <span className={`font-black tracking-[0.2em] text-sm uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            NEXUS
          </span>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
        {visibleItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative
              ${activeTab === item.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
              }`}
          >
            {activeTab === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-500 rounded-r-full" />
            )}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black
              ${user.role === 'admin' ? 'bg-lime-400 text-black' : 'bg-blue-500 text-white'}`}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white">
                {user.role}
              </div>
              <div className="text-[8px] mono text-white/40 uppercase truncate max-w-[110px]">
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-white/20 hover:text-red-500 hover:bg-red-500/10 transition"
            title="Disconnect"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;