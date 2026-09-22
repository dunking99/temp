import { useMemo, useState } from "react";
import { currencyExposure, photos, places, sectorLook, sectorPrimary, totalValue } from "../data";
import { money, pct } from "../lib";

export function D22a() {
  const [on, setOn] = useState(currencyExposure[0].code);
  const row = currencyExposure.find((c) => c.code === on) ?? currencyExposure[0];
  return (
    <div style={{ background: "#f8f5f0", color: "#1c1915", fontFamily: "'Public Sans', sans-serif", padding: 18 }}>
      <div style={{ fontSize: 13, letterSpacing: "0.12em" }}>CURRENCY · LOOK-THROUGH, NOT TRADING CURRENCY</div>
      <div style={{ display: "flex", height: 36, marginTop: 12, overflow: "hidden" }}>
        {currencyExposure.map((c) => (
          <button key={c.code} onMouseEnter={() => setOn(c.code)} onClick={() => setOn(c.code)} style={{ width: `${c.weight * 100}%`, border: 0, background: on === c.code ? "#1c1915" : "#cfc6ba", color: on === c.code ? "#fff" : "#1c1915", fontSize: 11 }}>{c.weight > 0.04 ? c.code : ""}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div>
          {currencyExposure.map((c) => (
            <button key={c.code} onClick={() => setOn(c.code)} style={{ width: "100%", display: "grid", gridTemplateColumns: "54px 1fr 80px 70px", background: on === c.code ? "#fff" : "transparent", border: 0, borderBottom: "1px solid #eadfce", padding: "7px 4px", textAlign: "left", color: "inherit" }}>
              <b>{c.code}</b><span>{c.name}</span><span>{money(c.weight * totalValue)}</span><span>{pct(c.weight, 1, false)}</span>
            </button>
          ))}
        </div>
        <div style={{ background: "#1c1915", color: "#f8f5f0", padding: 16 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 36 }}>{row.code}</div>
          <div>{pct(row.weight, 1, false)} · {money(row.weight * totalValue)}</div>
          <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.5 }}>{row.contributors.join(" · ")}</div>
          <div style={{ marginTop: 10, color: row.day >= 0 ? "#b7e0c2" : "#f0b7a8" }}>1-day FX {pct(row.day, 2)} · about {money(row.weight * totalValue * row.day, 0, true)} unhedged</div>
        </div>
      </div>
    </div>
  );
}

export function D22b() {
  const [on, setOn] = useState<string | null>(null);
  const packed = useMemo(() => pack(currencyExposure.map((c) => c.weight)), []);
  const row = currencyExposure.find((c) => c.code === on);
  return (
    <div style={{ background: "#0e1c28", color: "#e7f2f8", fontFamily: "'Space Grotesk', sans-serif", display: "grid", gridTemplateColumns: "1.4fr 0.8fr", minHeight: 420 }}>
      <svg viewBox="0 0 560 400" width="100%" height="400">
        {currencyExposure.map((c, i) => (
          <g key={c.code} onClick={() => setOn(c.code)} style={{ cursor: "pointer" }}>
            <circle cx={packed[i].x} cy={packed[i].y} r={packed[i].r} fill={on === c.code ? "#f0c36a" : "#1d4e89"} opacity={on && on !== c.code ? 0.25 : 0.9} />
            {packed[i].r > 28 && <text x={packed[i].x} y={packed[i].y + 4} textAnchor="middle" fill={on === c.code ? "#0e1c28" : "#fff"} fontSize="13">{c.code}</text>}
          </g>
        ))}
      </svg>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.14em" }}>CLICK A BUBBLE</div>
        {row ? (
          <>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 40 }}>{row.name}</div>
            <div>{money(row.weight * totalValue)}</div>
            <ul>{row.contributors.map((c) => <li key={c}>{c}</li>)}</ul>
          </>
        ) : <p>Size is exposure. The dollar bubble is the book.</p>}
      </div>
    </div>
  );
}

function pack(weights: number[]) {
  const radii = weights.map((w) => 18 + Math.sqrt(w) * 150);
  const placed: { x: number; y: number; r: number }[] = [];
  radii.forEach((r, i) => {
    if (i === 0) { placed.push({ x: 230, y: 190, r }); return; }
    let angle = i;
    let dist = radii[0] + r + 8;
    for (let n = 0; n < 500; n++) {
      const x = 230 + Math.cos(angle) * dist;
      const y = 190 + Math.sin(angle) * dist * 0.8;
      if (placed.every((p) => Math.hypot(p.x - x, p.y - y) >= p.r + r + 6)) {
        placed.push({ x, y, r });
        return;
      }
      angle += 0.45;
      dist += 0.4;
    }
    placed.push({ x: 40 + i * 30, y: 40, r });
  });
  return placed;
}

