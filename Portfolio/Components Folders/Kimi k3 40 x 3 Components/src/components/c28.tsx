// 28 · Money flow (accounts → asset classes → holdings)
import { useState } from 'react';
import { BY_CLASS, TOTAL } from '../data';
import { kfmt, pc } from '../lib';
import type { Design } from '../lib';

const CLASS_COL: Record<string, string> = {
  'US Equities': '#4f46e5', 'Intl Equities': '#0ea5e9', 'Fixed Income': '#f59e0b', 'Alternatives': '#a855f7', 'Cash': '#94a3b8',
};

// ─── a: sankey ────────────────────────────────────────────────────────────────
type Node = { key: string; col: 0 | 1 | 2; v: number; c: string; sub?: string };
type Flow = { s: string; d: string; v: number; c: string };

const NODES: Node[] = [
  { key: 'Fidelity Brokerage', col: 0, v: 261690, c: '#334155', sub: 'Taxable' },
  { key: 'Roth IRA', col: 0, v: 58826, c: '#475569', sub: 'Retirement' },
  { key: 'Joint Savings', col: 0, v: 33697, c: '#64748b', sub: 'Cash+joint' },
  { key: 'US Equities', col: 1, v: 222002, c: CLASS_COL['US Equities'] },
  { key: 'Intl Equities', col: 1, v: 59603, c: CLASS_COL['Intl Equities'] },
  { key: 'Cash', col: 1, v: 34111, c: CLASS_COL['Cash'] },
  { key: 'Alternatives', col: 1, v: 20910, c: CLASS_COL['Alternatives'] },
  { key: 'Fixed Income', col: 1, v: 17587, c: CLASS_COL['Fixed Income'] },
  { key: 'VOO', col: 2, v: 130046, c: '#4338ca' }, { key: 'MSFT', col: 2, v: 37499, c: '#4338ca' },
  { key: 'AAPL', col: 2, v: 29572, c: '#4338ca' }, { key: 'NVDA', col: 2, v: 24885, c: '#4338ca' },
  { key: 'IEFA', col: 2, v: 25389, c: '#0369a1' }, { key: 'ASML', col: 2, v: 13046, c: '#0369a1' },
  { key: 'TM', col: 2, v: 12766, c: '#0369a1' }, { key: 'NVO', col: 2, v: 8402, c: '#0369a1' },
  { key: 'CASH', col: 2, v: 34111, c: '#94a3b8' }, { key: 'GLD', col: 2, v: 11080, c: '#7e22ce' },
  { key: 'O', col: 2, v: 9830, c: '#7e22ce' }, { key: 'BND', col: 2, v: 17587, c: '#b45309' },
];
const FLOWS: Flow[] = [
  { s: 'Fidelity Brokerage', d: 'US Equities', v: 222002, c: CLASS_COL['US Equities'] },
  { s: 'Fidelity Brokerage', d: 'Intl Equities', v: 21448, c: CLASS_COL['Intl Equities'] },
  { s: 'Roth IRA', d: 'Intl Equities', v: 25389, c: CLASS_COL['Intl Equities'] },
  { s: 'Joint Savings', d: 'Intl Equities', v: 12766, c: CLASS_COL['Intl Equities'] },
  { s: 'Roth IRA', d: 'Fixed Income', v: 17587, c: CLASS_COL['Fixed Income'] },
  { s: 'Roth IRA', d: 'Alternatives', v: 9830, c: CLASS_COL['Alternatives'] },
  { s: 'Joint Savings', d: 'Alternatives', v: 11080, c: CLASS_COL['Alternatives'] },
  { s: 'Fidelity Brokerage', d: 'Cash', v: 18240, c: CLASS_COL['Cash'] },
  { s: 'Roth IRA', d: 'Cash', v: 6020, c: CLASS_COL['Cash'] },
  { s: 'Joint Savings', d: 'Cash', v: 9851, c: CLASS_COL['Cash'] },
  { s: 'US Equities', d: 'VOO', v: 130046, c: CLASS_COL['US Equities'] },
  { s: 'US Equities', d: 'MSFT', v: 37499, c: CLASS_COL['US Equities'] },
  { s: 'US Equities', d: 'AAPL', v: 29572, c: CLASS_COL['US Equities'] },
  { s: 'US Equities', d: 'NVDA', v: 24885, c: CLASS_COL['US Equities'] },
  { s: 'Intl Equities', d: 'IEFA', v: 25389, c: CLASS_COL['Intl Equities'] },
  { s: 'Intl Equities', d: 'ASML', v: 13046, c: CLASS_COL['Intl Equities'] },
  { s: 'Intl Equities', d: 'TM', v: 12766, c: CLASS_COL['Intl Equities'] },
  { s: 'Intl Equities', d: 'NVO', v: 8402, c: CLASS_COL['Intl Equities'] },
  { s: 'Fixed Income', d: 'BND', v: 17587, c: CLASS_COL['Fixed Income'] },
  { s: 'Alternatives', d: 'GLD', v: 11080, c: CLASS_COL['Alternatives'] },
  { s: 'Alternatives', d: 'O', v: 9830, c: CLASS_COL['Alternatives'] },
  { s: 'Cash', d: 'CASH', v: 34111, c: CLASS_COL['Cash'] },
];

