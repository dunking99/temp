import { useState } from "react";
import { DAY_PCT, DAY_PNL, HOLDINGS, TOTAL } from "@/lib/data";
import { linePath, money, pct, points, signed } from "@/lib/format";

export function D118a() {
  const [hide, setHide] = useState(false);
  return (
    <div style={{ fontFamily: "Fraunces, serif", background: "#f6f3ec", color: "#1c1915" }} className="flex items-center justify-between px-10 py-8">
      <div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#8a8176]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>Total value</div>
        <button type="button" onClick={() => setHide((v) => !v)} className="mt-1 text-left text-[64px] leading-none tracking-tight">{hide ? "••••••" : money(TOTAL)}</button>
      </div>
      <div className="max-w-xs text-sm text-[#6f675e]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>A serif figure, captioned. Click to mask it — the gesture a shared screen actually needs.</div>
    </div>
  );
}

export function D118b() {
  const [hide, setHide] = useState(false);
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#0c100e", color: "#b6e38a" }} className="flex items-center justify-between px-8 py-6">
      <button type="button" onClick={() => setHide((v) => !v)} className="text-left text-4xl">{hide ? "NAV ******" : `NAV ${money(TOTAL)}`}</button>
      <span className="text-xs text-[#6f875c]">TERMINAL · CLICK TO BLANK</span>
    </div>
  );
}

export function D118c() {
  const [cents, setCents] = useState(true);
  const whole = Math.floor(TOTAL);
  const frac = Math.round((TOTAL - whole) * 100).toString().padStart(2, "0");
  return (
    <button type="button" onClick={() => setCents((v) => !v)} className="flex items-start bg-white px-10 py-8 text-left text-[#111]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
      <span className="mt-2 text-2xl">$</span>
      <span className="text-[68px] font-medium leading-none tracking-tight">{whole.toLocaleString("en-US")}</span>
      {cents && <span className="mt-2 text-2xl text-[#888]">.{frac}</span>}
    </button>
  );
}

export function D119a() {
  const [mode, setMode] = useState<"both" | "usd" | "pct">("both");
  const up = DAY_PNL >= 0;
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f7f4ee" }} className="flex items-center gap-4 px-8 py-6">
      <button type="button" onClick={() => setMode(mode === "both" ? "usd" : mode === "usd" ? "pct" : "both")} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white" style={{ background: up ? "#1f7a4d" : "#9d3b32" }}>
        <span>{up ? "▲" : "▼"}</span>
        {mode !== "pct" && <span className="tabular">{signed(DAY_PNL)}</span>}
        {mode !== "usd" && <span className="tabular">{pct(DAY_PCT, 2)}</span>}
      </button>
      <span className="text-sm text-[#6f675e]">Click the pill to cycle currency, percent, both.</span>
    </div>
  );
}

export function D119b() {
  const [pctMode, setPctMode] = useState(false);
  const up = DAY_PNL >= 0;
  return (
    <button type="button" onClick={() => setPctMode((v) => !v)} className="flex w-full items-center justify-between bg-[#111] px-8 py-5 text-left text-white" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
      <span className="text-xs tracking-[0.2em] text-[#999]">DAY</span>
      <span className="text-3xl" style={{ color: up ? "#b6e38a" : "#ffb4a8" }}>{pctMode ? pct(DAY_PCT, 2) : signed(DAY_PNL)}</span>
      <span className="h-2 w-40 bg-[#222]"><span className="block h-2" style={{ width: `${Math.min(100, Math.abs(DAY_PCT) * 30)}%`, background: up ? "#b6e38a" : "#ffb4a8" }} /></span>
    </button>
  );
}

export function D119c() {
  const up = DAY_PNL >= 0;
  const [flash, setFlash] = useState(false);
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#efeae2" }} className="flex items-center gap-6 px-8 py-6">
      <button type="button" onClick={() => setFlash((v) => !v)} className="grid h-28 w-28 place-items-center text-white" style={{ background: flash ? "#111" : up ? "#1f7a4d" : "#9d3b32" }}>
        <div className="text-center text-sm leading-tight">{up ? "UP" : "DOWN"}<div className="text-lg">{pct(DAY_PCT, 2)}</div></div>
      </button>
      <div className="text-sm text-[#5c5146]">A price tile, not a sentence. Click to invert it.</div>
    </div>
  );
}

