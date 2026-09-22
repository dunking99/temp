export type Lot = { qty: number; cost: number; date: string; term: "LT" | "ST" };

export type Holding = {
  ticker: string;
  name: string;
  qty: number;
  avgCost: number;
  price: number;
  assetClass: string;
  sector: string;
  region: string;
  account: string;
  dayPct: number;
  expense: number;
  yieldFwd: number;
  lots: Lot[];
};

export const investor = {
  name: "Marcus Hale",
  household: "Hale household",
  city: "Austin, Texas",
  homeMarket: "United States",
  base: "USD",
  inception: "14 March 2021",
  asOf: "14 March 2026",
  asOfTime: "16:42 ET",
  asOfStamp: "14 Mar 2026, 16:42 ET",
  delay: "15 minutes",
};

export const accounts = [
  { id: "schwab", name: "Schwab Taxable", short: "Schwab", type: "Taxable brokerage", cash: 72840, rate: 0.0421, vehicle: "SWVXX", opened: "2016" },
  { id: "fidelity", name: "Fidelity IRA", short: "Fidelity", type: "Traditional IRA", cash: 48215, rate: 0.0467, vehicle: "SPAXX", opened: "2014" },
  { id: "vanguard", name: "Vanguard Roth", short: "Vanguard", type: "Roth IRA", cash: 31090, rate: 0.0455, vehicle: "VMFXX", opened: "2018" },
  { id: "ibkr", name: "IBKR Joint", short: "IBKR", type: "Joint taxable", cash: 34275, rate: 0.0408, vehicle: "Idle USD", opened: "2021" },
];

function lots(qty: number, avg: number, d1: string, d2: string): Lot[] {
  const q1 = Math.max(1, Math.round(qty * 0.62));
  const q2 = qty - q1;
  if (q2 <= 0) return [{ qty, cost: avg, date: d1, term: "LT" }];
  const c1 = Math.round(avg * 0.84 * 100) / 100;
  const c2 = Math.round(((avg * qty - c1 * q1) / q2) * 100) / 100;
  return [
    { qty: q1, cost: c1, date: d1, term: "LT" },
    { qty: q2, cost: c2, date: d2, term: "ST" },
  ];
}