function A() {
  const [hov, setHov] = useState<string | null>(null);
  const H = 470, k = 400 / TOTAL, NW = 12;
  const GAP = [14, 9, 6];
  const xs = [60, 500, 850];
  const pos = new Map<string, { x: number; y: number; h: number }>();
  [0, 1, 2].forEach(col => {
    let y = (H - (NODES.filter(n => n.col === col).reduce((s, n) => s + n.v * k, 0) + (NODES.filter(n => n.col === col).length - 1) * GAP[col])) / 2;
    NODES.filter(n => n.col === col).forEach(n => {
      const h = n.v * k;
      pos.set(n.key, { x: xs[col], y, h });
      y += h + GAP[col];
    });
  });
  const sOff = new Map<string, number>(), dOff = new Map<string, number>();
  const ribbons = FLOWS.map(f => {
    const sp = pos.get(f.s)!, dp = pos.get(f.d)!;
    const so = sOff.get(f.s) ?? 0, do2 = dOff.get(f.d) ?? 0;
    sOff.set(f.s, so + f.v); dOff.set(f.d, do2 + f.v);
    const h = f.v * k;
    const x1 = sp.x + NW, x2 = dp.x, ym = (x1 + x2) / 2;
    const y1 = sp.y + so * k, y2 = dp.y + do2 * k;
    return { d: `M${x1},${y1} C${ym},${y1} ${ym},${y2} ${x2},${y2} L${x2},${y2 + h} C${ym},${y2 + h} ${ym},${y1 + h} ${x1},${y1 + h} Z`, c: f.c, s: f.s, d2: f.d };
  });
  const lit = (r: (typeof ribbons)[0]) => !hov || r.s === hov || r.d2 === hov;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 overflow-x-auto">
      <div className="flex justify-between text-[10px] uppercase tracking-[0.25em] text-neutral-400 px-1 mb-1">
        <span>Where it lives</span><span>What it’s in</span><span>What it owns</span>
      </div>
      <svg viewBox="0 0 1140 470" className="w-full min-w-[860px]">
        {ribbons.map((r, i) => (
          <path key={i} d={r.d} fill={r.c} opacity={hov ? (lit(r) ? 0.42 : 0.05) : 0.26} className="transition-opacity duration-300" />
        ))}
        {NODES.map(n => {
          const p = pos.get(n.key)!;
          const dim = hov && !ribbons.some(r => lit(r) && (r.s === n.key || r.d2 === n.key));
          return (
            <g key={n.key} onMouseEnter={() => setHov(n.key)} onMouseLeave={() => setHov(null)} className="cursor-pointer">
              <rect x={p.x} y={p.y} width={NW} height={p.h} rx="3" fill={n.c} opacity={dim ? 0.25 : 1} className="transition-opacity duration-300" />
              <text x={n.col === 2 ? p.x + NW + 8 : p.x + NW + 8} y={p.y + p.h / 2} fontSize="10.5" fontWeight="600" fill={dim ? '#cbd5e1' : '#334155'} dominantBaseline="middle">{n.key}</text>
              {p.h > 16 && <text x={p.x + NW + 8} y={p.y + p.h / 2 + 12} fontSize="9" fill="#94a3b8" dominantBaseline="middle">{kfmt(n.v)} · {pc((n.v / TOTAL) * 100, 1)}</text>}
            </g>
          );
        })}
      </svg>
      <div className="px-1 text-[10px] text-neutral-400">Hover any bar to trace ${hov ? 'its' : 'a'} ribbon through the book.</div>
    </div>
  );
}

