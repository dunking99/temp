import { Fragment, useMemo, useState } from "react";
import {
  ACCOUNT_ROLLUP,
  AS_OF,
  AS_OF_SHORT,
  CASH,
  CLASSES,
  COST_BASIS,
  DAY_PCT,
  DAY_PNL,
  HISTORY,
  HOLDINGS,
  INCOME,
  MILESTONES,
  RISK,
  TOTAL,
  UNREALISED,
  YIELD,
  type Holding,
} from "@/lib/data";
import { areaPath, linePath, money, packCircles, pct, points, px, qty, signed, treemap, ymLabel } from "@/lib/format";

const up = "#1b6b45";
const down = "#9d3b32";

function tone(n: number) {
  return n > 0.004 ? up : n < -0.004 ? down : "#6b645c";
}

export function D1a() {
  const [q, setQ] = useState("");
  const [acct, setAcct] = useState("All");
  const [sort, setSort] = useState<{ key: keyof Holding; dir: number }>({ key: "value", dir: -1 });
  const [open, setOpen] = useState<string | null>("NVDA");
  const accounts = ["All", "Taxable", "Traditional IRA", "Roth IRA", "Cash Reserve"];
  const rows = useMemo(() => {
    const list = HOLDINGS.filter(
      (h) =>
        (acct === "All" || h.account === acct) &&
        `${h.ticker} ${h.name} ${h.sector}`.toLowerCase().includes(q.toLowerCase()),
    );
    return [...list].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sort.dir;
      return String(av).localeCompare(String(bv)) * sort.dir;
    });
  }, [q, acct, sort]);
  const totals = rows.reduce(
    (s, h) => ({ value: s.value + h.value, gain: s.gain + h.gain, cost: s.cost + h.costBasis, day: s.day + h.dayPnl }),
    { value: 0, gain: 0, cost: 0, day: 0 },
  );
  const toggle = (key: keyof Holding) =>
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: key === "ticker" ? 1 : -1 }));
  const head = (label: string, key: keyof Holding, align = "right") => (
    <th className={`px-3 py-2 font-medium ${align === "left" ? "text-left" : "text-right"}`}>
      <button type="button" onClick={() => toggle(key)} className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-[#7a7268] hover:text-[#1c1915]">
        {label}
        <span className="text-[9px]">{sort.key === key ? (sort.dir < 0 ? "▼" : "▲") : ""}</span>
      </button>
    </th>
  );
  return (
    <div style={{ fontFamily: '"Instrument Sans", sans-serif', background: "#f7f4ee", color: "#1c1915" }} className="px-8 py-7">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8a8176]">Private ledger · {AS_OF}</div>
          <h2 style={{ fontFamily: "Fraunces, serif" }} className="mt-1 text-[34px] font-medium leading-none tracking-[-0.03em]">
            Book of holdings
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#8a8176]">Visible market value</div>
          <div className="tabular text-[28px] font-medium tracking-tight">{money(totals.value)}</div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search ticker, name, sector"
          className="h-9 w-64 rounded-full border border-[#e0d8cc] bg-white px-4 text-sm outline-none placeholder:text-[#b0a79c] focus:border-[#1c1915]"
        />
        {accounts.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAcct(a)}
            className={`h-9 rounded-full px-3 text-[12px] ${acct === a ? "bg-[#1c1915] text-[#f7f4ee]" : "bg-white text-[#5c564e] ring-1 ring-[#e0d8cc] hover:bg-[#fff]"}`}
          >
            {a === "Traditional IRA" ? "IRA" : a === "Cash Reserve" ? "Cash" : a}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#8a8176]">{rows.length} of {HOLDINGS.length} lines</span>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-[#e4dcd0] bg-white">
        <table className="w-full border-collapse text-[13px]">
          <thead className="bg-[#fbfaf7]">
            <tr className="border-b border-[#eee7dc]">
              {head("Holding", "ticker", "left")}
              {head("Price", "price")}
              {head("Position", "qty")}
              {head("Value", "value")}
              {head("Gain / loss", "gain")}
              {head("Weight", "weight")}
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => {
              const on = open === h.ticker;
              const pts = points(h.spark, 220, 46, 2);
              return (
                <Fragment key={h.ticker}>
                  <tr
                    onClick={() => setOpen(on ? null : h.ticker)}
                    className={`cursor-pointer border-b border-[#f0ebe3] ${on ? "bg-[#f3eee4]" : "hover:bg-[#fbf8f3]"}`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-14 font-semibold tracking-tight">{h.ticker}</span>
                        <span className="text-[#6f675e]">{h.name}</span>
                        <span className="ml-auto rounded-full bg-[#f3efe7] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#7a7268]">{h.type}</span>
                      </div>
                    </td>
                    <td className="tabular px-3 py-3 text-right">
                      <div>{px(h.price)}</div>
                      <div style={{ color: tone(h.dayPct) }} className="text-[11px]">{pct(h.dayPct, 2)}</div>
                    </td>
                    <td className="tabular px-3 py-3 text-right text-[#3f3a34]">
                      {qty(h.qty)} {h.type === "Cash" ? "" : "sh"}
                      <div className="text-[11px] text-[#8a8176]">@ {px(h.cost)}</div>
                    </td>
                    <td className="tabular px-3 py-3 text-right font-medium">{money(h.value)}</td>
                    <td className="tabular px-3 py-3 text-right" style={{ color: tone(h.gain) }}>
                      {signed(h.gain)}
                      <div className="text-[11px]">{pct(h.gainPct)}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="tabular text-right">{h.weight.toFixed(1)}%</div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#efe8dc]">
                        <div className="h-full rounded-full bg-[#1c1915]" style={{ width: `${Math.min(100, h.weight * 4)}%` }} />
                      </div>
                    </td>
                  </tr>
                  {on && (
                    <tr key={`${h.ticker}-open`} className="border-b border-[#f0ebe3] bg-[#f7f3eb]">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-4">
                            <svg viewBox="0 0 220 46" className="h-14 w-full">
                              <path d={areaPath(pts, 46)} fill="#e7dcc8" />
                              <path d={linePath(pts)} fill="none" stroke="#1c1915" strokeWidth="1.4" />
                            </svg>
                            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[#5c564e]">{h.blurb}</p>
                          </div>
                          <div className="col-span-8 grid grid-cols-4 gap-3 text-[12px]">
                            {[
                              ["Account", h.account],
                              ["Sector", h.sector],
                              ["Region", h.region],
                              ["Currency", h.currency],
                              ["Day P&L", signed(h.dayPnl, 0)],
                              ["Income / yr", money(h.income)],
                              ["Yield", `${h.yieldPct.toFixed(2)}%`],
                              ["Fee", h.expense ? `${h.expense.toFixed(2)}%` : "None"],
                              ["Beta", h.beta.toFixed(2)],
                              ["Volatility", `${h.vol.toFixed(0)}%`],
                              ["52-week", `${px(h.low52)} – ${px(h.high52)}`],
                              ["Cost basis", money(h.costBasis)],
                            ].map(([k, v]) => (
                              <div key={k} className="rounded-lg bg-white px-3 py-2 ring-1 ring-[#eee6da]">
                                <div className="text-[10px] uppercase tracking-[0.14em] text-[#968d82]">{k}</div>
                                <div className="tabular mt-1 font-medium">{v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#8a8176]">Nothing in the book matches that search.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-[#1c1915] text-[#f7f4ee]">
              <td className="px-3 py-3 text-[12px] uppercase tracking-[0.14em]">Totals, visible</td>
              <td />
              <td className="tabular px-3 py-3 text-right text-[12px] text-[#cfc6b8]">Basis {money(totals.cost)}</td>
              <td className="tabular px-3 py-3 text-right font-medium">{money(totals.value)}</td>
              <td className="tabular px-3 py-3 text-right" style={{ color: totals.gain >= 0 ? "#9ddeb8" : "#f0b2ab" }}>
                {signed(totals.gain)}
                <div className="text-[11px]">{pct(totals.cost ? (totals.gain / totals.cost) * 100 : 0)}</div>
              </td>
              <td className="tabular px-3 py-3 text-right text-[12px]">Day {signed(totals.day)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export function D1b() {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState<"value" | "gainPct" | "dayPct" | "ticker">("value");
  const [pin, setPin] = useState("NVDA");
  const filters = ["All", "Stock", "ETF", "Crypto", "Cash"];
  const rows = HOLDINGS.filter((h) => filter === "All" || h.type === filter).sort((a, b) => {
    if (sort === "ticker") return a.ticker.localeCompare(b.ticker);
    return b[sort] - a[sort];
  });
  const pinned = HOLDINGS.find((h) => h.ticker === pin) ?? rows[0];
  const move = (dir: number) => {
    const i = rows.findIndex((h) => h.ticker === pinned.ticker);
    const next = rows[(i + dir + rows.length) % rows.length];
    if (next) setPin(next.ticker);
  };
  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "j") move(1);
        if (e.key === "ArrowUp" || e.key === "k") move(-1);
      }}
      style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', background: "#0e1210", color: "#e7e2d6" }}
      className="outline-none"
    >
      <div className="flex items-stretch border-b border-[#242824]">
        <div className="w-[340px] shrink-0 border-r border-[#242824] px-5 py-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#8d9778]">Pinned position</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[28px] text-[#dff26a]">{pinned.ticker}</span>
            <span style={{ color: pinned.dayPct >= 0 ? "#dff26a" : "#ff8d7a" }}>{pct(pinned.dayPct, 2)}</span>
          </div>
          <div className="mt-1 text-[12px] text-[#b7b1a4]">{pinned.name}</div>
          <div className="mt-4 grid grid-cols-2 gap-y-2 text-[12px]">
            <span className="text-[#7e8774]">Last</span><span className="text-right">{px(pinned.price)}</span>
            <span className="text-[#7e8774]">Position</span><span className="text-right">{qty(pinned.qty)} @ {px(pinned.cost)}</span>
            <span className="text-[#7e8774]">Market</span><span className="text-right">{money(pinned.value)}</span>
            <span className="text-[#7e8774]">P&L</span><span className="text-right" style={{ color: pinned.gain >= 0 ? "#b6e38a" : "#ff8d7a" }}>{signed(pinned.gain)} · {pct(pinned.gainPct)}</span>
            <span className="text-[#7e8774]">Book</span><span className="text-right">{pinned.weight.toFixed(2)}%</span>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-[#8d9778]">Click a row, or use ↑ ↓ once this panel is focused. The tape is the whole book, not a watchlist.</p>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 border-b border-[#242824] px-4 py-3">
            {filters.map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={`h-7 rounded px-2 text-[11px] ${filter === f ? "bg-[#dff26a] text-[#14180f]" : "text-[#b7b1a4] hover:bg-[#1a1f1b]"}`}>
                {f.toUpperCase()}
              </button>
            ))}
            <div className="ml-auto flex gap-1 text-[10px] uppercase tracking-wider text-[#7e8774]">
              {(["value", "gainPct", "dayPct", "ticker"] as const).map((k) => (
                <button key={k} type="button" onClick={() => setSort(k)} className={`px-2 py-1 ${sort === k ? "text-[#dff26a]" : "hover:text-white"}`}>
                  {k === "gainPct" ? "P&L %" : k === "dayPct" ? "Day" : k}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[560px] overflow-auto">
            {rows.map((h) => {
              const pts = points(h.spark, 640, 54, 4);
              const hot = h.ticker === pinned.ticker;
              return (
                <button
                  key={h.ticker}
                  type="button"
                  onClick={() => setPin(h.ticker)}
                  className={`relative flex h-[58px] w-full items-center border-b border-[#1c211d] px-4 text-left ${hot ? "bg-[#171c18]" : "hover:bg-[#141815]"}`}
                >
                  <svg viewBox="0 0 640 54" preserveAspectRatio="none" className="pointer-events-none absolute inset-y-1 right-0 w-[46%] opacity-70">
                    <path d={linePath(pts)} fill="none" stroke={h.gainPct >= 0 ? "#9bb86a" : "#c46a5c"} strokeWidth="1.4" />
                  </svg>
                  <span className="relative w-20 text-[15px] text-[#f4f0e4]">{h.ticker}</span>
                  <span className="relative w-56 truncate text-[12px] text-[#9a9488]">{h.name}</span>
                  <span className="relative w-28 text-right text-[13px]">{px(h.price)}</span>
                  <span className="relative w-40 text-right text-[12px] text-[#b7b1a4]">{qty(h.qty)} @ {px(h.cost)}</span>
                  <span className="relative w-32 text-right">{money(h.value)}</span>
                  <span className="relative w-36 text-right" style={{ color: h.gain >= 0 ? "#c6ee8e" : "#ff9b8c" }}>{signed(h.gain)}</span>
                  <span className="relative ml-auto w-16 text-right text-[#dff26a]">{h.weight.toFixed(1)}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-between px-5 py-2 text-[10px] uppercase tracking-[0.18em] text-[#66705c]">
        <span>Floor tape · {AS_OF_SHORT} · illustrative close</span>
        <span>{rows.length} names · book {money(TOTAL)}</span>
      </div>
    </div>
  );
}

export function D1c() {
  const [flat, setFlat] = useState(false);
  const [closed, setClosed] = useState<string[]>([]);
  const toggle = (id: string) => setClosed((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  return (
    <div style={{ fontFamily: '"Libre Baskerville", Georgia, serif', background: "#efe6d6", color: "#2a2118" }} className="px-8 py-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a735c]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Statements · {AS_OF}</div>
          <h2 className="mt-1 text-[30px] leading-none">Held in four accounts</h2>
        </div>
        <button type="button" onClick={() => setFlat((v) => !v)} className="rounded-full bg-[#2a2118] px-4 py-2 text-[12px] text-[#f3eadc]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
          {flat ? "Split into statements" : "Combine into one book"}
        </button>
      </div>
      {flat ? (
        <div className="mt-5 bg-[#fbf6ee] px-4 py-3 shadow-[0_18px_40px_-28px_rgba(60,40,10,0.5)]">
          <StatementTable rows={HOLDINGS} />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-4">
          {ACCOUNT_ROLLUP.map((a) => {
            const shut = closed.includes(a.id);
            return (
              <section key={a.id} className="bg-[#fbf6ee] px-4 py-3 shadow-[0_18px_40px_-28px_rgba(60,40,10,0.45)]">
                <button type="button" onClick={() => toggle(a.id)} className="flex w-full items-end justify-between border-b border-[#2a2118] pb-2 text-left">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#8a735c]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{a.shelter}</div>
                    <div className="text-[18px]">{a.name}</div>
                  </div>
                  <div className="text-right" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
                    <div className="tabular text-[16px]">{money(a.value)}</div>
                    <div className="text-[11px] text-[#8a735c]">{a.weight.toFixed(1)}% of book · {shut ? "open" : "close"}</div>
                  </div>
                </button>
                {!shut && <StatementTable rows={a.holdings} />}
                {!shut && (
                  <div className="mt-2 flex justify-between border-t border-[#e6dccb] pt-2 text-[12px]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
                    <span>Unrealised {signed(a.gain)}</span>
                    <span>{a.holdings.length} lines</span>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatementTable({ rows }: { rows: Holding[] }) {
  return (
    <table className="mt-2 w-full text-[12px]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
      <thead>
        <tr className="text-[10px] uppercase tracking-[0.12em] text-[#8a735c]">
          <th className="py-1 text-left font-medium">Holding</th>
          <th className="text-right font-medium">Price</th>
          <th className="text-right font-medium">Position</th>
          <th className="text-right font-medium">Value</th>
          <th className="text-right font-medium">Gain</th>
          <th className="text-right font-medium">Wt</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((h) => (
          <tr key={h.ticker} className="border-t border-[#efe6d6]">
            <td className="py-1.5">
              <span className="font-semibold">{h.ticker}</span>
              <span className="ml-2 text-[#7c6f60]">{h.name}</span>
            </td>
            <td className="tabular text-right">{px(h.price)}</td>
            <td className="tabular text-right text-[#5c5146]">{qty(h.qty)} @ {px(h.cost)}</td>
            <td className="tabular text-right">{money(h.value)}</td>
            <td className="tabular text-right" style={{ color: tone(h.gain) }}>{pct(h.gainPct)}</td>
            <td className="tabular text-right">{h.weight.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function D2a() {
  const [span, setSpan] = useState<"1Y" | "3Y" | "5Y" | "ALL">("ALL");
  const [i, setI] = useState<number | null>(null);
  const n = span === "1Y" ? 13 : span === "3Y" ? 37 : span === "5Y" ? 61 : HISTORY.length;
  const data = HISTORY.slice(-n);
  const idx = i == null ? data.length - 1 : i;
  const hover = data[Math.max(0, Math.min(data.length - 1, idx))];
  const pts = points(data.map((d) => d.value), 680, 250, 8);
  const change = hover.value - data[0].value;
  return (
    <div style={{ fontFamily: '"Instrument Sans", sans-serif', background: "#f4f1ea", color: "#172033" }} className="grid grid-cols-12 gap-0">
      <div className="col-span-4 flex flex-col justify-between px-8 py-8">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8b8378]">Portfolio · {AS_OF_SHORT}</div>
          <div style={{ fontFamily: "Fraunces, serif" }} className="mt-3 text-[58px] font-medium leading-[0.9] tracking-[-0.04em]">
            {money(TOTAL)}
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm" style={{ background: DAY_PNL >= 0 ? "#e5f2ea" : "#f8e8e4", color: tone(DAY_PNL) }}>
            <span>{DAY_PNL >= 0 ? "▲" : "▼"}</span>
            <span className="tabular">{signed(DAY_PNL)} today</span>
            <span className="tabular">{pct(DAY_PCT, 2)}</span>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5">
          {[
            ["Paid in", money(COST_BASIS)],
            ["Unrealised", signed(UNREALISED)],
            ["Cash", money(CASH)],
            ["Income yield", `${YIELD.toFixed(2)}%`],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#8b8378]">{k}</div>
              <div className="tabular mt-1 text-[20px] font-medium tracking-tight">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-8 border-l border-[#e6e0d6] px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#8b8378]">Value over time</div>
            <div className="mt-1 text-sm text-[#5c564e]">
              {ymLabel(hover.ym)} · {money(hover.value)} · {signed(change)} from the start of this window
            </div>
          </div>
          <div className="flex rounded-full bg-[#ebe6dc] p-1">
            {(["1Y", "3Y", "5Y", "ALL"] as const).map((s) => (
              <button key={s} type="button" onClick={() => { setSpan(s); setI(null); }} className={`h-7 rounded-full px-3 text-[12px] ${span === s ? "bg-white shadow-sm" : "text-[#6f675e]"}`}>
                {s === "ALL" ? "Since 2018" : s}
              </button>
            ))}
          </div>
        </div>
        <svg
          viewBox="0 0 680 250"
          className="mt-4 h-[280px] w-full"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            setI(Math.round(x * (data.length - 1)));
          }}
          onMouseLeave={() => setI(null)}
        >
          <defs>
            <linearGradient id="d2aFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1="8" x2="672" y1={20 + g * 56} y2={20 + g * 56} stroke="#e5dfd4" strokeWidth="1" />
          ))}
          <path d={areaPath(pts, 242)} fill="url(#d2aFill)" />
          <path d={linePath(pts)} fill="none" stroke="#1e3a5f" strokeWidth="2" />
          {i != null && (
            <>
              <line x1={pts[idx][0]} x2={pts[idx][0]} y1="8" y2="242" stroke="#1e3a5f" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={pts[idx][0]} cy={pts[idx][1]} r="4" fill="#f4f1ea" stroke="#1e3a5f" strokeWidth="2" />
            </>
          )}
        </svg>
        <div className="flex justify-between text-[11px] text-[#8b8378]">
          <span>{ymLabel(data[0].ym)}</span>
          <span>Hover the line. Cash put in is a figure, not a second series — that comparison has its own specimen.</span>
          <span>{ymLabel(data[data.length - 1].ym)}</span>
        </div>
      </div>
    </div>
  );
}

export function D2b() {
  const [showInv, setShowInv] = useState(false);
  const [i, setI] = useState<number | null>(null);
  const data = HISTORY;
  const idx = i == null ? data.length - 1 : i;
  const hover = data[idx];
  const vPts = points(data.map((d) => d.value), 1080, 180, 0, {
    min: Math.min(...data.map((d) => Math.min(d.value, d.invested))) * 0.96,
    max: Math.max(...data.map((d) => d.value)) * 1.02,
  });
  const iPts = points(data.map((d) => d.invested), 1080, 180, 0, {
    min: Math.min(...data.map((d) => Math.min(d.value, d.invested))) * 0.96,
    max: Math.max(...data.map((d) => d.value)) * 1.02,
  });
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#090b10", color: "#f4efe6" }} className="relative overflow-hidden px-8 pb-6 pt-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,154,90,0.16),transparent_55%)]" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#b9a07a]">Meridian · close {AS_OF_SHORT}</div>
          <div className="mt-2 text-[84px] font-light leading-[0.85] tracking-[-0.05em]">{money(TOTAL)}</div>
        </div>
        <div className="mt-3 flex flex-col items-end gap-3">
          <div className="rounded-2xl border border-[#3a3328] px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#b9a07a]">Today</div>
            <div className="tabular text-[28px] leading-none" style={{ color: DAY_PNL >= 0 ? "#d6ff8a" : "#ffb4a2" }}>{signed(DAY_PNL)}</div>
            <div className="tabular text-sm text-[#d9d0c3]">{pct(DAY_PCT, 2)}</div>
          </div>
          <button type="button" onClick={() => setShowInv((v) => !v)} className={`rounded-full px-3 py-1 text-[12px] ${showInv ? "bg-[#e6c48a] text-[#1a140c]" : "border border-[#3a3328] text-[#e6c48a]"}`}>
            {showInv ? "Hide cash contributed" : "Show cash contributed"}
          </button>
        </div>
      </div>
      <div className="relative mt-2 flex gap-8 text-[13px] text-[#c9bfb1]">
        {[
          ["Unrealised", signed(UNREALISED)],
          ["Cost basis", money(COST_BASIS)],
          ["Cash", money(CASH)],
          ["Forward yield", `${YIELD.toFixed(2)}%`],
          ["From peak", pct(HISTORY[HISTORY.length - 1].dd * 100)],
        ].map(([k, v]) => (
          <div key={k}>
            <span className="mr-2 text-[10px] uppercase tracking-[0.16em] text-[#8d8376]">{k}</span>
            <span className="tabular text-white">{v}</span>
          </div>
        ))}
      </div>
      <svg
        viewBox="0 0 1080 180"
        className="relative mt-6 h-[200px] w-full"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setI(Math.round(((e.clientX - r.left) / r.width) * (data.length - 1)));
        }}
        onMouseLeave={() => setI(null)}
      >
        <path d={linePath(vPts)} fill="none" stroke="#e6c48a" strokeWidth="1.6" />
        {showInv && <path d={linePath(iPts)} fill="none" stroke="#7f93a8" strokeWidth="1.2" strokeDasharray="4 4" />}
        <line x1={vPts[idx][0]} x2={vPts[idx][0]} y1="0" y2="180" stroke="#ffffff22" />
        <circle cx={vPts[idx][0]} cy={vPts[idx][1]} r="3.5" fill="#e6c48a" />
      </svg>
      <div className="relative mt-1 flex justify-between text-[12px] text-[#b9a07a]">
        <span>{ymLabel(hover.ym)} · value {money(hover.value)}{showInv ? ` · contributed ${money(hover.invested)}` : ""}</span>
        <span>A horizon, not a dashboard. The line is the whole argument.</span>
      </div>
    </div>
  );
}

export function D2c() {
  const [note, setNote] = useState(MILESTONES.length - 1);
  const data = HISTORY;
  const pts = points(data.map((d) => d.value), 760, 210, 16);
  const marks = MILESTONES.map((m) => {
    const i = data.findIndex((d) => d.ym === m.ym);
    return { ...m, i };
  }).filter((m) => m.i >= 0);
  const active = marks[note] ?? marks[marks.length - 1];
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f3ecdf", color: "#1d1a16" }} className="px-8 py-7">
      <div className="flex items-center justify-between border-y border-[#1d1a16] py-2 text-[11px] uppercase tracking-[0.22em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
        <span>Meridian Portfolio</span>
        <span>Vol. VIII · No. 3</span>
        <span>{AS_OF}</span>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-6">
        <div className="col-span-8 border-r border-[#1d1a16] pr-6">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#7a6a55]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Total value of the book</div>
          <h2 className="mt-1 text-[68px] font-medium leading-[0.88] tracking-[-0.03em]">{money(TOTAL)}</h2>
          <p className="mt-3 max-w-xl text-[18px] leading-snug">
            Up {money(DAY_PNL)} on the day, and {money(UNREALISED)} above what was paid. Cash is {money(CASH)}. The winter pullback is not finished.
          </p>
        </div>
        <div className="col-span-4 space-y-3 text-[14px]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
          {[
            ["Today", `${signed(DAY_PNL)} · ${pct(DAY_PCT, 2)}`],
            ["Cost basis", money(COST_BASIS)],
            ["Unrealised", signed(UNREALISED)],
            ["Income, forward", money(INCOME)],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between border-b border-[#d9d0c1] pb-1">
              <span className="text-[#6e6254]">{k}</span>
              <span className="tabular font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-12 gap-4">
        <svg viewBox="0 0 760 210" className="col-span-8 h-[220px] w-full">
          <path d={areaPath(pts, 196)} fill="#e7dcc8" />
          <path d={linePath(pts)} fill="none" stroke="#1d1a16" strokeWidth="1.5" />
          {marks.map((m, n) => (
            <g key={m.title} onClick={() => setNote(n)} className="cursor-pointer">
              <circle cx={pts[m.i][0]} cy={pts[m.i][1]} r={n === note ? 5 : 3.2} fill={n === note ? "#9a3412" : "#1d1a16"} />
            </g>
          ))}
        </svg>
        <div className="col-span-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#7a6a55]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Figure 1</div>
          <div className="mt-1 text-[20px] leading-tight">{active.title}</div>
          <p className="mt-2 text-[14px] leading-relaxed text-[#3f382f]">{active.detail} Marked at {money(active.value)} in {ymLabel(active.ym)}.</p>
          <div className="mt-3 flex flex-wrap gap-1" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
            {marks.map((m, n) => (
              <button key={m.title} type="button" onClick={() => setNote(n)} className={`rounded-full px-2 py-1 text-[10px] ${n === note ? "bg-[#1d1a16] text-[#f3ecdf]" : "bg-[#e7dcc8] text-[#3f382f]"}`}>
                {m.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const CLASS_INK: Record<string, string> = {
  "US Equity": "#1e3a5f",
  "Intl Equity": "#0f5c56",
  Bonds: "#8a5a12",
  "Real Estate": "#8c3b22",
  Commodities: "#a16207",
  Crypto: "#5b21b6",
  Cash: "#44403c",
};

function gainInk(p: number) {
  if (p >= 80) return "#14532d";
  if (p >= 25) return "#1f7a4d";
  if (p >= 0) return "#8aa38a";
  if (p >= -8) return "#c4847c";
  return "#8d3a34";
}

export function D4a() {
  const [mode, setMode] = useState<"gain" | "day" | "class">("gain");
  const [id, setId] = useState("NVDA");
  const boxes = useMemo(() => treemap(HOLDINGS.map((h) => ({ id: h.ticker, value: h.value })), 1000, 520), []);
  const h = HOLDINGS.find((x) => x.ticker === id) ?? HOLDINGS[0];
  const fill = (t: string) => {
    const row = HOLDINGS.find((x) => x.ticker === t)!;
    if (mode === "class") return CLASS_INK[row.assetClass];
    if (mode === "day") return row.dayPct >= 0 ? "#1f7a4d" : "#9d3b32";
    return gainInk(row.gainPct);
  };
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f6f4f0", color: "#1c1915" }} className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a8176]">Holdings map</div>
          <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-[32px] font-medium leading-none">Every dollar, in proportion</h2>
        </div>
        <div className="flex rounded-full bg-[#ebe6de] p-1 text-[12px]">
          {(["gain", "day", "class"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full px-3 py-1 ${mode === m ? "bg-white" : "text-[#6f675e]"}`}>
              {m === "gain" ? "Since purchase" : m === "day" ? "Today" : "Asset class"}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 1000 520" className="mt-4 h-[480px] w-full">
        {boxes.map((b) => {
          const row = HOLDINGS.find((x) => x.ticker === b.id)!;
          const narrow = b.w < 70 || b.h < 42;
          return (
            <g key={b.id} onClick={() => setId(b.id)} className="cursor-pointer">
              <rect x={b.x + 1.5} y={b.y + 1.5} width={Math.max(0, b.w - 3)} height={Math.max(0, b.h - 3)} fill={fill(b.id)} opacity={id === b.id ? 1 : 0.88} />
              {!narrow && (
                <>
                  <text x={b.x + 10} y={b.y + 22} fill="white" fontSize="13" fontWeight="600">{row.ticker}</text>
                  <text x={b.x + 10} y={b.y + 38} fill="white" fontSize="11" opacity="0.85">{row.weight.toFixed(1)}%</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-[#e6e0d6]">
        <div>
          <span className="font-semibold">{h.ticker}</span>
          <span className="ml-2 text-[#6f675e]">{h.name}</span>
        </div>
        <div className="flex gap-6 text-sm tabular">
          <span>Value {money(h.value)}</span>
          <span style={{ color: tone(h.gain) }}>{signed(h.gain)} · {pct(h.gainPct)}</span>
          <span style={{ color: tone(h.dayPct) }}>Today {pct(h.dayPct, 2)}</span>
          <span>{h.weight.toFixed(1)}% of book</span>
        </div>
      </div>
    </div>
  );
}

export function D4b() {
  const [by, setBy] = useState<"weight" | "risk">("weight");
  const [id, setId] = useState("BTC");
  const items = useMemo(() => {
    const src = by === "weight" ? HOLDINGS.map((h) => ({ id: h.ticker, value: h.value })) : RISK.map((h) => ({ id: h.ticker, value: Math.max(0.15, h.risk) }));
    return packCircles(src, 760, 520, 0.5);
  }, [by]);
  const h = HOLDINGS.find((x) => x.ticker === id) ?? HOLDINGS[0];
  const risk = RISK.find((r) => r.ticker === id);
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#0c1420", color: "#e8eef6" }} className="grid grid-cols-12">
      <div className="col-span-8 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#8eb4d4]">Orbital map</div>
            <div className="text-lg">Size is {by === "weight" ? "money" : "share of risk"}. Ring is today's move.</div>
          </div>
          <div className="flex rounded-full bg-[#152233] p-1 text-[12px]">
            {(["weight", "risk"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setBy(m)} className={`rounded-full px-3 py-1 ${by === m ? "bg-[#e8eef6] text-[#0c1420]" : "text-[#b7c6d6]"}`}>{m}</button>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 760 520" className="mt-2 h-[500px] w-full">
          {items.map((c) => {
            const row = HOLDINGS.find((x) => x.ticker === c.id)!;
            const on = id === c.id;
            return (
              <g key={c.id} onClick={() => setId(c.id)} className="cursor-pointer">
                <circle cx={c.x} cy={c.y} r={c.r} fill={CLASS_INK[row.assetClass]} opacity={on ? 1 : 0.78} />
                <circle cx={c.x} cy={c.y} r={c.r - 3} fill="none" stroke={row.dayPct >= 0 ? "#b6f3c0" : "#ffb4a8"} strokeWidth={Math.min(6, 1 + Math.abs(row.dayPct))} />
                {c.r > 26 && <text x={c.x} y={c.y + 4} textAnchor="middle" fill="white" fontSize={Math.min(16, c.r / 3)} fontWeight="600">{row.ticker}</text>}
              </g>
            );
          })}
        </svg>
      </div>
      <aside className="col-span-4 border-l border-[#1d2c3e] p-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#8eb4d4]">{h.assetClass}</div>
        <div className="mt-2 text-[40px] leading-none">{h.ticker}</div>
        <div className="mt-1 text-[#b7c6d6]">{h.name}</div>
        <dl className="mt-6 space-y-3 text-sm">
          {[
            ["Market value", money(h.value)],
            ["Share of money", `${h.weight.toFixed(1)}%`],
            ["Share of risk", `${risk?.risk.toFixed(1) ?? "—"}%`],
            ["Since purchase", pct(h.gainPct)],
            ["Today", pct(h.dayPct, 2)],
            ["Position", `${qty(h.qty)} @ ${px(h.cost)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-[#1d2c3e] pb-2">
              <dt className="text-[#8eb4d4]">{k}</dt>
              <dd className="tabular">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-[#c5d2e0]">{h.blurb}</p>
      </aside>
    </div>
  );
}

export function D4c() {
  const [id, setId] = useState<string | null>(null);
  const h = HOLDINGS.find((x) => x.ticker === id);
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#fbf7f1", color: "#1a1a1a" }} className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#9a7b62]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Quilt</div>
          <h2 className="text-[30px] leading-none">Columns are classes. Blocks are holdings.</h2>
        </div>
        <div className="text-right text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
          {h ? (
            <span>{h.ticker} · {money(h.value)} · {pct(h.gainPct)} since cost · {h.weight.toFixed(1)}% · {qty(h.qty)} @ {px(h.cost)}</span>
          ) : (
            <span className="text-[#8a8176]">Hover a block. Width is class weight. Height inside the column is the holding.</span>
          )}
        </div>
      </div>
      <div className="mt-5 flex h-[460px] gap-1">
        {CLASSES.map((c) => (
          <div key={c.name} style={{ width: `${c.weight}%` }} className="flex min-w-[46px] flex-col">
            <div className="mb-1 truncate text-[10px] uppercase tracking-wider text-[#6f675e]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
              {c.name} {c.weight.toFixed(0)}%
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-px">
              {c.holdings.map((row) => (
                <button
                  key={row.ticker}
                  type="button"
                  onMouseEnter={() => setId(row.ticker)}
                  onMouseLeave={() => setId(null)}
                  onClick={() => setId(row.ticker)}
                  style={{ flexGrow: row.value, background: gainInk(row.gainPct), color: "white" }}
                  className="flex min-h-[18px] items-end justify-between px-1.5 pb-1 text-left text-[11px]"
                >
                  <span>{row.weight > 2.2 ? row.ticker : ""}</span>
                  <span className="tabular opacity-80">{row.weight > 3 ? `${row.weight.toFixed(0)}%` : ""}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3 text-[11px] text-[#6f675e]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
        <span>Since purchase</span>
        {[[-20, "#8d3a34"], [0, "#8aa38a"], [40, "#1f7a4d"], [100, "#14532d"]].map(([n, color]) => (
          <span key={String(n)} className="inline-flex items-center gap-1">
            <i className="inline-block h-2.5 w-2.5" style={{ background: String(color) }} />
            {String(n)}%
          </span>
        ))}
      </div>
    </div>
  );
}
