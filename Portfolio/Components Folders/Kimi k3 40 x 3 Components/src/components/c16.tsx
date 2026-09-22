// 16 · Allocation breakdown (holding / region / sector / asset type)
import { useState } from 'react';
import { BY_CLASS, BY_HOLDING, BY_REGION, BY_SECTOR, TOTAL } from '../data';
import { Donut, kfmt, pc } from '../lib';
import type { Design } from '../lib';

const DIMS = ['Holding', 'Region', 'Sector', 'Asset type'] as const;
const dataOf = (d: (typeof DIMS)[number]) =>
  d === 'Holding' ? BY_HOLDING : d === 'Region' ? BY_REGION : d === 'Sector' ? BY_SECTOR : BY_CLASS;
const PALS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#a855f7', '#10b981', '#f43f5e', '#84cc16', '#f97316', '#64748b', '#0d9488', '#eab308', '#7c3aed'];

// a — tab switcher + ranked bar list
function A() {
  const [dim, setDim] = useState<(typeof DIMS)[number]>('Sector');
  const rows = dataOf(dim);
  const max = rows[0].weight;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-semibold text-neutral-800">Allocation breakdown</div>
        <div className="flex bg-neutral-100 rounded-lg p-1">
          {DIMS.map(d => (
            <button key={d} onClick={() => setDim(d)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${dim === d ? 'bg-white shadow text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}>{d}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={r.name} className="group flex items-center gap-3 hover:bg-neutral-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors cursor-default">
            <span className="text-[10px] f-mono text-neutral-300 w-5">{String(i + 1).padStart(2, '0')}</span>
            <span className="w-28 text-xs font-semibold text-neutral-800 truncate">{r.name}</span>
            <div className="flex-1 h-5 bg-neutral-100 rounded overflow-hidden">
              <div className="h-full transition-all duration-500" style={{ width: `${(r.weight / max) * 100}%`, background: PALS[i % PALS.length], opacity: .85 }} />
            </div>
            <span className="w-12 text-right text-xs tnum font-semibold text-neutral-700">{pc(r.weight, 1)}</span>
            <span className="w-16 text-right text-[10px] f-mono text-neutral-400">{kfmt(r.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// b — donut morphing by dimension
function B() {
  const [dim, setDim] = useState<(typeof DIMS)[number]>('Asset type');
  const rows = dataOf(dim).slice(0, 8);
  const segs = rows.map((r, i) => ({ label: r.name, v: r.weight, c: PALS[i % PALS.length] }));
  return (
    <div className="bg-[#0f1420] rounded-2xl p-7 text-white flex gap-8 items-center">
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">View by</div>
        <div className="flex flex-col gap-2">
          {DIMS.map(d => (
            <button key={d} onClick={() => setDim(d)}
              className={`text-left px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all ${dim === d ? 'border-indigo-400 bg-indigo-400/10 text-indigo-200' : 'border-white/10 text-white/45 hover:text-white'}`}>{d}</button>
          ))}
        </div>
      </div>
      <Donut segs={segs} size={220} th={30}
        center={(s: any) => (
          <>
            <span className="text-[9px] tracking-[0.3em] text-white/40">{s ? s.label.toUpperCase() : 'PORTFOLIO'}</span>
            <span className="text-3xl font-semibold tnum">{s ? pc(s.v, 1) : kfmt(TOTAL)}</span>
            <span className="text-[9px] text-white/30">{s ? kfmt(s.v / 100 * TOTAL) : dim.toUpperCase()}</span>
          </>
        )} />
      <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {segs.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.c }} />
            <span className="flex-1 truncate text-white/75">{s.label}</span>
            <span className="tnum text-white/50">{pc(s.v, 1)}</span>
            <span className="text-white/20 f-mono text-[9px]">#{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// c — chips + top-5 with "show all" expander
function C() {
  const [dim, setDim] = useState<(typeof DIMS)[number]>('Region');
  const [all, setAll] = useState(false);
  const rows = dataOf(dim);
  const shown = all ? rows : rows.slice(0, 5);
  const rest = rows.slice(5).reduce((s, r) => s + r.weight, 0);
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8a8577] mr-2">Slice by</span>
        {DIMS.map(d => (
          <button key={d} onClick={() => setDim(d)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${dim === d ? 'bg-[#1d1a15] text-[#f6f2ea] border-[#1d1a15]' : 'border-[#d8d2c2] text-[#6e695c] hover:border-[#1d1a15]'}`}>{d}</button>
        ))}
      </div>
      <div className="space-y-3">
        {shown.map((r, i) => (
          <div key={r.name} className="flex items-center gap-4 group">
            <span className="f-display text-lg w-7 text-[#b7b0a1]">{i + 1}</span>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#1d1a15]">{r.name}</span>
                <span className="tnum text-[#6e695c]">{pc(r.weight, 1)} · {kfmt(r.value)}</span>
              </div>
              <div className="h-[6px] rounded-full bg-[#efece4] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500 group-hover:brightness-110" style={{ width: `${r.weight / rows[0].weight * 100}%`, background: PALS[i % PALS.length] }} />
              </div>
            </div>
          </div>
        ))}
        {!all && rows.length > 5 && (
          <button onClick={() => setAll(true)} className="text-[11px] text-[#8a8577] hover:text-[#1d1a15] pl-11 transition-colors">
            + {rows.length - 5} more slice{rows.length - 5 > 1 ? 's' : ''} ({pc(rest, 1)}) — show all
          </button>
        )}
        {all && rows.length > 5 && (
          <button onClick={() => setAll(false)} className="text-[11px] text-[#8a8577] hover:text-[#1d1a15] pl-11 transition-colors">Collapse ↑</button>
        )}
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '16.a', vibe: 'Tabs + ranked bar sheet', el: <A /> },
  { id: '16.b', vibe: 'Morphing donut · side dimension rail', el: <B /> },
  { id: '16.c', vibe: 'Chips + top-5 with expand', el: <C /> },
];
