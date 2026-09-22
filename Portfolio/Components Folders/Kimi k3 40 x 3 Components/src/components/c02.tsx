// 2 · Value vs net invested
import { useId, useRef, useState } from 'react';
import { SERIES, TOTAL, NET_INVESTED, UNREALIZED } from '../data';
import { kfmt, linePath, pc, stepPathFactory, usd } from '../lib';
import type { Design } from '../lib';

const W = 920, H = 300, PL = 8, PR = 8, PT = 14, PB = 26;
const vmax = Math.max(...SERIES.map(p => p.v)) * 1.02;
const X = (i: number) => PL + (i / (SERIES.length - 1)) * (W - PL - PR);
const Y = (v: number) => PT + (1 - v / vmax) * (H - PT - PB);
const vPts: [number, number][] = SERIES.map((p, i) => [X(i), Y(p.v)]);
const iPts: [number, number][] = SERIES.map((p, i) => [X(i), Y(p.inv)]);
const gapPath = `${linePath(vPts)} ${iPts.slice().reverse().map(p => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')} Z`;

function useHover() {
  const ref = useRef<SVGSVGElement>(null);
  const [idx, setIdx] = useState<number | null>(null);
  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width;
    setIdx(Math.max(0, Math.min(SERIES.length - 1, Math.round(fx * (SERIES.length - 1)))));
  };
  return { ref, idx, move, leave: () => setIdx(null) };
}

