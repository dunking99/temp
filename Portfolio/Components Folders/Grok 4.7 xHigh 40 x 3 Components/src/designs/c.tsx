import { useState } from "react";
import {
  expenseDrag,
  forwardIncome,
  forwardYield,
  fxTable,
  incomeCalendar,
  investor,
  returnRows,
  venues,
  yieldOnCost,
} from "../data";
import { money, pct } from "../lib";

const benchOf = (id: string, row: (typeof returnRows)[number]) => (id === "spx" ? row.spx : id === "acwi" ? row.acwi : id === "agg" ? row.agg : row.b6040);

export function D7a() {
  const [period, setPeriod] = useState("Since Mar 2021");
  const [bench, setBench] = useState("spx");
  const [why, setWhy] = useState(false);
  const row = returnRows.find((r) => r.period === period) ?? returnRows[6];
  const b = benchOf(bench, row);
  return (
    <div style={{ background: "#f4efe6", color: "#1c1712", fontFamily: "'Fraunces', serif", padding: "28px 32px" }}>
      <style>{`.d7a-p{border:0;background:transparent;border-bottom:1px solid transparent;margin-right:12px;padding:4px 0;color:#8a7d6b;font-family:'IBM Plex Sans',sans-serif;font-size:12px}.d7a-p.on{color:#1c1712;border-bottom-color:#1c1712}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>{returnRows.map((r) => <button key={r.period} className={`d7a-p ${period === r.period ? "on" : ""}`} onClick={() => setPeriod(r.period)}>{r.period}</button>)}</div>
        <select value={bench} onChange={(e) => setBench(e.target.value)} style={{ background: "transparent", border: "1px solid #1c1712", padding: "6px 8px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          <option value="spx">S&P 500</option>
          <option value="acwi">MSCI ACWI</option>
          <option value="b6040">60/40</option>
          <option value="agg">US Aggregate</option>
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 22 }}>
        {[["Money-weighted", row.mwr, "Sensitive to when cash arrived"], ["Time-weighted", row.twr, "The portfolio's own pace"]].map(([label, value, note]) => {
          const n = Number(value);
          const left = Math.min(n, b);
          const right = Math.max(n, b);
          return (
            <div key={String(label)}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 72, lineHeight: 0.9, marginTop: 6 }}>{pct(n, 1)}</div>
              <div style={{ position: "relative", height: 28, marginTop: 12 }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 12, height: 2, background: "#ddd2c2" }} />
                <div style={{ position: "absolute", left: `${(left / (right * 1.35 || 1)) * 100}%`, width: `${((right - left) / (right * 1.35 || 1)) * 100}%`, top: 10, height: 6, background: "#c4552a" }} />
                <div style={{ position: "absolute", left: `${(b / (Math.max(n, b) * 1.35 || 1)) * 100}%`, top: 6, width: 2, height: 16, background: "#1c1712" }} />
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#6f6558" }}>{note} · benchmark {pct(b, 1)} · excess {pct(n - b, 1)}</div>
            </div>
          );
        })}
      </div>
      <button onClick={() => setWhy((v) => !v)} style={{ marginTop: 16, background: "transparent", border: 0, color: "#8d3b2a", fontFamily: "'IBM Plex Sans', sans-serif", padding: 0 }}>
        {why ? "Hide the difference" : "Why these two numbers disagree"}
      </button>
      {why && <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, maxWidth: 680, lineHeight: 1.5 }}>Money-weighted return cares that larger contributions arrived after the 2022 drawdown. Time-weighted return ignores the size of those deposits and only chains the portfolio's monthly results. The S&P beat both, mostly in 2023–24 mega-cap years this book only partly owned.</p>}
    </div>
  );
}

export function D7b() {
  const [bench, setBench] = useState<"spx" | "acwi" | "b6040" | "agg">("spx");
  const [sort, setSort] = useState<"excess" | "period">("excess");
  const [open, setOpen] = useState<string | null>(null);
  const rows = [...returnRows].sort((a, b) => (sort === "period" ? 0 : benchOf(bench, b) - b.twr - (benchOf(bench, a) - a.twr)));
  return (
    <div style={{ background: "#0f1412", color: "#e7efe9", fontFamily: "'IBM Plex Sans', sans-serif", padding: 18 }}>
      <style>{`.d7b-th{background:transparent;color:#9fb0a6;border:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;padding:8px;text-align:right}.d7b-row{display:grid;grid-template-columns:160px repeat(4,1fr);width:100%;background:transparent;color:inherit;border:0;border-top:1px solid #24302b;padding:0;text-align:left}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22 }}>Returns, three ways</div>
        <div>
          {(["spx", "acwi", "b6040", "agg"] as const).map((b) => (
            <button key={b} onClick={() => setBench(b)} style={{ marginLeft: 6, background: bench === b ? "#e7efe9" : "transparent", color: bench === b ? "#0f1412" : "#e7efe9", border: "1px solid #345046", padding: "4px 8px" }}>{b.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "160px repeat(4, 1fr)", marginTop: 12 }}>
        <button className="d7b-th" style={{ textAlign: "left" }} onClick={() => setSort("period")}>Period</button>
        {["MWR", "TWR", "Benchmark", "Excess"].map((h) => <button key={h} className="d7b-th" onClick={() => setSort("excess")}>{h}</button>)}
      </div>
      {rows.map((r) => {
        const b = benchOf(bench, r);
        const excess = r.twr - b;
        return (
          <div key={r.period}>
            <button className="d7b-row" onClick={() => setOpen(open === r.period ? null : r.period)}>
              <span style={{ padding: 10 }}>{r.period}</span>
              <span style={{ padding: 10, textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{pct(r.mwr, 1)}</span>
              <span style={{ padding: 10, textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{pct(r.twr, 1)}</span>
              <span style={{ padding: 10, textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{pct(b, 1)}</span>
              <span style={{ padding: 10, textAlign: "right", color: excess >= 0 ? "#9dffa8" : "#ffb4a8", fontFamily: "'IBM Plex Mono', monospace" }}>{pct(excess, 1)}</span>
            </button>
            {open === r.period && <div style={{ padding: "4px 10px 12px", color: "#9fb0a6", fontSize: 13 }}>MWR {pct(r.mwr - b, 1)} versus this benchmark. The gap is widest where US mega-caps ran and this book held bonds, gold and international equity.</div>}
          </div>
        );
      })}
    </div>
  );
}

export function D7c() {
  const [focus, setFocus] = useState<"mwr" | "twr">("mwr");
  const stems = [8, 14, 22, 28, 36, 44, 52, 60, 70, 78, 86];
  const row = returnRows[6];
  return (
    <div style={{ background: "#fff", color: "#161616", fontFamily: "'Outfit', sans-serif", display: "grid", gridTemplateColumns: "1.1fr 0.9fr" }}>
      <div style={{ padding: 24, background: focus === "mwr" ? "#fff6ee" : "#f3f7f4" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.14em" }}>CASH ARRIVING</div>
        <svg viewBox="0 0 520 180" width="100%" height="180">
          <line x1="16" x2="500" y1="120" y2="120" stroke="#161616" />
          {stems.map((x, n) => (
            <g key={x} opacity={focus === "mwr" ? 1 : 0.35}>
              <line x1={20 + x * 5} x2={20 + x * 5} y1={120 - (12 + (n % 4) * 16)} y2="120" stroke="#c4552a" strokeWidth="3" />
              <circle cx={20 + x * 5} cy={120 - (12 + (n % 4) * 16)} r="3" fill="#c4552a" />
            </g>
          ))}
          <text x="16" y="148" fontSize="12" fill="#666">Mar 2021</text>
          <text x="430" y="148" fontSize="12" fill="#666">Mar 2026</text>
        </svg>
        <p style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 460 }}>{focus === "mwr" ? "Larger deposits after the bear market pull the money-weighted number up. The stems are contributions. Taller means more cash that month." : "Time-weighted return chains each month's result and pretends every month had the same weight. The stems fade because deposit size is ignored."}</p>
      </div>
      <div style={{ padding: 24 }}>
        <button onClick={() => setFocus("mwr")} style={{ display: "block", width: "100%", textAlign: "left", border: 0, borderBottom: "1px solid #eee", background: focus === "mwr" ? "#fff6ee" : "#fff", padding: "14px 8px" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.12em" }}>MONEY-WEIGHTED</div>
          <div style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 48 }}>{pct(row.mwr, 1)}</div>
        </button>
        <button onClick={() => setFocus("twr")} style={{ display: "block", width: "100%", textAlign: "left", border: 0, background: focus === "twr" ? "#f3f7f4" : "#fff", padding: "14px 8px" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.12em" }}>TIME-WEIGHTED</div>
          <div style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 48 }}>{pct(row.twr, 1)}</div>
        </button>
        <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>S&P 500 over the same life: {pct(row.spx, 1)}. 60/40: {pct(row.b6040, 1)}.</div>
      </div>
    </div>
  );
}

export function D8a() {
  const [net, setNet] = useState(false);
  const fwd = net ? forwardYield - expenseDrag : forwardYield;
  const yoc = net ? yieldOnCost - expenseDrag : yieldOnCost;
  const income = net ? forwardIncome - expenseDrag * (forwardIncome / forwardYield) : forwardIncome;
  return (
    <div style={{ background: "#1b1714", color: "#f6efe6", fontFamily: "'Cormorant Garamond', serif", padding: "26px 28px", display: "grid", gridTemplateColumns: "1fr 1fr 220px", gap: 12 }}>
      <Gauge label="Forward yield" value={fwd} note="On today's market value" />
      <Gauge label="Yield on cost" value={yoc} note="On what the lots cost" />
      <div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em" }}>EXPECTED INCOME</div>
        <div className="flip" key={String(net)} style={{ fontSize: 42, lineHeight: 1, marginTop: 8 }}>{money(income)}</div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#cbbba6", marginTop: 8 }}>Next twelve months, dividends plus cash interest.</div>
        <button onClick={() => setNet((v) => !v)} style={{ marginTop: 18, background: "transparent", color: "#f6efe6", border: "1px solid #c6a56a", padding: "8px 10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}>{net ? "Net of fund expenses" : "Show after fund expenses"}</button>
      </div>
    </div>
  );
}

function Gauge({ label, value, note }: { label: string; value: number; note: string }) {
  const t = Math.min(1, value / 0.05);
  return (
    <div>
      <svg viewBox="0 0 220 130" width="100%" height="140">
        <path d="M24 108 A86 86 0 0 1 196 108" fill="none" stroke="#3a322b" strokeWidth="14" strokeLinecap="round" />
        <path d="M24 108 A86 86 0 0 1 196 108" fill="none" stroke="#c6a56a" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${t * 270} 280`} />
        <text x="110" y="96" textAnchor="middle" fill="#f6efe6" fontSize="32" fontFamily="Cormorant Garamond">{pct(value, 2, false)}</text>
      </svg>
      <div style={{ textAlign: "center", marginTop: -8 }}>
        <div style={{ fontSize: 24 }}>{label}</div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#cbbba6" }}>{note}</div>
      </div>
    </div>
  );
}

export function D8b() {
  const [i, setI] = useState(2);
  const [cash, setCash] = useState(true);
  const max = Math.max(...incomeCalendar.map((m) => m.amt));
  const month = incomeCalendar[i];
  return (
    <div style={{ background: "#f3f6f4", color: "#163028", fontFamily: "'Public Sans', sans-serif", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5f7d72" }}>Income calendar</div>
          <div style={{ display: "flex", gap: 28, marginTop: 6 }}>
            <div><b style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>{pct(forwardYield, 2, false)}</b><div style={{ fontSize: 12 }}>Forward</div></div>
            <div><b style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>{pct(yieldOnCost, 2, false)}</b><div style={{ fontSize: 12 }}>On cost</div></div>
          </div>
        </div>
        <button onClick={() => setCash((v) => !v)} style={{ border: "1px solid #163028", background: cash ? "#163028" : "transparent", color: cash ? "#f3f6f4" : "#163028", padding: "8px 10px" }}>{cash ? "Cash interest included" : "Dividends only"}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 8, alignItems: "end", height: 180, marginTop: 18 }}>
        {incomeCalendar.map((m, n) => {
          const h = Math.max(8, ((cash ? m.amt : m.amt * 0.82) / max) * 150);
          return (
            <button key={m.label + m.year} onClick={() => setI(n)} style={{ border: 0, background: "transparent", color: "inherit", padding: 0 }}>
              <div style={{ height: h, background: n === i ? "#0f6e56" : m.quarter ? "#8fb9a8" : "#d5e4dc" }} />
              <div style={{ fontSize: 11, marginTop: 6 }}>{m.label}</div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 12, background: "#fff", padding: "12px 14px", display: "flex", justifyContent: "space-between" }}>
        <div><strong>{month.label} {month.year}</strong> · {money(cash ? month.amt : month.amt * 0.82)}</div>
        <div style={{ fontSize: 13, color: "#5f7d72" }}>{month.payers.join(" · ")}</div>
      </div>
    </div>
  );
}

export function D8c() {
  const [step, setStep] = useState(1);
  const steps = [
    { t: "Yield on cost", v: yieldOnCost, d: "Expected income divided by what the positions cost, cash included at par." },
    { t: "Prices rose", v: yieldOnCost - forwardYield, d: "The same income now sits on a larger market value, so the yield compresses." },
    { t: "Forward yield", v: forwardYield, d: "Expected income divided by today's market value. This is what a new buyer would earn." },
  ];
  return (
    <div style={{ background: "#fff8f3", color: "#2a211c", fontFamily: "'Literata', serif", padding: "28px 32px" }}>
      <div style={{ fontSize: 28 }}>From the yield you locked in, to the yield the market offers now.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr 80px 1fr", gap: 8, alignItems: "center", marginTop: 22 }}>
        <BridgeCard on={step === 0} onClick={() => setStep(0)} title={steps[0].t} value={pct(steps[0].v, 2, false)} />
        <div style={{ textAlign: "center", fontSize: 28, color: "#b54a32" }}>−</div>
        <BridgeCard on={step === 1} onClick={() => setStep(1)} title="Price gap" value={pct(steps[1].v, 2, false)} />
        <div style={{ textAlign: "center", fontSize: 28 }}>=</div>
        <BridgeCard on={step === 2} onClick={() => setStep(2)} title={steps[2].t} value={pct(steps[2].v, 2, false)} />
      </div>
      <p style={{ fontSize: 18, lineHeight: 1.45, marginTop: 18 }}>{steps[step].d} Income in view: {money(forwardIncome)}.</p>
    </div>
  );
}

function BridgeCard({ title, value, on, onClick }: { title: string; value: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ textAlign: "left", border: on ? "1px solid #2a211c" : "1px solid #ecdcd0", background: on ? "#2a211c" : "#fff", color: on ? "#fff8f3" : "#2a211c", padding: 16 }}>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>{title}</div>
      <div style={{ fontSize: 36, marginTop: 8 }}>{value}</div>
    </button>
  );
}

export function D9a() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#f7f7f5", fontFamily: "'IBM Plex Sans', sans-serif", color: "#3d3d3d" }}>
      <div style={{ height: 72, background: "linear-gradient(#eceae4, #f7f7f5)", borderBottom: "1px solid #e4e1da" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", fontSize: 12 }}>
        <span>Prices as of {investor.asOfStamp} · {investor.delay} delayed · US composite</span>
        <button onClick={() => setOpen((v) => !v)} style={{ background: "transparent", border: 0, color: "#1d4e89", padding: 0 }}>FX rates used {open ? "▴" : "▾"}</button>
      </div>
      {open && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: "0 16px 14px" }}>
          {fxTable.map((f) => (
            <div key={f.pair} style={{ background: "#fff", border: "1px solid #e4e1da", padding: "8px 10px" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{f.pair} {f.rate}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{f.side} · {f.source} · 16:28 GMT</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function D9b() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#f3ead7", padding: 28, display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, alignItems: "center", fontFamily: "'Source Serif 4', serif" }}>
      <button onClick={() => setOpen((v) => !v)} style={{ width: 150, height: 150, borderRadius: "50%", border: "2px dashed #8a6232", background: "transparent", color: "#5c3b16", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-8deg)" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.14em" }}>DATA AS OF</span>
        <span style={{ fontSize: 18, marginTop: 4 }}>14 MAR 26</span>
        <span style={{ fontSize: 12 }}>16:42 ET</span>
      </button>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#3e3428" }}>
        <div style={{ fontSize: 18 }}>Listed prices are the US composite, fifteen minutes delayed. Currency exposure is look-through, not the trading currency.</div>
        <button onClick={() => setOpen((v) => !v)} style={{ marginTop: 10, background: "#5c3b16", color: "#f3ead7", border: 0, padding: "8px 12px" }}>{open ? "Hide venues" : "Which venues"}</button>
        {open && (
          <div style={{ marginTop: 12 }}>
            {venues.map((v) => (
              <div key={v.name} style={{ display: "grid", gridTemplateColumns: "100px 140px 1fr", gap: 8, fontSize: 13, padding: "4px 0", borderTop: "1px solid #e0d2b8" }}>
                <b>{v.name}</b><span>{v.state}</span><span>{v.note}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function D9c() {
  const [venue, setVenue] = useState(venues[0].name);
  const v = venues.find((x) => x.name === venue) ?? venues[0];
  return (
    <div style={{ background: "#070b0a", color: "#c8f5c4", fontFamily: "'JetBrains Mono', monospace", padding: 16 }}>
      <div style={{ fontSize: 12, color: "#6fbf78" }}>FRESHNESS // HALE // {investor.asOfStamp}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
        {venues.map((item) => (
          <button key={item.name} onClick={() => setVenue(item.name)} style={{ textAlign: "left", background: venue === item.name ? "#10241a" : "transparent", color: "#c8f5c4", border: "1px solid #1e4634", padding: 10 }}>
            <div>{item.name}</div>
            <div style={{ color: item.state === "Closed" ? "#e6c07b" : "#8dff9a", fontSize: 12, marginTop: 6 }}>{item.lag}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6 }}>
        {v.name} · {v.detail} · last {v.last} · {v.state}
        <br />
        {v.note}. FX translation uses WM/Refinitiv mid, not the exchange's own close.
      </div>
    </div>
  );
}