export function D22c() {
  const [hedged, setHedged] = useState<string[]>([]);
  const impact = currencyExposure.reduce((s, c) => s + (hedged.includes(c.code) ? 0 : c.weight * totalValue * c.day), 0);
  return (
    <div style={{ background: "#fff", color: "#142033", fontFamily: "'IBM Plex Sans', sans-serif", padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px" }}>
        <b>Unhedged FX move today</b>
        <span style={{ color: impact >= 0 ? "#1f7a4d" : "#a33b2b" }}>{money(impact, 0, true)}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "70px 1.2fr 90px 80px 110px 70px", gap: 6, fontSize: 12, color: "#7d8ba0", padding: "6px 8px" }}>
        <span>CCY</span><span>Name</span><span>Weight</span><span>FX day</span><span>P&L</span><span>Hedge</span>
      </div>
      {currencyExposure.map((c) => {
        const off = hedged.includes(c.code);
        const pnl = off ? 0 : c.weight * totalValue * c.day;
        return (
          <div key={c.code} style={{ display: "grid", gridTemplateColumns: "70px 1.2fr 90px 80px 110px 70px", gap: 6, padding: "8px", borderTop: "1px solid #eef2f6", alignItems: "center", opacity: off ? 0.45 : 1 }}>
            <b>{c.code}</b><span>{c.name}</span><span>{pct(c.weight, 1, false)}</span><span>{pct(c.day, 2)}</span><span>{money(pnl, 0, true)}</span>
            <input type="checkbox" checked={off} onChange={() => setHedged((h) => off ? h.filter((x) => x !== c.code) : [...h, c.code])} />
          </div>
        );
      })}
    </div>
  );
}

export function D23a() {
  const [on, setOn] = useState(places[0].id);
  const place = places.find((p) => p.id === on) ?? places[0];
  return (
    <div style={{ position: "relative", minHeight: 420, background: `#102033 url(${photos.atlas}) center/cover`, color: "#fff", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,14,22,0.78), rgba(8,14,22,0.25))" }} />
      {places.map((p) => (
        <button key={p.id} onClick={() => setOn(p.id)} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)", width: 18 + p.weight * 90, height: 18 + p.weight * 90, borderRadius: "50%", border: on === p.id ? "2px solid #f0c36a" : "0", background: "rgba(240,195,106,0.85)", color: "#1a120c", fontSize: 11 }}>
          {p.weight > 0.05 ? p.name.split(" ")[0] : ""}
        </button>
      ))}
      <div style={{ position: "relative", padding: 24, maxWidth: 360 }}>
        <div style={{ letterSpacing: "0.16em", fontSize: 12 }}>WHERE THE MONEY SITS</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 40, marginTop: 8 }}>{place.name}</div>
        <div style={{ fontSize: 28 }}>{pct(place.weight, 1, false)}</div>
        <div>{money(place.weight * totalValue)}{place.home ? " · home market" : ""}</div>
      </div>
    </div>
  );
}

