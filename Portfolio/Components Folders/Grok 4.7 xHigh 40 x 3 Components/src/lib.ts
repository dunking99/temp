export function money(n: number, digits = 0, sign = false) {
  const abs = Math.abs(n);
  const body = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(abs);
  if (!sign) return n < 0 ? `−${body}` : body;
  if (n > 0) return `+${body}`;
  if (n < 0) return `−${body}`;
  return body;
}

export function compact(n: number, sign = false) {
  const abs = Math.abs(n);
  const signed = (body: string) => {
    if (!sign) return n < 0 ? `−${body}` : body;
    if (n > 0) return `+${body}`;
    if (n < 0) return `−${body}`;
    return body;
  };
  if (abs >= 1_000_000) return signed(`$${(abs / 1_000_000).toFixed(2)}M`);
  if (abs >= 10_000) return signed(`$${(abs / 1000).toFixed(1)}k`);
  if (abs >= 1000) return signed(`$${(abs / 1000).toFixed(2)}k`);
  return signed(`$${abs.toFixed(0)}`);
}

export function pct(n: number, digits = 1, sign = true) {
  const v = n * 100;
  const body = `${Math.abs(v).toFixed(digits)}%`;
  if (!sign) return n < 0 ? `−${body}` : body;
  if (v > 0.0000001) return `+${body}`;
  if (v < -0.0000001) return `−${body}`;
  return `0.${"0".repeat(digits)}%`;
}

export function pp(n: number, digits = 1) {
  const v = n * 100;
  const body = `${Math.abs(v).toFixed(digits)} pp`;
  if (v > 0) return `+${body}`;
  if (v < 0) return `−${body}`;
  return body;
}

export function num(n: number, digits = 2) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
}

export function convertMoney(usd: number, perUsd: number, symbol: string, digits = 0, sign = false) {
  const v = usd * perUsd;
  const abs = Math.abs(v);
  const body = `${symbol}${new Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(abs)}`;
  if (!sign) return v < 0 ? `−${body}` : body;
  if (v > 0) return `+${body}`;
  if (v < 0) return `−${body}`;
  return body;
}

export function maskAmount(hidden: boolean, text: string) {
  if (!hidden) return text;
  return text.replace(/[0-9]/g, "•");
}

export type Pt = { x: number; y: number; v: number };

export function scale(values: number[], w: number, h: number, pad = 8, min?: number, max?: number) {
  const lo = min ?? Math.min(...values);
  const hi = max ?? Math.max(...values);
  const span = hi - lo || 1;
  return values.map((v, i) => ({
    x: pad + (values.length === 1 ? (w - pad * 2) / 2 : (i / (values.length - 1)) * (w - pad * 2)),
    y: pad + (1 - (v - lo) / span) * (h - pad * 2),
    v,
  }));
}

export function line(pts: Pt[]) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
}

export function area(pts: Pt[], baseY: number) {
  if (!pts.length) return "";
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${line(pts)} L${last.x.toFixed(2)} ${baseY} L${first.x.toFixed(2)} ${baseY} Z`;
}

export function nice(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${n < 0 ? "−" : ""}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1000) return `${n < 0 ? "−" : ""}$${(abs / 1000).toFixed(0)}k`;
  return `${n < 0 ? "−" : ""}$${abs.toFixed(0)}`;
}

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function indexAt(clientX: number, rect: DOMRect, len: number) {
  const x = clientX - rect.left;
  const i = Math.round((x / rect.width) * (len - 1));
  return clamp(i, 0, len - 1);
}
