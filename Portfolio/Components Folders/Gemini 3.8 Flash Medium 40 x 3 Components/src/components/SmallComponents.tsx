import React from 'react';
import { 
  TrendingUp, TrendingDown, CheckCircle2,
  Shield, Zap, Radio
} from 'lucide-react';
import { PORTFOLIO_SUMMARY, MOCK_HOLDINGS, ASSET_CLASS_BREAKDOWN } from '../data/mockData';

// ==========================================
// COMPONENT 91: Portfolio Pulse (91.a, 91.b, 91.c)
// ==========================================

export const PortfolioPulse91A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-mono font-bold uppercase tracking-wider text-emerald-400">Meridian Pulse</span>
      </div>
      <p className="text-zinc-200 leading-relaxed">
        Portfolio gained <strong className="text-emerald-400 font-mono">+$4,892.15 (+0.58%)</strong> today powered by semiconductor strength. No emergency interventions needed; bond allocation remains 2.5% below policy.
      </p>
    </div>
  );
};

export const PortfolioPulse91B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-4 font-sans flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
          <Radio className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-zinc-100">Market Briefing & Risk Radar</div>
          <div className="text-zinc-400 text-[11px]">All systems nominal. All 3 brokerage accounts synchronized.</div>
        </div>
      </div>
      <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs flex-shrink-0">
        Status: Green
      </span>
    </div>
  );
};

export const PortfolioPulse91C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 font-mono text-xs flex items-center justify-between text-zinc-300">
      <div className="flex items-center gap-2 truncate">
        <span className="text-indigo-400 font-bold">[PULSE]</span>
        <span className="truncate">S&P 500 ETF (VOO) leads book at +$1,398 today • Next dividend in 24 days.</span>
      </div>
      <span className="text-[10px] text-zinc-500 flex-shrink-0 ml-3">14:32 EST</span>
    </div>
  );
};

// ==========================================
// COMPONENT 94: Goal progress (94.a, 94.b, 94.c)
// ==========================================

export const GoalProgress94A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-zinc-200">Goal: $1,000,000 Net Worth by Nov 2026</span>
        <span className="font-mono text-emerald-400 font-bold">84.3% Reached</span>
      </div>
      <div className="h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84.3%' }} />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-2">
        <span>Current: ${PORTFOLIO_SUMMARY.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        <span>Remaining: $157,310</span>
      </div>
    </div>
  );
};

export const GoalProgress94B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-4 font-sans flex items-center justify-between">
      <div>
        <div className="text-xs text-zinc-400">Target Horizon Countdown</div>
        <div className="text-lg font-bold font-mono text-zinc-100 mt-0.5">624 Days to $1M</div>
        <div className="text-[10px] text-emerald-400 font-mono">Pacing 4.2 months ahead of schedule</div>
      </div>
      <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center font-mono font-bold text-xs text-emerald-400 bg-emerald-950/40">
        84%
      </div>
    </div>
  );
};

export const GoalProgress94C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 font-sans text-xs flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="text-zinc-200">Milestone $750k crossed • Next stop: <strong>$1.0M</strong></span>
      </div>
      <span className="font-mono text-zinc-400">ETA: Nov 2026</span>
    </div>
  );
};

// ==========================================
// COMPONENT 95: Allocation at a glance (95.a, 95.b, 95.c)
// ==========================================

