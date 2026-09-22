import React from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Eye,
  Sliders,
  Columns2
} from 'lucide-react';
import { MediumDefinition } from '../types';

interface ConsistencyBarProps {
  onGenerateAll: () => void;
  isGeneratingAny: boolean;
  totalMediums: number;
  completedMediums: number;
  hasAnchorImage: boolean;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenCompare: () => void;
}

export const ConsistencyBar: React.FC<ConsistencyBarProps> = ({
  onGenerateAll,
  isGeneratingAny,
  totalMediums,
  completedMediums,
  hasAnchorImage,
  selectedFilter,
  onFilterChange,
  onOpenCompare,
}) => {
  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left: Summary & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Campaign Mediums</h3>
            <p className="text-xs text-neutral-400">
              {completedMediums} of {totalMediums} visualized with Nano-Banana
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          {[
            { id: 'all', label: 'All Mediums' },
            { id: 'core', label: 'Core (Billboard, Paper, Social)' },
            { id: 'ooh', label: 'Out of Home' },
            { id: 'print', label: 'Print' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === f.id
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {completedMediums > 0 && (
          <button
            type="button"
            onClick={onOpenCompare}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700/80 text-neutral-200 border border-neutral-700/60 inline-flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Columns2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Compare Shots</span>
          </button>
        )}

        <button
          id="generate-all-mediums-btn"
          type="button"
          onClick={onGenerateAll}
          disabled={isGeneratingAny}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isGeneratingAny ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Generating Campaign...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{completedMediums > 0 ? 'Batch Re-roll Campaign' : 'Imagine Across All Mediums'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
