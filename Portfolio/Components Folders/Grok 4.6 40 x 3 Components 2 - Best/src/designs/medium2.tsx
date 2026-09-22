import { useMemo, useState } from "react";
import {
  AS_OF_SHORT,
  BENCH_NAMES,
  BENCH_PERIODS,
  CLASSES,
  FEB,
  FUNDS,
  HOLDINGS,
  PERIODS,
  TOTAL,
  WEIGHTED_ER,
  holding,
} from "@/lib/data";
import { linePath, money, pct, points, px, qty, signed } from "@/lib/format";

const CLASS_HEX: Record<string, string> = {
  "US Equity": "#1e3a5f",
  "Intl Equity": "#0f766e",
  Bonds: "#a16207",
  "Real Estate": "#9a3412",
  Commodities: "#ca8a04",
  Crypto: "#6d28d9",
  Cash: "#57534e",
};

export function D81a() {
  const [id, setId] = useState(CLASSES[0].name);
  const [per, setPer] = useState<"ret1y" | "monthPct">("ret1y");
  const c = CLASSES.find((x) => x.name === id)!;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f6f5f2", color: "#1c1915" }} className="p-4">
      <div className="mb-3 flex justify-end gap-1 text-xs">
        <button type="button" onClick={() => setPer("monthPct")} className={`rounded-full px-3 py-1 ${per === "monthPct" ? "bg-[#1c1915] text-white" : "bg-white"}`}>Month</button>
        <button type="button" onClick={() => setPer("ret1y")} className={`rounded-full px-3 py-1 ${per === "ret1y" ? "bg-[#1c1915] text-white" : "bg-white"}`}>1 year</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {CLASSES.map((row) => {
          const spark = row.holdings[0]?.spark ?? [1, 2, 1.5];
          const pts = points(spark, 140, 36, 2);
          return (
            <button key={row.name} type="button" onClick={() => setId(row.name)} className={`rounded-2xl p-3 text-left ${id === row.name ? "bg-[#1c1915] text-white" : "bg-white"}`}>
              <div className="text-[11px] uppercase tracking-wider opacity-70">{row.name}</div>
              <div className="mt-1 text-xl tabular">{money(row.value)}</div>
              <div className="text-xs tabular">{row.weight.toFixed(1)}% · {pct(row[per])}</div>
              <svg viewBox="0 0 140 36" className="mt-2 h-8 w-full"><path d={linePath(pts)} fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-[#5c564e]">{c.name} holds {c.holdings.map((h) => h.ticker).join(", ")}. Gain since cost {signed(c.gain)}.</p>
    </div>
  );
}

export function D81b() {
  const [id, setId] = useState<string | null>(null);
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#efeae2", color: "#1c1915" }} className="grid h-[420px] grid-cols-6 grid-rows-4 gap-2 p-3">
      {CLASSES.map((c, i) => (
        <button
          key={c.name}
          type="button"
          onClick={() => setId(c.name)}
          className="rounded-2xl p-3 text-left text-white"
          style={{ background: CLASS_HEX[c.name], gridColumn: i === 0 ? "span 3" : i === 1 ? "span 3" : "span 2", gridRow: i < 2 ? "span 2" : "span 2" }}
        >
          <div className="text-xs uppercase tracking-wider opacity-80">{c.name}</div>
          <div className="mt-1 text-2xl">{c.weight.toFixed(0)}%</div>
          <div className="text-sm opacity-90" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{money(c.value)} · {pct(c.ret1y)}</div>
          {id === c.name && <div className="mt-2 text-xs" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{c.holdings.map((h) => h.ticker).join(" · ")}</div>}
        </button>
      ))}
    </div>
  );
}

export function D81c() {
  const [open, setOpen] = useState<string | null>("US Equity");
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f7f3ec", color: "#1c1612" }} className="divide-y divide-[#e6dccb]">
      {CLASSES.map((c) => (
        <button key={c.name} type="button" onClick={() => setOpen(open === c.name ? null : c.name)} className="relative flex w-full items-center justify-between overflow-hidden px-5 py-4 text-left">
          <span className="absolute inset-y-0 left-0 opacity-15" style={{ width: `${c.weight}%`, background: CLASS_HEX[c.name] }} />
          <span className="absolute inset-y-0 left-0 border-r-2 border-[#b45309]" style={{ width: `${c.target}%` }} />
          <span className="relative text-[22px]">{c.name}</span>
          <span className="relative text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{money(c.value)} · {c.weight.toFixed(1)}% · {pct(c.ret1y)}</span>
          {open === c.name && <span className="relative ml-4 text-sm text-[#5c5146]">{c.holdings.length} lines · target {c.target}%</span>}
        </button>
      ))}
    </div>
  );
}

export function D83a() {
  const [id, setId] = useState("NVDA");
  const h = holding(id);
  const pts = points(h.spark, 280, 70, 4);
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#0e1412", color: "#e9efe8" }} className="flex justify-center p-8">
      <div className="w-[420px] rounded-3xl bg-[#17201b] p-5">
        <div className="flex justify-between text-xs text-[#9bb59a]">
          <span>{h.assetClass}</span>
          <select value={id} onChange={(e) => setId(e.target.value)} className="bg-transparent text-right">{HOLDINGS.map((r) => <option key={r.ticker}>{r.ticker}</option>)}</select>
        </div>
        <div className="mt-2 text-3xl">{h.ticker}</div>
        <div className="text-sm text-[#b7c4b4]">{h.name}</div>
        <svg viewBox="0 0 280 70" className="mt-3 h-16 w-full"><path d={linePath(pts)} fill="none" stroke="#dff26a" strokeWidth="1.6" /></svg>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>Value<div className="tabular text-lg">{money(h.value)}</div></div>
          <div>Cost<div className="tabular text-lg">{money(h.costBasis)}</div></div>
          <div>Gain<div className="tabular" style={{ color: h.gain >= 0 ? "#dff26a" : "#ff9b8c" }}>{signed(h.gain)} · {pct(h.gainPct)}</div></div>
          <div>Weight<div className="tabular text-lg">{h.weight.toFixed(1)}%</div></div>
        </div>
      </div>
    </div>
  );
}

export function D83b() {
  const [id, setId] = useState("BTC");
  const [flip, setFlip] = useState(false);
  const h = holding(id);
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#1a120c", color: "#f6efe6" }} className="flex items-center justify-center gap-6 p-8">
      <button type="button" onClick={() => setFlip((v) => !v)} className="h-[280px] w-[220px] rounded-2xl bg-gradient-to-br from-[#e7c98a] to-[#b45309] p-4 text-left text-[#1a120c]">
        {flip ? (
          <div className="text-sm leading-relaxed">{h.blurb}<div className="mt-4">Position {qty(h.qty)} @ {px(h.cost)}</div></div>
        ) : (
          <>
            <div className="text-xs uppercase tracking-wider">Holding card</div>
            <div className="mt-6 text-4xl">{h.ticker}</div>
            <div className="mt-2 text-3xl">{pct(h.gainPct)}</div>
            <div className="mt-6 text-sm">Weight {h.weight.toFixed(1)}% · {money(h.value)}</div>
          </>
        )}
      </button>
      <div className="max-w-xs text-sm">
        <div className="mb-2 text-xs uppercase tracking-wider text-[#e7c98a]">Deal another</div>
        <div className="flex flex-wrap gap-1">{HOLDINGS.slice(0, 10).map((r) => <button key={r.ticker} type="button" onClick={() => { setId(r.ticker); setFlip(false); }} className="rounded-full bg-[#2a2118] px-2 py-1 text-xs">{r.ticker}</button>)}</div>
        <p className="mt-3 text-[#e7d7c4]">Click the card to turn it. The face is the result. The back is the position.</p>
      </div>
    </div>
  );
}

