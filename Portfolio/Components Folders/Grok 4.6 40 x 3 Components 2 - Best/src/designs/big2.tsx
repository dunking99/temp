import { useMemo, useState } from "react";
import {
  AS_OF_SHORT,
  ATTRIBUTION,
  BENCH_NAMES,
  BENCH_PERIODS,
  HISTORY,
  INCOME,
  MILESTONES,
  PAYMENTS,
  PERIODS,
  RISK,
  TOTAL,
  indexed,
} from "@/lib/data";
import { areaPath, linePath, money, pct, points, ymLabel } from "@/lib/format";

type Bench = "7030" | "spx" | "agg";

export function D26a() {
  const [kind, setKind] = useState<Bench>("7030");
  const [i, setI] = useState<number | null>(null);
  const data = useMemo(() => indexed(kind), [kind]);
  const idx = i ?? data.length - 1;
  const row = data[idx];
  const domain = { min: 80, max: Math.max(...data.map((d) => Math.max(d.port, d.bench))) * 1.04 };
  const pPts = points(data.map((d) => d.port), 760, 280, 16, domain);
  const bPts = points(data.map((d) => d.bench), 760, 280, 16, domain);
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f4f7fb", color: "#142033" }} className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#7d8da3]">Growth of 100 · {AS_OF_SHORT}</div>
          <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-[30px] leading-none">The book against a benchmark</h2>
        </div>
        <div className="flex gap-1 rounded-full bg-[#e6edf5] p-1 text-xs">
          {(Object.keys(BENCH_NAMES) as Bench[]).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} className={`rounded-full px-3 py-1 ${kind === k ? "bg-white" : ""}`}>{BENCH_NAMES[k]}</button>
          ))}
        </div>
      </div>
      <div className="mt-2 text-sm text-[#5c6b80]">{ymLabel(row.ym)} · portfolio {row.port.toFixed(1)} · {BENCH_NAMES[kind]} {row.bench.toFixed(1)} · gap {row.excess >= 0 ? "+" : ""}{row.excess.toFixed(1)}</div>
      <svg viewBox="0 0 760 280" className="mt-2 h-[300px] w-full" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setI(Math.round(((e.clientX - r.left) / r.width) * (data.length - 1))); }} onMouseLeave={() => setI(null)}>
        <path d={linePath(bPts)} fill="none" stroke="#b9c4d4" strokeWidth="1.5" />
        <path d={linePath(pPts)} fill="none" stroke="#1e3a5f" strokeWidth="2.2" />
        <circle cx={pPts[idx][0]} cy={pPts[idx][1]} r="4" fill="#1e3a5f" />
      </svg>
      <div className="flex gap-4 text-xs text-[#5c6b80]"><span className="text-[#1e3a5f]">— Portfolio</span><span>— Benchmark, illustrative path</span></div>
    </div>
  );
}

export function D26b() {
  const [kind, setKind] = useState<Bench>("7030");
  const [i, setI] = useState<number | null>(null);
  const data = useMemo(() => indexed(kind), [kind]);
  const idx = i ?? data.length - 1;
  const vals = data.map((d) => d.excess);
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 0);
  const pts = points(vals, 860, 240, 12, { min: min - 2, max: max + 2 });
  const zero = points([0], 860, 240, 12, { min: min - 2, max: max + 2 })[0][1];
  const ahead = data.filter((d) => d.excess > 0).length / data.length;
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#11160f", color: "#eef6e4" }} className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#b7c9a4]">Excess only</div>
          <h2 className="text-[28px] leading-none">Above the line, the book is ahead</h2>
        </div>
        <select value={kind} onChange={(e) => setKind(e.target.value as Bench)} className="rounded bg-[#1c2618] px-2 py-1 text-sm">
          {(Object.keys(BENCH_NAMES) as Bench[]).map((k) => <option key={k} value={k}>{BENCH_NAMES[k]}</option>)}
        </select>
      </div>
      <svg viewBox="0 0 860 240" className="mt-3 h-[260px] w-full" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setI(Math.round(((e.clientX - r.left) / r.width) * (data.length - 1))); }} onMouseLeave={() => setI(null)}>
        <line x1="12" x2="848" y1={zero} y2={zero} stroke="#445238" />
        <path d={areaPath(pts, zero)} fill="#dff26a33" />
        <path d={linePath(pts)} fill="none" stroke="#dff26a" strokeWidth="1.8" />
        <circle cx={pts[idx][0]} cy={pts[idx][1]} r="3.5" fill="#fff" />
      </svg>
      <div className="mt-2 flex justify-between text-sm text-[#c9d8b8]">
        <span>{ymLabel(data[idx].ym)} · excess {data[idx].excess.toFixed(1)} points</span>
        <span>Ahead in {Math.round(ahead * 100)}% of months</span>
      </div>
    </div>
  );
}

