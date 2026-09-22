// 6 · Chart modes (value / return % / drawdown)
import { useId, useState } from 'react';
import { Activity, LineChart, Percent, Waves } from 'lucide-react';
import { DD, GAINPCT, SERIES } from '../data';
import { kfmt, linePath, pc, usd } from '../lib';
import type { Design } from '../lib';

type Mode = 'value' | 'ret' | 'dd';
const seriesOf = (m: Mode) => m === 'value' ? SERIES.map(p => p.v) : m === 'ret' ? GAINPCT.map(p => p.g) : DD.map(p => p.dd);

const W = 900, H = 280, PT = 16, PB = 24, PL = 10, PR = 10;

// a — light chart with segmented control
function A() {
  const [m, setM] = useState<Mode>('value');
  const gid = useId();
  const d = seriesOf(m);
  const min = Math.min(...d, m === 'dd' ? -30 : 0), max = Math.max(...d);
  const X = (i: number) => PL + (i / (d.length - 1)) * (W - PL - PR);
  const Y = (v: number) => PT + (1 - (v - min) / (max - min || 1)) * (H - PT - PB);
  const pts: [number, number][] = d.map((v, i) => [X(i), Y(v)]);
  const zeroY = Y(Math.max(Math.min(0, max), min));
  const col = m === 'dd' ? '#e11d48' : '#4f46e5';
  const modes: { id: Mode; l: string; I: any }[] = [
    { id: 'value', l: 'Value', I: LineChart }, { id: 'ret', l: 'Return %', I: Percent }, { id: 'dd', l: 'Drawdown', I: Waves },
  ];
  const last = d[d.length - 1];
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-neutral-800">Portfolio trajectory</div>
          <div className="text-xs text-neutral-400 mt-0.5">
            {m === 'value' ? 'Market value, weekly' : m === 'ret' ? 'Gain vs money invested' : 'Peak-to-trough decline'}
          </div>
        </div>
        <div className="flex bg-neutral-100 rounded-lg p-1">
          {modes.map(({ id, l, I }) => (
            <button key={id} onClick={() => setM(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${m === id ? 'bg-white shadow text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}>
              <I size={13} />{l}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-3xl font-semibold tnum text-neutral-900">
          {m === 'value' ? usd(last) : pc(last, 1, m !== 'dd')}
        </span>
        <span className="text-xs text-neutral-400">{m === 'dd' ? 'currently 6.2% below peak of ' + kfmt(381200) : m === 'ret' ? 'on ' + usd(278000) + ' deposited' : 'as of last close'}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={col} stopOpacity=".2" /><stop offset="1" stopColor={col} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(f => <line key={f} x1={PL} x2={W - PR} y1={PT + f * (H - PT - PB)} y2={PT + f * (H - PT - PB)} stroke="#eee" strokeDasharray="3 4" />)}
        {m !== 'value' && <line x1={PL} x2={W - PR} y1={zeroY} y2={zeroY} stroke="#94a3b8" strokeWidth="1" />}
        <path d={`${linePath(pts)} L${W - PR},${m === 'dd' ? PT : H - PB} L${PL},${m === 'dd' ? PT : H - PB} Z`} fill={`url(#${gid})`} />
        <path d={linePath(pts)} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" />
        {m === 'dd' && <circle cx={X(61)} cy={Y(min)} r="4" fill="#e11d48" stroke="#fff" strokeWidth="2" />}
        {m === 'dd' && <text x={X(61)} y={Y(min) + 18} fontSize="10" fill="#e11d48" textAnchor="middle">max −27.8% · Oct 2023</text>}
      </svg>
    </div>
  );
}

// b — dark with radio pills + stats footer
function B() {
  const [m, setM] = useState<Mode>('ret');
  const gid = useId();
  const d = seriesOf(m);
  const min = Math.min(...d, 0), max = Math.max(...d);
  const X = (i: number) => PL + (i / (d.length - 1)) * (W - PL - PR);
  const Y = (v: number) => PT + (1 - (v - min) / (max - min || 1)) * (H - PT - PB);
  const pts: [number, number][] = d.map((v, i) => [X(i), Y(v)]);
  const col = m === 'dd' ? '#fb7185' : m === 'ret' ? '#34d399' : '#60a5fa';
  const stats: [string, string][] = m === 'value'
    ? [['Current', usd(d.at(-1)!)], ['All-time high', kfmt(381200)], ['Weeks shown', '156']]
    : m === 'ret'
      ? [['Total return', pc(d.at(-1)!, 1, true)], ['Best week', '+5.8%'], ['Deposits', '156']]
      : [['Now', pc(d.at(-1)!, 1)], ['Max drawdown', '−27.8%'], ['Longest recovery', '41 wks']];
  const bars = m === 'dd';
  return (
    <div className="bg-[#0b0f14] rounded-xl border border-[#1b2530] p-6 text-white">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#50637a] mr-2">View</span>
        {(['value', 'ret', 'dd'] as Mode[]).map(id => (
          <label key={id} className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${m === id ? 'border-[#7cc7ff] text-[#7cc7ff] bg-[#7cc7ff]/10' : 'border-[#1b2530] text-[#50637a] hover:text-white'}`}>
            <input type="radio" name="mode-b" className="hidden" checked={m === id} onChange={() => setM(id)} />
            {id === 'value' ? 'Value $' : id === 'ret' ? 'Return %' : 'Drawdown'}
          </label>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={col} stopOpacity=".3" /><stop offset="1" stopColor={col} stopOpacity="0" />
          </linearGradient>
        </defs>
        {bars
          ? d.filter((_, i) => i % 2 === 0).map((v, i) => {
              const x = PL + ((i * 2) / (d.length - 1)) * (W - PL - PR);
              const y0 = Y(0), y1 = Y(v);
              return <rect key={i} x={x - 1.1} y={Math.min(y0, y1)} width="2.2" height={Math.max(Math.abs(y1 - y0), 1)} rx="1" fill={col} opacity=".8" />;
            })
          : <>
              <path d={`${linePath(pts)} L${W - PR},${H - PB} L${PL},${H - PB} Z`} fill={`url(#${gid})`} />
              <path d={linePath(pts)} fill="none" stroke={col} strokeWidth="2" />
            </>}
        <line x1={PL} x2={W - PR} y1={Y(0)} y2={Y(0)} stroke="#1b2530" />
      </svg>
      <div className="flex gap-10 mt-4 pt-4 border-t border-[#131c26]">
        {stats.map(([k, v]) => (
          <div key={k}><div className="text-[10px] uppercase tracking-widest text-[#50637a]">{k}</div><div className="text-sm tnum mt-1" style={{ color: col }}>{v}</div></div>
        ))}
      </div>
    </div>
  );
}

// c — vertical rail switcher, ultra-min chart
function C() {
  const [m, setM] = useState<Mode>('dd');
  const d = seriesOf(m);
  const min = Math.min(...d, 0), max = Math.max(...d);
  const X = (i: number) => PL + (i / (d.length - 1)) * (W - PL - PR);
  const Y = (v: number) => PT + (1 - (v - min) / (max - min || 1)) * (H - PT - PB);
  const pts: [number, number][] = d.map((v, i) => [X(i), Y(v)]);
  const modes: [Mode, string, any][] = [['value', 'Total value', LineChart], ['ret', 'Return', Percent], ['dd', 'Drawdown', Activity]];
  return (
    <div className="bg-[#faf9f6] rounded-xl border border-[#e8e4dc] p-6 flex gap-6">
      <div className="flex flex-col gap-1 pt-1">
        {modes.map(([id, l, I]) => (
          <button key={id} onClick={() => setM(id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs w-36 transition-all ${m === id ? 'bg-[#1d1a15] text-[#f6f2ea] font-semibold' : 'text-[#8a8577] hover:bg-[#efece4]'}`}>
            <I size={14} />{l}
          </button>
        ))}
        <div className="mt-auto f-mono text-[9px] text-[#b7b0a1] px-1 pt-4">MODE<br />{m.toUpperCase()}</div>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[13px] text-[#8a8577]">{m === 'value' ? 'What the account is worth' : m === 'ret' ? 'What you made on what you put in' : 'How deep the dips got'}</span>
          <span className="f-display text-2xl tnum">{m === 'value' ? usd(d.at(-1)!) : pc(d.at(-1)!, 1, m === 'ret')}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <path d={linePath(pts)} fill="none" stroke="#1d1a15" strokeWidth="1.6" />
          {m === 'dd' && <path d={`${linePath(pts)} L${W - PR},${PT} L${PL},${PT} Z`} fill="#b4463a" opacity=".08" />}
          {m === 'dd' && <path d={linePath(pts)} fill="none" stroke="#b4463a" strokeWidth="1.6" />}
          <circle cx={X(d.length - 1)} cy={Y(d.at(-1)!)} r="4.5" fill={m === 'dd' ? '#b4463a' : '#1d1a15'} stroke="#faf9f6" strokeWidth="2" />
        </svg>
        <div className="flex justify-between f-mono text-[9px] text-[#b7b0a1] mt-1"><span>2023</span><span>2024</span><span>2025</span><span>2026</span></div>
      </div>
    </div>
  );
}

export const designs: Design[] = [
  { id: '6.a', vibe: 'Segmented modes · annotated light chart', el: <A /> },
  { id: '6.b', vibe: 'Dark radio pills · drawdown as bars', el: <B /> },
  { id: '6.c', vibe: 'Left rail · quiet gallery chart', el: <C /> },
];
