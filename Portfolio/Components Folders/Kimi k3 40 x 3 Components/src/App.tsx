import { useState } from 'react';
import { ArrowUp, Layers } from 'lucide-react';
import type { Design } from './lib';

import { designs as d01 } from './components/c01';
import { designs as d02 } from './components/c02';
import { designs as d03 } from './components/c03';
import { designs as d04 } from './components/c04';
import { designs as d05 } from './components/c05';
import { designs as d06 } from './components/c06';
import { designs as d07 } from './components/c07';
import { designs as d08 } from './components/c08';
import { designs as d09 } from './components/c09';
import { designs as d10 } from './components/c10';
import { designs as d11 } from './components/c11';
import { designs as d12 } from './components/c12';
import { designs as d13 } from './components/c13';
import { designs as d14 } from './components/c14';
import { designs as d15 } from './components/c15';
import { designs as d16 } from './components/c16';
import { designs as d17 } from './components/c17';
import { designs as d18 } from './components/c18';
import { designs as d19 } from './components/c19';
import { designs as d20 } from './components/c20';
import { designs as d21 } from './components/c21';
import { designs as d22 } from './components/c22';
import { designs as d23 } from './components/c23';
import { designs as d24 } from './components/c24';
import { designs as d25 } from './components/c25';
import { designs as d26 } from './components/c26';
import { designs as d27 } from './components/c27';
import { designs as d28 } from './components/c28';
import { designs as d29 } from './components/c29';
import { designs as d30 } from './components/c30';

const SECTIONS: { n: number; title: string; desc: string; pages: string[]; designs: Design[] }[] = [
  { n: 1,  title: 'Total value', desc: 'The portfolio’s current total value, with how much it has changed today.', pages: ['Overview'], designs: d01 },
  { n: 2,  title: 'Value vs net invested', desc: 'Portfolio value over time against money put in — the gap is the gain.', pages: ['Overview', 'Performance'], designs: d02 },
  { n: 3,  title: 'Range & benchmark controls', desc: 'Change the time range of a chart and compare against a market index.', pages: ['Overview', 'Performance'], designs: d03 },
  { n: 4,  title: 'Key figures', desc: 'Headline numbers: invested, cash, unrealised gain, today’s change.', pages: ['Overview'], designs: d04 },
  { n: 5,  title: 'Portfolio Pulse', desc: 'Plain-language summary of what changed and what deserves attention.', pages: ['Overview'], designs: d05 },
  { n: 6,  title: 'Chart modes', desc: 'One chart switching between total value, % return and drawdown.', pages: ['Performance'], designs: d06 },
  { n: 7,  title: 'Return methods', desc: 'Money-weighted and time-weighted returns vs a benchmark.', pages: ['Performance'], designs: d07 },
  { n: 8,  title: 'Yield', desc: 'Income yield — forward yield and yield on cost.', pages: ['Performance'], designs: d08 },
  { n: 9,  title: 'Data freshness note', desc: 'How old prices are and which exchange rates were used.', pages: ['Overview', 'Performance', 'Holdings'], designs: d09 },
  { n: 10, title: 'Sync status', desc: 'Small indicator of when the data was last updated.', pages: ['Overview', 'Holdings'], designs: d10 },
  { n: 11, title: 'Currency switch', desc: 'View everything in a chosen base currency.', pages: ['Overview', 'Holdings', 'Analysis'], designs: d11 },
  { n: 12, title: 'Privacy mode', desc: 'Hides money amounts while keeping percentages visible.', pages: ['Overview', 'Holdings'], designs: d12 },
  { n: 13, title: 'Goal progress', desc: 'Progress towards a target amount by a target date.', pages: ['Overview'], designs: d13 },
  { n: 14, title: 'Allocation at a glance', desc: 'Asset-class split, compact, with each class’s target marked.', pages: ['Overview', 'Analysis'], designs: d14 },
  { n: 15, title: 'Drift from target', desc: 'How far each class is over/under target, and the $ to fix it.', pages: ['Analysis'], designs: d15 },
  { n: 16, title: 'Allocation breakdown', desc: 'See allocation by holding, region, sector and asset type.', pages: ['Analysis'], designs: d16 },
  { n: 17, title: 'Chart or table', desc: 'The same allocation data as a chart or a sortable table.', pages: ['Analysis'], designs: d17 },
  { n: 18, title: 'Home bias', desc: 'Home market vs everywhere else.', pages: ['Analysis'], designs: d18 },
  { n: 19, title: 'Headline exposure', desc: 'One striking number for the biggest slice, with context.', pages: ['Overview', 'Analysis'], designs: d19 },
  { n: 20, title: 'Shape of the book', desc: 'Plain-English observations about how the portfolio is built.', pages: ['Analysis'], designs: d20 },
  { n: 21, title: 'Cash view', desc: 'Allocation with cash included or excluded.', pages: ['Analysis'], designs: d21 },
  { n: 22, title: 'Currency exposure', desc: 'How much of the portfolio sits in each currency.', pages: ['Analysis'], designs: d22 },
  { n: 23, title: 'Geography', desc: 'Where in the world the money is exposed.', pages: ['Analysis'], designs: d23 },
  { n: 24, title: 'Sector ranking', desc: 'Ranked sectors with holding counts.', pages: ['Analysis'], designs: d24 },
  { n: 25, title: 'Cash by account', desc: 'Cash balances per account with rates and a blended rate.', pages: ['Analysis'], designs: d25 },
  { n: 26, title: 'Put cash to work', desc: 'Nudge to invest idle cash.', pages: ['Overview', 'Analysis'], designs: d26 },
  { n: 27, title: 'Rebalance helper', desc: 'The trades needed to get back to target allocation.', pages: ['Analysis'], designs: d27 },
  { n: 28, title: 'Money flow', desc: 'Accounts → asset classes → individual holdings.', pages: ['Analysis'], designs: d28 },
  { n: 29, title: 'Allocation story', desc: 'An editorial, storytelling take on the allocation.', pages: ['Analysis'], designs: d29 },
  { n: 30, title: 'Holdings table', desc: 'Every holding: name, price, position, value, gain/loss, share.', pages: ['Holdings'], designs: d30 },
];