// b — additive waterfall
function B() {
  const parts = [
    { name: 'US Equities', v: 222002, c: CLASS_COL['US Equities'] },
    { name: 'Intl Equities', v: 59603, c: CLASS_COL['Intl Equities'] },
    { name: 'Fixed Income', v: 17587, c: CLASS_COL['Fixed Income'] },
    { name: 'Alternatives', v: 20910, c: CLASS_COL['Alternatives'] },
    { name: 'Cash', v: 34111, c: CLASS_COL['Cash'] },
  ];
  const H = 340, k = H / TOTAL;
  let acc = 0;
  const W = 900, band = W / (parts.length + 2);
  return (
    <div className="bg-[#0e1116] rounded-xl border border-[#232a35] p-7 text-white">
      <div className="flex justify-between items-baseline mb-6">
        <span className="text-sm font-semibold">How the {kfmt(TOTAL)} assembles</span>
        <span className="text-[10px] f-mono text-white/35">CUMULATIVE STACK → TOTAL</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H + 44}`} className="w-full">
        {parts.map((p, i) => {
          const x = band / 2 + i * band, y0 = 20 + H - (acc + p.v) * k, h = p.v * k;
          acc += p.v;
          return (
            <g key={p.name} className="group">
              <rect x={x} y={y0} width={band - 22} height={h} rx="5" fill={p.c} opacity=".9" className="group-hover:opacity-100 transition-opacity" />
              {i > 0 && <line x1={x - 22} x2={x} y1={y0} y2={y0} stroke="#334155" strokeDasharray="2 3" />}
              <text x={x + (band - 22) / 2} y={y0 - 7} fontSize="10" fill={p.c} textAnchor="middle" fontWeight="700">{kfmt(p.v)}</text>
              <text x={x + (band - 22) / 2} y={H + 34} fontSize="9.5" fill="#64748b" textAnchor="middle">{p.name}</text>
            </g>
          );
        })}
        <g>
          <rect x={band / 2 + parts.length * band} y={20} width={band - 22} height={H} rx="5" fill="url(#tgrad)" />
          <defs><linearGradient id="tgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#34d399" /><stop offset="1" stopColor="#0d9488" /></linearGradient></defs>
          <text x={band / 2 + parts.length * band + (band - 22) / 2} y={13} fontSize="11" fill="#34d399" textAnchor="middle" fontWeight="700">{kfmt(TOTAL)}</text>
          <text x={band / 2 + parts.length * band + (band - 22) / 2} y={H + 34} fontSize="9.5" fill="#34d399" textAnchor="middle" fontWeight="600">TOTAL</text>
        </g>
      </svg>
    </div>
  );
}

// c — concentric rings
function C() {
  const [hov, setHov] = useState<string | null>(null);
  const size = 300;
  const mk = (items: { name: string; w: number; c: string }[], r: number, th: number) => {
    const CIRC = 2 * Math.PI * r;
    let acc = 0;
    return items.map(s => {
      const dash = (s.w / 100) * CIRC, off = acc; acc += dash;
      return (
        <circle key={s.name} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.c} strokeWidth={th}
          strokeDasharray={`${Math.max(dash - 2.5, 1)} ${CIRC - dash + 2.5}`} strokeDashoffset={-off}
          className="cursor-pointer transition-all duration-300" style={{ opacity: !hov || hov === s.name ? 1 : 0.25 }}
          onMouseEnter={() => setHov(s.name)} onMouseLeave={() => setHov(null)} />
      );
    });
  };
  const outer = [
    { name: 'VOO', w: 36.7, c: '#3730a3' }, { name: 'MSFT', w: 10.6, c: '#4f46e5' }, { name: 'AAPL', w: 8.3, c: '#6366f1' },
    { name: 'IEFA', w: 7.2, c: '#0ea5e9' }, { name: 'NVDA', w: 7.0, c: '#818cf8' }, { name: 'CASH', w: 9.6, c: '#94a3b8' },
    { name: 'Others', w: 20.6, c: '#cbd5e1' },
  ];
  const curW = outer.find(o => o.name === hov)?.w ?? BY_CLASS.find(c => c.name === hov)?.weight;
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7 flex items-center gap-10">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {mk(BY_CLASS.map((c, i) => ({ name: c.name, w: c.weight, c: ['#4f46e5', '#0ea5e9', '#f59e0b', '#a855f7', '#94a3b8'][i] })), 90, 16)}
          {mk(outer, 118, 12)}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[9px] tracking-[0.25em] uppercase text-[#8a8577]">{hov ?? 'FLOW INWARD'}</span>
          <span className="f-display text-2xl tnum mt-0.5">{curW != null ? pc(curW, 1) : 'N→1'}</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a8577] mb-3">Sleeve → holdings, two rings</div>
        <div className="space-y-1">
          {[...BY_CLASS.map((c, i) => ({ name: c.name, w: c.weight, c: ['#4f46e5', '#0ea5e9', '#f59e0b', '#a855f7', '#94a3b8'][i], ring: 'inner' })),
            ...outer.map(o => ({ ...o, ring: 'outer' }))].map(r => (
            <button key={r.name + r.ring} onMouseEnter={() => setHov(r.name)} onMouseLeave={() => setHov(null)}
              className={`w-full flex items-center gap-2.5 rounded px-2 py-1 text-left transition-colors ${hov === r.name ? 'bg-[#efece4]' : ''}`}>
              <span className="w-2 h-2 rounded-sm" style={{ background: r.c }} />
              <span className="text-[11px] font-medium flex-1 text-[#3d382e]">{r.name}</span>
              <span className="text-[9px] f-mono text-[#b7b0a1]">{r.ring}</span>
              <span className="text-[11px] tnum font-semibold text-[#1d1a15]">{pc(r.w, 1)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '28.a', vibe: 'True sankey · hover tracing', el: <A /> },
  { id: '28.b', vibe: 'Additive waterfall to total', el: <B /> },
  { id: '28.c', vibe: 'Sleeve/holding concentric rings', el: <C /> },
];