export const holdings: Holding[] = [
  { ticker: "VTI", name: "Vanguard Total Stock Market ETF", qty: 1680, avgCost: 206.4, price: 286.42, assetClass: "US Equity", sector: "Broad Market", region: "United States", account: "schwab", dayPct: 0.0092, expense: 0.0003, yieldFwd: 0.0128, lots: lots(1680, 206.4, "2021-04-12", "2025-11-03") },
  { ticker: "AAPL", name: "Apple Inc.", qty: 310, avgCost: 148.2, price: 231.84, assetClass: "US Equity", sector: "Technology", region: "United States", account: "fidelity", dayPct: 0.0096, expense: 0, yieldFwd: 0.0044, lots: lots(310, 148.2, "2021-06-18", "2025-08-21") },
  { ticker: "MSFT", name: "Microsoft Corp.", qty: 165, avgCost: 274.5, price: 428.9, assetClass: "US Equity", sector: "Technology", region: "United States", account: "fidelity", dayPct: -0.0058, expense: 0, yieldFwd: 0.0071, lots: lots(165, 274.5, "2022-01-14", "2025-12-02") },
  { ticker: "NVDA", name: "NVIDIA Corp.", qty: 78, avgCost: 512.4, price: 924.15, assetClass: "US Equity", sector: "Technology", region: "United States", account: "schwab", dayPct: 0.0262, expense: 0, yieldFwd: 0.0003, lots: lots(78, 512.4, "2023-05-19", "2025-09-15") },
  { ticker: "AVUV", name: "Avantis U.S. Small Cap Value", qty: 1420, avgCost: 74.3, price: 96.18, assetClass: "US Equity", sector: "Broad Market", region: "United States", account: "vanguard", dayPct: 0.0041, expense: 0.0025, yieldFwd: 0.0168, lots: lots(1420, 74.3, "2022-03-08", "2025-06-11") },
  { ticker: "SCHD", name: "Schwab US Dividend Equity ETF", qty: 980, avgCost: 71.25, price: 84.62, assetClass: "US Equity", sector: "Equity Income", region: "United States", account: "schwab", dayPct: 0.0033, expense: 0.0006, yieldFwd: 0.0346, lots: lots(980, 71.25, "2021-09-02", "2025-10-16") },
  { ticker: "QQQ", name: "Invesco QQQ Trust", qty: 85, avgCost: 352.1, price: 512.4, assetClass: "US Equity", sector: "Technology", region: "United States", account: "vanguard", dayPct: 0.0114, expense: 0.002, yieldFwd: 0.0056, lots: lots(85, 352.1, "2023-11-06", "2025-07-22") },
  { ticker: "JPM", name: "JPMorgan Chase & Co.", qty: 140, avgCost: 142.8, price: 248.6, assetClass: "US Equity", sector: "Financials", region: "United States", account: "ibkr", dayPct: 0.0068, expense: 0, yieldFwd: 0.021, lots: lots(140, 142.8, "2022-08-19", "2025-05-09") },
  { ticker: "JNJ", name: "Johnson & Johnson", qty: 180, avgCost: 158.4, price: 162.35, assetClass: "US Equity", sector: "Healthcare", region: "United States", account: "schwab", dayPct: -0.0022, expense: 0, yieldFwd: 0.0308, lots: lots(180, 158.4, "2021-12-01", "2026-01-14") },
  { ticker: "UNH", name: "UnitedHealth Group", qty: 42, avgCost: 498, price: 412.7, assetClass: "US Equity", sector: "Healthcare", region: "United States", account: "fidelity", dayPct: -0.0148, expense: 0, yieldFwd: 0.0162, lots: lots(42, 498, "2024-02-12", "2025-04-28") },
  { ticker: "XOM", name: "Exxon Mobil Corp.", qty: 210, avgCost: 98.5, price: 118.42, assetClass: "US Equity", sector: "Energy", region: "United States", account: "ibkr", dayPct: 0.0084, expense: 0, yieldFwd: 0.0328, lots: lots(210, 98.5, "2022-10-04", "2025-03-18") },
  { ticker: "COST", name: "Costco Wholesale", qty: 36, avgCost: 542, price: 978.2, assetClass: "US Equity", sector: "Consumer Staples", region: "United States", account: "schwab", dayPct: 0.0051, expense: 0, yieldFwd: 0.0052, lots: lots(36, 542, "2021-07-22", "2025-02-11") },
  { ticker: "CAT", name: "Caterpillar Inc.", qty: 70, avgCost: 248, price: 392.4, assetClass: "US Equity", sector: "Industrials", region: "United States", account: "ibkr", dayPct: 0.0074, expense: 0, yieldFwd: 0.0148, lots: lots(70, 248, "2023-01-20", "2025-08-05") },
  { ticker: "DIS", name: "Walt Disney Co.", qty: 160, avgCost: 98.5, price: 112.3, assetClass: "US Equity", sector: "Communication", region: "United States", account: "schwab", dayPct: -0.0064, expense: 0, yieldFwd: 0.0088, lots: lots(160, 98.5, "2022-11-15", "2026-01-08") },
  { ticker: "LIN", name: "Linde plc", qty: 48, avgCost: 368, price: 452.18, assetClass: "US Equity", sector: "Materials", region: "Europe", account: "fidelity", dayPct: 0.0038, expense: 0, yieldFwd: 0.0126, lots: lots(48, 368, "2023-06-02", "2025-09-30") },
  { ticker: "NEE", name: "NextEra Energy", qty: 150, avgCost: 68.4, price: 74.25, assetClass: "US Equity", sector: "Utilities", region: "United States", account: "vanguard", dayPct: -0.0018, expense: 0, yieldFwd: 0.0284, lots: lots(150, 68.4, "2022-05-17", "2025-12-19") },
  { ticker: "VXUS", name: "Vanguard Total International Stock", qty: 2480, avgCost: 55.2, price: 66.45, assetClass: "Intl Equity", sector: "Broad Market", region: "Global ex-US", account: "fidelity", dayPct: 0.0056, expense: 0.0005, yieldFwd: 0.0292, lots: lots(2480, 55.2, "2021-05-03", "2025-11-20") },
  { ticker: "VEA", name: "Vanguard FTSE Developed Markets", qty: 1240, avgCost: 43.8, price: 51.28, assetClass: "Intl Equity", sector: "Broad Market", region: "Developed ex-US", account: "vanguard", dayPct: 0.0044, expense: 0.0003, yieldFwd: 0.0284, lots: lots(1240, 43.8, "2022-02-14", "2025-07-01") },
  { ticker: "IEMG", name: "iShares Core MSCI Emerging Markets", qty: 1180, avgCost: 49.1, price: 58.72, assetClass: "Intl Equity", sector: "Broad Market", region: "Emerging Markets", account: "fidelity", dayPct: 0.0072, expense: 0.0009, yieldFwd: 0.0246, lots: lots(1180, 49.1, "2021-08-09", "2025-10-02") },
  { ticker: "ASML", name: "ASML Holding", qty: 28, avgCost: 624, price: 892.4, assetClass: "Intl Equity", sector: "Technology", region: "Netherlands", account: "ibkr", dayPct: 0.0135, expense: 0, yieldFwd: 0.0068, lots: lots(28, 624, "2023-09-12", "2025-06-24") },
  { ticker: "SHEL", name: "Shell plc", qty: 420, avgCost: 58.4, price: 71.85, assetClass: "Intl Equity", sector: "Energy", region: "United Kingdom", account: "ibkr", dayPct: -0.0031, expense: 0, yieldFwd: 0.0384, lots: lots(420, 58.4, "2022-07-28", "2026-02-04") },
  { ticker: "BND", name: "Vanguard Total Bond Market ETF", qty: 2200, avgCost: 76.4, price: 73.18, assetClass: "Bonds", sector: "Fixed Income", region: "United States", account: "schwab", dayPct: -0.0014, expense: 0.0003, yieldFwd: 0.0412, lots: lots(2200, 76.4, "2021-04-20", "2025-08-14") },
  { ticker: "VTEB", name: "Vanguard Tax-Exempt Bond ETF", qty: 1640, avgCost: 50.2, price: 49.86, assetClass: "Bonds", sector: "Fixed Income", region: "United States", account: "schwab", dayPct: 0.0004, expense: 0.0005, yieldFwd: 0.0334, lots: lots(1640, 50.2, "2022-01-06", "2025-05-22") },
  { ticker: "VGSH", name: "Vanguard Short-Term Treasury ETF", qty: 1680, avgCost: 58.1, price: 57.94, assetClass: "Bonds", sector: "Fixed Income", region: "United States", account: "fidelity", dayPct: 0.0001, expense: 0.0004, yieldFwd: 0.0402, lots: lots(1680, 58.1, "2023-03-16", "2026-01-27") },
  { ticker: "VNQ", name: "Vanguard Real Estate ETF", qty: 640, avgCost: 86.2, price: 93.42, assetClass: "Real Estate", sector: "Real Estate", region: "United States", account: "schwab", dayPct: 0.0062, expense: 0.0013, yieldFwd: 0.0388, lots: lots(640, 86.2, "2021-11-09", "2025-04-03") },
  { ticker: "EQIX", name: "Equinix Inc.", qty: 38, avgCost: 710, price: 892.5, assetClass: "Real Estate", sector: "Real Estate", region: "United States", account: "vanguard", dayPct: 0.0098, expense: 0, yieldFwd: 0.0182, lots: lots(38, 710, "2023-08-01", "2025-09-18") },
  { ticker: "GLD", name: "SPDR Gold Shares", qty: 186, avgCost: 178.5, price: 248.6, assetClass: "Gold & Alts", sector: "Commodities", region: "Global", account: "ibkr", dayPct: 0.0081, expense: 0.004, yieldFwd: 0, lots: lots(186, 178.5, "2022-04-11", "2025-03-06") },
  { ticker: "IAU", name: "iShares Gold Trust", qty: 620, avgCost: 35.4, price: 50.84, assetClass: "Gold & Alts", sector: "Commodities", region: "Global", account: "schwab", dayPct: 0.0076, expense: 0.0025, yieldFwd: 0, lots: lots(620, 35.4, "2021-10-21", "2025-07-30") },
  { ticker: "DBMF", name: "iMGP DBi Managed Futures", qty: 980, avgCost: 28.15, price: 29.15, assetClass: "Gold & Alts", sector: "Alternatives", region: "Global", account: "fidelity", dayPct: -0.0042, expense: 0.0085, yieldFwd: 0, lots: lots(980, 28.15, "2023-02-08", "2025-11-12") },
  { ticker: "IBIT", name: "iShares Bitcoin Trust", qty: 1120, avgCost: 38.2, price: 58.22, assetClass: "Crypto", sector: "Digital Assets", region: "Global", account: "vanguard", dayPct: 0.0277, expense: 0.0025, yieldFwd: 0, lots: lots(1120, 38.2, "2024-06-11", "2025-12-09") },
];

