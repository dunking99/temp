// 4 · Key figures
import { SERIES, CASH_TOTAL, NET_INVESTED, TODAY_CHG, TODAY_PCT, UNREALIZED } from '../data';
import { pc, signUsd, usd, Spark, kfmt } from '../lib';
import type { Design } from '../lib';

const gainPct = (UNREALIZED / NET_INVESTED) * 100;
const spark = SERIES.slice(-30).map(p => p.v);

// a — editorial hairline row
function A() {
  const F = ({ l, v, s, tone }: { l: string; v: string; s: string; tone?: string }) => (
    <div className="flex-1 px-7 first:pl-0 py-1">
      <div className="text-[10px] tracking-[0.24em] uppercase text-[#8a8577]">{l}</div>
      <div className="mt-2 text-[26px] f-display tnum leading-none">{v}</div>
      <div className={`mt-2 text-[11px] font-semibold tnum ${tone ?? 'text-[#8a8577]'}`}>{s}</div>
    </div>
  );
  return (
    <div className="bg-[#fbfaf8] border border-[#e8e4dc] rounded-xl p-7">
      <div className="flex divide-x divide-[#e8e4dc]">
        <F l="Amount invested" v={usd(NET_INVESTED)} s="156 deposits since 2023" />
        <F l="Cash" v={usd(CASH_TOTAL)} s="9.6% of portfolio" />
        <F l="Unrealised gain" v={signUsd(UNREALIZED)} s={pc(gainPct, 1, true) + ' on cost'} tone="text-[#0f5132]" />
        <F l="Today's change" v={signUsd(TODAY_CHG)} s={pc(TODAY_PCT, 2, true) + ' · as of close'} tone="text-[#0f5132]" />
      </div>
    </div>
  );
}

// b — terminal band
function B() {
  const Cell = ({ k, v, d, pos }: { k: string; v: string; d?: string; pos?: boolean }) => (
    <div className="flex items-baseline gap-3 px-6 py-4">
      <span className="text-[10px] tracking-[0.2em] text-[#5c6f8a]">{k}</span>
      <span className={`text-lg tnum ${pos == null ? 'text-[#d7e3f4]' : pos ? 'text-emerald-400' : 'text-rose-400'}`}>{v}</span>
      {d && <span className={`text-[11px] tnum ${pos ? 'text-emerald-500/80' : 'text-[#5c6f8a]'}`}>{d}</span>}
    </div>
  );
  return (
    <div className="bg-[#0a0e14] border border-[#1c2736] rounded-lg f-mono flex divide-x divide-[#1c2736] overflow-x-auto">
      <Cell k="INVESTED" v={kfmt(NET_INVESTED)} />
      <Cell k="CASH" v={kfmt(CASH_TOTAL)} d="9.6%" />
      <Cell k="UNRLZD_G/L" v={'+' + kfmt(UNREALIZED)} d={pc(gainPct, 1, true)} pos />
      <Cell k="1D_CHG" v={'+' + kfmt(TODAY_CHG)} d={pc(TODAY_PCT, 2, true)} pos />
    </div>
  );
}

// c — stat tiles with sparkline shadows
function C() {
  const Tile = ({ l, v, d, c, s }: { l: string; v: string; d: string; c: string; s: number[] }) => (
    <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
      <span className="absolute left-0 inset-y-0 w-1" style={{ background: c }} />
      <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{l}</div>
      <div className="mt-1.5 text-2xl font-semibold text-neutral-900 tnum">{v}</div>
      <div className="mt-1 text-xs tnum" style={{ color: c }}>{d}</div>
      <div className="absolute right-3 bottom-3 opacity-60 group-hover:opacity-100 transition-opacity"><Spark d={s} w={72} h={24} c={c} /></div>
    </div>
  );
  return (
    <div className="grid grid-cols-4 gap-4">
      <Tile l="Invested" v={kfmt(NET_INVESTED)} d="Cost basis" c="#6366f1" s={SERIES.map(p => p.inv)} />
      <Tile l="Cash" v={kfmt(CASH_TOTAL)} d="4.13% blended APY" c="#0ea5e9" s={[30, 31, 31.5, 32, 33, 33.2, 34.1]} />
      <Tile l="Unrealised gain" v={'+' + kfmt(UNREALIZED)} d={pc(gainPct, 1, true) + ' on cost'} c="#10b981" s={spark} />
      <Tile l="Today" v={'+' + kfmt(TODAY_CHG)} d={pc(TODAY_PCT, 2, true)} c="#f59e0b" s={[2, 4, 3, 6, 5, 8, 7, 10]} />
    </div>
  );
}

export const designs: Design[] = [
  { id: '4.a', vibe: 'Editorial hairline stat row', el: <A /> },
  { id: '4.b', vibe: 'Ticker band · dark terminal', el: <B /> },
  { id: '4.c', vibe: 'Tiles with accent rails + sparks', el: <C /> },
];
