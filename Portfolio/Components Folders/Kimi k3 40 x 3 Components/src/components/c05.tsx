// 5 · Portfolio Pulse
import { useState } from 'react';
import { AlertTriangle, ChevronRight, Lightbulb, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { PULSE } from '../data';
import type { Design } from '../lib';

const toneMap = { up: { c: '#10b981', I: TrendingUp }, warn: { c: '#f59e0b', I: AlertTriangle }, info: { c: '#0ea5e9', I: Lightbulb } } as const;

// a — pulse feed with expandable rows
function A() {
  const [open, setOpen] = useState<number>(1);
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex w-2.5 h-2.5"><span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60" /><span className="relative rounded-full w-2.5 h-2.5 bg-emerald-500" /></span>
          <span className="font-semibold text-sm text-neutral-800">Portfolio Pulse</span>
          <span className="text-[10px] text-neutral-400">· this week</span>
        </div>
        <button className="text-[11px] text-indigo-600 font-semibold hover:underline">View all</button>
      </div>
      <div>
        {PULSE.map((p, i) => {
          const T = toneMap[p.tone];
          return (
            <button key={i} onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left flex gap-3.5 group">
              <div className="flex flex-col items-center">
                <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: T.c + '1a', color: T.c }}><T.I size={14} /></span>
                {i < PULSE.length - 1 && <span className="w-px flex-1 bg-neutral-200 my-1" />}
              </div>
              <div className="pb-5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-neutral-800 group-hover:text-indigo-700 transition-colors">{p.title}</span>
                  <ChevronRight size={13} className={`text-neutral-300 transition-transform ${open === i ? 'rotate-90' : ''}`} />
                </div>
                <p className={`text-xs text-neutral-500 mt-0.5 transition-all ${open === i ? 'opacity-100' : 'line-clamp-1 opacity-70'}`}>{p.body}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// b — editorial two-column brief
function B() {
  return (
    <div className="bg-[#fbfaf8] border-t-[3px] border-[#1d1a15] p-8 max-w-3xl">
      <div className="flex items-baseline justify-between">
        <h3 className="f-display text-2xl italic">This week, in plain English</h3>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8a8577]">Pulse · Wk 8 2026</span>
      </div>
      <div className="grid grid-cols-2 gap-10 mt-6">
        <div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-[#0f5132] border-b border-[#1d1a15]/15 pb-2 mb-3">What changed</div>
          <p className="text-[13px] leading-6 text-[#3d382e]">
            The portfolio gained <b className="bg-emerald-100 px-1 rounded">$2,348 (+0.67%)</b> on Friday, its best close in six weeks.
            Semiconductors did the lifting — NVDA added <b className="bg-emerald-100 px-1 rounded">+$612</b> alone, while Novo Nordisk
            slipped <b className="bg-rose-100 px-1 rounded">−$186</b> on trial-readout jitters. Cash interest ticked up another
            <b className="bg-emerald-100 px-1 rounded"> +$12</b>.
          </p>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a4b08] border-b border-[#1d1a15]/15 pb-2 mb-3">Deserves attention</div>
          <p className="text-[13px] leading-6 text-[#3d382e]">
            Bonds sit <b className="bg-amber-100 px-1 rounded">10 points under target</b> (5% vs 15%) — roughly <b>$35.4k</b> short of plan,
            the widest drift since you started. Your US equity sleeve is now <b>62.7%</b>; the written target is 55%.
            Cash above <b>$20k</b> earns less than inflation at current rates.
          </p>
        </div>
      </div>
    </div>
  );
}

// c — AI insight card with gradient ring
function C() {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl p-[1.5px] bg-gradient-to-br from-indigo-500 via-fuchsia-400 to-amber-300 max-w-2xl">
      <div className="bg-[#0d1017] rounded-[15px] p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-fuchsia-300" />
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">Meridian Pulse</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 tracking-wider">AUTO-BRIEF</span>
          </div>
          <button className="text-white/40 hover:text-white transition-colors"><RefreshCw size={13} /></button>
        </div>
        <p className="mt-4 text-[13px] leading-6 text-white/75">
          A strong week: <b className="text-emerald-300">+$4,102</b> since Monday, driven by tech. One thing needs a decision —
          your <b className="text-amber-300">bond sleeve is 10 points light</b> and three pay-cheques of cash are sitting idle.
        </p>
        <button onClick={() => setOpen(o => !o)} className="mt-3 text-[11px] text-fuchsia-300/90 hover:text-fuchsia-200 font-medium">
          {open ? 'Hide breakdown ↑' : 'Show breakdown ↓'}
        </button>
        {open && (
          <div className="mt-3 space-y-2">
            {[
              ['Winners', 'NVDA +4.1%, MSFT +1.8% this week', '#34d399'],
              ['Laggards', 'NVO −2.1%, BND −0.2%', '#f87171'],
              ['Action', 'Move ~$16k cash → BND to halve the bond gap', '#fbbf24'],
            ].map(([k, v, c]) => (
              <div key={k as string} className="flex items-center gap-3 bg-white/[.04] rounded-lg px-3.5 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c as string }} />
                <span className="text-[10px] uppercase tracking-widest text-white/40 w-16">{k}</span>
                <span className="text-xs text-white/80">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '5.a', vibe: 'Live feed timeline · expandable', el: <A /> },
  { id: '5.b', vibe: 'Editorial brief · changed vs attention', el: <B /> },
  { id: '5.c', vibe: 'AI insight card · gradient ring', el: <C /> },
];
