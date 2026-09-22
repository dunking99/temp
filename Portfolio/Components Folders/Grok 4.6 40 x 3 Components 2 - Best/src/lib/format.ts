export const money = (n: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);

export const money2 = (n: number) => money(n, Math.abs(n) < 1000 ? 2 : 2);

export const compact = (n: number, digits = 1) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: digits,
  }).format(n);

export const num = (n: number, d = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  }).format(n);

export const pct = (n: number, d = 1, sign = true) => {
  const v = Object.is(n, -0) ? 0 : n;
  const body = `${Math.abs(v).toFixed(d)}%`;
  if (!sign) return v < 0 ? `-${body}` : body;
  if (v > 0) return `+${body}`;
  if (v < 0) return `−${body}`;
  return body;
};

export const signed = (n: number, digits = 0) => {
  const core = money(Math.abs(n), digits);
  if (n > 0.004) return `+${core}`;
  if (n < -0.004) return `−${core}`;
  return money(0, digits);
};

export function qty(n: number) {
  if (Number.isInteger(n)) return num(n, 0);
  if (n < 10) return num(n, 2);
  return num(n, 1);
}

export function px(n: number) {
  return money(n, n >= 1000 ? 0 : 2);
}

export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTH_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ymLabel(ym: string, short = false) {
  const [y, m] = ym.split("-").map(Number);
  return short ? `${MON[m - 1]} '${String(y).slice(2)}` : `${MON[m - 1]} ${y}`;
}

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function extents(values: number[]) {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min) || min === max) {
    min = (Number.isFinite(min) ? min : 0) - 1;
    max = min + 2;
  }
  return { min, max };
}

export function points(
  values: number[],
  w: number,
  h: number,
  pad = 0,
  domain?: { min: number; max: number },
) {
  const { min, max } = domain ?? extents(values);
  const span = max - min || 1;
  return values.map((v, i) => {
    const x = pad + (i / Math.max(1, values.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
}

export function linePath(pts: readonly (readonly [number, number])[]) {
  return pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join("");
}

export function areaPath(pts: readonly (readonly [number, number])[], baseY: number) {
  if (!pts.length) return "";
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${linePath(pts)}L${last[0].toFixed(2)},${baseY}L${first[0].toFixed(2)},${baseY}Z`;
}

export function compound(returns: number[]) {
  return returns.reduce((a, r) => a * (1 + r), 1) - 1;
}

export function normCdf(x: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x >= 0 ? 1 - p : p;
}

export type Box = { id: string; x: number; y: number; w: number; h: number };

export function treemap(items: { id: string; value: number }[], width: number, height: number): Box[] {
  const data = items.filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const rects: Box[] = [];
  const walk = (list: { id: string; value: number }[], x: number, y: number, w: number, h: number) => {
    if (!list.length || w <= 0 || h <= 0) return;
    if (list.length === 1) {
      rects.push({ id: list[0].id, x, y, w, h });
      return;
    }
    const total = list.reduce((s, d) => s + d.value, 0);
    let acc = 0;
    let i = 0;
    for (; i < list.length - 1; i++) {
      acc += list[i].value;
      if (acc >= total * 0.5) break;
    }
    const left = list.slice(0, i + 1);
    const right = list.slice(i + 1);
    const frac = left.reduce((s, d) => s + d.value, 0) / total;
    if (w >= h) {
      const lw = w * frac;
      walk(left, x, y, lw, h);
      walk(right, x + lw, y, w - lw, h);
    } else {
      const lh = h * frac;
      walk(left, x, y, w, lh);
      walk(right, x, y + lh, w, h - lh);
    }
  };
  walk(data, 0, 0, width, height);
  return rects;
}

export function packCircles(
  items: { id: string; value: number }[],
  width: number,
  height: number,
  fill = 0.46,
) {
  const sorted = [...items].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const sum = sorted.reduce((s, d) => s + d.value, 0);
  const k = Math.sqrt((width * height * fill) / (Math.PI * sum));
  const nodes = sorted.map((d) => ({ ...d, r: Math.max(16, k * Math.sqrt(d.value)) }));
  const placed: { id: string; x: number; y: number; r: number; value: number }[] = [];
  const cx = width / 2;
  const cy = height / 2;
  for (const node of nodes) {
    if (!placed.length) {
      placed.push({ ...node, x: cx, y: cy });
      continue;
    }
    let found = false;
    for (let t = 0; t < 5200; t++) {
      const ang = t * 0.42;
      const dist = t * 0.42;
      const x = cx + Math.cos(ang) * dist;
      const y = cy + Math.sin(ang) * dist * 0.78;
      if (x - node.r < 6 || y - node.r < 6 || x + node.r > width - 6 || y + node.r > height - 6) continue;
      if (placed.every((p) => Math.hypot(p.x - x, p.y - y) >= p.r + node.r + 4)) {
        placed.push({ ...node, x, y });
        found = true;
        break;
      }
    }
    if (!found) {
      placed.push({ ...node, x: clamp(cx, node.r, width - node.r), y: clamp(cy, node.r, height - node.r) });
    }
  }
  return placed;
}

export function heat(v: number, max = 8) {
  const t = clamp(v / max, -1, 1);
  if (t >= 0) {
    return `rgb(${Math.round(246 - t * 190)} ${Math.round(242 - t * 70)} ${Math.round(232 - t * 120)})`;
  }
  const a = -t;
  return `rgb(${Math.round(246 - a * 30)} ${Math.round(236 - a * 150)} ${Math.round(230 - a * 140)})`;
}

export function fanPaths(start: number, years: number, monthly: number, mu: number, sigma: number) {
  const steps = Math.max(1, Math.round(years * 12));
  const zs = [-1.2816, -0.6745, 0, 0.6745, 1.2816];
  const labels = ["p10", "p25", "p50", "p75", "p90"] as const;
  const series = zs.map(() => [] as number[]);
  const rm = mu / 12;
  for (let m = 0; m <= steps; m++) {
    const t = m / 12;
    const grown = start * Math.pow(1 + rm, m);
    const contrib = rm === 0 ? monthly * m : monthly * ((Math.pow(1 + rm, m) - 1) / rm);
    const median = grown + contrib;
    const spread = median * sigma * Math.sqrt(Math.max(t, 0.02));
    zs.forEach((z, i) => series[i].push(Math.max(0, median + z * spread)));
  }
  return { series, labels, steps };
}