export function D83c() {
  const [id, setId] = useState("VTI");
  const h = holding(id);
  const pts = points(h.spark, 360, 80, 2);
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fff", color: "#111" }} className="grid grid-cols-12 border-y border-[#111]">
      <div className="col-span-3 border-r border-[#111] p-5">
        <select value={id} onChange={(e) => setId(e.target.value)} className="w-full text-4xl font-medium tracking-tight">{HOLDINGS.map((r) => <option key={r.ticker}>{r.ticker}</option>)}</select>
        <div className="mt-1 text-sm text-[#666]">{h.name}</div>
      </div>
      <svg viewBox="0 0 360 80" className="col-span-5 h-full w-full self-center px-4"><path d={linePath(pts)} fill="none" stroke="#111" strokeWidth="1.4" /></svg>
      <div className="col-span-4 grid grid-cols-2 border-l border-[#111] text-sm">
        {[["Value", money(h.value)], ["Cost", money(h.costBasis)], ["Gain", pct(h.gainPct)], ["Weight", `${h.weight.toFixed(1)}%`]].map(([k, v]) => (
          <div key={k} className="border-b border-r border-[#111] p-3"><div className="text-[10px] uppercase tracking-wider text-[#888]">{k}</div><div className="tabular text-lg">{v}</div></div>
        ))}
      </div>
    </div>
  );
}

