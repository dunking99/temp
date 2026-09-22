// 30 · Holdings table
import { Fragment, useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronRight, ListFilter } from 'lucide-react';
import { HOLDINGS, TOTAL } from '../data';
import { num, pc, signUsd, usd, Spark } from '../lib';
import type { Design } from '../lib';

type Row = { ticker: string; name: string; price: number; qty: number; avg: number; value: number; pnl: number; pnlP: number; w: number; yld: number; cls: string; account: string };
const ROWS: Row[] = HOLDINGS.map(h => {
  const value = h.qty * h.price, cost = h.qty * h.avg;
  return { ticker: h.ticker, name: h.name, price: h.price, qty: h.qty, avg: h.avg, value, pnl: value - cost, pnlP: ((value - cost) / cost) * 100, w: (value / TOTAL) * 100, yld: h.yld, cls: h.cls, account: h.account };
}).sort((a, b) => b.value - a.value);

function useSort(def: keyof Row = 'value') {
  const [k, setK] = useState<keyof Row>(def);
  const [dir, setDir] = useState<-1 | 1>(-1);
  const click = (x: keyof Row) => { if (x === k) setDir(d => (d === 1 ? -1 : 1)); else { setK(x); setDir(-1); } };
  const rows = [...ROWS].sort((a, b) => {
    const av = a[k], bv = b[k];
    return (typeof av === 'number' ? (av as number) - (bv as number) : String(av).localeCompare(String(bv))) * dir;
  });
  const arrow = (x: keyof Row) => `inline-block transition-all ${k === x ? 'opacity-100' : 'opacity-20'} ${k === x && dir === 1 ? 'rotate-180' : ''}`;
  return { rows, click, arrow };
}

