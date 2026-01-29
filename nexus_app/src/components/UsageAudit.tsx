import React, { useMemo } from 'react';
import { Resource } from '../../types';

interface UsageAuditProps {
  isDarkMode: boolean;
  resources: Resource[];
  onStatusChange: (id: string, newStatus: Resource['status']) => void;
}

type AuditLog = {
  id: number;
  time: string;
  msg: string;
  status: string;
};

const UsageAudit: React.FC<UsageAuditProps> = ({
  isDarkMode,
  resources,
  onStatusChange,
}) => {
  const {
    activeNodesCount,
    occupiedCount,
    maintenanceCount,
  } = useMemo(() => {
    let occupied = 0;
    let maintenance = 0;

    for (const r of resources) {
      if (r.status === 'occupied') occupied++;
      if (r.status === 'maintenance') maintenance++;
    }

    return {
      activeNodesCount: resources.length,
      occupiedCount: occupied,
      maintenanceCount: maintenance,
    };
  }, [resources]);

  const logs: AuditLog[] = useMemo(
    () => [
      { id: 1, time: '2024-02-25 14:02:11', msg: 'NEWTON LECTURE HALL', status: 'BROADCAST_OK' },
      { id: 2, time: '2024-02-25 14:01:45', msg: 'AI/ML COMPUTING LAB', status: 'SYNC_NOMINAL' },
      { id: 3, time: '2024-02-25 13:58:22', msg: 'TESLA SEMINAR ROOM', status: 'NODE_RELEASED' },
      { id: 4, time: '2024-02-25 13:45:01', msg: 'SYSTEM_GLOBAL_OVERRIDE', status: 'INIT_AUTH' },
    ],
    []
  );

  const utilizationTimeline = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        hour: i * 2,
        value: i < 3 ? 20 : 0,
      })),
    []
  );

  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode
    ? 'bg-[#0a0a16]/80 border-white/5'
    : 'bg-white border-slate-200';

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 h-full overflow-y-auto custom-scrollbar">
      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className={`p-6 rounded-[24px] border ${cardBg}`}>
          <div className="text-[10px] uppercase text-white/30 mb-2">ACTIVE NODES</div>
          <div className="text-4xl font-black text-blue-500">{activeNodesCount}</div>
        </div>
        <div className={`p-6 rounded-[24px] border ${cardBg}`}>
          <div className="text-[10px] uppercase text-white/30 mb-2">CONFIRMED LOADS</div>
          <div className="text-4xl font-black text-emerald-500">{occupiedCount}</div>
        </div>
        <div className={`p-6 rounded-[24px] border ${cardBg}`}>
          <div className="text-[10px] uppercase text-white/30 mb-2">OPEN INCIDENTS</div>
          <div className="text-4xl font-black text-red-500">{maintenanceCount}</div>
        </div>
        <div className={`p-6 rounded-[24px] border ${cardBg}`}>
          <div className="text-[10px] uppercase text-white/30 mb-2">SYSTEM HEALTH</div>
          <div className="text-4xl font-black text-amber-500">
            99.9<span className="text-xl">%</span>
          </div>
        </div>
      </div>

      {/* UTILIZATION */}
      <div className={`p-8 rounded-[32px] border ${cardBg} mb-10`}>
        <h3 className="text-xs font-black uppercase tracking-widest mb-6">
          UTILIZATION INDEX (%)
        </h3>
        <div className="space-y-2">
          {utilizationTimeline.map(({ hour, value }) => (
            <div key={hour} className="flex items-center gap-4">
              <span className="text-[8px] mono text-white/20 w-6">{hour}h</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-700"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-[8px] mono text-white/40 w-6">{value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ATOMIC SYNC LOG */}
      <div className={`p-8 rounded-[32px] border ${cardBg} mb-10`}>
        <h3 className="text-xs font-black uppercase tracking-widest mb-6">
          ATOMIC SYNC LOG
        </h3>
        <div className="space-y-6">
          {logs.map(log => (
            <div
              key={log.id}
              className="border-l border-white/10 pl-4 hover:border-blue-500/50 transition-colors"
            >
              <div className="text-[10px] font-black uppercase text-white/80">
                {log.msg}
              </div>
              <div className="flex justify-between">
                <span className="text-[8px] mono text-white/20">{log.time}</span>
                <span className="text-[8px] mono text-blue-500 font-bold">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NODE OVERRIDE MATRIX */}
      <div className={`p-8 rounded-[40px] border ${cardBg}`}>
        <h2 className={`text-xl font-black uppercase tracking-[0.2em] mb-8 ${textPrimary}`}>
          NODE OVERRIDE MATRIX
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(res => (
            <div
              key={res.id}
              className="p-6 rounded-[28px] border border-white/5 bg-white/[0.01]"
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-sm font-black uppercase truncate">{res.name}</h3>
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    res.status === 'available'
                      ? 'bg-emerald-500'
                      : res.status === 'occupied'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`}
                />
              </div>

              <div className="flex gap-1.5">
                {(['available', 'occupied', 'maintenance'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() =>
                      res.status !== s && onStatusChange(res.id, s)
                    }
                    className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase transition-all ${
                      res.status === s
                        ? 'bg-blue-500 text-black'
                        : 'bg-white/5 text-white/30 hover:text-white'
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