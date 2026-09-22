// 11 · Currency switch
import { useState } from 'react';
import { Check, ChevronDown, Repeat } from 'lucide-react';
import { TOTAL } from '../data';
import { num, usd } from '../lib';
import type { Design } from '../lib';

const CCYS = [
  { code: 'USD', name: 'US Dollar', rate: 1, bg: '#1e3a8a' },
  { code: 'GBP', name: 'British Pound', rate: 0.7884, bg: '#7c2d12' },
  { code: 'EUR', name: 'Euro', rate: 0.9205, bg: '#134e4a' },
  { code: 'JPY', name: 'Japanese Yen', rate: 149.32, bg: '#4c1d95' },
];

// a — classic segmented
function A() {
  const [c, setC] = useState('USD');
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 flex items-center justify-between max-w-lg">
      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">Base currency</div>
        <div className="text-xs text-neutral-500 mt-1">All figures shown in <b>{c}</b></div>
      </div>
      <div className="flex bg-neutral-100 rounded-full p-1">
        {CCYS.slice(0, 3).map(x => (
          <button key={x.code} onClick={() => setC(x.code)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${c === x.code ? 'bg-neutral-900 text-white shadow' : 'text-neutral-500 hover:text-neutral-900'}`}>{x.code}</button>
        ))}
      </div>
    </div>
  );
}

// b — dropdown with code tiles and live total
function B() {
  const [c, setC] = useState(CCYS[0]);
  const [open, setOpen] = useState(true);
  const conv = TOTAL * c.rate;
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-6 max-w-lg flex items-center justify-between gap-6">
      <div>
        <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a8577]">Viewing in</div>
        <div className="f-display text-3xl mt-1 tnum">{c.code === 'JPY' ? '¥' : c.code === 'EUR' ? '€' : c.code === 'GBP' ? '£' : '$'}{num(conv, 0)}</div>
        <div className="text-[10px] f-mono text-[#8a8577] mt-1">@ {num(c.rate, 4)} · ECB 20 FEB</div>
      </div>
      <div className="relative">
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 bg-[#1d1a15] text-[#f6f2ea] rounded-lg pl-3 pr-3.5 py-2.5 text-xs font-semibold">
          <span className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-bold text-white" style={{ background: c.bg }}>{c.code}</span>
          {c.name} <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-neutral-200 shadow-2xl p-1.5 z-20">
            {CCYS.map(x => (
              <button key={x.code} onClick={() => { setC(x); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-50">
                <span className="w-7 h-7 rounded flex items-center justify-center text-[8px] font-bold text-white" style={{ background: x.bg }}>{x.code}</span>
                <span className="text-xs font-medium flex-1 text-left">{x.name}</span>
                <span className="text-[10px] f-mono text-neutral-400">{x.rate === 1 ? 'BASE' : '×' + x.rate}</span>
                {c.code === x.code && <Check size={13} className="text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// c — cycle chip with conversions tooltip
function C() {
  const [i, setI] = useState(0);
  const [hov, setHov] = useState(false);
  const c = CCYS[i];
  return (
    <div className="bg-[#0a0e14] border border-[#1c2736] rounded-lg p-5 inline-flex items-center gap-5 f-mono">
      <div className="relative">
        <button onClick={() => setI((i + 1) % CCYS.length)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          className="flex items-center gap-2 border border-[#2b3b52] hover:border-[#7cc7ff] text-[#7cc7ff] rounded-full pl-3.5 pr-2.5 py-1.5 text-xs transition-colors">
          {c.code} <Repeat size={12} />
        </button>
        {hov && (
          <div className="absolute top-full mt-2 left-0 bg-[#101826] border border-[#24395c] rounded-lg p-3 z-20 w-56 shadow-2xl">
            <div className="text-[9px] tracking-[0.25em] text-[#5c7ba1] mb-2">CLICK TO CYCLE</div>
            {CCYS.map(x => (
              <div key={x.code} className="flex justify-between text-[11px] py-1">
                <span style={{ color: x.code === c.code ? '#7cc7ff' : '#5c7ba1' }}>{x.code}</span>
                <span className="text-[#a9c3dd] tnum">{x.code === 'JPY' ? '¥' : x.code === 'EUR' ? '€' : x.code === 'GBP' ? '£' : '$'}{num(TOTAL * x.rate, 0)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="text-[9px] tracking-[0.3em] text-[#5c6f8a]">BASE CCY</div>
        <div className="text-[#d7e3f4] text-sm tnum mt-0.5">{c.code} · {num(c.rate, c.code === 'JPY' ? 2 : 4)}</div>
      </div>
      <div className="text-[9px] text-[#3d4d63]">USD {usd(TOTAL)}↔</div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '11.a', vibe: 'Segmented three-way switch', el: <A /> },
  { id: '11.b', vibe: 'Dropdown with live converted total', el: <B /> },
  { id: '11.c', vibe: 'Cycle chip · conversion tooltip', el: <C /> },
];