export const AllocationGlance95A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-zinc-200">Asset Class Allocation</span>
        <span className="font-mono text-zinc-400">Policy Targets Marked</span>
      </div>
      <div className="h-3 rounded-full flex overflow-hidden">
        {ASSET_CLASS_BREAKDOWN.map(cls => (
          <div 
            key={cls.name} 
            style={{ width: `${cls.currentPct}%`, backgroundColor: cls.color }} 
            title={`${cls.name}: ${cls.currentPct}% (Target: ${cls.targetPct}%)`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-mono text-zinc-400">
        {ASSET_CLASS_BREAKDOWN.map(cls => (
          <div key={cls.name} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cls.color }} />
            <span>{cls.name}: {cls.currentPct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AllocationGlance95B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-4 font-sans">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-zinc-400">Allocation Health</span>
        <span className="text-emerald-400 font-mono">Balanced</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
        <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
          <span className="text-[10px] text-zinc-500">Eq</span>
          <div className="text-zinc-200 font-bold">72.8%</div>
        </div>
        <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
          <span className="text-[10px] text-zinc-500">Bonds</span>
          <div className="text-zinc-200 font-bold">12.5%</div>
        </div>
        <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
          <span className="text-[10px] text-zinc-500">Cash</span>
          <div className="text-zinc-200 font-bold">5.0%</div>
        </div>
        <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
          <span className="text-[10px] text-zinc-500">Alts</span>
          <div className="text-zinc-200 font-bold">3.9%</div>
        </div>
      </div>
    </div>
  );
};

export const AllocationGlance95C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 font-mono text-xs flex items-center justify-between text-zinc-300">
      <span>MIX: 73% Stock / 13% Bond / 5% Cash / 4% Crypto / 5% Real</span>
      <span className="text-indigo-400 font-bold">97.2% Target Fit</span>
    </div>
  );
};

// ==========================================
// COMPONENT 96: Returns by period (96.a, 96.b, 96.c)
// ==========================================

export const ReturnsByPeriod96A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans">
      <div className="text-xs font-bold text-zinc-200 mb-3">Multi-Horizon Performance Strip</div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono text-xs">
        {[
          { p: '1D', val: '+0.58%' },
          { p: '1W', val: '+1.42%' },
          { p: '1M', val: '+3.15%' },
          { p: 'YTD', val: '+8.40%' },
          { p: '1Y', val: '+24.62%' },
          { p: 'ALL', val: '+36.26%' },
        ].map(item => (
          <div key={item.p} className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-500">{item.p}</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReturnsByPeriod96B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-4 font-sans flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-xs text-zinc-400">1-Year Annualized Return</div>
        <div className="text-xl font-bold font-mono text-emerald-400">+24.62%</div>
      </div>
      <div className="text-right font-mono text-xs">
        <span className="text-zinc-500">Benchmark (S&P): </span>
        <span className="text-zinc-200 font-bold">+21.14%</span>
        <div className="text-[10px] text-emerald-400 font-bold mt-0.5">+3.48% Outperformance</div>
      </div>
    </div>
  );
};

export const ReturnsByPeriod96C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 font-mono text-xs flex items-center justify-between text-zinc-300">
      <div className="flex gap-4">
        <span>1M: <strong className="text-emerald-400">+3.15%</strong></span>
        <span>YTD: <strong className="text-emerald-400">+8.40%</strong></span>
        <span>1Y: <strong className="text-emerald-400">+24.62%</strong></span>
      </div>
      <span className="text-zinc-500 text-[10px]">TWRR Method</span>
    </div>
  );
};

// ==========================================
// COMPONENT 97: Risk level (97.a, 97.b, 97.c)
// ==========================================

export const RiskLevel97A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-zinc-200">Portfolio Risk Profile</span>
        <span className="font-mono text-indigo-400 font-bold">Moderate-Aggressive (3.8 / 5)</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 h-2">
        <div className="bg-emerald-500 rounded" />
        <div className="bg-emerald-500 rounded" />
        <div className="bg-indigo-500 rounded" />
        <div className="bg-indigo-500 rounded" />
        <div className="bg-zinc-800 rounded" />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-500 mt-2">
        <span>Conservative</span>
        <span>Growth Oriented</span>
        <span>Aggressive</span>
      </div>
    </div>
  );
};

export const RiskLevel97B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-4 font-sans flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-950 rounded-lg border border-indigo-800 text-indigo-400">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-zinc-200">Risk Metrics Composite</div>
          <div className="text-[11px] text-zinc-400">Beta: 0.94 • Volatility: 12.8% • Sharpe: 1.82</div>
        </div>
      </div>
      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-xs">
        Sub-Market Vol
      </span>
    </div>
  );
};

export const RiskLevel97C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 font-sans text-xs flex items-center justify-between">
      <span className="text-zinc-300">Risk classification: <strong>Core Wealth Compounder</strong></span>
      <span className="text-emerald-400 font-mono font-semibold">Max DD Cushion: 14%</span>
    </div>
  );
};

// ==========================================
// COMPONENT 100: 52-week range (100.a, 100.b, 100.c)
// ==========================================