export const TARGETS: { name: string; target: number }[] = [
  { name: "US Equity", target: 0.42 },
  { name: "Intl Equity", target: 0.22 },
  { name: "Bonds", target: 0.18 },
  { name: "Real Estate", target: 0.06 },
  { name: "Gold & Alts", target: 0.05 },
  { name: "Crypto", target: 0.02 },
  { name: "Cash", target: 0.05 },
];

export const CLASS_ORDER = TARGETS.map((t) => t.name);

export function marketValue(h: Holding) {
  return h.qty * h.price;
}
export function costBasis(h: Holding) {
  return h.qty * h.avgCost;
}
export function gain$(h: Holding) {
  return marketValue(h) - costBasis(h);
}
export function gainPct(h: Holding) {
  const c = costBasis(h);
  return c ? gain$(h) / c : 0;
}
export function day$(h: Holding) {
  const mv = marketValue(h);
  return (mv * h.dayPct) / (1 + h.dayPct);
}

export const cashTotal = accounts.reduce((s, a) => s + a.cash, 0);
export const holdingsValue = holdings.reduce((s, h) => s + marketValue(h), 0);
export const totalCost = holdings.reduce((s, h) => s + costBasis(h), 0);
export const unrealised = holdingsValue - totalCost;
export const unrealisedPct = unrealised / totalCost;
export const totalValue = holdingsValue + cashTotal;
export const todayChange = holdings.reduce((s, h) => s + day$(h), 0);
export const todayPct = todayChange / (totalValue - todayChange);
export const netInvested = Math.round((totalCost + cashTotal - 86400) / 100) * 100;
export const economicGain = totalValue - netInvested;
export const economicGainPct = economicGain / netInvested;