export function D23b() {
  const [on, setOn] = useState<string | null>("us");
  const ranked = [...places].sort((a, b) => b.weight - a.weight);
  return (
    <div style={{ background: "#fffdf8", color: "#241c14", fontFamily: "'Newsreader', serif", padding: "8px 18px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div style={{ fontSize: 28 }}>An itinerary of exposure</div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>Home {pct(places[0].weight, 0, false)} · abroad {pct(1 - places[0].weight, 0, false)}</div>
      </div>
      {ranked.map((p, i) => (
        <button key={p.id} onClick={() => setOn(on === p.id ? null : p.id)} style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, borderTop: "1px solid #eadfce", padding: "8px 0", color: "inherit" }}>
          <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 160px 70px", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: 20 }}>{p.name}</span>
            <span style={{ height: 8, background: "#f0e6d8", display: "block" }}><i style={{ display: "block", width: `${p.weight * 100}%`, height: "100%", background: "#1d3557" }} /></span>
            <span>{pct(p.weight, 1, false)}</span>
          </div>
          {on === p.id && <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#6d5c45", paddingLeft: 44 }}>{money(p.weight * totalValue)} look-through. {p.home ? "This is the home market." : "Reached mostly through VXUS, VEA and IEMG."}</div>}
        </button>
      ))}
    </div>
  );
}

export function D23c() {
  const [on, setOn] = useState("us");
  const place = places.find((p) => p.id === on) ?? places[0];
  return (
    <div style={{ background: "#e7eef0", color: "#143038", fontFamily: "'Outfit', sans-serif", padding: 16, display: "grid", gridTemplateColumns: "1.4fr 0.7fr", gap: 12 }}>
      <div style={{ position: "relative", height: 360, background: "#d5e3e6" }}>
        {places.map((p) => (
          <button key={p.id} onClick={() => setOn(p.id)} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: 36 + p.weight * 220, height: 28 + p.weight * 120, transform: "translate(-50%, -50%)", background: on === p.id ? "#143038" : "#7fa8b0", color: "#fff", border: 0, fontSize: 12 }}>{p.name.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{ background: "#143038", color: "#e7eef0", padding: 16 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.14em" }}>TILE</div>
        <div style={{ fontSize: 32, marginTop: 8 }}>{place.name}</div>
        <div style={{ fontSize: 40 }}>{pct(place.weight, 1, false)}</div>
        <div>{money(place.weight * totalValue)}</div>
      </div>
    </div>
  );
}

export function D24a() {
  const [on, setOn] = useState<string | null>(null);
  const rows = [...sectorLook].sort((a, b) => b.weight - a.weight);
  return (
    <div style={{ background: "#fff", color: "#161616", fontFamily: "'IBM Plex Sans', sans-serif", padding: 14 }}>
      {rows.map((s, i) => (
        <button key={s.name} onClick={() => setOn(on === s.name ? null : s.name)} style={{ width: "100%", textAlign: "left", background: on === s.name ? "#f7f4ef" : "transparent", border: 0, borderTop: "1px solid #eee", padding: "7px 4px", color: "inherit" }}>
          <div style={{ display: "grid", gridTemplateColumns: "28px 180px 1fr 70px 90px", gap: 8, alignItems: "center" }}>
            <span style={{ color: "#999" }}>{i + 1}</span>
            <b>{s.name}</b>
            <span style={{ height: 8, background: "#f2f2f2" }}><i style={{ display: "block", height: "100%", width: `${s.weight * 100 * 3}%`, maxWidth: "100%", background: "#1d4e89" }} /></span>
            <span>{pct(s.weight, 1, false)}</span>
            <span>{Array.from({ length: s.count }).map((_, n) => <i key={n} style={{ display: "inline-block", width: 7, height: 7, borderRadius: 99, background: "#c4552a", marginRight: 3 }} />)}</span>
          </div>
          {on === s.name && <div style={{ padding: "6px 0 2px 36px", fontSize: 13, color: "#666" }}>{s.names.join(" · ")}</div>}
        </button>
      ))}
    </div>
  );
}

export function D24b() {
  const [by, setBy] = useState<"weight" | "count">("weight");
  const [more, setMore] = useState(false);
  const rows = [...sectorPrimary].sort((a, b) => by === "weight" ? b.weight - a.weight : b.count - a.count);
  const shown = more ? rows : rows.slice(0, 5);
  return (
    <div style={{ background: "#111", color: "#f5f1ea", fontFamily: "'Syne', sans-serif", padding: "18px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 14, letterSpacing: "0.14em" }}>PRIMARY SECTOR OF EACH HOLDING</div>
        <button onClick={() => setBy(by === "weight" ? "count" : "weight")} style={{ background: "transparent", color: "#f5f1ea", border: "1px solid #444", padding: "4px 8px" }}>Sort by {by === "weight" ? "count" : "weight"}</button>
      </div>
      {shown.map((s, i) => (
        <div key={s.name} style={{ display: "grid", gridTemplateColumns: "70px 1fr auto", gap: 12, alignItems: "baseline", borderTop: "1px solid #2a2a2a", padding: "10px 0" }}>
          <div style={{ fontSize: 32, color: "#f0c36a" }}>{String(i + 1).padStart(2, "0")}</div>
          <div>
            <div style={{ fontSize: 28 }}>{s.name}</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#aaa" }}>{s.tickers.join(" ")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22 }}>{pct(s.weight, 1, false)}</div>
            <div style={{ fontSize: 13 }}>{s.count} holdings</div>
          </div>
        </div>
      ))}
      <button onClick={() => setMore((v) => !v)} style={{ background: "transparent", color: "#f0c36a", border: 0, padding: 0 }}>{more ? "Show five" : `And ${rows.length - 5} more`}</button>
    </div>
  );
}

export function D24c() {
  const [sort, setSort] = useState<"weight" | "count">("weight");
  const [on, setOn] = useState(sectorLook[0].name);
  const rows = [...sectorLook].sort((a, b) => sort === "weight" ? b.weight - a.weight : b.count - a.count);
  const max = Math.max(...rows.map((r) => r.weight));
  const cell = rows.find((r) => r.name === on) ?? rows[0];
  return (
    <div style={{ background: "#f4f7f8", color: "#14222a", fontFamily: "'DM Sans', sans-serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Heat is weight. The number is how many holdings sit there.</div>
        <button onClick={() => setSort(sort === "weight" ? "count" : "weight")} style={{ border: "1px solid #14222a", background: "transparent", padding: "4px 8px" }}>Sort {sort}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
        {rows.map((s) => (
          <button key={s.name} onClick={() => setOn(s.name)} style={{ minHeight: 84, textAlign: "left", border: on === s.name ? "2px solid #14222a" : "0", background: `rgba(29,78,137,${0.12 + (s.weight / max) * 0.88})`, color: s.weight / max > 0.45 ? "#fff" : "#14222a", padding: 10 }}>
            <div style={{ fontSize: 28 }}>{s.count}</div>
            <div style={{ fontSize: 13 }}>{s.name}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 14 }}>{cell.name}: {pct(cell.weight, 1, false)} · {cell.names.join(", ")}</div>
    </div>
  );
}
