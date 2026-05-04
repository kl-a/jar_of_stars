// Pixel-art 5-pointed star — used throughout the app as an icon/decoration.
// Next.js migration: export function PixelStar(...)

function PixelStar({ size = 16, color = '#ffe066', shadowColor = '#c9a84c', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', ...style }}>
      <rect x="6"  y="0"  width="4" height="4"  fill={color}/>
      <rect x="4"  y="4"  width="8" height="2"  fill={color}/>
      <rect x="0"  y="6"  width="16" height="4" fill={color}/>
      <rect x="2"  y="10" width="12" height="2" fill={color}/>
      <rect x="2"  y="12" width="4"  height="2" fill={color}/>
      <rect x="10" y="12" width="4"  height="2" fill={color}/>
      <rect x="2"  y="14" width="2"  height="2" fill={color}/>
      <rect x="12" y="14" width="2"  height="2" fill={color}/>
      {/* Lower-right shadow pixels */}
      <rect x="10" y="6"  width="6" height="2" fill={shadowColor} opacity="0.5"/>
      <rect x="2"  y="10" width="2" height="4" fill={shadowColor} opacity="0.5"/>
    </svg>
  );
}

Object.assign(window, { PixelStar });
