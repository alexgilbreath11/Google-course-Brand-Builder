import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Camera, 
  Upload, 
  Check, 
  RefreshCw, 
  Info,
  Sliders,
  Palette,
  Eye,
  AlertCircle
} from 'lucide-react';
import { ProductSpec } from '../types';

interface ProductFormProps {
  product: ProductSpec;
  onChange: (updated: Partial<ProductSpec>) => void;
  onGenerateMasterAnchor: () => void;
  isGeneratingAnchor: boolean;
  onUploadAnchorImage: (base64: string) => void;
  onClearAnchorImage: () => void;
  onEnhanceWithAI: (description: string) => Promise<void>;
  isEnhancing: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onChange,
  onGenerateMasterAnchor,
  isGeneratingAnchor,
  onUploadAnchorImage,
  onClearAnchorImage,
  onEnhanceWithAI,
  isEnhancing,
}) => {
  const [newColor, setNewColor] = useState('#F59E0B');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddColor = () => {
    if (newColor && !product.colorPalette.includes(newColor)) {
      onChange({ colorPalette: [...product.colorPalette, newColor] });
    }
  };

  const handleRemoveColor = (index: number) => {
    const updated = [...product.colorPalette];
    updated.splice(index, 1);
    onChange({ colorPalette: updated });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onUploadAnchorImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Product & Brand Blueprint</h2>
            <p className="text-xs text-neutral-400">Define visual traits to keep consistent across all advertising mediums</p>
          </div>
        </div>

        {/* AI Polish Button */}
        <button
          id="enhance-brand-btn"
          type="button"
          onClick={() => onEnhanceWithAI(product.description || product.name)}
          disabled={isEnhancing || (!product.description && !product.name)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25 hover:bg-amber-500/20 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
          title="Use Gemini to enrich raw ideas into specific industrial design attributes"
        >
          {isEnhancing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          ) : (
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{isEnhancing ? 'Polishing Brand...' : 'AI Brand Polish'}</span>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Product Name
            </label>
            <input
              id="product-name-input"
              type="text"
              value={product.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. AURA Botanical Infusion"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Category
            </label>
            <input
              id="product-category-input"
              type="text"
              value={product.category}
              onChange={(e) => onChange({ category: e.target.value })}
              placeholder="e.g. Luxury Skincare / Craft Beverage"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>
        </div>

        {/* Physical Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Physical Product Geometry & Packaging
            </label>
            <span className="text-[11px] text-neutral-500">Shape, bottle/can, label, cap</span>
          </div>
          <textarea
            id="product-description-input"
            rows={3}
            value={product.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe the exact physical silhouette, packaging, labels, textures, and distinguishing traits..."
            className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all resize-y"
          />
        </div>

        {/* Color Palette & Materials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Colors */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Brand Color Palette</span>
              <span className="text-[11px] text-neutral-500">{product.colorPalette.length} colors</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800 min-h-[42px]">
              {product.colorPalette.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-700/60 text-xs"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-[11px] text-neutral-300">{color}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="text-neutral-500 hover:text-red-400 ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-1 ml-auto">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-2 py-1 text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Materials & Tactile Finishes
            </label>
            <input
              id="product-materials-input"
              type="text"
              value={product.materials}
              onChange={(e) => onChange({ materials: e.target.value })}
              placeholder="e.g. Fluted amber glass, brushed titanium, matte aluminum"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>
        </div>

        {/* Vibe & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Brand Vibe / Aesthetic Tone
            </label>
            <input
              id="product-vibe-input"
              type="text"
              value={product.vibe}
              onChange={(e) => onChange({ vibe: e.target.value })}
              placeholder="e.g. Minimalist European luxury, hyper-crisp Scandinavian"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Tagline (Optional)
            </label>
            <input
              id="product-tagline-input"
              type="text"
              value={product.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              placeholder="e.g. Cellular radiance bottled in amber crystal"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Visual Consistency Anchor Section */}
      <div className="mt-4 pt-4 border-t border-neutral-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
          <div className="flex items-start gap-3">
            {product.anchorImageBase64 ? (
              <div className="relative group shrink-0">
                <img
                  src={product.anchorImageBase64}
                  alt="Product Anchor Reference"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-lg border-2 border-emerald-500/70 shadow-md"
                />
                <button
                  type="button"
                  onClick={onClearAnchorImage}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-red-400 rounded-full text-xs flex items-center justify-center cursor-pointer shadow-md"
                  title="Remove anchor image"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-neutral-500 shrink-0">
                <Camera className="w-5 h-5 mb-0.5 text-neutral-400" />
                <span className="text-[9px] uppercase tracking-wider font-mono">Anchor</span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-semibold text-white">Visual Consistency Anchor</h3>
                {product.anchorImageBase64 ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Check className="w-3 h-3" /> Locked In
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-400">
                    Optional
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 max-w-md">
                {product.anchorImageBase64
                  ? 'Active reference image passed into Nano-Banana to anchor exact bottle geometry, color shades, and logo placement across each shot.'
                  : 'Generate a pristine master studio hero shot or upload your own reference image to guarantee pixel-matched product consistency across billboard, newspaper, and social shots.'}
              </p>
            </div>
          </div>

          {/* Anchor Actions */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              id="upload-anchor-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/60 inline-flex items-center gap-1.5 cursor-pointer transition-all"
              title="Upload reference photo"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              id="generate-anchor-btn"
              type="button"
              onClick={onGenerateMasterAnchor}
              disabled={isGeneratingAnchor || !product.name}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-sm shadow-amber-500/20 inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-40"
              title="Generate a clean master studio shot using Nano-Banana"
            >
              {isGeneratingAnchor ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Anchor...</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span>{product.anchorImageBase64 ? 'Re-roll Master Shot' : 'Generate Master Shot'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
