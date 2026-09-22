import { useState } from "react";
import { accounts, blendedCashRate, cashInterest, cashTotal, driftRows, futureValue, vehicleFor } from "../data";
import { money, pct } from "../lib";

export function D25a() {
  const [on, setOn] = useState(accounts[0].id);
  const a = accounts.find((x) => x.id === on) ?? accounts[0];
  const pull = a.rate - blendedCashRate;
  return (
    <div style={{ background: "#f4f7f5", color: "#143028", fontFamily: "'Public Sans', sans-serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.14em" }}>BLENDED CASH RATE</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 48 }}>{pct(blendedCashRate, 2, false)}</div>
        </div>
        <div style={{ textAlign: "right" }}>{money(cashTotal)} across {accounts.length} accounts<br />{money(cashInterest)} a year if rates hold</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
        {accounts.map((acc) => (
          <button key={acc.id} onClick={() => setOn(acc.id)} style={{ textAlign: "left", background: on === acc.id ? "#143028" : "#fff", color: on === acc.id ? "#f4f7f5" : "#143028", border: 0, padding: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{acc.type}</div>
            <div style={{ fontSize: 16, marginTop: 4 }}>{acc.short}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26 }}>{money(acc.cash)}</div>
            <div>{pct(acc.rate, 2, false)} · {acc.vehicle}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 14 }}>{a.short} pulls the blend {pull >= 0 ? "up" : "down"} by {pct(Math.abs(pull), 2, false)}. Weight in the blend: {pct(a.cash / cashTotal, 1, false)}.</div>
    </div>
  );
}

