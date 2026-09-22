import { useState } from "react";
import {
  CASH,
  CASH_YIELD,
  DAY_PCT,
  DAY_PNL,
  GOAL,
  HEALTH,
  HOLDINGS,
  INCOME,
  INCOME_GOAL,
  PERIODS,
  TOTAL,
  VOL,
  WEIGHTED_ER,
  topWeight,
} from "@/lib/data";
import { money, pct, signed } from "@/lib/format";

export function D91a() {
  const [open, setOpen] = useState<number | null>(null);
  const top = [...HOLDINGS].sort((a, b) => b.weight - a.weight)[0];
  const bits = [
    `The book is ${money(TOTAL)}. Today it moved ${signed(DAY_PNL)} (${pct(DAY_PCT, 2)}).`,
    `${top.ticker} is the largest line at ${top.weight.toFixed(1)}%, above the 8% single-name guide.`,
    `Cash is ${((CASH / TOTAL) * 100).toFixed(1)}% and earning ${(CASH_YIELD * 100).toFixed(2)}%. It is not the problem. Concentration is.`,
  ];
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f7f3ec", color: "#1c1612" }} className="px-10 py-8">
      <div className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Portfolio pulse</div>
      <p className="mt-3 max-w-3xl text-[26px] leading-snug">
        {bits.map((b, i) => (
          <button key={b} type="button" onClick={() => setOpen(open === i ? null : i)} className={`mr-2 text-left ${open === i ? "bg-[#f0d9c8]" : "hover:bg-[#efe6d6]"}`}>
            {b}
          </button>
        ))}
      </p>
      {open != null && <p className="mt-3 text-sm text-[#5c5146]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Click again to set the sentence back. The pulse is a reading, not a trade ticket.</p>}
    </div>
  );
}

export function D91b() {
  const [i, setI] = useState(0);
  const notes = [
    { t: "Stable day", d: `Up ${pct(DAY_PCT, 2)}. No single line explains it.` },
    { t: "Concentration rising", d: `Top five holdings are ${topWeight(5).toFixed(0)}% of the book.` },
    { t: "Cash adequate", d: `${money(CASH)} is inside the band and it is paid.` },
  ];
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#10221c", color: "#e7f6ee" }} className="flex gap-3 p-5">
      {notes.map((n, idx) => (
        <button key={n.t} type="button" onClick={() => setI(idx)} className={`flex-1 rounded-2xl p-4 text-left ${i === idx ? "bg-[#dff26a] text-[#10221c]" : "bg-[#17352a]"}`}>
          <div className="text-xs uppercase tracking-wider opacity-70">Pulse</div>
          <div className="mt-2 text-xl">{n.t}</div>
          {i === idx && <p className="mt-2 text-sm">{n.d}</p>}
        </button>
      ))}
    </div>
  );
}

export function D91c() {
  const [span, setSpan] = useState<"Today" | "Week">("Today");
  const items = span === "Today"
    ? [`Close move ${signed(DAY_PNL)}.`, "NVIDIA and Bitcoin did most of the lifting.", "Bonds barely moved."]
    : ["Week is up 1.84%.", "The repair of the winter pullback continued.", "No contributions this week."];
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#111", color: "#e8e4da" }} className="px-6 py-5">
      <div className="mb-3 flex gap-2 text-[11px]">
        {(["Today", "Week"] as const).map((s) => <button key={s} type="button" onClick={() => setSpan(s)} className={`rounded px-2 py-1 ${span === s ? "bg-[#e8e4da] text-[#111]" : "bg-[#222]"}`}>{s}</button>)}
      </div>
      {items.map((t, i) => <div key={t} className="border-t border-[#2a2a2a] py-2 text-sm"><span className="mr-3 text-[#888]">0{i + 1}</span>{t}</div>)}
    </div>
  );
}

export function D93a() {
  const [n, setN] = useState(5);
  const w = topWeight(n);
  return (
    <div style={{ fontFamily: "Fraunces, serif", background: "#f4efe6", color: "#1c1915" }} className="flex items-end justify-between px-8 py-8">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Concentration</div>
        <div className="mt-2 text-[72px] leading-none">{w.toFixed(0)}%</div>
        <div className="text-lg">sits in the largest {n}</div>
      </div>
      <div className="flex gap-2" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
        {[1, 5, 10].map((k) => <button key={k} type="button" onClick={() => setN(k)} className={`h-16 w-16 rounded-full text-sm ${n === k ? "bg-[#1c1915] text-white" : "bg-white"}`}>Top {k}<div className="text-xs">{topWeight(k).toFixed(0)}%</div></button>)}
      </div>
    </div>
  );
}

