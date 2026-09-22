import { useState } from "react";
import {
  CASH,
  CLASSES,
  COST_BASIS,
  CURRENCIES,
  CURRENCY_HOLDINGS,
  DAY_PCT,
  DAY_PNL,
  HEALTH,
  HOLDINGS,
  UNREALISED,
  incomeHistory,
} from "@/lib/data";
import { money, pct, signed } from "@/lib/format";

const facts = [
  { k: "Invested", v: money(COST_BASIS), d: "Cost basis, including cash. What was paid, not what it is worth." },
  { k: "Cash", v: money(CASH), d: "Reserve account plus the taxable sweep. It earns a treasury rate." },
  { k: "Unrealised", v: signed(UNREALISED), d: "Market value minus cost basis. Nothing here has been sold." },
  { k: "Today", v: `${signed(DAY_PNL)} · ${pct(DAY_PCT, 2)}`, d: "Change since the previous close, across every line." },
];

export function D51a() {
  const [on, setOn] = useState(0);
  return (
    <div style={{ fontFamily: "Fraunces, serif", background: "#f4efe6", color: "#1c1915" }} className="grid grid-cols-4">
      {facts.map((f, i) => (
        <button key={f.k} type="button" onClick={() => setOn(i)} className={`px-6 py-8 text-left ${i === on ? "bg-[#1c1915] text-[#f4efe6]" : "hover:bg-[#ebe4d6]"}`}>
          <div className="text-[11px] uppercase tracking-[0.18em] opacity-70" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{f.k}</div>
          <div className="mt-3 text-[34px] leading-none tabular">{f.v}</div>
          {i === on && <p className="mt-3 text-[14px] leading-snug opacity-80" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{f.d}</p>}
        </button>
      ))}
    </div>
  );
}

export function D51b() {
  const [on, setOn] = useState<number | null>(null);
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fff", color: "#111" }} className="px-8 py-6">
      <div className="flex divide-x divide-[#111] border-y border-[#111]">
        {facts.map((f, i) => (
          <button key={f.k} type="button" onClick={() => setOn(on === i ? null : i)} className="flex-1 px-4 py-5 text-left">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#777]">{f.k}</div>
            <div className="mt-1 text-[26px] font-medium tabular tracking-tight">{f.v}</div>
          </button>
        ))}
      </div>
      <p className="mt-3 min-h-6 text-sm text-[#444]">{on == null ? "Click a figure for the definition." : facts[on].d}</p>
    </div>
  );
}

export function D51c() {
  const [back, setBack] = useState(false);
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#e7e1d4" }} className="flex justify-center px-6 py-8">
      <button type="button" onClick={() => setBack((v) => !v)} className="w-[420px] bg-[#f7f3ea] px-6 py-5 text-left text-[#1c1915] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#8a735c]">
          <span>Meridian slip</span><span>{back ? "Yesterday" : "Today"}</span>
        </div>
        <div className="my-3 border-t border-dashed border-[#cfc3ae]" />
        {(back
          ? [
              ["Invested", money(COST_BASIS)],
              ["Cash", money(CASH)],
              ["Unrealised", signed(UNREALISED - DAY_PNL)],
              ["That day's change", signed(DAY_PNL * 0.4)],
            ]
          : facts.map((f) => [f.k, f.v])
        ).map(([k, v]) => (
          <div key={k} className="flex justify-between py-1 text-sm"><span>{k}</span><span>{v}</span></div>
        ))}
        <div className="my-3 border-t border-dashed border-[#cfc3ae]" />
        <div className="text-[10px] text-[#8a735c]">Tap the slip to turn it over. Figures are the book, not a forecast.</div>
      </button>
    </div>
  );
}

