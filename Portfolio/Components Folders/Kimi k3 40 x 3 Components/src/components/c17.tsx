// 17 · Chart ⇄ table (same allocation data, sortable)
import { useState } from 'react';
import { ArrowUpDown, Download, LayoutGrid, List, PieChart as PieIcon, Table2 } from 'lucide-react';
import { BY_SECTOR } from '../data';
import { Donut, kfmt, pc, usd } from '../lib';
import type { Design } from '../lib';

const PALS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#a855f7', '#10b981', '#f43f5e', '#84cc16', '#64748b'];
type K = 'name' | 'weight' | 'value' | 'count';

function useSort(init: K = 'weight') {
  const [k, setK] = useState<K>(init);
  const [dir, setDir] = useState<-1 | 1>(-1);
  const click = (x: K) => { if (x === k) setDir(d => (d === 1 ? -1 : 1)); else { setK(x); setDir(-1); } };
  const rows = [...BY_SECTOR].sort((a, b) => ((a[k] as number) > (b[k] as number) ? 1 : (a[k] as number) < (b[k] as number) ? -1 : 0) * dir * (k === 'name' ? 1 : 1));
  const sorted = k === 'name' ? [...BY_SECTOR].sort((a, b) => a.name.localeCompare(b.name) * dir) : rows;
  const arrowCls = (x: K) => `inline-block transition-transform ${k === x ? 'opacity-100' : 'opacity-25'} ${k === x && dir === 1 ? 'rotate-180' : ''}`;
  return { k, click, sorted, arrowCls };
}

