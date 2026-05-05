// Mason jar SVG — lid with band, narrow neck, curved shoulders, wide body, rounded base.
// data-jar attribute is used by StarZipAnimation to locate the jar for targeting.
// Next.js migration: export function JarSVG(...)

function JarSVG({ fillFraction = 0, starCount = 0, glowPulse = 1, width = 180, height = 260 }) {
  const fw = width;
  const fh = height;
  const cx = fw / 2;

  // ── Layout proportions ──────────────────────────────────────────────────────
  const lidTopY    = fh * 0.02;
  const lidH       = fh * 0.06;
  const lidW       = fw * 0.54;
  const lidX       = cx - lidW / 2;

  const bandH      = fh * 0.05;
  const bandY      = lidTopY + lidH;
  const bandW      = fw * 0.56;           // slightly wider than lid for the ring lip
  const bandX      = cx - bandW / 2;

  const neckY      = bandY + bandH;
  const neckH      = fh * 0.09;
  const neckW      = fw * 0.46;
  const neckX      = cx - neckW / 2;

  const shoulderH  = fh * 0.10;
  const shoulderY  = neckY + neckH;

  const bodyY      = shoulderY + shoulderH;
  const bodyW      = fw * 0.84;
  const bodyX      = cx - bodyW / 2;
  const bodyBottom = fh * 0.89;
  const bodyH      = bodyBottom - bodyY;
  const cornerR    = fh * 0.025;

  const baseH      = fh * 0.06;
  const baseW      = fw * 0.80;
  const baseX      = cx - baseW / 2;

  // ── Paths ───────────────────────────────────────────────────────────────────

  // Full jar outline (neck down to base) — used as clipPath for glass fill
  const jarOutline = [
    `M ${neckX} ${shoulderY}`,
    // left shoulder: cubic bezier from neck corner outward to body
    `C ${neckX} ${shoulderY + shoulderH * 0.85}, ${bodyX} ${shoulderY + shoulderH * 0.15}, ${bodyX} ${bodyY}`,
    `L ${bodyX} ${bodyBottom - cornerR}`,
    `Q ${bodyX} ${bodyBottom} ${bodyX + cornerR} ${bodyBottom}`,
    `L ${bodyX + baseW - cornerR + (baseX - bodyX)} ${bodyBottom}`,
    `Q ${bodyX + bodyW} ${bodyBottom} ${bodyX + bodyW} ${bodyBottom - cornerR}`,
    `L ${bodyX + bodyW} ${bodyY}`,
    // right shoulder
    `C ${bodyX + bodyW} ${shoulderY + shoulderH * 0.15}, ${neckX + neckW} ${shoulderY + shoulderH * 0.85}, ${neckX + neckW} ${shoulderY}`,
    `Z`,
  ].join(' ');

  // Liquid fill: grows from 0 → full body height as fillFraction goes 0 → 1
  const liquidH = bodyH * Math.min(fillFraction, 1);
  const liquidY = bodyBottom - liquidH;

  const _SPARKLES = [
    { xf: 0.22, yf: 0.22, dur: '1.3s', delay: '0.0s' },
    { xf: 0.62, yf: 0.52, dur: '0.9s', delay: '0.5s' },
    { xf: 0.76, yf: 0.18, dur: '1.8s', delay: '0.9s' },
    { xf: 0.38, yf: 0.68, dur: '1.1s', delay: '0.3s' },
    { xf: 0.82, yf: 0.40, dur: '0.8s', delay: '1.2s' },
    { xf: 0.15, yf: 0.58, dur: '1.5s', delay: '0.7s' },
    { xf: 0.50, yf: 0.82, dur: '1.0s', delay: '0.1s' },
    { xf: 0.68, yf: 0.30, dur: '1.4s', delay: '0.6s' },
  ];

  return (
    <svg
      data-jar="true"
      width={fw}
      height={fh}
      viewBox={`0 0 ${fw} ${fh}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <clipPath id="jarClip">
          <path d={jarOutline}/>
        </clipPath>
        <filter id="jarGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fff4a0" stopOpacity="0.78"/>
          <stop offset="45%"  stopColor="#ffe066" stopOpacity="0.82"/>
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.90"/>
        </linearGradient>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#9b89c4" stopOpacity="0.15"/>
          <stop offset="30%"  stopColor="#c9b8f0" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#7a6fa0" stopOpacity="0.18"/>
        </linearGradient>
      </defs>

      {/* Outer ambient glow */}
      <ellipse cx={cx} cy={bodyY + bodyH * 0.55} rx={bodyW * 0.42} ry={bodyH * 0.32}
        fill="#ffe066" opacity={0.05 * glowPulse}/>

      {/* ── Lid ── */}
      {/* Lid top surface */}
      <rect x={lidX} y={lidTopY} width={lidW} height={lidH} rx={4}
        fill="#c9b8f0"/>
      {/* Lid top highlight */}
      <rect x={lidX + 4} y={lidTopY + 3} width={lidW - 8} height={lidH * 0.4} rx={2}
        fill="#e8dcff" opacity="0.6"/>
      {/* Lid bottom shadow line */}
      <rect x={lidX} y={lidTopY + lidH - 3} width={lidW} height={3} rx={0}
        fill="#7a6fa0" opacity="0.5"/>
      {/* Lid 3-d drop */}
      <rect x={lidX + 3} y={lidTopY + lidH} width={lidW} height={4} rx={2}
        fill="#7a6fa0" opacity="0.35"/>

      {/* ── Band ring ── */}
      <rect x={bandX} y={bandY} width={bandW} height={bandH} rx={3}
        fill="#b5a8d8"/>
      {/* Band thread lines */}
      <rect x={bandX + 4} y={bandY + 3} width={bandW - 8} height={2} rx={1}
        fill="#7a6fa0" opacity="0.4"/>
      <rect x={bandX + 4} y={bandY + bandH - 5} width={bandW - 8} height={2} rx={1}
        fill="#7a6fa0" opacity="0.4"/>
      {/* Band drop shadow */}
      <rect x={bandX + 3} y={bandY + bandH} width={bandW} height={4} rx={2}
        fill="#7a6fa0" opacity="0.3"/>

      {/* ── Neck ── */}
      <rect x={neckX} y={neckY} width={neckW} height={neckH}
        fill="#16213e" opacity="0.75"/>
      {/* Neck border */}
      <rect x={neckX}           y={neckY} width={2}    height={neckH} fill="#9b89c4"/>
      <rect x={neckX + neckW - 2} y={neckY} width={2}  height={neckH} fill="#9b89c4"/>
      {/* Neck highlight */}
      <rect x={neckX + neckW * 0.15} y={neckY + 3} width={4} height={neckH - 6}
        fill="#fdfcff" opacity="0.10"/>

      {/* ── Shoulders + Body glass ── */}
      {/* Glass fill */}
      <path d={jarOutline} fill="#16213e" opacity="0.72"/>
      {/* Glass gradient overlay */}
      <path d={jarOutline} fill="url(#glassGrad)"/>

      {/* Liquid fill */}
      {fillFraction > 0 && (
        <g clipPath="url(#jarClip)">
          {/* Liquid body */}
          <rect x={bodyX} y={liquidY} width={bodyW} height={liquidH} fill="url(#liquidGrad)"/>
          {/* Inner glow pulse */}
          <rect x={bodyX + bodyW * 0.1} y={liquidY + liquidH * 0.25}
            width={bodyW * 0.8} height={liquidH * 0.5}
            fill="#ffe066" opacity={0.14 * glowPulse}/>
          {/* Sparkles — twinkling pixels inside the liquid */}
          {liquidH > 6 && _SPARKLES.map((sp, i) => {
            const sy = liquidY + liquidH * sp.yf;
            if (sy > bodyBottom - 3) return null;
            return (
              <rect key={i}
                x={bodyX + bodyW * sp.xf} y={sy}
                width={2} height={2}
                fill="#fdfcff"
                style={{ animation: `twinkle ${sp.dur} ${sp.delay} alternate infinite ease-in-out` }}
              />
            );
          })}
          {/* Surface shimmer line */}
          <rect x={bodyX + 4} y={liquidY} width={bodyW - 8} height={3}
            fill="#fdfcff" opacity="0.72"/>
          {/* Small surface highlight accents */}
          <rect x={bodyX + bodyW * 0.22} y={liquidY + 1} width={6} height={2}
            fill="#fdfcff" opacity="0.45"/>
          <rect x={bodyX + bodyW * 0.62} y={liquidY + 2} width={4} height={2}
            fill="#fdfcff" opacity="0.30"/>
          {/* Glow halo just above the liquid surface */}
          <rect x={bodyX} y={Math.max(liquidY - 14, bodyY)} width={bodyW} height={16}
            fill="#ffe066" opacity={0.07 * glowPulse}/>
        </g>
      )}

      {/* Centre ambient glow inside jar */}
      <rect x={bodyX + bodyW * 0.2} y={bodyY + bodyH * 0.15}
        width={bodyW * 0.6} height={bodyH * 0.55}
        fill="#ffe066" opacity={0.04 * glowPulse}
        clipPath="url(#jarClip)"/>

      {/* Highlight stripe — left edge */}
      <rect x={bodyX + bodyW * 0.12} y={bodyY + 4} width={5} height={bodyH - 8}
        fill="#fdfcff" opacity="0.13" clipPath="url(#jarClip)"/>
      <rect x={bodyX + bodyW * 0.17} y={bodyY + 4} width={2} height={bodyH - 8}
        fill="#fdfcff" opacity="0.06" clipPath="url(#jarClip)"/>

      {/* Jar outline stroke */}
      <path d={jarOutline} fill="none" stroke="#9b89c4" strokeWidth="2"/>
      {/* Neck top edge (where neck meets band) */}
      <line x1={neckX} y1={neckY} x2={neckX + neckW} y2={neckY}
        stroke="#9b89c4" strokeWidth="2"/>

      {/* ── Base ── */}
      <rect x={baseX} y={bodyBottom} width={baseW} height={baseH} rx={4}
        fill="#c9b8f0"/>
      <rect x={baseX} y={bodyBottom} width={baseW} height={3}
        fill="#7a6fa0" opacity="0.5"/>
      <rect x={baseX + 3} y={bodyBottom + baseH} width={baseW} height={4} rx={2}
        fill="#7a6fa0" opacity="0.3"/>
      <rect x={baseX} y={bodyBottom} width={2} height={baseH} fill="#7a6fa0" opacity="0.4"/>
      <rect x={baseX + baseW - 2} y={bodyBottom} width={2} height={baseH} fill="#7a6fa0" opacity="0.4"/>
    </svg>
  );
}

Object.assign(window, { JarSVG });
