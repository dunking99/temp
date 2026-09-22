// 15 · Drift from target
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { REBAL } from '../data';
import { kfmt, pc, signUsd, usd } from '../lib';
import type { Design } from '../lib';

const PALETTE = ['#4f46e5', '#0ea5e9', '#f59e0b', '#a855f7', '#94a3b8'];

// a — diverging bars off a zero spine
function A() {
  const max = 11;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-7 max-w-2xl">
      <div className="flex justify-between items-baseline mb-6">
        <div>
          <div className="text-sm font-semibold text-neutral-800">Drift from target</div>
          <div className="text-xs text-neutral-400 mt-0.5">Percentage points over / under plan · $ amount to move in brackets</div>
        </div>
        <div className="flex gap-4 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm bg-amber-500" />Overweight</span>
          <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />Underweight</span>
        </div>
      </div>
      <div className="relative">
        <div className="absolute left-1/2 inset-y-0 w-px bg-neutral-300" />
        <div className="space-y-3">
          {REBAL.map((r, i) => {
            const d = r.actual - r.target;
            const w = Math.min(Math.abs(d) / max * 50, 50);
            return (
              <div key={r.name} className="grid grid-cols-[130px_1fr_90px] items-center gap-3 group">
                <span className="text-xs font-semibold text-neutral-700 text-right flex items-center justify-end gap-2">
                  <i className="w-2 h-2 rounded-sm" style={{ background: PALETTE[i] }} />{r.name}
                </span>
                <div className="relative h-7">
                  <div className="absolute top-1/2 -translate-y-1/2 h-7 rounded-md transition-all duration-500 group-hover:brightness-110"
                    style={{
                      width: `${w}%`,
                      left: d > 0 ? '50%' : `calc(50% - ${w}%)`,
                      background: d > 0 ? '#f59e0b' : '#6366f1', opacity: .85,
                    }}>
                    <span className={`absolute top-1/2 -translate-y-1/2 text-[9px] f-mono font-semibold whitespace-nowrap ${d > 0 ? '-left-1 -translate-x-full pr-1 text-amber-600' : '-right-1 translate-x-full pl-1 text-indigo-600'}`}>
                      {pc(d, 1, true)}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] f-mono text-neutral-400">{d > 0 ? 'move out' : 'move in'} {kfmt(Math.abs(r.move))}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// b — rows: actual bar + target rail + action
function B() {
  return (
    <div className="bg-[#0e1116] rounded-xl border border-[#232a35] p-6 text-white max-w-2xl">
      <div className="flex justify-between mb-5">
        <span className="text-sm font-semibold">How far off are you?</span>
        <span className="text-[10px] f-mono text-amber-300 border border-amber-400/30 bg-amber-400/10 rounded-full px-2.5 py-1">DRIFT 12.9 PTS — REBALANCE SUGGESTED</span>
      </div>
      <div className="space-y-4">
        {REBAL.map((r, i) => {
          const d = r.actual - r.target;
          const over = d > 0;
          return (
            <div key={r.name} className="group">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-white/80 font-medium">{r.name}</span>
                <span className="f-mono text-white/40">{pc(r.actual, 1)} <span className="text-white/25">/</span> {r.target}%</span>
              </div>
              <div className="relative h-5 bg-white/5 rounded overflow-visible">
                <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${r.actual / 70 * 100}%`, background: PALETTE[i], opacity: .9 }} />
                <div className="absolute inset-y-[-4px] w-[3px] bg-white rounded" style={{ left: `calc(${r.target / 70 * 100}% - 1.5px)` }} />
                <span className="absolute inset-y-0 flex items-center text-[9px] f-mono px-1.5 font-bold"
                  style={{ left: `calc(${Math.min(r.actual, r.target) / 70 * 100}% + 4px)`, color: over ? '#fbbf24' : '#93c5fd', background: 'rgba(255,255,255,.06)' }}>
                  {over ? '+' : ''}{(r.actual - r.target).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-white/35">
                {over ? <ArrowLeft size={10} className="text-amber-400" /> : <ArrowRight size={10} className="text-sky-400" />}
                {over ? `Sell ${signUsd(-r.move)} → redeploy` : `Buy ${signUsd(-r.move)} from US equity sales`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// c — lollipop: current dot vs target dot with gap ribbon
function C() {
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-8 max-w-2xl">
      <div className="flex items-baseline justify-between mb-8">
        <h4 className="f-display text-xl italic">Actual against plan</h4>
        <div className="flex gap-4 text-[10px] f-mono text-[#8a8577]"><span>● CURRENT</span><span className="text-[#b7b0a1]">○ TARGET</span></div>
      </div>
      <div className="space-y-6">
        {REBAL.map((r, i) => {
          const x = (v: number) => (v / 70) * 100;
          const over = r.actual > r.target;
          return (
            <div key={r.name} className="flex items-center gap-4">
              <span className="w-28 text-xs font-semibold text-[#1d1a15]">{r.name}</span>
              <div className="flex-1 relative h-6">
                <div className="absolute inset-x-0 top-1/2 h-px bg-[#d8d2c2]" />
                <div className="absolute top-1/2 h-[7px] rounded-full transition-all"
                  style={{ left: `${Math.min(x(r.actual), x(r.target))}%`, width: `${Math.abs(x(r.actual) - x(r.target))}%`, background: over ? 'rgba(180,70,58,.35)' : 'rgba(15,81,50,.25)', transform: 'translateY(-50%)' }} />
                <span className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-[2.5px] bg-[#fbfaf8]" style={{ left: `calc(${x(r.target)}% - 7px)`, borderColor: '#8a8577' }} />
                <span className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow" style={{ left: `calc(${x(r.actual)}% - 8px)`, background: PALETTE[i] }} />
                <span className={`absolute -top-3.5 text-[9px] f-mono font-bold ${over ? 'text-[#b4463a]' : 'text-[#0f5132]'}`} style={{ left: `${(x(r.actual) + x(r.target)) / 2}%`, transform: 'translateX(-50%)' }}>
                  {pc(r.actual - r.target, 1, true)}
                </span>
              </div>
              <span className="w-24 text-right text-[10px] f-mono text-[#8a8577]">{signUsd(-r.move).replace('-', '−')}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-7 pt-4 border-t border-[#e8e4dc] text-[10px] text-[#8a8577] text-center">Rightmost column: trade needed to return to plan ({usd(TOTAL_DISPLAY)} book)</div>
    </div>
  );
}
const TOTAL_DISPLAY = 354214;

export const designs: Design[] = [
  { id: '15.a', vibe: 'Diverging bars off a zero spine', el: <A /> },
  { id: '15.b', vibe: 'Dark drift rails · move tickets', el: <B /> },
  { id: '15.c', vibe: 'Lollipops · dot vs ring', el: <C /> },
];
