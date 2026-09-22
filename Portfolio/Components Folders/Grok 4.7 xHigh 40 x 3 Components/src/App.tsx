import { useEffect, useMemo, useState } from "react";
import { investor, positions, totalValue } from "./data";
import { money } from "./lib";
import { D1a, D1b, D1c, D2a, D2b, D2c, D3a, D3b, D3c } from "./designs/a";
import { D4a, D4b, D4c, D5a, D5b, D5c, D6a, D6b, D6c } from "./designs/b";
import { D7a, D7b, D7c, D8a, D8b, D8c, D9a, D9b, D9c } from "./designs/c";
import { D10a, D10b, D10c, D11a, D11b, D11c, D12a, D12b, D12c } from "./designs/d";
import { D13a, D13b, D13c, D14a, D14b, D14c, D15a, D15b, D15c } from "./designs/e";
import { D16a, D16b, D16c, D17a, D17b, D17c, D18a, D18b, D18c } from "./designs/f";
import { D19a, D19b, D19c, D20a, D20b, D20c, D21a, D21b, D21c } from "./designs/g";
import { D22a, D22b, D22c, D23a, D23b, D23c, D24a, D24b, D24c } from "./designs/h";
import { D25a, D25b, D25c, D26a, D26b, D26c, D27a, D27b, D27c } from "./designs/i";
import { D28a, D28b, D28c, D29a, D29b, D29c, D30a, D30b, D30c } from "./designs/j";

const studies = [
  { n: 1, title: "Total value", brief: "The portfolio's current total value, with how much it has changed today.", designs: [D1a, D1b, D1c] },
  { n: 2, title: "Value vs net invested", brief: "Portfolio value over time against the money put in, so the gap is the gain.", designs: [D2a, D2b, D2c] },
  { n: 3, title: "Range and benchmark controls", brief: "Change the time range of a chart and compare it with a market index.", designs: [D3a, D3b, D3c] },
  { n: 4, title: "Key figures", brief: "Amount invested, cash, unrealised gain, and today's change.", designs: [D4a, D4b, D4c] },
  { n: 5, title: "Portfolio Pulse", brief: "A short plain-language summary of what changed and what deserves attention.", designs: [D5a, D5b, D5c] },
  { n: 6, title: "Chart modes", brief: "One chart that can switch between total value, percentage return and drawdown.", designs: [D6a, D6b, D6c] },
  { n: 7, title: "Return methods", brief: "Money-weighted and time-weighted returns, compared with a benchmark.", designs: [D7a, D7b, D7c] },
  { n: 8, title: "Yield", brief: "Income yield, both forward yield and yield on cost.", designs: [D8a, D8b, D8c] },
  { n: 9, title: "Data freshness note", brief: "How old the prices are, and which exchange rates were used.", designs: [D9a, D9b, D9c] },
  { n: 10, title: "Sync status", brief: "When the data was last updated.", designs: [D10a, D10b, D10c] },
  { n: 11, title: "Currency switch", brief: "View the book in a chosen base currency.", designs: [D11a, D11b, D11c] },
  { n: 12, title: "Privacy mode", brief: "Hide money amounts. Keep percentages visible.", designs: [D12a, D12b, D12c] },
  { n: 13, title: "Goal progress", brief: "Progress towards a target amount by a target date.", designs: [D13a, D13b, D13c] },
  { n: 14, title: "Allocation at a glance", brief: "How the book splits across asset classes, with each class's target marked.", designs: [D14a, D14b, D14c] },
  { n: 15, title: "Drift from target", brief: "How far each asset class is over or under target, and what to move.", designs: [D15a, D15b, D15c] },
  { n: 16, title: "Allocation breakdown", brief: "See allocation by holding, region, sector and asset type.", designs: [D16a, D16b, D16c] },
  { n: 17, title: "Chart or table", brief: "The same allocation data as a chart or a sortable table.", designs: [D17a, D17b, D17c] },
  { n: 18, title: "Home bias", brief: "How much sits in the home market versus everywhere else.", designs: [D18a, D18b, D18c] },
  { n: 19, title: "Headline exposure", brief: "One striking number for the biggest slice, with context.", designs: [D19a, D19b, D19c] },
  { n: 20, title: "Shape of the book", brief: "Plain-English observations about how the portfolio is built.", designs: [D20a, D20b, D20c] },
  { n: 21, title: "Cash view", brief: "Allocation with cash included or excluded.", designs: [D21a, D21b, D21c] },
  { n: 22, title: "Currency exposure", brief: "How much of the portfolio sits in each currency.", designs: [D22a, D22b, D22c] },
  { n: 23, title: "Geography", brief: "Where in the world the money is exposed.", designs: [D23a, D23b, D23c] },
  { n: 24, title: "Sector ranking", brief: "Sectors ranked, with how many holdings sit in each.", designs: [D24a, D24b, D24c] },
  { n: 25, title: "Cash by account", brief: "Cash balances, each interest rate, and the blended rate.", designs: [D25a, D25b, D25c] },
  { n: 26, title: "Put cash to work", brief: "A prompt to invest idle cash.", designs: [D26a, D26b, D26c] },
  { n: 27, title: "Rebalance helper", brief: "The trades that would bring the book back to target.", designs: [D27a, D27b, D27c] },
  { n: 28, title: "Money flow", brief: "How money flows from accounts, to asset classes, to holdings.", designs: [D28a, D28b, D28c] },
  { n: 29, title: "Allocation story", brief: "An editorial take on the allocation, with short callouts.", designs: [D29a, D29b, D29c] },
  { n: 30, title: "Holdings table", brief: "Every holding: name, price, position, value, gain or loss, and share of the book.", designs: [D30a, D30b, D30c] },
];

