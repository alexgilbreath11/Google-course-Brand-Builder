export interface MockupOptions {
  product: {
    name: string;
    category: string;
    tagline: string;
    description: string;
    materials: string;
    colorPalette: string[];
    visualIdentity: string;
    vibe: string;
  };
  mediumId: string;
  anchorImageBase64?: string;
  customNotes?: string;
}

export function generateMediumMockupSvg(options: MockupOptions): string {
  const { product, mediumId, anchorImageBase64, customNotes } = options;
  const primaryColor = product.colorPalette[0] || '#D4AF37';
  const secondaryColor = product.colorPalette[1] || '#1C1917';
  const accentColor = product.colorPalette[2] || '#F59E0B';
  const lightColor = product.colorPalette[3] || '#FEF3C7';

  // Helper to escape XML
  const escapeXml = (str: string) =>
    (str || '').replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

  const name = escapeXml(product.name);
  const category = escapeXml(product.category);
  const tagline = escapeXml(product.tagline || 'Engineered for distinction');

  // Internal product graphic (either embedded anchor image or procedural product render)
  const renderProductGraphic = (x: number, y: number, w: number, h: number) => {
    if (anchorImageBase64) {
      return `
        <g filter="url(#drop-shadow)">
          <image href="${anchorImageBase64}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" />
        </g>
      `;
    }

    // Procedural product visual matching category
    const isBeverage = category.toLowerCase().includes('drink') || category.toLowerCase().includes('beverage') || category.toLowerCase().includes('can');
    const isWatch = category.toLowerCase().includes('watch') || category.toLowerCase().includes('chrono') || category.toLowerCase().includes('time');

    if (isBeverage) {
      // Sleek aluminum can
      const cx = x + w / 2;
      const cy = y + h / 2;
      return `
        <g filter="url(#drop-shadow)">
          <!-- Can Shadow -->
          <ellipse cx="${cx}" cy="${y + h * 0.9}" rx="${w * 0.28}" ry="${h * 0.06}" fill="#000000" opacity="0.45" filter="blur(6px)" />
          <!-- Can Body -->
          <defs>
            <linearGradient id="canGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.9" />
              <stop offset="25%" stop-color="${primaryColor}" />
              <stop offset="60%" stop-color="${accentColor}" />
              <stop offset="85%" stop-color="${primaryColor}" />
              <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0.9" />
            </linearGradient>
            <linearGradient id="metalRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#E2E8F0" />
              <stop offset="50%" stop-color="#94A3B8" />
              <stop offset="100%" stop-color="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect x="${cx - w * 0.2}" y="${y + h * 0.16}" width="${w * 0.4}" height="${h * 0.72}" rx="${w * 0.08}" fill="url(#canGrad)" />
          <!-- Top rim -->
          <ellipse cx="${cx}" cy="${y + h * 0.16}" rx="${w * 0.18}" ry="${h * 0.035}" fill="url(#metalRim)" />
          <ellipse cx="${cx}" cy="${y + h * 0.15}" rx="${w * 0.14}" ry="${h * 0.025}" fill="#64748B" />
          <!-- Tab -->
          <rect x="${cx - w * 0.03}" y="${y + h * 0.13}" width="${w * 0.06}" height="${h * 0.03}" rx="2" fill="#CBD5E1" />
          <!-- Label graphic -->
          <rect x="${cx - w * 0.18}" y="${y + h * 0.32}" width="${w * 0.36}" height="${h * 0.38}" rx="4" fill="#000000" opacity="0.3" />
          <text x="${cx}" y="${y + h * 0.45}" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="${w * 0.06}" fill="#FFFFFF" letter-spacing="2">${name}</text>
          <text x="${cx}" y="${y + h * 0.52}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="${w * 0.032}" fill="${lightColor}" opacity="0.9">${category}</text>
          <!-- Specular highlight streak -->
          <rect x="${cx - w * 0.15}" y="${y + h * 0.17}" width="${w * 0.04}" height="${h * 0.7}" fill="#FFFFFF" opacity="0.3" filter="blur(1px)" />
        </g>
      `;
    }

    if (isWatch) {
      // Chronograph watch
      const cx = x + w / 2;
      const cy = y + h / 2;
      return `
        <g filter="url(#drop-shadow)">
          <!-- Shadow -->
          <ellipse cx="${cx}" cy="${y + h * 0.85}" rx="${w * 0.3}" ry="${h * 0.08}" fill="#000000" opacity="0.4" filter="blur(8px)" />
          <!-- Strap -->
          <rect x="${cx - w * 0.12}" y="${y + h * 0.05}" width="${w * 0.24}" height="${h * 0.9}" rx="${w * 0.03}" fill="#1E293B" />
          <!-- Bezel Case -->
          <circle cx="${cx}" cy="${cy}" r="${w * 0.26}" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="${w * 0.02}" />
          <!-- Dial -->
          <circle cx="${cx}" cy="${cy}" r="${w * 0.21}" fill="#0F172A" />
          <!-- Sub dials -->
          <circle cx="${cx - w * 0.08}" cy="${cy}" r="${w * 0.05}" fill="#1E293B" stroke="#475569" stroke-width="1" />
          <circle cx="${cx + w * 0.08}" cy="${cy}" r="${w * 0.05}" fill="#1E293B" stroke="#475569" stroke-width="1" />
          <circle cx="${cx}" cy="${cy + w * 0.08}" r="${w * 0.05}" fill="#1E293B" stroke="#475569" stroke-width="1" />
          <!-- Watch Hands -->
          <line x1="${cx}" y1="${cy}" x2="${cx + w * 0.1}" y2="${cy - w * 0.08}" stroke="#FFFFFF" stroke-width="${w * 0.015}" stroke-linecap="round" />
          <line x1="${cx}" y1="${cy}" x2="${cx - w * 0.06}" y2="${cy - w * 0.12}" stroke="#FFFFFF" stroke-width="${w * 0.02}" stroke-linecap="round" />
          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + w * 0.14}" stroke="${accentColor}" stroke-width="${w * 0.008}" stroke-linecap="round" />
          <!-- Brand text -->
          <text x="${cx}" y="${cy - w * 0.08}" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="${w * 0.035}" fill="#FFFFFF" letter-spacing="1">${name}</text>
        </g>
      `;
    }

    // Default: Luxury fluted glass cosmetic/serum bottle
    const cx = x + w / 2;
    const cy = y + h / 2;
    return `
      <g filter="url(#drop-shadow)">
        <!-- Bottle Shadow -->
        <ellipse cx="${cx}" cy="${y + h * 0.88}" rx="${w * 0.26}" ry="${h * 0.07}" fill="#000000" opacity="0.45" filter="blur(8px)" />
        <!-- Bottle Glass Body -->
        <defs>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.9" />
            <stop offset="20%" stop-color="${primaryColor}" />
            <stop offset="50%" stop-color="${accentColor}" stop-opacity="0.9" />
            <stop offset="80%" stop-color="${primaryColor}" />
            <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0.95" />
          </linearGradient>
          <linearGradient id="goldCollar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#9A7B38" />
            <stop offset="40%" stop-color="#E5C778" />
            <stop offset="70%" stop-color="#FFF2B2" />
            <stop offset="100%" stop-color="#8F712E" />
          </linearGradient>
        </defs>
        <!-- Glass Fluted Bottle -->
        <rect x="${cx - w * 0.18}" y="${y + h * 0.3}" width="${w * 0.36}" height="${h * 0.55}" rx="${w * 0.06}" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
        <!-- Fluting vertical lines -->
        <line x1="${cx - w * 0.1}" y1="${y + h * 0.33}" x2="${cx - w * 0.1}" y2="${y + h * 0.82}" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
        <line x1="${cx - w * 0.04}" y1="${y + h * 0.33}" x2="${cx - w * 0.04}" y2="${y + h * 0.82}" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
        <line x1="${cx + w * 0.04}" y1="${y + h * 0.33}" x2="${cx + w * 0.04}" y2="${y + h * 0.82}" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
        <line x1="${cx + w * 0.1}" y1="${y + h * 0.33}" x2="${cx + w * 0.1}" y2="${y + h * 0.82}" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
        
        <!-- Label Plaque -->
        <rect x="${cx - w * 0.14}" y="${y + h * 0.44}" width="${w * 0.28}" height="${h * 0.28}" rx="3" fill="#FDFBF7" stroke="#D1D5DB" stroke-width="1" />
        <text x="${cx}" y="${y + h * 0.52}" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="${w * 0.042}" fill="#111827" letter-spacing="1.5">${name}</text>
        <line x1="${cx - w * 0.08}" y1="${y + h * 0.55}" x2="${cx + w * 0.08}" y2="${y + h * 0.55}" stroke="${primaryColor}" stroke-width="1" />
        <text x="${cx}" y="${y + h * 0.6}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="${w * 0.026}" fill="#6B7280">${category}</text>
        <text x="${cx}" y="${y + h * 0.66}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="${w * 0.02}" fill="#9CA3AF" font-style="italic">Paris &bull; London &bull; New York</text>
        
        <!-- Shoulder & Gold Pipette Dropper -->
        <path d="M ${cx - w * 0.14} ${y + h * 0.3} Q ${cx - w * 0.08} ${y + h * 0.25} ${cx - w * 0.08} ${y + h * 0.24} L ${cx + w * 0.08} ${y + h * 0.24} Q ${cx + w * 0.08} ${y + h * 0.25} ${cx + w * 0.14} ${y + h * 0.3} Z" fill="url(#glassGrad)" />
        <!-- Gold collar -->
        <rect x="${cx - w * 0.08}" y="${y + h * 0.18}" width="${w * 0.16}" height="${h * 0.06}" rx="2" fill="url(#goldCollar)" />
        <!-- Rubber bulb top -->
        <path d="M ${cx - w * 0.07} ${y + h * 0.18} Q ${cx - w * 0.06} ${y + h * 0.08} ${cx} ${y + h * 0.07} Q ${cx + w * 0.06} ${y + h * 0.08} ${cx + w * 0.07} ${y + h * 0.18} Z" fill="#1C1917" />
        
        <!-- Specular Glass Highlights -->
        <path d="M ${cx - w * 0.16} ${y + h * 0.34} L ${cx - w * 0.16} ${y + h * 0.8} L ${cx - w * 0.14} ${y + h * 0.8} L ${cx - w * 0.14} ${y + h * 0.34} Z" fill="#FFFFFF" opacity="0.4" />
      </g>
    `;
  };

  // Generate SVG markup based on medium
  switch (mediumId) {
    case 'billboard': {
      // 16:9 Aspect Ratio (1280 x 720)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
          <defs>
            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
            </filter>
            <linearGradient id="twilightSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0B132B" />
              <stop offset="45%" stop-color="#1C2541" />
              <stop offset="75%" stop-color="#3A506B" />
              <stop offset="100%" stop-color="#D97706" />
            </linearGradient>
            <linearGradient id="billboardCanvas" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${secondaryColor}" />
              <stop offset="50%" stop-color="#0F172A" />
              <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.8" />
            </linearGradient>
            <radialGradient id="spotlight1" cx="20%" cy="100%" r="90%">
              <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#FEF3C7" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="spotlight2" cx="80%" cy="100%" r="90%">
              <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#FEF3C7" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Sky Background -->
          <rect width="1280" height="720" fill="url(#twilightSky)" />

          <!-- Distant city horizon silhouette (No people) -->
          <path d="M 0 580 L 80 580 L 80 520 L 140 520 L 140 580 L 220 580 L 220 490 L 270 490 L 270 580 L 390 580 L 390 540 L 450 540 L 450 580 L 680 580 L 680 510 L 730 510 L 730 580 L 920 580 L 920 480 L 980 480 L 980 580 L 1100 580 L 1100 530 L 1160 530 L 1160 580 L 1280 580 L 1280 720 L 0 720 Z" fill="#0A0F1D" opacity="0.8" />
          <rect y="580" width="1280" height="140" fill="#050811" />

          <!-- Steel Lattice Billboard Support Pillars -->
          <rect x="360" y="440" width="32" height="280" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
          <rect x="888" y="440" width="32" height="280" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
          <line x1="360" y1="480" x2="392" y2="540" stroke="#334155" stroke-width="3" />
          <line x1="392" y1="480" x2="360" y2="540" stroke="#334155" stroke-width="3" />
          <line x1="888" y1="480" x2="920" y2="540" stroke="#334155" stroke-width="3" />
          <line x1="920" y1="480" x2="888" y2="540" stroke="#334155" stroke-width="3" />

          <!-- Billboard Main Frame Shadow -->
          <rect x="110" y="70" width="1060" height="390" rx="8" fill="#000000" opacity="0.6" filter="blur(16px)" />

          <!-- Billboard Frame -->
          <rect x="110" y="60" width="1060" height="390" rx="8" fill="#1E293B" stroke="#475569" stroke-width="4" />
          
          <!-- Inner Ad Canvas -->
          <rect x="130" y="80" width="1020" height="350" rx="4" fill="url(#billboardCanvas)" />
          
          <!-- Spotlight Beams -->
          <rect x="130" y="80" width="1020" height="350" fill="url(#spotlight1)" />
          <rect x="130" y="80" width="1020" height="350" fill="url(#spotlight2)" />

          <!-- Graphic Elements inside Billboard -->
          <circle cx="920" cy="255" r="160" fill="${primaryColor}" opacity="0.25" filter="blur(40px)" />
          <circle cx="340" cy="220" r="120" fill="${accentColor}" opacity="0.2" filter="blur(30px)" />

          <!-- Typography / Brand Copy -->
          <g transform="translate(180, 160)">
            <text x="0" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="14" fill="${accentColor}" letter-spacing="4" text-transform="uppercase">${category}</text>
            <text x="0" y="55" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="52" fill="#FFFFFF" letter-spacing="-1">${name}</text>
            <text x="0" y="105" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="20" fill="#E2E8F0" max-width="400">${tagline}</text>
            
            <rect x="0" y="145" width="160" height="42" rx="8" fill="${primaryColor}" />
            <text x="80" y="171" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="14" fill="#FFFFFF" letter-spacing="1">DISCOVER NOW</text>
          </g>

          <!-- Product Hero Graphic -->
          ${renderProductGraphic(720, 80, 320, 340)}

          <!-- External Bottom Catwalk & Floodlight Fixtures -->
          <rect x="90" y="446" width="1100" height="12" fill="#334155" />
          <!-- Catwalk railing -->
          <line x1="90" y1="432" x2="1190" y2="432" stroke="#475569" stroke-width="2" />
          <line x1="200" y1="432" x2="200" y2="446" stroke="#475569" stroke-width="2" />
          <line x1="450" y1="432" x2="450" y2="446" stroke="#475569" stroke-width="2" />
          <line x1="700" y1="432" x2="700" y2="446" stroke="#475569" stroke-width="2" />
          <line x1="950" y1="432" x2="950" y2="446" stroke="#475569" stroke-width="2" />

          <!-- Spotlights angled up -->
          <rect x="260" y="452" width="28" height="18" rx="2" fill="#E2E8F0" />
          <polygon points="264,452 284,452 300,436 248,436" fill="#FEF3C7" opacity="0.8" />
          <rect x="620" y="452" width="28" height="18" rx="2" fill="#E2E8F0" />
          <polygon points="624,452 644,452 660,436 608,436" fill="#FEF3C7" opacity="0.8" />
          <rect x="980" y="452" width="28" height="18" rx="2" fill="#E2E8F0" />
          <polygon points="984,452 1004,452 1020,436 968,436" fill="#FEF3C7" opacity="0.8" />
        </svg>
      `;
    }

    case 'newspaper': {
      // 3:4 Aspect Ratio (768 x 1024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 1024" width="100%" height="100%">
          <defs>
            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.3"/>
            </filter>
            <filter id="paper-texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
              <feDiffuseLighting in="noise" lighting-color="#F7F4EB" surfaceScale="1.2">
                <feDistantLight azimuth="45" elevation="60"/>
              </feDiffuseLighting>
              <feBlend mode="multiply" in="SourceGraphic" result="blend"/>
            </filter>
            <!-- Halftone pattern for newspaper print -->
            <pattern id="halftone" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.2" fill="#000000" opacity="0.12" />
            </pattern>
          </defs>

          <!-- Wooden Desk Background -->
          <rect width="768" height="1024" fill="#2E241E" />
          <line x1="0" y1="300" x2="768" y2="300" stroke="#241B16" stroke-width="2" />
          <line x1="0" y1="680" x2="768" y2="680" stroke="#241B16" stroke-width="2" />

          <!-- Broadsheet Newspaper Paper Sheet -->
          <g transform="translate(34, 30) rotate(-0.5 350 480)" filter="url(#drop-shadow)">
            <!-- Newsprint paper base -->
            <rect width="700" height="960" rx="3" fill="#F4EFE6" />
            <rect width="700" height="960" fill="url(#halftone)" />

            <!-- Fold crease down center -->
            <line x1="350" y1="0" x2="350" y2="960" stroke="#E2DACB" stroke-width="3" opacity="0.7" />

            <!-- Masthead Header -->
            <g transform="translate(40, 40)">
              <text x="310" y="32" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-weight="900" font-size="44" fill="#1C1917" letter-spacing="1">THE COMMERCIAL GAZETTE</text>
              <line x1="0" y1="46" x2="620" y2="46" stroke="#1C1917" stroke-width="3" />
              
              <!-- Meta bar -->
              <text x="10" y="62" font-family="Georgia, serif" font-size="11" fill="#44403C">VOL. CLXXIV NO. 54,281</text>
              <text x="310" y="62" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#44403C">INTERNATIONAL EDITION &bull; FINANCIAL &amp; INDUSTRIAL REVIEW</text>
              <text x="610" y="62" text-anchor="end" font-family="Georgia, serif" font-size="11" fill="#44403C">$4.50</text>
              <line x1="0" y1="70" x2="620" y2="70" stroke="#1C1917" stroke-width="1.5" />
            </g>

            <!-- News Columns (Above Ad) -->
            <g transform="translate(40, 130)">
              <!-- Article 1 -->
              <text x="0" y="16" font-family="Georgia, serif" font-weight="700" font-size="17" fill="#1C1917">NEW ERA OF INDUSTRIAL DESIGN</text>
              <text x="0" y="30" font-family="Georgia, serif" font-size="9" fill="#78716C">BY FINANCIAL TIMES DESK</text>
              <text x="0" y="44" font-family="Georgia, serif" font-size="9" fill="#292524" width="290">
                <tspan x="0" dy="0">Market leaders across global consumer goods</tspan>
                <tspan x="0" dy="12">unveil radical approaches to tactile craftsmanship,</tspan>
                <tspan x="0" dy="12">sustainable luxury materials, and brand consistency.</tspan>
                <tspan x="0" dy="12">Surveys indicate consumer discernment reached</tspan>
                <tspan x="0" dy="12">record peaks in domestic and overseas demand.</tspan>
              </text>

              <!-- Article 2 -->
              <text x="330" y="16" font-family="Georgia, serif" font-weight="700" font-size="17" fill="#1C1917">MATERIAL INNOVATION REPORTS</text>
              <text x="330" y="30" font-family="Georgia, serif" font-size="9" fill="#78716C">SPECIAL REPORT &bull; PAGE 4</text>
              <text x="330" y="44" font-family="Georgia, serif" font-size="9" fill="#292524">
                <tspan x="330" dy="0">Advancements in custom fluted glassworks and</tspan>
                <tspan x="330" dy="12">recycled alloy casing reshape expectations</tspan>
                <tspan x="330" dy="12">for physical brand distinction across major cities.</tspan>
                <tspan x="330" dy="12">Editorial analysts note zero-compromise forms</tspan>
                <tspan x="330" dy="12">captivate international retail showcases.</tspan>
              </text>
            </g>

            <!-- THE BIG FEATURED PRINT ADVERTISEMENT (Centered Bottom Half) -->
            <g transform="translate(40, 260)">
              <!-- Heavy Double Ad Border -->
              <rect x="0" y="0" width="620" height="640" fill="#FAF6EE" stroke="#1C1917" stroke-width="4" />
              <rect x="6" y="6" width="608" height="628" fill="none" stroke="#1C1917" stroke-width="1" />

              <!-- "ANNOUNCING" banner -->
              <text x="310" y="44" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-weight="700" fill="${primaryColor}" letter-spacing="3" text-transform="uppercase">EXCLUSIVE ARCHIVE FEATURE</text>
              <line x1="60" y1="56" x2="560" y2="56" stroke="#1C1917" stroke-width="1.5" />

              <!-- Ad Headline -->
              <text x="310" y="100" text-anchor="middle" font-family="'Space Grotesk', serif" font-weight="900" font-size="38" fill="#1C1917" letter-spacing="-0.5">${name}</text>
              <text x="310" y="130" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="17" fill="#44403C">${tagline}</text>
              
              <!-- Halftone ad illustration frame -->
              <rect x="70" y="160" width="480" height="340" fill="#EFE9DC" stroke="#1C1917" stroke-width="2" />
              <rect x="70" y="160" width="480" height="340" fill="url(#halftone)" />

              <!-- Product Graphic inside Ad -->
              ${renderProductGraphic(150, 160, 320, 340)}

              <!-- Ad Copy & Stamp -->
              <g transform="translate(80, 530)">
                <text x="0" y="14" font-family="Georgia, serif" font-size="11" fill="#292524" line-height="16">
                  <tspan x="0" dy="0">Formulated and engineered without compromise. Each piece balances</tspan>
                  <tspan x="0" dy="16">sculptural proportion, bespoke materials, and enduring sensory distinction.</tspan>
                  <tspan x="0" dy="16">Now presented across distinguished merchants and private ateliers worldwide.</tspan>
                </text>
                
                <!-- Stockist crest -->
                <rect x="360" y="-8" width="100" height="52" fill="none" stroke="#1C1917" stroke-width="1" stroke-dasharray="2 2" />
                <text x="410" y="14" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="10" fill="#1C1917">ORIGINAL SPEC</text>
                <text x="410" y="32" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="${primaryColor}">ESTABLISHED 2026</text>
              </g>

              <!-- Footer small print -->
              <text x="310" y="618" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="#78716C">COPYRIGHT &copy; 2026 ${name.toUpperCase()} TRADEMARK &bull; ALL RIGHTS RESERVED &bull; STRICT ZERO-HUMAN PRINT COMPOSITION</text>
            </g>
          </g>
        </svg>
      `;
    }

    case 'social_post': {
      // 1:1 Aspect Ratio (900 x 900)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="100%" height="100%">
          <defs>
            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.55"/>
            </filter>
            <linearGradient id="studioBackdrop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#18181B" />
              <stop offset="40%" stop-color="#27272A" />
              <stop offset="100%" stop-color="${secondaryColor}" />
            </linearGradient>
            <radialGradient id="pedestalGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.35" />
              <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3F3F46" />
              <stop offset="50%" stop-color="#27272A" />
              <stop offset="100%" stop-color="#18181B" />
            </linearGradient>
          </defs>

          <!-- Studio Backdrop -->
          <rect width="900" height="900" fill="url(#studioBackdrop)" />

          <!-- Geometric Studio Lighting Accents -->
          <circle cx="450" cy="550" r="320" fill="url(#pedestalGlow)" />
          <path d="M 0 0 L 350 0 L 0 350 Z" fill="${accentColor}" opacity="0.04" />
          <path d="M 900 900 L 550 900 L 900 550 Z" fill="${primaryColor}" opacity="0.05" />

          <!-- Minimalist Arch Outline -->
          <path d="M 250 680 L 250 320 Q 250 140 450 140 Q 650 140 650 320 L 650 680" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />

          <!-- Modern Studio Pedestal (Display Base) -->
          <g filter="url(#drop-shadow)">
            <!-- Pedestal Cast Shadow -->
            <ellipse cx="450" cy="740" rx="280" ry="40" fill="#000000" opacity="0.6" filter="blur(16px)" />
            <!-- Pedestal Cylinder Top -->
            <ellipse cx="450" cy="650" rx="220" ry="32" fill="#52525B" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
            <!-- Pedestal Cylinder Body -->
            <path d="M 230 650 L 230 710 Q 450 770 670 710 L 670 650 Q 450 710 230 650 Z" fill="url(#pedestalGrad)" />
            <!-- Top surface shine -->
            <ellipse cx="450" cy="650" rx="200" ry="24" fill="${secondaryColor}" opacity="0.6" />
          </g>

          <!-- Product Graphic Centered on Pedestal -->
          ${renderProductGraphic(260, 160, 380, 500)}

          <!-- Floating Modern Typography & Badges -->
          <!-- Top Left: Brand Mark -->
          <g transform="translate(60, 60)">
            <rect x="0" y="0" width="32" height="32" rx="8" fill="${primaryColor}" />
            <text x="16" y="21" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF">${name.charAt(0)}</text>
            <text x="44" y="22" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="16" fill="#FFFFFF" letter-spacing="2">${name.toUpperCase()}</text>
          </g>

          <!-- Top Right: Campaign Pill Badge -->
          <g transform="translate(710, 60)">
            <rect x="0" y="0" width="130" height="32" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" />
            <circle cx="16" cy="16" r="4" fill="${accentColor}" />
            <text x="28" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="11" fill="#FFFFFF" letter-spacing="1">NEW DROP</text>
          </g>

          <!-- Bottom Floating Card / Social Call to Action -->
          <g transform="translate(60, 780)">
            <rect x="0" y="0" width="780" height="68" rx="20" fill="rgba(24, 24, 27, 0.75)" stroke="rgba(255, 255, 255, 0.12)" backdrop-filter="blur(16px)" />
            <text x="32" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="16" fill="#FFFFFF">${name}</text>
            <text x="32" y="50" font-family="'Plus Jakarta Sans', sans-serif" font-weight="400" font-size="12" fill="#A1A1AA">${tagline}</text>
            
            <!-- Button Pill -->
            <rect x="620" y="14" width="130" height="40" rx="12" fill="${primaryColor}" />
            <text x="685" y="38" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#FFFFFF" letter-spacing="1">EXPLORE &rarr;</text>
          </g>
        </svg>
      `;
    }

    case 'transit_shelter': {
      // 3:4 Aspect Ratio (768 x 1024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 1024" width="100%" height="100%">
          <defs>
            <filter id="drop-shadow">
              <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.6"/>
            </filter>
            <linearGradient id="nightStreet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#090D16" />
              <stop offset="50%" stop-color="#111827" />
              <stop offset="100%" stop-color="#1E293B" />
            </linearGradient>
            <radialGradient id="kioskGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Night Streetscape (Empty sidewalk, zero people) -->
          <rect width="768" height="1024" fill="url(#nightStreet)" />
          <!-- Sidewalk Pavement with Rain Sheen -->
          <rect y="720" width="768" height="304" fill="#0B0F19" />
          <ellipse cx="384" cy="880" rx="360" ry="100" fill="${primaryColor}" opacity="0.12" filter="blur(30px)" />

          <!-- Transit Shelter Glass Kiosk Outer Frame -->
          <g filter="url(#drop-shadow)">
            <rect x="110" y="80" width="548" height="820" rx="16" fill="#020617" stroke="#334155" stroke-width="6" />
            <!-- Inner Backlit Poster Box -->
            <rect x="134" y="104" width="500" height="772" rx="8" fill="${secondaryColor}" />
            <rect x="134" y="104" width="500" height="772" fill="url(#kioskGlow)" />
            
            <!-- Poster Content -->
            <g transform="translate(164, 150)">
              <text x="220" y="0" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="14" fill="${accentColor}" letter-spacing="4">OUTDOOR EXCLUSIVE</text>
              <text x="220" y="44" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="40" fill="#FFFFFF">${name}</text>
              <text x="220" y="74" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" fill="#CBD5E1">${tagline}</text>
            </g>

            <!-- Product Graphic -->
            ${renderProductGraphic(220, 260, 328, 440)}

            <!-- Bottom Poster Graphic -->
            <g transform="translate(170, 780)">
              <line x1="0" y1="0" x2="428" y2="0" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
              <text x="214" y="32" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="14" fill="#FFFFFF">METROPOLITAN TRANSIT CAMPAIGN &bull; 2026</text>
            </g>
          </g>

          <!-- Glass Sheen Diagonal Glare -->
          <polygon points="150,110 260,110 190,870 80,870" fill="#FFFFFF" opacity="0.04" />
        </svg>
      `;
    }

    case 'magazine_spread': {
      // 16:9 Aspect Ratio (1280 x 720)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
          <defs>
            <filter id="drop-shadow">
              <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.45"/>
            </filter>
            <linearGradient id="centerFoldShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#000000" stop-opacity="0" />
              <stop offset="48%" stop-color="#000000" stop-opacity="0.35" />
              <stop offset="50%" stop-color="#000000" stop-opacity="0.6" />
              <stop offset="52%" stop-color="#000000" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0" />
            </linearGradient>
          </defs>

          <!-- Flat stone surface background -->
          <rect width="1280" height="720" fill="#18181B" />

          <!-- Magazine Double Page -->
          <g transform="translate(80, 50)" filter="url(#drop-shadow)">
            <!-- Left Page -->
            <rect x="0" y="0" width="560" height="620" rx="4" fill="#FAFAF9" />
            <!-- Right Page -->
            <rect x="560" y="0" width="560" height="620" rx="4" fill="#FFFFFF" />

            <!-- Left Page Editorial Ad Layout -->
            <g transform="translate(60, 80)">
              <text x="0" y="20" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="14" fill="${primaryColor}" letter-spacing="4">EDITORIAL ADVERTISEMENT</text>
              <text x="0" y="80" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="54" fill="#1C1917" letter-spacing="-1">${name}</text>
              <line x1="0" y1="110" x2="240" y2="110" stroke="${primaryColor}" stroke-width="3" />
              <text x="0" y="150" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="#44403C" max-width="380">${tagline}</text>

              <text x="0" y="240" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#57534E" line-height="22">
                <tspan x="0" dy="0">Conceived for the design-conscious purist. Crafted</tspan>
                <tspan x="0" dy="22">from ${escapeXml(product.materials)}. Every physical contour</tspan>
                <tspan x="0" dy="22">embodies tactile balance and material excellence.</tspan>
              </text>

              <text x="0" y="480" font-family="'Space Grotesk', sans-serif" font-weight="600" font-size="12" fill="#78716C">ISSUE 88 &bull; DESIGN QUARTERLY &bull; PAGE 42</text>
            </g>

            <!-- Right Page: Big Hero Product Visual -->
            <rect x="580" y="20" width="520" height="580" rx="4" fill="${secondaryColor}" />
            ${renderProductGraphic(660, 80, 360, 460)}

            <text x="840" y="560" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="16" fill="#FFFFFF" letter-spacing="3">${name.toUpperCase()}</text>

            <!-- Center Spine Shadow Overlay -->
            <rect x="500" y="0" width="120" height="620" fill="url(#centerFoldShadow)" />
          </g>
        </svg>
      `;
    }

    case 'storefront_window': {
      // 4:3 Aspect Ratio (1024 x 768)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="100%" height="100%">
          <defs>
            <filter id="drop-shadow">
              <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.65"/>
            </filter>
            <radialGradient id="ceilingSpot" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.5" />
              <stop offset="60%" stop-color="#FDE68A" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Evening Street Exterior (Zero people) -->
          <rect width="1024" height="768" fill="#0A0E17" />
          <rect y="640" width="1024" height="128" fill="#05070B" />

          <!-- Boutique Storefront Façade Frame -->
          <rect x="60" y="40" width="904" height="620" rx="12" fill="#111827" stroke="#374151" stroke-width="12" />

          <!-- Inside Store Display Window -->
          <rect x="72" y="52" width="880" height="596" fill="${secondaryColor}" />
          <!-- Directional Ceiling Spotlight -->
          <rect x="72" y="52" width="880" height="596" fill="url(#ceilingSpot)" />

          <!-- Boutique Wall Minimalist Logo -->
          <text x="512" y="160" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="36" fill="#FFFFFF" letter-spacing="8">${name.toUpperCase()}</text>
          <text x="512" y="195" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" fill="${primaryColor}" letter-spacing="3">FLAGSHIP ATELIER</text>

          <!-- Architectural Display Plinth -->
          <g filter="url(#drop-shadow)">
            <ellipse cx="512" cy="560" rx="220" ry="36" fill="#000000" opacity="0.6" filter="blur(16px)" />
            <polygon points="360,490 664,490 700,560 324,560" fill="#374151" />
            <ellipse cx="512" cy="490" rx="160" ry="26" fill="#4B5563" />
          </g>

          <!-- Product Centered on Display Plinth -->
          ${renderProductGraphic(342, 160, 340, 360)}

          <!-- Glass Reflections & Architectural Highlights -->
          <polygon points="120,60 280,60 160,640 0,640" fill="#FFFFFF" opacity="0.03" />
          <polygon points="400,60 520,60 380,640 260,640" fill="#FFFFFF" opacity="0.02" />
        </svg>
      `;
    }

    case 'master_studio':
    default: {
      // 1:1 Aspect Ratio (800 x 800)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
          <defs>
            <filter id="drop-shadow">
              <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.5"/>
            </filter>
            <radialGradient id="studioLighting" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#27272A" />
              <stop offset="60%" stop-color="#18181B" />
              <stop offset="100%" stop-color="#09090B" />
            </radialGradient>
          </defs>

          <!-- Clean Studio Background -->
          <rect width="800" height="800" fill="url(#studioLighting)" />

          <!-- Minimalist Studio Plinth Base -->
          <ellipse cx="400" cy="620" rx="200" ry="30" fill="#000000" opacity="0.5" filter="blur(12px)" />
          <ellipse cx="400" cy="560" rx="180" ry="24" fill="#3F3F46" />
          <path d="M 220 560 L 220 590 Q 400 640 580 590 L 580 560 Q 400 610 220 560 Z" fill="#27272A" />

          <!-- Master Product Graphic -->
          ${renderProductGraphic(220, 100, 360, 500)}

          <!-- Master Studio Spec Tag -->
          <g transform="translate(400, 720)">
            <text x="0" y="0" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="14" fill="#FFFFFF" letter-spacing="3">${name.toUpperCase()}</text>
            <text x="0" y="20" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#71717A">MASTER STUDIO REFERENCE &bull; CONSISTENCY ANCHOR</text>
          </g>
        </svg>
      `;
    }
  }
}
