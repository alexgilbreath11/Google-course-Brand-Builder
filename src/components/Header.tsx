import React from 'react';
import { Sparkles, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { PRESET_PRODUCTS } from '../data/constants';
import { PresetProduct, ProductSpec } from '../types';

interface HeaderProps {
  onSelectPreset: (preset: PresetProduct) => void;
  activePresetId?: string;
  isGeneratingAny: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  activePresetId,
  isGeneratingAny,
}) => {
  return (
    <header className="border-b border-neutral-800/80 bg-neutral-900/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 font-bold">
            <Layers className="w-5 h-5 text-neutral-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                Brand Builder
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20">
                <Cpu className="w-3 h-3 text-amber-400" />
                Nano-Banana
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Cross-medium product visualization with consistent brand identity
            </p>
          </div>
        </div>

        {/* Badges & Quick Presets */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Strict Zero People Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-People Mandate Active</span>
          </div>

          {/* Quick Presets Dropdown/Pills */}
          <div className="flex items-center gap-1.5 bg-neutral-800/70 p-1 rounded-xl border border-neutral-700/60 text-xs">
            <span className="text-neutral-400 px-2 py-1 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Presets:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-none scrollbar-none">
              {PRESET_PRODUCTS.map((preset) => {
                const isActive = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`preset-btn-${preset.id}`}
                    onClick={() => onSelectPreset(preset)}
                    disabled={isGeneratingAny}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all text-xs whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-neutral-950 shadow-sm'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-700/60'
                    } disabled:opacity-50`}
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