const letters = ["a", "b", "c"];

export default function App() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(1);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return studies;
    return studies.filter((item) => `${item.n} ${item.title} ${item.brief}`.toLowerCase().includes(s));
  }, [q]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-study]");
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(Number(hit.target.getAttribute("data-study")));
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: [0.1, 0.25] },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [filtered]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "252px minmax(1080px, 1fr)", minHeight: "100vh", background: "#e4dccf", color: "#1c1915" }}>
      <aside className="nav-scroll" style={{ position: "sticky", top: 0, height: "100vh", overflow: "auto", background: "#1c1915", color: "#f3eadc", padding: "22px 14px 28px" }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, lineHeight: 0.9 }}>Meridian</div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b5a48e", marginTop: 6 }}>Portfolio studies</div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8d7d68", marginTop: 10, lineHeight: 1.45 }}>
          {investor.name} · {money(totalValue)} · {positions.length} holdings
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a component"
          style={{ width: "100%", marginTop: 14, background: "#2a251f", color: "#f3eadc", border: "1px solid #3d342c", padding: "8px 10px", fontFamily: "'IBM Plex Sans', sans-serif" }}
        />
        <nav style={{ marginTop: 14, display: "grid", gap: 2 }}>
          {studies.map((s) => (
            <a
              key={s.n}
              href={`#study-${s.n}`}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr",
                gap: 6,
                textDecoration: "none",
                color: active === s.n ? "#1c1915" : "#e7dccb",
                background: active === s.n ? "#f0c36a" : "transparent",
                padding: "5px 6px",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 13,
              }}
            >
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.8 }}>{String(s.n).padStart(2, "0")}</span>
              <span>{s.title}</span>
            </a>
          ))}
        </nav>
      </aside>
      <main style={{ padding: "36px 36px 80px" }}>
        <header style={{ maxWidth: 820, marginBottom: 36 }}>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a6d5d" }}>Ninety designs · thirty components · three each</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 64, lineHeight: 0.92, margin: "10px 0 12px" }}>Ways of looking at the book.</h1>
          <p style={{ fontFamily: "'Newsreader', serif", fontSize: 20, lineHeight: 1.45, margin: 0, color: "#3e342b" }}>
            A design study for Meridian’s Portfolio section. Each component is shown three times, labeled a, b and c. They are proposals, not a system. The household behind the numbers is {investor.name} of {investor.city}, marked {investor.asOfStamp}.
          </p>
        </header>
        {filtered.map((s) => (
          <section key={s.n} id={`study-${s.n}`} data-study={s.n} style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.14em", color: "#8a7b68" }}>COMPONENT {String(s.n).padStart(2, "0")}</div>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 40, margin: "4px 0" }}>{s.title}</h2>
                <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", color: "#5e5348", maxWidth: 680 }}>{s.brief}</p>
              </div>
            </div>
            <div style={{ display: "grid", gap: 28 }}>
              {s.designs.map((Comp, i) => (
                <article key={letters[i]} className="design-frame">
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, letterSpacing: "0.08em" }}>{s.n}.{letters[i]}</span>
                  </div>
                  <div className="study-canvas" style={{ background: "#fff", boxShadow: "0 18px 40px rgba(50, 36, 20, 0.08)", overflow: "hidden" }}>
                    <Comp />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && <p style={{ fontFamily: "'Newsreader', serif", fontSize: 24 }}>Nothing matches that search.</p>}
      </main>
    </div>
  );
}
