// 8 · Yield (forward yield & yield on cost)
import { TrendingUp } from 'lucide-react';
import { YIELD_FWD, YIELD_COST, INCOME_FWD, MONTHLY_DIVS, TOTAL, COST_BASIS } from '../data';
import { pc, usd } from '../lib';
import type { Design } from '../lib';

// a — twin radial gauges
function Dial({ v, label, sub, c }: { v: number; label: string; sub: string; c: string }) {
  const r = 64, C = 2 * Math.PI * r;
  return (
    <div className="flex-1 flex flex-col items-center py-6">
      <div className="relative">
        <svg width="170" height="170" className="-rotate-90">
          <circle cx="85" cy="85" r={r} fill="none" stroke="#eee" strokeWidth="10" />
          <circle cx="85" cy="85" r={r} fill="none" stroke={c} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${(v / 6) * C} ${C}`} />
          {[...Array(13)].map((_, i) => {
            const a = (i / 12) * 2 * Math.PI;
            return <line key={i} x1={85 + Math.cos(a) * 76} y1={85 + Math.sin(a) * 76} x2={85 + Math.cos(a) * 80} y2={85 + Math.sin(a) * 80} stroke="#d4d4d4" strokeWidth="1" />;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tnum">{pc(v, 2)}</span>
          <span className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">of value</span>
        </div>
      </div>
      <div className="mt-3 text-sm font-semibold text-neutral-800">{label}</div>
      <div className="text-[11px] text-neutral-400">{sub}</div>
    </div>
  );
}
function A() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm max-w-2xl">
      <div className="px-6 pt-5"><div className="text-sm font-semibold text-neutral-800">Income yield</div><div className="text-xs text-neutral-400">Dividends + interest, trailing portfolio rate</div></div>
      <div className="flex divide-x divide-neutral-100">
        <Dial v={YIELD_FWD} label="Forward yield" sub="Next 12m, on today’s value" c="#4f46e5" />
        <Dial v={YIELD_COST} label="Yield on cost" sub="Next 12m, on what you paid" c="#10b981" />
      </div>
      <div className="px-6 py-3 border-t border-neutral-100 text-[11px] text-neutral-400 text-center">
        Scale 0–6% · Portfolio avg for global equities ≈ 2.0%
      </div>
    </div>
  );
}

// b — meter bars
function B() {
  const max = 4;
  const Row = ({ l, v, c, d }: { l: string; v: number; c: string; d: string }) => (
    <div className="py-4 border-b border-[#e8e4dc] last:border-0">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[12px] font-semibold text-[#1d1a15]">{l}</span>
        <span className="f-display text-2xl tnum" style={{ color: c }}>{pc(v, 2)}</span>
      </div>
      <div className="relative h-2 bg-[#efece4] rounded-full">
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${(v / max) * 100}%`, background: c }} />
        <span className="absolute -top-0.5 w-0.5 h-3 bg-[#1d1a15]/50" style={{ left: `${(YIELD_FWD / max) * 100}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[#8a8577]"><span>{d}</span><span className="f-mono">scale 0–4% · tick = fwd yield</span></div>
    </div>
  );
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7 max-w-xl">
      <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a8577] mb-2">Dividend yields</div>
      <Row l="Forward yield" v={YIELD_FWD} c="#1d1a15" d={`${usd(INCOME_FWD)} expected over next 12 months`} />
      <Row l="Yield on cost" v={YIELD_COST} c="#0f5132" d="Your patience premium: dividends vs original cost" />
    </div>
  );
}

// c — income dashboard card
function C() {
  const max = Math.max(...MONTHLY_DIVS);
  return (
    <div className="bg-[#0d1117] rounded-xl p-6 text-white max-w-xl border border-[#1e2732]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 flex items-center gap-1.5"><TrendingUp size={11} /> Projected income · 12m</div>
          <div className="mt-2 text-4xl font-semibold tnum">{usd(INCOME_FWD)}<span className="text-base text-white/40 font-normal"> /yr</span></div>
        </div>
        <div className="text-right space-y-1.5">
          <div className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/30 tnum">FWD {pc(YIELD_FWD, 2)}</div>
          <div className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 tnum">ON COST {pc(YIELD_COST, 2)}</div>
        </div>
      </div>
      <div className="mt-6 flex items-end gap-1.5 h-16">
        {MONTHLY_DIVS.map((v, i) => (
          <div key={i} className="flex-1 group relative">
            <div className="w-full rounded-sm bg-gradient-to-t from-indigo-600/40 to-indigo-400/80 group-hover:to-indigo-300 transition-colors" style={{ height: `${(v / max) * 64}px` }} />
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] f-mono text-white/0 group-hover:text-white/80 transition-colors">{usd(v)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] f-mono text-white/30 mt-1.5"><span>MAR 25</span><span>FEB 26</span></div>
      <div className="mt-5 pt-4 border-t border-white/5 flex justify-between text-[11px] text-white/50">
        <span>≈ {usd(INCOME_FWD / 12)}/mo average</span>
        <span>cost basis {usd(COST_BASIS)} · value {usd(TOTAL)}</span>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '8.a', vibe: 'Twin gauge dials', el: <A /> },
  { id: '8.b', vibe: 'Editorial meter bars', el: <B /> },
  { id: '8.c', vibe: 'Income card · payout rhythm', el: <C /> },
];
