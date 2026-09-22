// ─── Meridian · shared sample dataset ────────────────────────────────────────
export type Holding = {
  ticker: string; name: string; qty: number; avg: number; price: number;
  cls: string; sector: string; region: string; ccy: string; account: string; yld: number;
};

export const HOLDINGS: Holding[] = [
  { ticker: 'VOO',  name: 'Vanguard S&P 500 ETF',      qty: 240, avg: 412.30, price: 541.86, cls: 'US Equities',   sector: 'Diversified',   region: 'United States', ccy: 'USD', account: 'Fidelity Brokerage', yld: 1.32 },
  { ticker: 'MSFT', name: 'Microsoft Corp',            qty: 85,  avg: 298.10, price: 441.16, cls: 'US Equities',   sector: 'Technology',    region: 'United States', ccy: 'USD', account: 'Fidelity Brokerage', yld: 0.72 },
  { ticker: 'AAPL', name: 'Apple Inc',                 qty: 130, avg: 178.44, price: 227.48, cls: 'US Equities',   sector: 'Technology',    region: 'United States', ccy: 'USD', account: 'Fidelity Brokerage', yld: 0.44 },
  { ticker: 'IEFA', name: 'iShares Core MSCI EAFE',    qty: 320, avg: 64.80,  price: 79.34,  cls: 'Intl Equities', sector: 'Diversified',   region: 'Developed ex-US', ccy: 'USD', account: 'Roth IRA', yld: 2.98 },
  { ticker: 'NVDA', name: 'NVIDIA Corp',               qty: 180, avg: 96.30,  price: 138.25, cls: 'US Equities',   sector: 'Technology',    region: 'United States', ccy: 'USD', account: 'Fidelity Brokerage', yld: 0.03 },
  { ticker: 'BND',  name: 'Vanguard Total Bond Mkt',   qty: 240, avg: 76.40,  price: 73.28,  cls: 'Fixed Income',  sector: 'Fixed Income',  region: 'United States', ccy: 'USD', account: 'Roth IRA', yld: 4.41 },
  { ticker: 'ASML', name: 'ASML Holding NV',           qty: 18,  avg: 612.50, price: 724.80, cls: 'Intl Equities', sector: 'Technology',    region: 'Europe', ccy: 'EUR', account: 'Fidelity Brokerage', yld: 0.94 },
  { ticker: 'TM',   name: 'Toyota Motor Corp (ADR)',   qty: 70,  avg: 168.90, price: 182.37, cls: 'Intl Equities', sector: 'Consumer Cyc.', region: 'Japan', ccy: 'JPY', account: 'Joint Account', yld: 2.85 },
  { ticker: 'GLD',  name: 'SPDR Gold Shares',          qty: 45,  avg: 191.10, price: 246.22, cls: 'Alternatives',  sector: 'Commodities',   region: 'Global', ccy: 'USD', account: 'Joint Account', yld: 0 },
  { ticker: 'O',    name: 'Realty Income Corp',        qty: 160, avg: 52.90,  price: 61.44,  cls: 'Alternatives',  sector: 'Real Estate',   region: 'United States', ccy: 'USD', account: 'Roth IRA', yld: 5.12 },
  { ticker: 'NVO',  name: 'Novo Nordisk A/S (ADR)',    qty: 95,  avg: 101.20, price: 88.44,  cls: 'Intl Equities', sector: 'Healthcare',    region: 'Europe', ccy: 'DKK', account: 'Fidelity Brokerage', yld: 1.21 },
];

export const ACCOUNTS = [
  { name: 'Fidelity Brokerage', type: 'Taxable', bal: 18240.55, apy: 4.10 },
  { name: 'Roth IRA · Fidelity', type: 'Retirement', bal: 6020.10, apy: 3.88 },
  { name: 'Joint Savings · Marcus', type: 'Savings', bal: 9850.87, apy: 4.35 },
];

const val = (h: Holding) => h.qty * h.price;
export const posValue = val;

export const INVESTED_VALUE = HOLDINGS.reduce((s, h) => s + val(h), 0);        // 320,102
export const CASH_TOTAL = ACCOUNTS.reduce((s, a) => s + a.bal, 0);             // 34,111.52
export const TOTAL = INVESTED_VALUE + CASH_TOTAL;                              // 354,213.97
export const COST_BASIS = HOLDINGS.reduce((s, h) => s + h.qty * h.avg, 0);
export const NET_INVESTED = 278_000;                                           // lifetime deposits
export const UNREALIZED = TOTAL - NET_INVESTED;
export const TODAY_CHG = 2348.19;
export const TODAY_PCT = (TODAY_CHG / (TOTAL - TODAY_CHG)) * 100;
export const BLENDED_APY = ACCOUNTS.reduce((s, a) => s + a.bal * a.apy, 0) / CASH_TOTAL;

export const CLS_TARGET: Record<string, number> = {
  'US Equities': 55, 'Intl Equities': 20, 'Fixed Income': 15, 'Alternatives': 5, 'Cash': 5,
};