export function D52a() {
  const [name, setName] = useState(CLASSES[0].name);
  const c = CLASSES.find((x) => x.name === name)!;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f6f7f4", color: "#142018" }} className="grid grid-cols-12">
      <div className="col-span-7 space-y-3 p-5">
        {CLASSES.map((row) => (
          <button key={row.name} type="button" onClick={() => setName(row.name)} className="block w-full text-left">
            <div className="mb-1 flex justify-between text-xs"><span>{row.name}</span><span className="tabular">{row.weight.toFixed(1)}% / {row.target}%</span></div>
            <div className="relative h-3 rounded bg-[#e4e8e2]">
              <div className="absolute inset-y-0 rounded bg-[#c9d4c4]" style={{ width: `${row.target * 1.4}%` }} />
              <div className="absolute inset-y-0 rounded bg-[#1e3a5f]" style={{ width: `${Math.min(100, row.weight * 1.4)}%` }} />
            </div>
          </button>
        ))}
      </div>
      <aside className="col-span-5 border-l border-[#e1e6de] p-6">
        <div className="text-xs uppercase tracking-wider text-[#6d7a70]">Selected</div>
        <div className="mt-1 text-3xl">{c.name}</div>
        <p className="mt-3 text-sm leading-relaxed">Now {c.weight.toFixed(1)}%, target {c.target}%. {c.dollars >= 0 ? `Buy about ${money(c.dollars)} to close the gap.` : `Sell about ${money(Math.abs(c.dollars))} to close the gap.`} The pale bar is the target. The navy bar is what you hold.</p>
      </aside>
    </div>
  );
}

