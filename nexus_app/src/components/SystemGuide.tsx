import React, { useEffect, useMemo, useRef, useState } from 'react';

type GuideData = {
  directive: string;
  architecture: Array<{ id: string; title: string; description: string }>;
  roadmap: Array<{ label: string; detail: string }>;
  impact: Array<{ metric: string; before: string; after: string; delta: string }>;
};

interface SystemGuideProps {
  isDarkMode: boolean;
  guide: GuideData;
}

const guideCapabilities = [
  {
    title: 'NO AUTO-BOOKING',
    description: 'AI does not book resources independently.',
  },
  {
    title: 'GUIDED ADVICE',
    description: 'Generates space recommendations based on capacity.',
  },
  {
    title: 'CONFLICT ANALYSIS',
    description: 'AI predicts and prevents scheduling collisions.',
  },
  {
    title: 'OPERATIONAL INTEL',
    description: 'Synthesizes logs for admin oversight.',
  },
];

const demoStates = ['initial', 'detect', 'resolve'] as const;

const SystemGuide: React.FC<SystemGuideProps> = ({ isDarkMode, guide }) => {
  const [phase, setPhase] = useState<(typeof demoStates)[number]>('initial');
  const timerRef = useRef<number | null>(null);

  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-white/45' : 'text-slate-500';
  const cardBg = isDarkMode
    ? 'bg-[#0a0f22]/82 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.26)]'
    : 'bg-white border-slate-200 shadow-sm';

  const architectureItems = useMemo(() => guide.architecture || [], [guide.architecture]);

  const cycleDemo = () => {
    window.clearTimeout(timerRef.current || undefined);
    setPhase('initial');

    timerRef.current = window.setTimeout(() => {
      setPhase('detect');
      timerRef.current = window.setTimeout(() => {
        setPhase('resolve');
        timerRef.current = window.setTimeout(() => {
          setPhase('initial');
        }, 1800);
      }, 1800);
    }, 1400);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1520px] px-4 pb-16 pt-6 md:px-0">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-[2.6rem]">
          NEXUS System Guide
        </h2>
        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
          Technical directive // core objective
        </p>
      </div>

      <section className={`rounded-[34px] border p-6 md:p-8 ${cardBg}`}>
        <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em] text-blue-300">
          Technical directive // core objective
        </div>
        <p className={`mt-5 max-w-[1100px] text-sm leading-7 ${textSecondary}`}>
          {guide.directive}
        </p>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="text-lg text-blue-300">◈</span>
          <h3 className="text-2xl font-black uppercase tracking-[0.08em] text-white">
            System architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {architectureItems.map(item => (
            <article key={item.id} className={`rounded-[30px] border p-7 ${cardBg}`}>
              <div className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-blue-300">
                {item.title}
              </div>
              <p className={`max-w-[460px] text-sm leading-7 ${textSecondary}`}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className={`mt-8 rounded-[34px] border p-6 md:p-8 ${cardBg}`}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-300">
              Conflict resolution demo
            </div>
            <h3 className="mt-3 text-2xl font-black uppercase tracking-[0.08em] text-white">
              Simulated intervention sequence
            </h3>
          </div>
          <button
            onClick={cycleDemo}
            className="rounded-full border border-blue-400/25 bg-blue-600/15 px-5 py-3 text-[10px] font-black uppercase tracking-[0.24em] text-blue-200 transition-all hover:bg-blue-600/25"
          >
            Run demo
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <article
            className={`rounded-[28px] border p-5 transition-all ${
              phase === 'initial'
                ? 'border-blue-400/35 bg-blue-500/10'
                : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">01 Initial attempt</div>
            <div className="mt-5 rounded-[22px] border border-emerald-400/25 bg-emerald-400/8 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">
                User A (active)
              </div>
              <div className="mt-2 text-lg font-black text-white">AI/ML Lab</div>
              <div className="mt-2 text-sm text-emerald-300">10:00 → 12:00</div>
            </div>
            <div className="mt-4 rounded-[22px] border border-blue-400/20 bg-blue-400/8 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">
                User B (request)
              </div>
              <div className="mt-2 text-lg font-black text-white">AI/ML Lab</div>
              <div className="mt-2 text-sm text-blue-200">11:30 → 13:30</div>
            </div>
            <p className={`mt-4 text-sm leading-7 ${textSecondary}`}>
              User B tries to book the same room during User A’s active session.
            </p>
          </article>

          <article
            className={`rounded-[28px] border p-5 transition-all ${
              phase === 'detect'
                ? 'border-rose-400/35 bg-rose-500/10'
                : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="text-sm font-black uppercase tracking-[0.22em] text-rose-300">02 Detection</div>
            <div className="mt-6 flex justify-center">
              <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-rose-400/50 bg-rose-500/10 text-3xl text-rose-300 shadow-[0_0_28px_rgba(244,63,94,0.25)]">
                ⊗
              </div>
            </div>
            <div className="mt-5 text-center">
              <div className="text-xl font-black uppercase tracking-[0.12em] text-rose-300">
                Collision detected
              </div>
              <div className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/55">
                30-minute overlap
              </div>
            </div>
            <div className="mt-5 rounded-[22px] border border-rose-400/20 bg-rose-400/8 p-4 text-sm leading-7 text-white/70">
              AI actively blocks the request and prevents a double-booking from being confirmed.
            </div>
          </article>

          <article
            className={`rounded-[28px] border p-5 transition-all ${
              phase === 'resolve'
                ? 'border-emerald-400/35 bg-emerald-500/10'
                : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">03 Resolution</div>
            <div className="mt-5 rounded-[22px] border border-emerald-400/22 bg-emerald-400/8 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200/80">
                AI recommendation
              </div>
              <div className="mt-2 text-lg font-black text-white">Cybersecurity Center</div>
              <div className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-200">Same time</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Available</span>
              </div>
            </div>
            <div className="mt-5 rounded-[22px] border border-blue-400/18 bg-blue-500/8 p-4 text-sm leading-7 text-white/70">
              Double-booking is prevented. Facility throughput improves through optimized reassignment.
            </div>
          </article>
        </div>
      </section>

      <section className={`mt-8 rounded-[34px] border p-6 md:p-8 ${cardBg}`}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-5">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-300">
                AI operating rules
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {guideCapabilities.map(item => (
                <article
                  key={item.title}
                  className="rounded-[26px] border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className={`text-[11px] font-black uppercase tracking-[0.18em] ${textPrimary}`}>
                    {item.title}
                  </div>
                  <p className={`mt-3 text-sm leading-7 ${textSecondary}`}>{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-lg text-blue-300">◈</span>
              <h3 className="text-2xl font-black uppercase tracking-[0.08em] text-white">
                Scalability roadmap
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {guide.roadmap.map(item => (
                <article
                  key={item.label}
                  className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6"
                >
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                    {item.label}
                  </div>
                  <p className={`mt-3 text-sm leading-7 ${textSecondary}`}>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`mt-8 rounded-[34px] border p-6 md:p-8 ${cardBg}`}>
        <div className="mb-5 flex items-center gap-3">
          <span className="text-lg text-blue-300">◈</span>
          <h3 className="text-2xl font-black uppercase tracking-[0.08em] text-white">
            Impact metrics
          </h3>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-blue-400/15">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] border-b border-white/10 bg-blue-500/8 px-5 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/60">
            <span>Metric</span>
            <span>Before Nexus</span>
            <span>After Nexus</span>
            <span>Delta</span>
          </div>

          {guide.impact.map(item => (
            <div
              key={item.metric}
              className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center border-b border-white/6 bg-white/[0.02] px-5 py-5 text-sm last:border-b-0"
            >
              <span className="font-black uppercase tracking-[0.12em] text-white">{item.metric}</span>
              <span className="text-white/60">{item.before}</span>
              <span className="text-blue-200">{item.after}</span>
              <span className={`${item.delta.startsWith('+') ? 'text-emerald-300' : 'text-blue-200'} font-black`}>
                {item.delta}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SystemGuide;
