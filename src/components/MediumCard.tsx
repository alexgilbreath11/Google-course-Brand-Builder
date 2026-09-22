import React, { useState } from 'react';
import { 
  Maximize2, 
  Newspaper, 
  Instagram, 
  Bus, 
  BookOpen, 
  Store, 
  RefreshCw, 
  Download, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  SlidersHorizontal,
  Copy,
  Check
} from 'lucide-react';
import { GeneratedShot, MediumDefinition } from '../types';

interface MediumCardProps {
  definition: MediumDefinition;
  shot?: GeneratedShot;
  onGenerate: (mediumId: MediumDefinition['id'], customNotes?: string) => void;
  onOpenLightbox: (mediumId: MediumDefinition['id']) => void;
  isGenerating: boolean;
  hasAnchorImage: boolean;
}

export const MediumCard: React.FC<MediumCardProps> = ({
  definition,
  shot,
  onGenerate,
  onOpenLightbox,
  isGenerating,
  hasAnchorImage,
}) => {
  const [customNotes, setCustomNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [copied, setCopied] = useState(false);

  // Render appropriate icon
  const renderIcon = () => {
    switch (definition.id) {
      case 'billboard':
        return <Maximize2 className="w-4 h-4 text-amber-400" />;
      case 'newspaper':
        return <Newspaper className="w-4 h-4 text-sky-400" />;
      case 'social_post':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'transit_shelter':
        return <Bus className="w-4 h-4 text-emerald-400" />;
      case 'magazine_spread':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'storefront_window':
        return <Store className="w-4 h-4 text-orange-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  // Aspect ratio class mapping for container
  const getAspectClass = () => {
    switch (definition.aspectRatio) {
      case '16:9':
        return 'aspect-video';
      case '3:4':
        return 'aspect-[3/4]';
      case '1:1':
        return 'aspect-square';
      case '4:3':
        return 'aspect-[4/3]';
      default:
        return 'aspect-video';
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shot?.imageUrl) return;
    const a = document.createElement('a');
    a.href = shot.imageUrl;
    a.download = `brand-builder-${definition.id}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shot?.prompt) return;
    navigator.clipboard.writeText(shot.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all hover:border-neutral-700/80 group">
      {/* Card Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between gap-2 bg-neutral-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-800/90 flex items-center justify-center border border-neutral-700/50">
            {renderIcon()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-white tracking-tight">{definition.name}</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/40">
                {definition.aspectRatio}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate max-w-[200px] sm:max-w-xs">{definition.tagline}</p>
          </div>
        </div>

        {/* Medium Status Badges */}
        <div className="flex items-center gap-1.5">
          {shot?.fallbackUsed && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
              title={shot.notice || "Rendered via Studio Vector Synthesis"}
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              Studio Engine
            </span>
          )}
          {hasAnchorImage && (
            <span
              className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              title="Using master anchor shot for consistent product geometry"
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              Anchored
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-400"
            title="Zero-human guarantee enforced"
          >
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
            No People
          </span>
        </div>
      </div>

      {/* Image Preview / Viewport */}
      <div className={`relative w-full bg-neutral-950 flex items-center justify-center overflow-hidden ${getAspectClass()}`}>
        {shot?.imageUrl ? (
          <div 
            onClick={() => onOpenLightbox(definition.id)}
            className="w-full h-full cursor-zoom-in relative group/img overflow-hidden"
          >
            <img
              src={shot.imageUrl}
              alt={`${definition.name} advertisement`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox(definition.id);
                }}
                className="p-2 rounded-xl bg-neutral-900/90 text-white hover:bg-neutral-800 border border-neutral-700 shadow-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Inspect</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-2 rounded-xl bg-neutral-900/90 text-white hover:bg-neutral-800 border border-neutral-700 shadow-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
                title="Download full resolution image"
              >
                <Download className="w-3.5 h-3.5 text-neutral-300" />
              </button>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 w-full h-full bg-gradient-to-b from-neutral-900/40 to-neutral-950">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-ping opacity-60" />
            </div>
            <div className="space-y-1 max-w-[240px]">
              <p className="text-xs font-semibold text-white">Rendering with Nano-Banana</p>
              <p className="text-[11px] text-neutral-400">
                Synthesizing {definition.name.toLowerCase()} mockup with zero humans & matching brand geometry...
              </p>
            </div>
          </div>
        ) : shot?.status === 'error' ? (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-rose-300 max-w-xs">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
            <p className="text-xs font-medium text-rose-200">Rendering Failed</p>
            <p className="text-[11px] text-rose-400/90 line-clamp-3">{shot.errorMessage || 'Unknown error occurred'}</p>
            <button
              type="button"
              onClick={() => onGenerate(definition.id, customNotes)}
              className="mt-2 px-3 py-1 text-xs rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 cursor-pointer"
            >
              Retry Shot
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2.5 text-neutral-500">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
              {renderIcon()}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-neutral-400">Not yet imagined</p>
              <p className="text-[11px] text-neutral-500 max-w-[220px]">
                {definition.recommendedVibe}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Controls & Footer */}
      <div className="p-3.5 space-y-2.5 bg-neutral-900/60 mt-auto border-t border-neutral-800/80">
        {/* Toggle Custom Notes for this medium */}
        {showNotes && (
          <div className="pt-1">
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Add night neon lighting, rain drops on glass..."
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* Options Button */}
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
              showNotes || customNotes
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Custom creative notes for this medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {shot?.prompt && (
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="p-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-neutral-400 hover:text-neutral-200 text-xs cursor-pointer transition-colors"
              title="Copy generation prompt"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Generate / Re-roll Button */}
          <button
            id={`generate-medium-${definition.id}`}
            type="button"
            onClick={() => onGenerate(definition.id, customNotes)}
            disabled={isGenerating}
            className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-sm shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : shot?.imageUrl ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-roll {definition.name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Imagine {definition.name.split(' ')[0]}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