// a — light area chart, hover tooltip, gap tinted
function A() {
  const gid = useId();
  const { ref, idx, move, leave } = useHover();
  const p = idx != null ? SERIES[idx] : null;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-neutral-800">Portfolio value vs net invested</div>
          <div className="text-xs text-neutral-400 mt-0.5">Weekly · since inception</div>
        </div>
        <div className="flex gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-neutral-600"><i className="w-3 h-[3px] rounded bg-indigo-600 inline-block" />Value</span>
          <span className="flex items-center gap-1.5 text-neutral-600"><i className="w-3 h-[3px] rounded bg-neutral-400 inline-block" />Net invested</span>
          <span className="flex items-center gap-1.5 text-neutral-600"><i className="w-3 h-2 rounded-sm bg-emerald-500/25 inline-block" />Gain</span>
        </div>
      </div>
      <div className="relative">
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full cursor-crosshair" onMouseMove={move} onMouseLeave={leave}>
          <defs>
            <linearGradient id={gid + 'v'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4f46e5" stopOpacity=".18" /><stop offset="1" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map(f => <line key={f} x1={PL} x2={W - PR} y1={PT + f * (H - PT - PB)} y2={PT + f * (H - PT - PB)} stroke="#e5e5e5" strokeDasharray="3 4" />)}
          <path d={gapPath} fill="#10b981" opacity=".14" />
          <path d={`${linePath(vPts)} L${W - PR},${H - PB} L${PL},${H - PB} Z`} fill={`url(#${gid + 'v'})`} />
          <path d={linePath(iPts)} fill="none" stroke="#9ca3af" strokeWidth="1.6" strokeDasharray="1 3" strokeLinecap="round" />
          <path d={linePath(vPts)} fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
          {idx != null && (
            <g>
              <line x1={X(idx)} x2={X(idx)} y1={PT} y2={H - PB} stroke="#1e1b4b" strokeOpacity=".25" />
              <circle cx={X(idx)} cy={Y(p!.v)} r="4" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
              <circle cx={X(idx)} cy={Y(p!.inv)} r="3.4" fill="#9ca3af" stroke="#fff" strokeWidth="1.6" />
            </g>
          )}
          {['Feb 23', 'Feb 24', 'Feb 25', 'Feb 26'].map((l, i) => (
            <text key={l} x={PL + i * (W - PL - PR) / 3} y={H - 8} fontSize="10" fill="#a3a3a3" textAnchor={i === 3 ? 'end' : 'start'}>{l}</text>
          ))}
        </svg>
        {p && (
          <div className="absolute top-1 pointer-events-none bg-neutral-900 text-white rounded-lg px-3.5 py-2.5 text-[11px] shadow-xl"
            style={{ left: `${(X(idx!) / W) * 100}%`, transform: idx! > SERIES.length * 0.6 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)' }}>
            <div className="text-neutral-400 mb-1">{p.label}</div>
            <div className="flex justify-between gap-6"><span>Value</span><b className="tnum">{usd(p.v)}</b></div>
            <div className="flex justify-between gap-6 text-neutral-300"><span>Invested</span><b className="tnum">{usd(p.inv)}</b></div>
            <div className="flex justify-between gap-6 text-emerald-400 border-t border-white/10 mt-1 pt-1"><span>Gap</span><b className="tnum">+{usd(p.v - p.inv)}</b></div>
          </div>
        )}
      </div>
    </div>
  );
}

// b — dark chart: gradient value area + step-line deposits, hover readout row
function B() {
  const gid = useId();
  const { ref, idx, move, leave } = useHover();
  const step = stepPathFactory(iPts);
  const p = idx != null ? SERIES[idx] : SERIES[SERIES.length - 1];
  return (
    <div className="bg-[#080c11] rounded-xl p-6 border border-[#182430] text-[#cfe3ef]">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#46617a]">Equity vs. Deposits · 3Y</div>
        <div className="flex gap-2 text-[10px]">
          <span className="px-2 py-1 rounded border border-[#1e3547] text-[#7fb6d9]">VALUE</span>
          <span className="px-2 py-1 rounded border border-[#1e3547] text-[#5b7285]">DEPOSITS (STEP)</span>
        </div>
      </div>
      <div className="flex gap-8 py-3 border-b border-[#12202c] mb-2 tnum text-sm">
        <div><span className="text-[#46617a] text-[10px] block">VALUE</span>{usd(p.v)}</div>
        <div><span className="text-[#46617a] text-[10px] block">INVESTED</span>{usd(p.inv)}</div>
        <div><span className="text-[#46617a] text-[10px] block">GAIN</span><span className="text-emerald-400">+{usd(p.v - p.inv)} · {pc(((p.v - p.inv) / p.inv) * 100, 1)}</span></div>
        <div className="ml-auto text-[#46617a] text-[10px] self-center">{p.label.toUpperCase()}</div>
      </div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full cursor-crosshair" onMouseMove={move} onMouseLeave={leave}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#38bdf8" stopOpacity=".35" /><stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.2, 0.4, 0.6, 0.8].map(f => <line key={f} x1={PL} x2={W - PR} y1={PT + f * (H - PT - PB)} y2={PT + f * (H - PT - PB)} stroke="#12202c" />)}
        <path d={`${linePath(vPts)} L${W - PR},${H - PB} L${PL},${H - PB} Z`} fill={`url(#${gid})`} />
        <path d={gapPath} fill="#34d399" opacity=".10" />
        <path d={step} fill="none" stroke="#5b7285" strokeWidth="1.5" />
        <path d={linePath(vPts)} fill="none" stroke="#38bdf8" strokeWidth="2" />
        {idx != null && (
          <g>
            <line x1={X(idx)} x2={X(idx)} y1={PT} y2={H - PB} stroke="#7fb6d9" strokeOpacity=".35" strokeDasharray="2 3" />
            <circle cx={X(idx)} cy={Y(p.v)} r="4.5" fill="#080c11" stroke="#38bdf8" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
}

// c — hairline minimal, endpoint annotation, floating gap badge
function C() {
  const g = Math.round((UNREALIZED / NET_INVESTED) * 100);
  return (
    <div className="bg-[#fbfaf8] rounded-xl border border-[#e8e4dc] p-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#8a8577]">Value against money in</div>
          <div className="mt-3 f-display text-4xl">{kfmt(TOTAL)} <span className="text-lg text-[#8a8577]">vs</span> <span className="text-[#8a8577]">{kfmt(NET_INVESTED)} invested</span></div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1 bg-[#0f5132] text-white rounded-full px-3 py-1 text-xs font-semibold tnum">+{g}% above cost</div>
          <div className="text-[11px] text-[#8a8577] mt-1.5">unrealised gain {usd(UNREALIZED)}</div>
        </div>
      </div>
      <div className="relative mt-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <path d={gapPath} fill="#0f5132" opacity=".07" />
          <path d={linePath(iPts)} fill="none" stroke="#b7b0a1" strokeWidth="1.2" strokeDasharray="2 5" strokeLinecap="round" />
          <path d={linePath(vPts)} fill="none" stroke="#1d1a15" strokeWidth="1.5" />
          {/* widest gap callout */}
          <line x1={X(150)} x2={X(150)} y1={Y(SERIES[150].v)} y2={Y(SERIES[150].inv)} stroke="#0f5132" strokeWidth="1.4" />
          <circle cx={X(156)} cy={Y(SERIES[156].v)} r="5" fill="#1d1a15" />
        </svg>
        <div className="absolute f-mono text-[10px] bg-[#1d1a15] text-[#f6f2ea] rounded px-2 py-1"
          style={{ left: '86%', top: '26%' }}>gap {usd(SERIES[150].v - SERIES[150].inv)}</div>
        <div className="flex justify-between text-[10px] f-mono text-[#8a8577] mt-2">
          <span>FEB 2023 · FIRST DEPOSIT {kfmt(180000)}</span><span>FEB 2026 · {kfmt(TOTAL)}</span>
        </div>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '2.a', vibe: 'Clean product chart · hover tooltip', el: <A /> },
  { id: '2.b', vibe: 'Night desk · step deposits, readout header', el: <B /> },
  { id: '2.c', vibe: 'Gallery-minimal · hairline + annotations', el: <C /> },
];
