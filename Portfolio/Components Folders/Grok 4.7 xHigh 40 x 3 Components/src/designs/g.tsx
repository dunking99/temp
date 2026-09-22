import { useState } from "react";
import { allocation, allocationRows, cashTotal, coreValue, homeWeight, sectorLook, totalValue } from "../data";
import { money, pct, pp } from "../lib";

const cuts = [
  { id: "geo", label: "Geography", name: "United States", weight: homeWeight, context: "Home market, including the dollar bonds and the cash." },
  { id: "class", label: "Asset class", name: allocationRows[0].name, weight: allocationRows[0].weight, context: "The largest sleeve in the policy mix. Target is 42%." },
  { id: "sector", label: "Sector", name: "Technology", weight: 0.224, context: "Look-through, not the ticker count. Six names carry it, plus the index funds." },
];

export function D19a() {
  const [cut, setCut] = useState(cuts[0]);
  return (
    <div style={{ background: "#f4efe8", color: "#1a120c", fontFamily: "'Bodoni Moda', serif", padding: "28px 32px 24px", minHeight: 320 }}>
      <div style={{ display: "flex", gap: 8, fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {cuts.map((c) => (
          <button key={c.id} onClick={() => setCut(c)} style={{ border: "1px solid #1a120c", background: cut.id === c.id ? "#1a120c" : "transparent", color: cut.id === c.id ? "#f4efe8" : "#1a120c", padding: "5px 8px", fontSize: 12 }}>{c.label}</button>
        ))}
      </div>
      <div className="flip" key={cut.id} style={{ fontSize: 140, lineHeight: 0.8, letterSpacing: "-0.04em", marginTop: 10 }}>{Math.round(cut.weight * 100)}<span style={{ fontSize: 60 }}>%</span></div>
      <div style={{ fontSize: 36, marginTop: 4 }}>{cut.name}</div>
      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", maxWidth: 560, fontSize: 15 }}>{cut.context} Everything else is {pct(1 - cut.weight, 0, false)}.</p>
    </div>
  );
}

export function D19b() {
  const big = allocationRows[0];
  const [on, setOn] = useState(false);
  const sweep = big.weight * 360;
  return (
    <div style={{ background: "#0e1a24", color: "#f3f7fb", display: "grid", gridTemplateColumns: "280px 1fr", alignItems: "center", padding: 16, fontFamily: "'Outfit', sans-serif" }}>
      <svg viewBox="0 0 240 240" width="240" height="240">
        <circle cx="120" cy="120" r="86" fill="none" stroke="#1e3344" strokeWidth="22" />
        <circle cx="120" cy="120" r="86" fill="none" stroke="#f0c36a" strokeWidth="22" strokeDasharray={`${(sweep / 360) * 540} 540`} strokeLinecap="butt" transform="rotate(-90 120 120)" />
        <text x="120" y="116" textAnchor="middle" fill="#f3f7fb" fontSize="32" fontFamily="Outfit">{pct(big.weight, 0, false)}</text>
        <text x="120" y="138" textAnchor="middle" fill="#9bb0c2" fontSize="12">of the book</text>
      </svg>
      <div>
        <div style={{ fontSize: 13, letterSpacing: "0.16em", color: "#9bb0c2" }}>THE BIGGEST SLICE</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 48, lineHeight: 1 }}>{big.name}</div>
        <p>The arc is the sleeve. The dark ring is everything else — international, bonds, property, gold, bitcoin, cash.</p>
        <button onClick={() => setOn((v) => !v)} style={{ background: "transparent", color: "#f0c36a", border: "1px solid #f0c36a", padding: "6px 10px" }}>{on ? "Hide the rest" : "Name the rest"}</button>
        {on && (
          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {allocationRows.slice(1).map((r) => <div key={r.name} style={{ fontSize: 14 }}>{r.name} · {pct(r.weight, 1, false)}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

export function D19c() {
  const tech = sectorLook[0];
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#f7f4ee", color: "#1a1a1a", fontFamily: "'Newsreader', serif", display: "grid", gridTemplateColumns: "1.3fr 0.8fr" }}>
      <div style={{ padding: "28px 32px", borderRight: "1px solid #1a1a1a" }}>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.18em" }}>THE MERIDIAN · PORTFOLIO</div>
        <div style={{ fontSize: 18, marginTop: 12 }}>Technology is the largest sector, and it is not as large as it feels.</div>
        <div style={{ fontSize: 92, lineHeight: 0.85, marginTop: 8 }}>{pct(tech.weight, 0, false)}</div>
        <p style={{ fontSize: 20, lineHeight: 1.35 }}>A fifth of the book, look-through. The S&P 500 is closer to a third. The drama is in the single names, not in the weight.</p>
      </div>
      <div style={{ padding: 22 }}>
        <button onClick={() => setOpen((v) => !v)} style={{ background: "transparent", border: 0, color: "#1a1a1a", textAlign: "left", padding: 0, fontSize: 18 }}>
          {open ? "Close the column" : "Who carries it"}
        </button>
        {open && tech.names.map((n) => <div key={n} style={{ borderTop: "1px solid #ddd", padding: "6px 0", fontFamily: "'IBM Plex Sans', sans-serif" }}>{n}</div>)}
        <div style={{ marginTop: 16, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#666" }}>Next: Financials {pct(sectorLook[1].weight, 1, false)}, Healthcare {pct(sectorLook[2].weight, 1, false)}.</div>
      </div>
    </div>
  );
}

const notes = [
  { id: "core", title: "A broad core, then satellites", body: `VTI, VXUS and BND are ${money(coreValue)} — the plot. Single stocks are the accent, not the book.`, evidence: coreValue / totalValue },
  { id: "cash", title: "Cash is a position, not a pause", body: `${money(cashTotal)} is earning a money-market rate and sitting above the 5% policy. Fine for a tax bill. Heavy as a habit.`, evidence: cashTotal / totalValue },
  { id: "abroad", title: "The world is underrepresented", body: "The international sleeve is the largest gap versus target. Home feels comfortable because so much of the book already lives there.", evidence: 1 - homeWeight },
  { id: "def", title: "There is a defensive third", body: "Bonds, gold, cash and short treasuries are the part of the book that is allowed to be boring.", evidence: allocationRows.filter((r) => ["Bonds", "Gold & Alts", "Cash"].includes(r.name)).reduce((s, r) => s + r.weight, 0) },
];

export function D20a() {
  const [gone, setGone] = useState<string[]>([]);
  const [pin, setPin] = useState<string | null>("core");
  const shown = notes.filter((n) => !gone.includes(n.id));
  return (
    <div style={{ background: "#f3f6f4", color: "#163028", fontFamily: "'Public Sans', sans-serif", padding: 16 }}>
      <div style={{ fontSize: 13, letterSpacing: "0.12em" }}>PLAIN ENGLISH · {shown.length} OBSERVATIONS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        {shown.map((n) => (
          <div key={n.id} style={{ background: pin === n.id ? "#163028" : "#fff", color: pin === n.id ? "#f3f6f4" : "#163028", padding: 14 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>{n.title}</div>
            <p style={{ fontSize: 14, lineHeight: 1.45 }}>{n.body}</p>
            <div style={{ height: 6, background: pin === n.id ? "#2d5448" : "#e5eee8" }}><div style={{ width: `${n.evidence * 100}%`, height: "100%", background: "#c4552a" }} /></div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => setPin(n.id)} style={{ border: 0, background: "transparent", color: "inherit", padding: 0 }}>Pin</button>
              <button onClick={() => setGone([...gone, n.id])} style={{ border: 0, background: "transparent", color: "inherit", padding: 0 }}>Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function D20b() {
  const [labels, setLabels] = useState(true);
  const [on, setOn] = useState(allocationRows[0].name);
  const row = allocationRows.find((r) => r.name === on) ?? allocationRows[0];
  return (
    <div style={{ background: "#e7eef2", color: "#1c2a33", fontFamily: "'Literata', serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 26 }}>The skyline of the book</div>
        <button onClick={() => setLabels((v) => !v)} style={{ border: "1px solid #1c2a33", background: "transparent", padding: "6px 8px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}>{labels ? "Hide labels" : "Show labels"}</button>
      </div>
      <div style={{ display: "flex", alignItems: "end", gap: 8, height: 220, marginTop: 10 }}>
        {allocationRows.map((r) => (
          <button key={r.name} onClick={() => setOn(r.name)} style={{ flex: Math.max(0.4, r.weight * 8), height: `${20 + r.weight * 160}%`, background: on === r.name ? "#1c2a33" : "#8aa4b5", border: 0, color: "#fff", position: "relative" }}>
            {labels && <span style={{ position: "absolute", top: -18, left: 0, color: "#1c2a33", fontSize: 11, fontFamily: "'IBM Plex Sans', sans-serif" }}>{r.name.split(" ")[0]}</span>}
          </button>
        ))}
      </div>
      <p>{row.name} is {pct(row.weight, 1, false)} of the skyline. {row.name === "US Equity" ? "That is the core tower." : row.name === "Cash" ? "A low plaza, wider than the policy wanted." : "A satellite, not the plot."}</p>
    </div>
  );
}

export function D20c() {
  const [lock, setLock] = useState<string | null>(null);
  const phrases = [
    { id: "core", text: "a core of three funds", detail: `${money(coreValue)} in VTI, VXUS and BND.` },
    { id: "sat", text: "a satellite of single names", detail: "Apple, Microsoft, NVIDIA, JPMorgan, the usual American shortlist, plus ASML and Shell." },
    { id: "cash", text: "more cash than the policy", detail: `${money(cashTotal)}, ${pct(cashTotal / totalValue, 1, false)} versus a 5% target.` },
    { id: "home", text: "a home-biased map", detail: `${pct(homeWeight, 0, false)} United States against a world equity weight near 63%.` },
  ];
  const active = phrases.find((p) => p.id === lock);
  return (
    <div style={{ background: "#fffdf8", color: "#231c16", fontFamily: "'Source Serif 4', serif", padding: "28px 36px" }}>
      <p style={{ fontSize: 26, lineHeight: 1.45, margin: 0 }}>
        The book reads as{" "}
        {phrases.map((p, i) => (
          <span key={p.id}>
            <button onClick={() => setLock(lock === p.id ? null : p.id)} onMouseEnter={() => setLock(p.id)} style={{ background: lock === p.id ? "#f0e2c8" : "transparent", border: 0, borderBottom: "1px solid #231c16", font: "inherit", color: "inherit", padding: "0 2px" }}>{p.text}</button>
            {i < phrases.length - 1 ? ", " : "."}
          </span>
        ))}
      </p>
      <div style={{ minHeight: 48, marginTop: 16, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>{active ? active.detail : "Hover a phrase."}</div>
    </div>
  );
}

export function D21a() {
  const [cash, setCash] = useState(true);
  const rows = allocation(cash);
  return (
    <div style={{ background: "#fff", color: "#161616", fontFamily: "'DM Sans', sans-serif", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>{cash ? "Cash is in the picture" : "Cash lifted out, weights renormalised"}</div>
        <button onClick={() => setCash((v) => !v)} style={{ width: 92, height: 36, borderRadius: 99, border: "1px solid #161616", background: cash ? "#161616" : "#fff", color: cash ? "#fff" : "#161616" }}>{cash ? "Included" : "Excluded"}</button>
      </div>
      <div style={{ display: "flex", height: 48, marginTop: 16 }}>
        {rows.map((r, i) => (
          <div key={r.name} style={{ width: `${r.weight * 100}%`, background: ["#1d4e89", "#c4552a", "#2f6b4f", "#b5812f", "#6b4c9a", "#111", "#d9d3c7"][i], transition: "width 0.35s" }} title={r.name} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
        {rows.map((r) => (
          <div key={r.name} style={{ fontSize: 13 }}><b>{r.name}</b><div>{pct(r.weight, 1, false)} · target {pct(r.target, 0, false)}</div></div>
        ))}
      </div>
    </div>
  );
}

export function D21b() {
  const withCash = allocation(true);
  const without = allocation(false);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {[["With cash", withCash, "#10243a"], ["Without cash", without, "#3d2b1f"]].map(([title, rows, bg]) => (
        <div key={String(title)} style={{ background: String(bg), color: "#f6f1ea", padding: 18 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.14em" }}>{String(title).toUpperCase()}</div>
          {(rows as typeof withCash).map((r) => {
            const other = (title === "With cash" ? without : withCash).find((o) => o.name === r.name);
            const delta = other ? r.weight - other.weight : 0;
            return (
              <div key={r.name} style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>{r.name}</span><span>{pct(r.weight, 1, false)}</span></div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.15)", marginTop: 4 }}><div style={{ width: `${r.weight * 100}%`, height: "100%", background: "#f0c36a" }} /></div>
                {other && Math.abs(delta) > 0.005 && <div style={{ fontSize: 11, opacity: 0.75 }}>{pp(delta)} versus the other view</div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function D21c() {
  const [lift, setLift] = useState(false);
  const rows = allocation(!lift);
  const cash = allocationRows.find((r) => r.name === "Cash")!;
  return (
    <div style={{ background: "#f6f3ee", color: "#231c16", fontFamily: "'Literata', serif", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 26 }}>Lift cash off the stack</div>
        <button onClick={() => setLift((v) => !v)} style={{ border: "1px solid #231c16", background: lift ? "#231c16" : "transparent", color: lift ? "#f6f3ee" : "#231c16", padding: "8px 12px", fontFamily: "'IBM Plex Sans', sans-serif" }}>{lift ? "Drop it back" : "Detach cash"}</button>
      </div>
      <div style={{ marginTop: 16, minHeight: 54 }}>
        {lift && <div style={{ display: "inline-block", background: "#d9d3c7", padding: "8px 12px", marginBottom: 10 }}>{cash.name} {money(cash.value)} · {pct(cash.weight, 1, false)} held aside</div>}
        <div style={{ display: "flex", height: 36 }}>
          {rows.map((r, i) => <div key={r.name} style={{ width: `${r.weight * 100}%`, background: ["#1d4e89", "#c4552a", "#2f6b4f", "#b5812f", "#6b4c9a", "#111", "#d9d3c7"][i] }} />)}
        </div>
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, marginTop: 8 }}>{lift ? "The bar now sums the invested book only. Targets below are renormalised." : "Cash is the last segment. Detach it to see the invested mix."}</div>
    </div>
  );
}
