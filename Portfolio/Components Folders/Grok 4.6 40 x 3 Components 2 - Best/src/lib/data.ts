import { compound } from "./format";

export const AS_OF = "18 March 2026";
export const AS_OF_SHORT = "18 Mar 2026";
export const INVESTOR = "Eleanor Voss";

export type AssetClass =
  | "US Equity"
  | "Intl Equity"
  | "Bonds"
  | "Real Estate"
  | "Commodities"
  | "Crypto"
  | "Cash";

export type AssetType = "Stock" | "ETF" | "Crypto" | "Cash";
export type AccountId = "Taxable" | "Traditional IRA" | "Roth IRA" | "Cash Reserve";

export type Holding = {
  id: string;
  ticker: string;
  name: string;
  type: AssetType;
  assetClass: AssetClass;
  sector: string;
  region: string;
  currency: string;
  account: AccountId;
  qty: number;
  cost: number;
  price: number;
  dayPct: number;
  monthPct: number;
  ytdPct: number;
  ret1y: number;
  yieldPct: number;
  expense: number;
  beta: number;
  vol: number;
  scoreImpact: number;
  blurb: string;
  value: number;
  costBasis: number;
  gain: number;
  gainPct: number;
  dayPnl: number;
  weight: number;
  income: number;
  fee: number;
  spark: number[];
  low52: number;
  high52: number;
};

const RAW = [
  ["AAPL", "Apple", "Stock", "US Equity", "Technology", "United States", "USD", "Taxable", 420, 142.8, 228.64, 1.24, 3.1, 4.6, 22, 0.44, 0, 1.12, 22, -3, "A core compounder. No longer cheap, and a large slice of the US cluster."],
  ["MSFT", "Microsoft", "Stock", "US Equity", "Technology", "United States", "USD", "Taxable", 210, 248.5, 421.18, 0.62, 2.4, 5.8, 18, 0.79, 0, 0.95, 20, -2, "Quietly the second engine of the taxable account."],
  ["NVDA", "NVIDIA", "Stock", "US Equity", "Technology", "United States", "USD", "Taxable", 160, 186.4, 892.35, 2.85, 8.4, 12.2, 86, 0.03, 0, 1.68, 48, -6, "The position that made the last three years. Also the position that can unmake a quarter."],
  ["GOOGL", "Alphabet", "Stock", "US Equity", "Communication", "United States", "USD", "Roth IRA", 280, 98.2, 176.42, -0.41, -1.2, 2.8, 28, 0.45, 0, 1.08, 24, -1, "Held in the Roth, where a long runway matters more than a dividend."],
  ["AMZN", "Amazon", "Stock", "US Equity", "Consumer Disc.", "United States", "USD", "Roth IRA", 150, 128.4, 198.55, 0.18, 1.6, 3.4, 24, 0, 0, 1.22, 28, 0, "A smaller Roth holding. No income, moderate weight."],
  ["BRK.B", "Berkshire Hathaway", "Stock", "US Equity", "Financials", "United States", "USD", "Taxable", 180, 312, 458.9, 0.33, 1.1, 2.6, 15, 0, 0, 0.82, 16, 2, "The ballast inside the equity book — a stock that behaves a little like a fund."],
  ["JNJ", "Johnson & Johnson", "Stock", "US Equity", "Health Care", "United States", "USD", "Traditional IRA", 220, 162.4, 156.2, -0.72, 1.8, 2.1, 4, 3.18, 0, 0.52, 14, 3, "Underwater versus cost. The dividend is doing the work the price is not."],
  ["UNH", "UnitedHealth", "Stock", "US Equity", "Health Care", "United States", "USD", "Traditional IRA", 45, 498, 524.8, 1.05, 2.2, 1.4, 8, 1.6, 0, 0.68, 18, 1, "A modest IRA position, added for earnings resilience."],
  ["XOM", "Exxon Mobil", "Stock", "US Equity", "Energy", "United States", "USD", "Traditional IRA", 310, 98.5, 112.4, -1.48, 4.2, 6.4, 6, 3.52, 0, 0.88, 24, 0, "The energy hedge. Pays more than it grows."],
  ["ASML", "ASML Holding", "Stock", "Intl Equity", "Technology", "Netherlands", "EUR", "Taxable", 35, 640, 812.6, 0.88, 1.4, -0.6, 12, 0.92, 0, 1.24, 32, 0, "Europe's highest-quality single name in the book. Economic exposure in euros."],
  ["NVO", "Novo Nordisk", "Stock", "Intl Equity", "Health Care", "Denmark", "DKK", "Taxable", 180, 92.4, 86.15, -2.1, -6.4, -8.2, -18, 2.44, 0, 0.74, 26, -1, "The rare loser. Still owned, still paying, thesis bruised."],
  ["VTI", "Vanguard Total Stock Market", "ETF", "US Equity", "Diversified", "United States", "USD", "Traditional IRA", 620, 198.4, 286.12, 0.54, 1.8, 2.2, 16, 1.3, 0.03, 1, 16, 6, "The actual core. Broad US equity, low fee, sitting in the IRA."],
  ["VXUS", "Vanguard Total International", "ETF", "Intl Equity", "Diversified", "International", "USD", "Taxable", 840, 54.2, 66.85, 0.21, 0.8, 1.4, 9, 3.1, 0.07, 0.92, 17, 4, "International, bought steadily, still short of the target weight."],
  ["VWO", "Vanguard FTSE Emerging", "ETF", "Intl Equity", "Diversified", "Emerging", "USD", "Traditional IRA", 480, 41.8, 44.92, -0.36, -1.4, 0.6, 7, 3.2, 0.08, 0.96, 20, 1, "A thin emerging-markets sleeve inside the IRA."],
  ["BND", "Vanguard Total Bond Market", "ETF", "Bonds", "Fixed Income", "United States", "USD", "Traditional IRA", 980, 79.4, 72.18, 0.08, 0.4, 1.1, 3, 3.8, 0.03, 0.08, 6, 5, "The bond ballast. Below cost, and below the weight the plan calls for."],
  ["VTEB", "Vanguard Tax-Exempt Bond", "ETF", "Bonds", "Fixed Income", "United States", "USD", "Taxable", 410, 52.1, 50.44, 0.04, 0.2, 0.8, 2, 3.1, 0.05, 0.06, 5, 2, "Municipal bonds in taxable, so the yield is worth more than it looks."],
  ["VNQ", "Vanguard Real Estate", "ETF", "Real Estate", "Real Estate", "United States", "USD", "Roth IRA", 260, 86.2, 91.75, -0.55, -0.8, 1.2, 5, 3.9, 0.13, 0.92, 20, 1, "Listed real estate, held in the Roth. A small slice of the plan."],
  ["GLD", "SPDR Gold Shares", "ETF", "Commodities", "Commodities", "Global", "USD", "Taxable", 85, 168.4, 242.55, 0.92, 2.8, 6.1, 28, 0, 0.4, 0.02, 15, 2, "The expensive diversifier. A 0.40% fee for a metal that pays nothing."],
  ["BTC", "Bitcoin", "Crypto", "Crypto", "Crypto", "Global", "USD", "Taxable", 1.85, 28400, 67420, 3.4, 11.2, 18.4, 112, 0, 0, 1.85, 62, -7, "A deliberate satellite. Size is the whole risk question."],
  ["ETH", "Ethereum", "Crypto", "Crypto", "Crypto", "Global", "USD", "Taxable", 12.4, 1820, 3485, 2.15, 6.8, 9.1, 48, 0, 0, 1.72, 70, -4, "The second crypto line. Moves with Bitcoin, so it diversifies less than it appears."],
  ["CASH", "US dollar cash", "Cash", "Cash", "Cash", "United States", "USD", "Cash Reserve", 42680, 1, 1, 0, 0.38, 1.12, 4.6, 4.6, 0, 0, 0.4, 1, "Dry powder in the reserve account, earning a treasury rate."],
  ["SPAXX", "Government money market", "Cash", "Cash", "Cash", "United States", "USD", "Taxable", 18620, 1, 1, 0, 0.4, 1.18, 4.82, 4.82, 0, 0, 0.5, 1, "Sweep cash in the taxable account. Easy to forget, and currently well paid."],
] as const;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function spark(seed: number, end: number, vol: number, n = 36) {
  const rand = rng(seed);
  const values: number[] = [];
  let v = end / (1 + rand() * 0.45 + 0.08);
  for (let i = 0; i < n - 1; i++) {
    const drift = Math.log(end / Math.max(v, 0.01)) / (n - i);
    const shock = (rand() - 0.5) * (vol / 100) * 0.7;
    v = Math.max(0.01, v * (1 + drift * 0.55 + shock));
    values.push(v);
  }
  values.push(end);
  return values;
}