export function D122a() {
  const [win, setWin] = useState<18 | 36>(18);
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fff", color: "#111" }} className="px-6 py-4">
      <div className="mb-2 flex justify-between text-xs text-[#888]"><span>Trend line, table scale</span><button type="button" onClick={() => setWin(win === 18 ? 36 : 18)} className="underline">{win === 18 ? "1 year" : "Full spark"}</button></div>
      <div className="divide-y divide-[#eee]">
        {HOLDINGS.slice(0, 8).map((h) => {
          const s = h.spark.slice(-win);
          const pts = points(s, 120, 28, 2);
          return (
            <div key={h.ticker} className="grid grid-cols-[80px_140px_1fr] items-center py-1 text-sm">
              <span className="font-medium">{h.ticker}</span>
              <svg viewBox="0 0 120 28" className="h-7 w-32"><path d={linePath(pts)} fill="none" stroke={s[s.length - 1] >= s[0] ? "#1f7a4d" : "#9d3b32"} strokeWidth="1.4" /></svg>
              <span className="text-[#666]">{h.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function D122b() {
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#f6f3ee", color: "#1c1915" }} className="px-6 py-4">
      <div className="mb-2 text-[10px] uppercase tracking-wider text-[#8a8176]">Bar spark · last 16 marks</div>
      {HOLDINGS.slice(0, 6).map((h) => {
        const s = h.spark.slice(-16);
        const min = Math.min(...s);
        const max = Math.max(...s);
        return (
          <div key={h.ticker} className="grid grid-cols-[70px_1fr] items-center gap-3 border-t border-[#e6dfd4] py-2">
            <span className="text-xs">{h.ticker}</span>
            <span className="flex h-6 items-end gap-px">
              {s.map((v, i) => <span key={i} className="flex-1" style={{ height: `${8 + ((v - min) / (max - min || 1)) * 16}px`, background: v >= s[0] ? "#1f7a4d" : "#c47c74" }} />)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function D122c() {
  const [on, setOn] = useState("NVDA");
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#0e1420", color: "#e8eef8" }} className="px-6 py-4">
      <div className="mb-2 text-xs text-[#8eb4d4]">Slope only. First mark to last. Click a row.</div>
      {HOLDINGS.slice(0, 7).map((h) => {
        const a = h.spark[0];
        const b = h.spark[h.spark.length - 1];
        const up = b >= a;
        return (
          <button key={h.ticker} type="button" onClick={() => setOn(h.ticker)} className={`grid w-full grid-cols-[70px_160px_1fr] items-center py-1.5 text-left text-sm ${on === h.ticker ? "text-[#dff26a]" : ""}`}>
            <span>{h.ticker}</span>
            <svg viewBox="0 0 140 24" className="h-6 w-36">
              <line x1="4" y1={up ? 18 : 6} x2="130" y2={up ? 6 : 18} stroke="currentColor" strokeWidth="1.6" />
              <circle cx="130" cy={up ? 6 : 18} r="3" fill="currentColor" />
            </svg>
            <span className="text-xs opacity-70">{up ? "Higher" : "Lower"} than the start of the spark</span>
          </button>
        );
      })}
    </div>
  );
}

export function D126a() {
  const [mode, setMode] = useState<"both" | "usd" | "pct">("both");
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fff", color: "#1c1915" }} className="px-6 py-4">
      <button type="button" onClick={() => setMode(mode === "both" ? "usd" : mode === "usd" ? "pct" : "both")} className="mb-2 text-xs uppercase tracking-wider text-[#8a8176]">Gain cell · {mode} · click to switch</button>
      {HOLDINGS.slice(0, 7).map((h) => (
        <div key={h.ticker} className="grid grid-cols-[80px_1fr_140px] items-center border-t border-[#f0ebe3] py-2 text-sm">
          <span className="font-medium">{h.ticker}</span>
          <span className="text-[#6f675e]">{h.name}</span>
          <span className="text-right tabular" style={{ color: h.gain >= 0 ? "#1f7a4d" : "#9d3b32" }}>
            {mode !== "pct" && <span className="block">{signed(h.gain)}</span>}
            {mode !== "usd" && <span className="block text-xs">{pct(h.gainPct)}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

export function D126b() {
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#f6f3ee", color: "#1c1915" }} className="px-6 py-4">
      {HOLDINGS.slice(0, 6).map((h) => (
        <div key={h.ticker} className="flex items-center justify-between border-b border-[#e7e1d6] py-2 text-sm">
          <span>{h.ticker}</span>
          <span className="inline-flex items-center gap-2 tabular" style={{ color: h.gain >= 0 ? "#1f7a4d" : "#9d3b32" }}>
            <span>{h.gain >= 0 ? "▲" : "▼"}</span>
            {signed(h.gain)} · {pct(h.gainPct)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function D126c() {
  const [abs, setAbs] = useState(false);
  return (
    <div style={{ fontFamily: "Libre Baskerville, serif", background: "#f7f1e6", color: "#2a2118" }} className="px-8 py-5">
      <button type="button" onClick={() => setAbs((v) => !v)} className="mb-2 text-xs underline" style={{ fontFamily: "Instrument Sans, sans-serif" }}>{abs ? "Show percents" : "Show currency"}</button>
      <table className="w-full text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
        <tbody>
          {HOLDINGS.slice(0, 7).map((h) => (
            <tr key={h.ticker} className="border-t border-[#efe6d6]">
              <td className="py-1.5">{h.ticker}</td>
              <td className="text-right tabular">{abs ? (h.gain < 0 ? `(${money(Math.abs(h.gain))})` : money(h.gain)) : (h.gainPct < 0 ? `(${Math.abs(h.gainPct).toFixed(1)}%)` : pct(h.gainPct, 1, false))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-[#6e6254]">Losses in parentheses. No red required, though the eye still wants it.</p>
    </div>
  );
}

const TYPES = ["Stock", "Fund", "Crypto", "Cash"] as const;

export function D134a() {
  const [on, setOn] = useState<string>("Stock");
  return (
    <div style={{ fontFamily: "Instrument Sans, sans-serif", background: "#fff", color: "#111" }} className="flex items-center gap-3 px-8 py-8">
      {TYPES.map((t) => (
        <button key={t} type="button" onClick={() => setOn(t)} className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] ${on === t ? "border-[#111] bg-[#111] text-white" : "border-[#ccc]"}`}>{t}</button>
      ))}
      <span className="ml-4 text-sm text-[#666]">Outline chips. The active one is filled. Nothing else shouts.</span>
    </div>
  );
}

export function D134b() {
  const [on, setOn] = useState("Crypto");
  const color: Record<string, string> = { Stock: "#1e3a5f", Fund: "#0f766e", Crypto: "#6d28d9", Cash: "#57534e" };
  return (
    <div style={{ fontFamily: "Syne, sans-serif", background: "#f6f1e8" }} className="flex items-center gap-4 px-8 py-8">
      {TYPES.map((t) => (
        <button key={t} type="button" onClick={() => setOn(t)} className="grid h-16 w-16 place-items-center text-[10px] uppercase tracking-wider text-white" style={{ background: color[t], outline: on === t ? "3px solid #1c1612" : "none", outlineOffset: 3 }}>{t}</button>
      ))}
      <div className="text-sm text-[#5c5146]">Square stamps. Click one to seat it in a row: <strong>{on}</strong> · example holding.</div>
    </div>
  );
}

export function D134c() {
  const [on, setOn] = useState("Fund");
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", background: "#101418", color: "#d5e4ea" }} className="flex items-center gap-2 px-6 py-6">
      {TYPES.map((t) => (
        <button key={t} type="button" onClick={() => setOn(t)} className={`border px-2 py-1 text-[11px] ${on === t ? "border-[#9fd7c8] text-[#9fd7c8]" : "border-[#2a3842] text-[#8aa0aa]"}`}>[{t.toUpperCase()}]</button>
      ))}
      <span className="ml-4 text-[11px] text-[#8aa0aa]">MONO TAG · {on.toUpperCase()} SELECTED</span>
    </div>
  );
}