export function D25b() {
  const [on, setOn] = useState(accounts[1].id);
  const max = 0.05;
  return (
    <div style={{ background: "#1a120c", color: "#f6efe6", fontFamily: "'IBM Plex Sans', sans-serif", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Color is the rate. Width is the balance.</div>
        <div>Blend {pct(blendedCashRate, 2, false)}</div>
      </div>
      <div style={{ display: "flex", height: 72, marginTop: 14 }}>
        {accounts.map((a) => (
          <button key={a.id} onClick={() => setOn(a.id)} style={{ width: `${(a.cash / cashTotal) * 100}%`, border: 0, background: `rgba(240,195,106,${0.25 + a.rate / max})`, color: "#1a120c", fontWeight: 600 }}>{a.short}</button>
        ))}
      </div>
      <div style={{ position: "relative", height: 36, marginTop: 16, background: "#2a211c" }}>
        <div style={{ position: "absolute", left: `${(blendedCashRate / max) * 100}%`, top: 0, bottom: 0, width: 2, background: "#f6efe6" }} />
        {accounts.map((a) => (
          <div key={a.id} style={{ position: "absolute", left: `${(a.rate / max) * 100}%`, top: 8, width: 8, height: 8, borderRadius: 99, background: on === a.id ? "#f0c36a" : "#8a7560", transform: "translateX(-50%)" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cbbba6" }}><span>3.0%</span><span>rate scale</span><span>5.0%</span></div>
      <div style={{ marginTop: 8 }}>{accounts.find((a) => a.id === on)?.name} at {pct(accounts.find((a) => a.id === on)!.rate, 2, false)} via {accounts.find((a) => a.id === on)?.vehicle}.</div>
    </div>
  );
}

export function D25c() {
  const [formula, setFormula] = useState(false);
  return (
    <div style={{ background: "#fffef9", color: "#1e1a14", fontFamily: "'IBM Plex Serif', serif", padding: "22px 26px" }}>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, letterSpacing: "0.16em" }}>CASH STATEMENT</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 1fr 0.7fr 1fr", gap: 8, marginTop: 12, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8a8175" }}>
        <span>Account</span><span>Vehicle</span><span>Balance</span><span>Rate</span><span>Annual interest</span>
      </div>
      {accounts.map((a) => (
        <div key={a.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 1fr 0.7fr 1fr", gap: 8, padding: "9px 0", borderTop: "1px solid #ece4d6", fontSize: 16 }}>
          <span>{a.name}</span><span>{a.vehicle}</span><span>{money(a.cash, 2)}</span><span>{pct(a.rate, 2, false)}</span><span>{money(a.cash * a.rate, 2)}</span>
        </div>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 1fr 0.7fr 1fr", gap: 8, padding: "10px 0", borderTop: "2px solid #1e1a14", fontSize: 16 }}>
        <b>Total</b><span /><b>{money(cashTotal, 2)}</b><b>{pct(blendedCashRate, 2, false)}</b><b>{money(cashInterest, 2)}</b>
      </div>
      <button onClick={() => setFormula((v) => !v)} style={{ marginTop: 8, background: "transparent", border: 0, color: "#8d3b2a", padding: 0, fontFamily: "'IBM Plex Sans', sans-serif" }}>{formula ? "Hide the blend" : "How the blend is calculated"}</button>
      {formula && <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, lineHeight: 1.6 }}>{accounts.map((a) => `${money(a.cash)} × ${pct(a.rate, 2, false)}`).join(" + ")} = {money(cashInterest, 2)} ÷ {money(cashTotal)} = {pct(blendedCashRate, 2, false)}</p>}
    </div>
  );
}

const excess = Math.max(0, (driftRows.find((d) => d.name === "Cash")?.gap) ?? 0);

export function D26a() {
  const [state, setState] = useState<"open" | "draft" | "left" | "snooze">("open");
  const [reason, setReason] = useState("Tax bill due");
  if (state === "left") {
    return (
      <div style={{ background: "#f6f3ee", padding: 22, fontFamily: "'Newsreader', serif", color: "#231c16" }}>
        <div style={{ fontSize: 28 }}>Left as dry powder.</div>
        <p>Reason: {reason}. The prompt will stay quiet.</p>
        <button onClick={() => setState("open")} style={{ border: "1px solid #231c16", background: "transparent", padding: "6px 10px" }}>Reopen</button>
      </div>
    );
  }
  return (
    <div style={{ background: "#3d2b1f", color: "#f6efe6", fontFamily: "'Fraunces', serif", padding: "28px 32px" }}>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.16em" }}>IDLE CASH</div>
      <div style={{ fontSize: 42, lineHeight: 1.05, maxWidth: 680, marginTop: 8 }}>{money(cashTotal)} is parked. About {money(excess)} of it is above the policy.</div>
      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, maxWidth: 640 }}>It earns {pct(blendedCashRate, 2, false)}, roughly {money(cashInterest)} a year. That is a respectable floor and a poor destination for the excess.</p>
      {state === "draft" && <div style={{ background: "#2a1d14", padding: 12, fontFamily: "'IBM Plex Sans', sans-serif" }}>Draft: buy {money(excess * 0.7)} VXUS and {money(excess * 0.3)} IEMG from Schwab and IBKR cash. Nothing is sent.</div>}
      {state === "snooze" && (
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
          <div>Why leave it?</div>
          {["Tax bill due", "A house", "Waiting on a dip"].map((r) => (
            <button key={r} onClick={() => setReason(r)} style={{ margin: "8px 8px 0 0", background: reason === r ? "#f6efe6" : "transparent", color: reason === r ? "#3d2b1f" : "#f6efe6", border: "1px solid #f6efe6", padding: "6px 8px" }}>{r}</button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => setState("draft")} style={{ background: "#f6efe6", color: "#3d2b1f", border: 0, padding: "8px 12px", fontFamily: "'IBM Plex Sans', sans-serif" }}>Draft a deployment</button>
        <button onClick={() => setState("snooze")} style={{ background: "transparent", color: "#f6efe6", border: "1px solid #f6efe6", padding: "8px 12px", fontFamily: "'IBM Plex Sans', sans-serif" }}>Not now</button>
        {state === "snooze" && <button onClick={() => setState("left")} style={{ background: "transparent", color: "#f0c36a", border: 0, fontFamily: "'IBM Plex Sans', sans-serif" }}>Confirm: {reason}</button>}
      </div>
    </div>
  );
}

export function D26b() {
  const [amount, setAmount] = useState(excess || 50000);
  const [years, setYears] = useState(5);
  const [port, setPort] = useState(0.075);
  const cashFv = futureValue(amount, 0, blendedCashRate, years * 12);
  const portFv = futureValue(amount, 0, port, years * 12);
  return (
    <div style={{ background: "#f7faf8", color: "#143028", fontFamily: "'Public Sans', sans-serif", padding: 20 }}>
      <div style={{ fontFamily: "'Newsreader', serif", fontSize: 30 }}>What the idle cash gives up</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20, marginTop: 12 }}>
        <div>
          <label style={{ display: "block" }}>Deploy {money(amount)}<input type="range" min={0} max={cashTotal} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: "100%" }} /></label>
          <label style={{ display: "block", marginTop: 8 }}>Over {years} years<input type="range" min={1} max={15} value={years} onChange={(e) => setYears(Number(e.target.value))} style={{ width: "100%" }} /></label>
          <label style={{ display: "block", marginTop: 8 }}>If the invested book earns {pct(port, 1, false)}<input type="range" min={0.03} max={0.12} step={0.005} value={port} onChange={(e) => setPort(Number(e.target.value))} style={{ width: "100%" }} /></label>
        </div>
        <div>
          <div style={{ fontSize: 13 }}>Cash grows to</div>
          <div style={{ fontSize: 22 }}>{money(cashFv)}</div>
          <div style={{ fontSize: 13, marginTop: 8 }}>Invested grows to</div>
          <div style={{ fontSize: 22 }}>{money(portFv)}</div>
          <div style={{ marginTop: 10, color: "#9c3b2e" }}>Difference {money(portFv - cashFv, 0, true)}</div>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "#4d6658" }}>Cash rate is the live blend, {pct(blendedCashRate, 2, false)}. This is arithmetic, not a promise.</p>
    </div>
  );
}

export function D26c() {
  const [snooze, setSnooze] = useState(false);
  const [amt, setAmt] = useState(Math.round(excess));
  const intl = driftRows.find((d) => d.name === "Intl Equity");
  return (
    <div style={{ background: "#fff", borderLeft: "8px solid #c4552a", fontFamily: "'Literata', serif", color: "#1c1915", padding: "22px 26px" }}>
      {snooze ? (
        <div>
          <div style={{ fontSize: 28 }}>Snoozed for 30 days.</div>
          <button onClick={() => setSnooze(false)} style={{ marginTop: 8, border: "1px solid #1c1915", background: "transparent", padding: "6px 10px" }}>Bring it back</button>
        </div>
      ) : (
        <>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.14em" }}>ONE SUGGESTION</div>
          <div style={{ fontSize: 32, lineHeight: 1.15, marginTop: 6 }}>Put {money(amt)} of excess cash into the international sleeve.</div>
          <p>It is the largest gap — about {money(Math.abs(intl?.gap ?? 0))} short. This draft closes part of it and leaves a cash floor near 5%.</p>
          <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>Adjust<input type="range" min={10000} max={Math.max(20000, excess)} step={1000} value={amt} onChange={(e) => setAmt(Number(e.target.value))} style={{ width: 280, marginLeft: 8 }} /></label>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <span style={{ background: "#f7f1ea", padding: "8px 10px" }}>Buy VXUS {money(amt * 0.65)}</span>
            <span style={{ background: "#f7f1ea", padding: "8px 10px" }}>Buy IEMG {money(amt * 0.35)}</span>
            <button onClick={() => setSnooze(true)} style={{ marginLeft: "auto", background: "transparent", border: "1px solid #1c1915", padding: "8px 10px", fontFamily: "'IBM Plex Sans', sans-serif" }}>Snooze 30 days</button>
          </div>
        </>
      )}
    </div>
  );
}

const trades = driftRows
  .filter((d) => Math.abs(d.gap) > 2000)
  .map((d) => ({
    name: d.name,
    action: d.gap > 0 ? "Sell" : "Buy",
    amount: Math.abs(d.gap),
    vehicle: d.gap > 0 ? vehicleFor[d.name].sell : vehicleFor[d.name].buy,
    taxVehicle: vehicleFor[d.name].taxSell,
    note: vehicleFor[d.name].taxNote,
  }));

export function D27a() {
  const [done, setDone] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const text = trades.map((t) => `${t.action} ${money(t.amount)} ${t.vehicle} (${t.name})`).join("\n");
  return (
    <div style={{ background: "#f7f7f5", color: "#1a1a1a", fontFamily: "'IBM Plex Sans', sans-serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div><b>{done.length} of {trades.length}</b> checked · net cash impact {money(trades.reduce((s, t) => s + (t.action === "Sell" ? t.amount : -t.amount), 0), 0, true)}</div>
        <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); }} style={{ border: "1px solid #1a1a1a", background: "#fff", padding: "6px 10px" }}>{copied ? "Copied" : "Copy list"}</button>
      </div>
      {trades.map((t) => (
        <label key={t.name} style={{ display: "grid", gridTemplateColumns: "24px 70px 1fr 120px", gap: 8, alignItems: "center", background: "#fff", marginTop: 8, padding: 10 }}>
          <input type="checkbox" checked={done.includes(t.name)} onChange={() => setDone((d) => d.includes(t.name) ? d.filter((x) => x !== t.name) : [...d, t.name])} />
          <b style={{ color: t.action === "Sell" ? "#a33b2b" : "#1f7a4d" }}>{t.action}</b>
          <span>{t.vehicle} · {t.name}</span>
          <span style={{ textAlign: "right" }}>{money(t.amount)}</span>
        </label>
      ))}
    </div>
  );
}