const drafted: Omit<Holding, "weight">[] = RAW.map((r) => {
  const qty = r[8] as number;
  const cost = r[9] as number;
  const price = r[10] as number;
  const dayPct = r[11] as number;
  const value = qty * price;
  const costBasis = qty * cost;
  const gain = value - costBasis;
  const series = spark(
    [...(r[0] as string)].reduce((s, c) => s + c.charCodeAt(0) * 13, 41),
    price,
    r[18] as number,
  );
  return {
    id: r[0] as string,
    ticker: r[0] as string,
    name: r[1] as string,
    type: r[2] as AssetType,
    assetClass: r[3] as AssetClass,
    sector: r[4] as string,
    region: r[5] as string,
    currency: r[6] as string,
    account: r[7] as AccountId,
    qty,
    cost,
    price,
    dayPct,
    yieldPct: r[15] as number,
    expense: r[16] as number,
    beta: r[17] as number,
    vol: r[18] as number,
    scoreImpact: r[19] as number,
    blurb: r[20] as string,
    value,
    costBasis,
    gain,
    gainPct: costBasis ? (gain / costBasis) * 100 : 0,
    dayPnl: value * (dayPct / 100) / (1 + dayPct / 100),
    income: value * ((r[15] as number) / 100),
    fee: value * ((r[16] as number) / 100),
    spark: series,
    low52: Math.min(...series, price),
    high52: Math.max(...series, price),
    monthPct: r[12] as number,
    ytdPct: r[13] as number,
    ret1y: r[14] as number,
  };
});

export const TOTAL = drafted.reduce((s, h) => s + h.value, 0);
export const COST_BASIS = drafted.reduce((s, h) => s + h.costBasis, 0);
export const UNREALISED = TOTAL - COST_BASIS;
export const DAY_PNL = drafted.reduce((s, h) => s + h.dayPnl, 0);
export const DAY_PCT = (DAY_PNL / (TOTAL - DAY_PNL)) * 100;
export const CASH = drafted.filter((h) => h.assetClass === "Cash").reduce((s, h) => s + h.value, 0);
export const INCOME = drafted.reduce((s, h) => s + h.income, 0);
export const FEES = drafted.reduce((s, h) => s + h.fee, 0);
export const WEIGHTED_ER = (FEES / TOTAL) * 100;
export const YIELD = (INCOME / TOTAL) * 100;
export const YIELD_ON_COST = (INCOME / COST_BASIS) * 100;