export const blendedCashRate = accounts.reduce((s, a) => s + a.cash * a.rate, 0) / cashTotal;
export const cashInterest = accounts.reduce((s, a) => s + a.cash * a.rate, 0);
export const forwardDiv = holdings.reduce((s, h) => s + marketValue(h) * h.yieldFwd, 0);
export const forwardIncome = forwardDiv + cashInterest;
export const forwardYield = forwardIncome / totalValue;
export const yieldOnCost = forwardIncome / (totalCost + cashTotal);
export const expenseDrag = holdings.reduce((s, h) => s + marketValue(h) * h.expense, 0) / totalValue;

export const accountName = Object.fromEntries(accounts.map((a) => [a.id, a.name]));

export type Position = Holding & {
  mv: number;
  cost: number;
  gain: number;
  gainP: number;
  day: number;
  weight: number;
  accountName: string;
};

export const positions: Position[] = holdings
  .map((h) => ({
    ...h,
    mv: marketValue(h),
    cost: costBasis(h),
    gain: gain$(h),
    gainP: gainPct(h),
    day: day$(h),
    weight: marketValue(h) / totalValue,
    accountName: accountName[h.account] ?? h.account,
  }))
  .sort((a, b) => b.mv - a.mv);

export const movers = [...positions].sort((a, b) => b.day - a.day);

export function allocation(includeCash = true) {
  const map = new Map<string, number>();
  for (const h of holdings) map.set(h.assetClass, (map.get(h.assetClass) ?? 0) + marketValue(h));
  if (includeCash) map.set("Cash", cashTotal);
  const base = includeCash ? totalValue : holdingsValue;
  const cashTarget = 0.05;
  return CLASS_ORDER.filter((name) => map.has(name)).map((name) => {
    const value = map.get(name) ?? 0;
    const rawTarget = TARGETS.find((t) => t.name === name)?.target ?? 0;
    const target = includeCash ? rawTarget : rawTarget / (1 - cashTarget);
    return { name, value, weight: value / base, target, rawTarget };
  });
}

export const allocationRows = allocation(true);

export const driftRows = allocationRows.map((r) => {
  const targetValue = r.target * totalValue;
  const gap = r.value - targetValue;
  return {
    ...r,
    targetValue,
    gap,
    drift: r.weight - r.target,
    buy: Math.max(0, targetValue - r.value),
    sell: Math.max(0, r.value - targetValue),
  };
});

export const vehicleFor: Record<string, { buy: string; sell: string; taxSell: string; taxNote: string }> = {
  "US Equity": { buy: "VTI", sell: "QQQ", taxSell: "UNH", taxNote: "UNH is below cost. Selling it trims US equity and harvests a loss." },
  "Intl Equity": { buy: "VXUS", sell: "ASML", taxSell: "VXUS", taxNote: "Add via VXUS rather than more single-name Europe." },
  Bonds: { buy: "BND", sell: "VGSH", taxSell: "BND", taxNote: "BND is slightly under water — adding, not selling." },
  "Real Estate": { buy: "VNQ", sell: "EQIX", taxSell: "VNQ", taxNote: "EQIX has a large long-term gain. Prefer new VNQ shares." },
  "Gold & Alts": { buy: "GLD", sell: "DBMF", taxSell: "DBMF", taxNote: "DBMF is flat. A small trim is tax-quiet." },
  Crypto: { buy: "IBIT", sell: "IBIT", taxSell: "IBIT", taxNote: "IBIT lots are mixed. A trim realises a short-term gain." },
  Cash: { buy: "SWVXX", sell: "Idle cash", taxSell: "Idle cash", taxNote: "Deploy excess above the 5% target. No tax event." },
};

