import { useState } from "react";
import { acwiHomeWeight, allocationRows, homeWeight, places, positions, sectorLook, totalValue } from "../data";
import { money, pct } from "../lib";

type Dim = "Holding" | "Region" | "Sector" | "Asset type";

function rowsFor(dim: Dim) {
  if (dim === "Holding") {
    const top = positions.slice(0, 10).map((p) => ({ name: p.ticker, value: p.mv, weight: p.weight, note: p.name }));
    const rest = positions.slice(10).reduce((s, p) => s + p.mv, 0);
    return [...top, { name: "Other", value: rest, weight: rest / totalValue, note: `${positions.length - 10} positions` }];
  }
  if (dim === "Region") return places.map((p) => ({ name: p.name, value: p.weight * totalValue, weight: p.weight, note: p.home ? "Home" : "Abroad" }));
  if (dim === "Sector") return sectorLook.map((s) => ({ name: s.name, value: s.weight * totalValue, weight: s.weight, note: `${s.count} exposures` }));
  return allocationRows.map((r) => ({ name: r.name, value: r.value, weight: r.weight, note: `Target ${pct(r.target, 0, false)}` }));
}

const ink = ["#123524", "#1d4e89", "#c4552a", "#6b4c9a", "#b5812f", "#2f6b4f", "#111111", "#8a5a44", "#3d5a80", "#9c3b2e", "#5c6b73"];

