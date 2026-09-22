export const dynamic = "force-dynamic";

const groups = [
  { size: "Huge", items: "1 World markets map · 2 Sector heatmap · 3 Yield curve · 5 Market breadth · 10 Economic calendar · 14 Fear & greed" },
  { size: "Big", items: "19 Index comparison · 22 Market cap leaders · 26 Earnings calendar · 30 Rating changes · 33 ETF flows · 38 Policy rates · 41 Dollar index · 49 Seasonality · 50 Crypto overview" },
  { size: "Medium", items: "51 Index snapshot · 53 FX pair · 56 A/D line · 59 VIX · 62 Credit spreads · 65 Inflation · 70 Commodity history · 79 EM vs DM · 81 Growth vs value · 85 Margin debt · 86 Retail sentiment · 90 Thematic baskets" },
  { size: "Small", items: "91 Market pulse · 92 Index strip · 96 Biggest mover · 98 F&G dial · 100 Sector bar · 104 Curve snapshot · 109 52-week range · 113 Rate probability" },
  { size: "Tiny", items: "118 Index level · 122 Up/down arrow · 124 % badge · 125 Open/closed badge · 131 Rate countdown" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07080c] px-6 py-16 text-slate-100">
      <section className="mx-auto w-full max-w-3xl">
        <p className="m-0 text-xs uppercase tracking-[0.18em] text-indigo-400">Meridian</p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05]">
          120 component design explorations
        </h1>
        <p className="mt-4 text-slate-400">
          Three independent design directions for each of 40 selected Markets components — huge, big,
          medium, small and tiny — with invented but realistic market data and interactive behaviour.
        </p>
        <a
          href="/designs.html"
          className="mt-8 inline-block rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-400"
        >
          Open the design showcase →
        </a>
        <div className="mt-12 space-y-4">
          {groups.map((g) => (
            <div key={g.size} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{g.size}</div>
              <div className="mt-2 text-sm text-slate-300">{g.items}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
