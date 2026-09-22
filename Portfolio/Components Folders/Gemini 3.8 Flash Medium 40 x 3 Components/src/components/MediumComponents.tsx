import React from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, 
  Check, Bell, ShieldCheck,
  Sparkles
} from 'lucide-react';
import { MOCK_HOLDINGS, PORTFOLIO_SUMMARY, ASSET_CLASS_BREAKDOWN, ACCOUNTS_DATA, CURRENCY_DATA } from '../data/mockData';

// ==========================================
// COMPONENT 51: Key figures (51.a, 51.b, 51.c)
// ==========================================

export const KeyFigures51A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <span className="text-[11px] text-zinc-400 font-medium">Principal Invested</span>
          <div className="text-xl font-bold font-mono text-zinc-100 mt-0.5">
            ${PORTFOLIO_SUMMARY.costBasis.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Net cumulative deposits</span>
        </div>

        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <span className="text-[11px] text-zinc-400 font-medium">Unrealized Gain</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
            +${PORTFOLIO_SUMMARY.unrealizedGain.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-500 font-mono">+{PORTFOLIO_SUMMARY.unrealizedGainPct}% total return</span>
        </div>

        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <span className="text-[11px] text-zinc-400 font-medium">Today's Market Move</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5 flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-0.5 inline" />
            +${PORTFOLIO_SUMMARY.dayChange.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">+{PORTFOLIO_SUMMARY.dayChangePct}% in 24h</span>
        </div>

        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <span className="text-[11px] text-zinc-400 font-medium">Cash Reserves</span>
          <div className="text-xl font-bold font-mono text-zinc-100 mt-0.5">
            ${PORTFOLIO_SUMMARY.cashBalance.toLocaleString()}
          </div>
          <span className="text-[10px] text-indigo-400 font-mono">{PORTFOLIO_SUMMARY.cashYield}% APY sweep</span>
        </div>
      </div>
    </div>
  );
};

export const KeyFigures51B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-6 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
        <div className="flex-1 min-w-[140px] pt-2 md:pt-0">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Invested Capital</div>
          <div className="text-2xl font-bold font-mono text-zinc-100 mt-1">${PORTFOLIO_SUMMARY.costBasis.toLocaleString()}</div>
          <div className="w-12 h-1 bg-blue-500 rounded-full mt-2" />
        </div>
        <div className="flex-1 min-w-[140px] pt-2 md:pt-0 md:pl-6">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">All-Time Profit</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">+${PORTFOLIO_SUMMARY.unrealizedGain.toLocaleString()}</div>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-2" />
        </div>
        <div className="flex-1 min-w-[140px] pt-2 md:pt-0 md:pl-6">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">24H Session Change</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">+{PORTFOLIO_SUMMARY.dayChangePct}%</div>
          <div className="w-12 h-1 bg-indigo-500 rounded-full mt-2" />
        </div>
        <div className="flex-1 min-w-[140px] pt-2 md:pt-0 md:pl-6">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Liquid Cash</div>
          <div className="text-2xl font-bold font-mono text-zinc-200 mt-1">${PORTFOLIO_SUMMARY.cashBalance.toLocaleString()}</div>
          <div className="w-12 h-1 bg-zinc-600 rounded-full mt-2" />
        </div>
      </div>
    </div>
  );
};

