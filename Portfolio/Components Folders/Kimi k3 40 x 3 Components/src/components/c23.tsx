// 23 · Geography
import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { pc } from '../lib';
import type { Design } from '../lib';

const GEO = [
  { name: 'United States', w: 70.4, c: '#4f46e5', note: 'VOO · 4 stocks · bonds' },
  { name: 'Europe', w: 13.3, c: '#0ea5e9', note: 'ASML · NVO · EAFE slice' },
  { name: 'Japan', w: 3.6, c: '#f43f5e', note: 'Toyota ADR' },
  { name: 'Global / other', w: 3.1, c: '#a855f7', note: 'Gold trust' },
  { name: 'Cash', w: 9.6, c: '#94a3b8', note: 'USD deposits' },
];

// a — abstract dot-grid map with hover-synced list
function A() {
  const [hov, setHov] = useState('United States');
  const dots: Record<string, string> = {};
  GEO.forEach(g => (dots[g.name] = g.c));
  // rough region cells on a 24×10 grid
  const regionAt = (x: number, y: number) => {
    if (x < 6 && y > 1 && y < 7) return 'United States';
    if (x > 10 && x < 14 && y > 1 && y < 5) return 'Europe';
    if (x > 19 && x < 23 && y > 2 && y < 6) return 'Japan';
    if (x > 15 && x < 19 && y > 6 && y < 10) return 'Global / other';
    return null;
  };
  return (
    <div className="bg-[#0b1023] rounded-2xl p-7 text-white flex gap-8 items-center">
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-indigo-200/50 mb-3">Capital map</div>
        <svg viewBox="0 0 240 100" className="w-[420px]">
          {[...Array(10)].map((_, y) => [...Array(24)].map((_, x) => {
            const rg = regionAt(x, y);
            return <circle key={x + '-' + y} cx={x * 10 + 5} cy={y * 10 + 5} r={rg ? (hov === rg ? 3.2 : 2.4) : 0.9}
              fill={rg ? dots[rg] : 'rgba(255,255,255,.12)'} opacity={rg ? (hov === rg ? 1 : 0.5) : 1} className="transition-all duration-300" />;
          }))}
        </svg>
        <div className="text-[9px] f-mono text-white/25 mt-1">DOMICILE OF UNDERLYING EXPOSURE</div>
      </div>
      <div className="flex-1 space-y-2">
        {GEO.map(g => (
          <button key={g.name} onMouseEnter={() => setHov(g.name)}
            className={`w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-left transition-all ${hov === g.name ? 'bg-white/10' : 'bg-white/[.03]'}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.c }} />
            <span className="flex-1"><span className="block text-xs font-semibold">{g.name}</span><span className="block text-[10px] text-white/40">{g.note}</span></span>
            <span className="text-sm tnum font-semibold" style={{ color: g.c }}>{pc(g.w, 1)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// b — region cards grid
function B() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {GEO.map((g, i) => (
        <div key={g.name} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default group">
          <div className="text-[9px] uppercase tracking-wider text-neutral-400">#{i + 1}</div>
          <div className="mt-1 text-xs font-semibold text-neutral-800 leading-tight">{g.name}</div>
          <div className="mt-3 text-2xl font-semibold tnum" style={{ color: g.c }}>{pc(g.w, 1)}</div>
          <div className="mt-2 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full rounded-full group-hover:brightness-110" style={{ width: `${g.w}%`, background: g.c }} />
          </div>
          <div className="mt-2 text-[9px] text-neutral-400">{g.note}</div>
        </div>
      ))}
    </div>
  );
}

// c — domicile vs revenue toggle
function C() {
  const [mode, setMode] = useState<'domicile' | 'revenue'>('domicile');
  const rev: Record<string, number> = { 'United States': 52.8, 'Europe': 18.9, 'Japan': 4.4, 'Global / other': 14.3, 'Cash': 9.6 };
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h4 className="f-display text-xl italic">Where in the world</h4>
        <button onClick={() => setMode(m => m === 'domicile' ? 'revenue' : 'domicile')}
          className="flex items-center gap-2 text-[11px] font-semibold border border-[#d8d2c2] rounded-full px-3.5 py-1.5 hover:border-[#1d1a15] transition-colors">
          <ArrowLeftRight size={12} /> {mode === 'domicile' ? 'By domicile' : 'By revenue'}
        </button>
      </div>
      <div className="space-y-3.5">
        {GEO.map(g => {
          const w = mode === 'domicile' ? g.w : rev[g.name];
          return (
            <div key={g.name}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-[#1d1a15]">{g.name}</span>
                <span className="tnum text-[#6e695c]">{pc(w, 1)}{mode === 'revenue' && Math.abs(w - g.w) > 0.5 && (
                  <em className={`ml-2 not-italic f-mono text-[9px] ${w > g.w ? 'text-[#0f5132]' : 'text-[#b4463a]'}`}>{pc(w - g.w, 1, true)} vs domicile</em>
                )}</span>
              </div>
              <div className="h-2 rounded-full bg-[#efece4] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w}%`, background: g.c }} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-[11px] text-[#8a8577] border-t border-[#e8e4dc] pt-3">
        Flipping to revenue-based exposure shows the “US book” actually earns <b>47% of its money abroad</b> — S&P multinationals doing the travelling for you.
      </p>
    </div>
  );
}

export const designs: Design[] = [
  { id: '23.a', vibe: 'Dot-grid capital map · hover sync', el: <A /> },
  { id: '23.b', vibe: 'Region card deck', el: <B /> },
  { id: '23.c', vibe: 'Domicile ⇄ revenue flip', el: <C /> },
];