export function D84a() {
  const [note, setNote] = useState("1Y");
  const rows = [
    ["1M", PERIODS.month, BENCH_PERIODS["7030"].month * 100],
    ["YTD", PERIODS.ytd, BENCH_PERIODS["7030"].ytd * 100],
    ["1Y", PERIODS.oneYear, BENCH_PERIODS["7030"].oneYear * 100],
    ["3Y", PERIODS.threeYear, BENCH_PERIODS["7030"].threeYear * 100],
    ["5Y", PERIODS.fiveYear, BENCH_PERIODS["7030"].fiveYear * 100],
  ] as const;
  const copy: Record<string, string> = {
    "1M": "A short window. One good week can decide it.",
    YTD: "The year so far, including the winter fade and the March repair.",
    "1Y": "The window where the winners did most of the work.",
    "3Y": "Cumulative, not annualised. A long enough stretch to include the bear.",
    "5Y": "Cumulative since the recovery was already underway.",
  };
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#071018", color: "#f4f7fb" }} className="p-5">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#8eb4d4]">Scoreboard · Global 70/30</div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {rows.map(([label, p, b]) => {
          const win = p >= b;
          return (
            <button key={label} type="button" onClick={() => setNote(label)} className={`rounded-xl p-3 text-left ${note === label ? "bg-[#f4f7fb] text-[#071018]" : "bg-[#122033]"}`}>
              <div className="text-xs opacity-70">{label}</div>
              <div className="mt-2 text-2xl tabular">{pct(p)}</div>
              <div className="text-xs opacity-70">Bench {pct(b)}</div>
              <div className="mt-2 text-xs" style={{ color: note === label ? "#1f7a4d" : win ? "#b6f3c0" : "#ffb4a8" }}>{win ? "Book leads" : "Bench leads"}</div>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-[#c5d4e6]">{copy[note]}</p>
    </div>
  );
}

export function D84b() {
  const [kind, setKind] = useState<"7030" | "spx" | "agg">("7030");
  const bench = BENCH_PERIODS[kind];
  const rows = [
    ["Today", PERIODS.today, null],
    ["1 month", PERIODS.month, bench.month * 100],
    ["YTD", PERIODS.ytd, bench.ytd * 100],
    ["1 year", PERIODS.oneYear, bench.oneYear * 100],
    ["3 year cum.", PERIODS.threeYear, bench.threeYear * 100],
    ["Since open", PERIODS.since, bench.since * 100],
  ] as const;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fff", color: "#111" }} className="p-5">
      <div className="mb-3 flex gap-1 text-xs">{(Object.keys(BENCH_NAMES) as Array<keyof typeof BENCH_NAMES>).map((k) => <button key={k} type="button" onClick={() => setKind(k)} className={`rounded-full px-3 py-1 ${kind === k ? "bg-black text-white" : "bg-[#f3f3f3]"}`}>{BENCH_NAMES[k]}</button>)}</div>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-[10px] uppercase tracking-wider text-[#888]"><th>Period</th><th className="text-right">Portfolio</th><th className="text-right">Benchmark</th><th className="text-right">Gap</th></tr></thead>
        <tbody>
          {rows.map(([label, p, b]) => (
            <tr key={label} className="border-t border-[#eee]">
              <td className="py-2">{label}</td>
              <td className="tabular text-right">{pct(p)}</td>
              <td className="tabular text-right">{b == null ? "—" : pct(b)}</td>
              <td className="tabular text-right" style={{ color: b == null ? "#111" : p - b >= 0 ? "#1f7a4d" : "#9d3b32" }}>{b == null ? "—" : pct(p - b)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function D84c() {
  const [i, setI] = useState(2);
  const rows = [
    ["1M", PERIODS.month, BENCH_PERIODS["7030"].month * 100],
    ["YTD", PERIODS.ytd, BENCH_PERIODS["7030"].ytd * 100],
    ["1Y", PERIODS.oneYear, BENCH_PERIODS["7030"].oneYear * 100],
    ["3Y", PERIODS.threeYear, BENCH_PERIODS["7030"].threeYear * 100],
  ] as const;
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f4f0e8", color: "#1c1915" }} className="grid grid-cols-4 gap-3 p-4">
      {rows.map(([label, p, b], n) => (
        <button key={label} type="button" onMouseEnter={() => setI(n)} className={`rounded-2xl p-4 text-left ${i === n ? "bg-[#1c1915] text-white" : "bg-white"}`}>
          <div className="text-xs uppercase tracking-wider opacity-60">{label}</div>
          <div className="mt-4 space-y-2">
            <div className="h-2 rounded bg-current" style={{ width: `${Math.min(100, Math.abs(p))}%`, opacity: 0.9 }} />
            <div className="h-2 rounded bg-current" style={{ width: `${Math.min(100, Math.abs(b))}%`, opacity: 0.35 }} />
          </div>
          <div className="mt-3 text-sm tabular">{pct(p)} vs {pct(b)}</div>
        </button>
      ))}
    </div>
  );
}

export function D86a() {
  const [open, setOpen] = useState(false);
  const ret = FEB.ret * 100;
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f7f1e8", color: "#1c1612" }} className="px-10 py-8">
      <div className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Letter · February 2026</div>
      <h2 className="mt-2 text-[36px] leading-[1.05]">A down month, with money still coming in.</h2>
      <p className="mt-4 max-w-2xl text-[18px] leading-relaxed">
        The book moved from {money(FEB.start)} to {money(FEB.end)}, a {pct(ret)} market month. You added {money(FEB.flow)}. Markets took {money(Math.abs(FEB.market))}. Bonds were quiet. The winners of last year led the decline.
      </p>
      <button type="button" onClick={() => setOpen((v) => !v)} className="mt-4 text-sm underline" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{open ? "Close the appendix" : "What moved"}</button>
      {open && <p className="mt-2 max-w-2xl text-[16px]">NVIDIA and Bitcoin gave back ground. Gold and energy did not. Nothing in the policy changed. The contribution was the only deliberate act.</p>}
    </div>
  );
}

export function D86b() {
  const [which, setWhich] = useState<"all" | "market" | "flow">("all");
  const end = which === "market" ? FEB.start + FEB.market : which === "flow" ? FEB.start + FEB.flow : FEB.end;
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#f3f1ea", color: "#1a1a1a" }} className="grid grid-cols-3">
      {[["1 Feb", FEB.start], ["Change", end - FEB.start], ["28 Feb", end]].map(([k, v]) => (
        <div key={String(k)} className="border-r border-[#ddd6c8] p-6">
          <div className="text-[10px] uppercase tracking-wider text-[#7a7268]">{k}</div>
          <div className="mt-2 text-2xl">{typeof v === "number" && String(k) === "Change" ? signed(v) : money(Number(v))}</div>
        </div>
      ))}
      <div className="col-span-3 flex gap-2 border-t border-[#ddd6c8] p-4 text-xs">
        {(["all", "market", "flow"] as const).map((k) => <button key={k} type="button" onClick={() => setWhich(k)} className={`rounded-full px-3 py-1 ${which === k ? "bg-[#1a1a1a] text-white" : "bg-white"}`}>{k}</button>)}
        <span className="self-center text-[#6f675e]">Isolate the market, the deposit, or both.</span>
      </div>
    </div>
  );
}

export function D86c() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#10221c", color: "#e7f6ee" }} className="p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-[#8fbf9f]">February recap · {AS_OF_SHORT} book</div>
      <h2 className="mt-2 text-3xl">Soft month. Policy unchanged. Cash added.</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {[`Market ${pct(FEB.ret * 100)}`, `Added ${money(FEB.flow)}`, `Ended ${money(FEB.end)}`].map((c) => <span key={c} className="rounded-full bg-[#17352a] px-3 py-1 text-sm">{c}</span>)}
      </div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="mt-4 text-sm text-[#dff26a]">{open ? "Hide class drift" : "Show how the mix shifted"}</button>
      {open && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {CLASSES.map((c) => <div key={c.name} className="flex justify-between border-b border-[#24543f] py-1"><span>{c.name}</span><span>{c.weight.toFixed(1)}% now</span></div>)}
        </div>
      )}
    </div>
  );
}

export function D89a() {
  const [focus, setFocus] = useState<string | null>(null);
  const rows = [
    ["Expense", `${FUNDS.left.expense.toFixed(2)}%`, `${FUNDS.right.expense.toFixed(2)}%`, "left"],
    ["Yield", `${FUNDS.left.yield}%`, `${FUNDS.right.yield}%`, "left"],
    ["Holdings", String(FUNDS.left.holdings), String(FUNDS.right.holdings), "left"],
    ["Top 10 weight", `${FUNDS.left.top10}%`, `${FUNDS.right.top10}%`, "left"],
    ["1 year", pct(FUNDS.left.y1), pct(FUNDS.right.y1), "right"],
    ["5 year ann.", pct(FUNDS.left.y5), pct(FUNDS.right.y5), "left"],
    ["Turnover", `${FUNDS.left.turnover}%`, `${FUNDS.right.turnover}%`, "left"],
    ["Beta", FUNDS.left.beta.toFixed(2), FUNDS.right.beta.toFixed(2), "left"],
  ] as const;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f6f3", color: "#1c1915" }} className="p-5">
      <div className="grid grid-cols-2 gap-4">
        {[FUNDS.left, FUNDS.right].map((f) => (
          <div key={f.ticker}>
            <div className="text-xs uppercase tracking-wider text-[#8a8176]">{f.style} · {f.aum}</div>
            <div className="text-2xl font-medium">{f.ticker}</div>
            <div className="text-sm text-[#5c564e]">{f.name}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {rows.map(([k, a, b, win]) => (
          <button key={k} type="button" onClick={() => setFocus(k)} className="grid w-full grid-cols-3 border-t border-[#eee7dc] py-2 text-left text-sm">
            <span className={focus === k ? "font-semibold" : ""}>{k}</span>
            <span className={`tabular ${win === "left" && focus === k ? "text-[#1f7a4d]" : ""}`}>{a}</span>
            <span className={`tabular ${win === "right" && focus === k ? "text-[#1f7a4d]" : ""}`}>{b}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-[#5c564e]">{focus ? `${focus}: the quieter fund is usually the one you can keep.` : "Click a row. Last year's winner is not the five-year winner."}</p>
    </div>
  );
}

export function D89b() {
  const [arm, setArm] = useState(0);
  const axes = ["Cost", "5Y", "Yield", "Breadth", "Calm", "Tracking"];
  const left = [0.95, 0.72, 0.55, 0.92, 0.7, 0.96];
  const right = [0.22, 0.58, 0.2, 0.18, 0.35, 0.3];
  const poly = (vals: number[]) => vals.map((v, i) => {
    const ang = -Math.PI / 2 + (i / vals.length) * Math.PI * 2;
    return [160 + Math.cos(ang) * 90 * v, 150 + Math.sin(ang) * 90 * v];
  });
  const L = poly(left);
  const R = poly(right);
  const rings = [0.35, 0.65, 1].map((s) =>
    axes
      .map((_, i) => {
        const ang = -Math.PI / 2 + (i / 6) * Math.PI * 2;
        return `${160 + Math.cos(ang) * 90 * s},${150 + Math.sin(ang) * 90 * s}`;
      })
      .join(" "),
  );
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#0e1420", color: "#e8eef8" }} className="grid grid-cols-12">
      <svg viewBox="0 0 320 300" className="col-span-7 h-[320px]">
        {rings.map((pts) => <polygon key={pts} points={pts} fill="none" stroke="#243044" />)}
        <polygon points={L.map((p) => p.join(",")).join(" ")} fill="#8eb4d455" stroke="#8eb4d4" />
        <polygon points={R.map((p) => p.join(",")).join(" ")} fill="#e07a5f33" stroke="#e07a5f" />
        {axes.map((a, i) => {
          const ang = -Math.PI / 2 + (i / 6) * Math.PI * 2;
          return <text key={a} x={160 + Math.cos(ang) * 118} y={150 + Math.sin(ang) * 118} textAnchor="middle" fontSize="11" fill={arm === i ? "#fff" : "#8eb4d4"} onClick={() => setArm(i)} className="cursor-pointer">{a}</text>;
        })}
      </svg>
      <aside className="col-span-5 p-6">
        <div className="text-xs uppercase tracking-wider text-[#8eb4d4]">Blue VTI · rust NLGX</div>
        <div className="mt-2 text-2xl">{axes[arm]}</div>
        <p className="mt-3 text-sm leading-relaxed text-[#c5d4e6]">VTI scores {left[arm].toFixed(2)} and Northline {right[arm].toFixed(2)} on this arm, where 1 is the better reading. Cost, breadth and tracking are not close. Last year's return is the only place the active fund leads, and it is not on this chart.</p>
      </aside>
    </div>
  );
}

export function D89c() {
  const [open, setOpen] = useState<string | null>(null);
  const rows = [
    ["Cost", "VTI charges 0.03%. Northline charges 0.78%. On a $100,000 sleeve that is $30 versus $780 a year.", "VTI"],
    ["Holdings", "VTI owns 3,612 companies. Northline owns 48, with 61% in the top ten.", "VTI"],
    ["Performance", "Northline won the last year, 21.6% to 16.4%. Over five years VTI still leads, 13.1% to 11.4% annualised.", "Split"],
  ];
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f8f4ee", color: "#1c1612" }} className="p-6">
      <div className="rounded-full bg-[#1c1612] px-3 py-1 text-xs text-[#f8f4ee]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Verdict · keep the index, unless you are paying for a belief</div>
      <h2 className="mt-3 text-[32px] leading-none">VTI against Northline Select Growth</h2>
      {rows.map(([k, text, win]) => (
        <button key={k} type="button" onClick={() => setOpen(open === k ? null : k)} className="mt-3 block w-full border-t border-[#e6dccb] pt-3 text-left">
          <div className="flex justify-between text-[20px]"><span>{k}</span><span className="text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{win}</span></div>
          {open === k && <p className="mt-2 text-[16px] leading-snug">{text}</p>}
        </button>
      ))}
    </div>
  );
}

function grow(principal: number, years: number, annual: number, fee: number, monthly: number) {
  const path = [principal];
  let v = principal;
  for (let m = 1; m <= years * 12; m++) {
    v = v * (1 + annual / 12 - fee / 12) + monthly;
    if (m % 12 === 0) path.push(v);
  }
  return path;
}

export function D90a() {
  const [fee, setFee] = useState(1);
  const [years, setYears] = useState(20);
  const gross = useMemo(() => grow(TOTAL, years, 0.07, WEIGHTED_ER / 100, 2000), [years]);
  const net = useMemo(() => grow(TOTAL, years, 0.07, fee / 100, 2000), [fee, years]);
  const nPts = points(net, 640, 220, 8, { min: Math.min(...net, ...gross), max: Math.max(...net, ...gross) });
  const g2 = points(gross, 640, 220, 8, { min: Math.min(...net, ...gross), max: Math.max(...net, ...gross) });
  const gap = gross[gross.length - 1] - net[net.length - 1];
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f5f7fb", color: "#142033" }} className="grid grid-cols-12">
      <div className="col-span-4 border-r border-[#e1e6ef] p-5">
        <div className="text-xs uppercase tracking-wider text-[#7d8da3]">Fee gap</div>
        <div className="mt-2 text-4xl tabular">{money(gap)}</div>
        <p className="mt-2 text-sm">left on the table over {years} years if the fee is {fee.toFixed(2)}% instead of today's {WEIGHTED_ER.toFixed(2)}%.</p>
        <label className="mt-4 block text-xs">Fee {fee.toFixed(2)}%<input type="range" min={0} max={1.5} step={0.05} value={fee} onChange={(e) => setFee(Number(e.target.value))} className="mt-1 w-full" /></label>
        <label className="mt-3 block text-xs">Years {years}<input type="range" min={5} max={30} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1 w-full" /></label>
      </div>
      <svg viewBox="0 0 640 220" className="col-span-8 h-[240px] self-center">
        <path d={linePath(g2)} fill="none" stroke="#1e3a5f" strokeWidth="2" />
        <path d={linePath(nPts)} fill="none" stroke="#b45309" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function D90b() {
  const [fee, setFee] = useState(0.8);
  const years = Array.from({ length: 20 }, (_, i) => i + 1);
  const cost = years.map((y) => {
    const g = grow(TOTAL, y, 0.07, 0, 0).at(-1)!;
    const n = grow(TOTAL, y, 0.07, fee / 100, 0).at(-1)!;
    return g - n;
  });
  const max = cost[cost.length - 1];
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#1a120c", color: "#f6efe6" }} className="p-5">
      <div className="flex items-end justify-between">
        <div><div className="text-xs uppercase tracking-wider text-[#e7c98a]">Pile of fees</div><div className="text-3xl">{money(max)} by year 20</div></div>
        <label className="text-xs">Fee {fee.toFixed(2)}%<input type="range" min={0.1} max={1.5} step={0.05} value={fee} onChange={(e) => setFee(Number(e.target.value))} className="ml-2 align-middle" /></label>
      </div>
      <div className="mt-4 flex h-40 items-end gap-1">
        {cost.map((c, i) => <div key={i} className="flex-1 rounded-t bg-[#e7c98a]" style={{ height: Math.max(4, (c / max) * 150) }} />)}
      </div>
    </div>
  );
}

export function D90c() {
  const [fee, setFee] = useState(1);
  const [years, setYears] = useState(20);
  const gap = grow(TOTAL, years, 0.07, 0, 1500).at(-1)! - grow(TOTAL, years, 0.07, fee / 100, 1500).at(-1)!;
  const rank = HOLDINGS.filter((h) => h.value > gap).length + 1;
  return (
    <div style={{ fontFamily: "Fraunces, serif", background: "#f6f1e8", color: "#1c1612" }} className="grid grid-cols-12">
      <div className="col-span-7 p-8">
        <div className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>If fees were a holding</div>
        <h2 className="mt-2 text-[40px] leading-[0.95]">In {years} years, a {fee.toFixed(2)}% fee would be about your #{rank} line.</h2>
        <p className="mt-3 text-[18px]">Not a position you chose. A position that compounds against you. Today's book fee is {WEIGHTED_ER.toFixed(2)}% — gold is most of it.</p>
      </div>
      <div className="col-span-5 border-l border-[#e6dccb] p-6" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
        <div className="rounded-2xl bg-white p-4">
          <div className="text-xs uppercase tracking-wider text-[#8a735c]">FEE</div>
          <div className="mt-2 text-3xl tabular">{money(gap)}</div>
          <div className="text-sm text-[#6e6254]">forgone by year {years}</div>
        </div>
        <label className="mt-4 block text-xs">Fee {fee.toFixed(2)}%<input className="w-full" type="range" min={0.05} max={1.5} step={0.05} value={fee} onChange={(e) => setFee(Number(e.target.value))} /></label>
        <label className="mt-3 block text-xs">Horizon {years}<input className="w-full" type="range" min={5} max={30} value={years} onChange={(e) => setYears(Number(e.target.value))} /></label>
      </div>
    </div>
  );
}

