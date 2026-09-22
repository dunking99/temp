// 22 · Currency exposure
import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { BY_CCY, TOTAL } from '../data';
import { Donut, kfmt, num, pc, usd } from '../lib';
import type { Design } from '../lib';

const CCYCOL: Record<string, string> = { USD: '#4f46e5', EUR: '#0ea5e9', JPY: '#f43f5e', GBP: '#f59e0b', DKK: '#a855f7' };

// a — rows with code tiles + hedged note
function A() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-sm font-semibold text-neutral-800">Currency exposure</div>
          <div className="text-xs text-neutral-400">Look-through basis, incl. fund holdings</div>
        </div>
        <span className="text-[10px] text-neutral-400 f-mono">UNHEDGED</span>
      </div>
      <div className="space-y-3">
        {BY_CCY.map(c => (
          <div key={c.name} className="flex items-center gap-3 group">
            <span className="w-10 h-8 rounded-md flex items-center justify-center text-[10px] font-bold text-white f-mono" style={{ background: CCYCOL[c.name] }}>{c.name}</span>
            <div className="flex-1 h-6 bg-neutral-100 rounded overflow-hidden">
              <div className="h-full transition-all duration-500 group-hover:brightness-110" style={{ width: `${c.weight}%`, background: CCYCOL[c.name], opacity: .8 }} />
            </div>
            <span className="w-14 text-right text-xs font-semibold tnum">{pc(c.weight, 1)}</span>
            <span className="w-16 text-right text-[10px] f-mono text-neutral-400">{kfmt(c.value)}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2 text-[11px] text-neutral-500">
        <ShieldCheck size={13} className="text-emerald-600" /> Non-USD exposure is unhedged — a 5% USD rally trims ≈ {usd(4429)} from the book.
      </div>
    </div>
  );
}

// b — donut centered on USD
function B() {
  const segs = BY_CCY.map(c => ({ label: c.name, v: c.weight, c: CCYCOL[c.name] }));
  return (
    <div className="bg-[#0f1420] rounded-2xl p-7 text-white flex items-center gap-9 max-w-2xl">
      <Donut segs={segs} size={210} th={32}
        center={(s: any) => (<>
          <span className="text-[9px] tracking-[0.3em] text-white/40">{s ? s.label : 'BASE CCY'}</span>
          <span className="text-3xl font-semibold tnum">{s ? pc(s.v, 1) : 'USD'}</span>
          <span className="text-[9px] text-white/30">{s ? kfmt((s.v / 100) * TOTAL) : pc(75.1, 1) + ' of book'}</span>
        </>)} />
      <div className="flex-1">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">Rarely pure: your wallet speaks 5 currencies</div>
        {segs.map(s => (
          <div key={s.label} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />
            <span className="w-10 text-xs font-bold">{s.label}</span>
            <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden"><div className="h-full" style={{ width: `${s.v * 1.25}%`, background: s.c }} /></div>
            <span className="text-xs tnum text-white/70">{pc(s.v, 1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// c — strip + FX sensitivity readouts on hover
function C() {
  const [hov, setHov] = useState<string>('USD');
  const cur = BY_CCY.find(c => c.name === hov)!;
  const sens = (cur.weight / 100) * TOTAL * 0.01;
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7">
      <div className="flex justify-between items-baseline mb-5">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8a8577]">Where the FX risk lives</span>
        <span className="text-[10px] f-mono text-[#8a8577]">HOVER A STRIPE</span>
      </div>
      <div className="flex h-16 rounded-xl overflow-hidden border border-[#e8e4dc]">
        {BY_CCY.map(c => (
          <button key={c.name} onMouseEnter={() => setHov(c.name)}
            className="h-full relative transition-all duration-300 focus:outline-none"
            style={{ width: `${c.weight}%`, background: CCYCOL[c.name], opacity: hov === c.name ? 1 : 0.65 }}>
            {c.weight > 6 && <span className="absolute inset-0 flex items-center justify-center text-white text-[11px] font-bold f-mono">{c.name}</span>}
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between">
        <div>
          <span className="f-display text-4xl tnum" style={{ color: CCYCOL[cur.name] }}>{cur.name} {pc(cur.weight, 1)}</span>
          <span className="text-sm text-[#6e695c] ml-3">≈ {kfmt((cur.weight / 100) * TOTAL)} of book</span>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-[#8a8577]">A 1% move in {cur.name}</div>
          <div className="text-lg font-semibold tnum">{cur.name === 'USD' ? '—' : `± ${usd(Math.round(sens))}`}</div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#e8e4dc] grid grid-cols-4 gap-3 text-[10px] f-mono text-[#8a8577]">
        <span>EURUSD {num(1.0862, 4)}</span><span>USDJPY {num(149.32, 2)}</span><span>GBPUSD {num(1.2684, 4)}</span><span>DKK PEGGED→EUR</span>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '22.a', vibe: 'Code-tile bars + hedge note', el: <A /> },
  { id: '22.b', vibe: 'Currency donut, USD hub', el: <B /> },
  { id: '22.c', vibe: 'Interactive stripe + FX sensitivity', el: <C /> },
];
