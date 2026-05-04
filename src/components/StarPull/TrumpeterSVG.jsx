// Pixel-art trumpeter character — used in the pull reveal celebration.
// Next.js migration: export function TrumpeterSVG(...)

function TrumpeterSVG({ color = '#c9b8f0', flip = false }) {
  return (
    <svg
      width="60" height="80" viewBox="0 0 40 60"
      style={{ imageRendering: 'pixelated', transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      {/* Feet */}
      <rect x="10" y="52" width="8" height="4" fill="#2d2b3d"/>
      <rect x="22" y="52" width="8" height="4" fill="#2d2b3d"/>
      {/* Legs */}
      <rect x="12" y="38" width="6" height="16" fill={color}/>
      <rect x="22" y="38" width="6" height="16" fill={color}/>
      {/* Body */}
      <rect x="10" y="20" width="20" height="20" fill={color}/>
      {/* Raised arm */}
      <rect x="28" y="16" width="6" height="4"  fill={color}/>
      {/* Trumpet */}
      <rect x="30" y="12" width="8" height="4"  fill="#ffeaa7"/>
      <rect x="34" y="10" width="4" height="4"  fill="#ffeaa7"/>
      <rect x="36" y="8"  width="4" height="8"  fill="#c9a84c"/>
      {/* Head */}
      <rect x="12" y="8"  width="16" height="14" fill="#fdfcff"/>
      {/* Eyes */}
      <rect x="14" y="12" width="4" height="4" fill="#2d2b3d"/>
      <rect x="22" y="12" width="4" height="4" fill="#2d2b3d"/>
      <rect x="14" y="12" width="2" height="2" fill="#fdfcff"/>
      {/* Smile */}
      <rect x="16" y="18" width="8" height="2" fill="#2d2b3d"/>
      <rect x="14" y="16" width="4" height="2" fill="#2d2b3d"/>
      {/* Hat */}
      <rect x="10" y="4" width="20" height="6" fill="#2d2b3d"/>
      <rect x="8"  y="8" width="24" height="2" fill="#2d2b3d"/>
      <rect x="10" y="6" width="20" height="2" fill={color}/>
      {/* Music note */}
      <rect x="34" y="4" width="4" height="4" fill="#ffe066" opacity="0.8"/>
      <rect x="36" y="2" width="2" height="4" fill="#ffe066" opacity="0.8"/>
    </svg>
  );
}

Object.assign(window, { TrumpeterSVG });