// a — clean product table, weight bars
function A() {
  const { rows, click, arrow } = useSort();
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div><span className="text-sm font-semibold text-neutral-800">Holdings</span><span className="text-xs text-neutral-400 ml-2">{ROWS.length} positions · click headers to sort</span></div>
        <span className="text-[10px] f-mono text-neutral-400">USD · REALTIME-ADJ</span>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-50/70 border-b border-neutral-100">
            <th className="px-6 py-3 font-semibold cursor-pointer" onClick={() => click('ticker')}>Holding <ArrowUpDown size={10} className={arrow('ticker')} /></th>
            <th className="py-3 font-semibold text-right cursor-pointer" onClick={() => click('price')}>Price <ArrowUpDown size={10} className={arrow('price')} /></th>
            <th className="py-3 font-semibold text-right cursor-pointer" onClick={() => click('qty')}>Position <ArrowUpDown size={10} className={arrow('qty')} /></th>
            <th className="py-3 font-semibold text-right cursor-pointer" onClick={() => click('value')}>Value <ArrowUpDown size={10} className={arrow('value')} /></th>
            <th className="py-3 font-semibold text-right cursor-pointer" onClick={() => click('pnlP')}>Gain / loss <ArrowUpDown size={10} className={arrow('pnlP')} /></th>
            <th className="px-6 py-3 font-semibold cursor-pointer w-44" onClick={() => click('w')}>Portfolio share <ArrowUpDown size={10} className={arrow('w')} /></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.ticker} className="border-b border-neutral-50 last:border-0 hover:bg-indigo-50/40 transition-colors">
              <td className="px-6 py-3.5"><div className="font-bold text-neutral-900 flex items-center gap-2">{r.ticker}<span className="text-[9px] font-normal text-neutral-400 bg-neutral-100 rounded px-1 py-0.5">{r.cls}</span></div><div className="text-[11px] text-neutral-400">{r.name}</div></td>
              <td className="py-3.5 text-right tnum font-medium">{usd(r.price, 2)}</td>
              <td className="py-3.5 text-right"><div className="tnum">{r.qty} sh</div><div className="text-[10px] tnum text-neutral-400">avg {usd(r.avg, 2)}</div></td>
              <td className="py-3.5 text-right tnum font-semibold">{usd(r.value)}</td>
              <td className={`py-3.5 text-right tnum font-semibold ${r.pnl >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{signUsd(r.pnl)}<span className="block text-[10px] font-medium">{pc(r.pnlP, 1, true)}</span></td>
              <td className="px-6 py-3.5"><div className="flex items-center gap-2"><div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden"><div className="h-full rounded-full bg-neutral-800" style={{ width: `${(r.w / ROWS[0].w) * 100}%` }} /></div><span className="tnum text-neutral-500 w-10 text-right">{pc(r.w, 1)}</span></div></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-neutral-50/70 text-xs">
            <td className="px-6 py-3 font-bold text-neutral-700">Total invested</td><td /><td /><td className="py-3 text-right tnum font-bold">{usd(ROWS.reduce((s, r) => s + r.value, 0))}</td>
            <td className="py-3 text-right tnum font-bold text-emerald-600">{signUsd(ROWS.reduce((s, r) => s + r.pnl, 0))}</td>
            <td className="px-6 py-3 tnum text-neutral-500">{pc(100 * ROWS.reduce((s, r) => s + r.value, 0) / TOTAL, 1)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// b — dense terminal with expandable rows
function B() {
  const { rows, click, arrow } = useSort('pnlP');
  const [open, setOpen] = useState<string | null>('NVDA');
  return (
    <div className="bg-[#0a0e14] rounded-lg border border-[#1c2736] f-mono text-[#d7e3f4] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[#1c2736] flex justify-between items-center text-[10px] tracking-[0.25em] text-[#5c6f8a]">
        <span>POSITIONS.BLOTTER</span><span>{ROWS.length} OPEN LOTS</span>
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-[#5c6f8a] text-[9px] tracking-[0.15em]">
            <th className="px-4 py-2 w-6"></th>
            <th className="py-2 text-left font-normal cursor-pointer" onClick={() => click('ticker')}>SYM <ArrowUpDown size={9} className={arrow('ticker')} /></th>
            <th className="py-2 text-right font-normal cursor-pointer" onClick={() => click('price')}>LAST <ArrowUpDown size={9} className={arrow('price')} /></th>
            <th className="py-2 text-right font-normal cursor-pointer" onClick={() => click('qty')}>QTY@AVG <ArrowUpDown size={9} className={arrow('qty')} /></th>
            <th className="py-2 text-right font-normal cursor-pointer" onClick={() => click('value')}>MKT_VAL <ArrowUpDown size={9} className={arrow('value')} /></th>
            <th className="py-2 text-right font-normal cursor-pointer" onClick={() => click('pnl')}>UNRLZD <ArrowUpDown size={9} className={arrow('pnl')} /></th>
            <th className="px-4 py-2 text-right font-normal cursor-pointer" onClick={() => click('w')}>WT <ArrowUpDown size={9} className={arrow('w')} /></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <Fragment key={r.ticker}>
              <tr onClick={() => setOpen(open === r.ticker ? null : r.ticker)}
                className={`border-t border-[#121b25] cursor-pointer transition-colors ${open === r.ticker ? 'bg-[#101a27]' : 'hover:bg-[#0e1520]'}`}>
                <td className="px-4 py-2 text-[#3d4f68]">{open === r.ticker ? <ChevronDown size={11} /> : <ChevronRight size={11} />}</td>
                <td className="py-2 font-bold text-[#7cc7ff]">{r.ticker}</td>
                <td className="py-2 text-right tnum">{num(r.price, 2)}</td>
                <td className="py-2 text-right tnum text-[#8fa5c0]">{r.qty}@{num(r.avg, 2)}</td>
                <td className="py-2 text-right tnum">{num(r.value, 0)}</td>
                <td className={`py-2 text-right tnum ${r.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{pc(r.pnlP, 1, true)}</td>
                <td className="px-4 py-2 text-right tnum text-[#8fa5c0]">{pc(r.w, 1)}</td>
              </tr>
              {open === r.ticker && (
                <tr key={r.ticker + '-x'} className="bg-[#0d1622] border-t border-[#121b25]">
                  <td colSpan={7} className="px-10 py-3">
                    <div className="flex gap-10 text-[10px]">
                      <span className="text-[#5c6f8a]">NAME <b className="text-[#d7e3f4] font-normal">{r.name}</b></span>
                      <span className="text-[#5c6f8a]">DAY RNG <b className="text-[#d7e3f4] font-normal">{num(r.price * 0.988, 2)}–{num(r.price * 1.006, 2)}</b></span>
                      <span className="text-[#5c6f8a]">52W <b className="text-[#d7e3f4] font-normal">{num(r.avg * 0.9, 2)}–{num(r.price * 1.08, 2)}</b></span>
                      <span className="text-[#5c6f8a]">YLD <b className="text-emerald-400 font-normal">{pc(r.yld, 2)}</b></span>
                      <span className="text-[#5c6f8a]">ACCT <b className="text-[#d7e3f4] font-normal">{r.account.toUpperCase()}</b></span>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// c — position strips with avatars and sort menu
function C() {
  const [sortK, setSortK] = useState<keyof Row>('value');
  const [menu, setMenu] = useState(false);
  const rows = [...ROWS].sort((a, b) => (b[sortK] as number) - (a[sortK] as number));
  const labelOf: Record<string, string> = { value: 'Market value', pnlP: 'Return %', w: 'Weight', yld: 'Yield' };
  const hues: Record<string, string> = { VOO: '#4f46e5', MSFT: '#0ea5e9', AAPL: '#64748b', IEFA: '#0891b2', NVDA: '#16a34a', BND: '#b45309', ASML: '#dc2626', TM: '#1d4ed8', GLD: '#ca8a04', O: '#7c3aed', NVO: '#0d9488' };
  const sparkCols = ROWS.map((_, i) => 30 + ((i * 37) % 60));
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-sm font-semibold text-[#1d1a15]">{rows.length} positions</span>
        <div className="relative">
          <button onClick={() => setMenu(m => !m)} className="flex items-center gap-1.5 text-[11px] font-semibold border border-[#d8d2c2] rounded-lg px-3 py-1.5 bg-white hover:border-[#1d1a15] transition-colors">
            <ListFilter size={12} /> Sort: {labelOf[sortK]} <ChevronDown size={12} />
          </button>
          {menu && (
            <div className="absolute right-0 top-full mt-1.5 bg-white border border-neutral-200 rounded-lg shadow-xl p-1 z-20 w-44">
              {[['value'], ['pnlP'], ['w'], ['yld']].map(([k]) => (
                <button key={k} onClick={() => { setSortK(k as keyof Row); setMenu(false); }}
                  className={`w-full text-left text-xs px-3 py-2 rounded-md hover:bg-neutral-50 ${sortK === k ? 'font-bold text-[#1d1a15]' : 'text-neutral-500'}`}>{labelOf[k]}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.ticker} className="bg-white rounded-xl border border-[#e8e4dc] hover:border-[#b7b0a1] transition-colors px-4 py-3 flex items-center gap-4 group cursor-default">
            <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ background: hues[r.ticker] }}>{r.ticker.slice(0, 2)}</span>
            <div className="w-40">
              <div className="text-[13px] font-bold text-[#1d1a15]">{r.ticker}</div>
              <div className="text-[10px] text-[#8a8577] truncate">{r.name}</div>
            </div>
            <Spark d={sparkCols.map(s => r.avg * (1 + (s - 45) / 30))} w={70} h={22} c={r.pnl >= 0 ? '#0f5132' : '#b4463a'} />
            <div className="w-28 text-right">
              <div className="text-[10px] text-[#8a8577]">{r.qty} @ {num(r.avg, 2)}</div>
              <div className="text-[11px] tnum font-semibold text-[#1d1a15]">now {usd(r.price, 2)}</div>
            </div>
            <div className="w-24 text-right">
              <div className="text-[13px] font-bold tnum">{usd(r.value)}</div>
              <div className="text-[10px] f-mono text-[#8a8577]">{pc(r.w, 1)} of book</div>
            </div>
            <span className={`ml-auto text-[11px] font-bold rounded-full px-2.5 py-1 tnum ${r.pnl >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>{pc(r.pnlP, 1, true)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '30.a', vibe: 'Clean product ledger · weight bars', el: <A /> },
  { id: '30.b', vibe: 'Terminal blotter · expandable lots', el: <B /> },
  { id: '30.c', vibe: 'Position strips · sort menu', el: <C /> },
];
