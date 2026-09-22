import { useEffect, useMemo, useState, type ReactElement } from "react";
import { AS_OF, INVESTOR, TOTAL } from "@/lib/data";
import { money } from "@/lib/format";
import { D1a, D1b, D1c, D2a, D2b, D2c, D4a, D4b, D4c } from "@/designs/huge1";
import { D15a, D15b, D15c, D7a, D7b, D7c, D8a, D8b, D8c } from "@/designs/huge2";
import { D19a, D19b, D19c, D21a, D21b, D21c, D22a, D22b, D22c, D23a, D23b, D23c } from "@/designs/big1";
import { D26a, D26b, D26c, D27a, D27b, D27c, D30a, D30b, D30c, D41a, D41b, D41c, D45a, D45b, D45c } from "@/designs/big2";
import { D51a, D51b, D51c, D52a, D52b, D52c, D54a, D54b, D54c, D61a, D61b, D61c, D68a, D68b, D68c, D73a, D73b, D73c } from "@/designs/medium1";
import { D81a, D81b, D81c, D83a, D83b, D83c, D84a, D84b, D84c, D86a, D86b, D86c, D89a, D89b, D89c, D90a, D90b, D90c } from "@/designs/medium2";
import { D91a, D91b, D91c, D93a, D93b, D93c, D94a, D94b, D94c, D96a, D96b, D96c, D97a, D97b, D97c, D101a, D101b, D101c, D114a, D114b, D114c, D116a, D116b, D116c } from "@/designs/small";
import { D118a, D118b, D118c, D119a, D119b, D119c, D122a, D122b, D122c, D126a, D126b, D126c, D134a, D134b, D134c } from "@/designs/tiny";

type Size = "Huge" | "Big" | "Medium" | "Small" | "Tiny";
type Design = { id: string; name: string; intent: string; C: () => ReactElement };
type Specimen = { n: number; size: Size; title: string; brief: string; designs: Design[] };