export function D26c() {
  const [kind, setKind] = useState<Bench>("7030");
  const keys = ["month", "ytd", "oneYear", "threeYear", "fiveYear", "since"] as const;
  const labels = ["1M", "YTD", "1Y", "3Y", "5Y", "Since"];
  const port: Record<string, number> = { month: PERIODS.month, ytd: PERIODS.ytd, oneYear: PERIODS.oneYear, threeYear: PERIODS.threeYear, fiveYear: PERIODS.fiveYear, since: PERIODS.since };
  const bench = BENCH_PERIODS[kind];
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#fbf6ef", color: "#1a1a1a" }} className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[28px]">Period race</h2>
        <div className="flex gap-1 text-xs" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
          {(Object.keys(BENCH_NAMES) as Bench[]).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} className={`rounded-full px-3 py-1 ${kind === k ? "bg-[#1a1a1a] text-white" : "bg-white"}`}>{BENCH_NAMES[k]}</button>
          ))}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {keys.map((k, i) => {
          const p = port[k];
          const b = (bench[k] ?? 0) * 100;
          const max = Math.max(Math.abs(p), Math.abs(b), 1);
          return (
            <div key={k} className="grid grid-cols-[70px_1fr_90px] items-center gap-3">
              <div className="text-sm">{labels[i]}</div>
              <div className="space-y-1">
                <div className="h-3 rounded bg-[#efe8dc]"><div className="h-3 rounded bg-[#1e3a5f]" style={{ width: `${(Math.abs(p) / (max * 1.3)) * 100}%` }} /></div>
                <div className="h-3 rounded bg-[#efe8dc]"><div className="h-3 rounded bg-[#c4b49a]" style={{ width: `${(Math.abs(b) / (max * 1.3)) * 100}%` }} /></div>
              </div>
              <div className="text-right text-sm tabular" style={{ fontFamily: "Instrument Sans, sans-serif", color: p - b >= 0 ? "#1b6b45" : "#9d3b32" }}>{pct(p - b)}</div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-[#6f675e]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Navy is the portfolio, sand is the benchmark. The figure is the gap. Multi-year figures are cumulative, not annualised. Paths are illustrative.</p>
    </div>
  );
}

export function D27a() {
  const [i, setI] = useState(0);
  const rows = ATTRIBUTION.filter((a) => Math.abs(a.points) > 0.05);
  let run = 0;
  const cols = rows.map((r) => {
    const start = run;
    run += r.points;
    return { ...r, start, end: run };
  });
  const max = Math.max(...cols.map((c) => Math.max(c.start, c.end)), 1);
  const min = Math.min(...cols.map((c) => Math.min(c.start, c.end)), 0);
  const y = (v: number) => 16 + ((max - v) / (max - min || 1)) * 200;
  const focus = cols[i];
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fff", color: "#111" }} className="p-5">
      <div className="flex justify-between">
        <h2 className="text-xl font-medium">Who built the one-year return</h2>
        <div className="tabular text-sm">Total {pct(PERIODS.oneYear)}</div>
      </div>
      <svg viewBox={`0 0 ${cols.length * 42} 240`} className="mt-2 h-[240px] w-full">
        {cols.map((c, n) => {
          const x = n * 42 + 8;
          const top = y(Math.max(c.start, c.end));
          const bot = y(Math.min(c.start, c.end));
          return (
            <g key={c.ticker} onClick={() => setI(n)} className="cursor-pointer">
              <rect x={x} y={top} width="26" height={Math.max(2, bot - top)} fill={c.points >= 0 ? "#1f7a4d" : "#9d3b32"} opacity={n === i ? 1 : 0.55} />
              <text x={x} y="232" fontSize="8" transform={`rotate(-55 ${x} 232)`}>{c.ticker}</text>
            </g>
          );
        })}
      </svg>
      {focus && <p className="text-sm">{focus.name} contributed {focus.points.toFixed(2)} points while weighing {focus.weight.toFixed(1)}%. {focus.points > focus.weight / 8 ? "It earned more than its size." : "Size and result were closer."}</p>}
    </div>
  );
}

export function D27b() {
  const [mode, setMode] = useState<"points" | "weight">("points");
  const rows = [...ATTRIBUTION].sort((a, b) => (mode === "points" ? b.points - a.points : b.weight - a.weight)).slice(0, 12);
  const max = Math.max(...rows.map((r) => Math.abs(r.points)));
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f6f3ee", color: "#1c1915" }} className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Contribution, with weight as a second mark</h2>
        <button type="button" onClick={() => setMode(mode === "points" ? "weight" : "points")} className="rounded-full bg-[#1c1915] px-3 py-1 text-xs text-white">Sort by {mode === "points" ? "weight" : "points"}</button>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.ticker} className="grid grid-cols-[72px_1fr_70px] items-center gap-2 text-sm">
            <div>{r.ticker}</div>
            <div className="relative h-4 bg-[#efe8dc]">
              <div className="absolute top-0 h-4" style={{ left: r.points >= 0 ? "50%" : `${50 + (r.points / max) * 48}%`, width: `${(Math.abs(r.points) / max) * 48}%`, background: r.points >= 0 ? "#1f7a4d" : "#9d3b32" }} />
              <div className="absolute top-[-2px] h-5 w-1 bg-[#1c1915]" style={{ left: `${Math.min(96, r.weight * 3)}%` }} title="weight" />
            </div>
            <div className="tabular text-right">{r.points.toFixed(2)} pt</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[#6f675e]">Bars are contribution. The black tick is weight, scaled so 10% of the book sits near the right third. A tick far from a long bar is a mismatch.</p>
    </div>
  );
}

export function D27c() {
  const [id, setId] = useState("NVDA");
  const helped = ATTRIBUTION.filter((a) => a.points > 0.15);
  const hurt = ATTRIBUTION.filter((a) => a.points < -0.02);
  const focus = ATTRIBUTION.find((a) => a.ticker === id)!;
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f8f4ee", color: "#1c1612" }} className="grid grid-cols-12">
      <div className="col-span-5 border-r border-[#e6dccb] p-5">
        <div className="text-[11px] uppercase tracking-[0.16em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Helped</div>
        {helped.map((a) => (
          <button key={a.ticker} type="button" onClick={() => setId(a.ticker)} className="flex w-full justify-between border-b border-[#efe6d6] py-2 text-left text-[18px]">
            <span>{a.name}</span><span className="tabular text-[#1b6b45]">+{a.points.toFixed(2)}</span>
          </button>
        ))}
      </div>
      <div className="col-span-4 border-r border-[#e6dccb] p-5">
        <div className="text-[11px] uppercase tracking-[0.16em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Hurt</div>
        {hurt.map((a) => (
          <button key={a.ticker} type="button" onClick={() => setId(a.ticker)} className="flex w-full justify-between border-b border-[#efe6d6] py-2 text-left text-[18px]">
            <span>{a.name}</span><span className="tabular text-[#9d3b32]">{a.points.toFixed(2)}</span>
          </button>
        ))}
        <div className="mt-4 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Reconciles to {pct(PERIODS.oneYear)}.</div>
      </div>
      <aside className="col-span-3 p-5">
        <div className="text-[28px] leading-none">{focus.ticker}</div>
        <p className="mt-3 text-[16px] leading-snug">{focus.name} added {focus.points.toFixed(2)} points from a {focus.weight.toFixed(1)}% weight. {focus.assetClass}.</p>
      </aside>
    </div>
  );
}