const EXPLICIT: Record<string, number> = {};
const grids: Record<number, number[]> = {
  2021: [2.1, 1.4, 3.2, 4.1, -0.8, 2.4, 1.8, 2.6, -3.1, 5.2, 0.6, 3.4],
  2022: [-4.8, -2.6, 2.1, -7.4, -1.2, -8.1, 6.4, -3.8, -7.6, 5.2, 4.8, -3.4],
  2023: [5.8, -1.6, 2.4, 1.2, 0.4, 4.6, 2.8, -1.9, -3.8, -2.1, 7.2, 4.1],
  2024: [1.6, 4.2, 2.8, -3.4, 4.8, 3.1, 1.2, 1.8, 2.4, -1.1, 5.6, -0.8],
  2025: [2.8, -1.4, -4.2, 1.6, 5.1, 3.4, 2.2, 1.1, 2.6, 1.8, 2.4, -1.6],
  2026: [-2.4, -2.1, 3.6],
};
for (const [year, arr] of Object.entries(grids)) {
  arr.forEach((v, i) => {
    EXPLICIT[`${year}-${String(i + 1).padStart(2, "0")}`] = v / 100;
  });
}

function monthList(start: string, end: string) {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  const out: string[] = [];
  let y = sy;
  let m = sm;
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

const ALL_MONTHS = monthList("2018-03", "2026-03");
const rand = rng(11);

export const SERIES = ALL_MONTHS.map((ym) => {
  if (ym === "2018-03") return { ym, ret: 0 };
  if (EXPLICIT[ym] != null) return { ym, ret: EXPLICIT[ym] };
  if (ym === "2020-02") return { ym, ret: -0.012 };
  if (ym === "2020-03") return { ym, ret: -0.178 };
  if (ym === "2020-04") return { ym, ret: 0.096 };
  if (ym === "2020-05") return { ym, ret: 0.048 };
  if (ym === "2020-11") return { ym, ret: 0.074 };
  const year = Number(ym.slice(0, 4));
  const drift = year <= 2018 ? 0.002 : 0.008;
  const vol = 0.018;
  return { ym, ret: drift + (rand() - 0.48) * vol * 2 };
});

function flowFor(ym: string) {
  if (ym === "2018-03") return 0;
  if (ym === "2022-10") return -12000;
  if (ym === "2024-11") return 20000;
  if (ym === "2020-04") return 8000;
  if (ym === "2026-01") return 4000;
  if (ym === "2026-02") return 6000;
  if (ym === "2026-03") return 2000;
  const r = rng([...ym].reduce((s, c) => s + c.charCodeAt(0), 3))();
  if (r < 0.12) return 0;
  return 1800 + Math.round(r * 1400);
}

const rawPath: { ym: string; ret: number; flow: number; value: number; invested: number }[] = [];
let value = 180000;
let invested = 180000;
for (const row of SERIES) {
  const flow = flowFor(row.ym);
  if (row.ym !== "2018-03") {
    value = value * (1 + row.ret) + flow;
    invested += flow;
  }
  rawPath.push({ ym: row.ym, ret: row.ret, flow, value, invested });
}
const SCALE = TOTAL / rawPath[rawPath.length - 1].value;

export type Point = {
  ym: string;
  ret: number;
  flow: number;
  value: number;
  invested: number;
  peak: number;
  dd: number;
  partial?: boolean;
};

export const HISTORY: Point[] = rawPath.map((p, i) => ({
  ym: p.ym,
  ret: p.ret,
  flow: p.flow * SCALE,
  value: i === rawPath.length - 1 ? TOTAL : p.value * SCALE,
  invested: p.invested * SCALE,
  peak: 0,
  dd: 0,
  partial: p.ym === "2026-03",
}));
{
  let peak = -Infinity;
  for (const p of HISTORY) {
    peak = Math.max(peak, p.value);
    p.peak = peak;
    p.dd = p.value / peak - 1;
  }
}

const monthRetTarget = EXPLICIT["2026-02"] * 100;
const ytdTarget = compound([EXPLICIT["2026-01"], EXPLICIT["2026-02"], EXPLICIT["2026-03"]]) * 100;
const last12 = HISTORY.slice(-12).map((p) => p.ret);
export const RET_1Y = compound(last12) * 100;
const ytdWeighted =
  drafted.reduce((s, h) => s + h.value * (h.ytdPct as unknown as number), 0) / TOTAL;
const mWeighted = drafted.reduce((s, h) => s + h.value * (h.monthPct as unknown as number), 0) / TOTAL;
const y1Weighted = drafted.reduce((s, h) => s + h.value * (h.ret1y as unknown as number), 0) / TOTAL;

export const HOLDINGS: Holding[] = drafted
  .map((h) => ({
    ...h,
    weight: (h.value / TOTAL) * 100,
    monthPct: mWeighted ? (h.monthPct * monthRetTarget) / mWeighted : h.monthPct,
    ytdPct: ytdWeighted ? (h.ytdPct * ytdTarget) / ytdWeighted : h.ytdPct,
    ret1y: y1Weighted ? (h.ret1y * RET_1Y) / y1Weighted : h.ret1y,
  }))
  .sort((a, b) => b.value - a.value);

export const holding = (ticker: string) => HOLDINGS.find((h) => h.ticker === ticker)!;

export const CLASS_ORDER: AssetClass[] = [
  "US Equity",
  "Intl Equity",
  "Bonds",
  "Real Estate",
  "Commodities",
  "Crypto",
  "Cash",
];

export const TARGETS: Record<AssetClass, number> = {
  "US Equity": 48,
  "Intl Equity": 18,
  Bonds: 18,
  "Real Estate": 5,
  Commodities: 3,
  Crypto: 4,
  Cash: 4,
};

export const CLASSES = CLASS_ORDER.map((name) => {
  const rows = HOLDINGS.filter((h) => h.assetClass === name);
  const v = rows.reduce((s, h) => s + h.value, 0);
  const cost = rows.reduce((s, h) => s + h.costBasis, 0);
  const gain = v - cost;
  const weight = (v / TOTAL) * 100;
  const target = TARGETS[name];
  return {
    name,
    value: v,
    cost,
    gain,
    gainPct: cost ? (gain / cost) * 100 : 0,
    weight,
    target,
    drift: weight - target,
    dollars: ((target - weight) / 100) * TOTAL,
    dayPnl: rows.reduce((s, h) => s + h.dayPnl, 0),
    income: rows.reduce((s, h) => s + h.income, 0),
    ret1y: v ? rows.reduce((s, h) => s + h.ret1y * h.value, 0) / v : 0,
    monthPct: v ? rows.reduce((s, h) => s + h.monthPct * h.value, 0) / v : 0,
    holdings: rows,
  };
});

export const ACCOUNTS: { id: AccountId; name: string; shelter: string }[] = [
  { id: "Taxable", name: "Taxable brokerage", shelter: "Taxable" },
  { id: "Traditional IRA", name: "Traditional IRA", shelter: "Tax-deferred" },
  { id: "Roth IRA", name: "Roth IRA", shelter: "Tax-free" },
  { id: "Cash Reserve", name: "Cash reserve", shelter: "Cash" },
];

export const ACCOUNT_ROLLUP = ACCOUNTS.map((a) => {
  const rows = HOLDINGS.filter((h) => h.account === a.id);
  const v = rows.reduce((s, h) => s + h.value, 0);
  return { ...a, value: v, weight: (v / TOTAL) * 100, holdings: rows, gain: rows.reduce((s, h) => s + h.gain, 0) };
});

export const PERIODS = {
  today: DAY_PCT,
  week: 1.84,
  month: HISTORY[HISTORY.length - 1].ret * 100,
  ytd: ytdTarget,
  oneYear: RET_1Y,
  threeYear: compound(HISTORY.slice(-36).map((p) => p.ret)) * 100,
  fiveYear: compound(HISTORY.slice(-60).map((p) => p.ret)) * 100,
  since: compound(HISTORY.slice(1).map((p) => p.ret)) * 100,
};

export function benchRet(kind: "7030" | "spx" | "agg", port: number) {
  if (kind === "spx") return port * 0.9 + 0.0016;
  if (kind === "agg") return port * 0.12 + 0.0024;
  return port * 0.78 + 0.0014;
}

export function indexed(kind: "7030" | "spx" | "agg" = "7030") {
  let p = 100;
  let b = 100;
  return HISTORY.map((row, i) => {
    if (i === 0) return { ym: row.ym, port: 100, bench: 100, excess: 0 };
    p *= 1 + row.ret;
    b *= 1 + benchRet(kind, row.ret);
    return { ym: row.ym, port: p, bench: b, excess: p - b };
  });
}

export function periodFrom(returns: number[]) {
  const last = (n: number) => compound(returns.slice(-n));
  return {
    month: returns[returns.length - 1],
    ytd: compound(returns.slice(-3)),
    oneYear: last(12),
    threeYear: last(36),
    fiveYear: last(60),
    since: compound(returns),
  };
}

export const BENCH_PERIODS = {
  "7030": periodFrom(HISTORY.slice(1).map((p) => benchRet("7030", p.ret))),
  spx: periodFrom(HISTORY.slice(1).map((p) => benchRet("spx", p.ret))),
  agg: periodFrom(HISTORY.slice(1).map((p) => benchRet("agg", p.ret))),
};

export const BENCH_NAMES = {
  "7030": "Global 70/30",
  spx: "S&P 500",
  agg: "US Aggregate bonds",
} as const;

export type Episode = {
  id: string;
  name: string;
  start: string;
  trough: string;
  end: string | null;
  peakValue: number;
  troughValue: number;
  depth: number;
  monthsDown: number;
  monthsRecover: number | null;
  recovered: boolean;
};

export const EPISODES: Episode[] = (() => {
  const out: Episode[] = [];
  let i = 0;
  while (i < HISTORY.length) {
    if (HISTORY[i].dd > -0.04) {
      i += 1;
      continue;
    }
    const start = i;
    let trough = i;
    while (i < HISTORY.length && HISTORY[i].dd < -0.005) {
      if (HISTORY[i].dd < HISTORY[trough].dd) trough = i;
      i += 1;
    }
    const recovered = i < HISTORY.length && HISTORY[i - 1].dd >= -0.005;
    const endIdx = recovered ? i - 1 : HISTORY.length - 1;
    const depth = HISTORY[trough].dd;
    if (depth > -0.04) continue;
    const startYm = HISTORY[start].ym;
    const name = startYm.startsWith("2020")
      ? "Pandemic break"
      : startYm.startsWith("2022")
        ? "Inflation bear"
        : !recovered
          ? "Open drawdown"
          : depth < -0.1
            ? "Sharp pullback"
            : "Shallow dip";
    out.push({
      id: `${startYm}-${trough}`,
      name,
      start: startYm,
      trough: HISTORY[trough].ym,
      end: recovered ? HISTORY[endIdx].ym : null,
      peakValue: HISTORY[start].peak,
      troughValue: HISTORY[trough].value,
      depth,
      monthsDown: trough - start + 1,
      monthsRecover: recovered ? endIdx - trough : null,
      recovered,
    });
  }
  return out.sort((a, b) => a.depth - b.depth);
})();

export const CURRENT_DD = HISTORY[HISTORY.length - 1].dd;
export const PEAK_VALUE = HISTORY[HISTORY.length - 1].peak;
export const MONTHS_FROM_PEAK = (() => {
  let i = HISTORY.length - 1;
  while (i > 0 && HISTORY[i].value < HISTORY[i].peak - 1) i -= 1;
  return HISTORY.length - 1 - i;
})();

const NOTES: Record<string, string> = {
  "2020-03": "Pandemic low. Equities and credit fell together; cash was the only quiet line.",
  "2022-04": "Rates repriced. Duration hurt the bond sleeve as stocks fell.",
  "2022-06": "Inflation shock. The worst month of that bear. Bonds did not diversify.",
  "2022-09": "A second leg down as yields jumped again.",
  "2022-10": "A violent bounce off the low. Cash was withdrawn the same month.",
  "2023-01": "The year opened with a broad rally led by last year's losers.",
  "2023-11": "Markets decided the hiking cycle was over. Risk assets ran.",
  "2024-11": "A concentrated rally. A large contribution landed the same month.",
  "2025-03": "Growth scare. The book's winners gave back a piece.",
  "2025-12": "The peak month gave way. A quiet fade into year-end.",
  "2026-01": "The fade continued. Defensive lines held; crypto did not.",
  "2026-02": "A soft month. The winners led the decline, and cash was still added.",
  "2026-03": "Month to date. A partial repair of the winter pullback.",
};

export function monthNote(ym: string, ret: number) {
  if (NOTES[ym]) return NOTES[ym];
  if (ret < -0.05) return "A hard down month. Growth and the satellite sleeve did most of the damage.";
  if (ret > 0.05) return "A strong month. A handful of winners did more than their share.";
  if (ret < 0) return "A soft month. Defensive holdings cushioned the book.";
  return "A quiet gain, close to the pace of a normal month.";
}

export const MONTHLY_YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

export function yearReturns(year: number) {
  return HISTORY.filter((p) => p.ym.startsWith(String(year)) && p.ym !== "2018-03").map((p) => p.ret);
}

export const MILESTONES = (() => {
  const events: { ym: string; title: string; detail: string; value: number; kind: string }[] = [
    {
      ym: HISTORY[0].ym,
      title: "Book opened",
      detail: "First funding. A plain brokerage, an IRA, and a cash reserve.",
      value: HISTORY[0].value,
      kind: "start",
    },
  ];
  const marks = [
    { level: 250000, title: "Crossed $250,000", detail: "The book stopped feeling like a starter account." },
    { level: 500000, title: "Crossed $500,000", detail: "Halfway, emotionally, to the first million." },
    { level: 750000, title: "Crossed $750,000", detail: "Contributions still mattered, but growth mattered more." },
    { level: 1000000, title: "Crossed $1,000,000", detail: "The round number. Nothing changed, and everything did." },
    { level: 1200000, title: "Crossed $1,200,000", detail: "Within sight of the present value." },
  ];
  for (const mark of marks) {
    const hit = HISTORY.find((p) => p.value >= mark.level);
    if (hit) events.push({ ym: hit.ym, title: mark.title, detail: mark.detail, value: hit.value, kind: "cross" });
  }
  const covid = HISTORY.filter((p) => p.ym.startsWith("2020")).reduce((a, b) => (a.value < b.value ? a : b));
  events.push({
    ym: covid.ym,
    title: "Pandemic low",
    detail: "The fastest decline in the record. Recovery took months, not years.",
    value: covid.value,
    kind: "low",
  });
  const bear = HISTORY.filter((p) => p.ym.startsWith("2022")).reduce((a, b) => (a.value < b.value ? a : b));
  events.push({
    ym: bear.ym,
    title: "2022 trough",
    detail: "The deepest fall. Equities and bonds declined together.",
    value: bear.value,
    kind: "low",
  });
  const peak = HISTORY.reduce((a, b) => (a.value > b.value ? a : b));
  if (peak.ym !== HISTORY[HISTORY.length - 1].ym) {
    events.push({
      ym: peak.ym,
      title: "All-time high",
      detail: "The mark the book is still climbing back toward.",
      value: peak.value,
      kind: "peak",
    });
  }
  events.push({
    ym: HISTORY[HISTORY.length - 1].ym,
    title: "Today",
    detail: `${AS_OF}. A partial repair of the winter pullback.`,
    value: TOTAL,
    kind: "now",
  });
  return events.sort((a, b) => a.ym.localeCompare(b.ym));
})();

export const CORR_LABELS = ["NVDA", "AAPL", "MSFT", "VTI", "VXUS", "BTC", "ETH", "XOM", "GLD", "BND"];
export const CORR: number[][] = [
  [1, 0.68, 0.7, 0.74, 0.51, 0.41, 0.38, 0.15, 0.08, -0.18],
  [0.68, 1, 0.72, 0.81, 0.62, 0.32, 0.29, 0.28, 0.05, -0.08],
  [0.7, 0.72, 1, 0.84, 0.58, 0.28, 0.26, 0.22, 0.02, -0.12],
  [0.74, 0.81, 0.84, 1, 0.78, 0.36, 0.33, 0.42, 0.1, -0.05],
  [0.51, 0.62, 0.58, 0.78, 1, 0.29, 0.27, 0.48, 0.16, -0.02],
  [0.41, 0.32, 0.28, 0.36, 0.29, 1, 0.82, 0.12, 0.18, -0.04],
  [0.38, 0.29, 0.26, 0.33, 0.27, 0.82, 1, 0.1, 0.14, -0.06],
  [0.15, 0.28, 0.22, 0.42, 0.48, 0.12, 0.1, 1, 0.31, -0.16],
  [0.08, 0.05, 0.02, 0.1, 0.16, 0.18, 0.14, 0.31, 1, 0.22],
  [-0.18, -0.08, -0.12, -0.05, -0.02, -0.04, -0.06, -0.16, 0.22, 1],
];

export const CORR_PAIRS = CORR_LABELS.flatMap((a, i) =>
  CORR_LABELS.slice(i + 1).map((b, j) => {
    const corr = CORR[i][i + 1 + j];
    const ha = holding(a);
    const hb = holding(b);
    return {
      a,
      b,
      nameA: ha.name,
      nameB: hb.name,
      corr,
      weight: ha.weight + hb.weight,
      same: ha.assetClass === hb.assetClass,
    };
  }),
).sort((p, q) => Math.abs(q.corr) - Math.abs(p.corr));

const RISK_RAW: Record<string, number> = {
  NVDA: 18.4,
  BTC: 14.2,
  VTI: 13.6,
  AAPL: 7.4,
  ETH: 6.8,
  MSFT: 6.2,
  VXUS: 4.4,
  "BRK.B": 3.2,
  GOOGL: 2.8,
  ASML: 2.4,
  XOM: 2.2,
  VNQ: 1.8,
  AMZN: 1.6,
  VWO: 1.6,
  GLD: 1.4,
  UNH: 1.1,
  NVO: 1.0,
  JNJ: 0.8,
  BND: 0.6,
  VTEB: 0.3,
  CASH: 0.02,
  SPAXX: 0.02,
};
const riskSum = Object.values(RISK_RAW).reduce((s, n) => s + n, 0);
export const RISK = HOLDINGS.map((h) => ({
  ...h,
  risk: (RISK_RAW[h.ticker] / riskSum) * 100,
})).sort((a, b) => b.risk - a.risk);

const ATTR_RAW: Record<string, number> = {
  NVDA: 6.4,
  BTC: 3.8,
  VTI: 3.2,
  MSFT: 1.6,
  AAPL: 1.4,
  ETH: 1.1,
  GOOGL: 0.6,
  "BRK.B": 0.5,
  GLD: 0.4,
  ASML: 0.3,
  VXUS: 0.3,
  AMZN: 0.2,
  XOM: 0.2,
  CASH: 0.15,
  SPAXX: 0.08,
  UNH: 0.1,
  VNQ: 0.05,
  VWO: 0.02,
  JNJ: -0.1,
  VTEB: -0.08,
  NVO: -0.3,
  BND: -0.4,
};
const attrSum = Object.values(ATTR_RAW).reduce((s, n) => s + n, 0);
export const ATTRIBUTION = HOLDINGS.map((h) => ({
  ticker: h.ticker,
  name: h.name,
  weight: h.weight,
  points: (ATTR_RAW[h.ticker] / attrSum) * PERIODS.oneYear,
  assetClass: h.assetClass,
})).sort((a, b) => b.points - a.points);

export const GOAL = {
  name: "Independence",
  target: 2_400_000,
  by: "December 2034",
  years: 8.75,
  monthly: 2500,
  expectedReturn: 0.07,
  vol: 0.148,
};

export const INCOME_GOAL = 28000;

export const HEALTH = {
  score: 72,
  grade: "B",
  label: "Sound, with two things to watch",
  factors: [
    { id: "cost", name: "Cost", score: 91, note: "Weighted expense ratio is tiny. Gold is the only fee that shows." },
    { id: "cash", name: "Cash fit", score: 84, note: "Cash is inside the band and it is earning a real rate." },
    { id: "tax", name: "Tax location", score: 80, note: "Bonds sit mostly in the IRA. The muni sleeve is in taxable, on purpose." },
    { id: "risk", name: "Risk fit", score: 78, note: "Volatility is a little above the comfort band. Crypto is the swing factor." },
    { id: "div", name: "Diversification", score: 68, note: "Effective positions are fewer than the line count, because the tech names move together." },
    { id: "income", name: "Income", score: 64, note: "Forward yield covers a bit more than half of the income goal." },
    { id: "conc", name: "Concentration", score: 58, note: "Two lines break the 8% single-name guidance." },
    { id: "drift", name: "Target fit", score: 52, note: "US equity and crypto are heavy. International and bonds are light." },
  ],
};

export const POLICY = { singleNameCap: 8, cryptoCap: 4 };

export type Payment = {
  iso: string;
  ym: string;
  day: number;
  ticker: string;
  name: string;
  kind: "Dividend" | "Interest" | "Distribution";
  amount: number;
  status: "Declared" | "Estimated";
};

const PAY_MONTHS: Record<string, number[]> = {
  AAPL: [2, 5, 8, 11],
  MSFT: [3, 6, 9, 12],
  GOOGL: [3, 6, 9, 12],
  JNJ: [3, 6, 9, 12],
  UNH: [3, 6, 9, 12],
  XOM: [3, 6, 9, 12],
  ASML: [4, 10],
  NVO: [3, 8],
  VTI: [3, 6, 9, 12],
  VXUS: [3, 6, 9, 12],
  VWO: [3, 6, 9, 12],
  BND: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  VTEB: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  VNQ: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  CASH: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  SPAXX: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};
const PAY_DAY: Record<string, number> = {
  AAPL: 14,
  MSFT: 12,
  GOOGL: 16,
  JNJ: 10,
  UNH: 18,
  XOM: 10,
  ASML: 29,
  NVO: 26,
  VTI: 27,
  VXUS: 22,
  VWO: 22,
  BND: 4,
  VTEB: 6,
  VNQ: 2,
  CASH: 30,
  SPAXX: 30,
};

export const PAYMENTS: Payment[] = (() => {
  const out: Payment[] = [];
  const start = new Date(2026, 2, 18);
  const end = new Date(2027, 2, 18);
  for (const h of HOLDINGS) {
    const months = PAY_MONTHS[h.ticker];
    if (!months || h.income < 1) continue;
    const each = h.income / months.length;
    const kind: Payment["kind"] =
      h.assetClass === "Cash" ? "Interest" : h.type === "ETF" ? "Distribution" : "Dividend";
    for (const year of [2026, 2027]) {
      for (const month of months) {
        const day = Math.min(PAY_DAY[h.ticker] ?? 15, month === 2 ? 28 : 30);
        const dt = new Date(year, month - 1, day);
        if (dt < start || dt > end) continue;
        const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const soon = dt.getTime() - start.getTime() < 1000 * 60 * 60 * 24 * 35;
        out.push({
          iso,
          ym: iso.slice(0, 7),
          day,
          ticker: h.ticker,
          name: h.name,
          kind,
          amount: each,
          status: soon ? "Declared" : "Estimated",
        });
      }
    }
  }
  return out.sort((a, b) => a.iso.localeCompare(b.iso));
})();

export const INCOME_NEXT_12 = PAYMENTS.reduce((s, p) => s + p.amount, 0);

export function incomeHistory() {
  const interestNow = HOLDINGS.filter((h) => h.assetClass === "Bonds" || h.assetClass === "Cash").reduce(
    (s, h) => s + h.income,
    0,
  );
  const divNow = INCOME - interestNow;
  const rows: { ym: string; label: string; dividends: number; interest: number }[] = [];
  for (let i = 0; i < 36; i++) {
    const date = new Date(2023, 3 + i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const growth = 0.7 + (i / 35) * 0.3;
    const divSeason = [3, 6, 9, 12].includes(month) ? 1.45 : 0.78;
    const intSeason = 0.92 + (month % 5) * 0.03;
    rows.push({
      ym: `${year}-${String(month).padStart(2, "0")}`,
      label: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1]} ${String(year).slice(2)}`,
      dividends: (divNow / 12) * growth * divSeason,
      interest: (interestNow / 12) * growth * intSeason,
    });
  }
  const last = rows.slice(-12);
  const dSum = last.reduce((s, r) => s + r.dividends, 0) || 1;
  const iSum = last.reduce((s, r) => s + r.interest, 0) || 1;
  return rows.map((r) => ({
    ...r,
    dividends: r.dividends * (divNow / dSum),
    interest: r.interest * (interestNow / iSum),
  }));
}

export const CURRENCIES = [
  { code: "USD", name: "US dollar", share: 71.4, move: 0, note: "Home currency. Listing currency for most of the book." },
  { code: "EUR", name: "Euro", share: 8.6, move: -1.8, note: "ASML, plus Europe inside the international fund." },
  { code: "JPY", name: "Yen", share: 3.8, move: -4.2, note: "Held through funds, not as a single stock." },
  { code: "GBP", name: "Sterling", share: 3.1, move: 1.1, note: "A UK sleeve inside VXUS." },
  { code: "CNY", name: "Yuan", share: 2.6, move: -0.6, note: "Mostly the emerging-markets fund." },
  { code: "CHF", name: "Swiss franc", share: 1.6, move: 2.2, note: "Staples exposure inside the international fund." },
  { code: "DKK", name: "Danish krone", share: 1.4, move: 0.4, note: "Novo Nordisk." },
  { code: "OTHER", name: "Other", share: 7.5, move: -0.8, note: "A long tail of fund currencies." },
].map((c) => ({ ...c, amount: (c.share / 100) * TOTAL }));

export const CURRENCY_HOLDINGS: Record<string, string[]> = {
  USD: ["AAPL", "MSFT", "NVDA", "VTI", "BND", "CASH", "BTC"],
  EUR: ["ASML", "VXUS"],
  JPY: ["VXUS"],
  GBP: ["VXUS"],
  CNY: ["VWO"],
  CHF: ["VXUS"],
  DKK: ["NVO"],
  OTHER: ["VWO", "VXUS", "GLD"],
};

export function bridge(which: "1y" | "3y" | "si") {
  if (which === "si") {
    const currency = Math.round(UNREALISED * 0.042);
    const market = UNREALISED - currency;
    const income = Math.round(INCOME * 2.6);
    const net = COST_BASIS - income;
    const opening = Math.round(HISTORY[0].value);
    const later = net - opening;
    return [
      { key: "open", label: "Opening value", amount: opening, tone: "base" },
      { key: "flow", label: later >= 0 ? "Later contributions" : "Later withdrawals", amount: later, tone: "flow" },
      { key: "income", label: "Income retained", amount: income, tone: "income" },
      { key: "market", label: "Market gains", amount: market, tone: "market" },
      { key: "fx", label: "Currency effect", amount: currency, tone: "fx" },
    ];
  }
  const end = TOTAL;
  if (which === "1y") {
    const parts = [
      { key: "flow", label: "Contributions", amount: 38400, tone: "flow" },
      { key: "out", label: "Withdrawals", amount: -6200, tone: "flow" },
      { key: "market", label: "Market gains", amount: Math.round(end * 0.118), tone: "market" },
      { key: "income", label: "Income retained", amount: 14860, tone: "income" },
      { key: "fx", label: "Currency effect", amount: -2234, tone: "fx" },
    ];
    const opening = end - parts.reduce((s, p) => s + p.amount, 0);
    return [{ key: "open", label: "Value a year ago", amount: opening, tone: "base" }, ...parts];
  }
  const parts = [
    { key: "flow", label: "Contributions", amount: 156000, tone: "flow" },
    { key: "out", label: "Withdrawals", amount: -18400, tone: "flow" },
    { key: "market", label: "Market gains", amount: Math.round(end * 0.42), tone: "market" },
    { key: "income", label: "Income retained", amount: 42600, tone: "income" },
    { key: "fx", label: "Currency effect", amount: 15246, tone: "fx" },
  ];
  const opening = end - parts.reduce((s, p) => s + p.amount, 0);
  return [{ key: "open", label: "Value three years ago", amount: opening, tone: "base" }, ...parts];
}

export const TRADES = [
  { side: "SELL" as const, ticker: "NVDA", shares: 28, reason: "Trim a winner that breaks the single-name cap." },
  { side: "SELL" as const, ticker: "BTC", shares: 0.42, reason: "Crypto is well above its 4% ceiling." },
  { side: "SELL" as const, ticker: "ETH", shares: 3.2, reason: "Same sleeve, smaller line. It moves with Bitcoin." },
  { side: "SELL" as const, ticker: "AAPL", shares: 50, reason: "Thin the US single-name cluster." },
  { side: "SELL" as const, ticker: "VTI", shares: 60, reason: "US equity is the overweight class." },
  { side: "BUY" as const, ticker: "VXUS", shares: 620, reason: "International is the largest underweight." },
  { side: "BUY" as const, ticker: "VWO", shares: 340, reason: "Emerging markets are a thin slice of a thin sleeve." },
  { side: "BUY" as const, ticker: "BND", shares: 680, reason: "Bonds are about half their target." },
  { side: "BUY" as const, ticker: "VNQ", shares: 150, reason: "Real estate is below the 5% mark." },
  { side: "BUY" as const, ticker: "GLD", shares: 28, reason: "Close part of the commodity gap. Mind the fee." },
];

export function tradeRows() {
  return TRADES.map((t) => {
    const h = holding(t.ticker);
    const amount = t.shares * h.price * (t.side === "SELL" ? 1 : 1);
    const gainPer = h.price - h.cost;
    const realised = t.side === "SELL" ? t.shares * gainPer : 0;
    const tax = realised > 0 ? realised * 0.15 : 0;
    return { ...t, name: h.name, price: h.price, amount, realised, tax, account: h.account };
  });
}

export type Lot = { date: string; qty: number; cost: number; term: string };

const SPECIAL_LOTS: Record<string, Lot[]> = {
  NVDA: [
    { date: "11 Aug 2020", qty: 50, cost: 98.4, term: "Long-term" },
    { date: "03 Feb 2022", qty: 40, cost: 156.2, term: "Long-term" },
    { date: "19 May 2023", qty: 40, cost: 248.75, term: "Long-term" },
    { date: "12 Jun 2025", qty: 30, cost: 290.2, term: "Short-term" },
  ],
};

export function lotsFor(h: Holding): Lot[] {
  if (SPECIAL_LOTS[h.ticker]) return SPECIAL_LOTS[h.ticker];
  if (h.type === "Cash") return [{ date: "Sweep", qty: h.qty, cost: 1, term: "Cash" }];
  const q1 = h.type === "Crypto" ? Math.round(h.qty * 0.42 * 100) / 100 : Math.max(1, Math.round(h.qty * 0.42));
  const q2 = Math.round((h.qty - q1) * 1000) / 1000;
  const c1 = h.cost * 0.74;
  const c2 = q2 ? (h.qty * h.cost - q1 * c1) / q2 : h.cost;
  return [
    { date: "14 Mar 2020", qty: q1, cost: c1, term: "Long-term" },
    { date: "12 Jun 2025", qty: q2, cost: c2, term: "Short-term" },
  ];
}

export const FUNDS = {
  left: {
    ticker: "VTI",
    name: "Vanguard Total Stock Market",
    style: "Index ETF",
    expense: 0.03,
    yield: 1.3,
    holdings: 3612,
    top10: 32,
    turnover: 3,
    beta: 1,
    aum: "$1.8T",
    y1: 16.4,
    y5: 13.1,
    track: 0.02,
    note: "Owns the whole US market for three basis points.",
  },
  right: {
    ticker: "NLGX",
    name: "Northline Select Growth",
    style: "Active mutual fund",
    expense: 0.78,
    yield: 0.42,
    holdings: 48,
    top10: 61,
    turnover: 62,
    beta: 1.18,
    aum: "$4.2B",
    y1: 21.6,
    y5: 11.4,
    track: 1.8,
    note: "A concentrated growth fund. Won last year. Lost the five-year race, after fees.",
  },
};

export const FEB = (() => {
  const feb = HISTORY.find((p) => p.ym === "2026-02")!;
  const jan = HISTORY.find((p) => p.ym === "2026-01")!;
  const market = jan.value * feb.ret;
  return {
    start: jan.value,
    end: feb.value,
    flow: feb.flow,
    market,
    ret: feb.ret,
  };
})();

export const CASH_YIELD = (() => {
  const rows = HOLDINGS.filter((h) => h.assetClass === "Cash");
  const income = rows.reduce((s, h) => s + h.income, 0);
  return income / CASH;
})();

export const VOL = 14.8;
export const BETA = 0.86;
export const SHARPE = 0.74;
export const WORST = Math.min(...HISTORY.map((p) => p.dd)) * 100;

export function topWeight(n: number) {
  return HOLDINGS.slice()
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n)
    .reduce((s, h) => s + h.weight, 0);
}

export const EFFECTIVE_N = (() => {
  const w = HOLDINGS.map((h) => h.weight / 100);
  const hhi = w.reduce((s, x) => s + x * x, 0);
  return 1 / hhi;
})();
