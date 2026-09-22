import { useMemo, useState } from "react";
import {
  accounts,
  benchmarks,
  daily,
  dayStats,
  investor,
  intraday,
  monthly,
  movers,
  positions,
  seriesFor,
  todayChange,
  todayPct,
  totalValue,
  windowReturn,
  type SeriesPoint,
} from "../data";
import { area, compact, indexAt, line, money, pct, scale, type Pt } from "../lib";

const illiquid = positions.filter((p) => p.ticker === "IBIT" || p.ticker === "DBMF").reduce((s, p) => s + p.mv, 0);

function between(upper: Pt[], lower: Pt[]) {
  if (!upper.length) return "";
  const back = [...lower].reverse();
  return `${line(upper)} ${back.map((p) => `L${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ")} Z`;
}

export function D1a() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState<number | null>(null);
  const w = 1000;
  const h = 168;
  const pts = scale(
    intraday.map((p) => p.value),
    w,
    h,
    10,
  );
  const active = i ?? intraday.length - 1;
  const shown = intraday[active].value;
  const chg = shown - dayStats.open;
  const up = todayChange >= 0;
  const span = dayStats.high - dayStats.low || 1;
  const mark = (v: number) => ((v - dayStats.low) / span) * 100;

  return (
    <div style={{ background: "#f3efe6", color: "#1c1712", fontFamily: "'Public Sans', sans-serif", padding: "36px 40px 32px" }}>
      <style>{`
        .d1a-pill:hover { background:#1c1712; color:#f3efe6; }
        .d1a-pill:hover span { color:#f3efe6 !important; }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", letterSpacing: "0.16em", fontSize: 11, textTransform: "uppercase", color: "#8a7d6b" }}>
        <span>Hale household · Portfolio value</span>
        <span>
          {accounts.length} accounts · {positions.length} positions
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 18 }}>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, lineHeight: 1, marginTop: 14, color: "#8a7d6b" }}>$</span>
        <div key={open ? shown.toFixed(0) : "closed"} className={open ? "flip" : undefined} style={{ fontFamily: "'Instrument Serif', serif", fontSize: 92, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
          {money(open && i != null ? shown : totalValue).replace("$", "")}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
        <button
          className="d1a-pill"
          onClick={() => setOpen((v) => !v)}
          style={{
            border: "1px solid #1c1712",
            background: open ? "#1c1712" : "transparent",
            color: open ? "#f3efe6" : "#1c1712",
            borderRadius: 999,
            padding: "8px 14px",
            display: "flex",
            gap: 10,
            alignItems: "center",
            fontSize: 14,
          }}
        >
          <span style={{ color: open ? "#f3efe6" : up ? "#1f7a4d" : "#a33b2b" }}>{up ? "▲" : "▼"}</span>
          <span>{money(todayChange, 0, true)} today</span>
          <span style={{ opacity: 0.7 }}>{pct(todayPct, 2)}</span>
          <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{open ? "Hide session" : "Session"}</span>
        </button>
        <svg width="148" height="36" viewBox="0 0 148 36" aria-hidden>
          <path d={line(scale(intraday.map((p) => p.value), 148, 36, 2))} fill="none" stroke={up ? "#1f7a4d" : "#a33b2b"} strokeWidth="1.6" />
        </svg>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#8a7d6b" }}>{investor.asOfStamp} · {investor.delay} delayed</span>
      </div>
      {open && (
        <div style={{ marginTop: 22, animation: "meridian-in 0.35s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6f6558", marginBottom: 6 }}>
            <span>{intraday[active].label} ET</span>
            <span>
              {money(shown, 0)} · {money(chg, 0, true)} from the open
            </span>
          </div>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            width="100%"
            height="168"
            onMouseMove={(e) => setI(indexAt(e.clientX, e.currentTarget.getBoundingClientRect(), intraday.length))}
            onMouseLeave={() => setI(null)}
            style={{ display: "block", cursor: "crosshair" }}
          >
            <path d={area(pts, h - 10)} fill={up ? "rgba(31,122,77,0.12)" : "rgba(163,59,43,0.12)"} />
            <path d={line(pts)} fill="none" stroke="#1c1712" strokeWidth="1.8" />
            {i != null && (
              <>
                <line x1={pts[i].x} x2={pts[i].x} y1={8} y2={h - 8} stroke="#1c1712" strokeDasharray="2 3" strokeWidth="1" />
                <circle cx={pts[i].x} cy={pts[i].y} r="4" fill="#c2412d" />
              </>
            )}
          </svg>
        </div>
      )}
      <div style={{ marginTop: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8a7d6b" }}>
          <span>Session range</span>
          <span>
            {money(dayStats.low)} – {money(dayStats.high)}
          </span>
        </div>
        <div style={{ position: "relative", height: 28, marginTop: 8 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 12, height: 1, background: "#cfc4b2" }} />
          {[
            ["Low", dayStats.low],
            ["Open", dayStats.open],
            ["Now", dayStats.last],
            ["High", dayStats.high],
          ].map(([label, v]) => (
            <div key={String(label)} style={{ position: "absolute", left: `${mark(Number(v))}%`, top: 0, transform: "translateX(-50%)", textAlign: "center" }}>
              <div style={{ width: label === "Now" ? 9 : 1, height: label === "Now" ? 9 : 14, margin: "6px auto 0", background: label === "Now" ? "#c2412d" : "#1c1712", borderRadius: label === "Now" ? 99 : 0 }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6f6558" }}>
          <span>Low {money(dayStats.low)}</span>
          <span>Open {money(dayStats.open)}</span>
          <span>High {money(dayStats.high)}</span>
        </div>
      </div>
    </div>
  );
}

export function D1b() {
  const [pin, setPin] = useState(movers[0].ticker);
  const pinned = movers.find((m) => m.ticker === pin) ?? movers[0];
  const span = dayStats.high - dayStats.low || 1;
  const y = (v: number) => 18 + ((dayStats.high - v) / span) * 150;
  const share = todayChange ? pinned.day / todayChange : 0;

  return (
    <div style={{ background: "#0e0f0c", color: "#e6d7b0", fontFamily: "'IBM Plex Mono', monospace", padding: "22px 22px 18px" }}>
      <style>{`
        .d1b-row { width:100%; text-align:left; background:transparent; color:inherit; border:0; border-top:1px solid #2a291f; padding:7px 0; display:grid; grid-template-columns: 72px 1fr 110px 90px; gap:8px; font-size:12px; }
        .d1b-row:hover { color:#fff4cf; background:#17180f; }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, letterSpacing: "0.14em", color: "#8d845c" }}>
        <span>MERIDIAN/HALE</span>
        <span>14MAR26</span>
        <span>16:42ET</span>
        <span>DELAYED 15M</span>
        <span style={{ color: "#d6ff67" }}>LIVE TAPE</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 28, marginTop: 18 }}>
        <div>
          <div style={{ fontSize: 11, color: "#8d845c" }}>MKT VALUE USD</div>
          <div style={{ fontSize: 68, lineHeight: 0.95, color: "#f0c36a", letterSpacing: "-0.04em", marginTop: 6 }}>
            {money(totalValue, 2).replace("$", "")}
            <span style={{ display: "inline-block", width: 12, height: 44, background: "#f0c36a", marginLeft: 8, animation: "meridian-pulse 1.2s infinite", verticalAlign: "middle" }} />
          </div>
          <div style={{ marginTop: 12, fontSize: 18, color: todayChange >= 0 ? "#c6f56a" : "#ff7a68" }}>
            {todayChange >= 0 ? "+" : "−"}
            {money(Math.abs(todayChange), 2).replace("$", "")} {pct(todayPct, 2)} DAY
          </div>
          <div style={{ marginTop: 22, fontSize: 11, color: "#8d845c" }}>CONTRIBUTORS — CLICK TO PIN</div>
          <div>
            {movers.slice(0, 6).map((m) => (
              <button key={m.ticker} className="d1b-row" onClick={() => setPin(m.ticker)} style={{ color: pin === m.ticker ? "#f0c36a" : undefined }}>
                <span>{m.ticker}</span>
                <span style={{ color: "#8d845c" }}>{m.name.split(" ").slice(0, 2).join(" ")}</span>
                <span style={{ textAlign: "right", color: m.day >= 0 ? "#c6f56a" : "#ff7a68" }}>{money(m.day, 0, true)}</span>
                <span style={{ textAlign: "right" }}>{pct(m.dayPct, 2)}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#8d845c", marginBottom: 8 }}>DAY RANGE</div>
          <svg viewBox="0 0 160 200" width="100%" height="210">
            <line x1="78" x2="78" y1={y(dayStats.high)} y2={y(dayStats.low)} stroke="#3c3a2a" strokeWidth="6" />
            <line x1="78" x2="78" y1={y(dayStats.open)} y2={y(dayStats.last)} stroke="#f0c36a" strokeWidth="6" />
            <circle cx="78" cy={y(dayStats.last)} r="5" fill="#d6ff67" />
            <text x="96" y={y(dayStats.high) + 4} fill="#8d845c" fontSize="10">
              H {compact(dayStats.high)}
            </text>
            <text x="96" y={y(dayStats.open) + 4} fill="#e6d7b0" fontSize="10">
              O {compact(dayStats.open)}
            </text>
            <text x="96" y={y(dayStats.last) + 4} fill="#d6ff67" fontSize="10">
              N {compact(dayStats.last)}
            </text>
            <text x="96" y={y(dayStats.low) + 4} fill="#8d845c" fontSize="10">
              L {compact(dayStats.low)}
            </text>
          </svg>
        </div>
      </div>
      <div style={{ marginTop: 8, borderTop: "1px solid #2a291f", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <span>
          PINNED {pinned.ticker} added {money(pinned.day, 0, true)} · {pct(share, 0)} of today's move
        </span>
        <span style={{ color: "#8d845c" }}>OPEN {money(dayStats.open, 0)}</span>
      </div>
    </div>
  );
}

export function D1c() {
  const [mode, setMode] = useState<"market" | "liquid">("market");
  const liquid = totalValue - illiquid;
  const value = mode === "market" ? totalValue : liquid;
  const span = dayStats.high - dayStats.low || 1;
  const t = (dayStats.last - dayStats.low) / span;
  const start = -210;
  const sweep = 240;
  const angle = start + t * sweep;
  const rad = (angle * Math.PI) / 180;
  const nx = 110 + Math.cos(rad) * 72;
  const ny = 110 + Math.sin(rad) * 72;

  return (
    <div style={{ background: "#f7f3ec", color: "#2a241c", fontFamily: "'Cormorant Garamond', serif", display: "grid", gridTemplateColumns: "1.4fr 0.8fr", minHeight: 360, border: "1px solid #d9cbb6" }}>
      <style>{`
        .d1c-tab { background:transparent; border:0; border-bottom:1px solid transparent; color:#8a7b68; padding:6px 0; margin-right:18px; font-size:15px; letter-spacing:0.08em; text-transform:uppercase; }
        .d1c-tab.on { color:#2a241c; border-bottom-color:#9a7b45; }
      `}</style>
      <div style={{ padding: "32px 36px" }}>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9a7b45" }}>Private book · Hale</div>
        <div style={{ marginTop: 22 }}>
          <button className={`d1c-tab ${mode === "market" ? "on" : ""}`} onClick={() => setMode("market")}>
            Market value
          </button>
          <button className={`d1c-tab ${mode === "liquid" ? "on" : ""}`} onClick={() => setMode("liquid")}>
            Liquid value
          </button>
        </div>
        <div className="flip" key={mode} style={{ fontSize: 76, lineHeight: 0.9, marginTop: 18, fontWeight: 500 }}>
          {money(value)}
        </div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", marginTop: 16, fontSize: 14, color: todayChange >= 0 ? "#2f6b4f" : "#8d3b32" }}>
          {money(todayChange, 0, true)} today · {pct(todayPct, 2)}
        </div>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, lineHeight: 1.55, color: "#6e6256", maxWidth: 460, marginTop: 18 }}>
          {mode === "market"
            ? "Everything marked to the last print, including bitcoin and managed futures."
            : `Excludes IBIT and DBMF (${money(illiquid)}), which would not settle as simply as the listed book.`}
        </p>
        <div style={{ marginTop: 28, height: 1, background: "#e4d8c6" }} />
        <div style={{ display: "flex", gap: 28, marginTop: 14, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#6e6256" }}>
          <span>Open {money(dayStats.open)}</span>
          <span>High {money(dayStats.high)}</span>
          <span>Low {money(dayStats.low)}</span>
        </div>
      </div>
      <div style={{ background: "#2a241c", color: "#f3eadc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, letterSpacing: "0.2em" }}>WHERE IN THE DAY</div>
        <svg viewBox="0 0 220 200" width="220" height="200">
          <path d="M38 148 A72 72 0 1 1 182 148" fill="none" stroke="#5c5144" strokeWidth="10" strokeLinecap="round" />
          <path d="M38 148 A72 72 0 1 1 182 148" fill="none" stroke="#c6a56a" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${t * 250} 260`} />
          <line x1="110" y1="110" x2={nx} y2={ny} stroke="#f3eadc" strokeWidth="1.5" />
          <circle cx="110" cy="110" r="3" fill="#c6a56a" />
        </svg>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.08em", marginTop: -8 }}>
          {Math.round(t * 100)}% of the day's range
        </div>
      </div>
    </div>
  );
}

export function D2a() {
  const [i, setI] = useState<number | null>(null);
  const data = monthly;
  const all = data.flatMap((p) => [p.value, p.invested]);
  const min = Math.min(...all) * 0.96;
  const max = Math.max(...all) * 1.02;
  const w = 1040;
  const h = 360;
  const vPts = scale(data.map((p) => p.value), w, h, 28, min, max);
  const iPts = scale(data.map((p) => p.invested), w, h, 28, min, max);
  const idx = i ?? data.length - 1;
  const p = data[idx];
  const gain = p.value - p.invested;

  return (
    <div style={{ background: "#fbfbfc", color: "#172033", fontFamily: "'IBM Plex Sans', sans-serif", padding: "22px 22px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7b8494" }}>Value against money put in</div>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: 32, marginTop: 4 }}>The gap is the gain</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
          <span><i style={{ display: "inline-block", width: 18, height: 8, background: "#1d4e89", marginRight: 6 }} />Value</span>
          <span><i style={{ display: "inline-block", width: 18, height: 0, borderTop: "2px dashed #1c1915", marginRight: 6 }} />Net invested</span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height="360"
        style={{ marginTop: 8, cursor: "crosshair" }}
        onMouseMove={(e) => setI(indexAt(e.clientX, e.currentTarget.getBoundingClientRect(), data.length))}
        onMouseLeave={() => setI(null)}
      >
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="28" x2={w - 28} y1={28 + g * (h - 56)} y2={28 + g * (h - 56)} stroke="#e6e8ee" />
        ))}
        <path d={area(vPts, h - 28)} fill="rgba(29,78,137,0.13)" />
        <path d={between(vPts, iPts)} fill="rgba(29,78,137,0.18)" />
        <path d={line(vPts)} fill="none" stroke="#1d4e89" strokeWidth="2.2" />
        <path d={line(iPts)} fill="none" stroke="#1c1915" strokeWidth="1.6" strokeDasharray="5 4" />
        <line x1={vPts[idx].x} x2={vPts[idx].x} y1={28} y2={h - 28} stroke="#172033" strokeDasharray="2 3" />
        <circle cx={vPts[idx].x} cy={vPts[idx].y} r="4" fill="#1d4e89" />
        <circle cx={iPts[idx].x} cy={iPts[idx].y} r="3.5" fill="#fff" stroke="#1c1915" />
        {data.filter((_, n) => n % 12 === 0).map((pt, n) => {
          const x = vPts[n * 12]?.x;
          return x ? (
            <text key={pt.date} x={x} y={h - 8} fontSize="11" fill="#7b8494">
              {pt.date.slice(0, 4)}
            </text>
          ) : null;
        })}
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 8 }}>
        {[
          ["Date", p.label],
          ["Value", money(p.value)],
          ["Net invested", money(p.invested)],
          ["Gain", money(gain, 0, true)],
        ].map(([k, v]) => (
          <div key={k} style={{ borderTop: "1px solid #e6e8ee", paddingTop: 8 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7b8494" }}>{k}</div>
            <div style={{ fontSize: 18, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function D2b() {
  const [showLines, setShowLines] = useState(false);
  const [i, setI] = useState<number | null>(null);
  const data = monthly;
  const gains = data.map((p) => p.value - p.invested);
  const w = 1040;
  const h = 320;
  const min = Math.min(0, ...gains);
  const max = Math.max(...gains) * 1.08;
  const pts = scale(gains, w, h, 24, min, max);
  const zero = scale([0, 0], w, h, 24, min, max)[0].y;
  const idx = i ?? data.length - 1;

  return (
    <div style={{ background: "#efe8dc", color: "#243026", fontFamily: "'Literata', serif", padding: "28px 28px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Surplus over contributions</div>
          <h3 style={{ fontWeight: 500, fontSize: 36, margin: "8px 0 0" }}>Only the gain is drawn.</h3>
        </div>
        <button
          onClick={() => setShowLines((v) => !v)}
          style={{ alignSelf: "start", border: "1px solid #243026", background: showLines ? "#243026" : "transparent", color: showLines ? "#efe8dc" : "#243026", padding: "8px 12px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}
        >
          {showLines ? "Hide the two lines" : "Show value and invested"}
        </button>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height="300"
        style={{ marginTop: 12, cursor: "crosshair" }}
        onMouseMove={(e) => setI(indexAt(e.clientX, e.currentTarget.getBoundingClientRect(), data.length))}
        onMouseLeave={() => setI(null)}
      >
        <line x1="24" x2={w - 24} y1={zero} y2={zero} stroke="#243026" strokeWidth="1" />
        <path d={area(pts, zero)} fill="#2f6b45" opacity="0.85" />
        {i != null && (
          <>
            <line x1={pts[i].x} x2={pts[i].x} y1={16} y2={h - 16} stroke="#243026" strokeDasharray="2 3" />
            <circle cx={pts[i].x} cy={pts[i].y} r="4" fill="#f4e7c5" stroke="#243026" />
          </>
        )}
      </svg>
      {showLines && (
        <DualLines data={data} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>{data[idx].label}</div>
          <div style={{ fontFamily: "'Literata', serif", fontSize: 28 }}>{money(gains[idx], 0, true)} above what was put in</div>
        </div>
        <div style={{ fontSize: 13, maxWidth: 320, lineHeight: 1.45 }}>
          Value {money(data[idx].value)} · invested {money(data[idx].invested)}. The baseline is contributions, not zero dollars.
        </div>
      </div>
    </div>
  );
}

function DualLines({ data }: { data: SeriesPoint[] }) {
  const all = data.flatMap((p) => [p.value, p.invested]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const v = scale(data.map((p) => p.value), 1040, 120, 16, min, max);
  const inv = scale(data.map((p) => p.invested), 1040, 120, 16, min, max);
  return (
    <svg viewBox="0 0 1040 120" width="100%" height="90" style={{ marginTop: -8 }}>
      <path d={line(v)} fill="none" stroke="#1d3d2e" strokeWidth="1.6" />
      <path d={line(inv)} fill="none" stroke="#1d3d2e" strokeWidth="1.2" strokeDasharray="4 3" />
    </svg>
  );
}

export function D2c() {
  const years = useMemo(() => {
    const map = new Map<string, SeriesPoint>();
    monthly.forEach((p) => map.set(p.date.slice(0, 4), p));
    return [...map.entries()].map(([year, p]) => ({ year, value: p.value, invested: p.invested, gain: p.value - p.invested }));
  }, []);
  const [year, setYear] = useState(years[years.length - 1].year);
  const selected = years.find((y) => y.year === year) ?? years[0];
  const quarters = monthly.filter((p) => p.date.startsWith(year) && [2, 5, 8, 11].includes(Number(p.date.slice(5, 7)) - 1));
  const max = Math.max(...years.map((y) => y.value)) * 1.05;

  return (
    <div style={{ background: "#fff", color: "#111", fontFamily: "'Syne', sans-serif", padding: "26px 26px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.18em" }}>YEAR BY YEAR</div>
          <div style={{ fontSize: 28, fontWeight: 750, letterSpacing: "-0.04em" }}>Hollow is invested. Solid is value.</div>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>CLICK A YEAR</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${years.length}, 1fr)`, gap: 18, alignItems: "end", height: 280, marginTop: 28 }}>
        {years.map((y) => {
          const on = y.year === year;
          return (
            <button key={y.year} onClick={() => setYear(y.year)} style={{ background: "transparent", border: 0, color: "inherit", height: "100%", display: "flex", flexDirection: "column", justifyContent: "end", gap: 8 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{compact(y.gain)}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "end", height: 220, justifyContent: "center" }}>
                <div style={{ width: 22, height: `${(y.invested / max) * 100}%`, border: "2px solid #111", background: on ? "#111" : "transparent" }} />
                <div style={{ width: 22, height: `${(y.value / max) * 100}%`, background: on ? "#e23b2f" : "#111" }} />
              </div>
              <div style={{ fontSize: 18 }}>{y.year}</div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 18, background: "#111", color: "#f4f1ea", padding: "14px 16px", display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.14em" }}>{selected.year}</div>
          <div style={{ fontSize: 26, marginTop: 4 }}>{money(selected.gain, 0, true)}</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, opacity: 0.75, marginTop: 4 }}>
            Value {money(selected.value)}
            <br />
            Invested {money(selected.invested)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {(quarters.length ? quarters : monthly.filter((p) => p.date.startsWith(year)).slice(-4)).map((q) => (
            <div key={q.date} style={{ borderLeft: "1px solid #333", paddingLeft: 8 }}>
              <div style={{ fontSize: 11, opacity: 0.6 }}>{q.label}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>{compact(q.value)}</div>
              <div style={{ fontSize: 11, color: "#f0a39c" }}>{compact(q.value - q.invested)} gain</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RANGES = ["1D", "1W", "1M", "3M", "YTD", "1Y", "3Y", "5Y", "MAX"];

function benchKey(id: string) {
  if (id === "spx" || id === "acwi" || id === "b6040" || id === "agg") return id;
  return "none";
}

export function D3a() {
  const [range, setRange] = useState("1Y");
  const [bench, setBench] = useState("spx");
  const data = seriesFor(range);
  const port = windowReturn(data.map((p) => p.value));
  const key = benchKey(bench);
  const bRet = key === "none" ? 0 : windowReturn(data.map((p) => p[key]));
  const w = 640;
  const h = 120;
  const vals = data.map((p) => p.value);
  const pts = scale(vals, w, h, 6);

  return (
    <div style={{ background: "#f4f0ea", color: "#1b1b1b", fontFamily: "'Outfit', sans-serif", padding: 22 }}>
      <style>{`
        .d3a-frame { border:1px solid #d9d0c4; background:#fff; padding:8px 10px; min-width:72px; }
        .d3a-frame.on { background:#1b1b1b; color:#fff; border-color:#1b1b1b; }
        .d3a-card { text-align:left; border:1px solid #e4dccd; background:#fff; padding:10px; width:100%; }
        .d3a-card.on { border-color:#1b1b1b; box-shadow: inset 3px 0 0 #c4552a; }
      `}</style>
      <div style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#867864" }}>Range</div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto" }}>
        {RANGES.map((r) => (
          <button key={r} className={`d3a-frame ${range === r ? "on" : ""}`} onClick={() => setRange(r)}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{r}</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>{r === range ? pct(port, 1) : " "}</div>
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginTop: 18 }}>
        <div style={{ background: "#fff", padding: 12, border: "1px solid #e4dccd" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span>{range} portfolio {pct(port)}</span>
            <span>{bench === "none" ? "No benchmark" : `${benchmarks.find((b) => b.id === bench)?.short} ${pct(bRet)}`}</span>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="120">
            <path d={area(pts, h - 6)} fill="rgba(196,85,42,0.12)" />
            <path d={line(pts)} fill="none" stroke="#c4552a" strokeWidth="2" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#867864", marginBottom: 8 }}>Benchmark</div>
          <div style={{ display: "grid", gap: 8 }}>
            {benchmarks.map((b) => (
              <button key={b.id} className={`d3a-card ${bench === b.id ? "on" : ""}`} onClick={() => setBench(b.id)}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{b.name}</strong>
                  <span>{b.short}</span>
                </div>
                <div style={{ fontSize: 12, color: "#867864", marginTop: 2 }}>{b.note}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function D3b() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(monthly.length - 1);
  const [drag, setDrag] = useState<"a" | "b" | null>(null);
  const [bench, setBench] = useState("acwi");
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const slice = monthly.slice(lo, hi + 1);
  const port = windowReturn(slice.map((p) => p.value));
  const key = benchKey(bench);
  const bRet = key === "none" ? null : windowReturn(slice.map((p) => p[key]));
  const w = 1000;

  function move(clientX: number, rect: DOMRect) {
    const idx = indexAt(clientX, rect, monthly.length);
    if (drag === "a") setA(idx);
    if (drag === "b") setB(idx);
  }

  return (
    <div style={{ background: "#f7f1e4", color: "#2c2416", fontFamily: "'Source Serif 4', serif", padding: "28px 28px 22px" }}>
      <style>{`.d3b-chip{border:1px solid #2c2416;background:transparent;padding:6px 10px;margin-right:8px;font-family:'IBM Plex Sans',sans-serif;font-size:12px}.d3b-chip.on{background:#2c2416;color:#f7f1e4}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Custom span</div>
          <div style={{ fontSize: 34, lineHeight: 1, marginTop: 6 }}>
            {monthly[lo].label} — {monthly[hi].label}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28 }}>{pct(port)}</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}>
            {bRet == null ? "Portfolio alone" : `${benchmarks.find((x) => x.id === bench)?.name} ${pct(bRet)} · excess ${pct(port - bRet)}`}
          </div>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${w} 90`}
        width="100%"
        height="90"
        style={{ marginTop: 18, touchAction: "none" }}
        onMouseMove={(e) => drag && move(e.clientX, e.currentTarget.getBoundingClientRect())}
        onMouseUp={() => setDrag(null)}
        onMouseLeave={() => setDrag(null)}
      >
        <rect x="20" y="36" width={w - 40} height="8" fill="#e4d5b8" />
        <rect x={20 + (lo / (monthly.length - 1)) * (w - 40)} y="36" width={((hi - lo) / (monthly.length - 1)) * (w - 40)} height="8" fill="#2c2416" />
        {[a, b].map((idx, n) => (
          <g key={n} onMouseDown={() => setDrag(n === 0 ? "a" : "b")} style={{ cursor: "ew-resize" }}>
            <rect x={20 + (idx / (monthly.length - 1)) * (w - 40) - 7} y="24" width="14" height="32" rx="2" fill="#9c3b2e" />
          </g>
        ))}
        <text x="20" y="68" fontSize="12" fill="#6d5c45" fontFamily="IBM Plex Sans">
          Mar 21
        </text>
        <text x={w - 70} y="68" fontSize="12" fill="#6d5c45" fontFamily="IBM Plex Sans">
          Mar 26
        </text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {[
          ["1Y", monthly.length - 13],
          ["3Y", monthly.length - 37],
          ["Since 2022", 10],
          ["Full", 0],
        ].map(([label, start]) => (
          <button key={String(label)} className="d3b-chip" onClick={() => { setA(Number(start)); setB(monthly.length - 1); }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        {benchmarks.filter((b) => b.id !== "none").map((b) => (
          <button key={b.id} className={`d3b-chip ${bench === b.id ? "on" : ""}`} onClick={() => setBench(bench === b.id ? "none" : b.id)}>
            {b.short}
          </button>
        ))}
      </div>
      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#6d5c45", marginTop: 14 }}>
        Drag the red handles. The readout is price return of the book over that span, not money-weighted.
      </p>
    </div>
  );
}

export function D3c() {
  const [range, setRange] = useState("5Y");
  const [picked, setPicked] = useState<string[]>(["spx"]);
  const [primary, setPrimary] = useState("spx");
  const [pins, setPins] = useState<string[]>([]);
  const data = seriesFor(range);
  const port = windowReturn(data.map((p) => p.value));

  function toggle(id: string) {
    setPicked((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      if (!next.includes(primary)) setPrimary(next[0] ?? "none");
      return next;
    });
  }

  const sentence = `${range === "MAX" ? "Since March 2021" : range} against ${
    picked.length ? picked.map((id) => benchmarks.find((b) => b.id === id)?.name).join(" and ") : "no benchmark"
  }. Primary: ${benchmarks.find((b) => b.id === primary)?.short ?? "none"}.`;

  return (
    <div style={{ background: "#111418", color: "#f2efe9", fontFamily: "'Space Grotesk', sans-serif", padding: 22, display: "grid", gridTemplateColumns: "280px 1fr", gap: 22 }}>
      <style>{`
        .d3c-key { background:#1c2128; color:#f2efe9; border:1px solid #2c333d; padding:16px 8px; font-size:16px; }
        .d3c-key.on { background:#f2efe9; color:#111418; }
        .d3c-pin { background:transparent; color:#f2efe9; border:1px solid #3a424e; padding:8px 10px; font-size:13px; }
      `}</style>
      <div>
        <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "#9aa3af" }}>RANGE</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
          {RANGES.map((r) => (
            <button key={r} className={`d3c-key ${range === r ? "on" : ""}`} onClick={() => setRange(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "#9aa3af" }}>BENCHMARKS · CLICK TO INCLUDE, STAR TO MAKE PRIMARY</div>
        <div style={{ marginTop: 10 }}>
          {benchmarks.filter((b) => b.id !== "none").map((b) => {
            const on = picked.includes(b.id);
            const key = benchKey(b.id);
            const ret = windowReturn(data.map((p) => p[key as "spx"]));
            return (
              <div key={b.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 42px", gap: 8, alignItems: "center", borderTop: "1px solid #2c333d", padding: "8px 0" }}>
                <button onClick={() => toggle(b.id)} style={{ background: "transparent", border: 0, color: on ? "#f2efe9" : "#8b939e", textAlign: "left", fontSize: 16 }}>
                  {on ? "●" : "○"} {b.name}
                </button>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: ret >= port ? "#f0b7a8" : "#b7e0c2" }}>{pct(ret)}</span>
                <button className="d3c-pin" onClick={() => { if (!picked.includes(b.id)) toggle(b.id); setPrimary(b.id); }} style={{ color: primary === b.id ? "#f0c36a" : "#f2efe9" }}>
                  {primary === b.id ? "★" : "☆"}
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, background: "#1c2128", padding: 14 }}>
          <div style={{ fontSize: 18, lineHeight: 1.35 }}>{sentence}</div>
          <div style={{ marginTop: 8, fontFamily: "'IBM Plex Mono', monospace" }}>Book {pct(port)} · using {daily.length ? range : range}</div>
          <button
            className="d3c-pin"
            style={{ marginTop: 12 }}
            onClick={() => setPins((p) => [`${range} · ${primary} · ${pct(port)}`, ...p].slice(0, 3))}
          >
            Pin this comparison
          </button>
          {pins.length > 0 && (
            <div style={{ marginTop: 10, fontSize: 13, color: "#9aa3af" }}>
              {pins.map((p) => (
                <div key={p}>{p}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
