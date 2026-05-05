// Susuwatari (soot sprite) from Spirited Away — pixel-art style.
// Next.js migration: export function SootSprite(...)

function SootSprite({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={{ imageRendering: 'pixelated', overflow: 'visible' }}>
      {/* Fluffy body */}
      <circle cx="26" cy="30" r="18" fill="#2d2b3d"/>
      {/* Fluffy top bumps */}
      <circle cx="14" cy="17" r="7"  fill="#2d2b3d"/>
      <circle cx="26" cy="12" r="8"  fill="#2d2b3d"/>
      <circle cx="38" cy="17" r="7"  fill="#2d2b3d"/>
      <circle cx="8"  cy="26" r="5"  fill="#2d2b3d"/>
      <circle cx="44" cy="26" r="5"  fill="#2d2b3d"/>
      {/* Left eye white */}
      <ellipse cx="19" cy="27" rx="6" ry="7" fill="white"/>
      {/* Left pupil */}
      <circle cx="19" cy="28" r="4" fill="#1a1a2e"/>
      {/* Left eye shine */}
      <circle cx="21" cy="26" r="1.5" fill="white"/>
      {/* Right eye white */}
      <ellipse cx="33" cy="27" rx="6" ry="7" fill="white"/>
      {/* Right pupil */}
      <circle cx="33" cy="28" r="4" fill="#1a1a2e"/>
      {/* Right eye shine */}
      <circle cx="35" cy="26" r="1.5" fill="white"/>
      {/* Little legs */}
      <ellipse cx="19" cy="47" rx="5" ry="4" fill="#2d2b3d"/>
      <ellipse cx="33" cy="47" rx="5" ry="4" fill="#2d2b3d"/>
    </svg>
  );
}

Object.assign(window, { SootSprite });