export function D93b() {
  const [i, setI] = useState<number | null>(null);
  const top = [...HOLDINGS].sort((a, b) => b.weight - a.weight).slice(0, 8);
  const rest = 100 - top.reduce((s, h) => s + h.weight, 0);
  const segs = [...top.map((h) => ({ name: h.ticker, w: h.weight })), { name: "Rest", w: rest }];
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#fff", color: "#111" }} className="p-6">
      <div className="text-sm text-[#666]">Largest lines, then everything else. Hover a slice.</div>
      <div className="mt-3 flex h-12 overflow-hidden rounded-xl">
        {segs.map((s, n) => (
          <button key={s.name} type="button" onMouseEnter={() => setI(n)} onMouseLeave={() => setI(null)} style={{ width: `${s.w}%`, background: n === segs.length - 1 ? "#e7e1d6" : `hsl(${200 + n * 12} 28% ${18 + n * 4}%)`, color: n === segs.length - 1 ? "#111" : "#fff" }} className="text-xs">{s.w > 6 ? s.name : ""}</button>
        ))}
      </div>
      <div className="mt-2 text-sm">{i == null ? `Top 5 are ${topWeight(5).toFixed(1)}%.` : `${segs[i].name} · ${segs[i].w.toFixed(1)}%`}</div>
    </div>
  );
}

export function D93c() {
  const ranks = [1, 2, 3, 5, 10, HOLDINGS.length];
  const pts = ranks.map((n, i) => `${40 + i * 90},${180 - topWeight(Math.min(n, HOLDINGS.length)) * 1.4}`).join(" ");
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f8f4ee", color: "#1c1612" }} className="grid grid-cols-12 items-center px-6 py-5">
      <p className="col-span-5 text-[22px] leading-snug">Half the book is a handful of names. The rest is a long, quieter tail.</p>
      <svg viewBox="0 0 520 200" className="col-span-7 h-40">
        <polyline points={pts} fill="none" stroke="#1c1612" strokeWidth="2" />
        {ranks.map((n, i) => <text key={n} x={40 + i * 90} y="196" fontSize="11" textAnchor="middle">{n === HOLDINGS.length ? "All" : `Top ${n}`}</text>)}
      </svg>
    </div>
  );
}

export function D94a() {
  const [show, setShow] = useState(false);
  const progress = TOTAL / GOAL.target;
  const need = Math.pow(GOAL.target / TOTAL, 1 / GOAL.years) - 1;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f4f7f8", color: "#102027" }} className="px-8 py-7">
      <div className="flex justify-between text-sm"><span>{GOAL.name} · {GOAL.by}</span><span className="tabular">{money(TOTAL)} of {money(GOAL.target)}</span></div>
      <div className="relative mt-3 h-3 rounded-full bg-[#e1e7ea]">
        <div className="h-3 rounded-full bg-[#1e3a5f]" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-[#6d838c]"><span>Opened 2018</span><span>Today {Math.round(progress * 100)}%</span><span>{GOAL.by}</span></div>
      <button type="button" onClick={() => setShow((v) => !v)} className="mt-4 text-sm underline">{show ? "Hide the required pace" : "What pace would finish the job?"}</button>
      {show && <p className="mt-2 text-sm">About {pct(need * 100, 1, false)} a year from here, before new contributions. With {money(GOAL.monthly)} a month, the required market return is lower.</p>}
    </div>
  );
}

