// 29 · Allocation story (editorial take)
import { SERIES } from '../data';
import { kfmt, Spark } from '../lib';
import type { Design } from '../lib';

// a — magazine spread
function A() {
  return (
    <div className="bg-[#f6f2ea] p-10 border-y-[3px] border-[#1d1a15]">
      <div className="flex items-baseline justify-between border-b border-[#1d1a15]/15 pb-3 mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#8a8577]">The Allocation Desk</span>
        <span className="f-display italic text-sm">Issue 08 · Feb 2026</span>
      </div>
      <h3 className="f-display text-4xl leading-tight">A portfolio that bets on America,<br />and keeps meaning to buy bonds.</h3>
      <div className="grid grid-cols-[1fr_300px] gap-10 mt-8">
        <div className="text-[13.5px] leading-7 text-[#3d382e]">
          <p><span className="f-display float-left text-7xl leading-[0.75] mr-2.5 mt-1">T</span>he shape of this book tells a familiar story. What began three years ago as a cautious index habit — a monthly Vanguard S&P 500 purchase — has quietly become something more opinionated. A third of every dollar now rides on that single fund, another quarter on four technology names whose earnings calls you never miss.</p>
          <p className="mt-4">Meanwhile the written plan says 15% bonds. Reality says five. The gap, <b>{kfmt(35413)}</b>, is now the widest structural drift on record, wider even than the cash pile nobody remembers authorising.</p>
          <p className="mt-4">None of this is failure. Returns say otherwise. But portfolios accumulate intentions the way attics accumulate furniture — and this one is due a spring clean.</p>
        </div>
        <aside className="space-y-6">
          <div className="border-l-4 border-[#1d1a15] pl-4">
            <div className="f-display text-2xl italic leading-snug">“The plan says 15% bonds. Reality says five.”</div>
          </div>
          <div className="text-[11px] space-y-2.5">
            <div className="flex justify-between border-b border-[#1d1a15]/10 pb-1.5"><span className="text-[#8a8577]">Biggest concentration</span><b>VOO 36.7%</b></div>
            <div className="flex justify-between border-b border-[#1d1a15]/10 pb-1.5"><span className="text-[#8a8577]">Quiet winner</span><b>GLD +28.9% on cost</b></div>
            <div className="flex justify-between border-b border-[#1d1a15]/10 pb-1.5"><span className="text-[#8a8577]">Forgotten cash</span><b>$34.1k @ 4.13%</b></div>
            <div className="pt-1"><Spark d={SERIES.map(p => p.v)} w={260} h={40} c="#1d1a15" /><div className="text-[9px] f-mono text-[#8a8577] mt-1">3-YEAR VALUE ARC</div></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// b — three numbered beats
function B() {
  const beats = [
    { n: '01', t: 'Concentration is a choice now', b: 'VOO is 37% and technology another 25%. That’s no longer a default index habit — it’s a view. Make sure it’s the view you still hold.', c: '#4f46e5' },
    { n: '02', t: 'The defence exists on paper only', b: 'Your plan allocates 20% to bonds and gold. The book holds 8.1%. One bad quarter will find this out before you do.', c: '#b45309' },
    { n: '03', t: 'Cash is the uninvited guest', b: '9.6% parked at 4.13% — three pay-cheques that never got a destination. Either barbell it or give it a job.', c: '#0f5132' },
  ];
  return (
    <div className="space-y-4">
      {beats.map(bt => (
        <div key={bt.n} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 flex gap-7 items-start hover:shadow-md transition-shadow">
          <span className="f-display text-6xl leading-none select-none" style={{ WebkitTextStroke: `1.5px ${bt.c}`, color: 'transparent' }}>{bt.n}</span>
          <div>
            <div className="text-[15px] font-semibold text-neutral-900 flex items-center gap-2">{bt.t}<span className="w-8 h-[2px] rounded" style={{ background: bt.c }} /></div>
            <p className="text-[13px] leading-6 text-neutral-500 mt-1.5 max-w-2xl">{bt.b}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// c — annotated allocation with leader lines
function C() {
  const size = 460, cx = 240, cy = 240, r = 150, CIRC = 2 * Math.PI * r;
  const segs = [
    { name: 'US equities', w: 62.7, c: '#1d1a15', note: 'The engine — VOO plus 4 favourites', side: 'right' as const, y: 90 },
    { name: 'Intl', w: 16.8, c: '#8a8577', note: 'The slow lane, pending top-up', side: 'left' as const, y: 60 },
    { name: 'Cash', w: 9.6, c: '#b7b0a1', note: 'Awaiting instructions', side: 'left' as const, y: 250 },
    { name: 'Alts', w: 5.9, c: '#6e5d3a', note: 'Gold did its job this year', side: 'left' as const, y: 350 },
    { name: 'Bonds', w: 5.0, c: '#b4463a', note: 'Missing in action', side: 'right' as const, y: 390 },
  ];
  let acc = 0;
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-8 mx-auto" style={{ maxWidth: 900 }}>
      <div className="text-center text-[10px] tracking-[0.3em] uppercase text-[#8a8577]">Reading the allocation like a story</div>
      <div className="relative mt-4" style={{ height: 480 }}>
        <svg className="absolute left-1/2 -translate-x-1/2" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segs.map((s, i) => {
            const dash = (s.w / 100) * CIRC, off = acc;
            const mid = ((acc + dash / 2) / CIRC) * 360 - 90;
            acc += dash;
            const a = (mid * Math.PI) / 180;
            void i;
            return (
              <g key={s.name}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={s.c} strokeWidth={34} strokeDasharray={`${dash - 3} ${CIRC - dash + 3}`} strokeDashoffset={-off} transform={`rotate(-90 ${cx} ${cy})`} />
                <circle cx={cx + Math.cos(a) * (r + 30)} cy={cy + Math.sin(a) * (r + 30)} r="4" fill={s.c} />
              </g>
            );
          })}
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="13" fill="#8a8577" fontFamily="JetBrains Mono">$354,214</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#b7b0a1">FIVE MOVING PARTS</text>
        </svg>
        {segs.map(s => (
          <div key={s.name} className={`absolute w-52 ${s.side === 'left' ? 'left-0 text-right' : 'right-0'}`} style={{ top: s.y }}>
            <div className={`text-[11px] font-bold tracking-wide uppercase`} style={{ color: s.c }}>{s.name} · {s.w}%</div>
            <div className="text-[11px] text-[#6e695c] italic f-display">{s.note}</div>
            <div className={`mt-1 h-px bg-[#d8d2c2] ${s.side === 'left' ? 'ml-auto' : ''}`} style={{ width: 60 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '29.a', vibe: 'Broadsheet spread · drop cap + pull quote', el: <A /> },
  { id: '29.b', vibe: 'Three outlined-number beats', el: <B /> },
  { id: '29.c', vibe: 'Annotated ring with margin notes', el: <C /> },
];