export const KeyFigures51C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 font-mono text-xs text-zinc-300">
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-500">PORTFOLIO VITAL SIGNS:</span>
        </div>
        <div>
          <span className="text-zinc-500">INVESTED: </span>
          <span className="text-zinc-100 font-bold">${PORTFOLIO_SUMMARY.costBasis.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-zinc-500">GAIN: </span>
          <span className="text-emerald-400 font-bold">+${PORTFOLIO_SUMMARY.unrealizedGain.toLocaleString()} (+{PORTFOLIO_SUMMARY.unrealizedGainPct}%)</span>
        </div>
        <div>
          <span className="text-zinc-500">DAY: </span>
          <span className="text-emerald-400 font-bold">+${PORTFOLIO_SUMMARY.dayChange.toLocaleString()} (+{PORTFOLIO_SUMMARY.dayChangePct}%)</span>
        </div>
        <div>
          <span className="text-zinc-500">CASH: </span>
          <span className="text-indigo-400 font-bold">${PORTFOLIO_SUMMARY.cashBalance.toLocaleString()} (5.0%)</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 52: Drift from target (52.a, 52.b, 52.c)
// ==========================================

export const DriftFromTarget52A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Asset Class Drift & Rebalance Dollar Transfer</h4>
          <p className="text-xs text-zinc-400">Capital movements required to return each bucket to policy targets</p>
        </div>
        <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800">
          Rebalance Threshold: &gt;2% Drift
        </span>
      </div>

      <div className="space-y-3">
        {ASSET_CLASS_BREAKDOWN.map(item => {
          const isOver = item.driftPct > 0;
          const transferDollar = Math.abs((PORTFOLIO_SUMMARY.totalValue * (item.driftPct / 100)));
          return (
            <div key={item.name} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-zinc-200">{item.name}</div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Current: {item.currentPct}% | Target: {item.targetPct}%
                </div>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span className={`font-bold px-2 py-0.5 rounded ${
                  isOver ? 'bg-amber-950 text-amber-300 border border-amber-800' : 
                  item.driftPct < 0 ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-zinc-500'
                }`}>
                  {isOver ? '+' : ''}{item.driftPct}%
                </span>
                <span className="text-zinc-300 font-semibold w-24 text-right">
                  {item.driftPct === 0 ? 'Balanced' : `${isOver ? 'Trim ' : 'Add '} $${transferDollar.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DriftFromTarget52B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-zinc-100">Target Gap Visual Meter</h4>
        <span className="text-xs font-mono text-zinc-400">5 Allocations</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ASSET_CLASS_BREAKDOWN.map(item => (
          <div key={item.name} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
            <div className="text-xs text-zinc-400 truncate">{item.name}</div>
            <div className="text-lg font-bold font-mono text-zinc-100 my-1">{item.currentPct}%</div>
            <div className="text-[10px] font-mono text-zinc-500">Target: {item.targetPct}%</div>
            <div className={`mt-2 text-[10px] font-mono font-bold ${item.driftPct > 0 ? 'text-amber-400' : item.driftPct < 0 ? 'text-indigo-400' : 'text-emerald-400'}`}>
              {item.driftPct > 0 ? `+${item.driftPct}% Over` : item.driftPct < 0 ? `${item.driftPct}% Under` : 'On Target'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DriftFromTarget52C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-bold text-zinc-200">Rebalance Action Trigger</span>
        <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold transition-colors">
          Auto-Execute Rebalance
        </button>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">
        Equities have drifted <strong className="text-amber-400">+2.8% ($23,595)</strong> above policy due to recent tech appreciation. Reallocating $21,067 to Fixed Income restores your Sharpe-optimal risk frontier.
      </p>
    </div>
  );
};

// ==========================================
// COMPONENT 53: Allocation story (53.a, 53.b, 53.c)
// ==========================================

export const AllocationStory53A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">The Book Narrative</span>
      </div>
      <h3 className="text-xl font-serif text-zinc-100 mb-3">
        Engineered for Asymmetric Compounding
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">
        Your portfolio is anchored by a <strong className="text-indigo-300">72.8% equity engine</strong> designed to capture global productivity gains via S&P 500 and world index leaders. A <strong className="text-emerald-300">12.5% fixed-income shield</strong> insulates against macroeconomic volatility, while a <strong className="text-amber-300">3.9% alternative reserve (Bitcoin)</strong> provides an asymmetric hedge against currency debasement. Supported by <strong className="text-zinc-200">5.0% high-yield cash</strong>, you maintain complete optionality for future market pullbacks.
      </p>
    </div>
  );
};

export const AllocationStory53B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="text-xs font-mono uppercase text-zinc-400 mb-3">Portfolio Architecture: 3 Pillars</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-xs font-bold text-indigo-400 mb-1">1. The Growth Locomotive</div>
          <div className="text-sm font-semibold text-zinc-200">Equities (72.8%)</div>
          <p className="text-xs text-zinc-400 mt-2">Compounders driving long-term capital appreciation with tech & healthcare dominance.</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-xs font-bold text-emerald-400 mb-1">2. The Ballast & Yield</div>
          <div className="text-sm font-semibold text-zinc-200">Treasuries & Bonds (12.5%)</div>
          <p className="text-xs text-zinc-400 mt-2">Dependable income and negative correlation during acute equity selloffs.</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-xs font-bold text-amber-400 mb-1">3. The Dry Powder & Crypto</div>
          <div className="text-sm font-semibold text-zinc-200">Cash & BTC (8.9%)</div>
          <p className="text-xs text-zinc-400 mt-2">Instant liquidity earning 4.85% APY plus non-sovereign monetary store.</p>
        </div>
      </div>
    </div>
  );
};

export const AllocationStory53C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-indigo-950/80 border border-indigo-800 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold">
        M
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-200">Meridian Portfolio Intelligence</span>
          <span className="text-[10px] font-mono text-zinc-500">Weekly Briefing</span>
        </div>
        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
          "The portfolio is running slightly ahead of target growth (+4.8% YTD) primarily due to semiconductor outperformance. Asset protection metrics remain pristine with zero speculative leverage."
        </p>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 54: Income over time (54.a, 54.b, 54.c)
// ==========================================

export const IncomeOverTime54A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Cumulative Dividend Inflow (5 Years)</h4>
          <p className="text-xs text-zinc-400">Total historical income compounding curve</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold">+$48,720 Total Collected</span>
      </div>

      <div className="h-32 w-full relative">
        <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon fill="url(#incGrad)" points="0,95 100,85 200,68 300,48 400,28 500,8 500,95 0,95" />
          <polyline fill="none" stroke="#10B981" strokeWidth="2.5" points="0,95 100,85 200,68 300,48 400,28 500,8" />
        </svg>
      </div>
      <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-2">
        <span>2020: $4,200</span>
        <span>2021: $6,800</span>
        <span>2022: $9,140</span>
        <span>2023: $10,480</span>
        <span>2024: $13,220</span>
        <span className="text-emerald-400 font-bold">2025E: $14,820</span>
      </div>
    </div>
  );
};

export const IncomeOverTime54B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-zinc-100">Monthly Income Streams</h4>
        <span className="text-xs font-mono text-zinc-400">Last 6 Months</span>
      </div>

      <div className="grid grid-cols-6 gap-2 text-center font-mono">
        {[
          { m: 'Sep', val: '$2,020' },
          { m: 'Oct', val: '$780' },
          { m: 'Nov', val: '$690' },
          { m: 'Dec', val: '$2,800' },
          { m: 'Jan', val: '$780' },
          { m: 'Feb', val: '$620' },
        ].map(item => (
          <div key={item.m} className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-500">{item.m}</div>
            <div className="text-xs font-bold text-emerald-400 mt-1">{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const IncomeOverTime54C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans">
      <div className="flex justify-between items-center text-xs mb-2">
        <span className="text-zinc-400">Income Stream Composition</span>
        <span className="font-mono text-emerald-400 font-bold">100% Reinvested</span>
      </div>
      <div className="flex gap-2 text-xs">
        <div className="flex-1 p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-zinc-500 text-[10px]">Equity Dividends</div>
          <div className="font-mono font-bold text-zinc-100 mt-0.5">$9,840 (66%)</div>
        </div>
        <div className="flex-1 p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-zinc-500 text-[10px]">Bond Coupons</div>
          <div className="font-mono font-bold text-zinc-100 mt-0.5">$2,940 (20%)</div>
        </div>
        <div className="flex-1 p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-zinc-500 text-[10px]">Cash APY Sweep</div>
          <div className="font-mono font-bold text-zinc-100 mt-0.5">$2,040 (14%)</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 57: Projected income (57.a, 57.b, 57.c)
// ==========================================

export const ProjectedIncome57A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Next 12-Month Projected Income</h4>
          <p className="text-xs text-zinc-400">Forward cash distribution estimate across all accounts</p>
        </div>
        <div className="text-right font-mono">
          <div className="text-lg font-bold text-emerald-400">$14,820.50</div>
          <div className="text-[10px] text-zinc-500">$1,235.04 / month avg</div>
        </div>
      </div>

      <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
        <span className="text-zinc-300">Reinvestment vs Cash Payout</span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
            DRIP Active (100% Reinvested)
          </span>
        </div>
      </div>
    </div>
  );
};

export const ProjectedIncome57B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-zinc-100">Daily Living Expense Coverage Meter</h4>
        <span className="text-xs font-mono text-emerald-400">Yield Freedom Metric</span>
      </div>

      <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-zinc-300">Current Dividend Run-Rate ($40.60/day)</span>
          <span className="font-mono text-zinc-400">41% of $100/day Target</span>
        </div>
        <div className="h-2 bg-zinc-850 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '41%' }} />
        </div>
        <div className="text-[11px] text-zinc-400 mt-2">
          Your passive income covers <strong>12.3 days per month</strong> of standard baseline living expenses without selling any principal.
        </div>
      </div>
    </div>
  );
};

export const ProjectedIncome57C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-zinc-200">Forward Yield on Current Market Cap</span>
        <span className="font-mono text-zinc-400">Yield on Cost: <strong className="text-emerald-400">2.40%</strong></span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center font-mono">
        <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
          <span className="text-zinc-500 text-[10px]">Forward Yield</span>
          <div className="text-zinc-100 font-bold mt-0.5">1.76%</div>
        </div>
        <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
          <span className="text-zinc-500 text-[10px]">Cash Sweep</span>
          <div className="text-zinc-100 font-bold mt-0.5">4.85%</div>
        </div>
        <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
          <span className="text-zinc-500 text-[10px]">Bond Duration</span>
          <div className="text-zinc-100 font-bold mt-0.5">3.92%</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 60: Fair value vs price (60.a, 60.b, 60.c)
// ==========================================

export const FairValueVsPrice60A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Discount & Premium to Fair Value Target</h4>
          <p className="text-xs text-zinc-400">Consensus discounted cash-flow valuation corridor</p>
        </div>
        <span className="text-xs font-mono text-emerald-400">Aggregate: +4.8% Undervalued</span>
      </div>

      <div className="space-y-2.5">
        {[
          { ticker: 'ASML', price: 785.4, fair: 880.0, diff: '+12.0%', undervalued: true },
          { ticker: 'MSFT', price: 428.5, fair: 460.0, diff: '+7.4%', undervalued: true },
          { ticker: 'NVDA', price: 138.25, fair: 145.0, diff: '+4.9%', undervalued: true },
          { ticker: 'AAPL', price: 228.9, fair: 235.0, diff: '+2.7%', undervalued: true },
          { ticker: 'ICLN', price: 13.75, fair: 17.5, diff: '+27.3%', undervalued: true },
        ].map(item => (
          <div key={item.ticker} className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="font-bold text-zinc-200">{item.ticker}</span>
              <span className="text-zinc-500 text-[11px] ml-2">Market: ${item.price} vs Fair: ${item.fair}</span>
            </div>
            <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              {item.diff} Upside
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FairValueVsPrice60B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-zinc-100">Margin of Safety Distribution</h4>
        <span className="text-xs font-mono text-zinc-400">5 Direct Holdings</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { ticker: 'ASML', upside: '+12.0%', status: 'Attractive Buy' },
          { ticker: 'MSFT', upside: '+7.4%', status: 'Fair Value' },
          { ticker: 'NVDA', upside: '+4.9%', status: 'Fair Value' },
          { ticker: 'AAPL', upside: '+2.7%', status: 'Hold' },
        ].map(item => (
          <div key={item.ticker} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
            <span className="font-mono font-bold text-zinc-200 text-xs">{item.ticker}</span>
            <div className="text-base font-bold font-mono text-emerald-400 my-1">{item.upside}</div>
            <span className="text-[10px] text-zinc-500 font-sans">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FairValueVsPrice60C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-zinc-200">Portfolio Valuation Multiple</span>
          <div className="text-zinc-400 text-[11px] mt-0.5">Weighted P/E: 26.4x | S&P 500: 25.8x</div>
        </div>
        <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 font-mono">
          P/E Neutral (+2.3% Premium)
        </span>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 64: Cash by account (64.a, 64.b, 64.c)
// ==========================================

export const CashByAccount64A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Cash Balances & Yield by Account</h4>
          <p className="text-xs text-zinc-400">Total dry powder across brokerages and retirement accounts</p>
        </div>
        <div className="text-right font-mono">
          <div className="text-base font-bold text-white">${PORTFOLIO_SUMMARY.cashBalance.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">4.85% Blended APY</div>
        </div>
      </div>

      <div className="space-y-2.5">
        {ACCOUNTS_DATA.map(acc => (
          <div key={acc.id} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-zinc-200">{acc.name}</div>
              <div className="text-[11px] text-zinc-500">{acc.type}</div>
            </div>
            <div className="text-right font-mono">
              <div className="font-bold text-zinc-100">${acc.cash.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{acc.cashApy}% APY</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CashByAccount64B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-zinc-100">Cash Drag vs Yield Opportunity</h4>
        <span className="text-xs font-mono text-zinc-400">5.0% Portfolio Share</span>
      </div>

      <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-zinc-200">Annual Cash Yield Income:</span>
          <div className="text-[11px] text-zinc-400 mt-0.5">Generating $2,044.27/year in zero-risk treasury returns</div>
        </div>
        <span className="font-mono text-emerald-400 font-bold text-sm">+$170.35/mo</span>
      </div>
    </div>
  );
};

export const CashByAccount64C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">Automated Cash Sweep Status:</span>
        <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" /> All 3 Accounts Earning &gt;4.80% APY
        </span>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 68: Leaders and laggards (68.a, 68.b, 68.c)
// ==========================================

export const LeadersAndLaggards68A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Leaders & Laggards Leaderboard</h4>
          <p className="text-xs text-zinc-400">Today's top movers across book</p>
        </div>
        <span className="text-xs font-mono text-zinc-400">Live Quotes</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Top Gainers Today
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between"><span className="text-zinc-200">BTC</span> <span className="text-emerald-400 font-bold">+3.12%</span></div>
            <div className="flex justify-between"><span className="text-zinc-200">NVDA</span> <span className="text-emerald-400 font-bold">+2.85%</span></div>
            <div className="flex justify-between"><span className="text-zinc-200">ASML</span> <span className="text-emerald-400 font-bold">+1.45%</span></div>
          </div>
        </div>

        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Laggards Today
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between"><span className="text-zinc-200">ICLN</span> <span className="text-rose-400 font-bold">-1.22%</span></div>
            <div className="flex justify-between"><span className="text-zinc-200">AAPL</span> <span className="text-rose-400 font-bold">-0.35%</span></div>
            <div className="flex justify-between"><span className="text-zinc-200">TLT</span> <span className="text-rose-400 font-bold">-0.15%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LeadersAndLaggards68B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-zinc-100">All-Time Wealth Drivers</h4>
        <span className="text-xs font-mono text-emerald-400">+121.5% Peak Return</span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        <div className="p-2 bg-zinc-950 rounded flex justify-between items-center border border-zinc-800">
          <span className="text-zinc-200 font-bold">1. NVDA (Nvidia)</span>
          <span className="text-emerald-400 font-bold">+121.55% (+$8,343)</span>
        </div>
        <div className="p-2 bg-zinc-950 rounded flex justify-between items-center border border-zinc-800">
          <span className="text-zinc-200 font-bold">2. BTC (Bitcoin)</span>
          <span className="text-emerald-400 font-bold">+108.33% (+$17,290)</span>
        </div>
        <div className="p-2 bg-zinc-950 rounded flex justify-between items-center border border-zinc-800">
          <span className="text-zinc-200 font-bold">3. MSFT (Microsoft)</span>
          <span className="text-emerald-400 font-bold">+33.86% (+$26,016)</span>
        </div>
      </div>
    </div>
  );
};

export const LeadersAndLaggards68C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">Breadth Ratio:</span>
        <span className="text-zinc-200 font-mono">
          <strong className="text-emerald-400">8 Up</strong> vs <strong className="text-rose-400">2 Down</strong> (80% Positive Breadth)
        </span>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 72: Account split (72.a, 72.b, 72.c)
// ==========================================

export const AccountSplit72A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Tax Wrapper Allocation</h4>
          <p className="text-xs text-zinc-400">Distribution across Taxable, Roth IRA, and 401(k) accounts</p>
        </div>
        <span className="text-xs font-mono text-indigo-400">3 Master Accounts</span>
      </div>

      <div className="space-y-3">
        {ACCOUNTS_DATA.map(acc => {
          const share = ((acc.balance / PORTFOLIO_SUMMARY.totalValue) * 100).toFixed(1);
          return (
            <div key={acc.id} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-zinc-200">{acc.name}</span>
                <span className="font-mono text-zinc-100 font-bold">${acc.balance.toLocaleString()} ({share}%)</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${share}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AccountSplit72B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-zinc-100">Tax-Sheltered vs Taxable Capital</h4>
        <span className="text-xs font-mono text-emerald-400">37.8% Shielded</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-[10px]">Taxable Brokerage</div>
          <div className="text-lg font-bold font-mono text-zinc-200 mt-1">$524,190</div>
          <div className="text-[10px] text-zinc-500 font-mono">62.2% of net worth</div>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-[10px]">Tax-Advantaged (Roth + 401k)</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">$318,500</div>
          <div className="text-[10px] text-emerald-500 font-mono">37.8% shielded from taxes</div>
        </div>
      </div>
    </div>
  );
};

export const AccountSplit72C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">Optimal Withdrawal Sequence:</span>
        <span className="text-zinc-200 font-mono">Taxable ➔ 401(k) ➔ Roth IRA (Preserve Tax-Free)</span>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 73: Currency exposure (73.a, 73.b, 73.c)
// ==========================================

export const CurrencyExposure73A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Currency Exposure Distribution</h4>
          <p className="text-xs text-zinc-400">Underlying foreign currency sensitivity</p>
        </div>
        <span className="text-xs font-mono text-zinc-400">4 Currencies</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CURRENCY_DATA.map(curr => (
          <div key={curr.code} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
            <span className="font-mono font-bold text-zinc-200 text-xs">{curr.code} ({curr.symbol})</span>
            <div className="text-lg font-bold font-mono text-zinc-100 my-1">{curr.weight}%</div>
            <div className="text-[10px] text-zinc-500 font-mono">${curr.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CurrencyExposure73B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-zinc-100">FX Sensitivity Shock Test</h4>
        <span className="text-xs font-mono text-zinc-400">USD +5% Rise</span>
      </div>

      <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-zinc-200">Impact of USD Strengthening +5%:</span>
          <div className="text-[11px] text-zinc-500 mt-0.5">Non-USD assets (EUR, GBP, CHF) face -$9,940 translation drag</div>
        </div>
        <span className="font-mono text-rose-400 font-bold">-1.18% Portfolio Impact</span>
      </div>
    </div>
  );
};

export const CurrencyExposure73C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">Home Currency Dominance:</span>
        <span className="font-mono text-zinc-200 font-bold">76.4% USD / 23.6% Global FX</span>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 79: Needs attention (79.a, 79.b, 79.c)
// ==========================================

export const NeedsAttention79A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-zinc-100">Action Items & Portfolio Alerts</h4>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
          3 Items Need Review
        </span>
      </div>

      <div className="space-y-2.5">
        {[
          { title: 'Tax Loss Available in ICLN', desc: '-$5,700 unrealized loss eligible to offset 2025 gains', action: 'Harvest Now', urgent: true },
          { title: 'Fixed Income Target Drift', desc: 'Bond weight is 12.5% vs 15.0% target allocation', action: 'Rebalance', urgent: false },
          { title: 'NVDA Single-Stock Weight (>14%)', desc: 'Single equity concentration exceeds 10% risk policy', action: 'Review Limit', urgent: false },
        ].map(item => (
          <div key={item.title} className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-zinc-200">{item.title}</div>
              <div className="text-[11px] text-zinc-400">{item.desc}</div>
            </div>
            <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-semibold text-xs transition-colors flex-shrink-0 ml-3">
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const NeedsAttention79B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-zinc-100">Tax Optimization Opportunity</h4>
        <span className="text-xs font-mono text-emerald-400">High Priority</span>
      </div>

      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-zinc-200">Harvest $5,700 loss from Clean Energy ETF</div>
          <p className="text-xs text-zinc-400 mt-1">Reinvest immediately into global index to maintain exposure while banking tax deduction.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors ml-4">
          Execute Harvest
        </button>
      </div>
    </div>
  );
};

export const NeedsAttention79C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div className="text-zinc-300">
          <strong className="text-white">Security & Margin Check:</strong> Zero debt leverage, zero margin loans, fully segregated multi-custody holdings.
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 83: Holding card (83.a, 83.b, 83.c)
// ==========================================

export const HoldingCard83A: React.FC = () => {
  const h = MOCK_HOLDINGS[0]; // NVDA

  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 font-mono font-bold text-xs flex items-center justify-center text-indigo-400">
            {h.ticker}
          </span>
          <div>
            <div className="text-sm font-bold text-zinc-100">{h.name}</div>
            <div className="text-[11px] text-zinc-500 font-mono">{h.sector}</div>
          </div>
        </div>
        <div className="text-right font-mono">
          <div className="text-base font-bold text-white">${h.currentPrice.toFixed(2)}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">+{h.dayChangePct}%</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 my-4 text-center font-mono text-xs">
        <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-sans">Value</div>
          <div className="font-bold text-zinc-200 mt-0.5">${h.value.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-sans">Gain</div>
          <div className="font-bold text-emerald-400 mt-0.5">+{h.unrealizedGainPct.toFixed(1)}%</div>
        </div>
        <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-sans">Weight</div>
          <div className="font-bold text-indigo-400 mt-0.5">{h.weightPct}%</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-zinc-500">{h.shares} shares @ ${h.avgBuyPrice}</span>
        <button className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium text-xs">
          Trade Position
        </button>
      </div>
    </div>
  );
};

export const HoldingCard83B: React.FC = () => {
  const h = MOCK_HOLDINGS[2]; // MSFT

  return (
    <div className="bg-zinc-900/90 rounded-xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-mono uppercase text-indigo-400">Cloud & Enterprise</span>
          <h4 className="text-base font-bold text-zinc-100">{h.name} ({h.ticker})</h4>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
          +$26,016 Gain
        </span>
      </div>

      <div className="flex justify-between items-center text-xs font-mono py-2 border-y border-zinc-800 my-2">
        <span className="text-zinc-400">Position Value: <strong className="text-zinc-100">${h.value.toLocaleString()}</strong></span>
        <span className="text-zinc-400">Share of Book: <strong className="text-indigo-400">{h.weightPct}%</strong></span>
      </div>

      <div className="text-xs text-zinc-400 mt-2">
        Target Fair Value: <strong className="text-emerald-400 font-mono">${h.fairValue}</strong> (+7.4% discount corridor)
      </div>
    </div>
  );
};

export const HoldingCard83C: React.FC = () => {
  const h = MOCK_HOLDINGS[1]; // VOO

  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-xs flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="font-mono font-bold text-sm text-zinc-100">{h.ticker}</div>
        <div className="text-zinc-400">{h.name} • <span className="font-mono text-zinc-200">${h.value.toLocaleString()}</span></div>
      </div>
      <div className="flex items-center gap-4 font-mono">
        <span className="text-emerald-400 font-bold">+{h.unrealizedGainPct.toFixed(1)}%</span>
        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">{h.weightPct}% Weight</span>
      </div>
    </div>
  );
};