export function D94b() {
  const p = TOTAL / GOAL.target;
  const [on, setOn] = useState(false);
  const c = 2 * Math.PI * 54;
  return (
    <div style={{ fontFamily: "Fraunces, serif", background: "#efeae2", color: "#1c1915" }} className="flex items-center gap-8 px-8 py-6">
      <button type="button" onClick={() => setOn((v) => !v)} className="relative h-40 w-40">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#e4d9c8" strokeWidth="10" />
          <circle cx="70" cy="70" r="54" fill="none" stroke="#9a3412" strokeWidth="10" strokeDasharray={`${c * p} ${c}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-3xl">{Math.round(p * 100)}%</div>
      </button>
      <div>
        <div className="text-3xl">{on ? money(GOAL.target - TOTAL) : money(TOTAL)}</div>
        <div className="text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{on ? `still to find by ${GOAL.by}` : `saved toward ${money(GOAL.target)}`}. Click the ring.</div>
      </div>
    </div>
  );
}

export function D94c() {
  const [mode, setMode] = useState<"recent" | "required">("required");
  const required = (Math.pow(GOAL.target / TOTAL, 1 / GOAL.years) - 1) * 100;
  const recent = PERIODS.oneYear;
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#11160f", color: "#eef6e4" }} className="grid grid-cols-2">
      <button type="button" onClick={() => setMode("required")} className={`p-6 text-left ${mode === "required" ? "bg-[#dff26a] text-[#11160f]" : ""}`}>
        <div className="text-xs uppercase tracking-wider opacity-70">Required pace</div>
        <div className="mt-2 text-4xl">{required.toFixed(1)}%</div>
        <div className="text-sm">a year to hit the goal with no new money</div>
      </button>
      <button type="button" onClick={() => setMode("recent")} className={`p-6 text-left ${mode === "recent" ? "bg-[#dff26a] text-[#11160f]" : ""}`}>
        <div className="text-xs uppercase tracking-wider opacity-70">Last year</div>
        <div className="mt-2 text-4xl">{pct(recent)}</div>
        <div className="text-sm">{recent > required ? "Ahead of the required pace." : "Behind the required pace."}</div>
      </button>
    </div>
  );
}

export function D96a() {
  const [pin, setPin] = useState("1Y");
  const rows = [
    ["Today", PERIODS.today],
    ["Week", PERIODS.week],
    ["Month", PERIODS.month],
    ["YTD", PERIODS.ytd],
    ["1Y", PERIODS.oneYear],
    ["All", PERIODS.since],
  ] as const;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f6f3", color: "#1c1915" }} className="flex items-center gap-2 px-5 py-6">
      {rows.map(([k, v]) => (
        <button key={k} type="button" onClick={() => setPin(k)} className={`rounded-full px-4 py-3 text-sm ${pin === k ? "bg-[#1c1915] text-white" : "bg-white"}`}>
          <div className="text-[10px] uppercase tracking-wider opacity-60">{k}</div>
          <div className="tabular text-lg" style={{ color: pin === k ? "inherit" : v >= 0 ? "#1f7a4d" : "#9d3b32" }}>{pct(v)}</div>
        </button>
      ))}
    </div>
  );
}

export function D96b() {
  const rows = [["Today", PERIODS.today], ["Week", PERIODS.week], ["Month", PERIODS.month], ["YTD", PERIODS.ytd], ["1Y", PERIODS.oneYear], ["Since", PERIODS.since]] as const;
  return (
    <div style={{ fontFamily: "Libre Baskerville, serif", background: "#fff", color: "#111" }} className="flex divide-x divide-[#111] border-y border-[#111]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex-1 px-4 py-5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#888]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{k}</div>
          <div className="mt-1 text-2xl tabular">{pct(v)}</div>
        </div>
      ))}
    </div>
  );
}

export function D96c() {
  const [i, setI] = useState(4);
  const rows = [["1D", PERIODS.today], ["1W", PERIODS.week], ["1M", PERIODS.month], ["YTD", PERIODS.ytd], ["1Y", PERIODS.oneYear], ["SI", PERIODS.since]] as const;
  const max = Math.max(...rows.map((r) => Math.abs(r[1])));
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#10140f", color: "#e7f0d8" }} className="px-6 py-5">
      <div className="flex h-28 items-end gap-3">
        {rows.map(([k, v], n) => (
          <button key={k} type="button" onClick={() => setI(n)} className="flex h-full flex-1 flex-col items-center justify-end">
            <div className="w-full rounded-sm" style={{ height: Math.max(8, (Math.abs(v) / max) * 88), background: n === i ? "#dff26a" : v >= 0 ? "#3d4a34" : "#6b3030" }} />
            <div className="mt-1 text-[10px]">{k}</div>
          </button>
        ))}
      </div>
      <div className="mt-2 text-sm">{rows[i][0]} · {pct(rows[i][1])}</div>
    </div>
  );
}

export function D97a() {
  const [open, setOpen] = useState(false);
  const level = 68;
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f6f3ee", color: "#1c1915" }} className="flex items-center gap-8 px-8 py-6">
      <button type="button" onClick={() => setOpen((v) => !v)} className="relative h-28 w-56">
        <svg viewBox="0 0 200 110" className="h-full w-full">
          <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#e7e1d6" strokeWidth="14" strokeLinecap="round" />
          <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#9a3412" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${(level / 100) * 251} 251`} />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 text-center text-3xl">Elevated</div>
      </button>
      <div className="max-w-md text-sm leading-relaxed">
        Between balanced and aggressive. Volatility {VOL}%, beta 0.86. {open ? "The needle moves because crypto and NVIDIA are large, not because the policy says aggressive." : "Click the gauge for why."}
      </div>
    </div>
  );
}

