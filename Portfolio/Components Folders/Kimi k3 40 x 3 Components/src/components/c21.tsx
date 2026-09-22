// 21 · Cash view (include / exclude)
import { useState } from 'react';
import { Banknote } from 'lucide-react';
import { BY_CLASS, CASH_TOTAL, TOTAL } from '../data';
import { Donut, pc } from '../lib';
import type { Design } from '../lib';

const PALETTE = ['#4f46e5', '#0ea5e9', '#f59e0b', '#a855f7', '#94a3b8'];
const investedOnly = TOTAL - CASH_TOTAL;

// a — toggle that re-normalises the donut
function A() {
  const [cash, setCash] = useState(true);
  const rows = BY_CLASS.map(c => ({ ...c, w: cash ? c.weight : (c.name === 'Cash' ? 0 : (c.value / investedOnly) * 100) }));
  const segs = rows.filter(r => r.w > 0.01).map((r, i) => ({ label: r.name, v: r.w, c: PALETTE[BY_CLASS.findIndex(x => x.name === r.name)] ?? PALETTE[i] }));
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-semibold text-neutral-800">Asset mix</div>
        <button onClick={() => setCash(c => !c)}
          className={`flex items-center gap-2 rounded-full border pl-3 pr-1.5 py-1.5 text-xs font-semibold transition-all ${cash ? 'border-neutral-300 text-neutral-600' : 'border-indigo-600 bg-indigo-50 text-indigo-700'}`}>
          <Banknote size={13} /> Include cash
          <span className={`relative w-8 h-4.5 rounded-full transition-colors ${cash ? 'bg-neutral-300' : 'bg-indigo-600'}`} style={{ height: 18 }}>
            <span className="absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-all" style={{ left: cash ? 2 : 16 }} />
          </span>
        </button>
      </div>
      <div className="flex items-center gap-8">
        <Donut segs={segs} size={180} th={26}
          center={(s: any) => (<><span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400">{s ? s.label : cash ? 'Incl. cash' : 'Invested only'}</span>
            <span className="text-2xl font-semibold tnum">{s ? pc(s.v, 1) : '100%'}</span></>)} />
        <div className="flex-1 space-y-1.5">
          {rows.map(r => (
            <div key={r.name} className={`flex justify-between text-[11px] px-2 py-1.5 rounded-md transition-all ${r.name === 'Cash' && !cash ? 'opacity-30 line-through' : 'bg-neutral-50'}`}>
              <span className="font-medium text-neutral-700">{r.name}</span>
              <span className="tnum font-semibold">{pc(r.w, 1)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 text-[10px] text-neutral-400 text-center">{cash ? 'Weights share of total capital' : 'Weights re-normalised across invested sleeve'}</div>
    </div>
  );
}

// b — stacked bar that morphs
function B() {
  const [cash, setCash] = useState(false);
  const rows = BY_CLASS.map(c => ({ ...c, w: cash ? c.weight : (c.name === 'Cash' ? 0 : (c.value / investedOnly) * 100) }));
  return (
    <div className="bg-[#0e1116] rounded-xl border border-[#232a35] p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold">The bar, {cash ? 'cash in' : 'cash out'}</span>
        <label className="flex items-center gap-2.5 cursor-pointer text-[11px] text-white/50 select-none">
          Exclude cash
          <input type="checkbox" checked={!cash} onChange={() => setCash(c => !c)} className="accent-indigo-500 w-3.5 h-3.5" />
        </label>
      </div>
      <div className="flex h-14 rounded-xl overflow-hidden ring-1 ring-white/10">
        {rows.map((r, i) => r.w > 0.01 && (
          <div key={r.name} className="h-full relative group transition-all duration-700" style={{ width: `${r.w}%`, background: PALETTE[i] }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
              <span className="text-[10px] font-bold">{pc(r.w, 1)}</span>
              <span className="text-[8px]">{r.name}</span>
            </div>
            {r.w > 9 && <span className="absolute bottom-1.5 left-2 text-[9px] font-semibold text-white/85">{r.name}</span>}
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {rows.map((r, i) => (
          <div key={r.name} className={`text-center transition-opacity ${r.w < 0.01 ? 'opacity-25' : ''}`}>
            <div className="text-[9px] uppercase tracking-wider text-white/40">{r.name.split(' ')[0]}</div>
            <div className="text-sm font-semibold tnum" style={{ color: PALETTE[i] }}>{r.w > 0.01 ? pc(r.w, 1) : '—'}</div>
            {!cash && r.name === 'Cash' && <div className="text-[8px] text-white/30 f-mono">PARKED 9.6%</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// c — side-by-side compare with delta chips
function C() {
  const [view, setView] = useState<'with' | 'without'>('with');
  const rows = BY_CLASS.map(c => ({ ...c, w: view === 'with' ? c.weight : (c.name === 'Cash' ? 0 : (c.value / investedOnly) * 100) }));
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7 max-w-xl">
      <div className="flex border border-[#d8d2c2] rounded-lg overflow-hidden text-[11px] font-semibold w-max mb-6">
        {(['with', 'without'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 transition-colors ${view === v ? 'bg-[#1d1a15] text-[#f6f2ea]' : 'text-[#6e695c] hover:bg-[#efece4]'}`}>
            {v === 'with' ? 'Cash included' : 'Cash excluded'}
          </button>
        ))}
      </div>
      <div className="space-y-2.5">
        {rows.map((r, i) => {
          const delta = view === 'without' && r.name !== 'Cash' ? r.w - r.weight : 0;
          return (
            <div key={r.name} className="flex items-center gap-3">
              <span className="w-24 text-[11px] font-semibold text-[#1d1a15]">{r.name}</span>
              <div className="flex-1 h-[18px] bg-[#efece4] rounded relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 transition-all duration-700 rounded" style={{ width: `${r.w}%`, background: r.name === 'Cash' && view === 'without' ? 'transparent' : PALETTE[i] }} />
                {delta > 0 && <div className="absolute inset-y-0 left-0 bg-white/30 transition-all duration-700" style={{ width: `${r.weight}%` }} />}
              </div>
              <span className="w-12 text-right text-xs tnum font-semibold">{view === 'without' && r.name === 'Cash' ? '—' : pc(r.w, 1)}</span>
              {view === 'without' && r.name !== 'Cash' && (
                <span className="text-[9px] f-mono text-[#0f5132] bg-emerald-100 rounded px-1 py-0.5">{pc(delta, 1, true)}</span>
              )}
              {view === 'with' && <span className="w-9" />}
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-[10px] text-[#8a8577]">Ghost overlay shows included-weights. Excluding cash, your equity risk is <b>3 pts hotter</b> than the headline suggests.</p>
    </div>
  );
}

export const designs: Design[] = [
  { id: '21.a', vibe: 'Toggle re-normalising the donut', el: <A /> },
  { id: '21.b', vibe: 'Morphing strip + parked cash label', el: <B /> },
  { id: '21.c', vibe: 'Include/exclude with ghost deltas', el: <C /> },
];
