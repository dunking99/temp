// 27 · Rebalance helper
import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowRight, Check, ListChecks } from 'lucide-react';
import { BY_CLASS, REBAL } from '../data';
import { kfmt, pc, usd } from '../lib';
import type { Design } from '../lib';

const PALETTE = ['#4f46e5', '#0ea5e9', '#f59e0b', '#a855f7', '#94a3b8'];
export const TRADES = [
  { side: 'SELL' as const, ticker: 'VOO', name: 'Vanguard S&P 500 ETF', amt: 27192, why: 'US equities +7.7 pts over target' },
  { side: 'SELL' as const, ticker: 'GLD', name: 'SPDR Gold Shares', amt: 3205, why: 'Alternatives +0.9 pts over target' },
  { side: 'BUY' as const, ticker: 'BND', name: 'Vanguard Total Bond Mkt', amt: 35431, why: 'Bonds 10 pts under target' },
  { side: 'BUY' as const, ticker: 'IEFA', name: 'iShares Core MSCI EAFE', amt: 11325, why: 'Intl equities 3.2 pts under' },
  { side: 'USE' as const, ticker: 'CASH', name: 'Deploy idle sweep', amt: 16358, why: 'Cash 4.6 pts over target funds the buys' },
];

// a — trade ticket list
function A() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden max-w-2xl">
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-neutral-800">Back to target — suggested trades</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Brings every sleeve within 0.1 pt of plan · estimated cost $4.10 commissions + spread</div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1"><ListChecks size={11} /> 5 ORDERS</span>
      </div>
      <div>
        {TRADES.map(t => (
          <div key={t.ticker} className="flex items-center gap-4 px-6 py-3.5 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors group">
            <span className={`w-14 text-center text-[10px] font-bold rounded-md py-1.5 f-mono ${t.side === 'SELL' ? 'bg-rose-100 text-rose-700' : t.side === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>{t.side}</span>
            <span className="w-12 f-mono text-sm font-bold text-neutral-900">{t.ticker}</span>
            <div className="flex-1">
              <div className="text-[11px] text-neutral-500">{t.name}</div>
              <div className="text-[10px] text-neutral-400 italic">{t.why}</div>
            </div>
            <span className="text-sm font-semibold tnum text-neutral-900 w-20 text-right">{usd(t.amt)}</span>
            <ArrowRight size={13} className="text-neutral-200 group-hover:text-neutral-500 transition-colors" />
          </div>
        ))}
      </div>
      <div className="px-6 py-4 bg-neutral-50 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500">Net cash movement <b className="text-neutral-800 tnum">≈ $0</b> · tax-lot method: <b>HIFO (min gains)</b></span>
        <button className="bg-neutral-900 text-white text-xs font-semibold rounded-lg px-4 py-2 hover:bg-neutral-700 transition-colors">Review trades</button>
      </div>
    </div>
  );
}

// b — before → after donuts
function B() {
  const ring = (mode: 'now' | 'after') => {
    const r = 74, C = 2 * Math.PI * r;
    let acc = 0;
    return (
      <svg width="190" height="190" className="-rotate-90">
        {BY_CLASS.map((c, i) => {
          const w = mode === 'now' ? c.weight : c.target!;
          const dash = (w / 100) * C, off = acc; acc += dash;
          return <circle key={c.name} cx="95" cy="95" r={r} fill="none" stroke={PALETTE[i]} strokeWidth="22"
            strokeDasharray={`${dash - 3} ${C - dash + 3}`} strokeDashoffset={-off} />;
        })}
        <text x="95" y="90" textAnchor="middle" fontSize="11" fill="#94a3b8" transform="rotate(90 95 95)" fontWeight="600">{mode === 'now' ? 'TODAY' : 'TARGET'}</text>
        <text x="95" y="106" textAnchor="middle" fontSize="9" fill="#475569" transform="rotate(90 95 95)">{mode === 'now' ? 'drift 12.9pt' : 'drift 0.0pt'}</text>
      </svg>
    );
  };
  return (
    <div className="bg-[#0e1116] rounded-2xl p-7 text-white border border-[#232a35]">
      <div className="flex justify-between items-baseline mb-6">
        <span className="text-sm font-semibold">Rebalance preview</span>
        <span className="text-[10px] f-mono text-white/35">SIMULATED · NO ORDERS STAGED YET</span>
      </div>
      <div className="flex items-center justify-center gap-6">
        <div className="relative">{ring('now')}<div className="absolute -bottom-1 inset-x-0 text-center text-[10px] text-white/40">actual</div></div>
        <div className="flex flex-col items-center gap-2">
          <div className="space-y-1.5">
            {TRADES.map(t => (
              <div key={t.ticker} className="flex items-center gap-2 text-[10px] f-mono">
                {t.side === 'SELL' ? <ArrowUpRight size={11} className="text-rose-400" /> : t.side === 'BUY' ? <ArrowDownLeft size={11} className="text-emerald-400" /> : <ArrowRight size={11} className="text-sky-400" />}
                <span className={t.side === 'SELL' ? 'text-rose-300' : t.side === 'BUY' ? 'text-emerald-300' : 'text-sky-300'}>{t.side} {t.ticker}</span>
                <span className="text-white/40">{kfmt(t.amt)}</span>
              </div>
            ))}
          </div>
          <ArrowRight size={16} className="text-white/30 mt-1" />
        </div>
        <div className="relative">{ring('after')}<div className="absolute -bottom-1 inset-x-0 text-center text-[10px] text-emerald-400/80">after trades</div></div>
      </div>
    </div>
  );
}

// c — adjustable target table with apply bar
function C() {
  const [sel, setSel] = useState<string[]>(TRADES.map(t => t.ticker));
  const toggle = (t: string) => setSel(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  const allIn = sel.length === TRADES.length;
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl overflow-hidden max-w-2xl">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-[9px] uppercase tracking-[0.2em] text-[#8a8577] border-b-2 border-[#1d1a15]">
            <th className="px-5 py-2.5 w-8"></th><th className="py-2.5">Trade</th><th className="py-2.5 text-right">Current</th><th className="py-2.5 text-center">→</th><th className="py-2.5">Target</th><th className="px-5 py-2.5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {REBAL.map((r, i) => {
            const t = TRADES[i === 0 ? 0 : i === 1 ? 3 : i === 2 ? 2 : i === 3 ? 1 : 4];
            const on = sel.includes(t.ticker);
            return (
              <tr key={r.name} onClick={() => toggle(t.ticker)} className={`border-b border-[#e8e4dc] cursor-pointer transition-colors ${on ? 'bg-white' : 'opacity-50'}`}>
                <td className="px-5 py-3"><span className={`w-4 h-4 rounded border flex items-center justify-center ${on ? 'bg-[#1d1a15] border-[#1d1a15]' : 'border-[#b7b0a1]'}`}>{on && <Check size={10} className="text-white" />}</span></td>
                <td className="py-3">
                  <span className="font-semibold text-[#1d1a15] flex items-center gap-2"><i className="w-2 h-2 rounded-sm inline-block" style={{ background: PALETTE[i] }} />{r.name}</span>
                  <span className="text-[10px] f-mono text-[#8a8577]">{t.side} {t.ticker}</span>
                </td>
                <td className="py-3 text-right tnum text-[#8a8577]">{pc(r.actual, 1)}</td>
                <td className="py-3"><ArrowRight size={11} className="mx-auto text-[#b7b0a1]" /></td>
                <td className="py-3 tnum font-semibold">{pc(r.target, 0)}</td>
                <td className="px-5 py-3 text-right tnum font-semibold">{r.move > 0 ? '+' : '−'}{usd(Math.abs(r.move))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#1d1a15] text-[#f6f2ea]">
        <span className="text-[11px]">{sel.length} of {TRADES.length} trades selected {allIn ? '· full rebalance' : '· partial'}</span>
        <button className="bg-[#f6f2ea] text-[#1d1a15] text-xs font-bold rounded-lg px-4 py-2 hover:opacity-85 transition-opacity">
          Apply rebalance → {pc(allIn ? 0 : 6.4, 1)} drift left
        </button>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '27.a', vibe: 'Trade tickets · review flow', el: <A /> },
  { id: '27.b', vibe: 'Before ⇢ after ring preview', el: <B /> },
  { id: '27.c', vibe: 'Pick-your-trades ledger + apply', el: <C /> },
];
