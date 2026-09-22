// 12 · Privacy mode
import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { TOTAL, TODAY_PCT, UNREALIZED } from '../data';
import { pc, usd } from '../lib';
import type { Design } from '../lib';

const Mask = ({ on, children }: { on: boolean; children: string }) => (
  <span className="tnum">{on ? children.replace(/[0-9]/g, '•') : children}</span>
);

// a — eye toggle with demo stat strip
function A() {
  const [priv, setPriv] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-xl">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold text-neutral-800">Your figures</span>
        <button onClick={() => setPriv(p => !p)}
          className={`flex items-center gap-2 rounded-full pl-3 pr-4 py-1.5 text-xs font-semibold border transition-all ${priv ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'}`}>
          {priv ? <EyeOff size={13} /> : <Eye size={13} />} {priv ? 'Amounts hidden' : 'Amounts visible'}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          ['Total value', usd(TOTAL), TODAY_PCT],
          ['Unrealised gain', usd(UNREALIZED), 27.4],
          ['Largest position', usd(130046), 36.7],
        ].map(([l, v, p]) => (
          <div key={l as string} className="bg-neutral-50 rounded-lg p-4">
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">{l}</div>
            <div className="mt-1.5 text-lg font-semibold text-neutral-900"><Mask on={priv}>{v as string}</Mask></div>
            <div className="text-[11px] text-emerald-600 font-semibold tnum mt-0.5">{pc(p as number, 1, true)}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[10px] text-neutral-400">Percentages always stay visible — amounts never leave this device.</p>
    </div>
  );
}

// b — hardware switch with blur transition
function B() {
  const [on, setOn] = useState(true);
  return (
    <div className="bg-[#0b0f14] rounded-xl border border-[#1b2530] p-6 text-white max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Shoulder-surf mode</div>
          <div className="text-[11px] text-white/40 mt-0.5">Blurs every money figure · keeps ratios legible</div>
        </div>
        <button onClick={() => setOn(o => !o)} aria-label="privacy"
          className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${on ? 'bg-emerald-500' : 'bg-white/15'}`}>
          <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${on ? 'left-[30px]' : 'left-0.5'}`}>
            <Lock size={11} className={`absolute inset-0 m-auto transition-opacity ${on ? 'opacity-100 text-emerald-600' : 'opacity-0'}`} />
          </span>
        </button>
      </div>
      <div className="mt-6 flex items-end justify-between bg-white/[.03] rounded-lg p-5 border border-white/5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/40">Portfolio</div>
          <div className={`text-3xl font-semibold tnum mt-1 transition-all duration-500 ${on ? 'blur-md select-none' : ''}`}>{usd(TOTAL)}</div>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 text-sm font-semibold tnum">{pc(TODAY_PCT, 2, true)}</div>
          <div className="text-[10px] text-white/35 mt-1">% always clear</div>
        </div>
      </div>
      <div className="mt-3 text-[10px] f-mono text-white/30">HOTKEY: ⌘⇧H · AUTO-ENGAGES AFTER 15 MIN IDLE</div>
    </div>
  );
}

// c — privacy banner + hold-to-reveal
function C() {
  const [priv, setPriv] = useState(true);
  const [peek, setPeek] = useState(false);
  const show = !priv || peek;
  return (
    <div className="rounded-xl border border-[#e8e4dc] bg-[#fbfaf8] max-w-xl overflow-hidden">
      <div className={`px-5 py-2 flex items-center justify-between text-[11px] font-semibold transition-colors ${priv ? 'bg-[#3d2e07] text-amber-200' : 'bg-[#e8e4dc] text-[#6e695c]'}`}>
        <span className="flex items-center gap-1.5"><Lock size={11} /> {priv ? 'PRIVATE MODE ON — values masked, ratios visible' : 'Private mode off'}</span>
        <button onClick={() => setPriv(p => !p)} className="underline underline-offset-2">{priv ? 'Turn off' : 'Turn on'}</button>
      </div>
      <div className="p-6 flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#8a8577]">Total · <span className="text-emerald-700 font-semibold">{pc(TODAY_PCT, 2, true)} today</span></div>
          <div className="f-display text-4xl tnum mt-1.5 tracking-wide">{show ? usd(TOTAL) : '$ •••,•••'}</div>
        </div>
        {priv && (
          <button onMouseDown={() => setPeek(true)} onMouseUp={() => setPeek(false)} onMouseLeave={() => setPeek(false)}
            className="flex items-center gap-2 border border-[#d8d2c2] hover:bg-[#efece4] rounded-lg px-3.5 py-2 text-xs font-semibold text-[#6e695c] select-none">
            <Eye size={13} /> Hold to reveal
          </button>
        )}
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '12.a', vibe: 'Eye toggle · bullet masking demo', el: <A /> },
  { id: '12.b', vibe: 'Hardware switch · live blur', el: <B /> },
  { id: '12.c', vibe: 'Privacy ribbon · hold-to-peek', el: <C /> },
];