const PAGES = ['All', 'Overview', 'Performance', 'Analysis', 'Holdings'];

export default function App() {
  const [page, setPage] = useState('All');
  const shown = SECTIONS.filter(s => page === 'All' || s.pages.includes(page));
  const designCount = shown.reduce((s, x) => s + x.designs.length, 0);
  return (
    <div className="min-h-screen">
      {/* ── masthead ─────────────────────────────────────────── */}
      <header className="border-b-2 border-[#1d1a15] bg-[#f5f4f1]">
        <div className="max-w-[1240px] mx-auto px-8 pt-14 pb-10">
          <div className="flex items-center gap-2 text-[10px] f-mono tracking-[0.35em] uppercase text-[#8a8577]">
            <Layers size={12} /> Meridian · Product design explorations
          </div>
          <div className="mt-4 flex items-end justify-between flex-wrap gap-6">
            <div>
              <h1 className="f-display text-[64px] leading-[0.95] font-light">Portfolio,<br /><em className="font-medium">in 90 studies.</em></h1>
            </div>
            <div className="text-right pb-2">
              <div className="text-sm text-[#6e695c] max-w-[300px] leading-6">
                Thirty components for the investor dashboard — three independent designs each. Same data, every time: a $354k book of 11 holdings across 3 accounts.
              </div>
              <div className="mt-3 flex gap-2 justify-end">
                <span className="f-mono text-[10px] bg-[#1d1a15] text-[#f5f4f1] rounded-full px-3 py-1">30 COMPONENTS</span>
                <span className="f-mono text-[10px] border border-[#1d1a15] rounded-full px-3 py-1">×3 VARIANTS</span>
                <span className="f-mono text-[10px] border border-[#1d1a15] rounded-full px-3 py-1">DESKTOP</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1240px] mx-auto px-8 pb-4 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8577] mr-2">Filter by page</span>
          {PAGES.map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${page === p ? 'bg-[#1d1a15] text-[#f5f4f1]' : 'text-[#6e695c] hover:bg-[#e8e4dc]'}`}>{p}</button>
          ))}
          <span className="ml-auto f-mono text-[10px] text-[#8a8577]">SHOWING {shown.length} COMPONENTS · {designCount} DESIGNS</span>
        </div>
      </header>

      <div className="max-w-[1240px] mx-auto px-8 flex gap-10">
        {/* ── sidebar ──────────────────────────────────────────── */}
        <aside className="w-52 shrink-0 hidden lg:block">
          <nav className="sticky top-8 py-10 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
            {shown.map(s => (
              <a key={s.n} href={`#sec-${s.n}`}
                className="group flex items-baseline gap-2.5 py-[5px] text-[11.5px] text-[#6e695c] hover:text-[#1d1a15] transition-colors">
                <span className="f-mono text-[9.5px] text-[#b7b0a1] group-hover:text-[#1d1a15] w-5">{String(s.n).padStart(2, '0')}</span>
                <span className="truncate">{s.title}</span>
              </a>
            ))}
            <div className="mt-6 pt-4 border-t border-[#e8e4dc]">
              <div className="text-[9px] f-mono text-[#b7b0a1] leading-5">LABELS: N.a / N.b / N.c<br />SAMPLE DATA: REALISTIC, SELF-CONSISTENT</div>
            </div>
          </nav>
        </aside>

        {/* ── sections ─────────────────────────────────────────── */}
        <main className="flex-1 py-10 space-y-16 min-w-0">
          {shown.map(s => (
            <section key={s.n} id={`sec-${s.n}`}>
              <div className="flex items-baseline gap-4 border-b-2 border-[#1d1a15] pb-3 mb-6">
                <span className="f-display text-4xl font-light text-[#b7b0a1]">{String(s.n).padStart(2, '0')}</span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold tracking-tight">{s.title}</h2>
                  <p className="text-[12px] text-[#8a8577] mt-0.5">{s.desc}</p>
                </div>
                <div className="flex gap-1.5">
                  {s.pages.map(p => <span key={p} className="text-[9px] f-mono uppercase tracking-wider border border-[#d8d2c2] text-[#8a8577] rounded-full px-2.5 py-1">{p}</span>)}
                </div>
              </div>
              <div className="space-y-8">
                {s.designs.map(d => (
                  <figure key={d.id} className="group">
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="f-mono text-[11px] font-bold bg-[#1d1a15] text-[#f5f4f1] rounded px-2 py-0.5">{d.id}</span>
                      <span className="text-[11px] text-[#8a8577] italic f-display">{d.vibe}</span>
                      <span className="flex-1 h-px bg-[#e8e4dc]" />
                    </div>
                    <div className="rounded-2xl bg-white/40 ring-1 ring-black/[.04] p-3 shadow-[0_1px_0_rgba(0,0,0,.03)]">
                      {d.el}
                    </div>
                  </figure>
                ))}
              </div>
            </section>
          ))}

          <footer className="border-t-2 border-[#1d1a15] pt-6 pb-2 flex items-center justify-between">
            <div className="text-[11px] text-[#8a8577]">
              <b className="text-[#1d1a15]">Meridian</b> — 30 components × 3 designs · one self-contained page · all figures fictional sample data.
            </div>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-[11px] font-semibold border border-[#d8d2c2] rounded-full px-3.5 py-1.5 hover:border-[#1d1a15] transition-colors">
              <ArrowUp size={12} /> Back to top
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
