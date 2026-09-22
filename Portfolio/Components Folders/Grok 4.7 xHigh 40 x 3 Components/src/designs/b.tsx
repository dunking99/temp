import { useState } from "react";
import {
  allocationRows,
  cashTotal,
  currentDrawdown,
  drawdownSeries,
  driftRows,
  investor,
  maxDrawdown,
  monthly,
  movers,
  netInvested,
  peakValue,
  positions,
  todayChange,
  todayPct,
  totalCost,
  totalValue,
  unrealised,
  unrealisedPct,
} from "../data";
import { area, indexAt, line, money, pct, scale } from "../lib";

const defs = [
  { key: "invested", label: "Amount invested", value: netInvested, sub: "Contributions minus withdrawals", hint: "Net cash the household has put in since March 2021. Not the same as cost basis." },
  { key: "cash", label: "Cash", value: cashTotal, sub: `${pct(cashTotal / totalValue, 1, false)} of the book`, hint: "Sweep vehicles plus idle cash across four accounts. Included in total value." },
  { key: "gain", label: "Unrealised gain", value: unrealised, sub: pct(unrealisedPct, 1), hint: "Market value of holdings minus what those lots cost. Realised gains are not in this number." },
  { key: "today", label: "Today's change", value: todayChange, sub: pct(todayPct, 2), hint: "Mark-to-market since the prior close. Cash does not move this figure." },
];

export function D4a() {
  const [pin, setPin] = useState("gain");
  const [hover, setHover] = useState<string | null>(null);
  const active = defs.find((d) => d.key === (hover ?? pin)) ?? defs[0];
  return (
    <div style={{ background: "#f6f4f1", color: "#1a1a1a", fontFamily: "'Public Sans', sans-serif", padding: "28px 8px 22px" }}>
      <style>{`.d4a-col{background:transparent;border:0;border-right:1px solid #e3ddd4;text-align:left;padding:8px 22px 12px;color:inherit}.d4a-col:hover{background:#fff}.d4a-col.on{background:#171717;color:#f6f4f1}`}</style>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr repeat(3, 1fr)" }}>
        {defs.map((d) => (
          <button key={d.key} className={`d4a-col ${pin === d.key ? "on" : ""}`} onClick={() => setPin(d.key)} onMouseEnter={() => setHover(d.key)} onMouseLeave={() => setHover(null)}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.62 }}>{d.label}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: pin === d.key ? 46 : 32, lineHeight: 1, marginTop: 12 }}>{money(d.value, 0, d.key === "today" || d.key === "gain")}</div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>{d.sub}</div>
          </button>
        ))}
      </div>
      <div style={{ margin: "18px 28px 0", minHeight: 44, fontSize: 14, lineHeight: 1.5, color: "#5c564e" }}>{active.hint} Click a figure to hold it.</div>
    </div>
  );
}

