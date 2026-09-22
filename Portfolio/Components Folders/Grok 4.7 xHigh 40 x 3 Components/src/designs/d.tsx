import { useEffect, useState } from "react";
import {
  cashTotal,
  displayCurrencies,
  positions,
  syncEvents,
  todayChange,
  todayPct,
  totalValue,
  unrealisedPct,
} from "../data";
import { convertMoney, maskAmount, money, pct } from "../lib";

export function D10a() {
  const [open, setOpen] = useState(false);
  const [ago, setAgo] = useState(2);
  useEffect(() => {
    const id = setInterval(() => setAgo((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ background: "#f4f7f5", fontFamily: "'Public Sans', sans-serif", color: "#163028", padding: "18px 20px" }}>
      <button onClick={() => setOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", border: 0, color: "inherit", padding: 0, width: "100%", textAlign: "left" }}>
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#1f9d62", boxShadow: "0 0 0 6px rgba(31,157,98,0.15)", animation: "meridian-pulse 1.8s infinite" }} />
        <span style={{ fontSize: 18 }}>Synced {ago} min ago</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#5d7a6c" }}>{open ? "Hide log" : "Sync log"}</span>
      </button>
      <div style={{ fontSize: 13, color: "#5d7a6c", marginTop: 6 }}>Prices, lots and four custodians. IBKR is the slow one.</div>
      {open && (
        <div style={{ marginTop: 12 }}>
          {syncEvents.map((e) => (
            <div key={e.t + e.source} style={{ display: "grid", gridTemplateColumns: "80px 140px 1fr 70px", gap: 8, padding: "7px 0", borderTop: "1px solid #d7e3dc", fontSize: 13 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{e.t}</span>
              <b>{e.source}</b>
              <span>{e.detail}</span>
              <span style={{ color: e.state === "ok" ? "#1f7a4d" : "#a15c12" }}>{e.state === "ok" ? "OK" : "LAG"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function D10b() {
  const [spin, setSpin] = useState(false);
  const [stamp, setStamp] = useState("16:42:08");
  const bars = [1, 1, 1, 0.45];
  return (
    <div style={{ background: "#101826", color: "#e8eefc", fontFamily: "'Space Grotesk', sans-serif", padding: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", gap: 4, alignItems: "end", height: 36 }}>
        {bars.map((b, i) => <div key={i} style={{ width: 8, height: 10 + i * 8, background: b > 0.8 ? "#8eb6ff" : "#f0c36a", opacity: b }} />)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 20 }}>Connection good · last success {stamp}</div>
        <div style={{ fontSize: 13, color: "#9aafd4", marginTop: 4 }}>Next scheduled sync 16:47. Manual refresh pulls prices only.</div>
      </div>
      <button
        onClick={() => {
          setSpin(true);
          setTimeout(() => { setSpin(false); setStamp("16:44:11"); }, 900);
        }}
        style={{ background: "#e8eefc", color: "#101826", border: 0, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}
      >
        <span className={spin ? "spin" : undefined} style={{ display: "inline-block", animation: spin ? "meridian-spin 0.8s linear infinite" : undefined }}>↻</span>
        Refresh
      </button>
    </div>
  );
}

export function D10c() {
  const [on, setOn] = useState(syncEvents[5].t);
  const ev = syncEvents.find((e) => e.t === on) ?? syncEvents[0];
  return (
    <div style={{ background: "#fff", fontFamily: "'IBM Plex Sans', sans-serif", color: "#1c1c1c", padding: "20px 18px 16px" }}>
      <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#888" }}>WHAT UPDATED</div>
      <div style={{ display: "flex", gap: 0, marginTop: 16, overflowX: "auto" }}>
        {syncEvents.map((e, i) => (
          <button key={e.t} onClick={() => setOn(e.t)} style={{ flex: 1, minWidth: 110, background: "transparent", border: 0, textAlign: "left", padding: "0 8px 0 0", color: "inherit" }}>
            <div style={{ height: 3, background: e.t === on ? "#111" : "#ddd", marginBottom: 8 }} />
            <div style={{ fontSize: 12, color: "#888" }}>{e.t}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{e.source}</div>
            {i < syncEvents.length - 1 && <span />}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16, background: ev.state === "warn" ? "#fff6e8" : "#f6f6f4", padding: 14 }}>
        <b>{ev.source}</b> · {ev.state === "ok" ? "Clean" : "Late"} · {ev.detail}
      </div>
    </div>
  );
}

export function D11a() {
  const [code, setCode] = useState("USD");
  const cur = displayCurrencies.find((c) => c.code === code) ?? displayCurrencies[0];
  return (
    <div style={{ background: "#f7f4ef", color: "#1c1915", fontFamily: "'Instrument Serif', serif", padding: "22px 26px 26px" }}>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em" }}>VIEW THE BOOK IN</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {displayCurrencies.map((c) => (
          <button key={c.code} onClick={() => setCode(c.code)} style={{ border: 0, background: code === c.code ? "#1c1915" : "transparent", color: code === c.code ? "#f7f4ef" : "#1c1915", fontSize: 28, padding: "4px 10px" }}>{c.code}</button>
        ))}
      </div>
      <div className="flip" key={code} style={{ fontSize: 64, marginTop: 16, letterSpacing: "-0.03em" }}>{convertMoney(totalValue, cur.perUsd, cur.symbol)}</div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#6e6458", marginTop: 8 }}>
        {cur.code === "USD" ? "Base currency. No translation." : `${cur.name} · ${cur.perUsd.toFixed(4)} per USD · WM/Refinitiv 16:28 GMT`}
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 16, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
        <span>Today {convertMoney(todayChange, cur.perUsd, cur.symbol, 0, true)}</span>
        <span>{pct(todayPct, 2)} unchanged by currency</span>
      </div>
    </div>
  );
}

export function D11b() {
  const [code, setCode] = useState("EUR");
  const [locked, setLocked] = useState("USD");
  const cur = displayCurrencies.find((c) => c.code === code) ?? displayCurrencies[1];
  const figures = [
    ["Total", totalValue],
    ["Cash", cashTotal],
    ["Today", todayChange],
  ];
  return (
    <div style={{ background: "#fff", color: "#142033", fontFamily: "'IBM Plex Sans', sans-serif", display: "grid", gridTemplateColumns: "1fr 280px" }}>
      <div>
        {displayCurrencies.map((c) => (
          <button key={c.code} onClick={() => setCode(c.code)} style={{ width: "100%", display: "grid", gridTemplateColumns: "70px 1fr 120px 70px", gap: 8, textAlign: "left", background: code === c.code ? "#f4f7fb" : "#fff", border: 0, borderBottom: "1px solid #e7edf3", padding: "10px 14px", color: "inherit" }}>
            <b>{c.code}</b>
            <span>{c.name}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{c.perUsd === 1 ? "1.0000" : c.perUsd.toFixed(4)}</span>
            <span style={{ color: locked === c.code ? "#1d4e89" : "#9aa6b2" }}>{locked === c.code ? "Pinned" : ""}</span>
          </button>
        ))}
      </div>
      <div style={{ background: "#142033", color: "#f4f7fb", padding: 18 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.12em" }}>PREVIEW · {cur.code}</div>
        {figures.map(([label, n]) => (
          <div key={String(label)} style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
            <div style={{ fontSize: 22 }}>{convertMoney(Number(n), cur.perUsd, cur.symbol, 0, label === "Today")}</div>
          </div>
        ))}
        <button onClick={() => setLocked(code)} style={{ marginTop: 18, background: "#f4f7fb", color: "#142033", border: 0, padding: "8px 10px" }}>{locked === code ? "Base is pinned" : `Pin ${code} as base`}</button>
        <div style={{ fontSize: 12, marginTop: 8, opacity: 0.7 }}>Pinned base: {locked}. Reporting still stores USD.</div>
      </div>
    </div>
  );
}

export function D11c() {
  const [picked, setPicked] = useState<string[]>(["USD", "EUR", "GBP"]);
  function toggle(code: string) {
    setPicked((cur) => {
      if (cur.includes(code)) return cur.filter((c) => c !== code);
      if (cur.length >= 3) return [...cur.slice(1), code];
      return [...cur, code];
    });
  }
  return (
    <div style={{ background: "#efeae2", padding: 18, fontFamily: "'Outfit', sans-serif", color: "#1c1915" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Compare up to three. Click a tile to swap it in.</div>
        <div style={{ fontSize: 12, color: "#7a7064" }}>Rates 16:28 GMT</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {displayCurrencies.map((c) => (
          <button key={c.code} onClick={() => toggle(c.code)} style={{ border: "1px solid #1c1915", background: picked.includes(c.code) ? "#1c1915" : "transparent", color: picked.includes(c.code) ? "#efeae2" : "#1c1915", padding: "4px 8px" }}>{c.code}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
        {picked.map((code) => {
          const c = displayCurrencies.find((x) => x.code === code)!;
          return (
            <div key={code} style={{ background: "#fff", padding: 14, minHeight: 140 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.14em" }}>{c.code}</div>
              <div className="flip" key={code} style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginTop: 8 }}>{convertMoney(totalValue, c.perUsd, c.symbol)}</div>
              <div style={{ fontSize: 12, color: "#7a7064", marginTop: 8 }}>{c.perUsd === 1 ? "Base" : `${c.perUsd.toFixed(4)} ${c.code} per USD`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const sample = [
  ["Total value", money(totalValue), pct(1, 0, false)],
  ["Today", money(todayChange, 0, true), pct(todayPct, 2)],
  ["Unrealised", money(positions.reduce((s, p) => s + p.gain, 0), 0, true), pct(unrealisedPct, 1)],
  ["VTI weight", money(positions[0].mv), pct(positions[0].weight, 1, false)],
];

export function D12a() {
  const [hide, setHide] = useState(false);
  return (
    <div style={{ background: "#fff", fontFamily: "'IBM Plex Sans', sans-serif", color: "#1a1a1a", padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#888" }}>PRIVACY</div>
          <div style={{ fontSize: 20 }}>Hide money. Leave percentages alone.</div>
        </div>
        <button onClick={() => setHide((v) => !v)} aria-pressed={hide} style={{ width: 74, height: 36, borderRadius: 99, border: 0, background: hide ? "#1a1a1a" : "#e6e6e6", position: "relative" }}>
          <span style={{ position: "absolute", top: 4, left: hide ? 40 : 4, width: 28, height: 28, borderRadius: 99, background: "#fff", transition: "left 0.2s" }} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 18 }}>
        {sample.map(([label, dollars, rel]) => (
          <div key={label} style={{ borderTop: "2px solid #1a1a1a", paddingTop: 8 }}>
            <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
            <div style={{ fontSize: 22, marginTop: 6, letterSpacing: hide ? "0.08em" : undefined }}>{maskAmount(hide, dollars)}</div>
            <div style={{ fontSize: 13, color: "#1f7a4d" }}>{rel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function D12b() {
  const [level, setLevel] = useState(0);
  const names = ["Off", "Hide amounts", "Hide amounts & names"];
  const rows = positions.slice(0, 5);
  return (
    <div style={{ background: "#f6f3ee", fontFamily: "'Source Serif 4', serif", color: "#231c16", padding: 22 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {names.map((n, i) => (
          <button key={n} onClick={() => setLevel(i)} style={{ border: "1px solid #231c16", background: level === i ? "#231c16" : "transparent", color: level === i ? "#f6f3ee" : "#231c16", padding: "8px 12px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>{n}</button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        {rows.map((p) => (
          <div key={p.ticker} style={{ display: "grid", gridTemplateColumns: "80px 1fr 140px 80px", gap: 8, padding: "8px 0", borderBottom: "1px solid #e4dacd", fontSize: 16 }}>
            <b>{level === 2 ? "••••" : p.ticker}</b>
            <span>{level === 2 ? "Position hidden" : p.name}</span>
            <span>{level === 0 ? money(p.mv) : "••••••"}</span>
            <span>{pct(p.weight, 1, false)}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#7a6d60" }}>Percentages stay. Names drop only at the strictest level — useful on a shared screen.</div>
    </div>
  );
}

export function D12c() {
  const [surf, setSurf] = useState(true);
  const rows = [
    ["Total value", totalValue, 1],
    ["Cash", cashTotal, cashTotal / totalValue],
    ["Largest holding", positions[0].mv, positions[0].weight],
    ["Today", Math.abs(todayChange), Math.abs(todayPct)],
  ] as const;
  return (
    <div style={{ background: "#111", color: "#f5f5f5", fontFamily: "'Syne', sans-serif", padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.16em" }}>SHOULDER SURF</div>
          <div style={{ fontSize: 28 }}>Amounts become length. Percentages stay words.</div>
        </div>
        <button onClick={() => setSurf((v) => !v)} style={{ background: "#f5f5f5", color: "#111", border: 0, padding: "8px 12px" }}>{surf ? "Show amounts" : "Hide amounts"}</button>
      </div>
      <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
        {rows.map(([label, value, weight]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "160px 1fr 80px", gap: 12, alignItems: "center" }}>
            <div>{label}</div>
            {surf ? <div style={{ height: 14, background: "#2a2a2a" }}><div style={{ width: `${Math.max(4, weight * 100)}%`, height: "100%", background: "#f0c36a" }} /></div> : <div>{money(value)}</div>}
            <div style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>{label === "Total value" ? "100%" : pct(weight, 1, false)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
