// 10 · Sync status
import { useState } from 'react';
import { Building2, Check, ChevronDown, Cloud, RefreshCw } from 'lucide-react';
import type { Design } from '../lib';

// a — minimal live dot
function A() {
  return (
    <div className="bg-white rounded-full border border-neutral-200 px-5 py-3 inline-flex items-center gap-2.5 shadow-sm">
      <span className="relative flex w-2 h-2">
        <span className="animate-ping absolute w-full h-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative rounded-full w-2 h-2 bg-emerald-500" />
      </span>
      <span className="text-xs text-neutral-600">Synced <b>12 min ago</b> · all 3 accounts connected</span>
    </div>
  );
}

// b — status pill with hover panel per account
function B() {
  const [hov, setHov] = useState(false);
  const rows = [
    ['Fidelity Brokerage', '12 min ago', true], ['Roth IRA · Fidelity', '12 min ago', true], ['Joint Savings · Marcus', '1 hr ago', true],
  ] as const;
  return (
    <div className="bg-[#0b0f14] rounded-xl border border-[#1b2530] p-6 inline-block">
      <div className="relative" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <button className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full pl-3 pr-4 py-2 text-emerald-300 text-xs font-medium">
          <Check size={13} /> Everything up to date <ChevronDown size={12} className="text-emerald-500/60" />
        </button>
        {hov && (
          <div className="absolute top-full mt-2 w-72 bg-[#10161d] border border-[#233041] rounded-xl shadow-2xl p-2 z-20">
            {rows.map(([n, t]) => (
              <div key={n} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/[.04]">
                <Building2 size={13} className="text-[#50637a]" />
                <span className="flex-1 text-xs text-white/80">{n}</span>
                <span className="text-[10px] f-mono text-emerald-400">{t}</span>
              </div>
            ))}
            <button className="mt-1 w-full flex items-center justify-center gap-1.5 text-[11px] text-sky-300 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 rounded-lg py-2 transition-colors">
              <RefreshCw size={11} /> Sync now
            </button>
          </div>
        )}
      </div>
      <div className="mt-3 text-[10px] text-[#50637a] f-mono pl-1">LAST FULL RECONCILE 06:00 UTC</div>
    </div>
  );
}

// c — toolbar icon that opens sync log
function C() {
  const [open, setOpen] = useState(true);
  const log = [
    ['08:12', 'Positions refreshed — 11 tickers', '#34d399'],
    ['08:12', 'FX rates updated (ECB)', '#34d399'],
    ['06:00', 'Nightly reconcile · 0 discrepancies', '#38bdf8'],
    ['Yesterday', 'Dividend posted: O · $82.56', '#fbbf24'],
  ];
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors shadow-sm ${open ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'}`}>
        <Cloud size={14} /> Sync <span className={`text-[10px] font-normal ${open ? 'text-white/60' : 'text-neutral-400'}`}>12m</span>
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-white rounded-xl border border-neutral-200 shadow-2xl p-3 z-20">
          <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 px-1 pb-2">Sync log · 24h</div>
          <div className="relative pl-3.5 space-y-3 before:absolute before:left-[3px] before:inset-y-1 before:w-px before:bg-neutral-200">
            {log.map(([t, m, c]) => (
              <div key={m} className="relative flex gap-3 text-xs">
                <span className="absolute -left-3.5 top-1.5 w-1.5 h-1.5 rounded-full ring-2 ring-white" style={{ background: c }} />
                <span className="f-mono text-[10px] text-neutral-400 w-14 shrink-0 pt-0.5">{t}</span>
                <span className="text-neutral-700">{m}</span>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full bg-neutral-900 text-white rounded-lg py-2 text-xs font-semibold hover:bg-neutral-700 transition-colors">Run full sync</button>
        </div>
      )}
    </div>
  );
}

export const designs: Design[] = [
  { id: '10.a', vibe: 'Pulsing live dot chip', el: <A /> },
  { id: '10.b', vibe: 'Status pill → per-account panel', el: <B /> },
  { id: '10.c', vibe: 'Toolbar button with sync log', el: <C /> },
];