export function D97b() {
  const [on, setOn] = useState(false);
  const marks = ["Calm", "Measured", "Elevated", "Hot"];
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fff", color: "#111" }} className="px-8 py-7">
      <div className="flex justify-between text-xs uppercase tracking-wider text-[#888]">{marks.map((m) => <span key={m}>{m}</span>)}</div>
      <button type="button" onClick={() => setOn((v) => !v)} className="relative mt-2 h-2 w-full rounded-full bg-[#eee]">
        <span className="absolute top-[-5px] h-4 w-4 rounded-full bg-[#111]" style={{ left: "62%" }} />
      </button>
      <p className="mt-4 text-sm">{on ? `Vol ${VOL}% · worst fall about 24% · beta 0.86. Elevated means the swings are larger than a plain 60/40, smaller than a tech fund.` : "Click the track. The dot is the book, not a mood."}</p>
    </div>
  );
}

export function D97c() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#1a120c", color: "#f6efe6" }} className="px-8 py-7">
      <button type="button" onClick={() => setOpen((v) => !v)} className="text-left">
        <div className="text-[64px] leading-none tracking-tight">ELEVATED</div>
        <div className="mt-2 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{open ? `Volatility ${VOL}% · beta 0.86 · fees ${WEIGHTED_ER.toFixed(2)}% are not the risk.` : "Three numbers live under the word. Click."}</div>
      </button>
    </div>
  );
}

export function D101a() {
  const [rate, setRate] = useState(8);
  const drag = CASH * ((rate / 100 - CASH_YIELD));
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f4ee", color: "#1c1915" }} className="flex items-end justify-between px-8 py-7">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8a8176]">Cash drag, next 12 months</div>
        <div className="mt-1 text-5xl tabular">{money(Math.max(0, drag))}</div>
        <div className="text-sm text-[#6f675e]">if the {money(CASH)} earned {rate}% instead of {(CASH_YIELD * 100).toFixed(2)}%</div>
      </div>
      <label className="text-sm">Comparison return {rate}%
        <input type="range" min={4} max={12} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1 block w-48" />
      </label>
    </div>
  );
}

export function D101b() {
  const [which, setWhich] = useState<"cash" | "book">("cash");
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f3f7f4", color: "#142018" }} className="flex gap-4 px-6 py-6">
      {([["cash", "Cash yield", CASH_YIELD * 100, "#a7c4b0"], ["book", "A 8% equity pace", 8, "#1f7a4d"]] as const).map(([k, label, v, color]) => (
        <button key={k} type="button" onClick={() => setWhich(k)} className={`flex-1 rounded-2xl p-4 text-left ${which === k ? "ring-2 ring-[#142018]" : "bg-white"}`}>
          <div className="text-xs uppercase tracking-wider text-[#5c6b60]">{label}</div>
          <div className="mt-3 h-24 rounded-t" style={{ background: color, height: `${v * 10}px` }} />
          <div className="mt-2 text-2xl">{v.toFixed(2)}%</div>
        </button>
      ))}
      <div className="w-56 self-center text-sm">The gap on {money(CASH)} is about {money(CASH * (0.08 - CASH_YIELD))} a year. Not nothing. Not the main story.</div>
    </div>
  );
}

export function D101c() {
  const [math, setMath] = useState(false);
  const cost = CASH * (0.08 - CASH_YIELD);
  return (
    <button type="button" onClick={() => setMath((v) => !v)} className="block w-full bg-[#9d3b32] px-8 py-6 text-left text-white" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#ffd2cc]">Idle cash</div>
      <div className="mt-1 text-3xl">About {money(cost)} a year, if equities would have paid 8%.</div>
      {math && <div className="mt-2 text-sm text-[#ffd2cc]">{money(CASH)} × (8% − {(CASH_YIELD * 100).toFixed(2)}%) = {money(cost)}. Cash is earning. It is just earning less than the rest of the plan.</div>}
    </button>
  );
}

export function D114a() {
  const [open, setOpen] = useState(false);
  const p = HEALTH.score / 100;
  const c = 2 * Math.PI * 42;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f6f3", color: "#1c1915" }} className="flex items-center gap-6 px-6 py-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#eee7dc" strokeWidth="8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1e3a5f" strokeWidth="8" strokeDasharray={`${c * p} ${c}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-medium">{HEALTH.score}</div>
      </button>
      <div>
        <div className="text-lg font-medium">{HEALTH.label}</div>
        {open && <div className="mt-2 flex flex-wrap gap-1">{HEALTH.factors.map((f) => <span key={f.id} className="rounded-full bg-white px-2 py-1 text-xs">{f.name} {f.score}</span>)}</div>}
        {!open && <div className="text-sm text-[#6f675e]">Click the ring for the factors.</div>}
      </div>
    </div>
  );
}

