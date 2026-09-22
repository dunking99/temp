// 19 · Headline exposure
import { BY_HOLDING, BY_CLASS } from '../data';
import { kfmt, pc } from '../lib';
import type { Design } from '../lib';

const top = BY_HOLDING[0]; // VOO 36.7%

// a — giant typographic number
function A() {
  return (
    <div className="bg-[#f6f2ea] border-y-[3px] border-[#1d1a15] p-10">
      <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a8577]">Your biggest bet</div>
      <div className="mt-2 flex items-end gap-8 flex-wrap">
        <span className="f-display font-light leading-[0.85] tnum" style={{ fontSize: 150 }}>{pc(top.weight, 1)}</span>
        <div className="pb-3 max-w-xs">
          <div className="text-sm font-semibold text-[#1d1a15]">sits in one fund — VOO, the S&P 500.</div>
          <p className="text-xs text-[#6e695c] leading-5 mt-2">Deliberate or not, over a third of every dollar rides on 500 US large-caps. It’s also the cheapest thing you own (0.03%).</p>
          <div className="text-[10px] f-mono text-[#8a8577] mt-3">{kfmt(top.value)} OF {kfmt(354214)}</div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-[#1d1a15]/15 flex gap-8 text-[11px] text-[#6e695c]">
        <span>Next: <b>MSFT 10.6%</b></span><span><b>Cash 9.6%</b></span><span><b>IEFA 7.2%</b></span>
        <span className="ml-auto italic f-display">“A core with gravitational pull.”</span>
      </div>
    </div>
  );
}

// b — full-bleed slice panel
function B() {
  const us = BY_CLASS[0]; // US Equities 62.7%
  return (
    <div className="rounded-2xl overflow-hidden relative bg-[#312e81] p-10 text-white">
      <div className="absolute inset-y-0 right-0 bg-white/[.06]" style={{ left: `${us.weight}%` }} />
      <div className="absolute inset-y-0 bg-white/[.03]" style={{ left: `${us.weight}%`, width: '9.6%' }} />
      <div className="relative">
        <div className="text-[11px] uppercase tracking-[0.3em] text-indigo-200/70">Largest slice · asset class</div>
        <div className="mt-4 flex items-baseline gap-5">
          <span className="text-8xl font-semibold tnum tracking-tight">{pc(us.weight, 1)}</span>
          <span className="text-xl text-indigo-100 font-light">US equities</span>
        </div>
        <div className="mt-2 text-sm text-indigo-200/80">{kfmt(us.value)} across VOO, MSFT, AAPL and NVDA — the engine of the book.</div>
        <div className="mt-8 flex gap-2.5">
          {[['Int’l', 16.8, '#38bdf8'], ['Bonds', 5.0, '#fbbf24'], ['Alts', 5.9, '#e879f9'], ['Cash', 9.6, '#94a3b8']].map(([l, w, c]) => (
            <span key={l as string} className="flex items-center gap-1.5 text-[10px] bg-white/10 rounded-full pl-1.5 pr-2.5 py-1">
              <i className="w-2 h-2 rounded-full inline-block" style={{ background: c as string }} />{l} <b className="tnum">{w}%</b>
            </span>
          ))}
          <span className="text-[10px] text-indigo-200/50 self-center ml-2">target for US: 55% — you’re running hot by 7.7 pts</span>
        </div>
      </div>
    </div>
  );
}

// c — exploded donut slice
function C() {
  const r = 80, CIRC = 2 * Math.PI * r;
  const w = top.weight;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 flex items-center gap-10 max-w-2xl">
      <div className="relative">
        <svg width="210" height="210" className="-rotate-90">
          {[{ v: w, c: '#4f46e5', pop: true }, { v: 63.3 - 0, c: '#e5e7eb', pop: false }].map((s, i) => {
            const dash = (s.v / 100) * CIRC;
            const off = i === 0 ? 0 : dash + 4;
            return (
              <circle key={i} cx={105 + (s.pop ? Math.cos(Math.PI * (w / 100 - .5)) * 7 : 0)} cy={105 + (s.pop ? Math.sin(Math.PI * (w / 100 - .5)) * 7 : 0)} r={r}
                fill="none" stroke={s.c} strokeWidth={s.pop ? 30 : 22} strokeDasharray={`${dash - 4} ${CIRC - dash + 4}`} strokeDashoffset={-off} />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400">top holding</span>
          <span className="text-3xl font-bold tnum text-indigo-700">{pc(w, 1)}</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-[10px] tracking-[0.25em] uppercase text-neutral-400">Headline exposure</div>
        <h4 className="text-lg font-semibold text-neutral-900 mt-1.5">One in every three dollars tracks the S&P 500 via VOO.</h4>
        <div className="mt-4 space-y-1.5 text-xs text-neutral-500">
          <div className="flex justify-between border-b border-neutral-100 pb-1.5"><span>Position value</span><b className="text-neutral-800 tnum">{kfmt(top.value)}</b></div>
          <div className="flex justify-between border-b border-neutral-100 pb-1.5"><span>Vs next biggest (MSFT)</span><b className="text-neutral-800 tnum">3.5× larger</b></div>
          <div className="flex justify-between"><span>Overlap with own stocks</span><b className="text-amber-600">AAPL+MSFT+NVDA also inside</b></div>
        </div>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '19.a', vibe: 'Typographic giant · editorial footnote', el: <A /> },
  { id: '19.b', vibe: 'Full-bleed indigo slice panel', el: <B /> },
  { id: '19.c', vibe: 'Exploded top-slice donut', el: <C /> },
];
