import { useId, useState } from 'react';

export type Design = { id: string; vibe: string; el: React.ReactNode };

// ─── formatting ──────────────────────────────────────────────────────────────
export const usd = (n: number, d = 0) =>
  (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const num = (n: number, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const pc = (n: number, d = 1, signed = false) =>
  (signed && n > 0 ? '+' : '') + n.toFixed(d) + '%';
export const signUsd = (n: number, d = 0) => (n >= 0 ? '+' : '−') + usd(Math.abs(n), d).slice(0) ;
export const kfmt = (n: number) => {
  const a = Math.abs(n);
  if (a >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (a >= 1e3) return '$' + (n / 1e3).toFixed(a >= 1e5 ? 0 : 1) + 'k';
  return '$' + n.toFixed(0);
};
export const up = (n: number) => n >= 0;
export const trendCol = (n: number) => (n >= 0 ? 'text-emerald-600' : 'text-rose-500');

// ─── svg helpers ─────────────────────────────────────────────────────────────
export const linePath = (pts: [number, number][]) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

export const stepPathFactory = (pts: [number, number][]) => {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i - 1][1]} L${pts[i][0]},${pts[i][1]}`;
  return d;
};

export function smoothPath(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}

export const scale = (v: number, min: number, max: number, outMin: number, outMax: number) =>
  outMin + ((v - min) / (max - min || 1)) * (outMax - outMin);

// ─── sparkline ───────────────────────────────────────────────────────────────
export function Spark({ d, w = 90, h = 26, c = '#10b981', fill = true, sw = 1.6 }: {
  d: number[]; w?: number; h?: number; c?: string; fill?: boolean; sw?: number;
}) {
  const id = useId();
  const min = Math.min(...d), max = Math.max(...d);
  const pts: [number, number][] = d.map((v, i) => [
    (i / (d.length - 1)) * w,
    h - 2 - ((v - min) / (max - min || 1)) * (h - 4),
  ]);
  return (
    <svg width={w} height={h} className="overflow-visible">
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={c} stopOpacity=".22" />
              <stop offset="1" stopColor={c} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${linePath(pts)} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
        </>
      )}
      <path d={smoothPath(pts)} fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

// ─── donut ───────────────────────────────────────────────────────────────────
export type Seg = { label: string; v: number; c: string };
export function Donut({ segs, size = 190, th = 26, gap = 2, center, hover = true }: {
  segs: Seg[]; size?: number; th?: number; gap?: number;
  center?: React.ReactNode | ((seg: Seg | null) => React.ReactNode); hover?: boolean;
}) {
  const [act, setAct] = useState<number>(-1);
  const r = (size - th) / 2 - 2;
  const C = 2 * Math.PI * r;
  const total = segs.reduce((s, x) => s + x.v, 0);
  let acc = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {segs.map((s, i) => {
          const frac = s.v / total;
          const dash = frac * C;
          const off = acc; acc += dash;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={s.c} strokeWidth={act === i && hover ? th + 5 : th}
              strokeDasharray={`${Math.max(dash - gap, 0.5)} ${C - dash + gap}`}
              strokeDashoffset={-off + gap / 2}
              className="transition-all duration-300 cursor-pointer"
              style={{ opacity: act === -1 || act === i ? 1 : 0.35 }}
              onMouseEnter={() => hover && setAct(i)} onMouseLeave={() => hover && setAct(-1)} />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        {typeof center === 'function' ? (center as any)(act === -1 ? null : segs[act]) : center}
      </div>
    </div>
  );
}

// ─── stacked bar ─────────────────────────────────────────────────────────────
export function StackBar({ segs, h = 14, onHover }: { segs: Seg[]; h?: number; onHover?: (i: number | null) => void }) {
  const total = segs.reduce((s, x) => s + x.v, 0);
  return (
    <div className="flex w-full overflow-hidden" style={{ height: h, borderRadius: h / 2 }}>
      {segs.map((s, i) => (
        <div key={i} className="h-full transition-all duration-300 hover:opacity-80 cursor-pointer"
          style={{ width: `${(s.v / total) * 100}%`, background: s.c }}
          onMouseEnter={() => onHover?.(i)} onMouseLeave={() => onHover?.(null)} />
      ))}
    </div>
  );
}

// ─── horizontal bar row ──────────────────────────────────────────────────────
export function HBars({ rows, fmt = (v: number) => v.toFixed(1) + '%' }: {
  rows: { label: string; v: number; c: string; sub?: string }[]; fmt?: (v: number) => string;
}) {
  const max = Math.max(...rows.map(r => r.v));
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => (
        <div key={i} className="group">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="font-medium">{r.label}</span>
            <span className="opacity-60 tnum">{fmt(r.v)}</span>
          </div>
          <div className="h-2 rounded-full bg-black/5 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
              style={{ width: `${(r.v / max) * 100}%`, background: r.c }} />
          </div>
        </div>
      ))}
    </div>
  );
}
