import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, 
  CheckCircle, ShieldAlert
} from 'lucide-react';
import { MOCK_HOLDINGS, ASSET_CLASS_BREAKDOWN, SECTOR_DATA } from '../data/mockData';

// ==========================================
// COMPONENT 19: Drawdown (19.a, 19.b, 19.c)
// ==========================================

export const Drawdown19A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-rose-400">Peak-to-Trough Analysis</span>
          <h4 className="text-base font-bold text-zinc-100">Underwater Drawdown Profile</h4>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
            Current Drawdown: <span className="text-rose-400 font-bold">-1.91%</span>
          </div>
          <div className="bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
            Max 5-Yr Drawdown: <span className="text-rose-400 font-bold">-14.2%</span>
          </div>
        </div>
      </div>

      {/* Underwater Area Chart */}
      <div className="relative h-44 w-full my-4 bg-zinc-900/40 rounded-xl p-3 border border-zinc-850">
        <div className="absolute top-3 left-4 text-[10px] font-mono text-zinc-400">0% (All-Time Peak)</div>
        <div className="absolute bottom-3 left-4 text-[10px] font-mono text-zinc-400">-15%</div>
        <svg className="w-full h-full pt-4" viewBox="0 0 700 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="drawdownGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <line x1="0" y1="10" x2="700" y2="10" stroke="#3F3F46" strokeWidth="1" strokeDasharray="3 3" />
          <polygon
            fill="url(#drawdownGrad)"
            points="0,10 60,10 120,40 180,85 240,110 300,55 360,10 420,10 480,45 540,25 600,10 650,22 700,22 700,10"
          />
          <polyline
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2.5"
            points="0,10 60,10 120,40 180,85 240,110 300,55 360,10 420,10 480,45 540,25 600,10 650,22 700,22"
          />
          <circle cx="700" cy="22" r="4" fill="#F43F5E" />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-zinc-400">Previous Peak</div>
          <div className="text-sm font-bold font-mono text-zinc-200 mt-0.5">$859,100 (Jan 24, 2025)</div>
          <div className="text-[10px] text-zinc-500">Need +$16,410 to set new high</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-zinc-400">Avg Recovery Duration</div>
          <div className="text-sm font-bold font-mono text-zinc-200 mt-0.5">42 Days</div>
          <div className="text-[10px] text-emerald-400">45% faster than benchmark (76d)</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-zinc-400">Worst Historical Fall</div>
          <div className="text-sm font-bold font-mono text-rose-400 mt-0.5">-14.2% (2022 Tech Bear)</div>
          <div className="text-[10px] text-zinc-500">Fully recovered by Nov 2023</div>
        </div>
      </div>
    </div>
  );
};

