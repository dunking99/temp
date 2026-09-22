// 9 · Data freshness note
import { useState } from 'react';
import { Clock3, Info, RefreshCw, X } from 'lucide-react';
import { ASOF, FX } from '../data';
import type { Design } from '../lib';

// a — quiet inline footnote
function A() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="h-40 rounded-lg bg-neutral-50 border border-dashed border-neutral-200 flex items-center justify-center text-xs text-neutral-300 mb-4">…chart area…</div>
      <p className="flex items-center gap-1.5 text-[11px] text-neutral-400">
        <Clock3 size={11} className="shrink-0" />
        Prices as of {ASOF}. FX from ECB reference rates, 20 Feb 2026:
        <span className="f-mono text-neutral-500">EUR/USD 1.0862 · GBP/USD 1.2684 · USD/JPY 149.32</span>
      </p>
    </div>
  );
}

// b — info badge that opens a detail popover
function B() {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-[#0e141f] rounded-xl border border-[#1e2c3e] p-6">
      <div className="h-40 rounded-lg bg-[#131b29] border border-dashed border-[#22334a] flex items-center justify-center text-xs text-[#355070] mb-4">…performance chart…</div>
      <div className="relative inline-block">
        <button onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 text-[11px] f-mono text-[#7fb6d9] bg-[#16233a] hover:bg-[#1b2c48] border border-[#24395c] rounded-full px-3 py-1.5 transition-colors">
          <Info size={11} /> PRICING INFO
        </button>
        {open && (
          <div className="absolute bottom-full mb-2 left-0 w-[380px] bg-[#101826] border border-[#24395c] rounded-xl shadow-2xl p-4 z-20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-[0.25em] text-[#5c7ba1]">MARKET DATA PROVENANCE</span>
              <button onClick={() => setOpen(false)} className="text-[#5c7ba1] hover:text-white"><X size={12} /></button>
            </div>
            <table className="w-full text-[11px] f-mono text-[#a9c3dd]">
              <tbody>
                <tr className="border-b border-[#1a2942]"><td className="py-2 text-[#5c7ba1]">EQUITIES (US)</td><td className="text-right">4:00 PM ET close, 20 Feb</td></tr>
                <tr className="border-b border-[#1a2942]"><td className="py-2 text-[#5c7ba1]">ETF NAV</td><td className="text-right">SOD recalculated</td></tr>
                <tr className="border-b border-[#1a2942]"><td className="py-2 text-[#5c7ba1]">FX SOURCE</td><td className="text-right">ECB ref · 16:00 CET</td></tr>
                {FX.map(f => (
                  <tr key={f.pair} className="border-b border-[#1a2942] last:border-0">
                    <td className="py-2 text-[#5c7ba1]">{f.pair}</td>
                    <td className="text-right">{f.rate} <span className={f.chg.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>{f.chg}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// c — amber provenance banner
function C() {
  const [spin, setSpin] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden border border-amber-300/60 shadow-sm">
      <div className="bg-amber-50 px-4 py-2.5 flex items-center gap-3 flex-wrap">
        <span className="w-5 h-5 rounded bg-amber-400/90 text-amber-950 flex items-center justify-center text-[10px] font-bold">i</span>
        <span className="text-[11px] text-amber-900">Close prices · <b>{ASOF}</b> — markets are currently closed.</span>
        <span className="hidden md:flex gap-2 ml-auto">
          {FX.slice(0, 3).map(f => (
            <span key={f.pair} className="f-mono text-[10px] bg-amber-100/80 text-amber-900 rounded px-1.5 py-0.5">{f.pair} {f.rate}</span>
          ))}
        </span>
        <button onClick={() => { setSpin(true); setTimeout(() => setSpin(false), 900); }}
          className="flex items-center gap-1 text-[10px] font-semibold text-amber-900 bg-amber-200/70 hover:bg-amber-200 rounded px-2 py-1 transition-colors">
          <RefreshCw size={10} className={spin ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>
      <div className="bg-white px-4 py-3 text-[10px] text-neutral-400 f-mono">NON-US POSITIONS CONVERTED AT ECB REFERENCE RATES · INTRADAY P&L UNAVAILABLE WHILE CLOSED</div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '9.a', vibe: 'Quiet footnote under content', el: <A /> },
  { id: '9.b', vibe: 'Info badge → provenance popover', el: <B /> },
  { id: '9.c', vibe: 'Amber data banner with refresh', el: <C /> },
];
