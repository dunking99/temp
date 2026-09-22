// 3 · Range & benchmark controls
import { useState } from 'react';
import { Check, ChevronDown, RotateCcw, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { SERIES } from '../data';
import { linePath, scale } from '../lib';
import type { Design } from '../lib';

const RANGES = ['1M', '3M', '6M', 'YTD', '1Y', '3Y', 'ALL'] as const;
const BMS = [
  { id: 'spx', name: 'S&P 500', desc: 'US large-cap', color: '#6366f1' },
  { id: 'acwi', name: 'MSCI ACWI', desc: 'Global equities', color: '#f59e0b' },
  { id: 'b6040', name: 'Bloomberg 60/40', desc: 'Blended portfolio', color: '#10b981' },
];

// a — segmented pill + dropdown
function A() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('1Y');
  const [bm, setBm] = useState('spx');
  const [open, setOpen] = useState(false);
  const cur = BMS.find(b => b.id === bm)!;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm flex items-center gap-4 flex-wrap">
      <div className="flex bg-neutral-100 rounded-full p-1">
        {RANGES.map(r => (
          <button key={r} onClick={() => setRange(r)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${range === r ? 'bg-neutral-900 text-white shadow' : 'text-neutral-500 hover:text-neutral-900'}`}>
            {r}
          </button>
        ))}
      </div>
      <div className="h-6 w-px bg-neutral-200" />
      <div className="relative">
        <button onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2.5 border border-neutral-200 rounded-full pl-3 pr-3.5 py-2 text-xs font-semibold hover:border-neutral-400 transition-colors">
          <span className="w-2 h-2 rounded-full" style={{ background: cur.color }} />
          Compare: {cur.name}
          <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute top-full mt-2 left-0 w-60 bg-white rounded-xl border border-neutral-200 shadow-xl p-1.5 z-20">
            {BMS.map(b => (
              <button key={b.id} onClick={() => { setBm(b.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-neutral-50 text-left">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }} />
                <span className="flex-1"><span className="block text-xs font-semibold">{b.name}</span><span className="block text-[10px] text-neutral-400">{b.desc}</span></span>
                {bm === b.id && <Check size={14} className="text-emerald-600" />}
              </button>
            ))}
            <div className="border-t border-neutral-100 mt-1 pt-1">
              <button onClick={() => { setBm(''); setOpen(false); }} className="w-full px-3 py-2 rounded-lg hover:bg-neutral-50 text-left text-xs text-neutral-500">No benchmark</button>
            </div>
          </div>
        )}
      </div>
      <div className="ml-auto text-[11px] text-neutral-400 f-mono">
        RANGE={range} · BM={bm ? cur.name.toUpperCase() : 'NONE'}
      </div>
    </div>
  );
}

// b — brush timeline + benchmark chips with spark previews
function B() {
  const [win, setWin] = useState<[number, number]>([78, 156]);
  const [on, setOn] = useState<string[]>(['spx']);
  const d = SERIES.map(p => p.v);
  const min = Math.min(...d), max = Math.max(...d);
  const pts: [number, number][] = d.map((v, i) => [i * 5.55, 38 - scale(v, min, max, 0, 30)]);
  const spans: [number, number, string][] = [[104, 156, '1Y'], [52, 156, '2Y'], [0, 156, '3Y']];
  const toggle = (id: string) => setOn(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return (
    <div className="bg-[#16181d] rounded-2xl p-6 text-white">
      <div className="text-[11px] uppercase tracking-[0.25em] text-white/40 mb-4">Chart window</div>
      <div className="relative select-none">
        <svg viewBox="0 0 880 46" className="w-full">
          <path d={`${linePath(pts)} L880,46 L0,46 Z`} fill="rgba(255,255,255,.07)" />
          <rect x={win[0] * 5.55} y={0} width={(win[1] - win[0]) * 5.55} height={46} fill="rgba(99,102,241,.18)" stroke="#6366f1" strokeWidth="1" />
          {pts.filter((_, i) => i % 26 === 0).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="1.5" fill="#6366f1" />)}
        </svg>
        <div className="absolute inset-y-0 flex" style={{ left: `${(win[0] / 156) * 100}%`, width: `${((win[1] - win[0]) / 156) * 100}%` }}>
          <button aria-label="window start" className="w-2.5 h-full bg-indigo-500 rounded-l cursor-ew-resize hover:bg-indigo-400" onClick={() => setWin(([a, b]) => [Math.max(0, a - 13), b])} />
          <div className="flex-1 cursor-grab" onClick={() => setWin([78, 156])} />
          <button aria-label="window end" className="w-2.5 h-full bg-indigo-500 rounded-r cursor-ew-resize hover:bg-indigo-400" onClick={() => setWin(([a, b]) => [a, Math.min(156, b - 13)])} />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {spans.map(([a, b, l]) => (
          <button key={l} onClick={() => setWin([a, b])}
            className={`px-3 py-1 rounded-full text-[10px] font-semibold border transition-colors ${win[0] === a && win[1] === b ? 'border-indigo-400 text-indigo-300 bg-indigo-400/10' : 'border-white/15 text-white/50 hover:text-white'}`}>{l}</button>
        ))}
        <button onClick={() => setWin([0, 156])} className="ml-auto flex items-center gap-1 text-[10px] text-white/40 hover:text-white"><RotateCcw size={11} /> Reset</button>
      </div>
      <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-3 flex-wrap">
        <span className="text-[11px] uppercase tracking-[0.25em] text-white/40">Benchmarks</span>
        {BMS.map(b => (
          <button key={b.id} onClick={() => toggle(b.id)}
            className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border transition-all ${on.includes(b.id) ? 'border-white/40 bg-white/5' : 'border-white/10 opacity-45 hover:opacity-80'}`}>
            <svg width="34" height="14"><path d={`M0,10 C8,${b.id === 'spx' ? 4 : 9} 14,${b.id === 'acwi' ? 2 : 11} 20,8 S30,4 34,3`} fill="none" stroke={b.color} strokeWidth="1.5" /></svg>
            <span className="text-xs font-medium">{b.name}</span>
          </button>
        ))}
        <span className="text-[10px] text-white/35 ml-auto">{on.length} overlay{on.length === 1 ? '' : 's'} active</span>
      </div>
    </div>
  );
}

