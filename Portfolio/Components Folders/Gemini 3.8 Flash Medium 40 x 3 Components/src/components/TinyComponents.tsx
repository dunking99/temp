import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { PORTFOLIO_SUMMARY } from '../data/mockData';

// ==========================================
// COMPONENT 118: Total value (118.a, 118.b, 118.c)
// ==========================================

export const TotalValue118A: React.FC = () => {
  return (
    <div className="inline-flex items-baseline gap-2 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800">
      <span className="text-xs font-mono text-zinc-500 uppercase">Portfolio NAV</span>
      <span className="text-xl md:text-2xl font-extrabold font-mono text-white">
        ${PORTFOLIO_SUMMARY.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-850 px-1.5 py-0.5 rounded">USD</span>
    </div>
  );
};

export const TotalValue118B: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2.5 bg-zinc-900 px-3.5 py-1.5 rounded-full border border-zinc-700/80 shadow-inner">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-sm font-bold font-mono text-zinc-100">
        ${PORTFOLIO_SUMMARY.totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </span>
      <span className="text-[10px] font-mono text-emerald-400 font-semibold">+0.58%</span>
    </div>
  );
};

export const TotalValue118C: React.FC = () => {
  return (
    <div className="inline-block font-mono text-xs text-zinc-400 bg-zinc-950 px-3 py-1 rounded border border-zinc-800">
      <span className="text-zinc-500">TOTAL: </span>
      <span className="text-zinc-100 font-bold">${PORTFOLIO_SUMMARY.totalValue.toLocaleString()}</span>
    </div>
  );
};

// ==========================================
// COMPONENT 119: Day change (119.a, 119.b, 119.c)
// ==========================================

export const DayChange119A: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 font-mono text-xs px-3 py-1.5 rounded-lg font-bold">
      <ArrowUpRight className="w-3.5 h-3.5" />
      <span>+${PORTFOLIO_SUMMARY.dayChange.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      <span className="text-emerald-500">({PORTFOLIO_SUMMARY.dayChangePct}%)</span>
    </div>
  );
};

export const DayChange119B: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs">
      <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-800 font-semibold">
        +$4,892.15
      </span>
      <span className="text-emerald-400 font-bold flex items-center">
        <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> +0.58%
      </span>
    </div>
  );
};

export const DayChange119C: React.FC = () => {
  return (
    <span className="inline-block font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">
      ▲ +0.58% Today
    </span>
  );
};

// ==========================================
// COMPONENT 122: Trend line (122.a, 122.b, 122.c)
// ==========================================

export const TrendLine122A: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
      <svg className="w-16 h-5" viewBox="0 0 60 20">
        <polyline
          fill="none"
          stroke="#10B981"
          strokeWidth="1.75"
          points="2,16 12,14 22,15 32,10 42,12 52,4 58,5"
        />
        <circle cx="58" cy="5" r="2" fill="#10B981" />
      </svg>
      <span className="text-[10px] font-mono text-emerald-400 font-bold">+4.2%</span>
    </div>
  );
};

export const TrendLine122B: React.FC = () => {
  return (
    <div className="inline-flex items-end gap-0.5 h-4 px-1 bg-zinc-900 rounded">
      {[4, 6, 5, 8, 7, 10, 12, 11, 14].map((h, i) => (
        <div key={i} className="w-1 bg-emerald-500 rounded-t" style={{ height: `${h}px` }} />
      ))}
    </div>
  );
};

export const TrendLine122C: React.FC = () => {
  return (
    <div className="inline-block relative w-14 h-4">
      <svg className="w-full h-full" viewBox="0 0 50 16">
        <defs>
          <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon fill="url(#trendGlow)" points="0,16 10,12 20,13 30,8 40,9 50,3 50,16 0,16" />
        <polyline fill="none" stroke="#6366F1" strokeWidth="1.5" points="0,16 10,12 20,13 30,8 40,9 50,3" />
      </svg>
    </div>
  );
};

// ==========================================
// COMPONENT 123: Weight indicator (123.a, 123.b, 123.c)
// ==========================================

export const WeightIndicator123A: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '27%' }} />
      </div>
      <span className="text-xs font-mono font-semibold text-zinc-300">27.0%</span>
    </div>
  );
};

export const WeightIndicator123B: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="relative w-4 h-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#27272A"
            strokeWidth="6"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#6366F1"
            strokeWidth="6"
            strokeDasharray="27, 100"
          />
        </svg>
      </div>
      <span className="text-xs font-mono font-bold text-indigo-400">27%</span>
    </div>
  );
};

export const WeightIndicator123C: React.FC = () => {
  return (
    <span className="inline-block font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300 border border-zinc-750">
      <strong className="text-indigo-400">27.0%</strong> book
    </span>
  );
};

// ==========================================
// COMPONENT 134: Asset-type badge (134.a, 134.b, 134.c)
// ==========================================

export const AssetTypeBadge134A: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-700/60">
        Stock
      </span>
      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60">
        Fund
      </span>
      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60">
        Crypto
      </span>
      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
        Bond
      </span>
      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-zinc-850 text-zinc-300 border border-zinc-700">
        Cash
      </span>
    </div>
  );
};

export const AssetTypeBadge134B: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400">
      <span className="hover:text-white transition-colors">[STK]</span>
      <span className="hover:text-white transition-colors">[ETF]</span>
      <span className="hover:text-white transition-colors">[CRY]</span>
      <span className="hover:text-white transition-colors">[BND]</span>
      <span className="hover:text-white transition-colors">[CSH]</span>
    </div>
  );
};

export const AssetTypeBadge134C: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-sans">
      <span className="inline-flex items-center gap-1 text-zinc-300">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Equity
      </span>
      <span className="inline-flex items-center gap-1 text-zinc-300">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> ETF Fund
      </span>
      <span className="inline-flex items-center gap-1 text-zinc-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Crypto
      </span>
    </div>
  );
};
