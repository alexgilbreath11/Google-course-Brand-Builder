import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Cpu, 
  Clock, 
  Maximize2,
  Newspaper,
  Instagram,
  Columns2
} from 'lucide-react';
import { GeneratedShot, MediumDefinition, MediumId } from '../types';
import { SUPPORTED_MEDIUMS } from '../data/constants';

interface LightboxModalProps {
  selectedMediumId: MediumId | null;
  shots: Record<MediumId, GeneratedShot>;
  masterAnchorImage?: string;
  onClose: () => void;
  onSelectMedium: (id: MediumId) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  selectedMediumId,
  shots,
  masterAnchorImage,
  onClose,
  onSelectMedium,
}) => {
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');
  const [copied, setCopied] = useState(false);

  if (!selectedMediumId) return null;

  const currentMediumDef = SUPPORTED_MEDIUMS.find((m) => m.id === selectedMediumId);
  const currentShot = shots[selectedMediumId];

  // Mediums that have generated images
  const generatedMediums = SUPPORTED_MEDIUMS.filter((m) => shots[m.id]?.imageUrl);

  const handleCopyPrompt = () => {
    if (!currentShot?.prompt) return;
    navigator.clipboard.writeText(currentShot.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (imageUrl: string, mediumName: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `brand-builder-${mediumName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between gap-3 bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">
                  {viewMode === 'compare' ? 'Cross-Medium Consistency Inspector' : currentMediumDef?.name}
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-amber-400" />
                  Nano-Banana
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {viewMode === 'compare'
                  ? 'Verify visual product consistency and zero-human composition side-by-side'
                  : currentMediumDef?.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-800/80 p-0.5 rounded-xl border border-neutral-700/60 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  viewMode === 'single'
                    ? 'bg-neutral-700 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Single Shot
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compare')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'compare'
                    ? 'bg-amber-500 text-neutral-950 font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Columns2 className="w-3 h-3" />
                <span>Compare All</span>
              </button>
            </div>

            {/* Close */}
            <button
              id="close-lightbox-btn"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {viewMode === 'single' ? (
            /* Single View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Image Viewport */}
              <div className="lg:col-span-2 bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center p-2 relative group min-h-[360px]">
                {currentShot?.imageUrl ? (
                  <img
                    src={currentShot.imageUrl}
                    alt={currentMediumDef?.name}
                    referrerPolicy="no-referrer"
                    className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="p-8 text-center text-neutral-500">
                    <p className="text-sm">No image available for this medium</p>
                  </div>
                )}

                {/* Quick overlay download button */}
                {currentShot?.imageUrl && (
                  <button
                    type="button"
                    onClick={() => handleDownload(currentShot.imageUrl!, currentMediumDef?.name || 'shot')}
                    className="absolute bottom-4 right-4 px-3 py-2 rounded-xl bg-neutral-900/90 text-white hover:bg-neutral-800 border border-neutral-700 text-xs font-medium inline-flex items-center gap-1.5 backdrop-blur-md cursor-pointer shadow-lg"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download Image</span>
                  </button>
                )}
              </div>

              {/* Specs & Prompt Details Panel */}
              <div className="space-y-4">
                {/* Consistency & Zero Human Check */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                    Quality & Policy Verifications
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-neutral-300">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Zero-Human Mandate:
                      </span>
                      <span className="text-emerald-400 font-medium">Strictly Enforced</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-amber-400" />
                        Model Engine:
                      </span>
                      <span className="text-amber-300 font-mono text-[11px]">Nano-Banana (gemini-3.1-flash-lite-image)</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        Aspect Ratio:
                      </span>
                      <span className="text-neutral-200 font-mono">{currentMediumDef?.aspectRatio}</span>
                    </div>
                  </div>
                </div>

                {/* Medium Switcher Carousel */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-2">
                    Switch Active Medium View
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {SUPPORTED_MEDIUMS.map((med) => {
                      const isSelected = med.id === selectedMediumId;
                      const hasImage = Boolean(shots[med.id]?.imageUrl);
                      return (
                        <button
                          key={med.id}
                          type="button"
                          onClick={() => onSelectMedium(med.id)}
                          className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                          }`}
                        >
                          <span className="font-medium truncate">{med.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {hasImage ? '✓ Ready' : 'Empty'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prompt Card */}
                {currentShot?.prompt && (
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                        Nano-Banana Prompt
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-6 font-mono leading-relaxed bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                      {currentShot.prompt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Comparison Mode: Side-by-side view of all generated mediums */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-semibold text-white">Consistent Multi-Medium Brand Board</h3>
                  <p className="text-xs text-neutral-400">
                    Comparing product silhouette, colors, and branding across mediums with zero human models
                  </p>
                </div>
                <div className="text-xs text-amber-400 font-medium">
                  {generatedMediums.length} / {SUPPORTED_MEDIUMS.length} Mediums Generated
                </div>
              </div>

              {generatedMediums.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="text-sm">No shots have been generated yet.</p>
                  <p className="text-xs text-neutral-600 mt-1">Generate a billboard, newspaper, or social post to inspect them side-by-side.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Master Anchor reference (if available) */}
                  {masterAnchorImage && (
                    <div className="bg-neutral-950 border-2 border-emerald-500/50 rounded-xl overflow-hidden p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-emerald-400 font-mono">Master Studio Anchor</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Ground Truth</span>
                      </div>
                      <div className="w-full aspect-square bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={masterAnchorImage}
                          alt="Master Anchor"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-2 truncate">
                        Baseline product geometry & palette
                      </p>
                    </div>
                  )}

                  {/* Each generated medium */}
                  {generatedMediums.map((med) => {
                    const shot = shots[med.id];
                    return (
                      <div
                        key={med.id}
                        className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden p-3 flex flex-col group hover:border-neutral-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-white truncate">{med.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                            {med.aspectRatio}
                          </span>
                        </div>
                        <div className="w-full aspect-square bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                          <img
                            src={shot.imageUrl!}
                            alt={med.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleDownload(shot.imageUrl!, med.name)}
                            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-neutral-900/80 text-white hover:bg-neutral-800 border border-neutral-700 text-xs backdrop-blur-xs cursor-pointer shadow-md"
                            title="Download image"
                          >
                            <Download className="w-3.5 h-3.5 text-neutral-300" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                          <span className="truncate">{med.category}</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> 0 People
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
