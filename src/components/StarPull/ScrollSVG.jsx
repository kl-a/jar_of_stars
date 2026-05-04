// Parchment scroll SVG — used in the pull reveal.
// Next.js migration: export function ScrollSVG(...)

function ScrollSVG({ width = 320, height = 360 }) {
  const rollH = 24;
  const bodyH = height - rollH * 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ imageRendering: 'pixelated' }}>
      {/* Drop shadow */}
      <rect x={6} y={6} width={width} height={height} fill="#2d2b3d" opacity="0.3"/>
      {/* Body */}
      <rect x={0} y={rollH} width={width} height={bodyH} fill="#fdfcff"/>
      <rect x={0} y={rollH} width={width} height={bodyH} fill="#ffeaa7" opacity="0.1"/>
      {/* Top roll */}
      <rect x={0} y={0}          width={width} height={rollH}  fill="#e8e6f0"/>
      <rect x={0} y={rollH - 2}  width={width} height={4}      fill="#c9a84c" opacity="0.5"/>
      <rect x={0} y={rollH}      width={width} height={2}      fill="#c9a84c"/>
      {/* Bottom roll */}
      <rect x={0} y={rollH + bodyH}          width={width} height={rollH} fill="#e8e6f0"/>
      <rect x={0} y={rollH + bodyH - 2}      width={width} height={2}     fill="#c9a84c"/>
      <rect x={0} y={rollH + bodyH + rollH - 2} width={width} height={2}  fill="#c9a84c" opacity="0.5"/>
      {/* Decorative inner border */}
      <rect x={6}         y={rollH + 6}          width={width - 12} height={2}          fill="#c9a84c" opacity="0.6"/>
      <rect x={6}         y={rollH + bodyH - 8}  width={width - 12} height={2}          fill="#c9a84c" opacity="0.6"/>
      <rect x={6}         y={rollH + 6}          width={2}          height={bodyH - 14} fill="#c9a84c" opacity="0.6"/>
      <rect x={width - 8} y={rollH + 6}          width={2}          height={bodyH - 14} fill="#c9a84c" opacity="0.6"/>
      {/* Roll shadow lines */}
      <rect x={0} y={4}              width={width} height={2} fill="#2d2b3d" opacity="0.08"/>
      <rect x={0} y={rollH + bodyH + 4} width={width} height={2} fill="#2d2b3d" opacity="0.08"/>
      {/* Side borders */}
      <rect x={0}         y={0} width={2} height={height} fill="#c9a84c" opacity="0.4"/>
      <rect x={width - 2} y={0} width={2} height={height} fill="#c9a84c" opacity="0.4"/>
    </svg>
  );
}

Object.assign(window, { ScrollSVG });