const specimens: Specimen[] = [
  { n: 1, size: "Huge", title: "Holdings table", brief: "Every holding: name, price, position, value, gain or loss, and share of the portfolio.", designs: [
    { id: "1.a", name: "Private ledger", intent: "Sortable book. Search, account chips, and a row that opens.", C: D1a },
    { id: "1.b", name: "Floor tape", intent: "Sparkline rows, a pinned position dock, arrow keys.", C: D1b },
    { id: "1.c", name: "Four statements", intent: "The same book, split by account, with a combine switch.", C: D1c },
  ]},
  { n: 2, size: "Huge", title: "Overview hero", brief: "Total value, today’s change, key figures, and value over time, together.", designs: [
    { id: "2.a", name: "Opening bell", intent: "Private-bank split. Period tabs and a crosshair.", C: D2a },
    { id: "2.b", name: "Night board", intent: "The value as typography. A horizon line. Cash contributed on demand.", C: D2b },
    { id: "2.c", name: "Sunday edition", intent: "A newspaper masthead. Click the markers.", C: D2c },
  ]},
  { n: 4, size: "Huge", title: "Holdings map", brief: "Every holding, relative size and performance at a glance.", designs: [
    { id: "4.a", name: "Weight map", intent: "Treemap. Recolour by gain, by day, or by class.", C: D4a },
    { id: "4.b", name: "Orbits", intent: "Bubbles sized by money or by risk. Click to pin.", C: D4b },
    { id: "4.c", name: "Quilt", intent: "Class columns, holdings stacked inside.", C: D4c },
  ]},
  { n: 7, size: "Huge", title: "Correlation", brief: "How the holdings move relative to each other.", designs: [
    { id: "7.a", name: "Matrix", intent: "Heatmap. Hover a cell, pin a sentence.", C: D7a },
    { id: "7.b", name: "Chord", intent: "A threshold slider hides the polite acquaintances.", C: D7b },
    { id: "7.c", name: "Couples", intent: "The tightest pairs and the strangers, as cards.", C: D7c },
  ]},
  { n: 8, size: "Huge", title: "Future projection", brief: "A plausible range of outcomes, not a single forecast.", designs: [
    { id: "8.a", name: "Fan", intent: "Percentile bands. Horizon, contribution and return are sliders.", C: D8a },
    { id: "8.b", name: "Three futures", intent: "Guarded, central, bright. Nudge each assumption.", C: D8b },
    { id: "8.c", name: "Terminal wealth", intent: "A histogram and a goal you can drag.", C: D8c },
  ]},
  { n: 15, size: "Huge", title: "Monthly returns", brief: "The portfolio’s return for every month over a long stretch.", designs: [
    { id: "15.a", name: "Verdict grid", intent: "Year by month. Click a cell. Toggle excess.", C: D15a },
    { id: "15.b", name: "Small multiples", intent: "One bar chart per year. Hover syncs the month.", C: D15b },
    { id: "15.c", name: "Climate stripe", intent: "One ribbon, then the distribution it came from.", C: D15c },
  ]},
  { n: 19, size: "Big", title: "Drawdown", brief: "How far the portfolio has fallen from previous peaks.", designs: [
    { id: "19.a", name: "Underwater", intent: "The area beneath zero. Hover for the date.", C: D19a },
    { id: "19.b", name: "Episodes", intent: "Each decline as a bar of falling, then healing.", C: D19b },
    { id: "19.c", name: "Recovery desk", intent: "Today’s distance, set beside an older fall.", C: D19c },
  ]},
  { n: 21, size: "Big", title: "Rebalance plan", brief: "The trades that would move the book back toward target.", designs: [
    { id: "21.a", name: "Drift and tickets", intent: "Policy bars plus a taxable-only filter.", C: D21a },
    { id: "21.b", name: "Blotter", intent: "Stage or unstage each ticket. Cash and tax update.", C: D21b },
    { id: "21.c", name: "Transfer map", intent: "Sells on the left, buys on the right.", C: D21c },
  ]},
  { n: 22, size: "Big", title: "Return bridge", brief: "How the book got from a starting value to today.", designs: [
    { id: "22.a", name: "Waterfall", intent: "Columns that add. Click a step.", C: D22a },
    { id: "22.b", name: "The walk", intent: "A narrative list. Expand a definition.", C: D22b },
    { id: "22.c", name: "Statement", intent: "An accounting reconciliation, three windows.", C: D22c },
  ]},
  { n: 23, size: "Big", title: "Holding detail panel", brief: "One holding: position, cost, gain, weight, trend and history.", designs: [
    { id: "23.a", name: "Quote", intent: "A dark instrument panel and a switcher.", C: D23a },
    { id: "23.b", name: "Dossier", intent: "Tabs for position, history, income, risk.", C: D23b },
    { id: "23.c", name: "Profile", intent: "An editorial page. Lots on request.", C: D23c },
  ]},
  { n: 26, size: "Big", title: "Relative performance", brief: "The portfolio against a chosen benchmark over time.", designs: [
    { id: "26.a", name: "Growth of 100", intent: "Two lines. Three benchmarks.", C: D26a },
    { id: "26.b", name: "Excess only", intent: "The gap, and nothing else.", C: D26b },
    { id: "26.c", name: "Period race", intent: "Paired bars and the gap, by window.", C: D26c },
  ]},
  { n: 27, size: "Big", title: "Attribution", brief: "Which holdings contributed most to the return, and by how much.", designs: [
    { id: "27.a", name: "Contribution waterfall", intent: "Points of return, holding by holding.", C: D27a },
    { id: "27.b", name: "Bars and ticks", intent: "Contribution as a bar, weight as a tick.", C: D27b },
    { id: "27.c", name: "Helped and hurt", intent: "Two lists that reconcile to the year.", C: D27c },
  ]},
  { n: 30, size: "Big", title: "Dividend calendar", brief: "When income is expected, and how much.", designs: [
    { id: "30.a", name: "Wall calendar", intent: "Twelve months, then the days inside one.", C: D30a },
    { id: "30.b", name: "Stems", intent: "A timeline. Filter the kind of payment.", C: D30b },
    { id: "30.c", name: "Forecast", intent: "Monthly bars and the next payments. Interest optional.", C: D30c },
  ]},
  { n: 41, size: "Big", title: "Risk contribution", brief: "Each holding’s share of risk beside its share of money.", designs: [
    { id: "41.a", name: "Paired bars", intent: "Weight in blue, risk in red.", C: D41a },
    { id: "41.b", name: "Slope", intent: "A line from weight to risk. Steep means mismatch.", C: D41b },
    { id: "41.c", name: "Two stacks", intent: "Remove a name and watch the risk budget restate.", C: D41c },
  ]},
  { n: 45, size: "Big", title: "Milestones", brief: "The journey, and the notable values along it.", designs: [
    { id: "45.a", name: "Chronicle", intent: "A vertical list. Click a year.", C: D45a },
    { id: "45.b", name: "Pins", intent: "Markers on the value line.", C: D45b },
    { id: "45.c", name: "Transit", intent: "Stations. You are here.", C: D45c },
  ]},
  { n: 51, size: "Medium", title: "Key figures", brief: "Amount invested, cash, unrealised gain, and today’s change.", designs: [
    { id: "51.a", name: "Four tiles", intent: "Click a tile for the definition.", C: D51a },
    { id: "51.b", name: "Ruled row", intent: "One line, hairline rules.", C: D51b },
    { id: "51.c", name: "Slip", intent: "A printed ticket. Turn it over.", C: D51c },
  ]},
  { n: 52, size: "Medium", title: "Drift from target", brief: "How far each asset class sits from its target, and what would close it.", designs: [
    { id: "52.a", name: "Bullets", intent: "Actual bar, target bar, dollar gap.", C: D52a },
    { id: "52.b", name: "From zero", intent: "Diverging bars. Percent or dollars.", C: D52b },
    { id: "52.c", name: "Tracks", intent: "A puck and a notch.", C: D52c },
  ]},
  { n: 54, size: "Medium", title: "Income over time", brief: "Dividends and interest received over time.", designs: [
    { id: "54.a", name: "Stacked months", intent: "Dividends and interest. Pick a year.", C: D54a },
    { id: "54.b", name: "Running total", intent: "Click any month on the cumulative path.", C: D54b },
    { id: "54.c", name: "Season", intent: "A heatmap of when the book pays.", C: D54c },
  ]},
  { n: 61, size: "Medium", title: "Score drivers", brief: "Which holdings lift the health score, and which drag it down.", designs: [
    { id: "61.a", name: "Forces", intent: "Diverging bars, one per holding.", C: D61a },
    { id: "61.b", name: "Two piles", intent: "Lifting on the left, dragging on the right.", C: D61b },
    { id: "61.c", name: "Pull", intent: "The score in the middle, holdings on strings.", C: D61c },
  ]},
  { n: 68, size: "Medium", title: "Leaders and laggards", brief: "The holdings that have gained or lost the most recently.", designs: [
    { id: "68.a", name: "Two lists", intent: "Top five and bottom five. Change the window.", C: D68a },
    { id: "68.b", name: "From the centre", intent: "Winners right, losers left.", C: D68b },
    { id: "68.c", name: "Podium", intent: "Three winners, three warnings, the rest on request.", C: D68c },
  ]},
  { n: 73, size: "Medium", title: "Currency exposure", brief: "How much of the portfolio sits in each currency.", designs: [
    { id: "73.a", name: "Donut", intent: "Click a slice. The centre names it.", C: D73a },
    { id: "73.b", name: "One bar", intent: "A single 100% strip. Click to see the path.", C: D73b },
    { id: "73.c", name: "FX table", intent: "Share, amount, and the currency’s own move.", C: D73c },
  ]},
  { n: 81, size: "Medium", title: "Asset-class cards", brief: "Each asset class with value, share, return and trend.", designs: [
    { id: "81.a", name: "Equal cards", intent: "A sparkline on every class. Month or year.", C: D81a },
    { id: "81.b", name: "Bento", intent: "Bigger classes take more of the desk.", C: D81b },
    { id: "81.c", name: "Ghost target", intent: "A list with the target marked as a notch.", C: D81c },
  ]},
  { n: 83, size: "Medium", title: "Holding card", brief: "One holding’s value, cost, gain, weight and trend, as a card.", designs: [
    { id: "83.a", name: "Instrument", intent: "A dark card you can retarget.", C: D83a },
    { id: "83.b", name: "Trading card", intent: "Flip it. Deal another name.", C: D83b },
    { id: "83.c", name: "Swiss", intent: "Ticker, one line, four numbers.", C: D83c },
  ]},
  { n: 84, size: "Medium", title: "Benchmark scoreboard", brief: "The portfolio against a benchmark for each time period.", designs: [
    { id: "84.a", name: "Lights", intent: "Five windows. The winner is named.", C: D84a },
    { id: "84.b", name: "Table", intent: "Switch the benchmark. Read the gap.", C: D84b },
    { id: "84.c", name: "Mini races", intent: "Two strokes per period.", C: D84c },
  ]},
  { n: 86, size: "Medium", title: "Monthly recap", brief: "What changed over the last full month.", designs: [
    { id: "86.a", name: "Letter", intent: "An advisor’s note for February.", C: D86a },
    { id: "86.b", name: "Diff", intent: "Start, change, end. Isolate flow or market.", C: D86b },
    { id: "86.c", name: "Headline", intent: "Chips, then the mix if you ask.", C: D86c },
  ]},
  { n: 89, size: "Medium", title: "Fund comparison", brief: "Two funds, side by side, on cost, holdings and performance.", designs: [
    { id: "89.a", name: "Spec sheets", intent: "VTI against an active fund. Click a row.", C: D89a },
    { id: "89.b", name: "Radar", intent: "Six arms. Click a label.", C: D89b },
    { id: "89.c", name: "Verdict", intent: "A recommendation, with the evidence folded.", C: D89c },
  ]},
  { n: 90, size: "Medium", title: "Fee impact", brief: "How much fees could cost over the next 20 years.", designs: [
    { id: "90.a", name: "Two lines", intent: "Gross and net. Slide the fee and the years.", C: D90a },
    { id: "90.b", name: "The pile", intent: "Each year adds to what the fee took.", C: D90b },
    { id: "90.c", name: "A fake holding", intent: "The fee, ranked as if it were a position.", C: D90c },
  ]},
  { n: 91, size: "Small", title: "Portfolio pulse", brief: "A short plain-language summary of what changed and what deserves attention.", designs: [
    { id: "91.a", name: "Sentences", intent: "Three sentences. Click one to mark it.", C: D91a },
    { id: "91.b", name: "Status", intent: "Three readings. One is open.", C: D91b },
    { id: "91.c", name: "Feed", intent: "A numbered tape. Today or the week.", C: D91c },
  ]},
  { n: 93, size: "Small", title: "Concentration", brief: "How much of the portfolio sits in its largest few holdings.", designs: [
    { id: "93.a", name: "The fraction", intent: "Top 1, 5 or 10, as a single number.", C: D93a },
    { id: "93.b", name: "The strip", intent: "Largest lines, then the rest.", C: D93b },
    { id: "93.c", name: "The curve", intent: "A sentence and how fast the weight adds up.", C: D93c },
  ]},
  { n: 94, size: "Small", title: "Goal progress", brief: "Progress toward a target amount by a target date.", designs: [
    { id: "94.a", name: "Track", intent: "A bar, and the pace that would finish it.", C: D94a },
    { id: "94.b", name: "Ring", intent: "Click to see the gap instead of the progress.", C: D94b },
    { id: "94.c", name: "Pace", intent: "Required return beside last year’s return.", C: D94c },
  ]},
  { n: 96, size: "Small", title: "Returns by period", brief: "Today, the week, the month, year to date, one year, and all time.", designs: [
    { id: "96.a", name: "Pills", intent: "Six chips. Pin one.", C: D96a },
    { id: "96.b", name: "Rules", intent: "A typographic row, nothing else.", C: D96b },
    { id: "96.c", name: "Spikes", intent: "Bars from a baseline. Click one.", C: D96c },
  ]},
  { n: 97, size: "Small", title: "Risk level", brief: "A quick read on how risky the portfolio is overall.", designs: [
    { id: "97.a", name: "Gauge", intent: "A word, a needle, a reason on click.", C: D97a },
    { id: "97.b", name: "Scale", intent: "Calm to hot. The dot is the book.", C: D97b },
    { id: "97.c", name: "Wordmark", intent: "One word. The numbers are underneath.", C: D97c },
  ]},
  { n: 101, size: "Small", title: "Cash drag", brief: "How much idle cash is costing in missed returns.", designs: [
    { id: "101.a", name: "The number", intent: "Slide the comparison return.", C: D101a },
    { id: "101.b", name: "Two jars", intent: "Cash yield beside an equity pace.", C: D101b },
    { id: "101.c", name: "Warning slip", intent: "The cost, then the arithmetic.", C: D101c },
  ]},
  { n: 114, size: "Small", title: "Health dial", brief: "The health score in a compact form.", designs: [
    { id: "114.a", name: "Ring", intent: "72, and the factors if you ask.", C: D114a },
    { id: "114.b", name: "Tachometer", intent: "Zones. The needle sits in Sound.", C: D114b },
    { id: "114.c", name: "Grade", intent: "A letter, and the reason it isn’t an A.", C: D114c },
  ]},
  { n: 116, size: "Small", title: "Income goal progress", brief: "How the portfolio’s income compares with a target.", designs: [
    { id: "116.a", name: "Bar", intent: "Annual or monthly, same gap.", C: D116a },
    { id: "116.b", name: "Run rate", intent: "What arrives each month, against what is needed.", C: D116b },
    { id: "116.c", name: "Shortfall", intent: "The gap, and what would close it.", C: D116c },
  ]},
  { n: 118, size: "Tiny", title: "Total value", brief: "The portfolio’s current total value.", designs: [
    { id: "118.a", name: "Serif", intent: "A captioned figure. Click to mask it.", C: D118a },
    { id: "118.b", name: "Terminal", intent: "A NAV line. Click to blank it.", C: D118b },
    { id: "118.c", name: "Dollars and cents", intent: "The cents can leave.", C: D118c },
  ]},
  { n: 119, size: "Tiny", title: "Day change", brief: "Today’s change in value, in currency and percent.", designs: [
    { id: "119.a", name: "Pill", intent: "Cycle currency, percent, or both.", C: D119a },
    { id: "119.b", name: "Tape", intent: "A signed figure and a small bar.", C: D119b },
    { id: "119.c", name: "Tile", intent: "A square that can invert.", C: D119c },
  ]},
  { n: 122, size: "Tiny", title: "Trend line", brief: "A very small trend indicator, sized to sit inside a table row.", designs: [
    { id: "122.a", name: "Line", intent: "Classic spark, shown in a column of rows.", C: D122a },
    { id: "122.b", name: "Bars", intent: "Sixteen marks, no line.", C: D122b },
    { id: "122.c", name: "Slope", intent: "First point to last, and a dot.", C: D122c },
  ]},
  { n: 126, size: "Tiny", title: "Gain", brief: "A holding’s gain or loss, in currency and percent, as it appears in a row.", designs: [
    { id: "126.a", name: "Stack", intent: "Dollars over percent. Switch the emphasis.", C: D126a },
    { id: "126.b", name: "Triangle", intent: "A mark, then both numbers.", C: D126b },
    { id: "126.c", name: "Parentheses", intent: "Accounting style. Losses in brackets.", C: D126c },
  ]},
  { n: 134, size: "Tiny", title: "Asset-type badge", brief: "A small label for stock, fund, crypto or cash.", designs: [
    { id: "134.a", name: "Outline", intent: "Quiet chips. One is filled.", C: D134a },
    { id: "134.b", name: "Stamps", intent: "Square colour blocks.", C: D134b },
    { id: "134.c", name: "Mono tags", intent: "Bracketed codes, like a blotter.", C: D134c },
  ]},
];

