// 26 · Put cash to work
import { useState } from 'react';
import { ArrowRight, Rocket, X, Zap } from 'lucide-react';
import { CASH_TOTAL } from '../data';
import { usd } from '../lib';
import type { Design } from '../lib';

// a — friendly banner with projected earnings
function A() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-7 text-white flex items-center gap-6 relative overflow-hidden">
      <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
      <span className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Rocket size={22} /></span>
      <div className="flex-1">
        <div className="text-lg font-semibold">You have {usd(CASH_TOTAL, 0)} earning 4.1% — your invested sleeve returned 12.1%.</div>
        <div className="text-sm text-emerald-100/90 mt-1">
          Deploying <b>$20,000</b> at your bond target earns ≈ <b>$882/yr</b> more than cash, before any price moves.
        </div>
      </div>
      <button className="bg-white text-emerald-700 font-semibold text-sm rounded-full px-5 py-2.5 hover:bg-emerald-50 transition-colors flex items-center gap-2 shrink-0">
        Put it to work <ArrowRight size={15} />
      </button>
    </div>
  );
}

// b — interactive amount slider calculator
function B() {
  const [amt, setAmt] = useState(20000);
  const keep = Math.max(CASH_TOTAL - amt, 0);
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-7 max-w-lg">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center"><Zap size={15} /></span>
        <div className="text-sm font-semibold text-neutral-800">Idle cash optimiser</div>
      </div>
      <p className="text-xs text-neutral-500">Drag to choose how much of your {usd(CASH_TOTAL, 0)} cash to invest.</p>
      <input type="range" min={0} max={30000} step={1000} value={amt} onChange={e => setAmt(+e.target.value)}
        className="w-full mt-5 accent-indigo-600" />
      <div className="flex justify-between text-[10px] f-mono text-neutral-400"><span>$0</span><span>{usd(CASH_TOTAL - 4000, 0)} = keep 3-mo buffer</span><span>{usd(30000, 0)}</span></div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="bg-indigo-50 rounded-lg p-3.5"><div className="text-[9px] uppercase tracking-wider text-indigo-400">Deploy</div><div className="text-lg font-semibold tnum text-indigo-700">{usd(amt, 0)}</div></div>
        <div className="bg-neutral-50 rounded-lg p-3.5"><div className="text-[9px] uppercase tracking-wider text-neutral-400">Cash left</div><div className="text-lg font-semibold tnum text-neutral-700">{usd(keep, 0)}</div></div>
        <div className="bg-emerald-50 rounded-lg p-3.5"><div className="text-[9px] uppercase tracking-wider text-emerald-500">Est. +yr</div><div className="text-lg font-semibold tnum text-emerald-700">+{usd(amt * 0.044, 0)}</div></div>
      </div>
      <div className="text-[10px] text-neutral-400 mt-3">Assumes 7.0% equity return vs 4.13% sweep → +4.4%/yr if routed to your 60/40 mix. <b>BND</b> fills your biggest target gap.</div>
      <button className="mt-5 w-full bg-neutral-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-neutral-700 transition-colors">Stage {usd(amt, 0)} into BND</button>
    </div>
  );
}

// c — urgent alert card with opportunity-cost ticker
function C() {
  const [show, setShow] = useState(true);
  if (!show) return (
    <button onClick={() => setShow(true)} className="text-xs text-neutral-400 border border-dashed border-neutral-300 rounded-lg px-4 py-3 hover:text-neutral-600 transition-colors w-full">
      Dismissed — restore idle-cash alert
    </button>
  );
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 max-w-2xl flex gap-4">
      <span className="w-10 h-10 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 font-bold text-sm f-mono">$</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-amber-900">Cash drag: about $63/month of missed return</span>
          <button onClick={() => setShow(false)} className="text-amber-700/60 hover:text-amber-900"><X size={15} /></button>
        </div>
        <p className="text-[12px] leading-5 text-amber-800/90 mt-1">
          $34.1k sits in sweep at 4.13%. At your 5-year TWR (11.3%), the same dollars would have made
          <b> $3,273 last year</b> instead of <b>$1,410</b> — a <b className="underline decoration-amber-400 decoration-2">$63/mo gap</b>, compounding.
        </p>
        <div className="mt-3.5 flex gap-2.5">
          <button className="bg-amber-900 text-amber-50 rounded-lg px-4 py-2 text-xs font-semibold hover:bg-amber-800 transition-colors">Invest $20k now</button>
          <button className="border border-amber-400 text-amber-900 rounded-lg px-4 py-2 text-xs font-semibold hover:bg-amber-100 transition-colors">Set auto-invest $2k/mo</button>
          <button className="text-xs text-amber-800/70 underline underline-offset-2 self-center ml-1">Keep as dry powder</button>
        </div>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '26.a', vibe: 'Gradient action banner', el: <A /> },
  { id: '26.b', vibe: 'Slider optimiser calculator', el: <B /> },
  { id: '26.c', vibe: 'Cost-ticker alert card', el: <C /> },
];
