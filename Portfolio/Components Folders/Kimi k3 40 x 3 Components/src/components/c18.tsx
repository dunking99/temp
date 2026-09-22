// 18 · Home bias
import { Compass, Globe } from 'lucide-react';
import { US_WEIGHT, INTL_WEIGHT } from '../data';
import { pc } from '../lib';
import type { Design } from '../lib';

// a — two-slice dial, home vs away
function A() {
  const r = 70, C = 2 * Math.PI * r;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-7 flex items-center gap-10 max-w-2xl">
      <div className="relative">
        <svg width="180" height="180" className="-rotate-90">
          <circle cx="90" cy="90" r={r} fill="none" stroke="#e5e7eb" strokeWidth="22" />
          <circle cx="90" cy="90" r={r} fill="none" stroke="#4f46e5" strokeWidth="22" strokeLinecap="butt"
            strokeDasharray={`${(US_WEIGHT / 100) * C} ${C}`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tnum text-indigo-700">{pc(US_WEIGHT, 1)}</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 mt-1">at home (US)</span>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-start gap-3">
          <span className="w-3 h-3 rounded-sm bg-indigo-600 mt-1" />
          <div><div className="text-sm font-semibold text-neutral-800">United States — {pc(US_WEIGHT, 1)}</div>
            <div className="text-xs text-neutral-500 mt-0.5">S&P fund, 4 growth stocks, bonds, REIT income.</div></div>
        </div>
        <div className="flex items-start gap-3">
          <span className="w-3 h-3 rounded-sm bg-neutral-300 mt-1" />
          <div><div className="text-sm font-semibold text-neutral-800">Everywhere else — {pc(INTL_WEIGHT, 1)}</div>
            <div className="text-xs text-neutral-500 mt-0.5">Europe {pc(6.1, 1)}, Japan {pc(3.6, 1)}, diversified ex-US {pc(7.2, 1)}, global gold {pc(3.1, 1)}.</div></div>
        </div>
        <div className="border-t border-neutral-100 pt-3 text-[11px] text-neutral-400">
          A US investor holding MSCI ACWI would be ~64% US — you’re <b className="text-indigo-700">6.6 pts further into home</b>.
        </div>
      </div>
    </div>
  );
}

// b — single bar with world benchmark marker
function B() {
  return (
    <div className="bg-[#0b0f14] rounded-xl border border-[#1b2530] p-7 text-white max-w-2xl">
      <div className="flex justify-between items-baseline mb-6">
        <span className="text-sm font-semibold">Domestic vs abroad</span>
        <span className="text-[10px] f-mono text-white/35">LINE = ACWI HOME WEIGHT (63.8%)</span>
      </div>
      <div className="relative pt-6">
        <div className="absolute top-0 bottom-8 w-px bg-dashed border-l border-dashed border-white/30" style={{ left: '63.8%' }}>
          <span className="absolute -top-2 -translate-x-1/2 text-[9px] f-mono text-white/50 whitespace-nowrap">WORLD 63.8%</span>
        </div>
        <div className="flex h-12 rounded-lg overflow-hidden ring-1 ring-white/10">
          <div className="flex items-center px-4 bg-gradient-to-r from-sky-500 to-blue-600 group cursor-pointer" style={{ width: `${US_WEIGHT}%` }}>
            <div><div className="text-[10px] uppercase tracking-widest text-white/70">Home · USA</div><div className="text-lg font-bold tnum">{pc(US_WEIGHT, 1)}</div></div>
          </div>
          <div className="flex items-center justify-end px-4 bg-[#1a2431] group cursor-pointer" style={{ width: `${INTL_WEIGHT}%` }}>
            <div className="text-right"><div className="text-[10px] uppercase tracking-widest text-white/50">Abroad</div><div className="text-lg font-bold tnum text-white/80">{pc(INTL_WEIGHT, 1)}</div></div>
          </div>
        </div>
        <div className="absolute w-full" style={{ top: 'calc(100% - 24px)' }}>
          <span className="absolute -translate-x-1/2 text-[9px] f-mono text-sky-300" style={{ left: '63.8%' }}>▲</span>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-white/40 leading-5">
        Your US overweight is modest — <b className="text-sky-300">+6.6 pts vs the world index</b> — mostly explained by holding your biggest winners (NVDA, MSFT) at home.
      </p>
    </div>
  );
}

// c — compass stat + international breakdown chips
function C() {
  const intl = [['Europe', 13.3], ['Japan', 3.6], ['Dev. ex-US fund', 7.2], ['Global / gold', 3.1], ['Cash (USD)', 9.6]];
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-8 max-w-2xl">
      <div className="flex items-center gap-5">
        <span className="w-14 h-14 rounded-full border-[3px] border-[#1d1a15] flex items-center justify-center"><Compass size={24} className="text-[#1d1a15]" /></span>
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a8577]">How much never leaves home</div>
          <div className="flex items-baseline gap-3">
            <span className="f-display text-5xl tnum">{pc(US_WEIGHT, 0)}</span>
            <span className="text-sm text-[#6e695c]">of the portfolio is US-domiciled exposure</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2.5 mt-7">
        {intl.map(([l, w]) => (
          <div key={l as string} className="border border-[#e8e4dc] rounded-lg p-3 hover:border-[#1d1a15] transition-colors cursor-default group">
            <div className="flex justify-center mb-1.5 text-[#b7b0a1] group-hover:text-[#1d1a15] transition-colors"><Globe size={13} /></div>
            <div className="text-center f-mono text-sm font-bold tnum">{pc(w as number, 1)}</div>
            <div className="text-center text-[9px] uppercase tracking-wider text-[#8a8577] mt-0.5">{l}</div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-[#8a8577] text-center">Mild home bias. Currency-wise it’s 75% USD once you look through the funds.</p>
    </div>
  );
}

export const designs: Design[] = [
  { id: '18.a', vibe: 'Home ring + away legend', el: <A /> },
  { id: '18.b', vibe: 'Split bar · world-index guideline', el: <B /> },
  { id: '18.c', vibe: 'Compass hero stat · abroad chips', el: <C /> },
];
