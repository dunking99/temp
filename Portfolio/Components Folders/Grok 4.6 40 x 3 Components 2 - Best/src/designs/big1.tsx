import { useState } from "react";
import {
  AS_OF_SHORT,
  CLASSES,
  CURRENT_DD,
  EPISODES,
  HISTORY,
  HOLDINGS,
  MONTHS_FROM_PEAK,
  PEAK_VALUE,
  TOTAL,
  bridge,
  holding,
  lotsFor,
  tradeRows,
} from "@/lib/data";
import { areaPath, linePath, money, pct, points, px, qty, signed, ymLabel } from "@/lib/format";

export function D19a() {
  const [i, setI] = useState<number | null>(null);
  const dds = HISTORY.map((p) => p.dd * 100);
  const min = Math.min(...dds, -5);
  const pts = points(dds, 920, 280, 12, { min, max: 2 });
  const idx = i ?? dds.length - 1;
  const row = HISTORY[idx];
  const zeroY = points([0], 920, 280, 12, { min, max: 2 })[0][1];
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f4f7f8", color: "#102027" }} className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#6d838c]">Underwater</div>
          <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-[32px] leading-none">How far beneath the last high</h2>
        </div>
        <div className="text-right">
          <div className="tabular text-[28px] text-[#9d3b32]">{pct(row.dd * 100)}</div>
          <div className="text-xs text-[#6d838c]">{ymLabel(row.ym)} · peak then {money(row.peak)}</div>
        </div>
      </div>
      <svg
        viewBox="0 0 920 280"
        className="mt-3 h-[300px] w-full"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setI(Math.round(((e.clientX - r.left) / r.width) * (dds.length - 1)));
        }}
        onMouseLeave={() => setI(null)}
      >
        <line x1="12" x2="908" y1={zeroY} y2={zeroY} stroke="#c5d0d4" />
        <path d={areaPath(pts, zeroY)} fill="#f0c7c1" />
        <path d={linePath(pts)} fill="none" stroke="#9d3b32" strokeWidth="1.6" />
        <line x1={pts[idx][0]} x2={pts[idx][0]} y1="8" y2="270" stroke="#102027" strokeDasharray="3 3" />
        <circle cx={pts[idx][0]} cy={pts[idx][1]} r="4" fill="#102027" />
      </svg>
      <div className="flex justify-between text-[11px] text-[#6d838c]">
        <span>{ymLabel(HISTORY[0].ym)}</span>
        <span>Zero is a new high. Everything below it is a drawdown.</span>
        <span>{ymLabel(HISTORY.at(-1)!.ym)}</span>
      </div>
    </div>
  );
}

