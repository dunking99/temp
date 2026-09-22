// 1 · Total value
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { SERIES, TOTAL, TODAY_CHG, TODAY_PCT } from '../data';
import { pc, signUsd, usd, Spark } from '../lib';
import type { Design } from '../lib';

// a — editorial serif on paper
function A() {
  return (
    <div className="bg-[#f6f2ea] text-[#1d1a15] p-10 border-y-2 border-[#1d1a15]">
      <div className="flex items-center justify-between text-[11px] tracking-[0.22em] uppercase opacity-70">
        <span>Meridian · Total portfolio value</span>
        <span className="flex items-center gap-1.5"><Clock3 size={12} /> 4:00 PM ET close</span>
      </div>
      <div className="mt-6 flex items-end gap-8 flex-wrap">
        <div className="f-display text-[84px] leading-none font-light tracking-tight tnum">{usd(TOTAL, 2)}</div>
        <div className="pb-2">
          <div className="inline-flex items-center gap-1.5 bg-[#0f5132] text-[#eaf5ef] rounded-full px-3.5 py-1.5 text-sm font-medium tnum">
            <ArrowUpRight size={15} /> {signUsd(TODAY_CHG, 2)} · {pc(TODAY_PCT, 2, true)}
          </div>
          <div className="text-xs mt-2 opacity-60 tracking-wide">Today · across 3 accounts</div>
        </div>
      </div>
      <div className="mt-8 pt-4 border-t border-[#1d1a15]/20 flex gap-8 text-[12px] opacity-70">
        <span>11 holdings</span><span>2 currencies of trade</span><span>Since Feb 2023</span>
        <span className="ml-auto italic f-display text-[13px]">“A good day, carried by semis.”</span>
      </div>
    </div>
  );
}

// b — dark terminal strip
function B() {
  const spark = SERIES.slice(-40).map(p => p.v);
  return (
    <div className="bg-[#0a0e14] text-[#d7e3f4] p-6 flex items-center gap-8 border border-[#1c2736] rounded-lg f-mono">
      <div>
        <div className="text-[10px] tracking-[0.3em] text-[#5c6f8a] uppercase">Portfolio / TOTAL_EQ</div>
        <div className="mt-2 text-4xl font-semibold tnum tracking-tight">{usd(TOTAL, 2)}</div>
        <div className="mt-1 text-[11px] text-[#5c6f8a]">LAST&nbsp;&nbsp;16:00:00 ET&nbsp;&nbsp;REALTIME</div>
      </div>
      <div className="h-14 w-px bg-[#1c2736]" />
      <div>
        <div className="text-[10px] tracking-[0.3em] text-[#5c6f8a] uppercase">Δ Session</div>
        <div className="mt-2 text-xl text-emerald-400 tnum">▲ {signUsd(TODAY_CHG, 2)}</div>
        <div className="text-xl text-emerald-400 tnum">{pc(TODAY_PCT, 2, true)}</div>
      </div>
      <div className="ml-auto text-right">
        <Spark d={spark} w={190} h={52} c="#34d399" sw={2} />
        <div className="text-[10px] text-[#5c6f8a] mt-1 tracking-widest">T–40W · INTRADAY REPLAY</div>
      </div>
    </div>
  );
}

// c — gradient glass with glow
function C() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0b1023] p-10 text-white">
      <div className="absolute -top-24 -left-16 w-96 h-96 rounded-full bg-indigo-600/40 blur-[110px]" />
      <div className="absolute -bottom-28 right-10 w-80 h-80 rounded-full bg-fuchsia-500/25 blur-[100px]" />
      <div className="relative">
        <div className="text-[11px] tracking-[0.25em] uppercase text-indigo-200/70">Total value</div>
        <div className="mt-3 text-7xl font-semibold tracking-tight tnum bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
          {usd(TOTAL)}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-emerald-400/15 text-emerald-300 text-sm font-medium tnum ring-1 ring-emerald-400/30">
            {pc(TODAY_PCT, 2, true)} today
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/5 text-indigo-100/80 text-sm tnum ring-1 ring-white/10">
            {signUsd(TODAY_CHG, 2)}
          </span>
          <span className="flex gap-1 ml-2 items-end h-8">
            {[5, 9, 7, 12, 8, 14, 11, 16, 13, 19].map((h, i) => (
              <span key={i} className="w-1.5 rounded-sm bg-indigo-300/50" style={{ height: h + 4 }} />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '1.a', vibe: 'Editorial serif · paper broadsheet', el: <A /> },
  { id: '1.b', vibe: 'Bloomberg-style terminal strip', el: <B /> },
  { id: '1.c', vibe: 'Aurora glass · gradient glow', el: <C /> },
];