export const Week52Range100A: React.FC = () => {
  const h = MOCK_HOLDINGS[0]; // NVDA
  const range = h.week52High - h.week52Low;
  const pct = ((h.currentPrice - h.week52Low) / range) * 100;

  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-zinc-200">{h.ticker} 52-Week Range</span>
        <span className="font-mono text-zinc-400">{pct.toFixed(0)}th Percentile</span>
      </div>
      <div className="relative h-2 bg-zinc-850 rounded-full">
        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
        <div className="absolute top-[-3px] w-3 h-3 bg-white rounded-full shadow" style={{ left: `calc(${pct}% - 6px)` }} />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-2">
        <span>Low: ${h.week52Low}</span>
        <span className="text-white font-bold">${h.currentPrice}</span>
        <span>High: ${h.week52High}</span>
      </div>
    </div>
  );
};

export const Week52Range100B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-4 font-sans flex items-center justify-between">
      <div>
        <div className="text-[11px] text-zinc-500">VOO 52W Corridor</div>
        <div className="text-sm font-bold font-mono text-zinc-100">$458.12 – $549.90</div>
      </div>
      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs">
        Near Highs (96%)
      </span>
    </div>
  );
};

export const Week52Range100C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 font-mono text-xs flex items-center justify-between text-zinc-400">
      <span>52W: [$75.60 ────●── $149.77]</span>
      <span className="text-emerald-400 font-bold">$138.25 NVDA</span>
    </div>
  );
};

// ==========================================
// COMPONENT 107: Winners vs losers (107.a, 107.b, 107.c)
// ==========================================

export const WinnersVsLosers107A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-zinc-200">Portfolio Breadth: Winners vs Losers</span>
        <span className="font-mono text-emerald-400 font-bold">80% Positive</span>
      </div>
      <div className="h-3 rounded-full flex overflow-hidden">
        <div className="bg-emerald-500 h-full" style={{ width: '80%' }} title="8 Winners" />
        <div className="bg-rose-500 h-full" style={{ width: '20%' }} title="2 Losers" />
      </div>
      <div className="flex justify-between text-[10px] font-mono mt-2">
        <span className="text-emerald-400 font-bold">8 Holdings Up (+${PORTFOLIO_SUMMARY.unrealizedGain + 10020})</span>
        <span className="text-rose-400 font-bold">2 Holdings Down (-$10,020)</span>
      </div>
    </div>
  );
};

export const WinnersVsLosers107B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-4 font-sans flex items-center justify-around text-center">
      <div>
        <div className="text-xs text-zinc-400 flex items-center justify-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Profitable
        </div>
        <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">8</div>
      </div>
      <div className="w-px h-8 bg-zinc-800" />
      <div>
        <div className="text-xs text-zinc-400 flex items-center justify-center gap-1">
          <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Underwater
        </div>
        <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">2</div>
      </div>
    </div>
  );
};

export const WinnersVsLosers107C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 font-mono text-xs flex items-center justify-between">
      <span className="text-zinc-300">P/L BREADTH: <strong className="text-emerald-400">80% GAINERS</strong></span>
      <span className="text-zinc-500 text-[11px]">TLT, ICLN loss positions</span>
    </div>
  );
};

// ==========================================
// COMPONENT 114: Health dial (114.a, 114.b, 114.c)
// ==========================================

export const HealthDial114A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans flex items-center justify-between">
      <div>
        <div className="text-xs text-zinc-400">Portfolio Health Grade</div>
        <div className="text-2xl font-bold font-mono text-white mt-0.5">84 <span className="text-sm text-zinc-500">/ 100</span></div>
        <div className="text-[10px] text-emerald-400">Top decile efficiency</div>
      </div>
      <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center font-mono font-bold text-sm text-emerald-400 bg-emerald-950/40">
        A-
      </div>
    </div>
  );
};

export const HealthDial114B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-4 font-sans">
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="text-zinc-300 font-bold">Health Index</span>
        <span className="font-mono text-emerald-400 font-bold">84%</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
      </div>
      <div className="text-[10px] text-zinc-500 mt-2">Zero critical vulnerabilities detected</div>
    </div>
  );
};

export const HealthDial114C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 font-sans text-xs flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-emerald-400" />
        <span className="text-zinc-200">Health: <strong className="text-emerald-400">84/100</strong> (Grade A-)</span>
      </div>
      <span className="text-zinc-500 text-[10px] font-mono">1 recommendation pending</span>
    </div>
  );
};
