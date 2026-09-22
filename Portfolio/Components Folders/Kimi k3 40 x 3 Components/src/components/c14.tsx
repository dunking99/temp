// 14 · Allocation at a glance (with targets marked)
import { BY_CLASS, TOTAL } from '../data';
import { Donut, kfmt, pc, usd } from '../lib';
import type { Design } from '../lib';

const PALETTE = ['#4f46e5', '#0ea5e9', '#f59e0b', '#a855f7', '#94a3b8'];

// a — one stacked strip with target ticks above
function A() {
  const segs = BY_CLASS.map((c, i) => ({ ...c, c: PALETTE[i] }));
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <div className="flex items-baseline justify-between mb-6">
        <span className="text-sm font-semibold text-neutral-800">Asset allocation</span>
        <span className="text-[10px] text-neutral-400 f-mono">ACTUAL ▮ · TARGET ▼</span>
      </div>
      <div className="relative pb-2 pt-5">
        {/* target ticks */}
        <div className="absolute inset-x-0 top-0 h-5">
          {(() => { let acc = 0; return segs.map((s, i) => {
            const start = acc; acc += s.target!;
            const center = start + s.target! / 2;
            return (
              <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: `${center}%`, transform: 'translateX(-50%)' }}>
                <span className="text-[8px] f-mono text-neutral-400 leading-none mb-0.5">{s.target}%</span>
                <span className="text-neutral-500 text-[8px] leading-none">▼</span>
              </div>
            );
          }); })()}
          {/* drift separators */}
          {(() => { let acc = 0; return segs.slice(0, -1).map((s, i) => { acc += s.target!; return <span key={i} className="absolute top-0 h-5 w-px bg-neutral-300" style={{ left: `${acc}%` }} />; }); })()}
        </div>
        <div className="flex h-8 rounded-lg overflow-hidden">
          {segs.map(s => (
            <div key={s.name} className="h-full relative group cursor-pointer transition-opacity hover:opacity-80" style={{ width: `${s.weight}%`, background: s.c }}>
              <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{pc(s.weight, 1)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[10px]">
          {segs.map(s => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm" style={{ background: s.c }} />
              <span className="font-semibold text-neutral-700">{s.name}</span>
              <span className={`f-mono ${Math.sign(s.weight - s.target!) > 0 ? 'text-amber-600' : 'text-neutral-400'}`}>{pc(s.weight - s.target!, 1, true)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// b — compact donut + target delta legend
function B() {
  const segs = BY_CLASS.map((c, i) => ({ label: c.name, v: c.weight, c: PALETTE[i] }));
  return (
    <div className="bg-[#0e1116] rounded-xl border border-[#232a35] p-6 text-white flex items-center gap-8">
      <Donut segs={segs} size={168} th={24}
        center={(s: any) => (
          <>
            <span className="text-[9px] tracking-[0.25em] text-white/40">{s ? s.label.toUpperCase() : 'TOTAL'}</span>
            <span className="text-2xl font-semibold tnum mt-0.5">{s ? pc(s.v, 1) : kfmt(TOTAL)}</span>
          </>
        )} />
      <div className="flex-1 space-y-2">
        {BY_CLASS.map((c, i) => {
          const d = c.weight - c.target!;
          return (
            <div key={c.name} className="flex items-center gap-2.5 text-[11px]">
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: PALETTE[i] }} />
              <span className="w-24 text-white/70 truncate">{c.name}</span>
              <span className="tnum text-white/90">{pc(c.weight, 1)}</span>
              <span className="text-white/30">/ {c.target}%</span>
              <span className={`ml-auto f-mono text-[10px] px-1.5 py-0.5 rounded ${Math.abs(d) > 3 ? 'bg-amber-400/10 text-amber-300' : 'bg-white/5 text-white/40'}`}>{pc(d, 1, true)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// c — bullet rows with target notches (dense summary)
function C() {
  const max = 70;
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-6">
      <div className="flex justify-between items-baseline mb-4">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8a8577]">The split, at a glance</span>
        <span className="text-[10px] f-mono text-[#8a8577]">| = TARGET</span>
      </div>
      <div className="space-y-3.5">
        {BY_CLASS.map((c, i) => (
          <div key={c.name}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-semibold text-[#1d1a15]">{c.name} <span className="font-normal text-[#8a8577]">{kfmt(c.value)}</span></span>
              <span className="tnum text-[#1d1a15]">{pc(c.weight, 1)} <span className="text-[#8a8577]">→ {c.target}%</span></span>
            </div>
            <div className="relative h-[7px] bg-[#efece4] rounded-full">
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(c.weight / max) * 100}%`, background: PALETTE[i] }} />
              <div className="absolute -top-[3px] w-[2.5px] h-[13px] bg-[#1d1a15] rounded" style={{ left: `${(c.target! / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[#e8e4dc] text-[10px] text-[#8a8577]">Total {usd(TOTAL)} · fixed income needs {kfmt(35413)} more to hit target.</div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '14.a', vibe: 'Single strip · targets on a ruler', el: <A /> },
  { id: '14.b', vibe: 'Donut + delta chips ledger', el: <B /> },
  { id: '14.c', vibe: 'Bullet rows · notch markers', el: <C /> },
];
void usd;
