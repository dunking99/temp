// 20 · Shape of the book
import { Cake, Castle, CircleDollarSign, Shield } from 'lucide-react';
import type { Design } from '../lib';

// a — observation cards
function A() {
  const cards = [
    { I: Castle, t: 'A core with satellites', b: 'VOO alone is 37% — a classic core. Everything else behaves like satellites orbiting it: semis for torque, EAFE for balance, gold for insurance.', tone: 'neutral' },
    { I: Shield, t: 'A thin defensive line', b: 'Only 5% in bonds against a 15% plan. In a 2008-style year this book gives back roughly twice what your target allocation would.', tone: 'warn' },
    { I: CircleDollarSign, t: 'Cash doing nothing', b: '$34.1k — 9.6% — sits at 4.1% while you pay yourself 2.8% yield on cost invested. That’s a quiet −0.8% annual drag on the whole book.', tone: 'warn' },
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map(c => (
        <div key={c.t} className={`rounded-xl border p-5 bg-white shadow-sm hover:shadow-md transition-shadow ${c.tone === 'warn' ? 'border-amber-200' : 'border-neutral-200'}`}>
          <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.tone === 'warn' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}><c.I size={17} /></span>
          <div className="mt-3 text-sm font-semibold text-neutral-900">{c.t}</div>
          <p className="mt-1.5 text-[12px] leading-5 text-neutral-500">{c.b}</p>
        </div>
      ))}
    </div>
  );
}

// b — core / satellite schematic
function B() {
  return (
    <div className="bg-[#0d1117] rounded-2xl p-8 text-white flex items-center gap-10 border border-[#1e2732]">
      <div className="relative w-64 h-64 shrink-0">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-8 rounded-full border border-white/10" />
        <div className="absolute inset-16 rounded-full bg-indigo-600/90 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(79,70,229,.5)]">
          <span className="text-[9px] tracking-[0.3em] text-indigo-200">CORE</span>
          <span className="text-xl font-bold tnum">62.7%</span>
          <span className="text-[9px] text-indigo-200/70">US EQ · VOO LED</span>
        </div>
        {[['NVDA+MSFT+AAPL', 24.9, -40, -14], ['Intl', 16.8, 108, -26], ['Bonds', 5.0, 120, 60], ['Alts', 5.9, -106, 66]].map(([l, w, dx, dy]) => (
          <div key={l as string} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))` }}>
            <div className="w-14 h-14 rounded-full bg-white/[.07] border border-white/15 backdrop-blur flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold tnum">{w}%</span>
              <span className="text-[7px] text-white/50 px-1">{l}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4 text-[12px] leading-5 text-white/60">
        <p><b className="text-white">Read of the book:</b> you run a concentrated core-satellite. The core is cheap beta; the satellites are where your opinions live.</p>
        <p><b className="text-amber-300">Watch-out:</b> three of your satellites (AAPL, MSFT, NVDA) also live inside the core fund — true active share is lower than it looks.</p>
        <p><b className="text-sky-300">Ballast is thin:</b> bonds + gold = 10.9%. Your notes say you want 20% there.</p>
      </div>
    </div>
  );
}

// c — margin-note observations
function C() {
  const notes = [
    ['STRUCTURE', '#1d1a15', 'Core & satellites. One fund anchors 37%; everything else is a deliberate detour from index weight.'],
    ['OFFENCE', '#1d4ed8', 'Semis are the engine: NVDA + MSFT + ASML ≈ 17% and ~44% of this year’s gains.'],
    ['DEFENCE', '#8a4b08', 'Under-fortified. 5% bonds, 3.1% gold. A −20% equity shock ≈ −14% book-wide at this mix.'],
    ['IDLE', '#b4463a', '$34.1k cash earns less than your own dividend sleeve yields. Barbell it or deploy it.'],
  ] as const;
  return (
    <div className="bg-[#fbfaf8] border-l-[3px] border-[#1d1a15] p-8 max-w-2xl">
      <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a8577] mb-5">How this portfolio is built — field notes</div>
      <div className="space-y-5">
        {notes.map(([k, c, body]) => (
          <div key={k} className="flex gap-5 group">
            <span className="w-20 shrink-0 pt-0.5 text-[9px] font-bold tracking-[0.2em] f-mono" style={{ color: c }}>{k}</span>
            <div className="flex-1 border-b border-[#e8e4dc] pb-4">
              <p className="text-[13px] leading-6 text-[#3d382e]">{body}</p>
              <div className="mt-2 h-1 rounded-full bg-[#efece4] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-full rounded-full" style={{ width: k === 'IDLE' ? '9.6%' : k === 'DEFENCE' ? '8.1%' : k === 'OFFENCE' ? '17%' : '62.7%', background: c }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '20.a', vibe: 'Three plain-English observation cards', el: <A /> },
  { id: '20.b', vibe: 'Core-satellite orbit schematic', el: <B /> },
  { id: '20.c', vibe: 'Field notes with hover measures', el: <C /> },
];
void Cake;
