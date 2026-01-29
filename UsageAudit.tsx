
import React, { useMemo } from 'react';
import { Resource } from '../types';

interface UsageAuditProps {
  isDarkMode: boolean;
  resources: Resource[];
  onStatusChange: (id: string, newStatus: Resource['status']) => void;
}

const UsageAudit: React.FC<UsageAuditProps> = ({ isDarkMode, resources, onStatusChange }) => {
  const activeNodesCount = resources.length;
  const occupiedCount = resources.filter(r => r.status === 'occupied').length;
  const maintenanceCount = resources.filter(r => r.status === 'maintenance').length;

  const logs = useMemo(() => [
    { id: 1, time: '2024-02-25 14:02:11', msg: 'NEWTON LECTURE HALL', status: 'BROADCAST_OK' },
    { id: 2, time: '2024-02-25 14:01:45', msg: 'AI/ML COMPUTING LAB', status: 'SYNC_NOMINAL' },
    { id: 3, time: '2024-02-25 13:58:22', msg: 'TESLA SEMINAR ROOM', status: 'NODE_RELEASED' },
    { id: 4, time: '2024-02-25 13:45:01', msg: 'SYSTEM_GLOBAL_OVERRIDE', status: 'INIT_AUTH' },
  ], []);

  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-white/40' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-[#0a0a16]/80 border-white/5' : 'bg-white border-slate-200';

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 h-full overflow-y-auto custom-scrollbar">
      {/* Dashboard Top HUD Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-1">
            NEXUS - SMART RESOURCE AND SPACE MANAGEMENT SYSTEM
          </div>
          <div className="text-white/30 text-[8px] mono uppercase tracking-widest mb-4">
            ARCHITECTING THE FUTURE OF CAMPUS INTELLIGENCE
          </div>
          <h2 className={`text-4xl font-black uppercase tracking-tight ${textPrimary}`}>COMMAND CENTER</h2>
          <div className="text-[10px] mono text-white/40 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            SYSTEM NODE OVERSIGHT <span className="w-1 h-1 rounded-full bg-white/20"></span> REAL-TIME PROPAGATION
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] mono font-bold text-emerald-500/80 uppercase tracking-widest">SYSTEMS: OPERATIONAL</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[10px] mono font-bold text-blue-500/80 uppercase tracking-widest">LATENCY: 12ms</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Summary HUD Cards */}
        <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-6 rounded-[24px] border ${cardBg}`}>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">ACTIVE NODES</div>
            <div className="text-4xl font-black text-blue-500">{activeNodesCount}</div>
          </div>
          <div className={`p-6 rounded-[24px] border ${cardBg}`}>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">CONFIRMED LOADS</div>
            <div className="text-4xl font-black text-emerald-500">{occupiedCount}</div>
          </div>
          <div className={`p-6 rounded-[24px] border ${cardBg}`}>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">OPEN INCIDENTS</div>
            <div className="text-4xl font-black text-red-500">{maintenanceCount}</div>
          </div>
          <div className={`p-6 rounded-[24px] border ${cardBg}`}>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">SYSTEM HEALTH</div>
            <div className="text-4xl font-black text-amber-500">99.9<span className="text-xl">%</span></div>
          </div>
        </div>

        {/* Utilization Index & Impact Analysis */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-8 rounded-[32px] border ${cardBg} flex flex-col`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest">UTILIZATION INDEX (%)</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[8px] mono text-blue-500 uppercase tracking-widest">LIVE SYNC</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((val, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-[8px] mono text-white/20 w-4">{i*2}h</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000" 
                      style={{ width: `${val}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] mono text-white/40 w-6">{val}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`p-8 rounded-[32px] border ${cardBg}`}>
              <h3 className="text-xs font-black uppercase tracking-widest mb-6">IMPACT ANALYSIS</h3>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-[8px] mono text-white/30 uppercase tracking-widest mb-1">MANUAL BASELINE</div>
                  <div className="text-3xl font-black">2.3</div>
                </div>
                <div className="text-white/20 pb-1">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                   </svg>
                </div>
                <div className="text-right">
                  <div className="text-[8px] mono text-blue-500 uppercase tracking-widest mb-1">NEXUS OPTIMIZED</div>
                  <div className="text-3xl font-black text-blue-500">3</div>
                </div>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center">
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">EFFICIENCY GAIN</div>
                    <div className="text-2xl font-black text-emerald-400">+28.2%</div>
                 </div>
                 <div className="text-emerald-500/30">
                    <svg className="w-10 h-10" viewBox="0 0 100 100">
                      <path d="M10 90 L30 70 L50 75 L70 40 L90 10" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                 </div>
              </div>
            </div>

            <div className={`p-8 rounded-[32px] border ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-black uppercase tracking-widest">GLOBAL NODE OVERRIDE</h3>
                 <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[7px] mono font-bold text-blue-400 uppercase">ATOMIC STATE CONTROL GRID</div>
              </div>
              <div className="flex items-center gap-6 mb-4">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <span className="text-[8px] mono text-white/30 uppercase">AVAILABLE</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                   <span className="text-[8px] mono text-white/30 uppercase">BUSY</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                   <span className="text-[8px] mono text-white/30 uppercase">MAINT</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Anomalies & Atomic Sync Log */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-8 rounded-[32px] border ${cardBg}`}>
            <div className="flex items-center gap-2 mb-8">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xs font-black uppercase tracking-widest">SYSTEM ANOMALIES</h3>
            </div>
            <div className="space-y-4">
               {resources.slice(0, 5).map(res => (
                 <div key={res.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 transition-all cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <div className={`w-1 h-6 rounded-full ${res.status === 'occupied' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                     <span className="text-[10px] font-bold uppercase tracking-tighter truncate max-w-[120px] group-hover:text-blue-400 transition-colors">{res.name}</span>
                   </div>
                   <span className="text-[9px] mono text-white/20 uppercase tracking-widest">0% LOAD</span>
                 </div>
               ))}
            </div>
          </div>

          <div className={`p-8 rounded-[32px] border ${cardBg}`}>
            <h3 className="text-xs font-black uppercase tracking-widest mb-8">ATOMIC SYNC LOG</h3>
            <div className="space-y-6">
               {logs.map(log => (
                 <div key={log.id} className="border-l border-white/10 pl-4 py-1 flex flex-col gap-1 hover:border-blue-500/50 transition-colors">
                    <div className="text-[10px] font-black uppercase tracking-tighter text-white/80">{log.msg}</div>
                    <div className="flex justify-between items-center">
                       <span className="text-[8px] mono text-white/20">{log.time}</span>
                       <span className="text-[8px] mono text-blue-500 font-bold tracking-widest">{log.status}</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global State Toggles (Original Functionality Refined) */}
      <div className={`p-8 rounded-[40px] border ${cardBg} mb-12`}>
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 rounded-xl bg-blue-500 text-black">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
             </svg>
           </div>
           <h2 className="text-xl font-black uppercase tracking-[0.2em]">NODE OVERRIDE MATRIX</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {resources.map(res => (
             <div key={res.id} className="p-6 rounded-[28px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1">{res.type}</div>
                      <h3 className="text-sm font-black uppercase tracking-tight leading-none truncate max-w-[180px]">{res.name}</h3>
                   </div>
                   <div className={`w-2.5 h-2.5 rounded-full ${
                     res.status === 'available' ? 'bg-emerald-500' : 
                     res.status === 'occupied' ? 'bg-red-500' : 'bg-amber-500'
                   } shadow-[0_0_10px_currentColor]`}></div>
                </div>

                <div className="flex gap-1.5">
                   {(['available', 'occupied', 'maintenance'] as const).map((s) => (
                     <button 
                       key={s}
                       onClick={() => onStatusChange(res.id, s)}
                       className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${
                         res.status === s 
                         ? (s === 'available' ? 'bg-emerald-500 border-emerald-400 text-black' : s === 'occupied' ? 'bg-red-500 border-red-400 text-white' : 'bg-amber-500 border-amber-400 text-black')
                         : 'bg-white/5 border-white/5 text-white/20 hover:text-white/40'
                       }`}
                     >
                       {s.substring(0, 5)}
                     </button>
                   ))}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default UsageAudit;