export function D27b() {
  const [tax, setTax] = useState(false);
  return (
    <div style={{ background: "#fff", color: "#161616", fontFamily: "'Outfit', sans-serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22 }}>Before, the trades, after</div>
        <button onClick={() => setTax((v) => !v)} style={{ background: tax ? "#161616" : "#fff", color: tax ? "#fff" : "#161616", border: "1px solid #161616", padding: "6px 10px" }}>{tax ? "Tax-aware on" : "Tax-aware off"}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
        {["Now", "After"].map((label) => (
          <div key={label}>
            <div style={{ fontSize: 12, letterSpacing: "0.12em" }}>{label.toUpperCase()}</div>
            {driftRows.map((d) => {
              const w = label === "Now" ? d.weight : d.target;
              return <div key={d.name} style={{ display: "grid", gridTemplateColumns: "110px 1fr 48px", gap: 6, alignItems: "center", marginTop: 4, fontSize: 12 }}><span>{d.name}</span><span style={{ height: 8, background: "#f2f2f2" }}><i style={{ display: "block", height: "100%", width: `${w * 100}%`, background: label === "Now" ? "#1d4e89" : "#2f6b4f" }} /></span><span>{pct(w, 0, false)}</span></div>;
            })}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        {trades.map((t) => (
          <div key={t.name} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #eee", padding: "6px 0", fontSize: 14 }}>
            <span>{t.action} {tax ? t.taxVehicle : t.vehicle}</span>
            <span>{money(t.action === "Sell" && tax && t.name === "Crypto" ? t.amount * 0.5 : t.amount)}</span>
          </div>
        ))}
      </div>
      {tax && <p style={{ fontSize: 13, color: "#6b5344" }}>{vehicleFor["US Equity"].taxNote} {vehicleFor.Crypto.taxNote} Crypto trim halved so less short-term gain is realised.</p>}
    </div>
  );
}

export function D27c() {
  const [step, setStep] = useState(0);
  const [ok, setOk] = useState(false);
  const titles = ["Review the drift", "Proposed trades", "Tax notes", "Confirm"];
  return (
    <div style={{ background: "#142033", color: "#f4f7fb", fontFamily: "'Space Grotesk', sans-serif", padding: 18, minHeight: 360 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {titles.map((t, i) => <button key={t} onClick={() => setStep(i)} style={{ flex: 1, background: i === step ? "#f4f7fb" : "transparent", color: i === step ? "#142033" : "#f4f7fb", border: "1px solid #31445e", padding: 8 }}>{i + 1}. {t}</button>)}
      </div>
      <div style={{ marginTop: 16, minHeight: 180 }}>
        {step === 0 && driftRows.filter((d) => Math.abs(d.drift) > 0.01).map((d) => <div key={d.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #24344c" }}><span>{d.name}</span><span>{pct(d.drift, 1)} · {d.gap > 0 ? "sell" : "buy"} {money(Math.abs(d.gap))}</span></div>)}
        {step === 1 && trades.map((t) => <div key={t.name} style={{ padding: "8px 0", borderBottom: "1px solid #24344c" }}>{t.action} {money(t.amount)} of {t.vehicle} to move {t.name}.</div>)}
        {step === 2 && <div style={{ fontSize: 16, lineHeight: 1.5 }}>{trades.map((t) => <p key={t.name}>{t.note}</p>)}<p>No trade here is sent to a broker. This is a receipt of intent.</p></div>}
        {step === 3 && <div style={{ fontSize: 28 }}>{ok ? "Noted. Nothing was traded." : "Confirm the list as a plan, not an order."}</div>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} style={{ background: "transparent", color: "#f4f7fb", border: "1px solid #31445e", padding: "8px 12px" }}>Back</button>
        {step < 3 ? <button onClick={() => setStep(step + 1)} style={{ background: "#f4f7fb", color: "#142033", border: 0, padding: "8px 12px" }}>Next</button> : <button onClick={() => setOk(true)} style={{ background: "#f0c36a", color: "#142033", border: 0, padding: "8px 12px" }}>Confirm plan</button>}
      </div>
    </div>
  );
}