// c — compact dark toolbar with checkbox popover
function C() {
  const [range, setRange] = useState('1Y');
  const [open, setOpen] = useState(true);
  const [sel, setSel] = useState<string[]>(['spx', 'b6040']);
  const [norm, setNorm] = useState(true);
  const toggle = (id: string) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return (
    <div className="bg-[#0e1116] rounded-lg border border-[#232a35] px-4 py-2.5 flex items-center gap-2 text-[#c9d4e3] f-mono text-[11px]">
      <SlidersHorizontal size={13} className="text-[#5a6b80]" />
      <div className="flex">
        {RANGES.map((r, i) => (
          <button key={r} onClick={() => setRange(r)}
            className={`px-2.5 py-1 border-y border-[#232a35] ${i === 0 ? 'border-l rounded-l' : ''} ${i === RANGES.length - 1 ? 'border-r rounded-r' : ''} ${range === r ? 'bg-[#1c2530] text-[#7cc7ff]' : 'text-[#5a6b80] hover:text-white'}`}>{r}</button>
        ))}
      </div>
      <div className="w-px h-5 bg-[#232a35] mx-1" />
      <div className="relative">
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-[#7cc7ff] hover:text-[#a5d8ff]">
          <TrendingUp size={13} /> COMPARE ({sel.length}) <ChevronDown size={12} />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-2 w-52 bg-[#12161c] border border-[#232a35] rounded-lg shadow-2xl p-1 z-20">
            {BMS.map(b => (
              <label key={b.id} className="flex items-center gap-2 px-2.5 py-2 rounded hover:bg-[#1c2530] cursor-pointer">
                <input type="checkbox" checked={sel.includes(b.id)} onChange={() => toggle(b.id)} className="accent-[#7cc7ff]" />
                <span className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                <span className="flex-1">{b.name}</span>
                <span className="text-[#5a6b80] text-[10px]">{b.id === 'spx' ? '+15.1' : b.id === 'acwi' ? '+11.8' : '+9.2'}%</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <button onClick={() => setNorm(n => !n)} className={`ml-auto px-2 py-1 rounded border ${norm ? 'border-[#7cc7ff] text-[#7cc7ff]' : 'border-[#232a35] text-[#5a6b80]'}`}>
        {norm ? '% REBASED' : '$ ABS'}
      </button>
    </div>
  );
}

export const designs: Design[] = [
  { id: '3.a', vibe: 'Classic pill segmented + dropdown', el: <A /> },
  { id: '3.b', vibe: 'Brush window over mini-timeline', el: <B /> },
  { id: '3.c', vibe: 'Dense pro toolbar · multi-benchmark', el: <C /> },
];
