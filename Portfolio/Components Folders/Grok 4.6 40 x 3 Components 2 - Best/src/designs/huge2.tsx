import { Fragment, useMemo, useState } from "react";
import {
  AS_OF_SHORT,
  CORR,
  CORR_LABELS,
  CORR_PAIRS,
  GOAL,
  HISTORY,
  MONTHLY_YEARS,
  TOTAL,
  benchRet,
  holding,
  monthNote,
} from "@/lib/data";
import { compound, fanPaths, heat, linePath, money, normCdf, pct, points, ymLabel } from "@/lib/format";

export function D7a() {
  const [order, setOrder] = useState<"book" | "cluster">("cluster");
  const [pin, setPin] = useState<[number, number] | null>([0, 5]);
  const [hover, setHover] = useState<[number, number] | null>(null);
  const labels = order === "cluster" ? CORR_LABELS : [...CORR_LABELS].sort((a, b) => holding(b).weight - holding(a).weight);
  const indexOf = (t: string) => CORR_LABELS.indexOf(t);
  const cell = hover ?? pin;
  const story = cell
    ? (() => {
        const a = labels[cell[0]];
        const b = labels[cell[1]];
        const c = CORR[indexOf(a)][indexOf(b)];
        const w = holding(a).weight + holding(b).weight;
        if (a === b) return `${a} with itself is 1.00 by definition. Weight ${holding(a).weight.toFixed(1)}%.`;
        return `${a} and ${b} ${c >= 0.6 ? "move together" : c >= 0.3 ? "lean the same way" : c <= -0.05 ? "have offered a little offset" : "have been only loosely linked"} (${c.toFixed(2)}). Together they are ${w.toFixed(1)}% of the book.`;
      })()
    : "Hover a cell.";
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f6f3", color: "#1c1917" }} className="p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a8176]">Correlation · 36 months, illustrative</div>
          <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-[32px] font-medium leading-none">Who travels with whom</h2>
        </div>
        <div className="flex rounded-full bg-[#eceae4] p-1 text-[12px]">
          <button type="button" onClick={() => setOrder("cluster")} className={`rounded-full px-3 py-1 ${order === "cluster" ? "bg-white" : ""}`}>Clustered</button>
          <button type="button" onClick={() => setOrder("book")} className={`rounded-full px-3 py-1 ${order === "book" ? "bg-white" : ""}`}>By weight</button>
        </div>
      </div>
      <div className="mt-4 grid gap-1" style={{ gridTemplateColumns: `72px repeat(${labels.length}, minmax(0, 1fr))` }}>
        <div />
        {labels.map((t) => (
          <div key={t} className="pb-1 text-center text-[11px] font-medium">{t}</div>
        ))}
        {labels.map((row, i) => (
          <Fragment key={row}>
            <div className="flex items-center pr-2 text-[11px] font-medium">{row}</div>
            {labels.map((col, j) => {
              const c = CORR[indexOf(row)][indexOf(col)];
              const on = cell && (cell[0] === i || cell[1] === j);
              return (
                <button
                  key={col}
                  type="button"
                  onMouseEnter={() => setHover([i, j])}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setPin([i, j])}
                  className="flex h-11 items-center justify-center text-[11px] tabular"
                  style={{
                    background: c === 1 ? "#1c1917" : heat(c * 10, 8),
                    color: Math.abs(c) > 0.45 ? "#fff" : "#1c1917",
                    outline: on ? "2px solid #c2410c" : "none",
                  }}
                >
                  {c.toFixed(2)}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#3f3a34]">{story}</p>
    </div>
  );
}

export function D7b() {
  const [min, setMin] = useState(0.45);
  const [active, setActive] = useState<string | null>(null);
  const n = CORR_LABELS.length;
  const cx = 280;
  const cy = 250;
  const r = 180;
  const pos = CORR_LABELS.map((_, i) => {
    const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r, ang };
  });
  const ribbons = CORR_LABELS.flatMap((a, i) =>
    CORR_LABELS.slice(i + 1).map((b, j) => ({ a, b, i, j: i + 1 + j, c: CORR[i][i + 1 + j] })),
  ).filter((p) => Math.abs(p.c) >= min);
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f3efe6", color: "#1b1916" }} className="grid grid-cols-12">
      <div className="col-span-8 p-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a735c]">Chord</div>
            <div className="text-lg">Links appear once correlation clears the threshold.</div>
          </div>
          <label className="text-sm text-[#6f675e]">
            |ρ| ≥ {min.toFixed(2)}
            <input type="range" min={0.15} max={0.85} step={0.05} value={min} onChange={(e) => setMin(Number(e.target.value))} className="ml-2 align-middle" />
          </label>
        </div>
        <svg viewBox="0 0 560 520" className="h-[500px] w-full">
          <circle cx={cx} cy={cy} r={r - 18} fill="none" stroke="#e4d9c8" />
          {ribbons.map((p) => {
            const A = pos[p.i];
            const B = pos[p.j];
            const key = `${p.a}-${p.b}`;
            const on = active === key;
            return (
              <path
                key={key}
                d={`M${A.x},${A.y} Q${cx},${cy} ${B.x},${B.y}`}
                fill="none"
                stroke={p.c >= 0 ? "#1d4e89" : "#b4532a"}
                strokeWidth={on ? 2 + Math.abs(p.c) * 8 : 1 + Math.abs(p.c) * 5}
                opacity={active && !on ? 0.15 : 0.75}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
              />
            );
          })}
          {CORR_LABELS.map((t, i) => {
            const p = pos[i];
            const lx = cx + Math.cos(p.ang) * (r + 18);
            const ly = cy + Math.sin(p.ang) * (r + 18);
            return (
              <g key={t}>
                <circle cx={p.x} cy={p.y} r="5" fill="#1b1916" />
                <text x={lx} y={ly} textAnchor="middle" fontSize="11" fill="#1b1916">{t}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <aside className="col-span-4 border-l border-[#e4d9c8] p-6">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8a735c]">{ribbons.length} links shown</div>
        <div className="mt-3 space-y-2">
          {ribbons
            .slice()
            .sort((a, b) => Math.abs(b.c) - Math.abs(a.c))
            .slice(0, 8)
            .map((p) => (
              <button
                key={`${p.a}${p.b}`}
                type="button"
                onClick={() => setActive(`${p.a}-${p.b}`)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-[#efe6d8]"
              >
                <span>{p.a} · {p.b}</span>
                <span className="tabular" style={{ color: p.c >= 0 ? "#1d4e89" : "#b4532a" }}>{p.c.toFixed(2)}</span>
              </button>
            ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#5c5146]">
          Bitcoin and Ethereum are almost one position. Bonds are the only sleeve that does not travel with the equity cluster. Raising the threshold hides the polite acquaintances and leaves the family.
        </p>
      </aside>
    </div>
  );
}

export function D7c() {
  const [same, setSame] = useState(false);
  const [pick, setPick] = useState(0);
  const pairs = CORR_PAIRS.filter((p) => (same ? p.same : true));
  const tight = pairs.slice(0, 3);
  const loose = [...pairs].sort((a, b) => Math.abs(a.corr) - Math.abs(b.corr)).slice(0, 3);
  const all = [...tight, ...loose];
  const p = all[pick] ?? pairs[0];
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f8f1e7", color: "#221c16" }} className="p-7">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a735c]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Couples</div>
          <h2 className="text-[34px] leading-none">The book’s closest companions, and its strangers</h2>
        </div>
        <button type="button" onClick={() => setSame((v) => !v)} className="rounded-full border border-[#221c16] px-3 py-1 text-[12px]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
          {same ? "Showing same class only" : "Include every pair"}
        </button>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {tight.map((pair, i) => (
          <button key={pair.a + pair.b} type="button" onClick={() => setPick(i)} className={`rounded-2xl p-4 text-left ${pick === i ? "bg-[#221c16] text-[#f8f1e7]" : "bg-white"}`}>
            <div className="text-[11px] uppercase tracking-[0.16em] opacity-70" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Moves together</div>
            <div className="mt-2 text-[28px] leading-none">{pair.a} <span className="opacity-40">&</span> {pair.b}</div>
            <div className="mt-3 h-1.5 rounded-full bg-black/10">
              <div className="h-full rounded-full bg-current" style={{ width: `${Math.abs(pair.corr) * 100}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
              <span>ρ {pair.corr.toFixed(2)}</span>
              <span>{pair.weight.toFixed(1)}% combined</span>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {loose.map((pair, i) => (
          <button key={pair.a + pair.b} type="button" onClick={() => setPick(i + 3)} className={`rounded-2xl border border-dashed p-4 text-left ${pick === i + 3 ? "border-[#221c16] bg-white" : "border-[#d9cbb8]"}`}>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#8a735c]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Mostly independent</div>
            <div className="mt-1 text-[22px]">{pair.a} & {pair.b}</div>
            <div className="text-sm text-[#5c5146]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>ρ {pair.corr.toFixed(2)} · {pair.weight.toFixed(1)}% combined</div>
          </button>
        ))}
      </div>
      {p && (
        <p className="mt-4 text-[16px] leading-relaxed">
          {p.nameA} and {p.nameB}. Correlation {p.corr.toFixed(2)}. If you own both, you own {p.weight.toFixed(1)}% of the book in one weather system{p.same ? ", and they already sit in the same asset class" : ""}.
        </p>
      )}
    </div>
  );
}

export function D8a() {
  const [years, setYears] = useState(10);
  const [monthly, setMonthly] = useState(2500);
  const [mu, setMu] = useState(7);
  const [i, setI] = useState<number | null>(null);
  const fan = useMemo(() => fanPaths(TOTAL, years, monthly, mu / 100, 0.148), [years, monthly, mu]);
  const flat = fan.series.flat();
  const min = Math.min(...flat) * 0.96;
  const max = Math.max(...flat, GOAL.target) * 1.04;
  const w = 760;
  const h = 320;
  const toPts = (arr: number[]) =>
    arr.map((v, idx) => {
      const x = (idx / (arr.length - 1)) * w;
      const y = 16 + (1 - (v - min) / (max - min)) * (h - 32);
      return [x, y] as const;
    });
  const bands: [number, number, string][] = [
    [0, 4, "#d9e4f2"],
    [1, 3, "#b9cce6"],
  ];
  const med = toPts(fan.series[2]);
  const idx = i == null ? fan.series[2].length - 1 : i;
  const goalY = 16 + (1 - (GOAL.target - min) / (max - min)) * (h - 32);
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f5f7fb", color: "#142033" }} className="grid grid-cols-12">
      <div className="col-span-3 border-r border-[#e1e6ef] p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8da3]">Fan chart</div>
        <h2 style={{ fontFamily: "Fraunces, serif" }} className="mt-1 text-[28px] leading-none">Where it could land</h2>
        <label className="mt-6 block text-xs uppercase tracking-wider text-[#7d8da3]">Horizon · {years}y
          <input type="range" min={5} max={20} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="mt-4 block text-xs uppercase tracking-wider text-[#7d8da3]">Monthly add · {money(monthly)}
          <input type="range" min={0} max={8000} step={250} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="mt-4 block text-xs uppercase tracking-wider text-[#7d8da3]">Expected return · {mu.toFixed(1)}%
          <input type="range" min={3} max={12} step={0.5} value={mu} onChange={(e) => setMu(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <p className="mt-5 text-xs leading-relaxed text-[#5c6b80]">Bands are a log-style sketch, not a promise. Volatility is held at 14.8%. The gold line is the {money(GOAL.target)} goal.</p>
      </div>
      <div className="col-span-9 p-5">
        <div className="flex justify-between text-sm">
          <span>{ymLabel(HISTORY[HISTORY.length - 1].ym)} start {money(TOTAL)}</span>
          <span className="tabular">
            In {years} years · p10 {money(fan.series[0][idx])} · median {money(fan.series[2][idx])} · p90 {money(fan.series[4][idx])}
          </span>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="mt-3 h-[360px] w-full"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setI(Math.round(((e.clientX - r.left) / r.width) * (fan.series[2].length - 1)));
          }}
          onMouseLeave={() => setI(null)}
        >
          {bands.map(([a, b, fill]) => {
            const top = toPts(fan.series[b]);
            const bot = toPts(fan.series[a]);
            const d = `${linePath(top)} L${[...bot].reverse().map((p) => `${p[0]},${p[1]}`).join(" ")} Z`;
            return <path key={fill} d={d} fill={fill} />;
          })}
          <path d={linePath(med)} fill="none" stroke="#1e3a5f" strokeWidth="2" />
          <line x1="0" x2={w} y1={goalY} y2={goalY} stroke="#b45309" strokeDasharray="5 4" />
          <text x="8" y={goalY - 6} fontSize="11" fill="#b45309">Goal {money(GOAL.target)}</text>
          {i != null && <line x1={med[idx][0]} x2={med[idx][0]} y1="10" y2={h - 10} stroke="#1e3a5f" strokeDasharray="2 3" />}
        </svg>
      </div>
    </div>
  );
}

export function D8b() {
  const [guard, setGuard] = useState(3.5);
  const [base, setBase] = useState(7);
  const [bright, setBright] = useState(10.5);
  const [add, setAdd] = useState(2500);
  const scenarios = [
    { name: "Guarded", ret: guard, set: setGuard, note: "A decade of ordinary returns, with the crypto sleeve not repeating itself.", color: "#7f1d1d" },
    { name: "Central", ret: base, set: setBase, note: "The planning case. Contributions continue. No heroics required.", color: "#1e3a5f" },
    { name: "Bright", ret: bright, set: setBright, note: "Winners keep winning. Pleasant, and the wrong case to spend against.", color: "#14532d" },
  ];
  return (
    <div style={{ fontFamily: "Fraunces, serif", background: "#efeae2", color: "#1c1915" }} className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a735c]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Three futures · {GOAL.years} years</div>
          <h2 className="text-[32px] leading-none">Same book. Different weather.</h2>
        </div>
        <label className="text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
          Monthly contribution {money(add)}
          <input type="range" min={0} max={6000} step={250} value={add} onChange={(e) => setAdd(Number(e.target.value))} className="ml-2 align-middle" />
        </label>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {scenarios.map((s) => {
          const end = fanPaths(TOTAL, GOAL.years, add, s.ret / 100, 0.02).series[2].at(-1)!;
          const gap = end - GOAL.target;
          const path = fanPaths(TOTAL, GOAL.years, add, s.ret / 100, 0.02).series[2];
          const pts = points(path, 280, 70, 4);
          return (
            <article key={s.name} className="bg-[#fbf7f2] p-4">
              <div className="text-[12px] uppercase tracking-[0.16em]" style={{ color: s.color, fontFamily: "Instrument Sans, sans-serif" }}>{s.name}</div>
              <div className="mt-2 text-[40px] leading-none tracking-tight">{money(end)}</div>
              <div className="mt-1 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif", color: gap >= 0 ? "#1b6b45" : "#9d3b32" }}>
                {gap >= 0 ? `${money(gap)} above the goal` : `${money(Math.abs(gap))} short of the goal`}
              </div>
              <svg viewBox="0 0 280 70" className="mt-3 h-16 w-full">
                <path d={linePath(pts)} fill="none" stroke={s.color} strokeWidth="2" />
              </svg>
              <p className="mt-2 text-[15px] leading-snug">{s.note}</p>
              <div className="mt-3 flex items-center gap-2 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
                <button type="button" onClick={() => s.set((v) => Math.max(1, v - 0.5))} className="h-7 w-7 rounded-full border">−</button>
                <span className="tabular">{s.ret.toFixed(1)}% / yr</span>
                <button type="button" onClick={() => s.set((v) => Math.min(14, v + 0.5))} className="h-7 w-7 rounded-full border">+</button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function D8c() {
  const [goal, setGoal] = useState(GOAL.target);
  const [years, setYears] = useState(10);
  const median = fanPaths(TOTAL, years, 2500, 0.07, 0.148).series[2].at(-1)!;
  const sigma = 0.148 * Math.sqrt(years);
  const z = (Math.log(goal) - Math.log(median)) / sigma;
  const prob = 1 - normCdf(z);
  const bins = Array.from({ length: 18 }, (_, i) => {
    const t = i / 17;
    const value = median * Math.exp((t - 0.5) * sigma * 3.2);
    const density = Math.exp(-0.5 * ((Math.log(value) - Math.log(median)) / sigma) ** 2);
    return { value, density, clear: value >= goal };
  });
  const maxD = Math.max(...bins.map((b) => b.density));
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#10140f", color: "#e7f0d8" }} className="grid grid-cols-12">
      <div className="col-span-4 border-r border-[#243024] p-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#b6c89a]">Terminal wealth</div>
        <div className="mt-3 text-[56px] leading-none text-[#dff26a]">{Math.round(prob * 100)}%</div>
        <p className="mt-3 text-[13px] leading-relaxed text-[#c9d4b4]">
          of sketched paths clear {money(goal)} in {years} years, if the median is {money(median)} and volatility stays near 14.8%.
        </p>
        <label className="mt-6 block text-[11px] uppercase tracking-wider text-[#8fa384]">
          Need at least {money(goal)}
          <input type="range" min={1200000} max={5000000} step={50000} value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="mt-2 w-full" />
        </label>
        <label className="mt-4 block text-[11px] uppercase tracking-wider text-[#8fa384]">
          Horizon {years} years
          <input type="range" min={5} max={20} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-2 w-full" />
        </label>
      </div>
      <div className="col-span-8 flex items-end gap-1 p-6">
        {bins.map((b, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end">
            <div className="w-full rounded-t" style={{ height: `${(b.density / maxD) * 280}px`, background: b.clear ? "#dff26a" : "#3d4a34" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function D15a() {
  const [excess, setExcess] = useState(false);
  const [pin, setPin] = useState("2022-06");
  const cell = (year: number, month: number) => HISTORY.find((p) => p.ym === `${year}-${String(month).padStart(2, "0")}`);
  const pinned = HISTORY.find((p) => p.ym === pin);
  const shown = pinned ? (excess ? pinned.ret - benchRet("7030", pinned.ret) : pinned.ret) : 0;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fffdf8", color: "#1c1915" }} className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a8176]">Monthly returns · {AS_OF_SHORT}</div>
          <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-[32px] leading-none">A year is twelve small verdicts</h2>
        </div>
        <button type="button" onClick={() => setExcess((v) => !v)} className={`rounded-full px-3 py-1 text-sm ${excess ? "bg-[#1c1915] text-white" : "bg-[#f3efe7]"}`}>
          {excess ? "Showing excess vs 70/30" : "Showing portfolio return"}
        </button>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-[#eee6da]">
        <table className="w-full border-collapse text-center text-[12px]">
          <thead>
            <tr className="bg-[#faf7f2] text-[10px] uppercase tracking-wider text-[#8a8176]">
              <th className="px-2 py-2 text-left">Year</th>
              {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m) => <th key={m} className="px-1 py-2 font-medium">{m}</th>)}
              <th className="px-2 py-2">Year</th>
            </tr>
          </thead>
          <tbody>
            {MONTHLY_YEARS.map((year) => {
              const months = Array.from({ length: 12 }, (_, i) => cell(year, i + 1)).filter(Boolean);
              const yr = compound(months.map((m) => m!.ret));
              return (
                <tr key={year}>
                  <td className="px-2 py-1.5 text-left font-medium">{year}</td>
                  {Array.from({ length: 12 }, (_, i) => {
                    const row = cell(year, i + 1);
                    if (!row) return <td key={i} className="bg-[#f6f3ee] text-[#ccc]">·</td>;
                    const v = excess ? row.ret - benchRet("7030", row.ret) : row.ret;
                    const on = pin === row.ym;
                    return (
                      <td key={i} className="p-1">
                        <button
                          type="button"
                          onClick={() => setPin(row.ym)}
                          className="tabular h-9 w-full rounded"
                          style={{ background: heat(v * 100, 8), outline: on ? "2px solid #1c1915" : "none" }}
                        >
                          {(v * 100).toFixed(1)}
                        </button>
                      </td>
                    );
                  })}
                  <td className="tabular px-2 font-medium">{pct(yr * 100)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pinned && (
        <div className="mt-4 grid grid-cols-12 gap-4 rounded-xl bg-[#1c1915] px-5 py-4 text-[#f6f1e8]">
          <div className="col-span-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#cbbba6]">{ymLabel(pinned.ym)}{pinned.partial ? " · MTD" : ""}</div>
            <div className="tabular mt-1 text-[32px] leading-none">{pct(shown * 100)}</div>
          </div>
          <p className="col-span-6 text-sm leading-relaxed text-[#e7ded0]">{monthNote(pinned.ym, pinned.ret)}</p>
          <div className="col-span-3 text-right text-sm text-[#cbbba6]">
            <div>Value {money(pinned.value)}</div>
            <div>Flow {money(pinned.flow)}</div>
            <div>Vs 70/30 {pct((pinned.ret - benchRet("7030", pinned.ret)) * 100)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function D15b() {
  const [month, setMonth] = useState(8);
  const years = MONTHLY_YEARS.filter((y) => y < 2026);
  const byMonth = Array.from({ length: 12 }, (_, m) => {
    const vals = years.map((y) => HISTORY.find((p) => p.ym === `${y}-${String(m + 1).padStart(2, "0")}`)?.ret ?? 0);
    return vals.reduce((s, v) => s + v, 0) / vals.length;
  });
  const worst = byMonth.indexOf(Math.min(...byMonth));
  const best = byMonth.indexOf(Math.max(...byMonth));
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f4f0e8", color: "#1c1915" }} className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a735c]">Small multiples</div>
          <h2 className="text-[28px] leading-none">The same twelve months, five times</h2>
        </div>
        <div className="max-w-sm text-right text-sm text-[#5c5146]">
          Hover a month to sync the years. {names[worst]} has been the softest on average. {names[best]} the strongest.
        </div>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-3">
        {years.map((year) => {
          const rows = Array.from({ length: 12 }, (_, m) => HISTORY.find((p) => p.ym === `${year}-${String(m + 1).padStart(2, "0")}`)?.ret ?? 0);
          const max = 0.09;
          return (
            <div key={year} className="rounded-2xl bg-white p-3">
              <div className="text-sm font-medium">{year}</div>
              <div className="relative mt-2 flex h-36 gap-1">
                <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#e7e1d6]" />
                {rows.map((r, m) => {
                  const h = Math.max(3, (Math.abs(r) / max) * 64);
                  return (
                    <button key={m} type="button" onMouseEnter={() => setMonth(m)} className="relative flex-1">
                      <span
                        className="absolute inset-x-0 rounded-sm"
                        style={{
                          height: h,
                          top: r >= 0 ? `calc(50% - ${h}px)` : "50%",
                          background: m === month ? "#1c1915" : r >= 0 ? "#7d9a78" : "#c47c74",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-[11px] text-[#8a8176]">{names[month]} {pct((HISTORY.find((p) => p.ym === `${year}-${String(month + 1).padStart(2, "0")}`)?.ret ?? 0) * 100)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function D15c() {
  const rows = HISTORY.filter((p) => p.ym >= "2021-01");
  const [pin, setPin] = useState(rows.length - 1);
  const active = rows[pin];
  const bins = [-8, -4, -2, 0, 2, 4, 8];
  const counts = bins.map((edge, i) => {
    const hi = bins[i + 1] ?? 20;
    return rows.filter((r) => r.ret * 100 >= edge && r.ret * 100 < hi).length;
  });
  const maxC = Math.max(...counts);
  const activeBin = bins.findIndex((edge, i) => active.ret * 100 >= edge && active.ret * 100 < (bins[i + 1] ?? 20));
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#111", color: "#f5f1ea" }} className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#b9a48a]">Climate stripe</div>
          <h2 className="text-[30px] leading-none">Every month since 2021, in a single ribbon</h2>
        </div>
        <div className="text-right">
          <div className="text-[28px] leading-none">{ymLabel(active.ym)}</div>
          <div className="text-sm text-[#d7cbb8]">{pct(active.ret * 100)} · {monthNote(active.ym, active.ret)}</div>
        </div>
      </div>
      <div className="mt-5 flex h-24 overflow-hidden rounded-lg">
        {rows.map((r, i) => (
          <button
            key={r.ym}
            type="button"
            onClick={() => setPin(i)}
            title={r.ym}
            className="h-full flex-1"
            style={{ background: heat(r.ret * 100, 8), outline: i === pin ? "2px solid white" : "none" }}
          />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-7 gap-2">
        {bins.map((edge, i) => (
          <div key={edge} className={`rounded-lg px-2 py-3 ${i === activeBin ? "bg-[#f5f1ea] text-[#111]" : "bg-[#1c1c1c]"}`}>
            <div className="text-[11px] uppercase tracking-wider opacity-70">{edge}% to {bins[i + 1] ?? "∞"}</div>
            <div className="mt-2 h-16">
              <div className="w-full rounded-sm bg-current" style={{ height: `${(counts[i] / maxC) * 100}%`, opacity: 0.8 }} />
            </div>
            <div className="mt-1 text-sm">{counts[i]} months</div>
          </div>
        ))}
      </div>
    </div>
  );
}
