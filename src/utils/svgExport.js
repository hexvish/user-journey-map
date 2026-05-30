// Helper to escape XML unsafe characters to prevent XML parsing issues
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateJourneyMapSvg({ lens, phases }) {
  const W = 320; // Column width
  const margin = 40; // Horizontal margins
  const N = phases.length;
  
  // Dimensions
  const svgWidth = Math.max(1080, N * W + margin * 2);
  const svgHeight = 1360;

  // Sentiment Curve vertical mapping
  const getYCoordinate = (emotion) => {
    const sentimentOffsetY = 370;
    if (emotion === 1) return sentimentOffsetY + 30;    // Y = 400
    if (emotion === -1) return sentimentOffsetY + 100;  // Y = 470
    return sentimentOffsetY + 65;                       // Y = 435
  };

  const points = phases.map((phase, i) => {
    const x = i * W + 148 + margin;
    const y = getYCoordinate(phase.emotion);
    return { x, y };
  });

  // Calculate Cubic Bezier Curve path
  let pathD = '';
  if (points.length > 1) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      
      // Control points
      const cp1X = p0.x + W / 2;
      const cp1Y = p0.y;
      const cp2X = p1.x - W / 2;
      const cp2Y = p1.y;

      pathD += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${p1.x} ${p1.y}`;
    }
  }

  // Calculate dynamic width of lens items
  const lensContainerWidth = svgWidth - margin * 2;
  const lensColWidth = (lensContainerWidth - 40) / 3;

  // Map emotions to emojis
  const getEmotionEmoji = (val) => {
    if (val === 1) return '🙂';
    if (val === -1) return '🙁';
    return '😐';
  };

  // Build the SVG XML
  let svg = `<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@1,400;1,500;1,600&amp;family=Outfit:wght@300;400;500;600;700;850&amp;display=swap');
      
      .svg-bg { fill: #f8fafc; }
      .title-text { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 850; fill: #0f172a; letter-spacing: -0.02em; }
      .subtitle-text { font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 400; fill: #475569; }
      .phase-title { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: bold; fill: #1e293b; }
      .curve-stroke { stroke: url(#curve-grad); stroke-width: 3.5; stroke-dasharray: 8, 6; fill: none; }
      .curve-glow { stroke: url(#curve-grad); stroke-width: 6; fill: none; opacity: 0.15; filter: url(#glow-filter); }
      
      /* ForeignObject Scroll Hide styling */
      .fo-card { box-sizing: border-box; height: 100%; width: 100%; border-radius: 12px; padding: 12px; border-width: 1px; font-family: 'Outfit', sans-serif; }
      .fo-card-title { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
      .fo-card-body { font-size: 12.5px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; overflow-y: auto; height: calc(100% - 18px); }
    </style>

    {/* Glow filter */}
    <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    {/* Curve Gradient */}
    <linearGradient id="curve-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
  </defs>

  {/* Background */}
  <rect width="100%" height="100%" class="svg-bg" />

  {/* Header */}
  <g transform="translate(${margin}, 40)">
    <text x="0" y="0" class="title-text">USER JOURNEY MAP</text>
    <text x="0" y="18" class="subtitle-text">Interactive visual map builder &amp; sentiment curve visualizer</text>
  </g>

  {/* Journey Lens Metadata Group */}
  <g transform="translate(${margin}, 85)">
    {/* Persona Card */}
    <foreignObject x="0" y="0" width="${lensColWidth}" height="150">
      <div xmlns="http://www.w3.org/1999/xhtml" class="fo-card" style="border-color: rgba(59, 130, 246, 0.2); background-color: #ffffff; color: #1e3a8a; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div class="fo-card-title" style="color: #2563eb;">Persona (Actor)</div>
        <div class="fo-card-body" style="color: #334155;">${escapeXml(lens.persona)}</div>
      </div>
    </foreignObject>

    {/* Scenario Card */}
    <foreignObject x="${lensColWidth + 20}" y="0" width="${lensColWidth}" height="150">
      <div xmlns="http://www.w3.org/1999/xhtml" class="fo-card" style="border-color: rgba(168, 85, 247, 0.2); background-color: #ffffff; color: #581c87; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div class="fo-card-title" style="color: #9333ea;">Scenario</div>
        <div class="fo-card-body" style="color: #334155;">${escapeXml(lens.scenario)}</div>
      </div>
    </foreignObject>

    {/* User Goal Card */}
    <foreignObject x="${(lensColWidth + 20) * 2}" y="0" width="${lensColWidth}" height="150">
      <div xmlns="http://www.w3.org/1999/xhtml" class="fo-card" style="border-color: rgba(20, 184, 166, 0.2); background-color: #ffffff; color: #0f766e; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div class="fo-card-title" style="color: #0d9488;">User Goal</div>
        <div class="fo-card-body" style="color: #334155;">${escapeXml(lens.goal)}</div>
      </div>
    </foreignObject>
  </g>

  {/* Column Dividers */}
  <g>`;
  
  for (let i = 0; i <= N; i++) {
    const x = i * W + margin;
    svg += `
    <line x1="${x}" y1="280" x2="${x}" y2="1320" stroke="#e2e8f0" stroke-width="1.5" stroke-opacity="0.8" stroke-dasharray="6, 6" />`;
  }
  
  svg += `
  </g>

  {/* Storyboard Columns */}
  <g>`;

  phases.forEach((phase, i) => {
    const colX = i * W + margin;
    
    // Phase header name
    svg += `
    <!-- Phase Header -->
    <text x="${colX + 10}" y="305" class="phase-title">${escapeXml(phase.name || `Phase ${i + 1}`)}</text>
    
    <!-- Sentiment Box Placeholder Outline -->
    <rect x="${colX + 8}" y="370" width="280" height="130" rx="12" fill="#f1f5f9" fill-opacity="0.6" stroke="#e2e8f0" stroke-width="1" />
    <text x="${colX + 20}" y="390" font-family="'Outfit', sans-serif" font-size="9" font-weight="bold" fill="#94a3b8" letter-spacing="0.05em">SENTIMENT</text>
    `;
  });

  svg += `
  </g>`;

  // Draw Sentiment Curve
  if (points.length > 0) {
    svg += `
  
  <!-- Sentiment Curve -->
  <g>`;
    
    if (points.length > 1) {
      svg += `
    <path d="${pathD}" class="curve-glow" />
    <path d="${pathD}" class="curve-stroke" />`;
    }

    // Draw coordinate dots and emojis
    points.forEach((p, idx) => {
      const phase = phases[idx];
      const emoji = getEmotionEmoji(phase.emotion);
      svg += `
    <g transform="translate(${p.x}, ${p.y})">
      <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="url(#curve-grad)" stroke-width="2" />
      <text x="0" y="5.5" font-family="'Outfit', sans-serif" font-size="16" text-anchor="middle">${emoji}</text>
    </g>`;
    });

    svg += `
  </g>`;
  }

  // Draw qualitative data tiers
  svg += `

  {/* Qualitative Grid Cards */}
  <g>`;

  phases.forEach((phase, i) => {
    const colX = i * W + margin;

    // Y offsets for tiers starting at Y = 520px
    const cardWidth = W - 40; // 280px
    const cardHeight = 140;
    const gap = 20;

    // Tier 1: User Actions (Blue)
    svg += `
    <foreignObject x="${colX + 20}" y="520" width="${cardWidth}" height="${cardHeight}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="fo-card" style="border-color: rgba(59, 130, 246, 0.25); background-color: rgba(59, 130, 246, 0.04); color: #1e3a8a;">
        <div class="fo-card-title" style="color: #2563eb;">User Actions</div>
        <div class="fo-card-body" style="color: #334155;">${escapeXml(phase.actions)}</div>
      </div>
    </foreignObject>`;

    // Tier 2: Touchpoints (Purple)
    svg += `
    <foreignObject x="${colX + 20}" y="${520 + (cardHeight + gap)}" width="${cardWidth}" height="${cardHeight}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="fo-card" style="border-color: rgba(168, 85, 247, 0.25); background-color: rgba(168, 85, 247, 0.04); color: #581c87;">
        <div class="fo-card-title" style="color: #9333ea;">Touchpoints</div>
        <div class="fo-card-body" style="color: #334155;">${escapeXml(phase.touchpoints)}</div>
      </div>
    </foreignObject>`;

    // Tier 3: Thoughts & Quotes (Teal)
    svg += `
    <foreignObject x="${colX + 20}" y="${520 + (cardHeight + gap) * 2}" width="${cardWidth}" height="${cardHeight}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="fo-card" style="border-color: rgba(20, 184, 166, 0.25); background-color: rgba(20, 184, 166, 0.04); color: #042f2e;">
        <div class="fo-card-title" style="color: #0d9488;">Thoughts &amp; Quotes</div>
        <div class="fo-card-body" style="font-family: 'Lora', Georgia, serif; font-style: italic; color: #334155;">${escapeXml(phase.thoughts)}</div>
      </div>
    </foreignObject>`;

    // Tier 4: Pain Points (Red)
    svg += `
    <foreignObject x="${colX + 20}" y="${520 + (cardHeight + gap) * 3}" width="${cardWidth}" height="${cardHeight}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="fo-card" style="border-color: rgba(239, 68, 68, 0.25); background-color: rgba(239, 68, 68, 0.04); color: #7f1d1d;">
        <div class="fo-card-title" style="color: #dc2626;">Pain Points</div>
        <div class="fo-card-body" style="color: #334155;">${escapeXml(phase.painPoints)}</div>
      </div>
    </foreignObject>`;

    // Tier 5: Opportunities (Amber)
    svg += `
    <foreignObject x="${colX + 20}" y="${520 + (cardHeight + gap) * 4}" width="${cardWidth}" height="${cardHeight}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="fo-card" style="border-color: rgba(245, 158, 11, 0.25); background-color: rgba(245, 158, 11, 0.04); color: #78350f;">
        <div class="fo-card-title" style="color: #d97706;">Opportunities</div>
        <div class="fo-card-body" style="color: #334155;">${escapeXml(phase.opportunities)}</div>
      </div>
    </foreignObject>`;
  });

  svg += `
  </g>
</svg>`;

  return svg;
}
