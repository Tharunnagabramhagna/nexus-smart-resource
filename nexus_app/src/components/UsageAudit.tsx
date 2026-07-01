import React, { useMemo } from 'react';
import { Resource } from '../types';

type DashboardData = {
  stats: Array<{ label: string; value: string }>;
  utilization: Array<{ category: string; percent: number }>;
  impact: { baseline: string; optimized: string; gain: string };
  anomalies: Array<{ id: string; name: string; signal: string }>;
  activityLog: Array<{ id: string; resourceName: string; timestamp: string; message: string }>;
  nodeCounts: Record<'available' | 'occupied' | 'maintenance', number>;
};

interface UsageAuditProps {
  isDarkMode: boolean;
  resources: Resource[];
  dashboard: DashboardData;
  onStatusChange: (id: string, newStatus: Resource['status']) => void;
}

const UsageAudit: React.FC<UsageAuditProps> = ({
  isDarkMode,
  resources,
  dashboard,
  onStatusChange,
}) => {
  const cardBg = isDarkMode
    ? 'bg-[#0a0f22]/80 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.26)]'
    : 'bg-white border-slate-200 shadow-sm';

  const summaryCards = useMemo(() => {
    const statsMap = Object.fromEntries(dashboard.stats.map(item => [item.label, item.value]));
    return [
      { label: 'ACTIVE NODES', value: statsMap['ACTIVE NODES'] || String(resources.length), tone: 'text-white' },
      { label: 'CONFIRMED LOADS', value: statsMap['CONFIRMED LOADS'] || String(dashboard.nodeCounts.occupied), tone: 'text-emerald-400' },
      { label: 'OPEN INCIDENTS', value: statsMap['OPEN INCIDENTS'] || String(dashboard.nodeCounts.maintenance), tone: 'text-rose-400' },
      { label: 'SYSTEM HEALTH', value: statsMap['SYSTEM HEALTH'] || '99.9%', tone: 'text-amber-300' },
    ];
  }, [dashboard, resources.length]);

  return (
    <div className="mx-auto max-w-[1520px] px-4 pb-14 pt-6 md:px-0">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-[2.6rem]">
            Command Center
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
            System node oversight • real-time propagation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
            Network
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
            Tickets
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {summaryCards.map(card => (
          <div key={card.label} className={`rounded-[26px] border p-5 ${cardBg}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              {card.label}
            </div>
            <div className={`mt-4 text-4xl font-black ${card.tone}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5 space-y-5">
          <section className={`rounded-[30px] border p-6 ${cardBg}`}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white">
                  Utilization index (%)
                </h3>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                  Live sync
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,0.8)]" />
                Live sync
              </div>
            </div>

            <div className="space-y-4">
              {dashboard.utilization.map(item => (
                <div key={item.category} className="grid grid-cols-[100px_1fr_auto] items-center gap-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/65">
                    {item.category}
                  </span>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-white/75">{item.percent}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`rounded-[30px] border p-6 ${cardBg}`}>
            <div className="mb-5">
              <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white">
                Global node override
              </h3>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                Atomic state control grid
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {resources.map(res => (
                <article
                  key={res.id}
                  className={`rounded-[26px] border p-5 transition-all ${
                    res.status === 'occupied'
                      ? 'border-rose-500/40 bg-rose-500/6'
                      : res.status === 'maintenance'
                        ? 'border-amber-400/30 bg-amber-400/6'
                        : 'border-emerald-400/20 bg-emerald-400/5'
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                        {res.category || res.type}
                      </div>
                      <h4 className="mt-2 text-lg font-black uppercase leading-tight text-white">
                        {res.name}
                      </h4>
                    </div>
                    <span
                      className={`mt-1 h-3 w-3 rounded-full ${
                        res.status === 'available'
                          ? 'bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]'
                          : res.status === 'occupied'
                            ? 'bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.9)]'
                            : 'bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.8)]'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['available', 'occupied', 'maintenance'] as const).map(state => {
                      const active = res.status === state;
                      return (
                        <button
                          key={state}
                          onClick={() => !active && onStatusChange(res.id, state)}
                          className={`rounded-2xl px-2 py-3 text-[9px] font-black uppercase tracking-[0.22em] transition-all ${
                            active
                              ? state === 'available'
                                ? 'bg-emerald-400 text-[#08120d]'
                                : state === 'occupied'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-amber-300 text-[#201400]'
                              : 'border border-white/10 bg-white/[0.03] text-white/45 hover:bg-white/[0.08] hover:text-white'
                          }`}
                        >
                          {state === 'maintenance' ? 'Maint' : state === 'occupied' ? 'Busy' : 'Avail'}
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="xl:col-span-4 space-y-5">
          <section className={`rounded-[30px] border p-6 ${cardBg}`}>
            <div className="mb-5">
              <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white">
                Impact analysis
              </h3>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                Baseline vs optimized routing
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                  Manual baseline
                </div>
                <div className="mt-4 text-4xl font-black text-white">
                  {dashboard.impact.baseline}
                </div>
              </div>
              <div className="rounded-[22px] border border-blue-500/20 bg-blue-500/10 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200/70">
                  Nexus optimized
                </div>
                <div className="mt-4 text-4xl font-black text-blue-200">
                  {dashboard.impact.optimized}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/80">
                Efficiency gain
              </div>
              <div className="mt-3 text-3xl font-black text-emerald-300">{dashboard.impact.gain}</div>
            </div>
          </section>

          <section className={`rounded-[30px] border p-6 ${cardBg}`}>
            <div className="mb-5">
              <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white">
                Atomic sync log
              </h3>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                Recent system activity
              </p>
            </div>

            <div className="space-y-3">
              {dashboard.activityLog.map(log => (
                <div
                  key={log.id}
                  className="rounded-[20px] border border-white/8 bg-white/[0.02] px-4 py-3"
                >
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-300">
                    {log.resourceName}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-white/45">
                    <span>{new Date(log.timestamp).toISOString().slice(0, 10)}</span>
                    <span className="font-black uppercase tracking-[0.18em] text-white/75">
                      {log.message}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="xl:col-span-3">
          <section className={`rounded-[30px] border p-6 ${cardBg}`}>
            <div className="mb-5">
              <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white">
                System anomalies
              </h3>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                Flagged nodes
              </p>
            </div>

            <div className="space-y-3">
              {dashboard.anomalies.map(item => (
                <div
                  key={item.id}
                  className="rounded-[20px] border border-amber-400/12 bg-amber-400/6 px-4 py-4"
                >
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">
                    {item.name}
                  </div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300/80">
                    {item.signal}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UsageAudit;
