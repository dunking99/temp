import React, { useState, useMemo } from 'react';
import { Compass, Search, Sparkles } from 'lucide-react';
import { ComponentCardWrapper } from './components/ComponentCardWrapper';
import { PORTFOLIO_SUMMARY } from './data/mockData';

// Huge Components
import {
  HoldingsTable1A, HoldingsTable1B, HoldingsTable1C,
  OverviewHero2A, OverviewHero2B, OverviewHero2C,
  HoldingsMap4A, HoldingsMap4B, HoldingsMap4C,
  MoneyFlow5A, MoneyFlow5B, MoneyFlow5C,
  FutureProjection8A, FutureProjection8B, FutureProjection8C,
  HealthScore18A, HealthScore18B, HealthScore18C,
} from './components/HugeComponents';

// Big Components
import {
  Drawdown19A, Drawdown19B, Drawdown19C,
  RebalancePlan21A, RebalancePlan21B, RebalancePlan21C,
  ReturnBridge22A, ReturnBridge22B, ReturnBridge22C,
  HoldingDetail23A, HoldingDetail23B, HoldingDetail23C,
  Attribution27A, Attribution27B, Attribution27C,
  DividendCalendar30A, DividendCalendar30B, DividendCalendar30B_Alt,
  SectorVsBenchmark33A, SectorVsBenchmark33B, SectorVsBenchmark33C,
  GainAndLoss42A, GainAndLoss42B, GainAndLoss42C,
  ScenarioComparison48A, ScenarioComparison48B, ScenarioComparison48C,
} from './components/BigComponents';

// Medium Components
import {
  KeyFigures51A, KeyFigures51B, KeyFigures51C,
  DriftFromTarget52A, DriftFromTarget52B, DriftFromTarget52C,
  AllocationStory53A, AllocationStory53B, AllocationStory53C,
  IncomeOverTime54A, IncomeOverTime54B, IncomeOverTime54C,
  ProjectedIncome57A, ProjectedIncome57B, ProjectedIncome57C,
  FairValueVsPrice60A, FairValueVsPrice60B, FairValueVsPrice60C,
  CashByAccount64A, CashByAccount64B, CashByAccount64C,
  LeadersAndLaggards68A, LeadersAndLaggards68B, LeadersAndLaggards68C,
  AccountSplit72A, AccountSplit72B, AccountSplit72C,
  CurrencyExposure73A, CurrencyExposure73B, CurrencyExposure73C,
  NeedsAttention79A, NeedsAttention79B, NeedsAttention79C,
  HoldingCard83A, HoldingCard83B, HoldingCard83C,
} from './components/MediumComponents';

// Small Components
import {
  PortfolioPulse91A, PortfolioPulse91B, PortfolioPulse91C,
  GoalProgress94A, GoalProgress94B, GoalProgress94C,
  AllocationGlance95A, AllocationGlance95B, AllocationGlance95C,
  ReturnsByPeriod96A, ReturnsByPeriod96B, ReturnsByPeriod96C,
  RiskLevel97A, RiskLevel97B, RiskLevel97C,
  Week52Range100A, Week52Range100B, Week52Range100C,
  WinnersVsLosers107A, WinnersVsLosers107B, WinnersVsLosers107C,
  HealthDial114A, HealthDial114B, HealthDial114C,
} from './components/SmallComponents';

// Tiny Components
import {
  TotalValue118A, TotalValue118B, TotalValue118C,
  DayChange119A, DayChange119B, DayChange119C,
  TrendLine122A, TrendLine122B, TrendLine122C,
  WeightIndicator123A, WeightIndicator123B, WeightIndicator123C,
  AssetTypeBadge134A, AssetTypeBadge134B, AssetTypeBadge134C,
} from './components/TinyComponents';

type TierType = 'ALL' | 'HUGE' | 'BIG' | 'MEDIUM' | 'SMALL' | 'TINY';

interface ComponentDefinition {
  id: number;
  title: string;
  tier: 'HUGE' | 'BIG' | 'MEDIUM' | 'SMALL' | 'TINY';
  description: string;
  designTitles: { a: string; b: string; c: string };
  designA: React.ReactNode;
  designB: React.ReactNode;
  designC: React.ReactNode;
}