export function D19b() {
  const [id, setId] = useState(EPISODES[0]?.id ?? "");
  const ep = EPISODES.find((e) => e.id === id) ?? EPISODES[0];
  const maxM = Math.max(...EPISODES.map((e) => e.monthsDown + (e.monthsRecover ?? MONTHS_FROM_PEAK)), 1);
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#16120f", color: "#f6efe6" }} className="grid grid-cols-12">
      <div className="col-span-7 p-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#c4a882]">Episodes</div>
        <h2 className="text-[28px] leading-none">Length is time. Colour is depth.</h2>
        <div className="mt-5 space-y-3">
          {EPISODES.map((e) => (
            <button key={e.id} type="button" onClick={() => setId(e.id)} className={`block w-full text-left ${id === e.id ? "opacity-100" : "opacity-70 hover:opacity-100"}`}>
              <div className="mb-1 flex justify-between text-xs text-[#c4a882]">
                <span>{e.name} · {ymLabel(e.start)}</span>
                <span>{pct(e.depth * 100)} · {e.recovered ? "recovered" : "open"}</span>
              </div>
              <div className="h-7 rounded bg-[#2a241e]">
                <div className="flex h-full">
                  <div className="h-full rounded-l" style={{ width: `${(e.monthsDown / maxM) * 100}%`, background: "#e07a5f" }} />
                  <div className="h-full rounded-r" style={{ width: `${((e.monthsRecover ?? 2) / maxM) * 100}%`, background: e.recovered ? "#81b29a" : "#e07a5f55" }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {ep && (
        <aside className="col-span-5 border-l border-[#2a241e] p-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#c4a882]">{ep.recovered ? "Closed episode" : "Still open"}</div>
          <div className="mt-2 text-[40px] leading-none">{ep.name}</div>
          <dl className="mt-6 space-y-2 text-sm">
            {[
              ["Peak", money(ep.peakValue)],
              ["Trough", `${money(ep.troughValue)} · ${ymLabel(ep.trough)}`],
              ["Depth", pct(ep.depth * 100)],
              ["Months falling", String(ep.monthsDown)],
              ["Months healing", ep.monthsRecover == null ? "Not yet" : String(ep.monthsRecover)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[#2a241e] pb-2">
                <dt className="text-[#c4a882]">{k}</dt><dd className="tabular">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )}
    </div>
  );
}

export function D19c() {
  const [compare, setCompare] = useState(EPISODES.find((e) => e.name.includes("Inflation"))?.id ?? EPISODES[0]?.id);
  const ep = EPISODES.find((e) => e.id === compare) ?? EPISODES[0];
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f7f3ec", color: "#1c1915" }} className="grid grid-cols-12">
      <div className="col-span-5 border-r border-[#e6dfd2] p-8">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a735c]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Distance from the high</div>
        <div className="mt-3 text-[72px] leading-[0.85] tracking-tight">{pct(CURRENT_DD * 100)}</div>
        <p className="mt-4 text-[18px] leading-snug">
          The high was {money(PEAK_VALUE)}. Today is {money(TOTAL)}. That is {MONTHS_FROM_PEAK} month{MONTHS_FROM_PEAK === 1 ? "" : "s"} of unfinished repair.
        </p>
      </div>
      <div className="col-span-7 p-6">
        <div className="text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Set this pullback beside an older one.</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EPISODES.map((e) => (
            <button key={e.id} type="button" onClick={() => setCompare(e.id)} className={`rounded-full px-3 py-1 text-[12px] ${compare === e.id ? "bg-[#1c1915] text-white" : "bg-white"}`} style={{ fontFamily: "Instrument Sans, sans-serif" }}>
              {e.name}
            </button>
          ))}
        </div>
        {ep && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-4">
              <div className="text-xs uppercase tracking-wider text-[#8a735c]">Now</div>
              <div className="mt-2 text-[32px]">{pct(CURRENT_DD * 100)}</div>
              <div className="text-sm text-[#5c5146]">{MONTHS_FROM_PEAK} months in, not recovered.</div>
            </div>
            <div className="rounded-2xl bg-[#1c1915] p-4 text-[#f7f3ec]">
              <div className="text-xs uppercase tracking-wider text-[#cbbba6]">{ep.name}</div>
              <div className="mt-2 text-[32px]">{pct(ep.depth * 100)}</div>
              <div className="text-sm text-[#e7ded0]">{ep.recovered ? `Healed in ${ep.monthsRecover} months.` : "That one is also open."}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function D21a() {
  const [taxable, setTaxable] = useState(true);
  const trades = tradeRows().filter((t) => (taxable ? t.account === "Taxable" || t.side === "BUY" : true));
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f6f4ef", color: "#1c1915" }} className="grid grid-cols-12">
      <div className="col-span-5 border-r border-[#e7e1d6] p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8a8176]">Drift from policy</div>
        <div className="mt-3 space-y-3">
          {CLASSES.map((c) => (
            <div key={c.name}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{c.name}</span>
                <span className="tabular">{c.weight.toFixed(1)}% vs {c.target}% · {signed(c.dollars)}</span>
              </div>
              <div className="relative h-2 rounded-full bg-[#ece7de]">
                <div className="absolute top-0 h-2 rounded-full bg-[#1e3a5f]" style={{ width: `${Math.min(100, c.weight)}%` }} />
                <div className="absolute top-[-3px] h-3.5 w-px bg-[#b45309]" style={{ left: `${c.target}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-7 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Tax-aware trades, not a full reset</h2>
          <button type="button" onClick={() => setTaxable((v) => !v)} className={`rounded-full px-3 py-1 text-xs ${taxable ? "bg-[#1c1915] text-white" : "bg-[#ece7de]"}`}>
            {taxable ? "Taxable sells only" : "All accounts"}
          </button>
        </div>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-[#8a8176]">
              <th className="py-1">Side</th><th>Name</th><th className="text-right">Shares</th><th className="text-right">Amount</th><th>Why</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.ticker + t.side} className="border-t border-[#eee7dc]">
                <td className={`py-2 font-semibold ${t.side === "SELL" ? "text-[#9d3b32]" : "text-[#1b6b45]"}`}>{t.side}</td>
                <td>{t.ticker}</td>
                <td className="tabular text-right">{qty(t.shares)}</td>
                <td className="tabular text-right">{money(t.amount)}</td>
                <td className="pl-3 text-xs text-[#5c564e]">{t.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function D21b() {
  const rows = tradeRows();
  const [staged, setStaged] = useState<string[]>(rows.filter((r) => r.side === "SELL").map((r) => r.ticker + r.side));
  const on = rows.filter((r) => staged.includes(r.ticker + r.side));
  const cash = on.reduce((s, r) => s + (r.side === "SELL" ? r.amount : -r.amount), 0);
  const tax = on.reduce((s, r) => s + r.tax, 0);
  const toggle = (id: string) => setStaged((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#f3f1ea", color: "#1a1a1a" }} className="p-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#7a7268]">Order blotter</div>
          <div className="text-2xl">Stage the trades you can live with</div>
        </div>
        <div className="text-right text-sm">
          <div>Cash from staged trades {signed(cash)}</div>
          <div>Est. long-term tax {money(tax)}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {rows.map((t) => {
          const id = t.ticker + t.side;
          const hot = staged.includes(id);
          return (
            <button key={id} type="button" onClick={() => toggle(id)} className={`rounded-xl border p-3 text-left ${hot ? "border-[#1a1a1a] bg-white" : "border-[#e4ded2] bg-[#faf8f4] opacity-70"}`}>
              <div className="flex justify-between">
                <span className={t.side === "SELL" ? "text-[#9d3b32]" : "text-[#1b6b45]"}>{t.side} {t.ticker}</span>
                <span>{hot ? "STAGED" : "HOLD"}</span>
              </div>
              <div className="mt-2 text-[13px]">{qty(t.shares)} @ {px(t.price)} · {money(t.amount)}</div>
              <div className="mt-1 text-[11px] text-[#6f675e]">{t.account}{t.realised ? ` · gain ${money(t.realised)}` : ""}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function D21c() {
  const [id, setId] = useState("NVDA");
  const sells = tradeRows().filter((t) => t.side === "SELL");
  const buys = tradeRows().filter((t) => t.side === "BUY");
  const focus = tradeRows().find((t) => t.ticker === id) ?? sells[0];
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#0f1720", color: "#e8eef5" }} className="p-6">
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#8eb0c8]">Transfer map</div>
      <h2 className="text-[28px] leading-none">Money leaving the heavy side, arriving on the light side</h2>
      <div className="mt-5 grid grid-cols-[1fr_120px_1fr] gap-3">
        <div className="space-y-2">
          {sells.map((t) => (
            <button key={t.ticker} type="button" onClick={() => setId(t.ticker)} className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left ${id === t.ticker ? "bg-[#e07a5f] text-[#1a100c]" : "bg-[#1b2833]"}`}>
              <span>Sell {t.ticker}</span><span className="tabular text-sm">{money(t.amount)}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center text-3xl text-[#8eb0c8]">→</div>
        <div className="space-y-2">
          {buys.map((t) => (
            <button key={t.ticker} type="button" onClick={() => setId(t.ticker)} className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left ${id === t.ticker ? "bg-[#8fbf9f] text-[#102016]" : "bg-[#1b2833]"}`}>
              <span>Buy {t.ticker}</span><span className="tabular text-sm">{money(t.amount)}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-[#c5d4e2]">{focus.ticker}: {focus.reason} About {money(focus.amount)} at {px(focus.price)}.</p>
    </div>
  );
}

export function D22a() {
  const [which, setWhich] = useState<"1y" | "3y" | "si">("1y");
  const [step, setStep] = useState(0);
  const parts = bridge(which);
  let run = 0;
  const cols = parts.map((p, i) => {
    const start = i === 0 ? 0 : run;
    run += p.amount;
    return { ...p, start, end: run };
  });
  const max = Math.max(...cols.map((c) => Math.max(c.start, c.end, 0)));
  const min = Math.min(...cols.map((c) => Math.min(c.start, c.end, 0)), 0);
  const y = (v: number) => 20 + ((max - v) / (max - min || 1)) * 220;
  const colors: Record<string, string> = { base: "#1e3a5f", flow: "#0f766e", income: "#a16207", market: "#1b6b45", fx: "#9d3b32" };
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f8f6", color: "#142018" }} className="p-6">
      <div className="flex items-center justify-between">
        <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-[30px] leading-none">From then to {money(TOTAL)}</h2>
        <div className="flex gap-1 rounded-full bg-[#e7ece8] p-1 text-xs">
          {(["1y", "3y", "si"] as const).map((k) => (
            <button key={k} type="button" onClick={() => { setWhich(k); setStep(0); }} className={`rounded-full px-3 py-1 ${which === k ? "bg-white" : ""}`}>{k === "si" ? "Since open" : k.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 860 260" className="mt-4 h-[280px] w-full">
        {cols.map((c, i) => {
          const x = 40 + i * 140;
          const top = y(Math.max(c.start, c.end));
          const bot = y(Math.min(c.start, c.end));
          return (
            <g key={c.key} onClick={() => setStep(i)} className="cursor-pointer">
              <rect x={x} y={top} width="78" height={Math.max(2, bot - top)} fill={colors[c.tone]} opacity={step === i ? 1 : 0.75} />
              {i < cols.length - 1 && <line x1={x + 78} x2={x + 140} y1={y(c.end)} y2={y(c.end)} stroke="#c5cdc6" strokeDasharray="3 3" />}
              <text x={x} y="250" fontSize="11" fill="#142018">{c.label.split(" ")[0]}</text>
            </g>
          );
        })}
      </svg>
      <div className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-[#e3e8e4]">
        <strong>{cols[step].label}.</strong> {signed(cols[step].amount)}. Running total after this step: {money(cols[step].end)}.
      </div>
    </div>
  );
}

export function D22b() {
  const [which, setWhich] = useState<"1y" | "3y" | "si">("si");
  const [open, setOpen] = useState<string | null>("market");
  const parts = bridge(which);
  const copy: Record<string, string> = {
    open: "The value on the first day of the window. Everything after is a change, not a restatement.",
    flow: "Cash that arrived from outside the portfolio, or left it. Market moves are not in this step.",
    out: "Money taken out. It reduces the ending value without being a loss.",
    income: "Dividends and interest that stayed in the book instead of being spent.",
    market: "Price change on what was already owned. This is the part skill and luck share.",
    fx: "The same holdings, translated. A gain here is not a company doing better.",
  };
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f3ecdf", color: "#1d1a16" }} className="p-6">
      <div className="flex items-end justify-between">
        <h2 className="text-[32px] leading-none">The walk from opening value to today</h2>
        <div className="flex gap-2 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
          {(["1y", "3y", "si"] as const).map((k) => (
            <button key={k} type="button" onClick={() => setWhich(k)} className={`rounded-full px-3 py-1 ${which === k ? "bg-[#1d1a16] text-[#f3ecdf]" : "bg-white"}`}>{k}</button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {parts.map((p) => (
          <button key={p.key} type="button" onClick={() => setOpen(open === p.key ? null : p.key)} className="flex w-full items-stretch border-t border-[#1d1a16] text-left">
            <div className="w-56 py-4 text-[20px]">{p.label}</div>
            <div className="flex-1 py-4 text-[20px] tabular" style={{ color: p.amount < 0 ? "#9d3b32" : "#1d1a16" }}>{signed(p.amount)}</div>
            {open === p.key && <div className="max-w-md py-4 text-[15px] leading-snug text-[#3f382f]">{copy[p.key]}</div>}
          </button>
        ))}
        <div className="flex border-t-2 border-[#1d1a16] py-4 text-[24px]">
          <div className="w-56">Now</div>
          <div className="tabular">{money(TOTAL)}</div>
        </div>
      </div>
    </div>
  );
}

export function D22c() {
  const [which, setWhich] = useState<"1y" | "3y" | "si">("1y");
  const parts = bridge(which);
  const open = parts[0];
  const rest = parts.slice(1);
  return (
    <div style={{ fontFamily: '"Libre Baskerville", serif', background: "#f7f1e6", color: "#2a2118" }} className="px-10 py-8">
      <div className="flex items-center justify-between border-b border-[#2a2118] pb-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Reconciliation</div>
          <div className="text-[26px]">Statement of change</div>
        </div>
        <div className="flex gap-2 text-[12px]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
          {(["1y", "3y", "si"] as const).map((k) => (
            <button key={k} type="button" onClick={() => setWhich(k)} className={`border px-2 py-1 ${which === k ? "bg-[#2a2118] text-[#f7f1e6]" : ""}`}>{k === "si" ? "Inception" : k.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between text-[18px]">
        <span>{open.label}</span><span className="tabular">{money(open.amount)}</span>
      </div>
      <div className="mt-2 border-t border-[#e6dccb]">
        {rest.map((p) => (
          <div key={p.key} className="flex justify-between border-b border-[#efe6d6] py-2 text-[16px]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
            <span>{p.label}</span>
            <span className="tabular" style={{ color: p.amount < 0 ? "#9d3b32" : "#2a2118" }}>{signed(p.amount)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[22px]">
        <span>Closing value</span><span className="tabular">{money(TOTAL)}</span>
      </div>
      <p className="mt-4 text-[13px] text-[#6e6254]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>The lines add to the closing value. Income retained is not a contribution. Currency is not a market gain.</p>
    </div>
  );
}

export function D23a() {
  const [id, setId] = useState("NVDA");
  const [range, setRange] = useState<"1Y" | "ALL">("1Y");
  const h = holding(id);
  const series = range === "1Y" ? h.spark.slice(-18) : h.spark;
  const pts = points(series, 520, 180, 8);
  const lots = lotsFor(h);
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#0e1412", color: "#e9efe8" }} className="grid grid-cols-12">
      <div className="col-span-3 max-h-[560px] overflow-auto border-r border-[#24302a]">
        {HOLDINGS.map((row) => (
          <button key={row.ticker} type="button" onClick={() => setId(row.ticker)} className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${row.ticker === id ? "bg-[#dff26a] text-[#12180f]" : "hover:bg-[#17201b]"}`}>
            <span>{row.ticker}</span><span className="tabular text-xs">{row.weight.toFixed(1)}%</span>
          </button>
        ))}
      </div>
      <div className="col-span-9 p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#9bb59a]">{h.assetClass} · {h.account}</div>
            <div className="text-[40px] leading-none">{h.ticker} <span className="text-[18px] text-[#b7c4b4]">{h.name}</span></div>
            <div className="mt-2 tabular text-3xl">{px(h.price)} <span className="text-lg" style={{ color: h.dayPct >= 0 ? "#dff26a" : "#ff9b8c" }}>{pct(h.dayPct, 2)}</span></div>
          </div>
          <div className="flex gap-1 text-xs">
            {(["1Y", "ALL"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRange(r)} className={`rounded-full px-3 py-1 ${range === r ? "bg-[#e9efe8] text-[#12180f]" : "border border-[#345044]"}`}>{r}</button>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 520 180" className="mt-3 h-40 w-full"><path d={areaPath(pts, 172)} fill="#1c2b22" /><path d={linePath(pts)} fill="none" stroke="#dff26a" strokeWidth="1.6" /></svg>
        <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
          {[
            ["Position", `${qty(h.qty)} @ ${px(h.cost)}`],
            ["Value", money(h.value)],
            ["Gain", `${signed(h.gain)} · ${pct(h.gainPct)}`],
            ["Weight", `${h.weight.toFixed(2)}%`],
            ["Income", money(h.income)],
            ["Lots", String(lots.length)],
            ["Beta", h.beta.toFixed(2)],
            ["52w", `${px(h.low52)}–${px(h.high52)}`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-[#17201b] px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-[#8fa894]">{k}</div>
              <div className="tabular">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function D23b() {
  const [id, setId] = useState("AAPL");
  const [tab, setTab] = useState<"Position" | "History" | "Income" | "Risk">("Position");
  const h = holding(id);
  const lots = lotsFor(h);
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fbfaf7", color: "#1c1915" }} className="grid grid-cols-12">
      <aside className="col-span-3 border-r border-[#eee7dc] p-4">
        <div className="text-[11px] uppercase tracking-[0.16em] text-[#8a8176]">Dossier</div>
        <select value={id} onChange={(e) => setId(e.target.value)} className="mt-2 w-full rounded-lg border border-[#e6dfd4] bg-white px-2 py-2 text-sm">
          {HOLDINGS.map((row) => <option key={row.ticker} value={row.ticker}>{row.ticker} — {row.name}</option>)}
        </select>
        <div className="mt-4 space-y-1">
          {(["Position", "History", "Income", "Risk"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${tab === t ? "bg-[#1c1915] text-white" : "hover:bg-[#f3efe7]"}`}>{t}</button>
          ))}
        </div>
      </aside>
      <div className="col-span-9 p-6">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8a8176]">{h.ticker} · {tab}</div>
        <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-[36px] leading-none">{h.name}</h2>
        {tab === "Position" && (
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {lots.map((lot) => (
              <div key={lot.date} className="rounded-xl bg-[#f6f3ec] p-3">
                <div className="text-xs text-[#8a8176]">{lot.date} · {lot.term}</div>
                <div className="mt-1 tabular">{qty(lot.qty)} @ {px(lot.cost)}</div>
                <div className="tabular text-[#1b6b45]">{signed((h.price - lot.cost) * lot.qty)} unrealised</div>
              </div>
            ))}
          </div>
        )}
        {tab === "History" && (
          <svg viewBox="0 0 640 200" className="mt-4 h-48 w-full">
            <path d={linePath(points(h.spark, 640, 200, 8))} fill="none" stroke="#1e3a5f" strokeWidth="2" />
          </svg>
        )}
        {tab === "Income" && (
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed">Forward income {money(h.income)} a year, a {h.yieldPct.toFixed(2)}% yield on the current price and {h.costBasis ? ((h.income / h.costBasis) * 100).toFixed(2) : "0"}% on what was paid. Weight {h.weight.toFixed(1)}%.</p>
        )}
        {tab === "Risk" && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[["Beta", h.beta.toFixed(2)], ["Volatility", `${h.vol}%`], ["Day move", pct(h.dayPct, 2)]].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-[#eee7dc] p-4"><div className="text-xs text-[#8a8176]">{k}</div><div className="text-2xl tabular">{v}</div></div>
            ))}
          </div>
        )}
        <p className="mt-4 text-sm text-[#5c564e]">{h.blurb} Value {money(h.value)}. Gain {signed(h.gain)} ({pct(h.gainPct)}).</p>
      </div>
    </div>
  );
}

export function D23c() {
  const [id, setId] = useState("BTC");
  const [showLots, setShowLots] = useState(false);
  const h = holding(id);
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f7f1e8", color: "#1c1612" }} className="grid grid-cols-12">
      <div className="col-span-8 border-r border-[#1c1612] p-8">
        <div className="text-[11px] uppercase tracking-[0.22em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Holding profile · {AS_OF_SHORT}</div>
        <h2 className="mt-2 text-[54px] leading-[0.9]">{h.name}</h2>
        <p className="mt-4 max-w-xl text-[20px] leading-snug">{h.blurb}</p>
        <button type="button" onClick={() => setShowLots((v) => !v)} className="mt-4 text-sm underline" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
          {showLots ? "Hide purchase lots" : "Show purchase lots"}
        </button>
        {showLots && (
          <ul className="mt-3 space-y-1 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
            {lotsFor(h).map((lot) => (
              <li key={lot.date}>{lot.date} · {qty(lot.qty)} at {px(lot.cost)} · {lot.term} · now {signed((h.price - lot.cost) * lot.qty)}</li>
            ))}
          </ul>
        )}
      </div>
      <aside className="col-span-4 p-6" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
        <select value={id} onChange={(e) => setId(e.target.value)} className="w-full border border-[#1c1612] bg-transparent px-2 py-2 text-sm">
          {HOLDINGS.map((row) => <option key={row.ticker}>{row.ticker}</option>)}
        </select>
        <div className="mt-4 text-[40px] tabular leading-none">{px(h.price)}</div>
        <div className="text-sm" style={{ color: h.dayPct >= 0 ? "#1b6b45" : "#9d3b32" }}>{pct(h.dayPct, 2)} today</div>
        <dl className="mt-5 space-y-2 text-sm">
          {[["Position", `${qty(h.qty)} @ ${px(h.cost)}`], ["Value", money(h.value)], ["Gain", `${signed(h.gain)} (${pct(h.gainPct)})`], ["Weight", `${h.weight.toFixed(1)}%`], ["Trend", h.ret1y >= 0 ? "Higher over the year" : "Lower over the year"]].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-[#e6dccb] py-1"><dt>{k}</dt><dd className="tabular">{v}</dd></div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
