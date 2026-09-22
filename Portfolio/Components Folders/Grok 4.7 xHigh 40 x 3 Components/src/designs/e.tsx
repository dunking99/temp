import { useState } from "react";
import { allocationRows, driftRows, futureValue, goal, requiredAnnual, totalValue } from "../data";
import { compact, money, pct, pp } from "../lib";

const paletteA = ["#1d4e89", "#c4552a", "#2f6b4f", "#b5812f", "#6b4c9a", "#111", "#cfc6ba"];
const paletteC = ["#f2e9e4", "#c9ada7", "#9a8c98", "#4a4e69", "#22223b", "#c9b458", "#6d6875"];

export function D13a() {
  const [pmt, setPmt] = useState(goal.monthly);
  const projected = futureValue(totalValue, pmt, 0.098, goal.months);
  const progress = totalValue / goal.target;
  const marks = [1_000_000, 2_000_000, 2_500_000, 3_000_000, goal.target];
  return (
    <div style={{ background: "#f6f1e7", color: "#2b241c", fontFamily: "'Source Serif 4', serif", padding: "26px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em" }}>INDEPENDENCE · {goal.dateLabel.toUpperCase()}</div>
          <div style={{ fontSize: 34, marginTop: 4 }}>{money(totalValue)} of {money(goal.target)}</div>
        </div>
        <div style={{ textAlign: "right", color: projected >= goal.target ? "#1f6b45" : "#9c3b2e" }}>{projected >= goal.target ? "Ahead, if 9.8% holds" : "Short of the path"}</div>
      </div>
      <div style={{ position: "relative", height: 70, marginTop: 28 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 28, height: 4, background: "#e4d8c6" }} />
        <div style={{ position: "absolute", left: 0, top: 28, height: 4, width: `${progress * 100}%`, background: "#2b241c" }} />
        {marks.map((m) => (
          <div key={m} style={{ position: "absolute", left: `${(m / goal.target) * 100}%`, top: 18, transform: "translateX(-50%)", textAlign: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: 99, background: m <= totalValue ? "#2b241c" : "#fff", border: "2px solid #2b241c", margin: "0 auto" }} />
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, marginTop: 8 }}>{compact(m)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 18 }}>
        <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
          Monthly contribution {money(pmt)}
          <input type="range" min={0} max={8000} step={100} value={pmt} onChange={(e) => setPmt(Number(e.target.value))} style={{ display: "block", width: 280, marginTop: 6 }} />
        </label>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13 }}>Projected {goal.dateLabel.slice(-4)}</div>
          <div style={{ fontSize: 28 }}>{money(projected)}</div>
        </div>
      </div>
    </div>
  );
}

export function D13b() {
  const [target, setTarget] = useState(goal.target);
  const [pmt, setPmt] = useState(goal.monthly);
  const [open, setOpen] = useState(false);
  const progress = Math.min(1, totalValue / target);
  const need = requiredAnnual(totalValue, pmt, goal.months, target);
  const c = 2 * Math.PI * 78;
  return (
    <div style={{ background: "#10221c", color: "#e7f2ea", fontFamily: "'Outfit', sans-serif", padding: 22, display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
      <svg viewBox="0 0 200 200" width="240" height="240">
        <circle cx="100" cy="100" r="78" fill="none" stroke="#1e3a32" strokeWidth="14" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="#d7b56d" strokeWidth="14" strokeDasharray={`${progress * c} ${c}`} strokeLinecap="round" transform="rotate(-90 100 100)" />
        <text x="100" y="96" textAnchor="middle" fill="#e7f2ea" fontSize="28" fontFamily="Outfit">{pct(progress, 0, false)}</text>
        <text x="100" y="118" textAnchor="middle" fill="#9fb8ad" fontSize="12">of target</text>
      </svg>
      <div>
        <div style={{ fontSize: 13, letterSpacing: "0.14em", color: "#9fb8ad" }}>REQUIRED RETURN</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 56, lineHeight: 1 }}>{pct(need, 1, false)}</div>
        <div style={{ color: "#9fb8ad", marginTop: 6 }}>annual, with {money(pmt)} / month, to reach {money(target)} by {goal.dateLabel}.</div>
        <div style={{ marginTop: 8, color: need < 0.098 ? "#b7e0c2" : "#f0b7a8" }}>Historical time-weighted return is 9.8%. {need < 0.098 ? "The goal is inside that pace." : "The goal asks for more than the book has earned."}</div>
        <button onClick={() => setOpen((v) => !v)} style={{ marginTop: 14, background: "transparent", color: "#e7f2ea", border: "1px solid #3e6b54", padding: "6px 10px" }}>{open ? "Hide assumptions" : "Edit assumptions"}</button>
        {open && (
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <label>Target {money(target)}<input type="range" min={3000000} max={6000000} step={50000} value={target} onChange={(e) => setTarget(Number(e.target.value))} style={{ width: "100%" }} /></label>
            <label>Monthly {money(pmt)}<input type="range" min={0} max={10000} step={100} value={pmt} onChange={(e) => setPmt(Number(e.target.value))} style={{ width: "100%" }} /></label>
          </div>
        )}
      </div>
    </div>
  );
}