export function D30a() {
  const [ym, setYm] = useState("2026-04");
  const months = Array.from(new Set(PAYMENTS.map((p) => p.ym))).slice(0, 12);
  const days = PAYMENTS.filter((p) => p.ym === ym);
  const total = days.reduce((s, p) => s + p.amount, 0);
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f5f0", color: "#1c1915" }} className="p-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#8a8176]">Income calendar</div>
          <h2 className="text-2xl font-medium">{ymLabel(ym)} · {money(total)} expected</h2>
        </div>
        <div className="text-sm text-[#6f675e]">Next 12 months {money(PAYMENTS.reduce((s, p) => s + p.amount, 0))}</div>
      </div>
      <div className="mt-3 flex gap-1 overflow-auto">
        {months.map((m) => {
          const sum = PAYMENTS.filter((p) => p.ym === m).reduce((s, p) => s + p.amount, 0);
          return (
            <button key={m} type="button" onClick={() => setYm(m)} className={`min-w-[78px] rounded-lg px-2 py-2 text-left text-xs ${ym === m ? "bg-[#1c1915] text-white" : "bg-white"}`}>
              <div>{ymLabel(m, true)}</div>
              <div className="tabular">{money(sum)}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-[#8a8176]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <MonthGrid ym={ym} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {days.map((p) => (
          <div key={p.iso + p.ticker} className="flex justify-between rounded-lg bg-white px-3 py-2 text-sm">
            <span>{p.day} · {p.ticker} · {p.kind}</span>
            <span className="tabular">{money(p.amount, 0)} · {p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthGrid({ ym }: { ym: string }) {
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1).getDay();
  const count = new Date(y, m, 0).getDate();
  const cells = Array.from({ length: first + count }, (_, i) => (i < first ? null : i - first + 1));
  const pays = PAYMENTS.filter((p) => p.ym === ym);
  return (
    <div className="mt-1 grid grid-cols-7 gap-1">
      {cells.map((day, i) => {
        const hits = pays.filter((p) => p.day === day);
        return (
          <div key={i} className={`min-h-[52px] rounded-md p-1 text-xs ${day ? "bg-white" : ""}`}>
            <div className="text-[#8a8176]">{day ?? ""}</div>
            {hits.slice(0, 2).map((h) => <div key={h.ticker} className="truncate text-[10px] text-[#1e3a5f]">{h.ticker}</div>)}
          </div>
        );
      })}
    </div>
  );
}

export function D30b() {
  const [kind, setKind] = useState<"All" | "Dividend" | "Interest" | "Distribution">("All");
  const [id, setId] = useState(0);
  const rows = PAYMENTS.filter((p) => kind === "All" || p.kind === kind).slice(0, 18);
  const max = Math.max(...rows.map((r) => r.amount));
  const p = rows[id];
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#101418", color: "#e5eef2" }} className="grid grid-cols-12">
      <div className="col-span-8 p-5">
        <div className="mb-3 flex gap-2 text-[11px]">
          {(["All", "Dividend", "Distribution", "Interest"] as const).map((k) => (
            <button key={k} type="button" onClick={() => { setKind(k); setId(0); }} className={`rounded px-2 py-1 ${kind === k ? "bg-[#9fd7c8] text-[#10221c]" : "bg-[#1c242b]"}`}>{k}</button>
          ))}
        </div>
        <div className="space-y-2">
          {rows.map((r, i) => (
            <button key={r.iso + r.ticker} type="button" onClick={() => setId(i)} className="grid w-full grid-cols-[110px_1fr_80px] items-center gap-2 text-left text-[12px]">
              <span className="text-[#8fb0be]">{r.iso.slice(5)}</span>
              <span className="relative h-px bg-[#24303a]">
                <span className="absolute top-[-5px] h-2.5 rounded-full bg-[#9fd7c8]" style={{ left: 0, width: `${8 + (r.amount / max) * 92}%` }} />
              </span>
              <span className="text-right">{money(r.amount, 0)}</span>
            </button>
          ))}
        </div>
      </div>
      {p && (
        <aside className="col-span-4 border-l border-[#24303a] p-5">
          <div className="text-[11px] text-[#8fb0be]">{p.status}</div>
          <div className="mt-2 text-3xl text-[#9fd7c8]">{p.ticker}</div>
          <div className="mt-2 text-sm">{p.name}</div>
          <div className="mt-4 text-sm">{p.kind} · {p.iso} · {money(p.amount)}</div>
        </aside>
      )}
    </div>
  );
}

export function D30c() {
  const [interest, setInterest] = useState(true);
  const months = Array.from(new Set(PAYMENTS.map((p) => p.ym))).slice(0, 12);
  const sums = months.map((m) => PAYMENTS.filter((p) => p.ym === m && (interest || p.kind !== "Interest")).reduce((s, p) => s + p.amount, 0));
  const max = Math.max(...sums);
  const upcoming = PAYMENTS.filter((p) => interest || p.kind !== "Interest").slice(0, 8);
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f3f7f4", color: "#142018" }} className="grid grid-cols-12">
      <div className="col-span-7 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Cash the book is likely to pay</h2>
          <button type="button" onClick={() => setInterest((v) => !v)} className="rounded-full bg-[#142018] px-3 py-1 text-xs text-white">{interest ? "Interest included" : "Interest hidden"}</button>
        </div>
        <div className="mt-4 flex h-52 items-end gap-2">
          {sums.map((s, i) => (
            <div key={months[i]} className="flex flex-1 flex-col items-center justify-end">
              <div className="w-full rounded-t bg-[#1f7a4d]" style={{ height: Math.max(4, (s / max) * 168) }} />
              <div className="mt-1 text-[10px] text-[#5c6b60]">{months[i].slice(5)}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm">Twelve-month run rate {money(sums.reduce((s, n) => s + n, 0))} · book yield on {money(TOTAL)} is {(INCOME / TOTAL * 100).toFixed(2)}%</div>
      </div>
      <div className="col-span-5 border-l border-[#d7e3da] p-5">
        <div className="text-xs uppercase tracking-wider text-[#5c6b60]">Next payments</div>
        {upcoming.map((p) => (
          <div key={p.iso + p.ticker} className="mt-3 flex justify-between border-b border-[#d7e3da] pb-2 text-sm">
            <span>{p.iso.slice(5)} {p.ticker}<div className="text-xs text-[#5c6b60]">{p.kind} · {p.status}</div></span>
            <span className="tabular">{money(p.amount, 0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function D41a() {
  const [sort, setSort] = useState<"gap" | "risk">("gap");
  const rows = [...RISK].sort((a, b) => (sort === "risk" ? b.risk - a.risk : b.risk - b.weight - (a.risk - a.weight))).slice(0, 14);
  const max = Math.max(...rows.map((r) => Math.max(r.risk, r.weight)));
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f4ee", color: "#1c1915" }} className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#8a8176]">Risk contribution</div>
          <h2 className="text-2xl font-medium">Share of money, share of risk</h2>
        </div>
        <button type="button" onClick={() => setSort(sort === "gap" ? "risk" : "gap")} className="rounded-full border px-3 py-1 text-xs">Sort by {sort === "gap" ? "risk" : "gap"}</button>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.ticker} className="grid grid-cols-[64px_1fr] items-center gap-3 text-sm">
            <div className="font-medium">{r.ticker}</div>
            <div>
              <div className="h-2 rounded bg-[#d9e2f2]" style={{ width: `${(r.weight / max) * 100}%` }} />
              <div className="mt-1 h-2 rounded bg-[#9d3b32]" style={{ width: `${(r.risk / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-[#6f675e]"><span className="text-[#8aa0c4]">Weight</span><span className="text-[#9d3b32]">Risk</span><span>A longer red bar than blue means the line is punching above its weight.</span></div>
    </div>
  );
}

export function D41b() {
  const [id, setId] = useState("NVDA");
  const rows = RISK.slice(0, 12);
  const focus = rows.find((r) => r.ticker === id) ?? rows[0];
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#0e1420", color: "#e8eef8" }} className="grid grid-cols-12">
      <svg viewBox="0 0 640 420" className="col-span-8 h-[440px] w-full p-4">
        <text x="70" y="28" fill="#8eb4d4" fontSize="12">Weight</text>
        <text x="470" y="28" fill="#f0b4a8" fontSize="12">Risk share</text>
        {rows.map((r, i) => {
          const y = 48 + i * 30;
          const x1 = 40 + r.weight * 8;
          const x2 = 360 + r.risk * 8;
          const on = r.ticker === focus.ticker;
          return (
            <g key={r.ticker} onClick={() => setId(r.ticker)} className="cursor-pointer">
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={on ? "#fff" : r.risk > r.weight ? "#e07a5f" : "#7da2c4"} strokeWidth={on ? 2.4 : 1.2} />
              <circle cx={x1} cy={y} r="4" fill="#8eb4d4" />
              <circle cx={x2} cy={y} r="4" fill="#e07a5f" />
              <text x="8" y={y + 4} fill="#e8eef8" fontSize="11">{r.ticker}</text>
            </g>
          );
        })}
      </svg>
      <aside className="col-span-4 border-l border-[#243044] p-6">
        <div className="text-4xl">{focus.ticker}</div>
        <p className="mt-3 text-sm leading-relaxed text-[#c5d4e6]">{focus.name} is {focus.weight.toFixed(1)}% of the money and {focus.risk.toFixed(1)}% of the risk. {focus.risk - focus.weight > 1 ? "It is borrowing risk from the quieter lines." : "It is not the troublemaker."}</p>
      </aside>
    </div>
  );
}

export function D41c() {
  const [cut, setCut] = useState<string | null>(null);
  const rows = RISK.filter((r) => r.risk > 0.4);
  const base = cut ? rows.filter((r) => r.ticker !== cut) : rows;
  const riskSum = base.reduce((s, r) => s + r.risk, 0) || 1;
  const wSum = rows.reduce((s, r) => s + r.weight, 0) || 1;
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#fbf7f2", color: "#1a1a1a" }} className="p-5">
      <div className="flex items-end justify-between">
        <h2 className="text-[26px] leading-none">Two stacks. Click a name to remove it from the risk budget.</h2>
        <button type="button" onClick={() => setCut(null)} className="text-xs underline" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Reset</button>
      </div>
      <div className="mt-4 text-xs uppercase tracking-wider text-[#8a8176]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Capital</div>
      <div className="mt-1 flex h-10 overflow-hidden rounded">
        {rows.map((r) => (
          <div key={r.ticker} style={{ width: `${(r.weight / wSum) * 100}%` }} className="flex items-center justify-center bg-[#1e3a5f] text-[10px] text-white">{r.weight > 4 ? r.ticker : ""}</div>
        ))}
      </div>
      <div className="mt-4 text-xs uppercase tracking-wider text-[#8a8176]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Risk {cut ? `without ${cut}` : ""}</div>
      <div className="mt-1 flex h-10 overflow-hidden rounded">
        {base.map((r) => (
          <button key={r.ticker} type="button" onClick={() => setCut(r.ticker)} style={{ width: `${(r.risk / riskSum) * 100}%` }} className="bg-[#9d3b32] text-[10px] text-white">{r.risk / riskSum > 0.06 ? r.ticker : ""}</button>
        ))}
      </div>
      <p className="mt-4 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
        {cut ? `Removing ${cut} restates the remaining lines to 100%. The point is how concentrated the risk was.` : "Capital is the blue stack. Risk is the red stack. They are not the same book."}
      </p>
    </div>
  );
}

export function D45a() {
  const [i, setI] = useState(MILESTONES.length - 1);
  const m = MILESTONES[i];
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f6f1e8", color: "#1c1612" }} className="grid grid-cols-12">
      <div className="col-span-5 max-h-[560px] overflow-auto border-r border-[#e6dccb] p-6">
        {MILESTONES.map((ev, n) => (
          <button key={ev.title + ev.ym} type="button" onClick={() => setI(n)} className="grid w-full grid-cols-[16px_1fr] gap-3 py-2 text-left">
            <span className="mt-1 h-3 w-3 rounded-full" style={{ background: n === i ? "#9a3412" : "#1c1612" }} />
            <span>
              <span className="block text-[11px] uppercase tracking-wider text-[#8a735c]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{ymLabel(ev.ym)}</span>
              <span className="text-[20px] leading-tight">{ev.title}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="col-span-7 p-8">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a735c]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{m.kind}</div>
        <h2 className="mt-2 text-[42px] leading-[0.95]">{m.title}</h2>
        <div className="mt-3 text-[28px] tabular">{money(m.value)}</div>
        <p className="mt-4 max-w-md text-[18px] leading-snug">{m.detail}</p>
      </div>
    </div>
  );
}

export function D45b() {
  const [i, setI] = useState(Math.max(0, MILESTONES.length - 2));
  const pts = points(HISTORY.map((p) => p.value), 860, 280, 20);
  const marks = MILESTONES.map((m) => ({ ...m, idx: HISTORY.findIndex((p) => p.ym === m.ym) })).filter((m) => m.idx >= 0);
  const active = marks[i] ?? marks[0];
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f4f7f8", color: "#102027" }} className="p-5">
      <div className="flex justify-between">
        <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-[28px]">Pins on the path</h2>
        <div className="max-w-sm text-right text-sm">{active.title} · {ymLabel(active.ym)} · {money(active.value)}</div>
      </div>
      <svg viewBox="0 0 860 280" className="mt-2 h-[300px] w-full">
        <path d={linePath(pts)} fill="none" stroke="#1e3a5f" strokeWidth="1.7" />
        {marks.map((m, n) => (
          <g key={m.title} onClick={() => setI(n)} className="cursor-pointer">
            <line x1={pts[m.idx][0]} x2={pts[m.idx][0]} y1={pts[m.idx][1]} y2={pts[m.idx][1] - 28} stroke={n === i ? "#9a3412" : "#1e3a5f"} />
            <circle cx={pts[m.idx][0]} cy={pts[m.idx][1] - 28} r={n === i ? 6 : 4} fill={n === i ? "#9a3412" : "#1e3a5f"} />
          </g>
        ))}
      </svg>
      <p className="text-sm text-[#3d4c54]">{active.detail}</p>
    </div>
  );
}

export function D45c() {
  const [i, setI] = useState(MILESTONES.length - 1);
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#10221c", color: "#e7f6ee" }} className="p-6">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#8fbf9f]">Transit</div>
      <h2 className="text-[28px]">You are here. The stations behind you are the book’s life.</h2>
      <div className="mt-8 flex items-start overflow-auto pb-4">
        {MILESTONES.map((m, n) => (
          <button key={m.title + m.ym} type="button" onClick={() => setI(n)} className="flex w-[140px] shrink-0 flex-col items-center text-center">
            <div className="h-px w-full bg-[#2f6b52]" />
            <div className={`-mt-2 h-4 w-4 rounded-full ${n === i ? "bg-[#dff26a]" : "bg-[#8fbf9f]"}`} />
            <div className="mt-3 text-[11px] text-[#8fbf9f]">{ymLabel(m.ym, true)}</div>
            <div className="text-sm leading-tight">{m.title}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-[#17352a] p-4">
        <div className="text-xs uppercase tracking-wider text-[#dff26a]">Station {i + 1}</div>
        <div className="mt-1 text-2xl">{MILESTONES[i].title}</div>
        <p className="mt-2 max-w-2xl text-sm text-[#d5ecdf]">{MILESTONES[i].detail} Value then {money(MILESTONES[i].value)}.</p>
      </div>
    </div>
  );
}
 