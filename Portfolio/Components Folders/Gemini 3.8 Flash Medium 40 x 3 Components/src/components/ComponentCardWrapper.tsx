import React, { useState } from 'react';
import { Layers, Link, Check } from 'lucide-react';

interface ComponentCardWrapperProps {
  id: number;
  title: string;
  tier: 'HUGE' | 'BIG' | 'MEDIUM' | 'SMALL' | 'TINY';
  description: string;
  designA: React.ReactNode;
  designB: React.ReactNode;
  designC: React.ReactNode;
  designTitles?: {
    a?: string;
    b?: string;
    c?: string;
  };
}

export const ComponentCardWrapper: React.FC<ComponentCardWrapperProps> = ({
  id,
  title,
  tier,
  description,
  designA,
  designB,
  designC,
  designTitles = {
    a: "Variation A — Precision & Structure",
    b: "Variation B — Visual & Fluid",
    c: "Variation C — Editorial & Contextual",
  },
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'a' | 'b' | 'c'>('all');
  const [isCopied, setIsCopied] = useState(false);

  const getTierColor = (t: string) => {
    switch (t) {
      case 'HUGE':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/60';
      case 'BIG':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/60';
      case 'MEDIUM':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
      case 'SMALL':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      case 'TINY':
        return 'bg-rose-950/80 text-rose-300 border-rose-700/60';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const copyAnchor = () => {
    const url = `${window.location.origin}${window.location.pathname}#comp-${id}`;
    navigator.clipboard?.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section 
      id={`comp-${id}`} 
      className="scroll-mt-24 mb-16 rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 md:p-8 shadow-2xl backdrop-blur-sm transition-all"
    >
      {/* Component Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-800/80 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <button
              onClick={copyAnchor}
              className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold border border-zinc-700 flex items-center gap-1.5 transition-colors"
              title="Copy link to component"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Link className="w-3 h-3 text-zinc-400" />}
              #{id}
            </button>
            <span className={`text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${getTierColor(tier)}`}>
              {tier} COMPONENT
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Show all 3 variations stacked"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All 3</span>
          </button>
          <button
            onClick={() => setActiveTab('a')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'a'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="font-mono font-bold">{id}.a</span>
          </button>
          <button
            onClick={() => setActiveTab('b')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'b'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="font-mono font-bold">{id}.b</span>
          </button>
          <button
            onClick={() => setActiveTab('c')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'c'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="font-mono font-bold">{id}.c</span>
          </button>
        </div>
      </div>

      {/* Render Active Designs */}
      <div className="mt-6 space-y-8">
        {(activeTab === 'all' || activeTab === 'a') && (
          <div className="group rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-5 md:p-6 transition-all hover:border-zinc-700">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono text-xs font-bold tracking-wide">
                  {id}.a
                </span>
                <span className="text-xs md:text-sm font-medium text-zinc-300">
                  {designTitles.a || `Design ${id}.a`}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Design 1 of 3</span>
            </div>
            <div className="w-full overflow-x-auto">
              {designA}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'b') && (
          <div className="group rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-5 md:p-6 transition-all hover:border-zinc-700">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold tracking-wide">
                  {id}.b
                </span>
                <span className="text-xs md:text-sm font-medium text-zinc-300">
                  {designTitles.b || `Design ${id}.b`}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Design 2 of 3</span>
            </div>
            <div className="w-full overflow-x-auto">
              {designB}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'c') && (
          <div className="group rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-5 md:p-6 transition-all hover:border-zinc-700">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold tracking-wide">
                  {id}.c
                </span>
                <span className="text-xs md:text-sm font-medium text-zinc-300">
                  {designTitles.c || `Design ${id}.c`}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Design 3 of 3</span>
            </div>
            <div className="w-full overflow-x-auto">
              {designC}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
