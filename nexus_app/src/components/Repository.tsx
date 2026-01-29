import React, { useState } from 'react';

const Repository: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'NOMINAL'>('NOMINAL');
  
  const files = [
    { name: 'App.tsx', size: '2.4kb', status: 'verified' },
    { name: 'NEXUS.tsx', size: '12.8kb', status: 'verified' },
    { name: 'index.tsx', size: '1.2kb', status: 'verified' },
    { name: 'types.ts', size: '0.8kb', status: 'verified' },
    { name: 'package.json', size: '1.5kb', status: 'verified' },
    { name: 'README.md', size: '4.1kb', status: 'verified' },
    { name: 'components/', size: 'DIR', status: 'verified' },
    { name: '.gitignore', size: '0.4kb', status: 'verified' },
  ];

  const handleManualSync = () => {
    setSyncStatus('SYNCING');
    setTimeout(() => setSyncStatus('NOMINAL'), 2500);
  };

  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-white/40' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-[#0a0a16]/60 border-white/5' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-700 h-full overflow-y-auto custom-scrollbar pb-32">
      {/* Header HUD */}
      <div className="flex flex-col mb-12">
        <div className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-1">
          NEXUS - SOURCE CODE MANIFEST
        </div>
        <div className="text-white/30 text-[8px] mono uppercase tracking-widest mb-10">
          GLOBAL VERSION CONTROL INTERFACE
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-500">
               <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
               </svg>
            </div>
            <div>
              <h2 className={`text-4xl font-black uppercase tracking-tight ${textPrimary}`}>NEXUS_REPO</h2>
              <div className="flex items-center gap-2 mt-1">
                 <div className={`w-2 h-2 rounded-full ${syncStatus === 'SYNCING' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`}></div>
                 <span className="text-[10px] mono font-bold text-white/40 uppercase tracking-widest">BRANCH: MAIN // {syncStatus}</span>
              </div>
            </div>
          </div>

          <a 
            href="https://github.com/new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Open on GitHub
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className={`lg:col-span-2 p-8 rounded-[40px] border ${cardBg} backdrop-blur-md relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">MANIFEST_TREE</h3>
            <button 
              onClick={handleManualSync}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-500 transition-all"
            >
              Force Sync
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <svg className={`w-5 h-5 ${file.name.endsWith('/') ? 'text-amber-500' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={file.name.endsWith('/') ? "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" : "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"} />
                  </svg>
                  <span className="text-[13px] font-black mono text-white/80 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{file.name}</span>
                </div>
                <div className="flex items-center gap-8">
                   <span className="text-[10px] mono text-white/20 font-bold uppercase">{file.size}</span>
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                      <span className="text-[8px] mono font-bold text-emerald-500 uppercase tracking-widest">OK</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className={`p-8 rounded-[40px] border ${cardBg}`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-8">REPO_HEALTH</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Type-Safety Index</span>
                  <span className="text-xl font-black text-blue-500">98%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Asset Integrity</span>
                  <span className="text-xl font-black text-emerald-500">100%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repository;