export const Drawdown19B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Historical Crisis Resilience Comparison</h4>
          <p className="text-xs text-zinc-400">How the current asset allocation would have weathered historical panics</p>
        </div>
        <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded">Benchmark: S&P 500</span>
      </div>

      <div className="space-y-3">
        {[
          { crisis: '2022 Fed Rate Hiking Cycle', dates: 'Jan 2022 – Oct 2022', portDrop: '-14.2%', spDrop: '-25.4%', alpha: '+11.2% protected' },
          { crisis: '2020 COVID Shock', dates: 'Feb 2020 – Mar 2020', portDrop: '-19.8%', spDrop: '-33.9%', alpha: '+14.1% protected' },
          { crisis: '2018 Q4 Rate Tantrum', dates: 'Oct 2018 – Dec 2018', portDrop: '-9.5%', spDrop: '-19.6%', alpha: '+10.1% protected' },
        ].map((c) => (
          <div key={c.crisis} className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-zinc-200">{c.crisis}</div>
              <div className="text-[11px] text-zinc-500 font-mono">{c.dates}</div>
            </div>
            <div className="flex items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-zinc-500">Portfolio: </span>
                <span className="font-bold text-zinc-200">{c.portDrop}</span>
              </div>
              <div>
                <span className="text-zinc-500">S&P 500: </span>
                <span className="font-bold text-rose-400">{c.spDrop}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">
                {c.alpha}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Drawdown19C: React.FC = () => {
  const [alertThreshold, setAlertThreshold] = useState(8);

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Drawdown Circuit Breakers & Alerts</h4>
          <p className="text-xs text-zinc-400">Configure safety thresholds to trigger hedging or automated cash preservation</p>
        </div>
        <div className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded border border-indigo-800">
          Tolerance Buffer: -{alertThreshold}%
        </div>
      </div>

      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 mb-4">
        <div className="flex justify-between text-xs text-zinc-300 mb-2">
          <span>Notify & Trigger Defensive Review if Drawdown Breaches:</span>
          <span className="font-mono font-bold text-rose-400">-{alertThreshold}.0%</span>
        </div>
        <input
          type="range"
          min="3"
          max="20"
          value={alertThreshold}
          onChange={(e) => setAlertThreshold(Number(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded appearance-none cursor-pointer accent-rose-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
          <span>-3% (Conservative)</span>
          <span>-10% (Balanced)</span>
          <span>-20% (High Volatility)</span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs">
        <ShieldAlert className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div>
          <span className="font-bold text-zinc-200">Current status is Safe.</span> Current drawdown is only -1.91%, leaving a 6.09% cushion before your alert triggers.
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 21: Rebalance plan (21.a, 21.b, 21.c)
// ==========================================

export const RebalancePlan21A: React.FC = () => {
  const [executed, setExecuted] = useState(false);

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Target Weight Convergence</span>
          <h4 className="text-base font-bold text-zinc-100">Algorithmic Rebalancing Orders</h4>
        </div>
        <button
          onClick={() => setExecuted(!executed)}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            executed ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {executed ? <CheckCircle className="w-4 h-4" /> : null}
          {executed ? 'Orders Sent to Broker' : 'Preview 3 Rebalance Trades'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-[10px]">
              <th className="py-2.5 px-3">ACTION</th>
              <th className="py-2.5 px-3">SECURITY</th>
              <th className="py-2.5 px-3 text-right">CURRENT %</th>
              <th className="py-2.5 px-3 text-right">TARGET %</th>
              <th className="py-2.5 px-3 text-right">EST. VALUE</th>
              <th className="py-2.5 px-3 text-right">EST. TAX COST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            <tr className="hover:bg-zinc-900/50">
              <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800">SELL</span></td>
              <td className="py-3 px-3 font-bold text-zinc-200">NVDA (NVIDIA)</td>
              <td className="py-3 px-3 text-right text-zinc-300">14.8%</td>
              <td className="py-3 px-3 text-right text-zinc-400">10.0%</td>
              <td className="py-3 px-3 text-right font-bold text-rose-400">-$4,920.00</td>
              <td className="py-3 px-3 text-right text-zinc-400">$380 (LTCG)</td>
            </tr>
            <tr className="hover:bg-zinc-900/50">
              <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">BUY</span></td>
              <td className="py-3 px-3 font-bold text-zinc-200">TLT (Treasury 20Y)</td>
              <td className="py-3 px-3 text-right text-zinc-300">6.5%</td>
              <td className="py-3 px-3 text-right text-zinc-400">9.0%</td>
              <td className="py-3 px-3 text-right font-bold text-emerald-400">+$2,850.00</td>
              <td className="py-3 px-3 text-right text-zinc-500">$0</td>
            </tr>
            <tr className="hover:bg-zinc-900/50">
              <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">BUY</span></td>
              <td className="py-3 px-3 font-bold text-zinc-200">VWCE (All-World)</td>
              <td className="py-3 px-3 text-right text-zinc-300">11.4%</td>
              <td className="py-3 px-3 text-right text-zinc-400">13.0%</td>
              <td className="py-3 px-3 text-right font-bold text-emerald-400">+$2,070.00</td>
              <td className="py-3 px-3 text-right text-zinc-500">$0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RebalancePlan21B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Asset Class Drift Dumbbell Chart</h4>
          <p className="text-xs text-zinc-400">Visual gaps between current allocations and benchmark targets</p>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Max Drift: <span className="text-amber-400 font-bold">+2.8% (Equities)</span>
        </div>
      </div>

      <div className="space-y-4">
        {ASSET_CLASS_BREAKDOWN.map(cls => (
          <div key={cls.name} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-bold text-zinc-200">{cls.name}</span>
              <div className="font-mono text-zinc-400">
                Current: <span className="text-white font-bold">{cls.currentPct}%</span> | Target: <span className="text-indigo-400 font-bold">{cls.targetPct}%</span>
                <span className={`ml-2 font-bold ${cls.driftPct > 0 ? 'text-amber-400' : cls.driftPct < 0 ? 'text-rose-400' : 'text-zinc-500'}`}>
                  ({cls.driftPct > 0 ? '+' : ''}{cls.driftPct}%)
                </span>
              </div>
            </div>
            {/* Dumbbell bar */}
            <div className="relative h-3 bg-zinc-850 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 bg-indigo-500/30 rounded-full"
                style={{
                  left: `${Math.min(cls.currentPct, cls.targetPct)}%`,
                  width: `${Math.abs(cls.currentPct - cls.targetPct)}%`
                }}
              />
              {/* Target Marker */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white z-10" 
                style={{ left: `${cls.targetPct}%` }}
                title={`Target: ${cls.targetPct}%`}
              />
              {/* Current Fill */}
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${cls.currentPct}%`, 
                  backgroundColor: cls.color 
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RebalancePlan21C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Tax-Free Inflow Rebalancing (Zero Selling)</h4>
          <p className="text-xs text-zinc-400">Direct upcoming monthly cash deposits exclusively to underweight assets</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
          Taxes Saved: ~$1,420
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-2">Next Deposit Allocation ($3,500)</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-300">TLT (Fixed Income)</span>
              <span className="text-emerald-400 font-bold">$2,100 (60%)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-300">BTC (Alternatives)</span>
              <span className="text-amber-400 font-bold">$900 (26%)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-300">Cash Reserve Top-up</span>
              <span className="text-zinc-400 font-bold">$500 (14%)</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-200">Rebalance Convergence Schedule</div>
            <p className="text-xs text-zinc-400 mt-1">At $3,500/month, the portfolio reaches 0.0% drift within <strong>3.2 months</strong> without triggering a single capital gain event.</p>
          </div>
          <button className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors">
            Automate Smart Inflow Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 22: Return bridge (22.a, 22.b, 22.c)
// ==========================================

export const ReturnBridge22A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Capital Progression</span>
          <h4 className="text-base font-bold text-zinc-100">Waterfall Return Bridge (Inception to Date)</h4>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
          Net Created Wealth: <span className="text-emerald-400 font-bold">+$224,270.45</span>
        </div>
      </div>

      {/* Waterfall Visualization */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
          <div className="text-[10px] text-zinc-400 uppercase font-mono">Net Deposits</div>
          <div className="text-sm font-bold font-mono text-zinc-200 mt-1">$618,420</div>
          <div className="text-[10px] text-zinc-500">Principal</div>
        </div>
        <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800 text-center">
          <div className="text-[10px] text-emerald-400 uppercase font-mono">Capital Gains</div>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-1">+$189,450</div>
          <div className="text-[10px] text-emerald-500">Market rally</div>
        </div>
        <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800 text-center">
          <div className="text-[10px] text-emerald-400 uppercase font-mono">Dividends</div>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-1">+$34,820</div>
          <div className="text-[10px] text-emerald-500">Cash distributions</div>
        </div>
        <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800 text-center">
          <div className="text-[10px] text-rose-400 uppercase font-mono">Fund Fees</div>
          <div className="text-sm font-bold font-mono text-rose-400 mt-1">-$2,840</div>
          <div className="text-[10px] text-rose-500">Expense ratios</div>
        </div>
        <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800 text-center">
          <div className="text-[10px] text-indigo-400 uppercase font-mono">FX Impact</div>
          <div className="text-sm font-bold font-mono text-indigo-400 mt-1">+$2,840</div>
          <div className="text-[10px] text-indigo-500">USD/EUR swing</div>
        </div>
        <div className="p-3 bg-zinc-850 rounded-xl border border-zinc-700 text-center">
          <div className="text-[10px] text-zinc-300 uppercase font-mono">Current Value</div>
          <div className="text-base font-extrabold font-mono text-white mt-1">$842,690</div>
          <div className="text-[10px] text-emerald-400 font-bold">100% Value</div>
        </div>
      </div>
    </div>
  );
};

export const ReturnBridge22B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Capital Additions vs Pure Compounding</h4>
          <p className="text-xs text-zinc-400">Ratio of human effort (saving) to money working (growth)</p>
        </div>
        <span className="text-xs font-mono text-emerald-400">Compounding Multiplier: 1.36x</span>
      </div>

      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-zinc-300">Total Book ($842,690)</span>
          <span className="font-mono text-zinc-400">73.4% Saved | 26.6% Market Profit</span>
        </div>
        <div className="h-4 bg-zinc-800 rounded-full flex overflow-hidden">
          <div className="bg-blue-600 h-full" style={{ width: '73.4%' }} title="Money Invested: $618,420 (73.4%)" />
          <div className="bg-emerald-500 h-full" style={{ width: '26.6%' }} title="Compound Growth: $224,270 (26.6%)" />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-3 pt-2 border-t border-zinc-850">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Money Added ($618.4k)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Market Gains & Yield (+$224.3k)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReturnBridge22C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Annual Return Breakdown Attribution</h4>
          <p className="text-xs text-zinc-400">Yearly decomposition of return drivers</p>
        </div>
        <span className="text-xs font-mono text-zinc-400">Time-Weighted</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-[10px]">
              <th className="py-2 px-3">YEAR</th>
              <th className="py-2 px-3 text-right">START VALUE</th>
              <th className="py-2 px-3 text-right">NEW CASH</th>
              <th className="py-2 px-3 text-right">DIVIDENDS</th>
              <th className="py-2 px-3 text-right">CAPITAL GAIN</th>
              <th className="py-2 px-3 text-right">NET RETURN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {[
              { year: '2024', start: '$620,100', cash: '+$42,000', div: '+$13,200', cap: '+$142,300', net: '+24.1%' },
              { year: '2023', start: '$480,500', cash: '+$38,000', div: '+$10,400', cap: '+$91,200', net: '+19.8%' },
              { year: '2022', start: '$510,000', cash: '+$45,000', div: '+$9,100', cap: '-$83,600', net: '-14.2%', loss: true },
            ].map(r => (
              <tr key={r.year} className="hover:bg-zinc-900/40">
                <td className="py-2.5 px-3 font-bold text-zinc-200">{r.year}</td>
                <td className="py-2.5 px-3 text-right text-zinc-400">{r.start}</td>
                <td className="py-2.5 px-3 text-right text-blue-400">{r.cash}</td>
                <td className="py-2.5 px-3 text-right text-emerald-400">{r.div}</td>
                <td className={`py-2.5 px-3 text-right ${r.loss ? 'text-rose-400' : 'text-emerald-400'}`}>{r.cap}</td>
                <td className={`py-2.5 px-3 text-right font-bold ${r.loss ? 'text-rose-400' : 'text-emerald-400'}`}>{r.net}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 23: Holding detail panel (23.a, 23.b, 23.c)
// ==========================================

export const HoldingDetail23A: React.FC = () => {
  const h = MOCK_HOLDINGS[0]; // NVDA

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-400">
            {h.ticker}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {h.name}
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono font-normal">NASDAQ</span>
            </h3>
            <p className="text-xs text-zinc-400">{h.sector} • {h.country}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-white">${h.currentPrice.toFixed(2)}</div>
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-end">
            <ArrowUpRight className="w-4 h-4 mr-0.5" /> +${h.dayChangeValue} (+{h.dayChangePct}%) Today
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Position Value</div>
          <div className="text-base font-bold font-mono text-zinc-100 mt-0.5">${h.value.toLocaleString()}</div>
          <div className="text-[10px] text-indigo-400 font-mono">{h.weightPct}% of portfolio</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Total Unrealized Gain</div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">+${h.unrealizedGain.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-500 font-mono">+{h.unrealizedGainPct.toFixed(1)}% gain on cost</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Quantity Held</div>
          <div className="text-base font-bold font-mono text-zinc-100 mt-0.5">{h.shares} Shares</div>
          <div className="text-[10px] text-zinc-500 font-mono">Avg cost: ${h.avgBuyPrice.toFixed(2)}</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Fair Value Corridor</div>
          <div className="text-base font-bold font-mono text-zinc-100 mt-0.5">${h.fairValue.toFixed(2)}</div>
          <div className="text-[10px] text-emerald-400">+4.8% upside target</div>
        </div>
      </div>
    </div>
  );
};

export const HoldingDetail23B: React.FC = () => {
  const h = MOCK_HOLDINGS[1]; // VOO

  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase text-indigo-400">Core Index Holding</span>
          <h4 className="text-lg font-bold text-zinc-100">{h.name} ({h.ticker})</h4>
        </div>
        <div className="text-right font-mono">
          <div className="text-lg font-bold text-white">${h.value.toLocaleString()}</div>
          <div className="text-xs text-zinc-400">Weight: {h.weightPct}%</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs text-zinc-400">52-Week Range Corridor (${h.week52Low} – ${h.week52High})</div>
        <div className="h-2.5 bg-zinc-950 rounded-full relative overflow-hidden border border-zinc-800">
          <div className="absolute top-0 bottom-0 bg-emerald-500/80 rounded-full" style={{ left: '0%', width: '92%' }} />
          <div className="absolute top-0 bottom-0 w-1 bg-white" style={{ left: '92%' }} />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>Low: ${h.week52Low}</span>
          <span className="text-emerald-400 font-bold">Current: ${h.currentPrice}</span>
          <span>High: ${h.week52High}</span>
        </div>
      </div>

      <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs grid grid-cols-3 gap-2 text-center">
        <div>
          <span className="text-zinc-500">Beta:</span> <strong className="text-zinc-200 font-mono">{h.beta}</strong>
        </div>
        <div>
          <span className="text-zinc-500">Div Yield:</span> <strong className="text-emerald-400 font-mono">{h.dividendYield}%</strong>
        </div>
        <div>
          <span className="text-zinc-500">P/E Ratio:</span> <strong className="text-zinc-200 font-mono">{h.peRatio}x</strong>
        </div>
      </div>
    </div>
  );
};

export const HoldingDetail23C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono text-amber-400">Alternative Asset Dossier</span>
          <h4 className="text-base font-bold text-white">Bitcoin Spot Holdings (BTC)</h4>
        </div>
        <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-xs">
          3.9% Portfolio Weight
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Position Size</div>
          <div className="text-base font-mono font-bold text-zinc-100">0.38000000 BTC</div>
          <div className="text-[10px] text-zinc-500">Self-custody cold storage</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Cost Basis</div>
          <div className="text-base font-mono font-bold text-zinc-100">$42,000 / BTC</div>
          <div className="text-[10px] text-zinc-500">Total invested: $15,960</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Return on Investment</div>
          <div className="text-base font-mono font-bold text-emerald-400">+108.33%</div>
          <div className="text-[10px] text-emerald-500">Profit: +$17,290.00</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 27: Attribution (27.a, 27.b, 27.c)
// ==========================================

export const Attribution27A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase text-indigo-400">Return Contribution Tornado</span>
          <h4 className="text-base font-bold text-zinc-100">Holding Contribution to Total Return</h4>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
          Total Book Return: +36.26%
        </span>
      </div>

      <div className="space-y-3">
        {[
          { ticker: 'NVDA', name: 'Nvidia Corp', contrib: '+8.8%', positive: true, pct: 88 },
          { ticker: 'VOO', name: 'Vanguard S&P 500', contrib: '+8.5%', positive: true, pct: 85 },
          { ticker: 'MSFT', name: 'Microsoft Corp', contrib: '+4.1%', positive: true, pct: 41 },
          { ticker: 'BTC', name: 'Bitcoin Spot', contrib: '+2.7%', positive: true, pct: 27 },
          { ticker: 'TLT', name: '20Y Treasury Bond', contrib: '-0.7%', positive: false, pct: 15 },
          { ticker: 'ICLN', name: 'Clean Energy ETF', contrib: '-0.9%', positive: false, pct: 20 },
        ].map(item => (
          <div key={item.ticker} className="flex items-center gap-3 text-xs font-mono">
            <span className="w-14 font-bold text-zinc-200">{item.ticker}</span>
            <div className="flex-1 flex items-center h-4 bg-zinc-900 rounded-full overflow-hidden px-1">
              {item.positive ? (
                <div 
                  className="h-2 rounded-full bg-emerald-500" 
                  style={{ width: `${item.pct}%` }} 
                />
              ) : (
                <div 
                  className="h-2 rounded-full bg-rose-500 ml-auto" 
                  style={{ width: `${item.pct}%` }} 
                />
              )}
            </div>
            <span className={`w-16 text-right font-bold ${item.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.contrib}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Attribution27B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Basis Points Added by Sector</h4>
          <p className="text-xs text-zinc-400">Brinson model allocation vs selection alpha</p>
        </div>
        <span className="text-xs font-mono text-zinc-400">YTD Cumulative</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400">InfoTech Alpha</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">+485 bps</div>
          <div className="text-[10px] text-zinc-500">Overweight semiconductor</div>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Broad Index Alpha</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">+320 bps</div>
          <div className="text-[10px] text-zinc-500">US mega-cap exposure</div>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Fixed Income Drag</div>
          <div className="text-lg font-bold font-mono text-rose-400 mt-1">-68 bps</div>
          <div className="text-[10px] text-zinc-500">Duration curve headwinds</div>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400">Clean Tech Drag</div>
          <div className="text-lg font-bold font-mono text-rose-400 mt-1">-90 bps</div>
          <div className="text-[10px] text-zinc-500">Sub-sector underperformance</div>
        </div>
      </div>
    </div>
  );
};

export const Attribution27C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Asset Class Attribution Breakdown</h4>
          <p className="text-xs text-zinc-400">Separating allocation decisions from security selection</p>
        </div>
        <span className="text-xs font-mono text-indigo-400">Institutional Brinson-Fachler</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-[10px]">
              <th className="py-2 px-3">ASSET CLASS</th>
              <th className="py-2 px-3 text-right">WEIGHT</th>
              <th className="py-2 px-3 text-right">ALLOCATION EFFECT</th>
              <th className="py-2 px-3 text-right">SELECTION EFFECT</th>
              <th className="py-2 px-3 text-right">TOTAL EFFECT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {[
              { cls: 'Equities', weight: '72.8%', alloc: '+1.4%', select: '+4.8%', total: '+6.2%' },
              { cls: 'Fixed Income', weight: '12.5%', alloc: '-0.3%', select: '-0.2%', total: '-0.5%', loss: true },
              { cls: 'Alternatives', weight: '3.9%', alloc: '+0.8%', select: '+1.5%', total: '+2.3%' },
              { cls: 'Cash', weight: '5.0%', alloc: '+0.1%', select: '+0.0%', total: '+0.1%' },
            ].map(r => (
              <tr key={r.cls} className="hover:bg-zinc-900/40">
                <td className="py-2.5 px-3 font-bold text-zinc-200">{r.cls}</td>
                <td className="py-2.5 px-3 text-right text-zinc-400">{r.weight}</td>
                <td className="py-2.5 px-3 text-right text-zinc-300">{r.alloc}</td>
                <td className="py-2.5 px-3 text-right text-zinc-300">{r.select}</td>
                <td className={`py-2.5 px-3 text-right font-bold ${r.loss ? 'text-rose-400' : 'text-emerald-400'}`}>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 30: Dividend calendar (30.a, 30.b, 30.c)
// ==========================================

export const DividendCalendar30A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400">Cash Distribution Stream</span>
          <h4 className="text-base font-bold text-zinc-100">12-Month Projected Dividend Distribution</h4>
        </div>
        <div className="text-xs font-mono text-zinc-300 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
          Annual Forecast: <span className="text-emerald-400 font-bold">$14,820.50</span>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="grid grid-cols-12 gap-1.5 h-36 items-end pb-2 border-b border-zinc-800">
        {[
          { m: 'Jan', val: 780 },
          { m: 'Feb', val: 620 },
          { m: 'Mar', val: 1940, peak: true },
          { m: 'Apr', val: 810 },
          { m: 'May', val: 640 },
          { m: 'Jun', val: 2150, peak: true },
          { m: 'Jul', val: 890 },
          { m: 'Aug', val: 710 },
          { m: 'Sep', val: 2020, peak: true },
          { m: 'Oct', val: 780 },
          { m: 'Nov', val: 690 },
          { m: 'Dec', val: 2800, peak: true },
        ].map(item => (
          <div key={item.m} className="flex flex-col items-center gap-1 group">
            <span className="text-[9px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
              ${item.val}
            </span>
            <div 
              className={`w-full rounded-t transition-all ${
                item.peak ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-zinc-700 hover:bg-zinc-600'
              }`}
              style={{ height: `${(item.val / 2800) * 100}%` }}
            />
            <span className="text-[10px] font-mono text-zinc-400">{item.m}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-xs text-zinc-400 mt-3">
        <span>Quarter-end spikes reflect ETF distributions (VOO, VWCE, TLT)</span>
        <span className="font-mono text-emerald-400 font-bold">Avg $1,235 / month</span>
      </div>
    </div>
  );
};

export const DividendCalendar30B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Upcoming Confirmed Payout Timeline</h4>
          <p className="text-xs text-zinc-400">Next 60 days of declared dividend events</p>
        </div>
        <span className="text-xs font-mono text-emerald-400">Total Pending: $2,420.80</span>
      </div>

      <div className="space-y-3">
        {[
          { ticker: 'VOO', name: 'Vanguard S&P 500', exDate: 'Mar 24, 2025', payDate: 'Mar 29, 2025', amount: '$764.40', status: 'Declared' },
          { ticker: 'MSFT', name: 'Microsoft Corp', exDate: 'Feb 19, 2025', payDate: 'Mar 13, 2025', amount: '$187.20', status: 'Approved' },
          { ticker: 'TLT', name: 'iShares 20Y Treasury', exDate: 'Mar 02, 2025', payDate: 'Mar 07, 2025', amount: '$178.50', status: 'Monthly' },
          { ticker: 'VWCE', name: 'FTSE All-World', exDate: 'Jun 12, 2025', payDate: 'Jun 24, 2025', amount: '$1,290.70', status: 'Estimated' },
        ].map(item => (
          <div key={item.ticker} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center font-mono font-bold text-xs text-emerald-400 border border-zinc-800">
                {item.ticker}
              </span>
              <div>
                <div className="text-xs font-bold text-zinc-200">{item.name}</div>
                <div className="text-[11px] text-zinc-500 font-mono">Ex: {item.exDate} ➔ Pay: {item.payDate}</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm font-bold text-emerald-400">{item.amount}</div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-sans">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DividendCalendar30B_Alt: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Annual Dividend Growth (YoY Compounding)</h4>
          <p className="text-xs text-zinc-400">Total passive income received per calendar year</p>
        </div>
        <span className="text-xs font-mono text-emerald-400">+14.2% 5-Yr CAGR</span>
      </div>

      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-mono">2022</div>
          <div className="text-sm font-bold font-mono text-zinc-300 mt-1">$9,140</div>
          <div className="text-[10px] text-zinc-500">+8.2% YoY</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-mono">2023</div>
          <div className="text-sm font-bold font-mono text-zinc-300 mt-1">$10,480</div>
          <div className="text-[10px] text-emerald-400">+14.6% YoY</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-mono">2024</div>
          <div className="text-sm font-bold font-mono text-zinc-200 mt-1">$13,220</div>
          <div className="text-[10px] text-emerald-400">+26.1% YoY</div>
        </div>
        <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800">
          <div className="text-[10px] text-emerald-400 font-mono">2025 (Run Rate)</div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-1">$14,820</div>
          <div className="text-[10px] text-emerald-500">+12.1% Forecast</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 33: Sector vs benchmark (33.a, 33.b, 33.c)
// ==========================================

export const SectorVsBenchmark33A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase text-indigo-400">Active Share Tilt</span>
          <h4 className="text-base font-bold text-zinc-100">Sector Exposure vs S&P 500 Index</h4>
        </div>
        <span className="text-xs font-mono text-zinc-400">Active Share: 32.4%</span>
      </div>

      <div className="space-y-3">
        {SECTOR_DATA.slice(0, 5).map(s => (
          <div key={s.sector} className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-200">{s.sector}</span>
              <span className="font-mono text-zinc-400">
                Book: <strong className="text-white">{s.weight}%</strong> vs S&P: {s.benchmarkWeight}%
                <span className={`ml-2 font-bold ${s.activeWeight > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ({s.activeWeight > 0 ? '+' : ''}{s.activeWeight}%)
                </span>
              </span>
            </div>
            <div className="flex gap-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="bg-indigo-500 rounded-full" style={{ width: `${s.weight}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SectorVsBenchmark33B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Over / Under Weight Active Exposure Bar</h4>
          <p className="text-xs text-zinc-400">Divergence from market neutral index weights</p>
        </div>
        <span className="text-xs font-mono text-emerald-400">Tech Overweight</span>
      </div>

      <div className="space-y-2">
        {SECTOR_DATA.map(s => {
          const isOver = s.activeWeight > 0;
          return (
            <div key={s.sector} className="flex items-center text-xs font-mono">
              <span className="w-44 truncate text-zinc-300 font-sans">{s.sector}</span>
              <div className="flex-1 flex items-center h-4 bg-zinc-950 rounded px-1">
                <div className="w-1/2 flex justify-end">
                  {!isOver && (
                    <div 
                      className="bg-rose-500/80 h-2 rounded-l" 
                      style={{ width: `${Math.abs(s.activeWeight) * 12}%` }}
                    />
                  )}
                </div>
                <div className="w-0.5 h-3 bg-zinc-600" />
                <div className="w-1/2 flex justify-start">
                  {isOver && (
                    <div 
                      className="bg-emerald-500/80 h-2 rounded-r" 
                      style={{ width: `${s.activeWeight * 12}%` }}
                    />
                  )}
                </div>
              </div>
              <span className={`w-14 text-right font-bold ${isOver ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isOver ? '+' : ''}{s.activeWeight}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SectorVsBenchmark33C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Sector Concentration Risk Heatmap</h4>
          <p className="text-xs text-zinc-400">Ranked by portfolio capital deployment</p>
        </div>
        <span className="text-xs font-mono text-zinc-400">8 GICS Sectors</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SECTOR_DATA.slice(0, 4).map(s => (
          <div key={s.sector} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="text-xs font-bold text-zinc-200 truncate">{s.sector}</div>
            <div className="text-xl font-bold font-mono text-indigo-400 mt-1">{s.weight}%</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1">{s.holdingsCount} Positions</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 42: Gain and loss per holding (42.a, 42.b, 42.c)
// ==========================================

export const GainAndLoss42A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400">Unrealized Capital Ledger</span>
          <h4 className="text-base font-bold text-zinc-100">Gain and Loss Distribution per Holding</h4>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
          Net Gain: <span className="text-emerald-400 font-bold">+$224,270.45</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {MOCK_HOLDINGS.slice(0, 6).map(h => {
          const isGain = h.unrealizedGain >= 0;
          return (
            <div key={h.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-zinc-200 w-12">{h.ticker}</span>
                <span className="text-xs text-zinc-400 truncate max-w-[140px]">{h.name}</span>
              </div>
              <div className="flex items-center gap-6 font-mono text-xs">
                <div className="text-right">
                  <span className="text-zinc-500 text-[10px] block">DOLLAR P/L</span>
                  <span className={`font-bold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isGain ? '+' : ''}${h.unrealizedGain.toLocaleString()}
                  </span>
                </div>
                <div className="text-right w-20">
                  <span className="text-zinc-500 text-[10px] block">RETURN %</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                    isGain ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {isGain ? '+' : ''}{h.unrealizedGainPct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const GainAndLoss42B: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Top Winners vs Tax-Harvestable Laggards</h4>
          <p className="text-xs text-zinc-400">Ranked by absolute dollar wealth generated</p>
        </div>
        <span className="text-xs font-mono text-zinc-400">8 Winners / 2 Losers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Winners */}
        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Top Wealth Generators
          </div>
          <div className="space-y-2">
            {[
              { ticker: 'VOO', val: '+$54,516.00', pct: '+31.5%' },
              { ticker: 'MSFT', val: '+$26,016.00', pct: '+33.9%' },
              { ticker: 'AAPL', val: '+$21,432.00', pct: '+32.7%' },
              { ticker: 'VWCE', val: '+$18,300.00', pct: '+23.4%' },
            ].map(w => (
              <div key={w.ticker} className="flex justify-between items-center text-xs font-mono p-2 rounded bg-zinc-900 border border-zinc-850">
                <span className="font-bold text-zinc-200">{w.ticker}</span>
                <span className="text-emerald-400 font-bold">{w.val} ({w.pct})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Laggards */}
        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-xs font-bold text-rose-400 mb-3 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4" /> Capital Drags (Loss Harvesting)
          </div>
          <div className="space-y-2">
            {[
              { ticker: 'ICLN', val: '-$5,700.00', pct: '-25.7%', tip: 'Eligible for $3k cap offset' },
              { ticker: 'TLT', val: '-$4,320.00', pct: '-7.3%', tip: 'Yielding 3.92% coupon' },
            ].map(l => (
              <div key={l.ticker} className="p-2 rounded bg-zinc-900 border border-zinc-850">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-zinc-200">{l.ticker}</span>
                  <span className="text-rose-400 font-bold">{l.val} ({l.pct})</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">{l.tip}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const GainAndLoss42C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Holding P/L Scatter Visual</h4>
          <p className="text-xs text-zinc-400">Return % vs Dollar Value comparison</p>
        </div>
        <span className="text-xs font-mono text-indigo-400">Position Sized</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MOCK_HOLDINGS.slice(0, 5).map(h => {
          const isGain = h.unrealizedGain >= 0;
          return (
            <div key={h.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
              <span className="font-mono font-bold text-xs text-zinc-200">{h.ticker}</span>
              <div className={`text-base font-bold font-mono mt-1 ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isGain ? '+' : ''}${Math.round(h.unrealizedGain).toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-zinc-500">
                {isGain ? '+' : ''}{h.unrealizedGainPct.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 48: Scenario comparison (48.a, 48.b, 48.c)
// ==========================================

export const ScenarioComparison48A: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-mono uppercase text-indigo-400">Stress Testing & Projections</span>
          <h4 className="text-base font-bold text-zinc-100">Side-by-Side 10-Year Economic Scenarios</h4>
        </div>
        <div className="text-xs font-mono text-zinc-400">Starting Base: $842,690</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cautious */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">1. Cautious (Stagflation)</span>
            <span className="text-xs font-mono text-zinc-500">4.0% CAGR</span>
          </div>
          <div className="my-4">
            <div className="text-xs text-zinc-400">10-Year Portfolio Value</div>
            <div className="text-2xl font-bold font-mono text-zinc-100 mt-1">$1,247,000</div>
            <div className="text-[11px] text-zinc-500 font-mono">Purchasing power adjusted</div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
            Persistent 4% inflation, sluggish tech growth, high bond yields. Fixed Income buffers losses.
          </p>
        </div>

        {/* Expected */}
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 shadow-lg shadow-indigo-950/30">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-900/60">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">2. Base Case (Historical)</span>
            <span className="text-xs font-mono text-indigo-400 font-bold">7.5% CAGR</span>
          </div>
          <div className="my-4">
            <div className="text-xs text-zinc-400">10-Year Portfolio Value</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">$1,736,000</div>
            <div className="text-[11px] text-emerald-400 font-mono">+$893,310 compound profit</div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed border-t border-indigo-900/40 pt-3">
            Moderate global expansion, corporate earnings grow at historical 7-8% rates with ongoing DCA.
          </p>
        </div>

        {/* Optimistic */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">3. Optimistic (AI Boom)</span>
            <span className="text-xs font-mono text-zinc-500">11.2% CAGR</span>
          </div>
          <div className="my-4">
            <div className="text-xs text-zinc-400">10-Year Portfolio Value</div>
            <div className="text-2xl font-bold font-mono text-zinc-100 mt-1">$2,435,000</div>
            <div className="text-[11px] text-emerald-400 font-mono">Near triple current net worth</div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
            Exponential AI productivity cycle lifts margins. Tech core (NVDA, MSFT, VOO) surges ahead.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ScenarioComparison48B: React.FC = () => {
  const [rateShift, setRateShift] = useState(0);

  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Macro Interest Rate Shift Simulator</h4>
          <p className="text-xs text-zinc-400">Simulate Fed rate moves on bond durations and tech valuations</p>
        </div>
        <span className="text-xs font-mono text-zinc-300 bg-zinc-950 px-3 py-1 rounded border border-zinc-800">
          Fed Funds Shift: {rateShift > 0 ? '+' : ''}{rateShift} bps
        </span>
      </div>

      <div className="mb-6">
        <input
          type="range"
          min="-200"
          max="200"
          step="50"
          value={rateShift}
          onChange={(e) => setRateShift(Number(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
          <span>-200 bps (Dovish Cuts)</span>
          <span>0 bps (Current)</span>
          <span>+200 bps (Hawkish Hikes)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 font-sans">TLT Bond Value Shift</div>
          <div className={`text-base font-bold mt-1 ${rateShift < 0 ? 'text-emerald-400' : rateShift > 0 ? 'text-rose-400' : 'text-zinc-200'}`}>
            {rateShift < 0 ? `+${Math.abs(rateShift * 0.17).toFixed(1)}%` : rateShift > 0 ? `-${(rateShift * 0.17).toFixed(1)}%` : '0.0%'}
          </div>
          <div className="text-[10px] text-zinc-500 font-sans">Duration: 17.2 yrs</div>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 font-sans">Equities Multiple Impact</div>
          <div className={`text-base font-bold mt-1 ${rateShift < 0 ? 'text-emerald-400' : rateShift > 0 ? 'text-rose-400' : 'text-zinc-200'}`}>
            {rateShift < 0 ? `+${Math.abs(rateShift * 0.04).toFixed(1)}%` : rateShift > 0 ? `-${(rateShift * 0.04).toFixed(1)}%` : '0.0%'}
          </div>
          <div className="text-[10px] text-zinc-500 font-sans">Discount rate adjustment</div>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 font-sans">Cash APY Yield</div>
          <div className="text-base font-bold text-indigo-400 mt-1 font-mono">
            {(4.85 + (rateShift / 100)).toFixed(2)}% APY
          </div>
          <div className="text-[10px] text-zinc-500 font-sans">Treasury sweep yield</div>
        </div>
      </div>
    </div>
  );
};

export const ScenarioComparison48C: React.FC = () => {
  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Global Shock Vulnerability Matrix</h4>
          <p className="text-xs text-zinc-400">Estimated book response to historic exogenous shocks</p>
        </div>
        <span className="text-xs font-mono text-zinc-400">Stress Engine v4.2</span>
      </div>

      <div className="space-y-2.5">
        {[
          { scenario: 'Equities Crash -20% (Tech Correction)', portImpact: '-14.8%', delta: '-$124,700', buffer: 'Bonds & Cash preserve $28k' },
          { scenario: 'Oil Shock +50% & Inflation Spike', portImpact: '-6.2%', delta: '-$52,240', buffer: 'Energy & BTC hedge partially' },
          { scenario: 'US Dollar Devaluation -10%', portImpact: '+3.4%', delta: '+$28,650', buffer: 'ASML & VWCE EUR denominated gains' },
        ].map(s => (
          <div key={s.scenario} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-zinc-200">{s.scenario}</div>
              <div className="text-[11px] text-zinc-500">{s.buffer}</div>
            </div>
            <div className="text-right font-mono">
              <div className={`font-bold ${s.portImpact.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {s.portImpact} ({s.delta})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