export const places = [
  { id: "us", name: "United States", weight: 0.684, x: 22, y: 42, home: true },
  { id: "ca", name: "Canada", weight: 0.021, x: 20, y: 30, home: false },
  { id: "uk", name: "United Kingdom", weight: 0.034, x: 47, y: 33, home: false },
  { id: "eu", name: "Developed Europe", weight: 0.082, x: 53, y: 38, home: false },
  { id: "jp", name: "Japan", weight: 0.051, x: 83, y: 38, home: false },
  { id: "cn", name: "China & Hong Kong", weight: 0.028, x: 75, y: 44, home: false },
  { id: "asia", name: "Emerging Asia", weight: 0.036, x: 71, y: 56, home: false },
  { id: "latam", name: "Latin America", weight: 0.012, x: 31, y: 72, home: false },
  { id: "other", name: "Other & global", weight: 0.052, x: 60, y: 64, home: false },
];

export const acwiHomeWeight = 0.632;
export const homeWeight = places.find((p) => p.home)?.weight ?? 0;

export const currencyExposure = [
  { code: "USD", name: "US dollar", weight: 0.786, day: 0, contributors: ["US shares & ETFs", "Treasuries", "Cash", "US slice of global funds"] },
  { code: "EUR", name: "Euro", weight: 0.068, day: -0.0012, contributors: ["ASML", "Euro share of VXUS & VEA"] },
  { code: "JPY", name: "Yen", weight: 0.049, day: 0.0024, contributors: ["Japan share of VEA & VXUS"] },
  { code: "GBP", name: "Sterling", weight: 0.034, day: -0.0008, contributors: ["SHEL", "UK share of VXUS"] },
  { code: "HKD", name: "HK dollar", weight: 0.018, day: 0.0001, contributors: ["China/HK share of IEMG"] },
  { code: "CHF", name: "Swiss franc", weight: 0.016, day: 0.0011, contributors: ["Swiss share of VEA"] },
  { code: "CAD", name: "Canadian dollar", weight: 0.015, day: -0.0018, contributors: ["Canada share of VTI & VEA"] },
  { code: "OTH", name: "Other", weight: 0.014, day: 0.0006, contributors: ["EM residual inside IEMG"] },
];

export const sectorLook = [
  { name: "Technology", weight: 0.224, count: 6, names: ["AAPL", "MSFT", "NVDA", "QQQ", "ASML", "via VTI"] },
  { name: "Financials", weight: 0.092, count: 3, names: ["JPM", "via VTI", "via VXUS"] },
  { name: "Healthcare", weight: 0.078, count: 3, names: ["JNJ", "UNH", "via VTI"] },
  { name: "Industrials", weight: 0.064, count: 2, names: ["CAT", "via VTI"] },
  { name: "Consumer Discretionary", weight: 0.058, count: 2, names: ["via VTI", "via QQQ"] },
  { name: "Communication", weight: 0.046, count: 2, names: ["DIS", "via VTI"] },
  { name: "Real Estate", weight: 0.041, count: 2, names: ["VNQ", "EQIX"] },
  { name: "Consumer Staples", weight: 0.034, count: 2, names: ["COST", "via VTI"] },
  { name: "Commodities", weight: 0.034, count: 2, names: ["GLD", "IAU"] },
  { name: "Energy", weight: 0.031, count: 2, names: ["XOM", "SHEL"] },
  { name: "Digital Assets", weight: 0.028, count: 1, names: ["IBIT"] },
  { name: "Materials", weight: 0.022, count: 2, names: ["LIN", "via VTI"] },
  { name: "Utilities", weight: 0.018, count: 1, names: ["NEE"] },
  { name: "Fixed Income", weight: 0.146, count: 3, names: ["BND", "VTEB", "VGSH"] },
  { name: "Alternatives", weight: 0.012, count: 1, names: ["DBMF"] },
  { name: "Cash", weight: 0.072, count: 4, names: ["Schwab", "Fidelity", "Vanguard", "IBKR"] },
];

export const sectorPrimary = Object.values(
  positions.reduce<Record<string, { name: string; value: number; count: number; tickers: string[] }>>((acc, h) => {
    const row = acc[h.sector] ?? { name: h.sector, value: 0, count: 0, tickers: [] };
    row.value += h.mv;
    row.count += 1;
    row.tickers.push(h.ticker);
    acc[h.sector] = row;
    return acc;
  }, {}),
)
  .map((r) => ({ ...r, weight: r.value / holdingsValue }))
  .sort((a, b) => b.value - a.value);

export const fxTable = [
  { pair: "EURUSD", rate: 1.0842, side: "USD per EUR", source: "WM/Refinitiv mid" },
  { pair: "GBPUSD", rate: 1.2914, side: "USD per GBP", source: "WM/Refinitiv mid" },
  { pair: "USDJPY", rate: 149.62, side: "JPY per USD", source: "WM/Refinitiv mid" },
  { pair: "USDCHF", rate: 0.8824, side: "CHF per USD", source: "WM/Refinitiv mid" },
  { pair: "USDCAD", rate: 1.368, side: "CAD per USD", source: "WM/Refinitiv mid" },
  { pair: "AUDUSD", rate: 0.6418, side: "USD per AUD", source: "WM/Refinitiv mid" },
];

