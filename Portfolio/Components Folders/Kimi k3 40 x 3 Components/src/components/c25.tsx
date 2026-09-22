// 25 · Cash by account (with blended rate)
import { Building2 } from 'lucide-react';
import { ACCOUNTS, BLENDED_APY, CASH_TOTAL } from '../data';
import { pc, usd } from '../lib';
import type { Design } from '../lib';

// a — account ledger rows + blended footer
function A() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-xl">
      <div className="flex justify-between items-baseline mb-5">
        <div className="text-sm font-semibold text-neutral-800">Cash by account</div>
        <span className="text-[10px] text-neutral-400">FDIC/SIPC sweep rates · Feb 2026</span>
      </div>
      <div className="space-y-2.5">
        {ACCOUNTS.map(a => (
          <div key={a.name} className="flex items-center gap-4 bg-neutral-50 hover:bg-neutral-100/70 rounded-lg px-4 py-3.5 transition-colors">
            <span className="w-9 h-9 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-500"><Building2 size={15} /></span>
            <div className="flex-1">
              <div className="text-xs font-semibold text-neutral-800">{a.name}</div>
              <div className="text-[10px] text-neutral-400">{a.type}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold tnum">{usd(a.bal, 2)}</div>
              <div className="text-[10px] text-emerald-600 font-semibold tnum">{pc(a.apy, 2)} APY</div>
            </div>
            <div className="w-16 text-right text-[10px] f-mono text-neutral-400">+{usd(a.bal * a.apy / 100 / 12, 0)}/mo</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-900 text-white px-4 py-3">
        <span className="text-[11px] font-semibold tracking-wide">Total cash · blended rate</span>
        <span className="text-sm tnum">{usd(CASH_TOTAL, 2)} <span className="text-emerald-400 font-semibold">@ {pc(BLENDED_APY, 2)}</span></span>
      </div>
    </div>
  );
}

// b — table with rate bars + weighted total row
function B() {
  const max = Math.max(...ACCOUNTS.map(a => a.apy));
  return (
    <div className="bg-[#0a0e14] rounded-lg border border-[#1c2736] f-mono text-[#d7e3f4] overflow-hidden max-w-2xl">
      <div className="px-4 py-3 border-b border-[#1c2736] flex justify-between items-center">
        <span className="text-[10px] tracking-[0.3em] text-[#5c6f8a]">CASH_POSITIONS</span>
        <span className="text-[10px] text-emerald-400">BLENDED {pc(BLENDED_APY, 2)}</span>
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-[#5c6f8a] text-left text-[9px] tracking-[0.2em]">
            <th className="px-4 py-2 font-normal">ACCOUNT</th><th className="py-2 font-normal text-right">BALANCE</th>
            <th className="py-2 font-normal">APY</th><th className="py-2 font-normal w-40"></th><th className="px-4 py-2 font-normal text-right">ANNUAL $</th>
          </tr>
        </thead>
        <tbody>
          {ACCOUNTS.map(a => (
            <tr key={a.name} className="border-t border-[#141c26] hover:bg-[#101826]">
              <td className="px-4 py-3">{a.name}</td>
              <td className="py-3 text-right tnum">{usd(a.bal, 2)}</td>
              <td className="py-3 text-emerald-400 tnum pl-0">{pc(a.apy, 2)}</td>
              <td className="py-3 px-2"><div className="h-1.5 bg-[#141c26] rounded-full overflow-hidden"><div className="h-full bg-emerald-500/70 rounded-full" style={{ width: `${(a.apy / max) * 100}%` }} /></div></td>
              <td className="px-4 py-3 text-right tnum text-[#8fa5c0]">{usd(a.bal * a.apy / 100, 0)}</td>
            </tr>
          ))}
          <tr className="border-t border-[#2b3b52] bg-[#0e1420]">
            <td className="px-4 py-3 text-[#7cc7ff]">TOTAL / BLENDED</td>
            <td className="py-3 text-right tnum font-semibold text-white">{usd(CASH_TOTAL, 2)}</td>
            <td className="py-3 text-emerald-300 font-semibold tnum">{pc(BLENDED_APY, 2)}</td>
            <td className="py-3 px-2"><div className="h-1.5 bg-[#141c26] rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(BLENDED_APY / max) * 100}%` }} /></div></td>
            <td className="px-4 py-3 text-right tnum text-emerald-300">{usd(CASH_TOTAL * BLENDED_APY / 100, 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// c — stacked share bar + blended gauge
function C() {
  const r = 52, C = Math.PI * r; // semicircle
  const maxAPY = 6;
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7 max-w-xl flex gap-8 items-center">
      <div className="flex-1">
        <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a8577] mb-4">Cash by account</div>
        <div className="flex h-9 rounded-lg overflow-hidden">
          {ACCOUNTS.map((a, i) => (
            <div key={a.name} className="h-full relative group cursor-pointer" style={{ width: `${(a.bal / CASH_TOTAL) * 100}%`, background: ['#4f46e5', '#0ea5e9', '#f59e0b'][i] }}>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-[9px] font-bold text-white">{pc(a.apy, 2)}</span></div>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {ACCOUNTS.map((a, i) => (
            <div key={a.name} className="flex justify-between text-[11px]">
              <span className="flex items-center gap-2 text-[#3d382e]"><i className="w-2 h-2 rounded-sm inline-block" style={{ background: ['#4f46e5', '#0ea5e9', '#f59e0b'][i] }} />{a.name}</span>
              <span className="tnum text-[#6e695c]">{usd(a.bal)} · <b className="text-[#1d1a15]">{pc(a.apy, 2)}</b></span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <svg width="130" height="72">
          <path d={`M13,65 A${r} ${r} 0 0 1 117,65`} fill="none" stroke="#e8e4dc" strokeWidth="9" strokeLinecap="round" />
          <path d={`M13,65 A${r} ${r} 0 0 1 117,65`} fill="none" stroke="#0f5132" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(BLENDED_APY / maxAPY) * C} ${C}`} />
        </svg>
        <div className="-mt-5 f-display text-3xl tnum">{pc(BLENDED_APY, 2)}</div>
        <div className="text-[9px] tracking-[0.2em] uppercase text-[#8a8577] mt-1">blended APY</div>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '25.a', vibe: 'Ledger rows + blended black bar', el: <A /> },
  { id: '25.b', vibe: 'Terminal table · rate columns', el: <B /> },
  { id: '25.c', vibe: 'Share bar + APY gauge', el: <C /> },
];