export function D52b() {
  const [dollars, setDollars] = useState(false);
  const max = Math.max(...CLASSES.map((c) => Math.abs(dollars ? c.dollars : c.drift)));
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#111", color: "#f4efe6" }} className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Zero is on target</h2>
        <button type="button" onClick={() => setDollars((v) => !v)} className="rounded-full bg-[#f4efe6] px-3 py-1 text-xs text-[#111]">{dollars ? "Show percent" : "Show dollars"}</button>
      </div>
      <div className="mt-4 space-y-2">
        {CLASSES.map((c) => {
          const v = dollars ? c.dollars : c.drift;
          const w = (Math.abs(v) / max) * 46;
          return (
            <div key={c.name} className="grid grid-cols-[140px_1fr_100px] items-center text-sm">
              <div>{c.name}</div>
              <div className="relative h-5">
                <div className="absolute left-1/2 top-0 h-5 w-px bg-[#666]" />
                <div className="absolute top-1 h-3" style={{ width: `${w}%`, left: v < 0 ? `${50 - w}%` : "50%", background: v < 0 ? "#e07a5f" : "#8fbf9f" }} />
              </div>
              <div className="text-right tabular">{dollars ? signed(c.dollars) : pct(c.drift)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function D52c() {
  const [name, setName] = useState("Crypto");
  const c = CLASSES.find((x) => x.name === name)!;
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#fbf7f1", color: "#1a1a1a" }} className="p-5">
      <h2 className="text-2xl">Where the puck sits, and where the notch is</h2>
      <div className="mt-4 space-y-4">
        {CLASSES.map((row) => (
          <button key={row.name} type="button" onClick={() => setName(row.name)} className="block w-full text-left">
            <div className="mb-1 flex justify-between text-xs" style={{ fontFamily: "Instrument Sans, sans-serif" }}><span>{row.name}</span><span>{row.weight.toFixed(1)}%</span></div>
            <div className="relative h-2 rounded-full bg-[#efe6d8]">
              <div className="absolute -top-1 h-4 w-0.5 bg-[#b45309]" style={{ left: `${row.target * 2}%` }} />
              <div className="absolute -top-1.5 h-5 w-5 rounded-full border-2 border-[#1a1a1a] bg-white" style={{ left: `calc(${Math.min(96, row.weight * 2)}% - 8px)` }} />
            </div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{c.name}: move {signed(c.dollars)} to sit on the notch.</p>
    </div>
  );
}

export function D54a() {
  const data = incomeHistory();
  const [year, setYear] = useState(2025);
  const years = [2023, 2024, 2025, 2026];
  const rows = data.filter((r) => r.ym.startsWith(String(year)));
  const max = Math.max(...data.map((r) => r.dividends + r.interest));
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f6f2", color: "#1c1915" }} className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Income, month by month</h2>
        <div className="flex gap-1">{years.map((y) => <button key={y} type="button" onClick={() => setYear(y)} className={`rounded-full px-3 py-1 text-xs ${year === y ? "bg-[#1c1915] text-white" : "bg-white"}`}>{y}</button>)}</div>
      </div>
      <div className="mt-4 flex h-48 items-end gap-2">
        {rows.map((r) => (
          <div key={r.ym} className="flex flex-1 flex-col justify-end">
            <div className="w-full bg-[#a16207]" style={{ height: `${(r.interest / max) * 180}px` }} />
            <div className="w-full bg-[#1e3a5f]" style={{ height: `${(r.dividends / max) * 180}px` }} />
            <div className="mt-1 text-center text-[10px] text-[#8a8176]">{r.label.slice(0, 3)}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-xs text-[#6f675e]"><span className="text-[#1e3a5f]">Dividends</span><span className="text-[#a16207]">Interest</span><span>Year total {money(rows.reduce((s, r) => s + r.dividends + r.interest, 0))}</span></div>
    </div>
  );
}

export function D54b() {
  const data = incomeHistory();
  let run = 0;
  const cum = data.map((r) => { run += r.dividends + r.interest; return { ...r, cum: run }; });
  const [i, setI] = useState(cum.length - 1);
  const max = cum[cum.length - 1].cum;
  return (
    <div style={{ fontFamily: "Newsreader, serif", background: "#f3ecdf", color: "#1d1a16" }} className="p-6">
      <div className="text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Running total</div>
      <div className="text-[40px] leading-none">{money(cum[i].cum)}</div>
      <div className="text-sm">{cum[i].label} · that month {money(cum[i].dividends + cum[i].interest)}</div>
      <div className="mt-4 flex h-28 items-end gap-px">
        {cum.map((r, n) => (
          <button key={r.ym} type="button" onClick={() => setI(n)} className="flex-1" style={{ height: `${(r.cum / max) * 100}%`, background: n === i ? "#9a3412" : "#1d1a16" }} />
        ))}
      </div>
    </div>
  );
}

export function D54c() {
  const data = incomeHistory();
  const [pin, setPin] = useState(data[data.length - 1].ym);
  const years = [2023, 2024, 2025, 2026];
  const max = Math.max(...data.map((r) => r.dividends + r.interest));
  const row = data.find((r) => r.ym === pin)!;
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#0f1412", color: "#e7f0e4" }} className="p-5">
      <div className="mb-3 text-sm text-[#b7c9b0]">{row.label} paid {money(row.dividends + row.interest)} · dividends {money(row.dividends)} · interest {money(row.interest)}</div>
      <div className="grid grid-cols-[40px_repeat(12,1fr)] gap-1 text-[10px]">
        <div />
        {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m) => <div key={m} className="text-center text-[#8fa894]">{m}</div>)}
        {years.flatMap((y) => [
          <div key={`y${y}`} className="self-center">{y}</div>,
          ...Array.from({ length: 12 }, (_, m) => {
            const hit = data.find((r) => r.ym === `${y}-${String(m + 1).padStart(2, "0")}`);
            if (!hit) return <div key={`${y}-${m}`} className="h-8 rounded bg-[#1a221c]" />;
            const t = (hit.dividends + hit.interest) / max;
            return <button key={`${y}-${m}`} type="button" onClick={() => setPin(hit.ym)} className="h-8 rounded" style={{ background: `rgba(184, 214, 120, ${0.15 + t * 0.85})`, outline: pin === hit.ym ? "1px solid white" : "none" }} />;
          }),
        ])}
      </div>
    </div>
  );
}

export function D61a() {
  const rows = [...HOLDINGS].sort((a, b) => b.scoreImpact - a.scoreImpact);
  const max = Math.max(...rows.map((r) => Math.abs(r.scoreImpact)), 1);
  const [id, setId] = useState(rows[0].ticker);
  const h = rows.find((r) => r.ticker === id)!;
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f4ef", color: "#1c1915" }} className="grid grid-cols-12">
      <div className="col-span-8 max-h-[520px] space-y-1 overflow-auto p-4">
        {rows.map((r) => (
          <button key={r.ticker} type="button" onClick={() => setId(r.ticker)} className="grid w-full grid-cols-[64px_1fr_36px] items-center gap-2 text-left text-sm">
            <span>{r.ticker}</span>
            <span className="relative h-3 bg-[#efe8dc]">
              <span className="absolute top-0 h-3" style={{ background: r.scoreImpact >= 0 ? "#1f7a4d" : "#9d3b32", width: `${(Math.abs(r.scoreImpact) / max) * 48}%`, left: r.scoreImpact >= 0 ? "50%" : `${50 - (Math.abs(r.scoreImpact) / max) * 48}%` }} />
            </span>
            <span className="tabular text-right">{r.scoreImpact > 0 ? `+${r.scoreImpact}` : r.scoreImpact}</span>
          </button>
        ))}
      </div>
      <aside className="col-span-4 border-l border-[#eee6da] p-5">
        <div className="text-xs uppercase tracking-wider text-[#8a8176]">Health {HEALTH.score}</div>
        <div className="mt-2 text-3xl">{h.ticker}</div>
        <p className="mt-3 text-sm leading-relaxed">{h.blurb} This line {h.scoreImpact >= 0 ? "lifts" : "drags"} the score by {Math.abs(h.scoreImpact)} points.</p>
      </aside>
    </div>
  );
}

export function D61b() {
  const [id, setId] = useState<string | null>(null);
  const lift = HOLDINGS.filter((h) => h.scoreImpact > 0).sort((a, b) => b.scoreImpact - a.scoreImpact);
  const drag = HOLDINGS.filter((h) => h.scoreImpact < 0).sort((a, b) => a.scoreImpact - b.scoreImpact);
  const h = HOLDINGS.find((x) => x.ticker === id);
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f4f1ea", color: "#1c1915" }} className="p-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#1f7a4d]">Lifting</div>
          {lift.map((r) => (
            <button key={r.ticker} type="button" onClick={() => setId(r.ticker)} className="mt-2 flex w-full items-center gap-2 text-left text-sm">
              <span className="w-14">{r.ticker}</span>
              <span className="h-2 rounded bg-[#1f7a4d]" style={{ width: `${r.scoreImpact * 18}px` }} />
            </button>
          ))}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-[#9d3b32]">Dragging</div>
          {drag.map((r) => (
            <button key={r.ticker} type="button" onClick={() => setId(r.ticker)} className="mt-2 flex w-full items-center gap-2 text-left text-sm">
              <span className="w-14">{r.ticker}</span>
              <span className="h-2 rounded bg-[#9d3b32]" style={{ width: `${Math.abs(r.scoreImpact) * 18}px` }} />
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-[#5c564e]">{h ? `${h.ticker}: ${h.blurb}` : "Click a name. The score is 72. These are the forces, not the whole formula."}</p>
    </div>
  );
}

export function D61c() {
  const [id, setId] = useState("BTC");
  const nodes = HOLDINGS.filter((h) => h.scoreImpact !== 0);
  const h = HOLDINGS.find((x) => x.ticker === id)!;
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#14121a", color: "#f6f1ea" }} className="grid grid-cols-12">
      <svg viewBox="0 0 640 420" className="col-span-8 h-[420px]">
        <circle cx="320" cy="210" r="46" fill="#f6f1ea" />
        <text x="320" y="216" textAnchor="middle" fontSize="18" fill="#14121a">{HEALTH.score}</text>
        {nodes.map((n, i) => {
          const up = n.scoreImpact > 0;
          const ang = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const rad = 90 + Math.abs(n.scoreImpact) * 14;
          const x = 320 + Math.cos(ang) * rad;
          const y = 210 + Math.sin(ang) * rad * 0.72;
          return (
            <g key={n.ticker} onClick={() => setId(n.ticker)} className="cursor-pointer">
              <line x1="320" y1="210" x2={x} y2={y} stroke={up ? "#8fbf9f" : "#e07a5f"} strokeWidth={Math.abs(n.scoreImpact) / 2} />
              <circle cx={x} cy={y} r="11" fill={n.ticker === id ? "#fff" : "#2a2633"} />
              <text x={x} y={y + 3} textAnchor="middle" fontSize="7" fill={n.ticker === id ? "#14121a" : "#fff"}>{n.ticker.slice(0, 4)}</text>
            </g>
          );
        })}
      </svg>
      <aside className="col-span-4 p-6">
        <div className="text-3xl">{h.ticker}</div>
        <p className="mt-3 text-sm leading-relaxed text-[#ddd4c8]">{h.scoreImpact > 0 ? "Pulling the score up." : "Pulling the score down."} {h.blurb}</p>
      </aside>
    </div>
  );
}

export function D68a() {
  const [period, setPeriod] = useState<"dayPct" | "monthPct" | "ytdPct" | "ret1y">("dayPct");
  const sorted = [...HOLDINGS].filter((h) => h.type !== "Cash").sort((a, b) => b[period] - a[period]);
  const top = sorted.slice(0, 5);
  const bot = sorted.slice(-5).reverse();
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f7f8f6", color: "#142018" }} className="p-5">
      <div className="flex gap-1">{(["dayPct", "monthPct", "ytdPct", "ret1y"] as const).map((p) => <button key={p} type="button" onClick={() => setPeriod(p)} className={`rounded-full px-3 py-1 text-xs ${period === p ? "bg-[#142018] text-white" : "bg-white"}`}>{p === "dayPct" ? "Day" : p === "monthPct" ? "Month" : p === "ytdPct" ? "YTD" : "1Y"}</button>)}</div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>{top.map((h, i) => <Row key={h.ticker} n={i + 1} h={h.ticker} name={h.name} v={h[period]} good />)}</div>
        <div>{bot.map((h, i) => <Row key={h.ticker} n={i + 1} h={h.ticker} name={h.name} v={h[period]} />)}</div>
      </div>
    </div>
  );
}
function Row({ n, h, name, v, good }: { n: number; h: string; name: string; v: number; good?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[#e5ebe4] py-2 text-sm">
      <span><span className="mr-2 text-[#8a9188]">{n}</span><strong>{h}</strong> <span className="text-[#6f675e]">{name}</span></span>
      <span className="tabular" style={{ color: good ? "#1f7a4d" : "#9d3b32" }}>{pct(v)}</span>
    </div>
  );
}

export function D68b() {
  const [period, setPeriod] = useState<"dayPct" | "monthPct">("monthPct");
  const rows = [...HOLDINGS].filter((h) => h.type !== "Cash").sort((a, b) => b[period] - a[period]).slice(0, 8);
  const worst = [...HOLDINGS].filter((h) => h.type !== "Cash").sort((a, b) => a[period] - b[period]).slice(0, 4);
  const all = [...rows.slice(0, 4), ...worst].sort((a, b) => b[period] - a[period]);
  const max = Math.max(...all.map((h) => Math.abs(h[period])));
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#10140f", color: "#eef6e4" }} className="p-5">
      <button type="button" onClick={() => setPeriod(period === "dayPct" ? "monthPct" : "dayPct")} className="rounded-full bg-[#dff26a] px-3 py-1 text-xs text-[#10140f]">{period === "dayPct" ? "Day" : "Month"}</button>
      <div className="mt-4 space-y-2">
        {all.map((h) => (
          <div key={h.ticker} className="grid grid-cols-[70px_1fr] items-center text-sm">
            <div>{h.ticker}</div>
            <div className="relative h-4">
              <div className="absolute left-1/2 h-4 w-px bg-[#445238]" />
              <div className="absolute top-1 h-2" style={{ background: h[period] >= 0 ? "#dff26a" : "#ff8d7a", width: `${(Math.abs(h[period]) / max) * 46}%`, left: h[period] >= 0 ? "50%" : `${50 - (Math.abs(h[period]) / max) * 46}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function D68c() {
  const [period, setPeriod] = useState<"dayPct" | "ytdPct" | "ret1y">("ytdPct");
  const [open, setOpen] = useState(false);
  const sorted = [...HOLDINGS].filter((h) => h.type !== "Cash").sort((a, b) => b[period] - a[period]);
  return (
    <div style={{ fontFamily: "Fraunces, serif", background: "#f6f1e8", color: "#1c1612" }} className="p-5">
      <div className="flex gap-2 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
        {(["dayPct", "ytdPct", "ret1y"] as const).map((p) => <button key={p} type="button" onClick={() => setPeriod(p)} className={`rounded-full px-3 py-1 ${period === p ? "bg-[#1c1612] text-white" : "bg-white"}`}>{p === "dayPct" ? "Day" : p === "ytdPct" ? "YTD" : "1 year"}</button>)}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {sorted.slice(0, 3).map((h, i) => (
          <div key={h.ticker} className="rounded-2xl bg-white p-4">
            <div className="text-xs text-[#8a735c]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{i === 0 ? "First" : i === 1 ? "Second" : "Third"}</div>
            <div className="text-3xl">{h.ticker}</div>
            <div className="text-[#1f7a4d]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{pct(h[period])}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1">
        {sorted.slice(-3).reverse().map((h) => (
          <div key={h.ticker} className="flex justify-between rounded-lg bg-[#f0d9d4] px-3 py-2 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
            <span>{h.ticker} · {h.name}</span><span>{pct(h[period])}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="mt-3 text-sm underline" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{open ? "Hide the middle" : "Show the rest"}</button>
      {open && <div className="mt-2 text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{sorted.slice(3, -3).map((h) => `${h.ticker} ${pct(h[period])}`).join(" · ")}</div>}
    </div>
  );
}

export function D73a() {
  const [i, setI] = useState(0);
  const c = CURRENCIES[i];
  let acc = 0;
  const arcs = CURRENCIES.map((row) => {
    const start = acc;
    acc += row.share / 100;
    return { ...row, start, end: acc };
  });
  const colors = ["#1e3a5f", "#0f766e", "#a16207", "#9a3412", "#6d28d9", "#44403c", "#b45309", "#64748b"];
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#f5f7fb", color: "#142033" }} className="grid grid-cols-12 items-center">
      <svg viewBox="0 0 280 280" className="col-span-5 h-[280px]">
        {arcs.map((a, n) => {
          const r = 90;
          const large = a.end - a.start > 0.5 ? 1 : 0;
          const p1 = [140 + r * Math.cos(a.start * Math.PI * 2 - Math.PI / 2), 140 + r * Math.sin(a.start * Math.PI * 2 - Math.PI / 2)];
          const p2 = [140 + r * Math.cos(a.end * Math.PI * 2 - Math.PI / 2), 140 + r * Math.sin(a.end * Math.PI * 2 - Math.PI / 2)];
          return <path key={a.code} d={`M140,140 L${p1[0]},${p1[1]} A${r},${r} 0 ${large} 1 ${p2[0]},${p2[1]} Z`} fill={colors[n]} opacity={n === i ? 1 : 0.45} onClick={() => setI(n)} className="cursor-pointer" />;
        })}
        <circle cx="140" cy="140" r="48" fill="#f5f7fb" />
        <text x="140" y="136" textAnchor="middle" fontSize="12">{c.code}</text>
        <text x="140" y="154" textAnchor="middle" fontSize="14">{c.share}%</text>
      </svg>
      <div className="col-span-7 p-6">
        <div className="text-3xl">{c.name}</div>
        <div className="mt-1 tabular text-xl">{money(c.amount)}</div>
        <p className="mt-3 text-sm leading-relaxed text-[#3d4c5c]">{c.note} One-year currency move {pct(c.move)}.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CURRENCIES.map((row, n) => <button key={row.code} type="button" onClick={() => setI(n)} className={`rounded-full px-3 py-1 text-xs ${n === i ? "bg-[#142033] text-white" : "bg-white"}`}>{row.code}</button>)}
        </div>
      </div>
    </div>
  );
}

export function D73b() {
  const [code, setCode] = useState<string | null>(null);
  const colors = ["#1e3a5f", "#0f766e", "#a16207", "#9a3412", "#6d28d9", "#57534e", "#b45309", "#94a3b8"];
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#fff", color: "#111" }} className="p-5">
      <h2 className="text-2xl">One bar. Eight currencies. Click a slice.</h2>
      <div className="mt-4 flex h-14 overflow-hidden rounded-xl">
        {CURRENCIES.map((c, i) => (
          <button key={c.code} type="button" onClick={() => setCode(code === c.code ? null : c.code)} style={{ width: `${c.share}%`, background: colors[i] }} className="text-xs text-white">{c.share > 6 ? c.code : ""}</button>
        ))}
      </div>
      {code && (
        <div className="mt-4 rounded-xl bg-[#f6f3ee] p-4 text-sm">
          <strong>{code}</strong> · {money(CURRENCIES.find((c) => c.code === code)!.amount)} · seen via {(CURRENCY_HOLDINGS[code] ?? []).join(", ")}
        </div>
      )}
    </div>
  );
}

export function D73c() {
  const [sort, setSort] = useState<"share" | "move">("share");
  const rows = [...CURRENCIES].sort((a, b) => (sort === "share" ? b.share - a.share : a.move - b.move));
  return (
    <div style={{ fontFamily: "Libre Baskerville, serif", background: "#f7f1e6", color: "#2a2118" }} className="p-5">
      <button type="button" onClick={() => setSort(sort === "share" ? "move" : "share")} className="text-xs underline" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Sort by {sort === "share" ? "currency move" : "share"}</button>
      <table className="mt-3 w-full text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
        <thead><tr className="text-left text-[10px] uppercase tracking-wider text-[#8a735c]"><th>Currency</th><th className="text-right">Amount</th><th className="text-right">Share</th><th className="text-right">1Y FX</th><th>Note</th></tr></thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.code} className="border-t border-[#efe6d6]">
              <td className="py-2 font-medium">{c.code} · {c.name}</td>
              <td className="tabular text-right">{money(c.amount)}</td>
              <td className="tabular text-right">{c.share.toFixed(1)}%</td>
              <td className="tabular text-right" style={{ color: c.move < 0 ? "#9d3b32" : "#1f7a4d" }}>{pct(c.move)}</td>
              <td className="pl-3 text-xs text-[#6e6254]">{c.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