export const displayCurrencies = [
  { code: "USD", name: "US dollar", perUsd: 1, symbol: "$", digits: 0 },
  { code: "EUR", name: "Euro", perUsd: 1 / 1.0842, symbol: "€", digits: 0 },
  { code: "GBP", name: "Sterling", perUsd: 1 / 1.2914, symbol: "£", digits: 0 },
  { code: "JPY", name: "Yen", perUsd: 149.62, symbol: "¥", digits: 0 },
  { code: "CHF", name: "Swiss franc", perUsd: 0.8824, symbol: "CHF ", digits: 0 },
  { code: "CAD", name: "Canadian dollar", perUsd: 1.368, symbol: "C$", digits: 0 },
];

export const venues = [
  { name: "NYSE", detail: "Composite last sale", state: "15-min delayed", last: "16:27:02 ET", lag: "15m", note: "Primary prints for most ETFs and ADRs" },
  { name: "NASDAQ", detail: "Composite last sale", state: "15-min delayed", last: "16:27:02 ET", lag: "15m", note: "AAPL, MSFT, NVDA, QQQ, IBIT" },
  { name: "Euronext", detail: "Official close", state: "Closed", last: "11:30 ET", lag: "close", note: "Not used — ASML is the US listing" },
  { name: "FX", detail: "WM/Refinitiv mid", state: "Indicative", last: "16:28 GMT", lag: "14m", note: "Look-through translation only" },
];

export const syncEvents = [
  { t: "16:42:08", source: "Prices", detail: "NYSE and NASDAQ composite, 15-min delayed", state: "ok" as const },
  { t: "16:41:22", source: "Schwab", detail: "30 positions, cash, lots", state: "ok" as const },
  { t: "16:40:51", source: "Fidelity", detail: "Positions and SPAXX balance", state: "ok" as const },
  { t: "16:39:14", source: "Vanguard", detail: "Roth positions and VMFXX", state: "ok" as const },
  { t: "16:28:00", source: "WM/Refinitiv", detail: "Six FX pairs, London afternoon indicative", state: "ok" as const },
  { t: "16:12:44", source: "IBKR", detail: "Joint account lagged 18 minutes", state: "warn" as const },
  { t: "09:05:12", source: "Corporate actions", detail: "No splits, no pending dividends to post", state: "ok" as const },
];

export const benchmarks = [
  { id: "spx", name: "S&P 500", short: "SPX", note: "US large cap" },
  { id: "acwi", name: "MSCI ACWI", short: "ACWI", note: "Global equity" },
  { id: "b6040", name: "60/40", short: "60/40", note: "ACWI and US Agg" },
  { id: "agg", name: "US Aggregate", short: "AGG", note: "US investment-grade bonds" },
  { id: "none", name: "No benchmark", short: "None", note: "Portfolio alone" },
];

export const benchmarkDay: Record<string, number> = { spx: 0.0042, acwi: 0.0031, b6040: 0.0022, agg: -0.0008, none: 0 };

export const returnRows = [
  { period: "1M", mwr: 0.018, twr: 0.017, spx: 0.021, acwi: 0.016, b6040: 0.011, agg: 0.004 },
  { period: "3M", mwr: 0.034, twr: 0.032, spx: 0.046, acwi: 0.038, b6040: 0.024, agg: 0.009 },
  { period: "YTD", mwr: 0.042, twr: 0.041, spx: 0.058, acwi: 0.049, b6040: 0.031, agg: 0.012 },
  { period: "1Y", mwr: 0.146, twr: 0.139, spx: 0.182, acwi: 0.154, b6040: 0.108, agg: 0.046 },
  { period: "3Y ann.", mwr: 0.102, twr: 0.094, spx: 0.141, acwi: 0.112, b6040: 0.076, agg: 0.031 },
  { period: "5Y ann.", mwr: 0.088, twr: 0.081, spx: 0.124, acwi: 0.096, b6040: 0.062, agg: 0.018 },
  { period: "Since Mar 2021", mwr: 0.114, twr: 0.098, spx: 0.126, acwi: 0.099, b6040: 0.071, agg: 0.004 },
];

export const goal = {
  name: "Independence",
  target: 4_000_000,
  dateLabel: "31 December 2032",
  months: 81,
  monthly: 3200,
  started: "March 2021",
};

export function futureValue(principal: number, pmt: number, annual: number, months: number) {
  const r = annual / 12;
  if (Math.abs(r) < 1e-9) return principal + pmt * months;
  const g = Math.pow(1 + r, months);
  return principal * g + (pmt * (g - 1)) / r;
}

