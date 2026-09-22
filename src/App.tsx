import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductForm } from './components/ProductForm';
import { MediumCard } from './components/MediumCard';
import { LightboxModal } from './components/LightboxModal';
import { ConsistencyBar } from './components/ConsistencyBar';
import { SUPPORTED_MEDIUMS, PRESET_PRODUCTS } from './data/constants';
import { GeneratedShot, MediumDefinition, MediumId, PresetProduct, ProductSpec } from './types';
import { AlertCircle, CheckCircle, Info, Sparkles } from 'lucide-react';

export default function App() {
  // Initial product specification defaulted to the first rich preset
  const [product, setProduct] = useState<ProductSpec>(() => {
    const preset = PRESET_PRODUCTS[0];
    return {
      name: preset.name,
      category: preset.category,
      tagline: preset.tagline,
      description: preset.description,
      materials: preset.materials,
      colorPalette: [...preset.colorPalette],
      visualIdentity: preset.visualIdentity,
      vibe: preset.vibe,
    };
  });

  const [activePresetId, setActivePresetId] = useState<string>(PRESET_PRODUCTS[0].id);
  const [shots, setShots] = useState<Record<MediumId, GeneratedShot>>({} as Record<MediumId, GeneratedShot>);
  const [generatingStates, setGeneratingStates] = useState<Record<string, boolean>>({});
  const [isEnhancingBrand, setIsEnhancingBrand] = useState(false);
  const [selectedMediumForLightbox, setSelectedMediumForLightbox] = useState<MediumId | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('core');
  const [notification, setNotification] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  const isGeneratingAny = Object.values(generatingStates).some(Boolean);

  const showNotification = (type: 'error' | 'success' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 7000);
  };

  const handleProductChange = (updated: Partial<ProductSpec>) => {
    setProduct((prev) => ({ ...prev, ...updated }));
    setActivePresetId(''); // custom edits
  };

  const handleSelectPreset = (preset: PresetProduct) => {
    setProduct({
      name: preset.name,
      category: preset.category,
      tagline: preset.tagline,
      description: preset.description,
      materials: preset.materials,
      colorPalette: [...preset.colorPalette],
      visualIdentity: preset.visualIdentity,
      vibe: preset.vibe,
      anchorImageBase64: undefined, // fresh preset
    });
    setActivePresetId(preset.id);
    showNotification('info', `Loaded preset "${preset.name}". Click 'Imagine Across All Mediums' to render.`);
  };

  // Generate a single medium shot using Nano-Banana
  const handleGenerateShot = async (mediumId: MediumId, customNotes?: string) => {
    const def = SUPPORTED_MEDIUMS.find((m) => m.id === mediumId);
    if (!def) return;

    setGeneratingStates((prev) => ({ ...prev, [mediumId]: true }));
    setShots((prev) => ({
      ...prev,
      [mediumId]: {
        id: mediumId,
        mediumId,
        imageUrl: prev[mediumId]?.imageUrl || null,
        aspectRatio: def.aspectRatio,
        prompt: '',
        createdAt: Date.now(),
        status: 'generating',
      },
    }));

    try {
      const response = await fetch('/api/generate-shot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          mediumId,
          aspectRatio: def.aspectRatio,
          anchorImageBase64: product.anchorImageBase64,
          customNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate shot');
      }

      setShots((prev) => ({
        ...prev,
        [mediumId]: {
          id: mediumId,
          mediumId,
          imageUrl: data.imageUrl,
          aspectRatio: def.aspectRatio,
          prompt: data.prompt,
          createdAt: Date.now(),
          status: 'success',
          generationDurationMs: data.durationMs,
          fallbackUsed: data.fallbackUsed,
          modelUsed: data.modelUsed,
          notice: data.notice,
        },
      }));

      if (data.fallbackUsed) {
        showNotification('success', `Rendered ${def.name} successfully (Studio Visual Engine).`);
      } else {
        showNotification('success', `Rendered ${def.name} successfully with Nano-Banana.`);
      }
    } catch (error: any) {
      console.error(`Error generating ${mediumId}:`, error);
      setShots((prev) => ({
        ...prev,
        [mediumId]: {
          id: mediumId,
          mediumId,
          imageUrl: prev[mediumId]?.imageUrl || null,
          aspectRatio: def.aspectRatio,
          prompt: '',
          createdAt: Date.now(),
          status: 'error',
          errorMessage: error.message,
        },
      }));
      showNotification('error', error.message || `Failed to render ${def.name}`);
    } finally {
      setGeneratingStates((prev) => ({ ...prev, [mediumId]: false }));
    }
  };

  // Generate Master Studio Anchor shot
  const handleGenerateMasterAnchor = async () => {
    setGeneratingStates((prev) => ({ ...prev, master_studio: true }));
    try {
      const response = await fetch('/api/generate-shot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          mediumId: 'master_studio',
          aspectRatio: '1:1',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate master studio shot');
      }

      setProduct((prev) => ({
        ...prev,
        anchorImageBase64: data.imageUrl,
      }));

      showNotification('success', 'Master Studio Anchor created! All subsequent shots will reference this product geometry.');
    } catch (error: any) {
      console.error('Error generating master anchor:', error);
      showNotification('error', error.message || 'Failed to generate master studio anchor');
    } finally {
      setGeneratingStates((prev) => ({ ...prev, master_studio: false }));
    }
  };

  // Generate All mediums in batch
  const handleGenerateAll = async () => {
    const targetMediums: MediumId[] = ['billboard', 'newspaper', 'social_post'];
    if (selectedFilter === 'all') {
      targetMediums.push('transit_shelter', 'magazine_spread', 'storefront_window');
    }

    showNotification('info', `Starting batch generation for ${targetMediums.length} mediums with Nano-Banana...`);

    // Process them sequentially to ensure reliable generation without quota throttling
    for (const medId of targetMediums) {
      await handleGenerateShot(medId);
    }
  };

  // Enhance product brand spec with Gemini 3.8 Flash
  const handleEnhanceWithAI = async (rawInput: string) => {
    setIsEnhancingBrand(true);
    try {
      const response = await fetch('/api/enhance-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawDescription: rawInput,
          currentName: product.name,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to polish brand details');
      }

      const p = data.product;
      setProduct((prev) => ({
        ...prev,
        name: p.name || prev.name,
        category: p.category || prev.category,
        tagline: p.tagline || prev.tagline,
        description: p.description || prev.description,
        materials: p.materials || prev.materials,
        colorPalette: Array.isArray(p.colorPalette) && p.colorPalette.length > 0 ? p.colorPalette : prev.colorPalette,
        visualIdentity: p.visualIdentity || prev.visualIdentity,
        vibe: p.vibe || prev.vibe,
      }));

      showNotification('success', `Brand Blueprint enhanced: ${p.name}`);
    } catch (error: any) {
      console.error('Error polishing brand:', error);
      showNotification('error', error.message || 'Failed to polish brand');
    } finally {
      setIsEnhancingBrand(false);
    }
  };

  // Filtered mediums
  const filteredMediums = SUPPORTED_MEDIUMS.filter((m) => {
    if (selectedFilter === 'core') {
      return ['billboard', 'newspaper', 'social_post'].includes(m.id);
    }
    if (selectedFilter === 'ooh') {
      return m.category === 'Out of Home';
    }
    if (selectedFilter === 'print') {
      return m.category === 'Print';
    }
    return true;
  });

  const completedCount = SUPPORTED_MEDIUMS.filter((m) => shots[m.id]?.imageUrl).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation & App Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
        isGeneratingAny={isGeneratingAny}
      />

      {/* Global Notification Banner */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
          <div
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2 duration-200 ${
              notification.type === 'error'
                ? 'bg-rose-950/80 border-rose-800 text-rose-200'
                : notification.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                : 'bg-neutral-900 border-neutral-700 text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-neutral-400 hover:text-white cursor-pointer px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Product Blueprint Section */}
        <ProductForm
          product={product}
          onChange={handleProductChange}
          onGenerateMasterAnchor={handleGenerateMasterAnchor}
          isGeneratingAnchor={Boolean(generatingStates.master_studio)}
          onUploadAnchorImage={(base64) => {
            setProduct((prev) => ({ ...prev, anchorImageBase64: base64 }));
            showNotification('success', 'Custom anchor reference uploaded.');
          }}
          onClearAnchorImage={() => {
            setProduct((prev) => ({ ...prev, anchorImageBase64: undefined }));
            showNotification('info', 'Anchor reference cleared.');
          }}
          onEnhanceWithAI={handleEnhanceWithAI}
          isEnhancing={isEnhancingBrand}
        />

        {/* Consistency Bar & Batch Controls */}
        <ConsistencyBar
          onGenerateAll={handleGenerateAll}
          isGeneratingAny={isGeneratingAny}
          totalMediums={SUPPORTED_MEDIUMS.length}
          completedMediums={completedCount}
          hasAnchorImage={Boolean(product.anchorImageBase64)}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          onOpenCompare={() => {
            const firstWithImage = SUPPORTED_MEDIUMS.find((m) => shots[m.id]?.imageUrl)?.id || 'billboard';
            setSelectedMediumForLightbox(firstWithImage);
          }}
        />

        {/* Medium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMediums.map((mediumDef) => (
            <MediumCard
              key={mediumDef.id}
              definition={mediumDef}
              shot={shots[mediumDef.id]}
              onGenerate={handleGenerateShot}
              onOpenLightbox={(id) => setSelectedMediumForLightbox(id)}
              isGenerating={Boolean(generatingStates[mediumDef.id])}
              hasAnchorImage={Boolean(product.anchorImageBase64)}
            />
          ))}
        </div>
      </main>

      {/* Lightbox / Comparison Modal */}
      {selectedMediumForLightbox && (
        <LightboxModal
          selectedMediumId={selectedMediumForLightbox}
          shots={shots}
          masterAnchorImage={product.anchorImageBase64}
          onClose={() => setSelectedMediumForLightbox(null)}
          onSelectMedium={(id) => setSelectedMediumForLightbox(id)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 mt-12 text-center text-xs text-neutral-500">
        <p className="max-w-md mx-auto">
          Brand Builder &bull; Powered by Nano-Banana (<code className="text-amber-400/80 font-mono">gemini-3.1-flash-lite-image</code>) &bull; Zero-Human Mandate Enforced
        </p>
      </footer>
    </div>
  );
}
