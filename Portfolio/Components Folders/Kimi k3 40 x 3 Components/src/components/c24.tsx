// 24 · Sector ranking
import { useState } from 'react';
import { BY_SECTOR, SERIES } from '../data';
import { pc, Spark, usd, kfmt } from '../lib';
import type { Design } from '../lib';

const PALS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#a855f7', '#10b981', '#f43f5e', '#84cc16', '#64748b'];

// a — podium list with count chips
function A() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-xl">
      <div className="flex justify-between items-baseline mb-5">
        <div className="text-sm font-semibold text-neutral-800">Sector ranking</div>
        <span className="text-[10px] text-neutral-400 f-mono">BY MARKET VALUE</span>
      </div>
      <div className="space-y-2">
        {BY_SECTOR.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3 group">
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-neutral-200 text-neutral-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-neutral-50 text-neutral-400'}`}>{i + 1}</span>
            <span className="w-28 text-xs font-semibold text-neutral-800">{s.name}</span>
            <div className="flex-1 h-4 bg-neutral-100 rounded-sm overflow-hidden">
              <div className="h-full transition-all duration-500 group-hover:brightness-110" style={{ width: `${(s.weight / BY_SECTOR[0].weight) * 100}%`, background: PALS[i] }} />
            </div>
            <span className="w-12 text-right text-xs tnum font-semibold">{pc(s.weight, 1)}</span>
            <span className="text-[9px] f-mono bg-neutral-100 text-neutral-500 rounded-full px-2 py-0.5">{s.count} pos</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// b — data table with sparklines & top holding
function B() {
  const max = BY_SECTOR[0].weight;
  void max;
  const topOf: Record<string, string> = { 'Diversified': 'VOO', 'Technology': 'MSFT', 'Fixed Income': 'BND', 'Commodities': 'GLD', 'Real Estate': 'O', 'Healthcare': 'NVO', 'Consumer Cyc.': 'TM', 'Cash': 'USD' };
  return (
    <div className="bg-[#0e1116] rounded-xl border border-[#232a35] overflow-hidden text-white max-w-2xl">
      <div className="px-5 py-4 flex justify-between items-center border-b border-white/5">
        <span className="text-sm font-semibold">Sectors, ranked</span>
        <span className="text-[10px] f-mono text-white/35">TREND = 12W OF PORTFOLIO</span>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-[9px] uppercase tracking-[0.2em] text-white/35">
            <th className="px-5 py-2.5 font-semibold w-8">#</th><th className="py-2.5 font-semibold">Sector</th><th className="py-2.5 font-semibold">Pos.</th>
            <th className="py-2.5 font-semibold">Weight</th><th className="py-2.5 font-semibold">Value</th><th className="py-2.5 font-semibold">Top</th><th className="pr-5 py-2.5 font-semibold text-right">12w</th>
          </tr>
        </thead>
        <tbody>
          {BY_SECTOR.map((s, i) => (
            <tr key={s.name} className="border-t border-white/5 hover:bg-white/[.04] transition-colors">
              <td className="px-5 py-3 f-mono text-white/30">{String(i + 1).padStart(2, '0')}</td>
              <td className="py-3 font-semibold text-white/85 flex items-center gap-2"><i className="w-1.5 h-4 rounded-sm inline-block" style={{ background: PALS[i] }} />{s.name}</td>
              <td className="py-3 tnum text-white/50">{s.count}</td>
              <td className="py-3 tnum font-semibold" style={{ color: PALS[i] }}>{pc(s.weight, 1)}</td>
              <td className="py-3 tnum text-white/60">{usd(s.value)}</td>
              <td className="py-3"><span className="f-mono text-[10px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5">{topOf[s.name]}</span></td>
              <td className="pr-5 py-3 text-right"><Spark d={SERIES.slice(-12).map(p => p.v + i * 1e3)} w={64} h={18} c={PALS[i]} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// c — weight-sized tiles (masonry treemap)
function C() {
  const [hov, setHov] = useState<string | null>(null);
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7">
      <div className="flex justify-between items-baseline mb-5">
        <h4 className="f-display text-xl italic">Sectors by size — literally</h4>
        <span className="text-[10px] f-mono text-[#8a8577]">AREA ≈ WEIGHT · HOVER FOR COUNTS</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {BY_SECTOR.map((s, i) => (
          <div key={s.name} onMouseEnter={() => setHov(s.name)} onMouseLeave={() => setHov(null)}
            className="relative rounded-lg cursor-pointer transition-transform duration-200 hover:scale-[.97] flex flex-col justify-between p-3 text-white"
            style={{ flexGrow: s.weight, minWidth: s.weight > 20 ? '46%' : s.weight > 8 ? '30%' : '14%', height: s.weight > 20 ? 120 : s.weight > 8 ? 92 : 76, background: PALS[i] }}>
            <span className="text-[11px] font-semibold leading-tight">{s.name}</span>
            <div className="flex items-end justify-between">
              <span className="text-xl font-bold tnum">{pc(s.weight, 1)}</span>
              {hov === s.name && <span className="text-[10px] bg-black/25 rounded px-1.5 py-0.5">{s.count} holding{s.count! > 1 ? 's' : ''} · {kfmt(s.value)}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '24.a', vibe: 'Podium leaderboard', el: <A /> },
  { id: '24.b', vibe: 'Dark data table · trend column', el: <B /> },
  { id: '24.c', vibe: 'Weight-sized tile wall', el: <C /> },
];