export function requiredAnnual(principal: number, pmt: number, months: number, target: number) {
  let lo = -0.4;
  let hi = 0.4;
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    if (futureValue(principal, pmt, mid, months) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type SeriesPoint = {
  date: string;
  label: string;
  value: number;
  invested: number;
  spx: number;
  acwi: number;
  b6040: number;
  agg: number;
};

function iso(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function buildMonthly(): SeriesPoint[] {
  const rand = mulberry32(20260314);
  const points: SeriesPoint[] = [];
  let invested = 1040000;
  let value = 1115000;
  let spx = 100;
  let acwi = 100;
  let b6040 = 100;
  let agg = 100;
  for (let i = 0; i <= 60; i++) {
    const d = new Date(2021, 2, 14);
    d.setMonth(d.getMonth() + i);
    const contrib = i === 0 ? 0 : 10400 + (i % 3 === 0 ? 7200 : 0) + (i === 27 ? 25000 : 0);
    invested += contrib;
    let m = 0.007 + (rand() - 0.48) * 0.032;
    if (i >= 10 && i <= 19) m -= 0.03;
    if (i === 20) m += 0.048;
    if (i >= 24 && i <= 36) m += 0.006;
    const spxM = m + 0.0035 + (rand() - 0.5) * 0.018;
    const acwiM = m + 0.001 + (rand() - 0.5) * 0.016;
    const aggM = 0.0012 + (rand() - 0.55) * 0.012 - (i >= 10 && i <= 16 ? 0.008 : 0);
    const bM = acwiM * 0.6 + aggM * 0.4;
    value = value * (1 + m) + contrib;
    spx *= 1 + spxM;
    acwi *= 1 + acwiM;
    agg *= 1 + aggM;
    b6040 *= 1 + bM;
    points.push({
      date: iso(d),
      label: `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
      value,
      invested,
      spx,
      acwi,
      b6040,
      agg,
    });
  }
  const last = points[points.length - 1];
  const vScale = totalValue / last.value;
  const iScale = netInvested / last.invested;
  return points.map((p) => ({ ...p, value: p.value * vScale, invested: p.invested * iScale }));
}

export const monthly = buildMonthly();

function buildDaily(): SeriesPoint[] {
  const rand = mulberry32(77);
  const n = 90;
  const end = totalValue;
  const start = end / 1.032;
  const pts: SeriesPoint[] = [];
  let v = start;
  let invested = netInvested - 3200 * 2;
  let spx = 100;
  let acwi = 100;
  let b6040 = 100;
  let agg = 100;
  for (let i = 0; i < n; i++) {
    const d = new Date(2026, 2, 14);
    d.setDate(d.getDate() - (n - 1 - i));
    if (d.getDate() === 1 || d.getDate() === 15) invested += 1600;
    const drift = Math.pow(end / start, 1 / n) - 1;
    v = v * (1 + drift + (rand() - 0.48) * 0.007);
    spx *= 1 + drift + 0.0004 + (rand() - 0.5) * 0.006;
    acwi *= 1 + drift + 0.0001 + (rand() - 0.5) * 0.0055;
    agg *= 1 + (rand() - 0.48) * 0.0015;
    b6040 *= 1 + drift * 0.62;
    pts.push({
      date: iso(d),
      label: `${MONTHS[d.getMonth()]} ${d.getDate()}`,
      value: v,
      invested,
      spx,
      acwi,
      b6040,
      agg,
    });
  }
  pts[pts.length - 1].value = end;
  pts[pts.length - 1].invested = netInvested;
  return pts;
}

export const daily = buildDaily();

function buildIntraday(): SeriesPoint[] {
  const rand = mulberry32(42);
  const open = totalValue - todayChange;
  const pts: SeriesPoint[] = [];
  let v = open;
  const spxOpen = 100;
  const spxClose = 100 * (1 + benchmarkDay.spx);
  for (let i = 0; i <= 78; i++) {
    const mins = 9 * 60 + 30 + i * 5;
    const hh = Math.floor(mins / 60);
    const mm = mins % 60;
    const drift = todayChange / 78;
    v = v + drift * (0.35 + rand()) + (rand() - 0.5) * totalValue * 0.00035;
    const t = i / 78;
    const spx = spxOpen + (spxClose - spxOpen) * t + Math.sin(i / 4) * 0.08;
    pts.push({
      date: `2026-03-14T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`,
      label: `${hh}:${String(mm).padStart(2, "0")}`,
      value: v,
      invested: netInvested,
      spx,
      acwi: 100 * (1 + benchmarkDay.acwi * t),
      b6040: 100 * (1 + benchmarkDay.b6040 * t),
      agg: 100 * (1 + benchmarkDay.agg * t),
    });
  }
  pts[0].value = open;
  pts[pts.length - 1].value = totalValue;
  return pts;
}

export const intraday = buildIntraday();

export const dayStats = {
  open: intraday[0].value,
  high: Math.max(...intraday.map((p) => p.value)),
  low: Math.min(...intraday.map((p) => p.value)),
  last: intraday[intraday.length - 1].value,
};

export function seriesFor(range: string): SeriesPoint[] {
  if (range === "1D") return intraday;
  if (range === "1W") return daily.slice(-5);
  if (range === "1M") return daily.slice(-22);
  if (range === "3M") return daily;
  if (range === "YTD") return monthly.filter((p) => p.date >= "2026-01-01");
  if (range === "1Y") return monthly.slice(-13);
  if (range === "3Y") return monthly.slice(-37);
  if (range === "5Y") return monthly.slice(-60);
  return monthly;
}

export function windowReturn(series: number[]) {
  if (series.length < 2 || !series[0]) return 0;
  return series[series.length - 1] / series[0] - 1;
}

export function drawdownSeries(values: number[]) {
  let peak = values[0] ?? 0;
  return values.map((v) => {
    peak = Math.max(peak, v);
    return peak ? v / peak - 1 : 0;
  });
}

export const monthlyDraw = drawdownSeries(monthly.map((p) => p.value));
export const maxDrawdown = Math.min(...monthlyDraw);
export const currentDrawdown = monthlyDraw[monthlyDraw.length - 1] ?? 0;
export const peakValue = monthly.reduce((m, p) => Math.max(m, p.value), 0);

const bondIncome = holdings.filter((h) => h.assetClass === "Bonds").reduce((s, h) => s + marketValue(h) * h.yieldFwd, 0);
const equityIncome = forwardDiv - bondIncome;

export const incomeMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((label, i) => {
  const year = i < 9 ? "2026" : "2027";
  const quarter = ["Jun", "Sep", "Dec", "Mar"].includes(label);
  const div = quarter ? equityIncome / 4 : equityIncome * 0.02;
  const bonds = bondIncome / 12;
  const cash = cashInterest / 12;
  const amt = div + bonds + cash;
  const payers = [
    quarter ? "VTI" : null,
    quarter ? "VXUS" : null,
    quarter ? "SCHD" : null,
    "BND",
    "VGSH",
    label === "Mar" || label === "Jun" || label === "Sep" || label === "Dec" ? "JNJ" : null,
    label === "May" || label === "Aug" || label === "Nov" || label === "Feb" ? "JPM" : null,
    "Cash interest",
  ].filter(Boolean) as string[];
  return { label, year, amt, payers, quarter };
});

const incomeSum = incomeMonths.reduce((s, m) => s + m.amt, 0);
export const incomeCalendar = incomeMonths.map((m) => ({ ...m, amt: (m.amt / incomeSum) * forwardIncome }));

export const photos = {
  library: "https://images.pexels.com/photos/16433564/pexels-photo-16433564.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1100",
  nyc: "https://images.pexels.com/photos/20847299/pexels-photo-20847299.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1100",
  london: "https://images.pexels.com/photos/28245665/pexels-photo-28245665.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1000",
  atlas: "https://images.pexels.com/photos/9494906/pexels-photo-9494906.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1100",
  desk: "https://images.pexels.com/photos/13806237/pexels-photo-13806237.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1100",
  coins: "https://images.pexels.com/photos/20843727/pexels-photo-20843727.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400&h=900",
  globe: "https://images.pexels.com/photos/6409003/pexels-photo-6409003.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400&h=1000",
};

export function spark(seed: string, end: number, n = 28) {
  let s = 2166136261;
  for (const c of seed) s = Math.imul(s ^ c.charCodeAt(0), 16777619);
  const pts: number[] = [];
  let v = end * (0.82 + (Math.abs(s) % 12) / 100);
  for (let i = 0; i < n; i++) {
    s = Math.imul(s ^ (s >>> 13), 1274126177);
    const shock = (((s >>> 0) % 1000) / 1000 - 0.48) * 0.045;
    v = Math.max(0.5, v * (1 + shock));
    pts.push(v);
  }
  pts[pts.length - 1] = end;
  return pts;
}

export const coreValue = ["VTI", "VXUS", "BND"].reduce((s, t) => s + (positions.find((p) => p.ticker === t)?.mv ?? 0), 0);
export const satelliteValue = positions
  .filter((p) => !["VTI", "VXUS", "BND", "VEA", "IEMG", "SCHD", "AVUV"].includes(p.ticker) && p.assetClass.includes("Equity"))
  .reduce((s, p) => s + p.mv, 0);