export function D16a() {
  const [dim, setDim] = useState<Dim>("Asset type");
  const [q, setQ] = useState("");
  const rows = rowsFor(dim).filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  const max = Math.max(...rows.map((r) => r.weight), 0.01);
  return (
    <div style={{ background: "#fbfbf8", color: "#172117", fontFamily: "'Public Sans', sans-serif", padding: 18 }}>
      <style>{`.d16a-tab{border:0;background:transparent;padding:8px 12px;color:#66756c}.d16a-tab.on{background:#172117;color:#fbfbf8}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>{(["Holding", "Region", "Sector", "Asset type"] as Dim[]).map((d) => <button key={d} className={`d16a-tab ${dim === d ? "on" : ""}`} onClick={() => setDim(d)}>{d}</button>)}</div>
        {dim === "Holding" && <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a ticker" style={{ border: "1px solid #d7ddd4", padding: "6px 8px" }} />}
      </div>
      <div style={{ marginTop: 14, display: "grid", gap: 7 }}>
        {rows.map((r, i) => (
          <div key={r.name} style={{ display: "grid", gridTemplateColumns: "160px 1fr 90px", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 14 }}>{r.name}</div>
            <div style={{ height: 16, background: "#eef2ec" }}><div style={{ width: `${(r.weight / max) * 100}%`, height: "100%", background: ink[i % ink.length] }} /></div>
            <div style={{ textAlign: "right", fontSize: 13 }}>{pct(r.weight, 1, false)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function D16b() {
  const [focus, setFocus] = useState<Dim | null>(null);
  const dims: Dim[] = ["Holding", "Region", "Sector", "Asset type"];
  const shown = focus ? dims.filter((d) => d === focus) : dims;
  return (
    <div style={{ background: "#efe8dc", color: "#241c14", fontFamily: "'Newsreader', serif", padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: focus ? "1fr" : "1fr 1fr", gap: 12 }}>
        {shown.map((d) => {
          const rows = rowsFor(d).slice(0, focus ? 12 : 5);
          return (
            <button key={d} onClick={() => setFocus(focus === d ? null : d)} style={{ textAlign: "left", background: "#fffaf3", border: "1px solid #e2d5c3", padding: 12, color: "inherit" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.12em" }}>
                <span>{d.toUpperCase()}</span><span>{focus === d ? "BACK" : "FOCUS"}</span>
              </div>
              {rows.map((r) => (
                <div key={r.name} style={{ display: "grid", gridTemplateColumns: "1fr 70px", gap: 8, marginTop: 6, fontSize: focus ? 16 : 14 }}>
                  <span>{r.name}</span><span>{pct(r.weight, 1, false)}</span>
                </div>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function D16c() {
  const [dim, setDim] = useState<Dim>("Asset type");
  const [drill, setDrill] = useState<string | null>(null);
  const tiles = tilesFor(dim, drill);
  const rects = sliceDice(tiles.map((t) => t.value), 8, 8, 640, 280, true);
  return (
    <div style={{ background: "#101410", color: "#e7f0e4", fontFamily: "'Space Grotesk', sans-serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["Holding", "Region", "Sector", "Asset type"] as Dim[]).map((d) => (
            <button key={d} onClick={() => { setDim(d); setDrill(null); }} style={{ background: dim === d ? "#e7f0e4" : "transparent", color: dim === d ? "#101410" : "#e7f0e4", border: "1px solid #314438", padding: "4px 8px" }}>{d}</button>
          ))}
        </div>
        <div style={{ fontSize: 13 }}>{drill ? <button onClick={() => setDrill(null)} style={{ background: "transparent", color: "#e7f0e4", border: 0 }}>← {drill}</button> : "Click a tile to open it"}</div>
      </div>
      <svg viewBox="0 0 656 296" width="100%" height="280" style={{ marginTop: 10 }}>
        {rects.map((r, i) => (
          <g key={tiles[i].name} onClick={() => !drill && setDrill(tiles[i].name)} style={{ cursor: "pointer" }}>
            <rect x={r.x} y={r.y} width={Math.max(0, r.w - 4)} height={Math.max(0, r.h - 4)} fill={ink[i % ink.length]} />
            {r.w > 70 && r.h > 32 && <text x={r.x + 8} y={r.y + 22} fill="#fff" fontSize="13">{tiles[i].name}</text>}
            {r.w > 70 && r.h > 48 && <text x={r.x + 8} y={r.y + 40} fill="#fff" fontSize="12" opacity="0.8">{pct(tiles[i].weight, 1, false)}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

function tilesFor(dim: Dim, drill: string | null) {
  const base = rowsFor(dim).slice(0, 8);
  if (!drill) return base;
  if (dim === "Asset type") {
    const rows = positions.filter((p) => p.assetClass === drill);
    return rows.map((p) => ({ name: p.ticker, value: p.mv, weight: p.weight, note: p.name }));
  }
  if (dim === "Sector") {
    const sec = sectorLook.find((s) => s.name === drill);
    if (sec) return sec.names.map((n) => ({ name: n, value: sec.weight / sec.names.length, weight: sec.weight / sec.names.length, note: n }));
  }
  if (dim === "Region") {
    const place = places.find((p) => p.name === drill);
    const rows = positions.filter((p) => p.region === drill || (place?.home && p.region === "United States")).slice(0, 8);
    if (rows.length) return rows.map((p) => ({ name: p.ticker, value: p.mv, weight: p.weight, note: p.name }));
  }
  const one = positions.find((p) => p.ticker === drill);
  if (one) return [{ name: one.name, value: one.mv, weight: one.weight, note: `${one.qty} shares` }];
  return base.filter((r) => r.name === drill);
}

function sliceDice(values: number[], x: number, y: number, w: number, h: number, vertical: boolean): { x: number; y: number; w: number; h: number }[] {
  const sum = values.reduce((s, v) => s + v, 0) || 1;
  let offset = 0;
  return values.map((v) => {
    const frac = v / sum;
    const rect = vertical ? { x: x + offset * w, y, w: frac * w, h } : { x, y: y + offset * h, w, h: frac * h };
    offset += frac;
    return rect;
  });
}

export function D17a() {
  const [mode, setMode] = useState<"chart" | "table">("chart");
  const [key, setKey] = useState<"weight" | "ticker" | "mv">("weight");
  const [dir, setDir] = useState<-1 | 1>(-1);
  const rows = [...positions].sort((a, b) => {
    const av = key === "ticker" ? a.ticker : a[key];
    const bv = key === "ticker" ? b.ticker : b[key];
    return av > bv ? dir : av < bv ? -dir : 0;
  });
  function sort(k: typeof key) {
    if (k === key) setDir((d) => (d === 1 ? -1 : 1));
    else { setKey(k); setDir(-1); }
  }
  return (
    <div style={{ background: "#fff", color: "#161616", fontFamily: "'IBM Plex Sans', sans-serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26 }}>Same holdings. Two readings.</div>
        <button onClick={() => setMode(mode === "chart" ? "table" : "chart")} style={{ background: "#161616", color: "#fff", border: 0, padding: "8px 12px" }}>{mode === "chart" ? "View table" : "View chart"}</button>
      </div>
      {mode === "chart" ? (
        <div style={{ marginTop: 12, display: "grid", gap: 5 }}>
          {rows.slice(0, 12).map((r) => (
            <div key={r.ticker} style={{ display: "grid", gridTemplateColumns: "70px 1fr 80px", gap: 8, alignItems: "center" }}>
              <b>{r.ticker}</b>
              <div style={{ height: 12, background: "#f2f2f2" }}><div style={{ width: `${r.weight * 100 * 4}%`, maxWidth: "100%", height: "100%", background: "#1d4e89" }} /></div>
              <span style={{ textAlign: "right" }}>{pct(r.weight, 1, false)}</span>
            </div>
          ))}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, fontSize: 14 }}>
          <thead>
            <tr>{(["ticker", "weight", "mv"] as const).map((k) => <th key={k} style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}><button onClick={() => sort(k)} style={{ background: "transparent", border: 0, fontWeight: 600 }}>{k === "mv" ? "Value" : k} {key === k ? (dir < 0 ? "↓" : "↑") : ""}</button></th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.ticker}>
                <td style={{ padding: 6, borderBottom: "1px solid #f0f0f0" }}>{r.ticker}</td>
                <td style={{ padding: 6, borderBottom: "1px solid #f0f0f0" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 80, height: 6, background: "#f2f2f2" }}><div style={{ width: `${r.weight * 400}%`, maxWidth: "100%", height: "100%", background: "#1d4e89" }} /></div>{pct(r.weight, 1, false)}</div></td>
                <td style={{ padding: 6, borderBottom: "1px solid #f0f0f0" }}>{money(r.mv)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function D17b() {
  const [hover, setHover] = useState(positions[0].ticker);
  const [key, setKey] = useState<"mv" | "weight">("mv");
  const rows = [...positions].sort((a, b) => b[key] - a[key]).slice(0, 12);
  const max = rows[0]?.mv ?? 1;
  return (
    <div style={{ background: "#f7f4ef", display: "grid", gridTemplateColumns: "1.1fr 1fr", minHeight: 420, fontFamily: "'IBM Plex Sans', sans-serif", color: "#1c1915" }}>
      <div style={{ padding: 16 }}>
        {rows.map((r) => (
          <div key={r.ticker} onMouseEnter={() => setHover(r.ticker)} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 8, alignItems: "center", marginBottom: 6, opacity: hover === r.ticker ? 1 : 0.45 }}>
            <b>{r.ticker}</b>
            <div style={{ height: 18, background: hover === r.ticker ? "#c4552a" : "#1c1915", width: `${(r.mv / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", padding: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 12 }}>
          <span>Linked table</span>
          <button onClick={() => setKey(key === "mv" ? "weight" : "mv")} style={{ border: 0, background: "transparent", color: "#1d4e89" }}>Sort by {key === "mv" ? "weight" : "value"}</button>
        </div>
        {rows.map((r) => (
          <button key={r.ticker} onMouseEnter={() => setHover(r.ticker)} onClick={() => setHover(r.ticker)} style={{ width: "100%", display: "grid", gridTemplateColumns: "70px 1fr 80px", background: hover === r.ticker ? "#fff4ec" : "transparent", border: 0, borderTop: "1px solid #f0ebe4", padding: "7px 8px", textAlign: "left", color: "inherit" }}>
            <b>{r.ticker}</b><span style={{ color: "#666" }}>{r.assetClass}</span><span>{pct(r.weight, 1, false)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function D17c() {
  const [view, setView] = useState<"Chart" | "Table" | "Both">("Both");
  const [cols, setCols] = useState({ value: true, gain: false, weight: true });
  const rows = positions.slice(0, 8);
  return (
    <div style={{ background: "#111418", color: "#f2efe9", fontFamily: "'Space Grotesk', sans-serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{(["Chart", "Table", "Both"] as const).map((v) => <button key={v} onClick={() => setView(v)} style={{ marginRight: 6, background: view === v ? "#f2efe9" : "transparent", color: view === v ? "#111418" : "#f2efe9", border: "1px solid #333", padding: "6px 10px" }}>{v}</button>)}</div>
        <div style={{ fontSize: 13 }}>
          {(["value", "gain", "weight"] as const).map((c) => (
            <label key={c} style={{ marginLeft: 10 }}><input type="checkbox" checked={cols[c]} onChange={() => setCols({ ...cols, [c]: !cols[c] })} /> {c}</label>
          ))}
        </div>
      </div>
      {view !== "Table" && (
        <div style={{ display: "flex", alignItems: "end", gap: 6, height: 140, marginTop: 16 }}>
          {rows.map((r) => <div key={r.ticker} title={r.ticker} style={{ flex: 1, height: `${r.weight * 700}%`, background: "#f0c36a" }} />)}
        </div>
      )}
      {view !== "Chart" && (
        <div style={{ marginTop: 12 }}>
          {rows.map((r) => (
            <div key={r.ticker} style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 100px 80px", gap: 8, padding: "6px 0", borderTop: "1px solid #2a313b", fontSize: 14 }}>
              <b>{r.ticker}</b>
              <span style={{ color: "#9aa3af" }}>{r.name}</span>
              <span>{cols.value ? money(r.mv) : "—"}</span>
              <span style={{ color: r.gain >= 0 ? "#b7e0c2" : "#f0b7a8" }}>{cols.gain ? money(r.gain, 0, true) : "—"}</span>
              <span>{cols.weight ? pct(r.weight, 1, false) : "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function D18a() {
  const [open, setOpen] = useState(false);
  const abroad = 1 - homeWeight;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `${homeWeight * 100}% ${abroad * 100}%`, minHeight: 280, fontFamily: "'Instrument Serif', serif", color: "#f7f1e8" }}>
      <div style={{ background: "#1d3557", padding: 24 }}>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.16em" }}>HOME</div>
        <div style={{ fontSize: 72, lineHeight: 0.9 }}>{pct(homeWeight, 0, false)}</div>
        <div style={{ fontSize: 28 }}>United States</div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, marginTop: 10, maxWidth: 280 }}>Global equity markets are about {pct(acwiHomeWeight, 0, false)} American. This book is {pct(homeWeight - acwiHomeWeight, 1)} heavier than that.</div>
      </div>
      <button onClick={() => setOpen((v) => !v)} style={{ background: "#f4efe6", color: "#1d3557", border: 0, textAlign: "left", padding: 24 }}>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.16em" }}>ELSEWHERE</div>
        <div style={{ fontSize: 56, lineHeight: 0.9 }}>{pct(abroad, 0, false)}</div>
        <div style={{ fontSize: 22 }}>{open ? "Hide the map of elsewhere" : "Open the rest of the world"}</div>
        {open && places.filter((p) => !p.home).map((p) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, borderTop: "1px solid #e4d8c6", padding: "4px 0" }}>
            <span>{p.name}</span><span>{pct(p.weight, 1, false)}</span>
          </div>
        ))}
      </button>
    </div>
  );
}

export function D18b() {
  const [mode, setMode] = useState<"market" | "even">("market");
  const neutral = mode === "market" ? acwiHomeWeight : 0.5;
  const tilt = Math.max(-18, Math.min(18, (homeWeight - neutral) * 80));
  return (
    <div style={{ background: "#f7f3ea", color: "#2a241c", fontFamily: "'Cormorant Garamond', serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 28 }}>The beam tilts toward home</div>
        <div>
          <button onClick={() => setMode("market")} style={{ marginRight: 8, border: "1px solid #2a241c", background: mode === "market" ? "#2a241c" : "transparent", color: mode === "market" ? "#f7f3ea" : "#2a241c", padding: "6px 8px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}>Vs market weight</button>
          <button onClick={() => setMode("even")} style={{ border: "1px solid #2a241c", background: mode === "even" ? "#2a241c" : "transparent", color: mode === "even" ? "#f7f3ea" : "#2a241c", padding: "6px 8px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}>Vs 50/50</button>
        </div>
      </div>
      <svg viewBox="0 0 640 200" width="100%" height="200">
        <g transform={`rotate(${tilt} 320 78)`}>
          <rect x="90" y="74" width="460" height="6" fill="#2a241c" />
          <polygon points="70,74 110,74 90,110" fill="#1d3557" />
          <polygon points="530,74 570,74 550,110" fill="#c4552a" />
          <text x="90" y="68" textAnchor="middle" fontSize="14" fill="#1d3557">Home {pct(homeWeight, 0, false)}</text>
          <text x="550" y="68" textAnchor="middle" fontSize="14" fill="#c4552a">World {pct(1 - homeWeight, 0, false)}</text>
        </g>
        <polygon points="320,78 308,150 332,150" fill="#2a241c" />
      </svg>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>Neutral is {pct(neutral, 1, false)}. You are {pct(homeWeight - neutral, 1)} to the home side of it.</div>
    </div>
  );
}

export function D18c() {
  const [move, setMove] = useState(0);
  const shifted = Math.max(0, homeWeight - move / totalValue);
  return (
    <div style={{ background: "#fff", color: "#142033", fontFamily: "'Outfit', sans-serif", padding: 20 }}>
      <div style={{ fontSize: 22 }}>Your home weight, the market's, and a flatter world</div>
      {[
        ["This book", homeWeight, "#1d4e89"],
        ["If you moved the slider", shifted, "#c4552a"],
        ["ACWI home weight", acwiHomeWeight, "#111"],
        ["Half the world", 0.5, "#bbb"],
      ].map(([label, w, color]) => (
        <div key={String(label)} style={{ display: "grid", gridTemplateColumns: "180px 1fr 60px", gap: 8, alignItems: "center", marginTop: 10 }}>
          <div>{label}</div>
          <div style={{ height: 16, background: "#f2f4f7" }}><div style={{ width: `${Number(w) * 100}%`, height: "100%", background: String(color) }} /></div>
          <div>{pct(Number(w), 1, false)}</div>
        </div>
      ))}
      <label style={{ display: "block", marginTop: 16, fontSize: 14 }}>
        Move {money(move)} from the US sleeve abroad
        <input type="range" min={0} max={400000} step={5000} value={move} onChange={(e) => setMove(Number(e.target.value))} style={{ width: "100%" }} />
      </label>
      <p style={{ color: "#5c6b7a", fontSize: 14 }}>Home bias here is geography of the whole book, including bonds and cash, not just equities. That is why it sits above the equity-market weight.</p>
    </div>
  );
}