export function D13c() {
  const [show, setShow] = useState(true);
  const progress = totalValue / goal.target;
  const camps = [
    { x: 40, y: 150, label: "Start" },
    { x: 80 + progress * 280, y: 150 - progress * 90, label: "Now" },
    { x: 420, y: 48, label: "2032" },
  ];
  return (
    <div style={{ background: "#e7eef2", color: "#1c2a33", fontFamily: "'Literata', serif", padding: "18px 18px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 26 }}>Altitude {pct(progress, 0, false)} · next camp is the target</div>
        <button onClick={() => setShow((v) => !v)} style={{ border: "1px solid #1c2a33", background: "transparent", padding: "6px 10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}>{show ? "Hide the path ahead" : "Show the path ahead"}</button>
      </div>
      <svg viewBox="0 0 520 190" width="100%" height="190">
        <path d="M20 160 C 80 158, 120 140, 160 120 S 240 70, 300 78 S 380 40, 450 36 L 500 160 Z" fill="#c5d5df" />
        <path d="M20 160 C 90 150, 140 130, 200 112" fill="none" stroke="#1c2a33" strokeWidth="2.5" />
        {show && <path d="M200 112 C 260 90, 340 60, 450 40" fill="none" stroke="#1c2a33" strokeDasharray="4 4" />}
        {camps.map((c) => (
          <g key={c.label}>
            <circle cx={c.x} cy={c.y} r="5" fill="#9c3b2e" />
            <text x={c.x + 8} y={c.y - 8} fontSize="12" fill="#1c2a33">{c.label}</text>
          </g>
        ))}
      </svg>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>You are at {money(totalValue)}. The dashed ridge assumes the current contribution and a 7% path. The solid line is history, simplified.</div>
    </div>
  );
}

export function D14a() {
  const [on, setOn] = useState<string | null>(null);
  let cursor = 0;
  const targetCursor = allocationRows.reduce<number[]>((acc, r) => {
    const next = (acc[acc.length - 1] ?? 0) + r.target;
    acc.push(next);
    return acc;
  }, []);
  return (
    <div style={{ background: "#fff", color: "#171717", fontFamily: "'Public Sans', sans-serif", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <b>Allocation, with each target marked</b>
        <span style={{ color: "#777" }}>Hover a class. Tick = target weight.</span>
      </div>
      <div style={{ display: "flex", height: 42, marginTop: 16, borderRadius: 4, overflow: "hidden" }}>
        {allocationRows.map((r, i) => {
          cursor += r.weight;
          const active = !on || on === r.name;
          return (
            <button key={r.name} onMouseEnter={() => setOn(r.name)} onMouseLeave={() => setOn(null)} onClick={() => setOn(on === r.name ? null : r.name)} style={{ width: `${r.weight * 100}%`, background: paletteA[i], opacity: active ? 1 : 0.25, border: 0, color: "#fff", fontSize: 11, position: "relative" }}>
              {r.weight > 0.07 ? r.name : ""}
              <i style={{ position: "absolute", left: `${(r.target / r.weight) * 100}%`, top: -6, width: 2, height: 54, background: "#111" }} />
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", height: 8, marginTop: 10 }}>
        {allocationRows.map((r, i) => <div key={r.name} style={{ width: `${r.target * 100}%`, background: paletteA[i], opacity: 0.45 }} />)}
      </div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Thin bar is the target mix, same order. {on ? `${on}: actual ${pct(allocationRows.find((r) => r.name === on)!.weight, 1, false)} · target ${pct(allocationRows.find((r) => r.name === on)!.target, 0, false)}` : "Actual on top, target underneath."}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 14 }}>
        {allocationRows.map((r, i) => (
          <button key={r.name} onClick={() => setOn(r.name)} style={{ textAlign: "left", border: 0, background: on === r.name ? "#f6f4f1" : "transparent", padding: 6 }}>
            <i style={{ display: "inline-block", width: 8, height: 8, background: paletteA[i], marginRight: 6 }} />
            {r.name}
            <div style={{ fontSize: 12, color: "#666" }}>{pct(r.weight, 1, false)} vs {pct(r.target, 0, false)}</div>
          </button>
        ))}
      </div>
      <span style={{ display: "none" }}>{targetCursor.length}</span>
    </div>
  );
}

export function D14b() {
  const [i, setI] = useState(0);
  const row = allocationRows[i];
  return (
    <div style={{ background: "#f4f1ea", color: "#1f1a17", fontFamily: "'IBM Plex Sans', sans-serif", padding: 16 }}>
      <div style={{ fontSize: 12, letterSpacing: "0.14em" }}>BULLETS · ACTUAL BAR, TARGET MARK</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 12 }}>
        {allocationRows.map((r, n) => (
          <button key={r.name} onClick={() => setI(n)} style={{ background: n === i ? "#1f1a17" : "#fff", color: n === i ? "#f4f1ea" : "#1f1a17", border: 0, padding: 8, textAlign: "left" }}>
            <div style={{ fontSize: 11, minHeight: 28 }}>{r.name}</div>
            <div style={{ position: "relative", height: 14, background: "#e7e0d4", marginTop: 8 }}>
              <div style={{ position: "absolute", left: 0, top: 3, height: 8, width: `${r.weight * 100}%`, background: n === i ? "#f0c36a" : "#1f1a17" }} />
              <div style={{ position: "absolute", left: `${r.target * 100}%`, top: 0, width: 2, height: 14, background: "#c4552a" }} />
            </div>
            <div style={{ fontSize: 12, marginTop: 6 }}>{pct(r.weight, 1, false)}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 14 }}>{row.name}: {money(row.value)} actual, target {money(row.target * totalValue)}. {row.weight > row.target ? "Over." : "Under or on."}</div>
    </div>
  );
}

export function D14c() {
  const [on, setOn] = useState(allocationRows[0].name);
  const actual = rings(allocationRows.map((r) => r.weight), 90, -Math.PI / 2);
  const target = rings(allocationRows.map((r) => r.target), 112, -Math.PI / 2);
  const row = allocationRows.find((r) => r.name === on) ?? allocationRows[0];
  return (
    <div style={{ background: "#17151c", color: "#f6f1ea", fontFamily: "'Syne', sans-serif", padding: 16, display: "grid", gridTemplateColumns: "280px 1fr", gap: 12, alignItems: "center" }}>
      <svg viewBox="0 0 260 260" width="260" height="260">
        {target.map((seg, i) => (
          <path key={`t${i}`} d={seg.d} stroke={paletteC[i]} strokeWidth={on === allocationRows[i].name ? 14 : 8} fill="none" opacity={on === allocationRows[i].name ? 1 : 0.45} />
        ))}
        {actual.map((seg, i) => (
          <path key={`a${i}`} d={seg.d} stroke={paletteC[i]} strokeWidth={16} fill="none" opacity={on === allocationRows[i].name ? 1 : 0.7} />
        ))}
        <circle cx="130" cy="130" r="60" fill="#17151c" />
        <text x="130" y="126" textAnchor="middle" fill="#f6f1ea" fontSize="13">{row.name}</text>
        <text x="130" y="146" textAnchor="middle" fill="#f0c36a" fontSize="16">{pct(row.weight, 1, false)}</text>
      </svg>
      <div>
        <div style={{ fontSize: 13, letterSpacing: "0.12em", color: "#b7a99a" }}>INNER ACTUAL · OUTER TARGET</div>
        {allocationRows.map((r, i) => (
          <button key={r.name} onClick={() => setOn(r.name)} onMouseEnter={() => setOn(r.name)} style={{ display: "grid", gridTemplateColumns: "14px 1fr auto auto", gap: 8, width: "100%", background: on === r.name ? "#241f2b" : "transparent", color: "inherit", border: 0, padding: "6px 8px", textAlign: "left" }}>
            <i style={{ width: 10, height: 10, background: paletteC[i], display: "inline-block", marginTop: 4 }} />
            <span>{r.name}</span>
            <span>{pct(r.weight, 1, false)}</span>
            <span style={{ color: "#b7a99a" }}>{pct(r.target, 0, false)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function rings(weights: number[], r: number, start: number) {
  let a = start;
  return weights.map((w) => {
    const end = a + w * Math.PI * 2 * 0.999;
    const d = arc(130, 130, r, a, end);
    a = end;
    return { d };
  });
}
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x1, y1] = p(a0);
  const [x2, y2] = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export function D15a() {
  const [staged, setStaged] = useState<string[]>([]);
  const max = Math.max(...driftRows.map((d) => Math.abs(d.drift)), 0.01);
  return (
    <div style={{ background: "#fff", color: "#161616", fontFamily: "'DM Sans', sans-serif", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Over to the right. Under to the left.</div>
        <div>{staged.length} staged</div>
      </div>
      {driftRows.map((d) => (
        <div key={d.name} style={{ display: "grid", gridTemplateColumns: "140px 1fr 120px 80px", gap: 8, alignItems: "center", marginTop: 8 }}>
          <div>{d.name}</div>
          <div style={{ position: "relative", height: 18, background: "#f3f3f3" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#111" }} />
            <div style={{ position: "absolute", top: 3, height: 12, background: d.drift >= 0 ? "#c4552a" : "#1d4e89", width: `${(Math.abs(d.drift) / max) * 50}%`, left: d.drift >= 0 ? "50%" : `${50 - (Math.abs(d.drift) / max) * 50}%` }} />
          </div>
          <div style={{ fontSize: 13 }}>{d.drift >= 0 ? `Sell ${compact(d.sell)}` : `Buy ${compact(d.buy)}`}</div>
          <button onClick={() => setStaged((s) => s.includes(d.name) ? s.filter((x) => x !== d.name) : [...s, d.name])} style={{ border: "1px solid #111", background: staged.includes(d.name) ? "#111" : "#fff", color: staged.includes(d.name) ? "#fff" : "#111", fontSize: 12, padding: "4px 6px" }}>{staged.includes(d.name) ? "Staged" : "Stage"}</button>
        </div>
      ))}
    </div>
  );
}

export function D15b() {
  const [sortAbs, setSortAbs] = useState(true);
  const rows = [...driftRows].sort((a, b) => sortAbs ? Math.abs(b.drift) - Math.abs(a.drift) : a.name.localeCompare(b.name));
  return (
    <div style={{ background: "#12110f", color: "#f3eadc", fontFamily: "'IBM Plex Mono', monospace", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>DRIFT METERS · ±10pp</div>
        <button onClick={() => setSortAbs((v) => !v)} style={{ background: "transparent", color: "#f3eadc", border: "1px solid #4a4338", padding: "4px 8px" }}>{sortAbs ? "By size" : "By name"}</button>
      </div>
      {rows.map((d) => {
        const x = 50 + (d.drift / 0.1) * 50;
        return (
          <div key={d.name} style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px", gap: 10, alignItems: "center", marginTop: 10 }}>
            <div style={{ fontSize: 12 }}>{d.name}</div>
            <div style={{ position: "relative", height: 22, background: "linear-gradient(90deg,#1d4e89,#2a2a24 48%,#2a2a24 52%,#9c3b2e)" }}>
              <div style={{ position: "absolute", left: `${Math.max(2, Math.min(98, x))}%`, top: 0, width: 3, height: 22, background: "#f0c36a" }} />
            </div>
            <div style={{ fontSize: 12 }}>{pp(d.drift)} · {d.drift >= 0 ? compact(d.sell) : compact(d.buy)}</div>
          </div>
        );
      })}
    </div>
  );
}

export function D15c() {
  const [tight, setTight] = useState(false);
  const rows = driftRows.filter((d) => !tight || Math.abs(d.drift) > 0.01);
  return (
    <div style={{ background: "#f7faf8", color: "#143028", fontFamily: "'Public Sans', sans-serif", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 28 }}>Target dot to actual dot</div>
        <button onClick={() => setTight((v) => !v)} style={{ border: "1px solid #143028", background: tight ? "#143028" : "transparent", color: tight ? "#f7faf8" : "#143028", padding: "6px 10px" }}>{tight ? "Breaches only" : "Hide moves under 1pp"}</button>
      </div>
      {rows.map((d) => (
        <div key={d.name} style={{ display: "grid", gridTemplateColumns: "140px 1fr 150px", gap: 10, alignItems: "center", padding: "9px 0", borderBottom: "1px solid #d7e5de" }}>
          <div>{d.name}</div>
          <svg viewBox="0 0 300 24" width="100%" height="24">
            <line x1={d.target * 280 + 8} x2={d.weight * 280 + 8} y1="12" y2="12" stroke="#143028" />
            <circle cx={d.target * 280 + 8} cy="12" r="4" fill="#fff" stroke="#143028" />
            <circle cx={d.weight * 280 + 8} cy="12" r="5" fill={d.drift >= 0 ? "#c4552a" : "#1d4e89"} />
          </svg>
          <div style={{ fontSize: 13 }}>{pp(d.drift)} · {d.drift > 0 ? `sell ${compact(d.sell)}` : `buy ${compact(d.buy)}`}</div>
        </div>
      ))}
      <div style={{ fontSize: 12, color: "#5d7468", marginTop: 8 }}>Open circle is the target. Filled circle is where the money is.</div>
    </div>
  );
}
