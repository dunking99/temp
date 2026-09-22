// 7 · Return methods (MWR vs TWR vs benchmark)
import { useState } from 'react';
import { Info } from 'lucide-react';
import { RETURNS } from '../data';
import { pc } from '../lib';
import type { Design } from '../lib';

// a — heat-mapped comparison table
function A() {
  const rows: [string, number[], string][] = [['Time-weighted (TWR)', RETURNS.twr, 'skill'], ['Money-weighted (MWR)', RETURNS.mwr, 'timing'], ['S&P 500', RETURNS.bm, 'market']];
  const max = 16;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden max-w-3xl">
      <div className="px-6 pt-5 pb-3 flex items-baseline justify-between">
        <div>
          <div className="text-sm font-semibold text-neutral-800">Returns, three ways</div>
          <div className="text-xs text-neutral-400 mt-0.5">Annualised beyond 1Y · cell shading = magnitude</div>
        </div>
        <div className="text-[10px] text-neutral-400 f-mono">DARKER = BIGGER</div>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-y border-neutral-200 bg-neutral-50 text-neutral-500">
            <th className="text-left font-semibold px-6 py-2.5">Method</th>
            {RETURNS.periods.map(p => <th key={p} className="text-right font-semibold px-3 py-2.5">{p}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, vals, tag], ri) => (
            <tr key={name} className={`border-b border-neutral-100 last:border-0 ${ri === 0 ? 'bg-indigo-50/40' : ''}`}>
              <td className="px-6 py-3 font-semibold text-neutral-700">
                {name} <span className="ml-1.5 text-[9px] f-mono text-neutral-400 uppercase">{tag}</span>
              </td>
              {vals.map((v, i) => (
                <td key={i} className="px-3 py-3 text-right tnum font-medium"
                  style={{ background: `rgba(79,70,229,${(v / max) * 0.28})`, color: v > max / 2 ? '#312e81' : '#525252' }}>
                  {pc(v, 1, true)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-3 text-[11px] text-neutral-400 bg-neutral-50 border-t border-neutral-100">
        TWR beats the trailing 5Y market by 0.7 pts/yr before fees; your deposit timing (MWR) cost ~0.5 pts.
      </div>
    </div>
  );
}

// b — grouped bar chart
function B() {
  const [hi, setHi] = useState(-1);
  const groups = RETURNS.periods.map((p, i) => ({ p, twr: RETURNS.twr[i], mwr: RETURNS.mwr[i], bm: RETURNS.bm[i] }));
  const max = 16;
  return (
    <div className="bg-[#111318] rounded-xl p-7 text-white max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm font-semibold">TWR vs MWR vs benchmark</div>
          <div className="text-[11px] text-white/40 mt-0.5">Per period, % · hover a column set</div>
        </div>
        <div className="flex gap-4 text-[10px]">
          <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block" />TWR</span>
          <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm bg-fuchsia-400 inline-block" />MWR</span>
          <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm bg-white/25 inline-block" />S&P 500</span>
        </div>
      </div>
      <div className="flex items-end gap-6 h-56 px-2">
        {groups.map((g, i) => (
          <div key={g.p} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer" onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(-1)}>
            <div className="flex items-end gap-1.5 h-44">
              {[['twr', g.twr, '#38bdf8'], ['mwr', g.mwr, '#e879f9'], ['bm', g.bm, 'rgba(255,255,255,.25)']].map(([k, v, c]) => (
                <div key={k as string} className="w-6 rounded-t relative transition-all duration-300"
                  style={{ height: `${((v as number) / max) * 100}%`, background: c as string, opacity: hi === -1 || hi === i ? 1 : 0.3 }}>
                  {hi === i && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] f-mono whitespace-nowrap" style={{ color: c as string }}>{(v as number).toFixed(1)}</span>}
                </div>
              ))}
            </div>
            <span className={`text-[10px] f-mono ${hi === i ? 'text-white' : 'text-white/40'}`}>{g.p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// c — explainer cards with benchmark ribbon
function C() {
  return (
    <div className="max-w-3xl">
      <div className="grid grid-cols-2 gap-5">
        {[
          { t: 'Time-weighted', sub: 'TWR · ignores deposit timing', v: 12.1, note: 'How well the investments themselves performed — the number to compare with funds and indices.', d: -0.3 },
          { t: 'Money-weighted', sub: 'MWR · IRR of your cashflows', v: 11.6, note: 'How well you actually did, including when you added money. Lower here = you bought some tops.', d: -0.8 },
        ].map(x => (
          <div key={x.t} className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-6">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#8a8577]">{x.sub}</div>
            <div className="mt-1 text-sm font-semibold text-[#1d1a15]">{x.t}</div>
            <div className="mt-4 flex items-end gap-3">
              <span className="f-display text-5xl tnum leading-none">{pc(x.v, 1)}</span>
              <span className="text-[10px] bg-rose-100 text-rose-700 rounded-full px-2 py-0.5 font-semibold tnum mb-1">{pc(x.d, 1)} vs S&P</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#e8e4dc] overflow-hidden">
              <div className="h-full rounded-full bg-[#1d1a15]" style={{ width: `${(x.v / 16) * 100}%` }} />
            </div>
            <p className="mt-4 text-xs leading-5 text-[#6e695c] border-t border-[#e8e4dc] pt-3">{x.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#8a8577] px-1">
        <Info size={12} /> Since inception, annualised. Benchmark: S&P 500 total return +12.4%.
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '7.a', vibe: 'Heat-mapped matrix table', el: <A /> },
  { id: '7.b', vibe: 'Grouped bars · night palette', el: <B /> },
  { id: '7.c', vibe: 'Explainer cards · benchmark ribbons', el: <C /> },
];
