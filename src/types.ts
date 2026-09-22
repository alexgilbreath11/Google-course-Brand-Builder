export type MediumId = 
  | 'billboard'
  | 'newspaper'
  | 'social_post'
  | 'transit_shelter'
  | 'magazine_spread'
  | 'storefront_window';

export interface MediumDefinition {
  id: MediumId;
  name: string;
  tagline: string;
  category: 'Out of Home' | 'Print' | 'Digital' | 'Retail';
  aspectRatio: '16:9' | '3:4' | '1:1' | '4:3' | '9:16';
  icon: string;
  recommendedVibe: string;
  description: string;
}

export interface ProductSpec {
  name: string;
  category: string;
  tagline: string;
  description: string;
  materials: string;
  colorPalette: string[];
  visualIdentity: string;
  vibe: string;
  anchorImageBase64?: string; // Master reference studio shot or uploaded asset
}

export interface GeneratedShot {
  id: string;
  mediumId: MediumId;
  imageUrl: string | null;
  aspectRatio: '16:9' | '3:4' | '1:1' | '4:3' | '9:16';
  prompt: string;
  createdAt: number;
  status: 'idle' | 'generating' | 'success' | 'error';
  errorMessage?: string;
  generationDurationMs?: number;
  fallbackUsed?: boolean;
  modelUsed?: string;
  notice?: string;
}

export interface BrandCampaignState {
  product: ProductSpec;
  shots: Record<MediumId, GeneratedShot>;
  masterAnchorShot: {
    imageUrl: string | null;
    status: 'idle' | 'generating' | 'success' | 'error';
    errorMessage?: string;
  };
  selectedMediumId: MediumId;
}

export interface PresetProduct {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  materials: string;
  colorPalette: string[];
  visualIdentity: string;
  vibe: string;
}