export type Agg = { name: string; value: number; weight: number; target?: number; count?: number };
const agg = (key: (h: Holding) => string, includeCash = true): Agg[] => {
  const m = new Map<string, { value: number; count: number }>();
  HOLDINGS.forEach(h => {
    const k = key(h);
    const e = m.get(k) ?? { value: 0, count: 0 };
    e.value += val(h); e.count += 1; m.set(k, e);
  });
  const arr: Agg[] = [...m.entries()].map(([name, e]) => ({ name, value: e.value, count: e.count, weight: 0 }));
  if (includeCash) arr.push({ name: 'Cash', value: CASH_TOTAL, count: 3, weight: 0 });
  arr.forEach(a => (a.weight = (a.value / TOTAL) * 100));
  return arr.sort((a, b) => b.value - a.value);
};

export const BY_CLASS = agg(h => h.cls).map(a => ({ ...a, target: CLS_TARGET[a.name] ?? 0 }));
export const BY_SECTOR = agg(h => h.sector);
export const BY_REGION = agg(h => h.region === 'United States' ? 'United States' : h.region);
export const BY_HOLDING: Agg[] = HOLDINGS.map(h => ({ name: h.ticker, value: val(h), weight: (val(h) / TOTAL) * 100 }))
  .concat([{ name: 'CASH', value: CASH_TOTAL, weight: (CASH_TOTAL / TOTAL) * 100 }])
  .sort((a, b) => b.value - a.value);

export const BY_CCY: Agg[] = [
  { name: 'USD', weight: 75.1, value: 265.92e3 },
  { name: 'EUR', weight: 11.2, value: 39.67e3 },
  { name: 'JPY', weight: 7.4,  value: 26.21e3 },
  { name: 'GBP', weight: 3.9,  value: 13.81e3 },
  { name: 'DKK', weight: 2.4,  value: 8.50e3 },
];

export const US_WEIGHT = 70.4;
export const INTL_WEIGHT = 29.6;

// ─── time series (seeded, deterministic) ─────────────────────────────────────
function mulberry(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Pt = { t: number; label: string; v: number; inv: number };
const r = mulberry(11);
const N = 157;
let v = 186_000, inv = 180_000;
const raw: Pt[] = [];
const t0 = new Date('2023-02-24').getTime();
for (let i = 0; i < N; i++) {
  const dep = i > 0 && i % 4 === 0 ? 2000 : (i === 52 || i === 104 ? 10_000 : 0);
  inv += dep; v += dep;
  v *= 1 + 0.0042 + (r() - 0.5) * 0.038;
  const d = new Date(t0 + i * 7 * 864e5);
  raw.push({ t: i, label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), v, inv });
}
const k = TOTAL / raw[N - 1].v;
export const SERIES: Pt[] = raw.map(p => ({ ...p, v: p.v * k }));

export const DD = (() => {
  let peak = -Infinity;
  return SERIES.map(p => { peak = Math.max(peak, p.v); return { t: p.t, label: p.label, dd: ((p.v - peak) / peak) * 100 }; });
})();

export const GAINPCT = SERIES.map(p => ({ t: p.t, label: p.label, g: ((p.v - p.inv) / p.inv) * 100 }));

export const RETURNS = {
  periods: ['1M', '3M', 'YTD', '1Y', '3Y', '5Y', 'All'],
  twr: [1.9, 4.2, 11.3, 14.2, 8.9, 11.3, 12.1],
  mwr: [1.7, 3.8, 10.4, 12.8, 8.4, 10.9, 11.6],
  bm:  [2.4, 5.1, 12.8, 15.1, 9.6, 12.0, 12.4],
};

export const YIELD_FWD = 2.1;
export const YIELD_COST = 2.8;
export const INCOME_FWD = 7431;
export const MONTHLY_DIVS = [312, 428, 690, 318, 441, 812, 344, 402, 725, 388, 512, 940];

export const GOAL = { target: 550_000, dateLabel: 'Jun 2030', monthly: 2_000 };

export const FX = [
  { pair: 'EUR/USD', rate: '1.0862', chg: '+0.12%' },
  { pair: 'GBP/USD', rate: '1.2684', chg: '−0.08%' },
  { pair: 'USD/JPY', rate: '149.32', chg: '+0.31%' },
  { pair: 'DKK/USD', rate: '0.1455', chg: '+0.09%' },
];

export const ASOF = 'Fri 20 Feb 2026 · 4:00 PM ET close';

export const PULSE = [
  { tone: 'up',   title: 'NVDA crossed $24.9k', body: 'Now 7.0% of the portfolio — your largest single stock. Up 43.5% on cost.' },
  { tone: 'warn', title: 'Bonds 10 pts under target', body: 'Fixed income is 5.0% vs a 15% target. ~$35.4k would close the gap.' },
  { tone: 'info', title: '$34.1k cash earning 4.13%', body: 'Idle cash added $12 this week but is lagging your invested sleeve.' },
  { tone: 'up',   title: 'IEFA raised its distribution', body: 'Forward yield now 2.98%. Next ex-date 26 Feb.' },
] as const;

export const REBAL = BY_CLASS.map(c => ({
  name: c.name, actual: c.weight, target: c.target ?? 0,
  move: ((c.target ?? 0) - c.weight) / 100 * TOTAL,
}));