export function D4b() {
  const [open, setOpen] = useState(false);
  const byClass = allocationRows.filter((r) => r.name !== "Cash").map((r) => ({
    name: r.name,
    gain: positions.filter((p) => p.assetClass === r.name).reduce((s, p) => s + p.gain, 0),
  }));
  const rows = [
    ["Amount invested", money(netInvested, 2), false],
    ["Cash", money(cashTotal, 2), false],
    ["Cost basis of holdings", money(totalCost, 2), false],
    ["Unrealised gain", money(unrealised, 2, true), true],
    ["Today's change", money(todayChange, 2, true), true],
  ] as const;
  return (
    <div style={{ background: "#fffef9", color: "#1e1a14", fontFamily: "'IBM Plex Serif', serif", padding: "28px 36px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8a8175" }}>
        <span>Statement of figures</span><span>{investor.asOf}</span>
      </div>
      <div style={{ marginTop: 16 }}>
        {rows.map(([label, value]) => (
          <button key={label} onClick={() => label === "Unrealised gain" && setOpen((v) => !v)} style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr auto", background: label.startsWith("Today") ? "#eef6ef" : "transparent", border: 0, borderBottom: "1px solid #ece4d6", padding: "12px 4px", textAlign: "left", color: "inherit", fontSize: 18 }}>
            <span>{label}{label === "Unrealised gain" && <em style={{ fontSize: 13, color: "#8a8175", marginLeft: 8 }}>{open ? "hide classes" : "by class"}</em>}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16 }}>{value}</span>
          </button>
        ))}
      </div>
      {open && (
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {byClass.map((c) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", background: "#f6f1e8", padding: "8px 10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
              <span>{c.name}</span><span style={{ color: c.gain >= 0 ? "#1f7a4d" : "#a33b2b" }}>{money(c.gain, 0, true)}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 14, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8a8175" }}>Total value {money(totalValue, 2)} = holdings {money(totalValue - cashTotal, 2)} + cash.</div>
    </div>
  );
}

export function D4c() {
  const [unit, setUnit] = useState<"$" | "%">("$");
  const figures = [
    ["Invested", money(netInvested), pct(netInvested / totalValue, 0, false)],
    ["Cash", money(cashTotal), pct(cashTotal / totalValue, 1, false)],
    ["Unrealised", money(unrealised, 0, true), pct(unrealisedPct, 1)],
  ];
  return (
    <div style={{ background: "#efe7da", display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 280, fontFamily: "'Newsreader', serif", color: "#241c14" }}>
      <button onClick={() => setUnit((u) => (u === "$" ? "%" : "$"))} style={{ background: todayChange >= 0 ? "#1f4d38" : "#7a2e24", color: "#f6efe4", border: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, textAlign: "left" }}>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: "0.18em", fontSize: 11 }}>TODAY</div>
        <div className="flip" key={unit} style={{ fontSize: 42, lineHeight: 1, marginTop: 10 }}>{unit === "$" ? money(todayChange, 0, true) : pct(todayPct, 2)}</div>
        <div style={{ marginTop: 10, fontSize: 16, opacity: 0.8 }}>{unit === "$" ? pct(todayPct, 2) : money(todayChange, 0, true)}</div>
        <div style={{ marginTop: 22, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em" }}>TAP TO FLIP $ / %</div>
      </button>
      <div style={{ padding: "28px 32px" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a7560" }}>The other three</div>
        {figures.map(([label, dollars, rel]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "140px 1fr auto", gap: 12, alignItems: "baseline", borderBottom: "1px solid #ddcbb6", padding: "16px 0" }}>
            <div style={{ fontSize: 22 }}>{label}</div>
            <div style={{ height: 1, background: "#ddcbb6" }} />
            <div style={{ fontSize: 28 }}>{unit === "$" ? dollars : rel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const intl = driftRows.find((d) => d.name === "Intl Equity");
const cashDrift = driftRows.find((d) => d.name === "Cash");
const unh = positions.find((p) => p.ticker === "UNH");
const nvda = movers[0];

function ppSafe(n: number) {
  const v = n * 100;
  return `${v > 0 ? "+" : "−"}${Math.abs(v).toFixed(1)} percentage points`;
}

export function D5a() {
  const [note, setNote] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const notes = [
    `${nvda.ticker} printed ${money(nvda.day, 0, true)} today, ${pct(nvda.dayPct, 2)}. Loud, not large.`,
    `International equity is ${ppSafe(intl?.drift ?? 0)} versus target. A quiet week does not close that.`,
    `${unh?.ticker} is ${money(unh?.gain ?? 0, 0, true)} versus cost and slipped another ${money(Math.abs(unh?.day ?? 0), 0)} today.`,
    `Cash is ${money(cashDrift?.gap ?? 0)} above its 5% target.`,
  ];
  return (
    <div style={{ background: "#f7f1e8", color: "#231c16", fontFamily: "'Newsreader', serif", padding: "34px 42px 28px" }}>
      <style>{`.d5a-fn{border:0;background:transparent;color:#8d3b2a;font-size:15px;padding:0 2px;vertical-align:super}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8a7568" }}>
        <span>Portfolio pulse</span><span>Friday, {investor.asOf}</span>
      </div>
      <h3 style={{ fontWeight: 500, fontSize: 36, lineHeight: 1.05, maxWidth: 700, margin: "16px 0 0" }}>Three things moved. One of them wants a decision.</h3>
      <p style={{ fontSize: 20, lineHeight: 1.45, maxWidth: 740 }}>
        Marcus — the book is higher by {money(todayChange, 0, true)} ({pct(todayPct, 2)}). The name to notice is {nvda.ticker}
        <button className="d5a-fn" onClick={() => setNote(0)}>1</button>. The thing that has not moved, and should, is the international sleeve
        <button className="d5a-fn" onClick={() => setNote(1)}>2</button>. UnitedHealth remains the sore thumb
        <button className="d5a-fn" onClick={() => setNote(2)}>3</button>. Cash is fine as dry powder and too much as a habit
        <button className="d5a-fn" onClick={() => setNote(3)}>4</button>.
      </p>
      {note != null && <div style={{ background: "#fff", borderLeft: "3px solid #8d3b2a", padding: "12px 14px", fontSize: 16, maxWidth: 720 }}><strong>Note {note + 1}. </strong>{notes[note]}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button onClick={() => setSaved(true)} style={{ background: "#231c16", color: "#f7f1e8", border: 0, padding: "8px 14px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>{saved ? "Saved to the Friday file" : "Save this note"}</button>
        <button onClick={() => setNote(null)} style={{ background: "transparent", border: "1px solid #231c16", padding: "8px 14px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>Clear footnotes</button>
      </div>
    </div>
  );
}

export function D5b() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<string | null>("act");
  const cards = [
    { id: "act", severity: "Decision", tone: "#9c3b2e", title: "International is still short", body: `${intl?.name} is ${money(Math.abs(intl?.gap ?? 0))} under target. Quiet markets do not repair a structural underweight.`, filter: "Decision" },
    { id: "watch", severity: "Watch", tone: "#b5812f", title: `${unh?.ticker} is the sore thumb`, body: `${money(unh?.gain ?? 0, 0, true)} versus cost, and another ${money(unh?.day ?? 0, 0)} today.`, filter: "Watch" },
    { id: "fyi", severity: "Note", tone: "#2f6b4f", title: "The day was NVIDIA-shaped", body: `${nvda.ticker} ${money(nvda.day, 0, true)} is a disproportionate share of ${money(todayChange, 0, true)}.`, filter: "Note" },
    { id: "cash", severity: "Decision", tone: "#9c3b2e", title: "Idle cash above target", body: `Cash is ${pct(cashTotal / totalValue, 1, false)} against 5%. Excess is about ${money(cashDrift?.gap ?? 0)}.`, filter: "Decision" },
  ];
  const shown = cards.filter((c) => filter === "All" || c.filter === filter);
  return (
    <div style={{ background: "#101418", color: "#f4f1ea", fontFamily: "'Outfit', sans-serif", padding: 22 }}>
      <style>{`.d5b-f{background:transparent;color:#c8c2b8;border:1px solid #2c333c;padding:6px 10px;margin-right:8px}.d5b-f.on{background:#f4f1ea;color:#101418}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>What deserves attention</div>
        <div>{["All", "Decision", "Watch", "Note"].map((f) => <button key={f} className={`d5b-f ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
      </div>
      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        {shown.map((c) => (
          <button key={c.id} onClick={() => setOpen(open === c.id ? null : c.id)} style={{ textAlign: "left", background: "#1a212b", color: "inherit", border: 0, borderLeft: `4px solid ${c.tone}`, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: c.tone }}><span>{c.severity}</span><span>{open === c.id ? "Close" : "Open"}</span></div>
            <div style={{ fontSize: 20, marginTop: 6 }}>{c.title}</div>
            {open === c.id && <p style={{ margin: "8px 0 0", color: "#d9d3c9", lineHeight: 1.45, fontSize: 15 }}>{c.body}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

export function D5c() {
  const [only, setOnly] = useState(false);
  const events = [...movers].slice(0, 8).map((m, n) => ({ t: ["09:41", "10:12", "10:42", "11:18", "13:05", "14:22", "15:10", "15:51"][n], ...m }));
  const rows = only ? events.filter((e) => Math.abs(e.day) > 400) : events;
  return (
    <div style={{ background: "#fff", color: "#142033", fontFamily: "'IBM Plex Sans', sans-serif", padding: "20px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7d8ba0" }}>Since yesterday's close</div>
          <div style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 28 }}>The session, in order of consequence</div>
        </div>
        <button onClick={() => setOnly((v) => !v)} style={{ border: "1px solid #142033", background: only ? "#142033" : "#fff", color: only ? "#fff" : "#142033", padding: "8px 12px", fontSize: 13 }}>{only ? "Showing moves over $400" : "Hide anything under $400"}</button>
      </div>
      <div style={{ marginTop: 14 }}>
        {rows.map((e, n) => (
          <div key={e.ticker} style={{ display: "grid", gridTemplateColumns: "70px 16px 90px 1fr 120px", gap: 10, alignItems: "center", padding: "8px 0", borderTop: "1px solid #e7edf3" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#7d8ba0" }}>{e.t}</span>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: n === 0 ? "#c4552a" : "#c5d0dc" }} />
            <strong>{e.ticker}</strong>
            <span style={{ color: "#4d5b70" }}>{e.name}</span>
            <span style={{ textAlign: "right", color: e.day >= 0 ? "#1f7a4d" : "#a33b2b" }}>{money(e.day, 0, true)}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#7d8ba0" }}>Net of the whole book: {money(todayChange, 0, true)}.</div>
    </div>
  );
}

export function D6a() {
  const [mode, setMode] = useState<"value" | "return" | "drawdown">("value");
  const [i, setI] = useState<number | null>(null);
  const values = monthly.map((p) => p.value);
  const ret = values.map((v) => v / values[0] - 1);
  const dd = drawdownSeries(values);
  const series = mode === "value" ? values : mode === "return" ? ret : dd;
  const min = mode === "drawdown" ? Math.min(...dd, -0.02) : mode === "return" ? Math.min(...ret, 0) : undefined;
  const max = mode === "drawdown" ? 0.002 : undefined;
  const pts = scale(series, 1040, 300, 24, min, max);
  const idx = i ?? series.length - 1;
  const color = mode === "drawdown" ? "#9c3b2e" : "#1d4e89";
  const zero = mode === "value" ? null : scale([0], 1040, 300, 24, min, max)[0].y;
  return (
    <div style={{ background: "#f7f8fa", color: "#172033", fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
      <style>{`.d6a-m{border:0;background:transparent;padding:8px 14px;font-size:14px;color:#6b7280}.d6a-m.on{background:#172033;color:#fff}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", background: "#fff", border: "1px solid #e5e7eb" }}>
          {(["value", "return", "drawdown"] as const).map((m) => (
            <button key={m} className={`d6a-m ${mode === m ? "on" : ""}`} onClick={() => setMode(m)}>{m === "value" ? "Total value" : m === "return" ? "Percentage return" : "Drawdown"}</button>
          ))}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{monthly[idx].label}</div>
          <div style={{ fontSize: 22 }}>{mode === "value" ? money(series[idx]) : pct(series[idx], 1)}</div>
        </div>
      </div>
      <svg viewBox="0 0 1040 300" width="100%" height="300" style={{ marginTop: 12, cursor: "crosshair" }} onMouseMove={(e) => setI(indexAt(e.clientX, e.currentTarget.getBoundingClientRect(), series.length))} onMouseLeave={() => setI(null)}>
        {zero != null && <line x1="24" x2="1016" y1={zero} y2={zero} stroke="#c5c9d1" />}
        <path d={area(pts, zero ?? 276)} fill={color} opacity="0.15" />
        <path d={line(pts)} fill="none" stroke={color} strokeWidth="2" />
        {i != null && <line x1={pts[i].x} x2={pts[i].x} y1="16" y2="284" stroke="#172033" strokeDasharray="2 3" />}
      </svg>
      <div style={{ display: "flex", gap: 22, fontSize: 13, color: "#4b5563" }}>
        <span>Max drawdown {pct(maxDrawdown, 1)}</span>
        <span>Now {pct(currentDrawdown, 1)} from the high</span>
        <span>Peak {money(peakValue)}</span>
      </div>
    </div>
  );
}

export function D6b() {
  const [mode, setMode] = useState<"value" | "return" | "drawdown">("return");
  const [i, setI] = useState(monthly.length - 1);
  const values = monthly.map((p) => p.value);
  const sets = { value: values, return: values.map((v) => v / values[0] - 1), drawdown: drawdownSeries(values) };
  const main = sets[mode];
  const pts = scale(main, 1040, 250, 16, mode === "drawdown" ? Math.min(...sets.drawdown) : undefined, mode === "drawdown" ? 0 : undefined);
  return (
    <div style={{ background: "#fffdf8", color: "#1c1915", fontFamily: "'Literata', serif", padding: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {(["value", "return", "drawdown"] as const).map((m) => {
          const s = sets[m];
          const mini = scale(s, 300, 64, 4, m === "drawdown" ? Math.min(...s) : undefined, m === "drawdown" ? 0 : undefined);
          const on = mode === m;
          return (
            <button key={m} onClick={() => setMode(m)} style={{ textAlign: "left", border: on ? "1px solid #1c1915" : "1px solid #eadfce", background: on ? "#1c1915" : "#fff", color: on ? "#fffdf8" : "#1c1915", padding: 8 }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>{m}</div>
              <svg viewBox="0 0 300 64" width="100%" height="64"><path d={line(mini)} fill="none" stroke={on ? "#f0c36a" : "#1c1915"} strokeWidth="1.6" /></svg>
              <div style={{ fontSize: 13 }}>{m === "value" ? money(s[i]) : pct(s[i], 1)}</div>
            </button>
          );
        })}
      </div>
      <svg viewBox="0 0 1040 250" width="100%" height="240" style={{ marginTop: 12 }} onMouseMove={(e) => setI(indexAt(e.clientX, e.currentTarget.getBoundingClientRect(), monthly.length))}>
        <path d={area(pts, 234)} fill="rgba(28,25,21,0.06)" />
        <path d={line(pts)} fill="none" stroke="#1c1915" strokeWidth="2" />
        <line x1={pts[i].x} x2={pts[i].x} y1="8" y2="242" stroke="#9c3b2e" />
        <circle cx={pts[i].x} cy={pts[i].y} r="4" fill="#9c3b2e" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
        <span>Scrub is shared · {monthly[i].label}</span>
        <span>Value {money(sets.value[i])} · Return {pct(sets.return[i])} · Drawdown {pct(sets.drawdown[i])}</span>
      </div>
    </div>
  );
}

export function D6c() {
  const [mode, setMode] = useState<"value" | "return" | "drawdown">("drawdown");
  const [ghost, setGhost] = useState(true);
  const values = monthly.map((p) => p.value);
  const ret = values.map((v) => v / values[0] - 1);
  const spx = monthly.map((p) => p.spx / monthly[0].spx - 1);
  const dd = drawdownSeries(values);
  const copy = {
    value: "Total value. Dollars, so contributions lift the line as surely as markets do.",
    return: "Percentage return from the first point in view. The ghost is the S&P 500 over the same span.",
    drawdown: "Drawdown. Bars hang from the high-water mark. Gold marks the worst month.",
  }[mode];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", background: "#14281f", color: "#e7f2ea", minHeight: 380, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`.d6c-b{display:block;width:100%;text-align:left;background:transparent;color:#e7f2ea;border:0;border-bottom:1px solid #234536;padding:16px 18px}.d6c-b.on{background:#e7f2ea;color:#14281f}`}</style>
      <div>
        {(["value", "return", "drawdown"] as const).map((m) => (
          <button key={m} className={`d6c-b ${mode === m ? "on" : ""}`} onClick={() => setMode(m)}>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>{m}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, marginTop: 4 }}>{m === "value" ? money(totalValue) : m === "return" ? pct(ret[ret.length - 1]) : pct(dd[dd.length - 1])}</div>
          </button>
        ))}
      </div>
      <div style={{ padding: 18 }}>
        <p style={{ margin: 0, maxWidth: 560 }}>{copy}</p>
        {mode === "return" && <button onClick={() => setGhost((v) => !v)} style={{ marginTop: 8, background: "transparent", color: "#e7f2ea", border: "1px solid #3e6b54", padding: "6px 10px" }}>{ghost ? "Hide S&P ghost" : "Show S&P ghost"}</button>}
        <ModeChart mode={mode} values={values} ret={ret} spx={spx} dd={dd} ghost={ghost} />
      </div>
    </div>
  );
}

function ModeChart({ mode, values, ret, spx, dd, ghost }: { mode: "value" | "return" | "drawdown"; values: number[]; ret: number[]; spx: number[]; dd: number[]; ghost: boolean }) {
  if (mode === "drawdown") {
    const min = Math.min(...dd);
    return (
      <svg viewBox="0 0 760 240" width="100%" height="240">
        {dd.map((v, i) => {
          const x = 8 + (i / (dd.length - 1)) * 740;
          return <rect key={i} x={x} y={16} width="7" height={Math.max(1, (v / min) * 200)} fill={v === min ? "#f0c36a" : "#8fd0a8"} />;
        })}
      </svg>
    );
  }
  const lo = Math.min(...ret, ...spx);
  const hi = Math.max(...ret, ...spx);
  const draw = mode === "return" ? scale(ret, 760, 240, 12, lo, hi) : scale(values, 760, 240, 12);
  const ghostPts = scale(spx, 760, 240, 12, lo, hi);
  return (
    <svg viewBox="0 0 760 240" width="100%" height="240">
      {mode === "value" && <path d={area(draw, 228)} fill="rgba(143,208,168,0.2)" />}
      {mode === "return" && ghost && <path d={line(ghostPts)} fill="none" stroke="#f0c36a" strokeWidth="1.4" strokeDasharray="4 3" />}
      <path d={line(draw)} fill="none" stroke="#e7f2ea" strokeWidth="2" />
    </svg>
  );
}