// a — treemap ⇄ sortable table with icon toggle
function A() {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const { click, sorted, arrowCls } = useSort();
  const cells = [...BY_SECTOR].sort((a, b) => b.weight - a.weight);
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-semibold text-neutral-800">Sector allocation <span className="text-neutral-400 font-normal">· {cells.length} groups</span></div>
        <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
          {([['chart', LayoutGrid], ['table', Table2]] as const).map(([v, I]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-2 transition-colors ${view === v ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-400 hover:text-neutral-800'}`}>
              <I size={14} />
            </button>
          ))}
        </div>
      </div>
      {view === 'chart' ? (
        <div className="flex flex-wrap gap-1.5">
          {cells.map((s, i) => (
            <div key={s.name} className="group relative rounded-lg cursor-pointer transition-transform hover:scale-[.985]"
              style={{ width: `calc(${Math.max(s.weight, 7.5)}% - 6px)`, flexGrow: s.weight, height: [0, 1].includes(i) ? 130 : 96, background: PALS[i % PALS.length] }}>
              <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
                <span className={`font-semibold ${i < 2 ? 'text-sm' : 'text-[11px]'} leading-tight`}>{s.name}</span>
                <div className={`${i < 2 ? 'text-lg' : 'text-xs'} font-bold tnum`}>{pc(s.weight, 1)}</div>
              </div>
              <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block bg-neutral-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-10">
                {usd(s.value)} · {s.count} holding{s.count! > 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
              {([['name', 'Sector'], ['weight', 'Weight'], ['value', 'Value'], ['count', 'Holdings']] as [K, string][]).map(([kk, l]) => (
                <th key={kk} onClick={() => click(kk)} className="py-2.5 pr-4 font-semibold cursor-pointer select-none hover:text-neutral-700">
                  {l} <ArrowUpDown size={10} className={arrowCls(kk)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={s.name} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="py-2.5 font-semibold text-neutral-800 flex items-center gap-2"><i className="w-2 h-2 rounded-sm inline-block" style={{ background: PALS[cells.findIndex(c => c.name === s.name) % PALS.length] }} />{s.name}</td>
                <td className="py-2.5 tnum">{pc(s.weight, 1)}</td>
                <td className="py-2.5 tnum">{usd(s.value)}</td>
                <td className="py-2.5 tnum text-neutral-400">{s.count}</td>
                {i === -1 && <td />}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// b — chart/table segmented, donut vs zebra
function B() {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const { click, sorted, arrowCls } = useSort();
  const segs = BY_SECTOR.map((s, i) => ({ label: s.name, v: s.weight, c: PALS[i % PALS.length] }));
  return (
    <div className="bg-[#101318] rounded-xl p-6 text-white border border-[#232a35]">
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-semibold">Sectors — {view === 'chart' ? 'visual' : 'raw numbers'}</div>
        <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
          {([['chart', 'Chart', PieIcon], ['table', 'Table', List]] as const).map(([v, l, I]) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${view === v ? 'bg-white text-neutral-900' : 'text-white/50 hover:text-white'}`}>
              <I size={12} />{l}
            </button>
          ))}
        </div>
      </div>
      {view === 'chart' ? (
        <div className="flex items-center gap-8">
          <Donut segs={segs} size={200} th={28} center={(s: any) => (
            <><span className="text-[9px] tracking-[0.25em] text-white/40">{s ? s.label.toUpperCase() : 'SECTORS'}</span>
            <span className="text-2xl font-semibold tnum">{s ? pc(s.v, 1) : '100%'}</span></>
          )} />
          <div className="flex-1 grid grid-cols-2 gap-2">
            {segs.map(s => (
              <div key={s.label} className="flex items-center gap-2 text-[11px] bg-white/[.04] rounded-lg px-3 py-2">
                <span className="w-2 h-2 rounded-sm" style={{ background: s.c }} />
                <span className="flex-1 truncate text-white/70">{s.label}</span>
                <span className="tnum text-white/40">{pc(s.v, 1)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-white/40 border-b border-white/10">
                {([['name', 'Sector'], ['weight', 'Wt %'], ['value', 'Value'], ['count', '#']] as [K, string][]).map(([kk, l]) => (
                  <th key={kk} onClick={() => click(kk)} className="py-2.5 font-semibold cursor-pointer hover:text-white">{l} <ArrowUpDown size={10} className={arrowCls(kk)} /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr key={s.name} className={`border-b border-white/5 ${i % 2 ? 'bg-white/[.03]' : ''}`}>
                  <td className="py-2.5 pl-2 font-medium text-white/85">{s.name}</td>
                  <td className="py-2.5 tnum text-sky-300">{pc(s.weight, 1)}</td>
                  <td className="py-2.5 tnum text-white/60">{usd(s.value)}</td>
                  <td className="py-2.5 tnum text-white/40">{s.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex justify-end">
            <button className="flex items-center gap-1.5 text-[10px] f-mono text-white/40 hover:text-white border border-white/10 rounded px-2 py-1"><Download size={11} /> CSV</button>
          </div>
        </div>
      )}
    </div>
  );
}

// c — pill switch above the fold, bars vs dense table
function C() {
  const [view, setView] = useState<'chart' | 'table'>('table');
  const { click, sorted, arrowCls } = useSort();
  const max = BY_SECTOR[0].weight;
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7">
      <div className="flex items-baseline justify-between mb-6">
        <h4 className="f-display text-xl italic">Sectors, two ways</h4>
        <div className="flex border border-[#d8d2c2] rounded-full overflow-hidden text-[11px] font-semibold">
          {(['chart', 'table'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 transition-colors ${view === v ? 'bg-[#1d1a15] text-[#f6f2ea]' : 'text-[#6e695c] hover:bg-[#efece4]'}`}>
              {v === 'chart' ? '◌ Visualise' : '≡ Data'}
            </button>
          ))}
        </div>
      </div>
      {view === 'chart' ? (
        <div className="space-y-2.5">
          {BY_SECTOR.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-24 text-[11px] font-semibold text-[#1d1a15] text-right">{s.name}</span>
              <div className="flex-1 h-6 bg-[#efece4] rounded-sm overflow-hidden">
                <div className="h-full flex items-center justify-end pr-1.5 text-[9px] f-mono font-bold text-white/90 transition-all" style={{ width: `${s.weight / max * 100}%`, background: PALS[i % PALS.length] }}>{pc(s.weight, 1)}</div>
              </div>
              <span className="w-14 text-[10px] f-mono text-[#8a8577]">{kfmt(s.value)}</span>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[9px] uppercase tracking-[0.2em] text-[#8a8577] border-b-2 border-[#1d1a15]">
              {([['name', 'Sector'], ['count', 'Holdings'], ['weight', 'Weight'], ['value', 'Market value']] as [K, string][]).map(([kk, l]) => (
                <th key={kk} onClick={() => click(kk)} className="py-2 font-semibold cursor-pointer hover:text-[#1d1a15]">{l} <ArrowUpDown size={10} className={arrowCls(kk)} /></th>
              ))}
            </tr>
          </thead>
          <tbody className="f-mono">
            {sorted.map(s => (
              <tr key={s.name} className="border-b border-[#e8e4dc] hover:bg-[#efece4]/50">
                <td className="py-2.5 font-sans font-semibold">{s.name}</td>
                <td className="py-2.5">{s.count}</td>
                <td className="py-2.5">{pc(s.weight, 2)}</td>
                <td className="py-2.5">{usd(s.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export const designs: Design[] = [
  { id: '17.a', vibe: 'Treemap ⇄ sortable grid, icon toggle', el: <A /> },
  { id: '17.b', vibe: 'Dark donut ⇄ zebra table + CSV', el: <B /> },
  { id: '17.c', vibe: '“Visualise ≡ Data” editorial switch', el: <C /> },
];