const sizes: Array<Size | "All"> = ["All", "Huge", "Big", "Medium", "Small", "Tiny"];

export default function App() {
  const [size, setSize] = useState<Size | "All">("All");
  const [q, setQ] = useState("");
  const [active, setActive] = useState("c1");
  const shown = useMemo(
    () =>
      specimens.filter((s) => (size === "All" || s.size === size) && `${s.n} ${s.title} ${s.brief}`.toLowerCase().includes(q.toLowerCase())),
    [size, q],
  );
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-specimen]");
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [shown]);
  const surprise = () => {
    const all = shown.flatMap((s) => s.designs);
    const pick = all[Math.floor(Math.random() * all.length)];
    if (pick) document.getElementById(pick.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="min-h-screen" style={{ background: "#e6dfd2", color: "#1c1915" }}>
      <aside className="fixed bottom-0 left-0 top-0 z-20 hidden w-[272px] flex-col border-r border-[#2a241c] bg-[#16140f] text-[#f3ecdf] lg:flex">
        <div className="border-b border-[#2e2922] px-5 py-5">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="h-7 w-7 text-[#e0b07a]">
              <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M16 5 L18 16 L16 27 L14 16 Z" fill="currentColor" />
            </svg>
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#e0b07a]">Meridian</div>
              <div className="text-sm text-[#cfc4b4]">Specimen library</div>
            </div>
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search components" className="mt-4 w-full rounded-lg border border-[#3a342c] bg-[#100e0c] px-3 py-2 text-sm outline-none placeholder:text-[#7d7368]" />
        </div>
        <nav className="flex-1 overflow-auto px-3 py-3">
          {sizes.slice(1).map((group) => {
            const items = shown.filter((s) => s.size === group);
            if (!items.length) return null;
            return (
              <div key={group} className="mb-4">
                <div className="px-2 pb-1 text-[10px] uppercase tracking-[0.18em] text-[#8d8274]">{group}</div>
                {items.map((s) => (
                  <a key={s.n} href={`#c${s.n}`} className={`flex items-baseline gap-2 rounded-md px-2 py-1.5 text-[13px] ${active === `c${s.n}` ? "bg-[#2a241c] text-white" : "text-[#d9d0c3] hover:bg-[#221e18]"}`}>
                    <span className="w-7 tabular text-[#e0b07a]">{String(s.n).padStart(2, "0")}</span>
                    <span className="truncate">{s.title}</span>
                  </a>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="border-t border-[#2e2922] px-5 py-3 text-[11px] text-[#8d8274]">{shown.length} components · {shown.reduce((s, x) => s + x.designs.length, 0)} designs</div>
      </aside>
      <main className="lg:pl-[272px]">
        <header className="border-b border-[#d9d0c2] px-6 py-8 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#8a5a32]">Portfolio · design specimens</div>
              <h1 className="mt-2 text-4xl leading-none tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>Forty components, drawn three ways.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5c5348]">
                A working review for Meridian. Each specimen is independent — layout, type and colour were not asked to agree. The sample book belongs to {INVESTOR}, as of {AS_OF}. Value {money(TOTAL)}. Prices are illustrative.
              </p>
            </div>
            <button type="button" onClick={surprise} className="rounded-full bg-[#16140f] px-4 py-2 text-sm text-[#f3ecdf]">Surprise me</button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button key={s} type="button" onClick={() => setSize(s)} className={`rounded-full px-3 py-1 text-xs ${size === s ? "bg-[#16140f] text-[#f3ecdf]" : "bg-[#f7f1e6] text-[#5c5348]"}`}>{s}</button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {shown.map((s) => (
              <a key={s.n} href={`#c${s.n}`} className="grid h-8 w-8 place-items-center rounded-md bg-[#f7f1e6] text-[11px] tabular text-[#5c5348] hover:bg-[#16140f] hover:text-white">{s.n}</a>
            ))}
          </div>
        </header>
        <div className="space-y-16 px-6 py-10 lg:px-10">
          {shown.map((s) => (
            <section key={s.n} id={`c${s.n}`} data-specimen className="scroll-mt-6">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a5a32]">{s.size} · {String(s.n).padStart(2, "0")}</div>
                  <h2 className="text-3xl tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>{s.title}</h2>
                  <p className="mt-1 max-w-2xl text-sm text-[#5c5348]">{s.brief}</p>
                </div>
              </div>
              <div className="space-y-8">
                {s.designs.map((d) => (
                  <article key={d.id} id={d.id} className="scroll-mt-6">
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-sm tracking-widest text-[#8a5a32]">{d.id}</span>
                        <span className="text-base" style={{ fontFamily: "Fraunces, serif" }}>{d.name}</span>
                      </div>
                      <p className="max-w-md text-right text-xs text-[#7a7064]">{d.intent}</p>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-[#d5cbbd] bg-white shadow-[0_24px_50px_-36px_rgba(40,30,10,0.7)]">
                      <div className="min-w-[1080px]">
                        <d.C />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
          {!shown.length && <p className="text-sm text-[#5c5348]">No component matches that search.</p>}
        </div>
      </main>
    </div>
  );
}