export function D114b() {
  const [zone, setZone] = useState<string | null>(null);
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#111", color: "#f4efe6" }} className="px-8 py-6">
      <div className="relative mx-auto h-24 w-[420px]">
        <svg viewBox="0 0 420 120" className="h-full w-full">
          <path d="M30 100 A180 180 0 0 1 390 100" fill="none" stroke="#333" strokeWidth="16" />
          <path d="M30 100 A180 180 0 0 1 150 28" fill="none" stroke="#9d3b32" strokeWidth="16" />
          <path d="M150 28 A180 180 0 0 1 270 22" fill="none" stroke="#e7c98a" strokeWidth="16" />
          <path d="M270 22 A180 180 0 0 1 390 100" fill="none" stroke="#1f7a4d" strokeWidth="16" />
          <circle cx="250" cy="36" r="7" fill="#fff" />
        </svg>
      </div>
      <div className="mt-2 flex justify-center gap-2 text-xs">
        {["Watch", "Sound", "Strong"].map((z) => <button key={z} type="button" onClick={() => setZone(z)} className={`rounded-full px-3 py-1 ${zone === z ? "bg-white text-black" : "bg-[#222]"}`}>{z}</button>)}
      </div>
      <p className="mt-2 text-center text-sm text-[#cfc6b8]">{zone === "Sound" || zone == null ? `Score ${HEALTH.score}. Sound, with concentration and drift to watch.` : zone === "Watch" ? "Below 60 would mean the book is fighting its own policy." : "Above 85 would mean cost, fit and concentration were all quiet."}</p>
    </div>
  );
}

export function D114c() {
  const [why, setWhy] = useState(false);
  return (
    <button type="button" onClick={() => setWhy((v) => !v)} className="flex w-full items-center justify-between bg-[#f3ecdf] px-8 py-6 text-left" style={{ fontFamily: "Newsreader, serif" }}>
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Health</div>
        <div className="text-[64px] leading-none">{HEALTH.grade}</div>
      </div>
      <div className="max-w-md text-[18px] leading-snug">{why ? HEALTH.factors.find((f) => f.id === "conc")?.note : HEALTH.label + ". Click the grade."}</div>
    </button>
  );
}

export function D116a() {
  const [monthly, setMonthly] = useState(false);
  const got = monthly ? INCOME / 12 : INCOME;
  const need = monthly ? INCOME_GOAL / 12 : INCOME_GOAL;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f5f0", color: "#1c1915" }} className="px-8 py-6">
      <div className="flex justify-between text-sm"><span>Income goal</span><button type="button" onClick={() => setMonthly((v) => !v)} className="underline">{monthly ? "Show annual" : "Show monthly"}</button></div>
      <div className="mt-2 text-3xl tabular">{money(got)} <span className="text-lg text-[#8a8176]">/ {money(need)}</span></div>
      <div className="mt-3 h-2 rounded-full bg-[#ece7de]"><div className="h-2 rounded-full bg-[#a16207]" style={{ width: `${Math.min(100, (got / need) * 100)}%` }} /></div>
    </div>
  );
}

export function D116b() {
  const run = INCOME / 12;
  const need = INCOME_GOAL / 12;
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#fff", color: "#111" }} className="grid grid-cols-2 border-y border-[#111]">
      <div className="border-r border-[#111] p-6"><div className="text-xs uppercase tracking-wider text-[#888]">Monthly run rate</div><div className="mt-2 text-4xl">{money(run)}</div></div>
      <div className="p-6"><div className="text-xs uppercase tracking-wider text-[#888]">Needed</div><div className="mt-2 text-4xl">{money(need)}</div><div className="text-sm text-[#666]">Gap {money(need - run)} a month.</div></div>
    </div>
  );
}

export function D116c() {
  const [open, setOpen] = useState(false);
  const gap = INCOME_GOAL - INCOME;
  return (
    <button type="button" onClick={() => setOpen((v) => !v)} className="block w-full bg-[#1e3a5f] px-8 py-6 text-left text-white" style={{ fontFamily: "Fraunces, serif" }}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-[#c5d4e6]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Income shortfall</div>
      <div className="text-4xl">{money(gap)} a year</div>
      {open && <p className="mt-2 max-w-xl text-[16px] leading-snug">Closing it with yield alone would mean about {((gap / TOTAL) * 100).toFixed(2)} more percentage points of income, or a larger bond and dividend sleeve. The goal is {money(INCOME_GOAL)}. The book pays about {money(INCOME)}.</p>}
    </button>
  );
}
