// 13 · Goal progress
import { Flag, TrendingUp } from 'lucide-react';
import { GOAL, TOTAL } from '../data';
import { kfmt, usd } from '../lib';
import type { Design } from '../lib';

const prog = (TOTAL / GOAL.target) * 100;          // 64.4
const proj = 74;                                    // projected position today if ahead

// a — progress bar with milestones + projected marker
function A() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-7">
      <div className="flex items-baseline justify-between mb-1">
        <div className="flex items-center gap-2"><Flag size={15} className="text-indigo-600" /><span className="text-sm font-semibold text-neutral-800">House deposit goal</span></div>
        <span className="text-[11px] text-neutral-400">Target {usd(GOAL.target)} · {GOAL.dateLabel}</span>
      </div>
      <div className="flex items-baseline gap-2 mt-3">
        <span className="text-3xl font-semibold tnum">{usd(TOTAL)}</span>
        <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 font-semibold">On track · 9 months ahead</span>
      </div>
      <div className="relative mt-6 mb-2">
        <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-1000" style={{ width: `${prog}%` }} />
        </div>
        <div className="absolute -top-1.5 w-0.5 h-6 bg-emerald-500" style={{ left: `${proj}%` }}>
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] f-mono text-emerald-600 whitespace-nowrap">pace {proj}%</span>
        </div>
        {[25, 50, 75, 100].map(m => (
          <div key={m} className="absolute top-full mt-1.5" style={{ left: `${m}%`, transform: 'translateX(-50%)' }}>
            <span className="block w-px h-1.5 bg-neutral-300 mx-auto mb-0.5" />
            <span className="text-[9px] f-mono text-neutral-400">{kfmt(GOAL.target * m / 100)}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between text-[11px] text-neutral-400">
        <span>{prog.toFixed(0)}% of the way there</span>
        <span>{usd(GOAL.target - TOTAL)} to go · at {usd(GOAL.monthly)}/mo</span>
      </div>
    </div>
  );
}

// b — ring + stats
function B() {
  const r = 78, C = 2 * Math.PI * r;
  return (
    <div className="bg-[#0e1116] rounded-xl border border-[#232a35] p-7 text-white flex items-center gap-10 max-w-2xl">
      <div className="relative">
        <svg width="190" height="190" className="-rotate-90">
          <circle cx="95" cy="95" r={r} fill="none" stroke="#1c2530" strokeWidth="14" />
          <circle cx="95" cy="95" r={r} fill="none" stroke="url(#goalg)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${(prog / 100) * C} ${C}`} />
          <defs><linearGradient id="goalg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#818cf8" /></linearGradient></defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold tnum">{prog.toFixed(0)}<span className="text-lg">%</span></span>
          <span className="text-[9px] tracking-[0.3em] text-white/40 mt-1">FUNDED</span>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-[11px] uppercase tracking-widest text-white/40">Target</span>
          <span className="tnum">{usd(GOAL.target)} <span className="text-white/40 text-xs">by {GOAL.dateLabel}</span></span>
        </div>
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-[11px] uppercase tracking-widest text-white/40">Today</span>
          <span className="tnum text-sky-300">{usd(TOTAL)}</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-[11px] uppercase tracking-widest text-white/40">Projected @ target date</span>
          <span className="tnum text-emerald-400 flex items-center gap-1"><TrendingUp size={12} /> {kfmt(612000)}</span>
        </div>
        <div className="text-[11px] text-white/40">On track — even with 0 further deposits you’d land within 6% of target.</div>
      </div>
    </div>
  );
}

// c — journey timeline
function C() {
  const stops = [
    { l: 'First deposit', d: 'Feb 2023', v: '$180k', done: true },
    { l: 'Halfway', d: 'Jul 2025', v: '$275k', done: true },
    { l: 'Today', d: 'Feb 2026', v: '$354k', now: true },
    { l: 'Target', d: 'Jun 2030', v: '$550k', done: false },
  ];
  // waypoint positions are hand-tuned along the curve
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-8">
      <div className="flex items-baseline justify-between mb-8">
        <h4 className="f-display text-xl italic">The road to {usd(GOAL.target)}</h4>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8a8577]">{GOAL.dateLabel} horizon</span>
      </div>
      <div className="relative h-28 mx-4">
        <svg viewBox="0 0 340 80" className="w-full h-full overflow-visible">
          <path d="M10,60 C90,60 120,30 175,30 S280,18 330,12" fill="none" stroke="#d8d2c2" strokeWidth="2" strokeDasharray="4 5" />
          <path d="M10,60 C90,60 120,30 175,30" fill="none" stroke="#1d1a15" strokeWidth="2.5" />
          {stops.map((s, i) => {
            const px = [10, 105, 175, 330][i], py = [60, 44, 30, 12][i];
            return (
              <g key={s.l}>
                <circle cx={px} cy={py} r={s.now ? 7 : 4.5} fill={s.now ? '#0f5132' : s.done ? '#1d1a15' : '#fbfaf8'} stroke={s.now ? '#0f5132' : '#1d1a15'} strokeWidth="2" />
                {s.now && <circle cx={px} cy={py} r="12" fill="none" stroke="#0f5132" strokeOpacity=".3" strokeWidth="1.5" />}
                <text x={px} y={py - 16} fontSize="9" textAnchor="middle" fill="#1d1a15" fontWeight="600" fontFamily="JetBrains Mono">{s.v}</text>
                <text x={px} y={py + 18} fontSize="8.5" textAnchor="middle" fill="#8a8577">{s.d}</text>
                <text x={px} y={py + 28} fontSize="7.5" textAnchor="middle" fill="#b7b0a1">{s.l.toUpperCase()}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-center text-xs text-[#6e695c] mt-2">You’re at <b className="text-[#0f5132]">mile {prog.toFixed(0)} of 100</b> — required pace from here: {usd(1970)}/mo, you’re saving {usd(GOAL.monthly)}/mo.</p>
    </div>
  );
}

export const designs: Design[] = [
  { id: '13.a', vibe: 'Bar with milestones + pace needle', el: <A /> },
  { id: '13.b', vibe: 'Gradient ring + ledger stats', el: <B /> },
  { id: '13.c', vibe: 'Journey curve · waypoint map', el: <C /> },
];
