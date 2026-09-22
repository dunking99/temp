import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, 
  Search, ChevronDown, ChevronRight,
  AlertTriangle, ShieldCheck
} from 'lucide-react';
import { MOCK_HOLDINGS, PORTFOLIO_SUMMARY, HoldingItem } from '../data/mockData';

// ==========================================
// COMPONENT 1: Holdings table (1.a, 1.b, 1.c)
// ==========================================

export const HoldingsTable1A: React.FC = () => {
  const [sortCol, setSortCol] = useState<'value' | 'gain' | 'weight'>('value');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const holdings = MOCK_HOLDINGS.filter(h => 
    (filterType === 'ALL' || h.type === filterType) &&
    (h.name.toLowerCase().includes(search.toLowerCase()) || h.ticker.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => {
    if (sortCol === 'value') return b.value - a.value;
    if (sortCol === 'gain') return b.unrealizedGainPct - a.unrealizedGainPct;
    return b.weightPct - a.weightPct;
  });

  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-sans text-zinc-100">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter by ticker or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-750 text-xs rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 w-56 text-zinc-200"
            />
          </div>
          <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-xs">
            {['ALL', 'Stock', 'Fund', 'Crypto', 'Cash'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === t ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Sort by:</span>
          {(['value', 'gain', 'weight'] as const).map(col => (
            <button
              key={col}
              onClick={() => setSortCol(col)}
              className={`px-2 py-1 rounded border capitalize ${
                sortCol === col ? 'bg-zinc-800 text-indigo-400 border-indigo-500/50' : 'border-zinc-800 text-zinc-400'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Asset</th>
              <th className="py-2.5 px-3 text-right">Last Price</th>
              <th className="py-2.5 px-3 text-right">Holdings / Avg</th>
              <th className="py-2.5 px-3 text-right">Market Value</th>
              <th className="py-2.5 px-3 text-right">Gain / Loss</th>
              <th className="py-2.5 px-3 text-right">Weight</th>
              <th className="py-2.5 px-3 text-center">Trend (30D)</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {holdings.map((h) => {
              const isGain = h.unrealizedGain >= 0;
              return (
                <tr key={h.id} className="hover:bg-zinc-900/60 transition-colors group">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-400 border border-zinc-700">
                        {h.ticker.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                          {h.ticker}
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                            {h.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[140px]">{h.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <div className="font-medium text-zinc-100">${h.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <div className={`text-[10px] flex items-center justify-end ${h.dayChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {h.dayChangePct >= 0 ? '+' : ''}{h.dayChangePct}%
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <div className="text-zinc-200">{h.shares.toLocaleString()} shs</div>
                    <div className="text-[10px] text-zinc-500">@ ${h.avgBuyPrice.toFixed(2)}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <div className="font-semibold text-zinc-100">${h.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <div className="text-[10px] text-zinc-500">Cost: ${h.costBasis.toLocaleString()}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <div className={`font-semibold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isGain ? '+' : ''}${h.unrealizedGain.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] font-bold ${isGain ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isGain ? '▲' : '▼'} {isGain ? '+' : ''}{h.unrealizedGainPct.toFixed(2)}%
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <div className="text-zinc-200 font-medium">{h.weightPct.toFixed(1)}%</div>
                    <div className="w-16 bg-zinc-800 h-1.5 rounded-full ml-auto mt-1 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full" 
                        style={{ width: `${Math.min(h.weightPct * 3.5, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <svg className="w-20 h-6 inline-block" viewBox="0 0 100 30">
                      <polyline
                        fill="none"
                        stroke={isGain ? '#10B981' : '#F43F5E'}
                        strokeWidth="2"
                        points={h.sparkline.map((val, idx) => {
                          const min = Math.min(...h.sparkline);
                          const max = Math.max(...h.sparkline);
                          const range = max - min || 1;
                          const y = 28 - ((val - min) / range) * 24;
                          const x = (idx / (h.sparkline.length - 1)) * 96 + 2;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    </svg>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button className="px-2 py-1 text-[11px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors">
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const HoldingsTable1B: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('h1');

  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-zinc-200 tracking-wide">Holdings Breakdown & Lots</h4>
          <p className="text-xs text-zinc-400">Card-row architecture with expandable tax-lot drilldowns</p>
        </div>
        <div className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
          Total Holdings: <span className="text-white font-mono font-bold">10 positions</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {MOCK_HOLDINGS.slice(0, 5).map((h) => {
          const isExpanded = expandedId === h.id;
          const isGain = h.unrealizedGain >= 0;
          return (
            <div 
              key={h.id} 
              className={`rounded-xl border transition-all duration-200 ${
                isExpanded ? 'bg-zinc-950 border-indigo-500/50 shadow-lg shadow-indigo-950/20' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : h.id)}
                className="p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg border ${isGain ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' : 'bg-rose-950/40 border-rose-800 text-rose-400'}`}>
                    {isGain ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-100">{h.name}</span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold">{h.ticker}</span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full">{h.sector}</span>
                    </div>
                    <div className="text-xs text-zinc-400 font-mono mt-0.5">
                      {h.shares} units @ ${h.avgBuyPrice.toFixed(2)} cost basis
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Position Value</div>
                    <div className="text-sm font-mono font-bold text-zinc-100">${h.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Return</div>
                    <div className={`text-sm font-mono font-bold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isGain ? '+' : ''}${h.unrealizedGain.toLocaleString()} ({isGain ? '+' : ''}{h.unrealizedGainPct.toFixed(1)}%)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Portfolio Share</div>
                    <div className="text-sm font-mono font-bold text-indigo-400">{h.weightPct.toFixed(1)}%</div>
                  </div>
                  <div className="text-zinc-400 pl-2">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expandable Lot Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div className="text-zinc-400 mb-1">Fundamentals & Valuation</div>
                    <div className="space-y-1 font-mono">
                      <div className="flex justify-between"><span className="text-zinc-500">P/E Ratio:</span> <span className="text-zinc-200">{h.peRatio}x</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Div Yield:</span> <span className="text-zinc-200">{h.dividendYield}%</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Beta:</span> <span className="text-zinc-200">{h.beta}</span></div>
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div className="text-zinc-400 mb-1">52-Week Corridor</div>
                    <div className="space-y-1 font-mono">
                      <div className="flex justify-between"><span className="text-zinc-500">Range:</span> <span className="text-zinc-200">${h.week52Low} – ${h.week52High}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Fair Value:</span> <span className="text-emerald-400">${h.fairValue}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Geography:</span> <span className="text-zinc-200">{h.country}</span></div>
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-950/30 rounded-lg border border-indigo-900/40 flex flex-col justify-between">
                    <div>
                      <div className="text-indigo-300 font-semibold mb-1">Tax-Lot Management</div>
                      <p className="text-[11px] text-zinc-400">Purchased in 3 distinct lots. Long-term capital gains status achieved.</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-xs">Add Shares</button>
                      <button className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs">Rebalance</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HoldingsTable1C: React.FC = () => {
  const [activeItem, setActiveItem] = useState<HoldingItem>(MOCK_HOLDINGS[0]);

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Institutional Master View</span>
          <h4 className="text-base font-bold text-zinc-100">Holdings Ledger & Real-Time Inspector</h4>
        </div>
        <div className="text-xs text-zinc-400 font-mono">Updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side Table */}
        <div className="lg:col-span-8 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono text-[10px]">
                <th className="p-3">SECURITY</th>
                <th className="p-3 text-right">WEIGHT</th>
                <th className="p-3 text-right">VALUE (USD)</th>
                <th className="p-3 text-right">PROFIT / LOSS</th>
                <th className="p-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono">
              {MOCK_HOLDINGS.map((item) => {
                const isSelected = activeItem.id === item.id;
                const isGain = item.unrealizedGain >= 0;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-950/40 text-white' : 'hover:bg-zinc-800/40 text-zinc-300'
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-bold text-zinc-100">{item.ticker}</div>
                      <div className="text-[10px] text-zinc-400 font-sans truncate max-w-[120px]">{item.name}</div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="font-semibold">{item.weightPct}%</div>
                    </td>
                    <td className="p-3 text-right">
                      ${item.value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                    </td>
                    <td className="p-3 text-right">
                      <span className={isGain ? 'text-emerald-400' : 'text-rose-400'}>
                        {isGain ? '+' : ''}${item.unrealizedGain.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-[9px] rounded-full uppercase tracking-wider ${
                        item.healthContribution === 'positive' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        item.healthContribution === 'drag' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {item.healthContribution}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Side Inspector Panel */}
        <div className="lg:col-span-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {activeItem.type}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{activeItem.ticker}</h3>
                <p className="text-xs text-zinc-400">{activeItem.name}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold font-mono text-zinc-100">${activeItem.currentPrice}</div>
                <div className={`text-xs font-mono font-medium ${activeItem.dayChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {activeItem.dayChangePct >= 0 ? '▲ +' : '▼ '}{activeItem.dayChangePct}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase">Weight in Portfolio</div>
                <div className="text-base font-mono font-bold text-indigo-400">{activeItem.weightPct}%</div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase">Cost Basis</div>
                <div className="text-base font-mono font-bold text-zinc-200">${activeItem.avgBuyPrice}</div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase">Total Gain</div>
                <div className={`text-base font-mono font-bold ${activeItem.unrealizedGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  +{activeItem.unrealizedGainPct.toFixed(1)}%
                </div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase">Beta vs Market</div>
                <div className="text-base font-mono font-bold text-zinc-300">{activeItem.beta}</div>
              </div>
            </div>

            <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-850">
                <span className="text-zinc-500">Asset Class</span>
                <span className="text-zinc-300">{activeItem.assetClass}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-850">
                <span className="text-zinc-500">Sector</span>
                <span className="text-zinc-300">{activeItem.sector}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Fair Value Target</span>
                <span className="text-emerald-400 font-mono">${activeItem.fairValue}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex gap-2">
            <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors">
              Execute Buy
            </button>
            <button className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition-colors">
              Trim Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 2: Overview hero (2.a, 2.b, 2.c)
// ==========================================

export const OverviewHero2A: React.FC = () => {
  const [timeRange, setTimeRange] = useState('YTD');

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 rounded-2xl border border-zinc-800 p-6 md:p-8 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Meridian Master Portfolio</span>
            </div>
            <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-1 font-mono">
              ${PORTFOLIO_SUMMARY.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm">
              <span className="flex items-center text-emerald-400 font-semibold font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
                +${PORTFOLIO_SUMMARY.dayChange.toLocaleString()} ({PORTFOLIO_SUMMARY.dayChangePct}%)
              </span>
              <span className="text-zinc-500 text-xs">Today's Market Movement</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            {['1D', '1W', '1M', 'YTD', '1Y', '5Y', 'ALL'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  timeRange === r ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Chart Area */}
        <div className="my-6">
          <div className="h-44 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroGrad2A" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#heroGrad2A)"
                points="0,150 0,110 80,120 160,95 240,105 320,70 400,85 480,50 560,65 640,30 720,40 800,15 800,150"
              />
              <polyline
                fill="none"
                stroke="#6366F1"
                strokeWidth="3"
                points="0,110 80,120 160,95 240,105 320,70 400,85 480,50 560,65 640,30 720,40 800,15"
              />
              <circle cx="800" cy="15" r="5" fill="#6366F1" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div className="absolute right-4 top-2 bg-indigo-950/90 border border-indigo-700/60 rounded px-2 py-1 text-[11px] font-mono text-indigo-300">
              Peak: $859.1k (Jan '25)
            </div>
          </div>
        </div>

        {/* Key Ribbon Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800/80">
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400">Total Money Invested</div>
            <div className="text-base font-bold font-mono text-zinc-200 mt-0.5">${PORTFOLIO_SUMMARY.costBasis.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500">Net capital inflow</div>
          </div>
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400">All-Time Gain</div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">+${PORTFOLIO_SUMMARY.unrealizedGain.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-500">+{PORTFOLIO_SUMMARY.unrealizedGainPct}% total return</div>
          </div>
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400">Annual Dividend Run-Rate</div>
            <div className="text-base font-bold font-mono text-zinc-200 mt-0.5">${PORTFOLIO_SUMMARY.annualDividendIncome.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500">{PORTFOLIO_SUMMARY.forwardYield}% forward yield</div>
          </div>
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400">Liquid Cash Buffer</div>
            <div className="text-base font-bold font-mono text-zinc-200 mt-0.5">${PORTFOLIO_SUMMARY.cashBalance.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500">{PORTFOLIO_SUMMARY.cashYield}% APY sweep</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OverviewHero2B: React.FC = () => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<'SP500' | 'MSCI_WORLD' | 'AGG'>('SP500');

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-zinc-400">Portfolio Valuation Engine</div>
          <div className="flex items-baseline gap-4 mt-1">
            <h1 className="text-4xl font-extrabold font-mono text-zinc-100">$842,690</h1>
            <span className="text-sm font-semibold font-mono text-emerald-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 inline" /> +$4,892.15 today
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Benchmark comparison:</span>
          {(['SP500', 'MSCI_WORLD', 'AGG'] as const).map(b => (
            <button
              key={b}
              onClick={() => setSelectedBenchmark(b)}
              className={`text-xs px-2.5 py-1 rounded-md font-mono transition-all ${
                selectedBenchmark === b ? 'bg-emerald-600 text-white font-bold' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Comparative Chart */}
      <div className="my-6 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 relative">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400" /> Meridian Portfolio (+36.2%)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-zinc-500 stroke-dashed" /> {selectedBenchmark} (+28.4%)</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">+7.8% Alpha</span>
        </div>
        <svg className="w-full h-36" viewBox="0 0 600 120" preserveAspectRatio="none">
          {/* Portfolio Line */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            points="0,100 60,90 120,95 180,80 240,65 300,75 360,50 420,40 480,55 540,30 600,10"
          />
          {/* Benchmark Line */}
          <polyline
            fill="none"
            stroke="#71717A"
            strokeWidth="2"
            strokeDasharray="4 4"
            points="0,105 60,98 120,102 180,90 240,82 300,88 360,70 420,62 480,68 540,55 600,42"
          />
        </svg>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <div className="text-[11px] text-zinc-400">Sharpe Ratio</div>
          <div className="text-lg font-bold font-mono text-zinc-100">1.82</div>
          <div className="text-[10px] text-emerald-400">Superior risk-adjusted</div>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <div className="text-[11px] text-zinc-400">Current Drawdown</div>
          <div className="text-lg font-bold font-mono text-zinc-100">-1.91%</div>
          <div className="text-[10px] text-zinc-400">From $859.1k peak</div>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <div className="text-[11px] text-zinc-400">Portfolio Beta</div>
          <div className="text-lg font-bold font-mono text-zinc-100">0.94</div>
          <div className="text-[10px] text-zinc-400">Defensive stance</div>
        </div>
      </div>
    </div>
  );
};

export const OverviewHero2C: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 md:p-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-2.5 py-1 rounded">
            Portfolio Briefing
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-zinc-100 mt-3 font-normal">
            Meridian Capital Composite
          </h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Your holdings stand at <strong className="text-zinc-200 font-mono">$842,690.45</strong>, outperforming global equity benchmarks by 4.2% year-to-date with 14% lower realized volatility.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-zinc-800">
            <div>
              <div className="text-xs text-zinc-500 font-mono">NET INVESTED</div>
              <div className="text-lg font-bold font-mono text-zinc-200">$618,420</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-mono">UNREALIZED PROFIT</div>
              <div className="text-lg font-bold font-mono text-emerald-400">+$224,270</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-mono">HEALTH SCORE</div>
              <div className="text-lg font-bold font-mono text-indigo-400">84 / 100</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-xl border border-zinc-800">
          <div className="text-xs font-semibold text-zinc-300 mb-3 flex items-center justify-between">
            <span>Portfolio Allocation Distribution</span>
            <span className="font-mono text-zinc-500">100%</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">Equities (US & Global)</span>
                <span className="font-mono text-zinc-200 font-bold">72.8%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '72.8%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">Fixed Income</span>
                <span className="font-mono text-zinc-200 font-bold">12.5%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12.5%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">Real Assets & Crypto</span>
                <span className="font-mono text-zinc-200 font-bold">9.7%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '9.7%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">Treasury Cash</span>
                <span className="font-mono text-zinc-200 font-bold">5.0%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-400 rounded-full" style={{ width: '5.0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 4: Holdings map (4.a, 4.b, 4.c)
// ==========================================

export const HoldingsMap4A: React.FC = () => {
  const [metric, setMetric] = useState<'day' | 'total'>('total');

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Relative Weight & Performance Heatmap</h4>
          <p className="text-xs text-zinc-400">Tile dimensions represent portfolio share; colors represent gains/losses.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setMetric('total')}
            className={`px-3 py-1 rounded transition-colors ${metric === 'total' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400'}`}
          >
            All-Time Gain %
          </button>
          <button
            onClick={() => setMetric('day')}
            className={`px-3 py-1 rounded transition-colors ${metric === 'day' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400'}`}
          >
            Today's Change %
          </button>
        </div>
      </div>

      {/* Visual Treemap Layout */}
      <div className="grid grid-cols-12 gap-2 h-72">
        {/* VOO - 27% */}
        <div className="col-span-12 md:col-span-5 bg-emerald-950/70 border border-emerald-600/50 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-400 transition-all cursor-pointer group">
          <div className="flex justify-between items-start">
            <span className="font-bold text-lg text-emerald-200">VOO</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300">27.0%</span>
          </div>
          <div>
            <div className="text-xs text-zinc-300 font-medium">Vanguard S&P 500 ETF</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {metric === 'total' ? '+31.48%' : '+0.62%'}
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">$227,682.00</div>
          </div>
        </div>

        {/* NVDA - 14.8% */}
        <div className="col-span-6 md:col-span-3 bg-emerald-900/60 border border-emerald-500/50 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-300 transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="font-bold text-base text-emerald-200">NVDA</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200">14.8%</span>
          </div>
          <div>
            <div className="text-xs text-zinc-300 truncate">NVIDIA Corp</div>
            <div className="text-lg font-bold font-mono text-emerald-300">
              {metric === 'total' ? '+121.55%' : '+2.85%'}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">$15,207.50</div>
          </div>
        </div>

        {/* MSFT - 12.2% */}
        <div className="col-span-6 md:col-span-4 bg-emerald-950/60 border border-emerald-700/50 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-400 transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="font-bold text-base text-emerald-200">MSFT</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300">12.2%</span>
          </div>
          <div>
            <div className="text-xs text-zinc-300 truncate">Microsoft Corp</div>
            <div className="text-lg font-bold font-mono text-emerald-300">
              {metric === 'total' ? '+33.86%' : '+0.44%'}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">$102,840.00</div>
          </div>
        </div>

        {/* VWCE - 11.4% */}
        <div className="col-span-6 md:col-span-3 bg-emerald-950/50 border border-emerald-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-bold text-sm text-emerald-200">VWCE</span>
            <span className="text-[10px] font-mono text-emerald-400">11.4%</span>
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-emerald-400">{metric === 'total' ? '+23.4%' : '+0.38%'}</div>
            <div className="text-[10px] text-zinc-400 font-mono">$96,450.00</div>
          </div>
        </div>

        {/* AAPL - 10.3% */}
        <div className="col-span-6 md:col-span-3 bg-emerald-950/50 border border-emerald-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-bold text-sm text-emerald-200">AAPL</span>
            <span className="text-[10px] font-mono text-emerald-400">10.3%</span>
          </div>
          <div>
            <div className={`text-xs font-mono font-bold ${metric === 'total' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metric === 'total' ? '+32.7%' : '-0.35%'}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">$86,982.00</div>
          </div>
        </div>

        {/* ASML - 7.9% */}
        <div className="col-span-4 md:col-span-2 bg-emerald-950/40 border border-emerald-850 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="font-bold text-xs text-zinc-200">ASML (7.9%)</span>
          <div className="text-xs font-mono font-bold text-emerald-400">{metric === 'total' ? '+15.5%' : '+1.45%'}</div>
        </div>

        {/* TLT - 6.5% (Loss) */}
        <div className="col-span-4 md:col-span-2 bg-rose-950/50 border border-rose-800/60 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="font-bold text-xs text-rose-300">TLT (6.5%)</span>
          <div className="text-xs font-mono font-bold text-rose-400">{metric === 'total' ? '-7.32%' : '-0.15%'}</div>
        </div>

        {/* BTC & Cash - Small */}
        <div className="col-span-4 md:col-span-2 bg-emerald-900/40 border border-emerald-700/60 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="font-bold text-xs text-emerald-200">BTC (3.9%)</span>
          <div className="text-xs font-mono font-bold text-emerald-300">{metric === 'total' ? '+108%' : '+3.12%'}</div>
        </div>
      </div>
    </div>
  );
};

export const HoldingsMap4B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-200">Portfolio Orbit: Core vs Satellite Clusters</h4>
          <p className="text-xs text-zinc-400">Position size corresponds to radial proximity and ring tier</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Gain &gt;20%</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Negative Return</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Core Tier */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="flex justify-between items-center pb-2 mb-3 border-b border-zinc-850">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Core Anchors (&gt;10%)</span>
            <span className="text-xs font-mono text-zinc-500">60.9% of Book</span>
          </div>
          <div className="space-y-3">
            {[
              { ticker: 'VOO', name: 'S&P 500 ETF', weight: 27.0, gain: '+31.5%' },
              { ticker: 'NVDA', name: 'Nvidia Corp', weight: 14.8, gain: '+121.5%' },
              { ticker: 'MSFT', name: 'Microsoft', weight: 12.2, gain: '+33.9%' },
              { ticker: 'VWCE', name: 'All-World ETF', weight: 11.4, gain: '+23.4%' },
            ].map(item => (
              <div key={item.ticker} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-zinc-200">{item.ticker}</div>
                  <div className="text-[11px] text-zinc-400">{item.name}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-indigo-400">{item.weight}%</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">{item.gain}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth & Tactical */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="flex justify-between items-center pb-2 mb-3 border-b border-zinc-850">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tactical Satellite (5-10%)</span>
            <span className="text-xs font-mono text-zinc-500">24.7% of Book</span>
          </div>
          <div className="space-y-3">
            {[
              { ticker: 'AAPL', name: 'Apple Inc', weight: 10.3, gain: '+32.7%' },
              { ticker: 'ASML', name: 'ASML Semiconductor', weight: 7.9, gain: '+15.5%' },
              { ticker: 'TLT', name: 'Treasury 20Y Bond', weight: 6.5, gain: '-7.3%', loss: true },
            ].map(item => (
              <div key={item.ticker} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-zinc-200">{item.ticker}</div>
                  <div className="text-[11px] text-zinc-400">{item.name}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-zinc-300">{item.weight}%</div>
                  <div className={`text-[10px] font-semibold ${item.loss ? 'text-rose-400' : 'text-emerald-400'}`}>{item.gain}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternatives & Liquidity */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="flex justify-between items-center pb-2 mb-3 border-b border-zinc-850">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Speculative & Buffer (&lt;5%)</span>
            <span className="text-xs font-mono text-zinc-500">14.4% of Book</span>
          </div>
          <div className="space-y-3">
            {[
              { ticker: 'SPAXX', name: 'Cash Treasury Sweep', weight: 5.0, gain: '4.85% APY' },
              { ticker: 'BTC', name: 'Bitcoin Spot', weight: 3.9, gain: '+108.3%' },
              { ticker: 'ICLN', name: 'Clean Energy ETF', weight: 2.0, gain: '-25.7%', loss: true },
            ].map(item => (
              <div key={item.ticker} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-zinc-200">{item.ticker}</div>
                  <div className="text-[11px] text-zinc-400">{item.name}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-zinc-300">{item.weight}%</div>
                  <div className={`text-[10px] font-semibold ${item.loss ? 'text-rose-400' : 'text-emerald-400'}`}>{item.gain}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const HoldingsMap4C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Sunburst Allocation & Hierarchy</h4>
          <p className="text-xs text-zinc-400">Radial breakdown: Asset Class ➔ Subsector ➔ Top Holdings</p>
        </div>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-950/70 border border-indigo-800 px-2.5 py-1 rounded">
          Total: 10 Assets
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 justify-around p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
        {/* Radial Visual Representation */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Equities slice 72.8% */}
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#6366F1" strokeWidth="12" strokeDasharray="172 239" strokeDashoffset="0" />
            {/* Fixed Income 12.5% */}
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray="30 239" strokeDashoffset="-172" />
            {/* Alternatives 3.9% */}
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="12" strokeDasharray="10 239" strokeDashoffset="-202" />
            {/* Cash 5.0% */}
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#71717A" strokeWidth="12" strokeDasharray="12 239" strokeDashoffset="-212" />
          </svg>
          <div className="absolute text-center">
            <span className="text-[10px] text-zinc-400 uppercase font-mono">Total Capital</span>
            <div className="text-base font-bold font-mono text-white">$842.7k</div>
          </div>
        </div>

        {/* Legend and Weight Breakdowns */}
        <div className="flex-1 space-y-3 w-full">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border-l-4 border-l-indigo-500 border border-zinc-800">
            <div>
              <span className="text-xs font-bold text-zinc-200">Equities Bucket</span>
              <div className="text-[11px] text-zinc-400">VOO (27%), NVDA (14.8%), MSFT (12.2%), VWCE (11.4%), AAPL (10.3%)</div>
            </div>
            <div className="text-right font-mono font-bold text-indigo-400 text-sm">72.8%</div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border-l-4 border-l-emerald-500 border border-zinc-800">
            <div>
              <span className="text-xs font-bold text-zinc-200">Fixed Income</span>
              <div className="text-[11px] text-zinc-400">TLT (6.5%), Treasury Long Curve & Corporate Debt</div>
            </div>
            <div className="text-right font-mono font-bold text-emerald-400 text-sm">12.5%</div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border-l-4 border-l-amber-500 border border-zinc-800">
            <div>
              <span className="text-xs font-bold text-zinc-200">Alternatives & Digital</span>
              <div className="text-[11px] text-zinc-400">Bitcoin Spot (3.9%), Commodities</div>
            </div>
            <div className="text-right font-mono font-bold text-amber-400 text-sm">3.9%</div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border-l-4 border-l-zinc-500 border border-zinc-800">
            <div>
              <span className="text-xs font-bold text-zinc-200">Cash Reserves</span>
              <div className="text-[11px] text-zinc-400">Fidelity Government Money Market SPAXX</div>
            </div>
            <div className="text-right font-mono font-bold text-zinc-300 text-sm">5.0%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 5: Money flow (5.a, 5.b, 5.c)
// ==========================================

export const MoneyFlow5A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div>
          <h4 className="text-base font-bold text-zinc-100">Sankey Capital Flow Topology</h4>
          <p className="text-xs text-zinc-400">Trace your capital journey from Source Accounts through Asset Classes into Individual Securities</p>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
          Total Liquid Volume: <span className="text-indigo-400 font-bold">$842,690</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Stage 1: Accounts */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> 1. ACCOUNTS (3)
          </div>
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-blue-500 transition-colors">
            <div className="text-xs font-bold text-zinc-200">Interactive Brokers Pro</div>
            <div className="text-sm font-mono font-bold text-blue-400 mt-1">$524,190</div>
            <div className="text-[10px] text-zinc-500">62.2% of total capital</div>
          </div>
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-blue-500 transition-colors">
            <div className="text-xs font-bold text-zinc-200">Vanguard Roth IRA</div>
            <div className="text-sm font-mono font-bold text-blue-400 mt-1">$198,450</div>
            <div className="text-[10px] text-zinc-500">23.6% (Tax-Free)</div>
          </div>
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-blue-500 transition-colors">
            <div className="text-xs font-bold text-zinc-200">Fidelity Solo 401(k)</div>
            <div className="text-sm font-mono font-bold text-blue-400 mt-1">$120,050</div>
            <div className="text-[10px] text-zinc-500">14.2% (Tax-Deferred)</div>
          </div>
        </div>

        {/* Stage 2: Asset Classes */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" /> 2. ASSET CLASSES
          </div>
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-200">Equities Bucket</span>
              <span className="text-xs font-mono text-indigo-400 font-bold">72.8%</span>
            </div>
            <div className="text-sm font-mono text-zinc-200 mt-1">$613,500</div>
          </div>
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-200">Fixed Income</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">12.5%</span>
            </div>
            <div className="text-sm font-mono text-zinc-200 mt-1">$105,336</div>
          </div>
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-200">Cash & Equivalents</span>
              <span className="text-xs font-mono text-zinc-400 font-bold">5.0%</span>
            </div>
            <div className="text-sm font-mono text-zinc-200 mt-1">$42,150</div>
          </div>
          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-200">Alternatives</span>
              <span className="text-xs font-mono text-amber-400 font-bold">3.9%</span>
            </div>
            <div className="text-sm font-mono text-zinc-200 mt-1">$32,827</div>
          </div>
        </div>

        {/* Stage 3: Holdings */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> 3. TARGET HOLDINGS
          </div>
          <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 flex justify-between items-center">
            <span className="font-mono font-bold text-xs text-zinc-200">VOO (S&P 500)</span>
            <span className="text-xs font-mono text-zinc-300">$227.6k</span>
          </div>
          <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 flex justify-between items-center">
            <span className="font-mono font-bold text-xs text-zinc-200">MSFT (Microsoft)</span>
            <span className="text-xs font-mono text-zinc-300">$102.8k</span>
          </div>
          <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 flex justify-between items-center">
            <span className="font-mono font-bold text-xs text-zinc-200">VWCE (All-World)</span>
            <span className="text-xs font-mono text-zinc-300">$96.4k</span>
          </div>
          <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 flex justify-between items-center">
            <span className="font-mono font-bold text-xs text-zinc-200">AAPL (Apple)</span>
            <span className="text-xs font-mono text-zinc-300">$86.9k</span>
          </div>
          <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 flex justify-between items-center">
            <span className="font-mono font-bold text-xs text-zinc-200">TLT + BTC + Cash</span>
            <span className="text-xs font-mono text-zinc-300">$130.1k</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MoneyFlow5B: React.FC = () => {
  const [monthlyContribution, setMonthlyContribution] = useState(3500);

  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Monthly Inflow Pipeline Simulator</h4>
          <p className="text-xs text-zinc-400">Simulate how fresh capital & dividend reinvestments route across holdings</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Monthly Injection:</span>
          <span className="text-sm font-mono font-bold text-emerald-400 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
            ${monthlyContribution.toLocaleString()}/mo
          </span>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={monthlyContribution}
          onChange={(e) => setMonthlyContribution(Number(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
          <span>$1,000/mo</span>
          <span>$5,000/mo</span>
          <span>$10,000/mo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-xs text-zinc-400">Core Index (VOO)</div>
          <div className="text-lg font-bold font-mono text-indigo-400 mt-1">
            +${(monthlyContribution * 0.40).toFixed(0)}
          </div>
          <div className="text-[10px] text-zinc-500">40% automated DCA</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-xs text-zinc-400">Global Equities (VWCE)</div>
          <div className="text-lg font-bold font-mono text-indigo-400 mt-1">
            +${(monthlyContribution * 0.25).toFixed(0)}
          </div>
          <div className="text-[10px] text-zinc-500">25% international rebalance</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-xs text-zinc-400">Fixed Income (TLT)</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
            +${(monthlyContribution * 0.20).toFixed(0)}
          </div>
          <div className="text-[10px] text-zinc-500">20% yield accumulator</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-xs text-zinc-400">Alternatives (BTC)</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1">
            +${(monthlyContribution * 0.15).toFixed(0)}
          </div>
          <div className="text-[10px] text-zinc-500">15% asymmetry buffer</div>
        </div>
      </div>
    </div>
  );
};

export const MoneyFlow5C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Cross-Account Allocation Routing Matrix</h4>
          <p className="text-xs text-zinc-400">Tax location efficiency: assigning high-growth vs high-income assets</p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
          Tax Alpha: +0.48%/yr
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[10px]">
              <th className="py-2 px-3">SECURITY</th>
              <th className="py-2 px-3 text-right">TAXABLE BROKERAGE</th>
              <th className="py-2 px-3 text-right">ROTH IRA</th>
              <th className="py-2 px-3 text-right">SOLO 401(K)</th>
              <th className="py-2 px-3 text-right">OPTIMAL LOCUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850 font-mono">
            {[
              { ticker: 'NVDA', taxable: '$15,207', roth: '—', k401: '—', locus: 'Taxable (Cap Gains)' },
              { ticker: 'VOO', taxable: '$142,000', roth: '$85,682', k401: '—', locus: 'Split Core' },
              { ticker: 'TLT', taxable: '—', roth: '—', k401: '$54,720', locus: '401(k) (Shield Ordinary Inc)' },
              { ticker: 'BTC', taxable: '$33,250', roth: '—', k401: '—', locus: 'Cold Storage / Taxable' },
              { ticker: 'SPAXX', taxable: '$18,200', roth: '$12,450', k401: '$11,500', locus: 'Distributed Buffer' },
            ].map(row => (
              <tr key={row.ticker} className="hover:bg-zinc-900/50">
                <td className="py-3 px-3 font-bold text-zinc-200">{row.ticker}</td>
                <td className="py-3 px-3 text-right text-zinc-400">{row.taxable}</td>
                <td className="py-3 px-3 text-right text-emerald-400">{row.roth}</td>
                <td className="py-3 px-3 text-right text-blue-400">{row.k401}</td>
                <td className="py-3 px-3 text-right text-zinc-300 text-[11px] font-sans">{row.locus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 8: Future projection (8.a, 8.b, 8.c)
// ==========================================

export const FutureProjection8A: React.FC = () => {
  const [horizonYears, setHorizonYears] = useState(10);

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Monte Carlo Fan Simulation</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">10,000 Path Wealth Forecast</h3>
          <p className="text-xs text-zinc-400">Simulating returns incorporating historical fat-tail events and volatility</p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
          {[5, 10, 15, 20].map(y => (
            <button
              key={y}
              onClick={() => setHorizonYears(y)}
              className={`px-3 py-1 rounded transition-colors ${horizonYears === y ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400'}`}
            >
              {y} Years
            </button>
          ))}
        </div>
      </div>

      {/* Fan Chart Projection */}
      <div className="relative h-48 w-full my-4">
        <svg className="w-full h-full" viewBox="0 0 700 160" preserveAspectRatio="none">
          {/* Fan Cone (90th percentile to 10th percentile) */}
          <polygon
            fill="#6366F1"
            fillOpacity="0.12"
            points="0,120 700,20 700,145 0,120"
          />
          {/* Interquartile Cone (75th to 25th) */}
          <polygon
            fill="#6366F1"
            fillOpacity="0.22"
            points="0,120 700,45 700,110 0,120"
          />
          {/* Bull Path (90th) */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="4 4"
            points="0,120 175,100 350,75 525,45 700,20"
          />
          {/* Median Path (50th) */}
          <polyline
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            points="0,120 175,110 350,95 525,80 700,65"
          />
          {/* Bear Path (10th) */}
          <polyline
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2"
            strokeDasharray="4 4"
            points="0,120 175,125 350,130 525,138 700,145"
          />
        </svg>
      </div>

      {/* Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-center text-xs text-rose-400 font-semibold mb-1">
            <span>10th Percentile (Conservative)</span>
            <span>-2.1σ</span>
          </div>
          <div className="text-xl font-bold font-mono text-zinc-100">$1,180,000</div>
          <p className="text-[11px] text-zinc-500 mt-1">Stagflation or extended bear market scenario</p>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/60">
          <div className="flex justify-between items-center text-xs text-indigo-400 font-semibold mb-1">
            <span>50th Percentile (Median Expected)</span>
            <span>50% Prob</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">$1,840,000</div>
          <p className="text-[11px] text-zinc-400 mt-1">7.8% annualized real return + ongoing contributions</p>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-center text-xs text-emerald-400 font-semibold mb-1">
            <span>90th Percentile (Optimistic)</span>
            <span>+2.1σ</span>
          </div>
          <div className="text-xl font-bold font-mono text-zinc-100">$2,650,000</div>
          <p className="text-[11px] text-zinc-500 mt-1">Tech productivity supercycle & compounding</p>
        </div>
      </div>
    </div>
  );
};

export const FutureProjection8B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-zinc-100">Milestone Arrival Estimator</h4>
          <p className="text-xs text-zinc-400">Target net worth thresholds based on current $842k trajectory</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg">
          Compounding Rate: 8.2%
        </span>
      </div>

      <div className="space-y-4">
        {[
          { target: '$1,000,000', label: 'Seven-Figure Milestone', eta: 'Nov 2026', months: '18 mos', prob: 91, progress: 84 },
          { target: '$1,500,000', label: 'Financial Independence Midpoint', eta: 'Apr 2031', months: '6 yrs', prob: 78, progress: 56 },
          { target: '$2,500,000', label: 'Full Perpetual Withdrawal ($100k/yr @ 4%)', eta: 'Sep 2037', months: '12 yrs', prob: 64, progress: 34 },
        ].map((m) => (
          <div key={m.target} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-white">{m.target}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  ETA: {m.eta} ({m.months})
                </span>
              </div>
              <div className="text-xs text-zinc-400">{m.label}</div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-36">
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span>Progress</span>
                  <span className="font-mono text-zinc-200">{m.progress}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${m.progress}%` }} />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-400">Probability</div>
                <div className="text-sm font-mono font-bold text-emerald-400">{m.prob}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FutureProjection8C: React.FC = () => {
  const [retireAge, setRetireAge] = useState(55);
  const [withdrawalRate, setWithdrawalRate] = useState(3.5);

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-base font-bold text-zinc-100">Safe Withdrawal & Longevity Stress Test</h4>
          <p className="text-xs text-zinc-400">Interactive retirement sustainable cashflow engine</p>
        </div>
        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-800">
          Sustainable Annual Income: ${((PORTFOLIO_SUMMARY.totalValue * (withdrawalRate / 100))).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="flex justify-between text-xs text-zinc-300 mb-2">
            <span>Target Retirement Age:</span>
            <span className="font-mono font-bold text-indigo-400">{retireAge} years old</span>
          </div>
          <input
            type="range"
            min="45"
            max="65"
            value={retireAge}
            onChange={(e) => setRetireAge(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="flex justify-between text-xs text-zinc-300 mb-2">
            <span>Withdrawal Rate Rule:</span>
            <span className="font-mono font-bold text-emerald-400">{withdrawalRate}% per annum</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="5.5"
            step="0.1"
            value={withdrawalRate}
            onChange={(e) => setWithdrawalRate(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-zinc-200">99.4% Capital Survival to Age 95</div>
          <p className="text-xs text-zinc-400">Under historical sequences (including 1929 Great Crash, 1970s Stagflation, 2008 GFC), your asset allocation never reaches zero.</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 18: Health score (18.a, 18.b, 18.c)
// ==========================================

export const HealthScore18A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">Portfolio Diagnostics</div>
          <h3 className="text-2xl font-bold text-white">Meridian Health Index</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono text-emerald-400">84<span className="text-sm text-zinc-500">/100</span></div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">GRADE A- (ROBUST)</div>
          </div>
        </div>
      </div>

      {/* 5-Pillar Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Diversification', score: 88, status: 'Optimal', desc: '10 holdings, low cross-correlation' },
          { label: 'Cost & Fees', score: 94, status: 'Elite', desc: '0.07% blended expense ratio' },
          { label: 'Risk Balance', score: 76, status: 'Moderate', desc: 'NVDA single-stock concentration' },
          { label: 'Liquidity Buffer', score: 85, status: 'Solid', desc: '5% cash @ 4.85% APY yield' },
          { label: 'Dividend Quality', score: 82, status: 'Healthy', desc: '98% dividend coverage ratio' },
        ].map(pillar => (
          <div key={pillar.label} className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-300">{pillar.label}</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">{pillar.score}</div>
              <div className="text-[10px] text-emerald-400 font-medium">{pillar.status}</div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-3 pt-2 border-t border-zinc-800/80">{pillar.desc}</p>
          </div>
        ))}
      </div>

      {/* Actionable item */}
      <div className="mt-4 p-3 bg-amber-950/30 rounded-xl border border-amber-900/40 flex items-center gap-3 text-xs text-amber-300">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>To reach 90+ Health Score: Consider trimming NVDA by 3% to reduce single-name tech beta.</span>
      </div>
    </div>
  );
};

export const HealthScore18B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-zinc-100">Audit Scorecard & Factor Breakdown</h4>
          <p className="text-xs text-zinc-400">Granular audit against institutional wealth best practices</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono font-bold">
          Score: 84 / 100
        </div>
      </div>

      <div className="space-y-3">
        {[
          { title: 'Tax Loss Harvesting Efficiency', points: '+14 pts', impact: 'positive', note: 'No short-term capital penalties; harvested $3.2k in clean tech.' },
          { title: 'Index Fee Drag Minimization', points: '+22 pts', impact: 'positive', note: 'VOO and VWCE institutional share classes utilized.' },
          { title: 'Asset Location Alignment', points: '+18 pts', impact: 'positive', note: 'Bonds placed in Solo 401(k), equities in Roth & Taxable.' },
          { title: 'Single-Holding Exposure (>10%)', points: '-12 pts', impact: 'negative', note: 'NVDA constitutes 14.8% of portfolio (>10% prudent ceiling).' },
          { title: 'Cash Yield Optimization', points: '+8 pts', impact: 'positive', note: 'Cash held in treasury sweep earning 4.85% APY vs 0.01% bank savings.' },
        ].map(item => (
          <div key={item.title} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${item.impact === 'positive' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <div>
                <div className="text-xs font-bold text-zinc-200">{item.title}</div>
                <div className="text-[11px] text-zinc-400">{item.note}</div>
              </div>
            </div>
            <div className={`text-xs font-mono font-bold ${item.impact === 'positive' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HealthScore18C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radial Arc */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#27272A" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="8" 
                strokeDasharray="264" 
                strokeDashoffset={264 - (264 * 84) / 100}
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold font-mono text-white">84</span>
              <span className="block text-[10px] font-mono text-zinc-400 uppercase">HEALTH SCORE</span>
            </div>
          </div>
          <span className="mt-2 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-3 py-1 rounded-full">
            Top 8% of Peer Portfolios
          </span>
        </div>

        {/* Priority Actions Needed */}
        <div className="md:col-span-7 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Recommended Health Actions</div>
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-zinc-200">Rebalance Fixed Income</div>
              <div className="text-[11px] text-zinc-400">Fixed Income is 2.5% below target 15%</div>
            </div>
            <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold">
              Auto-Align
            </button>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-zinc-200">Harvest ICLN Clean Energy Loss</div>
              <div className="text-[11px] text-zinc-400">-$5,700 loss available for tax offset</div>
            </div>
            <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-semibold">
              Harvest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