export const App: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<TierType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 40 selected components with 3 variations each = 120 designs
  const componentRegistry: ComponentDefinition[] = useMemo(() => [
    // 6 HUGE COMPONENTS (18 designs)
    {
      id: 1,
      title: "Holdings table",
      tier: "HUGE",
      description: "A table of every holding showing name, price, position (quantity and purchase price), current value, gain or loss, and share of the portfolio.",
      designTitles: {
        a: "Institutional Matrix — High-density, sortable columns, inline SVG sparklines, action trade pill",
        b: "Expandable Card-Row Feed — Spacious cards with lots details, valuation multiples, and tax-loss notes",
        c: "Master Split Analytics — Left side scrollable ledger paired with right sticky active inspector panel",
      },
      designA: <HoldingsTable1A />,
      designB: <HoldingsTable1B />,
      designC: <HoldingsTable1C />,
    },
    {
      id: 2,
      title: "Overview hero",
      tier: "HUGE",
      description: "The top section of the main page, presenting the portfolio's total value, today's change, key figures and value over time together.",
      designTitles: {
        a: "Executive Wealth Command & Dynamic Area Chart — Interactive timeframe pills and peak corridor tags",
        b: "Comparative Benchmark Overlay — Portfolio performance curve vs S&P 500 with Sharpe & beta cards",
        c: "Editorial Wealth Magazine Spread — Warm typography, AI commentary, and asset class progress distribution",
      },
      designA: <OverviewHero2A />,
      designB: <OverviewHero2B />,
      designC: <OverviewHero2C />,
    },
    {
      id: 4,
      title: "Holdings map",
      tier: "HUGE",
      description: "A visual map of every holding showing relative size and performance at a glance.",
      designTitles: {
        a: "Interactive Market Heatmap Treemap — Sized by weight, colored by all-time or 24h gain",
        b: "Core vs Satellite Cluster Orbit — Concentric weight tiers (Core >10%, Satellite 5-10%, Alts <5%)",
        c: "Hierarchical Radial Sunburst — Donut slices spanning Asset Class -> Top individual allocations",
      },
      designA: <HoldingsMap4A />,
      designB: <HoldingsMap4B />,
      designC: <HoldingsMap4C />,
    },
    {
      id: 5,
      title: "Money flow",
      tier: "HUGE",
      description: "How money flows from accounts, to asset classes, to individual holdings.",
      designTitles: {
        a: "Sankey Flow Topology — 3-stage visual pathway (Source Accounts -> Asset Classes -> Securities)",
        b: "Interactive Monthly Inflow Simulator — Slider testing monthly capital injections & automatic DCA",
        c: "Cross-Account Asset Location Matrix — Tax efficiency mapping across Taxable, Roth IRA, and 401k",
      },
      designA: <MoneyFlow5A />,
      designB: <MoneyFlow5B />,
      designC: <MoneyFlow5C />,
    },
    {
      id: 8,
      title: "Future projection",
      tier: "HUGE",
      description: "Where the portfolio could plausibly be in the future, showing a range of outcomes.",
      designTitles: {
        a: "10,000-Path Monte Carlo Fan — 90th percentile bull, 50th median, and 10th bear outcome cones",
        b: "Milestone Arrival Estimator — Projected arrival dates for $1.0M, $1.5M, and $2.5M milestones",
        c: "Safe Withdrawal Longevity Simulator — Dynamic retirement age & 4% withdrawal rate stress test",
      },
      designA: <FutureProjection8A />,
      designB: <FutureProjection8B />,
      designC: <FutureProjection8C />,
    },
    {
      id: 18,
      title: "Health score",
      tier: "HUGE",
      description: "An overall score for the portfolio, with its main contributing factors and what needs attention.",
      designTitles: {
        a: "5-Pillar Spider Diagnostic Index — Diversification, Fees, Risk, Liquidity, and Dividend quality scores",
        b: "Institutional Audit Scorecard — Granular points tally (+/- factors) with actionable improvement notices",
        c: "Circular Gauge Dial with Action Drawer — Glowing radial completion meter with 1-click auto-align buttons",
      },
      designA: <HealthScore18A />,
      designB: <HealthScore18B />,
      designC: <HealthScore18C />,
    },

    // 9 BIG COMPONENTS (27 designs)
    {
      id: 19,
      title: "Drawdown",
      tier: "BIG",
      description: "How far the portfolio has fallen from its previous peaks.",
      designTitles: {
        a: "Underwater Submerged Area Chart — Peak-to-trough visual with recovery duration analytics",
        b: "Historical Crisis Resilience Cards — Portfolio performance during 2022 Fed rate shock and 2020 COVID",
        c: "Circuit Breaker Alert Slider — Configurable stop-loss threshold with safety cushion indicators",
      },
      designA: <Drawdown19A />,
      designB: <Drawdown19B />,
      designC: <Drawdown19C />,
    },
    {
      id: 21,
      title: "Rebalance plan",
      tier: "BIG",
      description: "The trades needed to bring the portfolio back to its target allocation.",
      designTitles: {
        a: "Algorithmic Order Execution Ticket — Proposed buys and sells with estimated capital gains tax impact",
        b: "Dumbbell Target Gap Visualizer — Current % vs Target % bars with colored deviation ranges",
        c: "Zero-Tax Inflow Rebalancer — Routes upcoming cash deposits to underweight assets without selling",
      },
      designA: <RebalancePlan21A />,
      designB: <RebalancePlan21B />,
      designC: <RebalancePlan21C />,
    },
    {
      id: 22,
      title: "Return bridge",
      tier: "BIG",
      description: "How the portfolio got from its starting value to its current value (money added, market gains, income, currency effects).",
      designTitles: {
        a: "Waterfall Floating Step Ledger — Deposits + Capital Gain + Dividends - Fees + FX = Total NAV",
        b: "Principal vs Compounding Ratio — Saved capital vs market profit split bar",
        c: "Calendar-Year Decomposition Table — Starting value, deposits, dividends, and net return per year",
      },
      designA: <ReturnBridge22A />,
      designB: <ReturnBridge22B />,
      designC: <ReturnBridge22C />,
    },
    {
      id: 23,
      title: "Holding detail panel",
      tier: "BIG",
      description: "Everything about a single holding in one panel: position, cost, gain, weight, trend and history.",
      designTitles: {
        a: "Executive Security Dossier (NVDA) — Real-time quotes, lot cost basis, fair value, and weight metrics",
        b: "52-Week Range & Technical Multiples (VOO) — Corridor position bar, P/E ratio, beta, and yield",
        c: "Alternative Asset Deep-Dive (BTC) — Unit count, historical acquisition cost, and return multiple",
      },
      designA: <HoldingDetail23A />,
      designB: <HoldingDetail23B />,
      designC: <HoldingDetail23C />,
    },
    {
      id: 27,
      title: "Attribution",
      tier: "BIG",
      description: "Which holdings contributed most to the portfolio's return, and by how much.",
      designTitles: {
        a: "Tornado Contribution Chart — Symmetrical visual of top return drivers vs drags",
        b: "Basis Points Alpha Dashboard — Sector contributions relative to benchmark index",
        c: "Brinson-Fachler Institutional Model — Allocation effect vs security selection effect",
      },
      designA: <Attribution27A />,
      designB: <Attribution27B />,
      designC: <Attribution27C />,
    },
    {
      id: 30,
      title: "Dividend calendar",
      tier: "BIG",
      description: "When income payments are expected and how much each will be.",
      designTitles: {
        a: "12-Month Projected Distribution Histogram — Monthly payment bars with quarter-end peak tags",
        b: "Chronological Payout Feed — Upcoming declared ex-dividend dates and confirmed cash flows",
        c: "Annual Compounding Growth Ladder — Year-over-year dividend income growth history",
      },
      designA: <DividendCalendar30A />,
      designB: <DividendCalendar30B />,
      designC: <DividendCalendar30B_Alt />,
    },
    {
      id: 33,
      title: "Sector vs benchmark",
      tier: "BIG",
      description: "How the portfolio's sector weights compare with a market index.",
      designTitles: {
        a: "Dual Relative Exposure Bars — Book weight side-by-side with S&P 500 index weight",
        b: "Active Over/Under Weight Divergence — Centered diverging bar chart showing net sector tilt",
        c: "GICS Sector Concentration Matrix — Grid of top sectors with position counts",
      },
      designA: <SectorVsBenchmark33A />,
      designB: <SectorVsBenchmark33B />,
      designC: <SectorVsBenchmark33C />,
    },
    {
      id: 42,
      title: "Gain and loss per holding",
      tier: "BIG",
      description: "Each holding's gain or loss in currency and in percent.",
      designTitles: {
        a: "Holding Unrealized P/L Ledger — Dual columns for dollar profit and percentage return",
        b: "Winners vs Tax-Harvestable Laggards — Top gainers leaderboard paired with loss-harvesting candidates",
        c: "Scatter Distribution Cards — Grid of holdings with colored return badges",
      },
      designA: <GainAndLoss42A />,
      designB: <GainAndLoss42B />,
      designC: <GainAndLoss42C />,
    },
    {
      id: 48,
      title: "Scenario comparison",
      tier: "BIG",
      description: "Several possible futures (for example cautious, expected and optimistic) compared side by side.",
      designTitles: {
        a: "Tri-Scenario Economic Matrix — Cautious (Stagflation), Base (7.5%), and Optimistic (AI Boom)",
        b: "Macro Interest Rate Sensitivity Slider — Drag-to-test Fed rate moves on bond and stock valuations",
        c: "Global Shock Vulnerability Table — Simulated impact of tech corrections, oil shocks, and USD swings",
      },
      designA: <ScenarioComparison48A />,
      designB: <ScenarioComparison48B />,
      designC: <ScenarioComparison48C />,
    },

    // 12 MEDIUM COMPONENTS (36 designs)
    {
      id: 51,
      title: "Key figures",
      tier: "MEDIUM",
      description: "The amount invested, cash, unrealised gain, and today's change.",
      designTitles: {
        a: "Quad-Tile Executive Ribbon — High-contrast numbers with metric descriptions",
        b: "Minimalist Bordered Row with Accent Indicators — Subtle colored accent bars",
        c: "High-Density Terminal Strip — Live ticker aesthetic with pulsing status light",
      },
      designA: <KeyFigures51A />,
      designB: <KeyFigures51B />,
      designC: <KeyFigures51C />,
    },
    {
      id: 52,
      title: "Drift from target",
      tier: "MEDIUM",
      description: "How far each asset class is above or below its target, and how much to move to fix it.",
      designTitles: {
        a: "Drift & Rebalance Transfer Ledger — Dollar transfer amounts to restore target weights",
        b: "Visual Target Gap Cards — Grid of asset classes with over/under badges",
        c: "Action-Trigger Card — Summary banner with 1-click execute button",
      },
      designA: <DriftFromTarget52A />,
      designB: <DriftFromTarget52B />,
      designC: <DriftFromTarget52C />,
    },
    {
      id: 53,
      title: "Allocation story",
      tier: "MEDIUM",
      description: "An editorial, storytelling take on the allocation, with short callouts.",
      designTitles: {
        a: "Editorial Journal Narrative — Serif headline with structured prose analysis",
        b: "3-Pillar Structural Framework — The Growth Locomotive, The Ballast, and The Dry Powder",
        c: "Executive Intelligence Memo — Compact weekly briefing quote card",
      },
      designA: <AllocationStory53A />,
      designB: <AllocationStory53B />,
      designC: <AllocationStory53C />,
    },
    {
      id: 54,
      title: "Income over time",
      tier: "MEDIUM",
      description: "Dividends and interest received over time.",
      designTitles: {
        a: "5-Year Cumulative Compounding Curve — Stepped area chart of all dividends received",
        b: "Last 6-Month Discrete Cash Flow Bars — Grid of recent monthly payouts",
        c: "Income Source Breakdown — Equity dividends vs bond coupons vs cash yield",
      },
      designA: <IncomeOverTime54A />,
      designB: <IncomeOverTime54B />,
      designC: <IncomeOverTime54C />,
    },
    {
      id: 57,
      title: "Projected income",
      tier: "MEDIUM",
      description: "The income the portfolio is expected to pay over the next 12 months.",
      designTitles: {
        a: "12-Month Run-Rate Forecast Card — Total forecast with DRIP reinvestment status",
        b: "Living Expense Coverage Meter — Passive income converted into days of freedom",
        c: "Yield on Cost Multiples — Forward yield vs purchase-price dividend return",
      },
      designA: <ProjectedIncome57A />,
      designB: <ProjectedIncome57B />,
      designC: <ProjectedIncome57C />,
    },
    {
      id: 60,
      title: "Fair value vs price",
      tier: "MEDIUM",
      description: "Each holding's current price against an estimate of its fair value.",
      designTitles: {
        a: "DCF Discount/Premium Corridor — Upside percentage badges for direct holdings",
        b: "Margin of Safety Quadrant — Categorized by Buy, Fair Value, or Hold",
        c: "Composite Portfolio P/E Multiple — Weighted multiple vs benchmark index",
      },
      designA: <FairValueVsPrice60A />,
      designB: <FairValueVsPrice60B />,
      designC: <FairValueVsPrice60C />,
    },
    {
      id: 64,
      title: "Cash by account",
      tier: "MEDIUM",
      description: "Cash balances across accounts, each with its interest rate, and the blended rate.",
      designTitles: {
        a: "Account Cash & Yield Registry — Interactive Brokers, Roth IRA, and 401k APY yields",
        b: "Cash Drag vs Opportunity Card — Monthly cash interest run-rate",
        c: "Automated Sweep Status Chip — Verification of multi-custody cash yield",
      },
      designA: <CashByAccount64A />,
      designB: <CashByAccount64B />,
      designC: <CashByAccount64C />,
    },
    {
      id: 68,
      title: "Leaders and laggards",
      tier: "MEDIUM",
      description: "The holdings that have gained or lost the most recently.",
      designTitles: {
        a: "Dual Podium Board — Top 3 gainers vs top 3 laggards today",
        b: "All-Time Top Wealth Creators — Ranked by cumulative dollar return",
        c: "Market Breadth Ratio Strip — Up/down ratio across total positions",
      },
      designA: <LeadersAndLaggards68A />,
      designB: <LeadersAndLaggards68B />,
      designC: <LeadersAndLaggards68C />,
    },
    {
      id: 72,
      title: "Account split",
      tier: "MEDIUM",
      description: "How the portfolio is divided across account types.",
      designTitles: {
        a: "Account Wrapper Breakdown — Interactive Brokers, Vanguard Roth, and Solo 401k",
        b: "Tax-Sheltered vs Taxable Ratio — 37.8% shielded capital comparison",
        c: "Optimal Liquidation Sequence — Tax-efficient order of withdrawal",
      },
      designA: <AccountSplit72A />,
      designB: <AccountSplit72B />,
      designC: <AccountSplit72C />,
    },
    {
      id: 73,
      title: "Currency exposure",
      tier: "MEDIUM",
      description: "How much of the portfolio sits in each currency.",
      designTitles: {
        a: "Multi-Currency Weight Grid — USD, EUR, GBP, and CHF allocations",
        b: "FX Sensitivity Shock Card — Dollar appreciation impact test",
        c: "Home Currency Balance Bar — Domestic vs foreign currency exposure",
      },
      designA: <CurrencyExposure73A />,
      designB: <CurrencyExposure73B />,
      designC: <CurrencyExposure73C />,
    },
    {
      id: 79,
      title: "Needs attention",
      tier: "MEDIUM",
      description: "A short list of things about the portfolio that may need a look.",
      designTitles: {
        a: "Actionable Alert Checklist — Loss harvesting, drift rebalance, and position size notices",
        b: "Tax Loss Opportunity Spotlight — High priority deduction execution ticket",
        c: "Custody & Margin Safety Audit — Zero leverage verification badge",
      },
      designA: <NeedsAttention79A />,
      designB: <NeedsAttention79B />,
      designC: <NeedsAttention79C />,
    },
    {
      id: 83,
      title: "Holding card",
      tier: "MEDIUM",
      description: "One holding's value, cost, gain, weight and trend, presented as a self-contained card.",
      designTitles: {
        a: "Modern Security Card (NVDA) — Price, day change, total gain, and action button",
        b: "Analytical Card (MSFT) — Value, weight, fair value target, and subsector tag",
        c: "Compact Slim Card (VOO) — Single-row high-efficiency summary card",
      },
      designA: <HoldingCard83A />,
      designB: <HoldingCard83B />,
      designC: <HoldingCard83C />,
    },

    // 8 SMALL COMPONENTS (24 designs)
    {
      id: 91,
      title: "Portfolio Pulse",
      tier: "SMALL",
      description: "A short plain-language summary of what changed recently and what deserves attention.",
      designTitles: {
        a: "Live Pulse Briefing — Monospace tag with active market narrative",
        b: "Status Radar Capsule — Sync indicator and overall book status",
        c: "Real-Time Terminal Ticker — Formatted terminal broadcast with timestamp",
      },
      designA: <PortfolioPulse91A />,
      designB: <PortfolioPulse91B />,
      designC: <PortfolioPulse91C />,
    },
    {
      id: 94,
      title: "Goal progress",
      tier: "SMALL",
      description: "Progress towards a target amount by a target date.",
      designTitles: {
        a: "Milestone Progress Bar — Progress towards $1M target with remaining deficit",
        b: "Countdown Radial Ring — Days to goal with pace indicator",
        c: "Milestone Crossed Tag — Previous milestone check with next destination",
      },
      designA: <GoalProgress94A />,
      designB: <GoalProgress94B />,
      designC: <GoalProgress94C />,
    },
    {
      id: 95,
      title: "Allocation at a glance",
      tier: "SMALL",
      description: "A compact view of the split across asset classes, with each class's target marked.",
      designTitles: {
        a: "Stacked Horizontal Bar with Legend — Asset classes color-coded with percentages",
        b: "4-Cell Compact Grid — Quick percentage chips for Equities, Bonds, Cash, and Alts",
        c: "Single-Line Allocation Code — Plain monospace summary of portfolio mix",
      },
      designA: <AllocationGlance95A />,
      designB: <AllocationGlance95B />,
      designC: <AllocationGlance95C />,
    },
    {
      id: 96,
      title: "Returns by period",
      tier: "SMALL",
      description: "The return for today, the week, the month, year to date, one year and all time.",
      designTitles: {
        a: "6-Horizon Metric Strip — 1D, 1W, 1M, YTD, 1Y, and ALL time returns",
        b: "Annual Alpha vs Benchmark — 1-Year annualized return compared with S&P 500",
        c: "Compact Monospace Return Strip — High-density inline return tracker",
      },
      designA: <ReturnsByPeriod96A />,
      designB: <ReturnsByPeriod96B />,
      designC: <ReturnsByPeriod96C />,
    },
    {
      id: 97,
      title: "Risk level",
      tier: "SMALL",
      description: "A quick read on how risky the portfolio is overall.",
      designTitles: {
        a: "5-Step Risk Thermometer — Moderate-Aggressive (Level 3.8 of 5) indicator",
        b: "Institutional Risk Composite — Beta, Volatility, and Sharpe summary",
        c: "Plain-English Risk Classification — Moat and drawdown cushion note",
      },
      designA: <RiskLevel97A />,
      designB: <RiskLevel97B />,
      designC: <RiskLevel97C />,
    },
    {
      id: 100,
      title: "52-week range",
      tier: "SMALL",
      description: "Where one holding's price sits within its range over the last year.",
      designTitles: {
        a: "Pinpoint Range Bar (NVDA) — Low, High, and current price indicator dot",
        b: "Corridor Percentile Badge (VOO) — 96th percentile near 52-week high",
        c: "Terminal Range String — Compact ASCII/text-style corridor",
      },
      designA: <Week52Range100A />,
      designB: <Week52Range100B />,
      designC: <Week52Range100C />,
    },
    {
      id: 107,
      title: "Winners vs losers",
      tier: "SMALL",
      description: "How many holdings are up versus down.",
      designTitles: {
        a: "Tug-of-War Bar — 80% Winners (8) vs 20% Losers (2) with dollar totals",
        b: "Split Scoreboard — Up-arrow vs Down-arrow count cards",
        c: "Breadth Ratio Chip — Compact text summary of winning positions",
      },
      designA: <WinnersVsLosers107A />,
      designB: <WinnersVsLosers107B />,
      designC: <WinnersVsLosers107C />,
    },
    {
      id: 114,
      title: "Health dial",
      tier: "SMALL",
      description: "The health score in a compact form.",
      designTitles: {
        a: "Grade Badge Card — 84/100 score with A- badge",
        b: "Progress Meter Card — 84% bar with clean vulnerability status",
        c: "Energy Pill — High-contrast single line health indicator",
      },
      designA: <HealthDial114A />,
      designB: <HealthDial114B />,
      designC: <HealthDial114C />,
    },

    // 5 TINY COMPONENTS (15 designs)
    {
      id: 118,
      title: "Total value",
      tier: "TINY",
      description: "The portfolio's current total value.",
      designTitles: {
        a: "Bold Monospace Badge with USD Tag — Crisp typography with currency pill",
        b: "Pill Capsule with Pulse Light — Rounded glowing live status indicator",
        c: "Terminal Value String — Compact row tag for headers and footers",
      },
      designA: <TotalValue118A />,
      designB: <TotalValue118B />,
      designC: <TotalValue118C />,
    },
    {
      id: 119,
      title: "Day change",
      tier: "TINY",
      description: "Today's change in value, in currency and percent.",
      designTitles: {
        a: "Full Currency + Percent Pill — Green badge with arrow icon",
        b: "Split Number and Percent Tag — Bordered box with trending icon",
        c: "Compact Text Chip — Minimalist delta tag",
      },
      designA: <DayChange119A />,
      designB: <DayChange119B />,
      designC: <DayChange119C />,
    },
    {
      id: 122,
      title: "Trend line",
      tier: "TINY",
      description: "A very small trend indicator for one holding, sized to sit inside a table row.",
      designTitles: {
        a: "Micro SVG Sparkline with Endpoint — 50px smoothed trend with return percentage",
        b: "7-Day Mini Stepped Histogram — Vertical bars representing recent daily sessions",
        c: "Subtle Glow Waveform — Gradient area sparkline",
      },
      designA: <TrendLine122A />,
      designB: <TrendLine122B />,
      designC: <TrendLine122C />,
    },
    {
      id: 123,
      title: "Weight indicator",
      tier: "TINY",
      description: "A very small visual of one holding's share of the portfolio, sized to sit inside a table row.",
      designTitles: {
        a: "Micro Horizontal Progress Bar — 14px width bar with percentage text",
        b: "Radial Pie Indicator Dot — Donut stroke showing position share",
        c: "Subtle Highlight Chip — Compact pill tag",
      },
      designA: <WeightIndicator123A />,
      designB: <WeightIndicator123B />,
      designC: <WeightIndicator123C />,
    },
    {
      id: 134,
      title: "Asset-type badge",
      tier: "TINY",
      description: "A small label showing whether a holding is a stock, fund, crypto or cash.",
      designTitles: {
        a: "Color-Coded Semantic Pills — Distinct badges for Stock, Fund, Crypto, Bond, Cash",
        b: "High-Density Terminal Brackets — `[STK]`, `[ETF]`, `[CRY]`, `[BND]`, `[CSH]`",
        c: "Dot & Text Minimalist Tag — Small colored indicator with label",
      },
      designA: <AssetTypeBadge134A />,
      designB: <AssetTypeBadge134B />,
      designC: <AssetTypeBadge134C />,
    },
  ], []);

  // Filter components based on tier & search
  const filteredComponents = useMemo(() => {
    return componentRegistry.filter(c => {
      const matchesTier = selectedTier === 'ALL' || c.tier === selectedTier;
      const matchesSearch = searchQuery === '' || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toString() === searchQuery.trim();
      return matchesTier && matchesSearch;
    });
  }, [componentRegistry, selectedTier, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header & Navigation Bar */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Branding & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-white font-mono">
                    MERIDIAN
                  </h1>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Design System Lab
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Portfolio Suite • 40 Components • 120 Total Distinct Designs (3 per Component)
                </p>
              </div>
            </div>

            {/* Live Portfolio Stats Strip */}
            <div className="flex items-center gap-4 text-xs font-mono bg-zinc-900/80 px-3.5 py-1.5 rounded-xl border border-zinc-800 overflow-x-auto">
              <div>
                <span className="text-zinc-500">NAV: </span>
                <span className="text-white font-bold">${PORTFOLIO_SUMMARY.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="h-3 w-px bg-zinc-700" />
              <div>
                <span className="text-zinc-500">24H: </span>
                <span className="text-emerald-400 font-bold">+{PORTFOLIO_SUMMARY.dayChangePct}%</span>
              </div>
              <div className="h-3 w-px bg-zinc-700" />
              <div>
                <span className="text-zinc-500">HEALTH: </span>
                <span className="text-indigo-400 font-bold">{PORTFOLIO_SUMMARY.healthScore}/100</span>
              </div>
            </div>
          </div>

          {/* Filter, Search & Jump Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-3 pt-3 border-t border-zinc-850">
            {/* Tier Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
              {(['ALL', 'HUGE', 'BIG', 'MEDIUM', 'SMALL', 'TINY'] as const).map(tier => {
                const count = tier === 'ALL' 
                  ? componentRegistry.length 
                  : componentRegistry.filter(c => c.tier === tier).length;
                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      selectedTier === tier
                        ? 'bg-zinc-100 text-zinc-950 font-bold shadow-md'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    <span>{tier}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      selectedTier === tier ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search and Jump Dropdown */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search 40 components or #ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 text-zinc-200 placeholder:text-zinc-500"
                />
              </div>

              {/* Jump to Component Dropdown */}
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const el = document.getElementById(val);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[170px]"
                defaultValue=""
              >
                <option value="" disabled>Jump to Component...</option>
                {componentRegistry.map(c => (
                  <option key={c.id} value={`comp-${c.id}`}>
                    #{c.id} {c.title} ({c.tier})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Banner */}
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-indigo-950/20 to-zinc-900 border border-zinc-800/90 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs font-mono text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MERIDIAN INVESTMENT PRODUCT DESIGN SPECIFICATION</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Portfolio Page Component System (40 Components × 3 Designs = 120 Total)
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
                Breakdown: <strong>6 Huge</strong> (18 designs), <strong>9 Big</strong> (27 designs), <strong>12 Medium</strong> (36 designs), <strong>8 Small</strong> (24 designs), and <strong>5 Tiny</strong> (15 designs). Every design operates as an independent exploration with realistic financial data and interactive elements.
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs flex-shrink-0">
              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 text-center">
                <div className="text-[10px] text-zinc-500">COMPONENTS</div>
                <div className="text-lg font-bold text-white">40</div>
              </div>
              <div className="p-3 bg-indigo-950/60 rounded-xl border border-indigo-800/60 text-center">
                <div className="text-[10px] text-indigo-300">VARIATIONS</div>
                <div className="text-lg font-bold text-indigo-400">120</div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-400 font-mono">
          <span>Showing {filteredComponents.length} of 40 components ({filteredComponents.length * 3} designs)</span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* Render Components */}
        <div className="space-y-4">
          {filteredComponents.map(comp => (
            <ComponentCardWrapper
              key={comp.id}
              id={comp.id}
              title={comp.title}
              tier={comp.tier}
              description={comp.description}
              designTitles={comp.designTitles}
              designA={comp.designA}
              designB={comp.designB}
              designC={comp.designC}
            />
          ))}

          {filteredComponents.length === 0 && (
            <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800">
              <p className="text-zinc-400 text-sm">No components match "{searchQuery}" in tier {selectedTier}.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTier('ALL'); }}
                className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-800/80 bg-zinc-950 py-8 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Meridian Portfolio Dashboard Design Architecture</span>
          </div>
          <div>
            120 Designs Generated • 40 Chosen Components • All-in-one Single File Delivery
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
