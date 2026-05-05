// Zodiac avatar pool, AvatarDisplay, and AvatarPicker grid.
// Next.js migration: export { AVATARS, AVATAR_NAMES, AvatarDisplay, AvatarPicker }

const AVATARS = {
  avatar_01: () => (
    // Rat — warm grey body so it doesn't blend into purple card backgrounds
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="18" y="32" width="28" height="22" fill="#a8a8be"/>
      <rect x="16" y="14" width="32" height="24" fill="#a8a8be"/>
      <rect x="10" y="10" width="10" height="10" fill="#a8a8be"/>
      <rect x="44" y="10" width="10" height="10" fill="#a8a8be"/>
      <rect x="12" y="12" width="6"  height="6"  fill="#f7cac9"/>
      <rect x="46" y="12" width="6"  height="6"  fill="#f7cac9"/>
      <rect x="28" y="32" width="8"  height="4"  fill="#f7cac9"/>
      <rect x="30" y="34" width="4"  height="2"  fill="#c98a88"/>
      <rect x="20" y="22" width="6"  height="6"  fill="#2d2b3d"/>
      <rect x="38" y="22" width="6"  height="6"  fill="#2d2b3d"/>
      <rect x="38" y="22" width="6"  height="2"  fill="#2d2b3d"/>
      <rect x="38" y="24" width="6"  height="4"  fill="#a8a8be"/>
      <rect x="20" y="22" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="24" y="34" width="16" height="2"  fill="#2d2b3d"/>
      <rect x="22" y="32" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="38" y="32" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="4"  y="28" width="12" height="2"  fill="#7a6fa0"/>
      <rect x="48" y="28" width="12" height="2"  fill="#7a6fa0"/>
      <rect x="4"  y="32" width="10" height="2"  fill="#7a6fa0"/>
      <rect x="50" y="32" width="10" height="2"  fill="#7a6fa0"/>
      <rect x="18" y="52" width="10" height="6"  fill="#b5ead7"/>
      <rect x="36" y="52" width="10" height="6"  fill="#b5ead7"/>
    </svg>
  ),
  avatar_02: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="16" y="32" width="32" height="22" fill="#b5ead7"/>
      <rect x="14" y="12" width="36" height="26" fill="#b5ead7"/>
      <rect x="14" y="6"  width="6"  height="10" fill="#ffeaa7"/>
      <rect x="44" y="6"  width="6"  height="10" fill="#ffeaa7"/>
      <rect x="12" y="8"  width="6"  height="6"  fill="#ffeaa7"/>
      <rect x="46" y="8"  width="6"  height="6"  fill="#ffeaa7"/>
      <rect x="22" y="28" width="20" height="10" fill="#fdfcff"/>
      <rect x="26" y="32" width="4"  height="4"  fill="#c9b8f0"/>
      <rect x="34" y="32" width="4"  height="4"  fill="#c9b8f0"/>
      <rect x="18" y="22" width="10" height="2"  fill="#2d2b3d"/>
      <rect x="36" y="22" width="10" height="2"  fill="#2d2b3d"/>
      <rect x="24" y="36" width="16" height="2"  fill="#2d2b3d"/>
      <rect x="22" y="34" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="38" y="34" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="8"  y="18" width="8"  height="10" fill="#b5ead7"/>
      <rect x="48" y="18" width="8"  height="10" fill="#b5ead7"/>
      <rect x="16" y="52" width="12" height="6"  fill="#6aab90"/>
      <rect x="36" y="52" width="12" height="6"  fill="#6aab90"/>
    </svg>
  ),
  avatar_03: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="16" y="32" width="32" height="22" fill="#ffeaa7"/>
      <rect x="12" y="12" width="40" height="26" fill="#ffeaa7"/>
      <rect x="12" y="6"  width="12" height="12" fill="#ffeaa7"/>
      <rect x="40" y="6"  width="12" height="12" fill="#ffeaa7"/>
      <rect x="14" y="8"  width="8"  height="8"  fill="#f7cac9"/>
      <rect x="42" y="8"  width="8"  height="8"  fill="#f7cac9"/>
      <rect x="12" y="14" width="4"  height="8"  fill="#c9a84c"/>
      <rect x="48" y="14" width="4"  height="8"  fill="#c9a84c"/>
      <rect x="28" y="12" width="8"  height="4"  fill="#c9a84c"/>
      <rect x="20" y="32" width="4"  height="12" fill="#c9a84c"/>
      <rect x="40" y="32" width="4"  height="12" fill="#c9a84c"/>
      <rect x="20" y="26" width="24" height="10" fill="#fdfcff"/>
      <rect x="28" y="28" width="8"  height="4"  fill="#f7cac9"/>
      <rect x="16" y="20" width="8"  height="8"  fill="#2d2b3d"/>
      <rect x="40" y="20" width="8"  height="8"  fill="#2d2b3d"/>
      <rect x="16" y="20" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="40" y="20" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="20" y="34" width="24" height="2"  fill="#2d2b3d"/>
      <rect x="18" y="32" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="42" y="32" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="22" y="36" width="4"  height="2"  fill="#fdfcff"/>
      <rect x="38" y="36" width="4"  height="2"  fill="#fdfcff"/>
      <rect x="16" y="52" width="12" height="6"  fill="#c9a84c"/>
      <rect x="36" y="52" width="12" height="6"  fill="#c9a84c"/>
    </svg>
  ),
  avatar_04: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="14" y="2"  width="10" height="24" fill="#fdfcff"/>
      <rect x="40" y="2"  width="10" height="24" fill="#fdfcff"/>
      <rect x="16" y="4"  width="6"  height="20" fill="#f7cac9"/>
      <rect x="42" y="4"  width="6"  height="20" fill="#f7cac9"/>
      <rect x="16" y="34" width="32" height="20" fill="#fdfcff"/>
      <rect x="14" y="14" width="36" height="26" fill="#fdfcff"/>
      <rect x="14" y="28" width="10" height="6"  fill="#f7cac9" opacity="0.7"/>
      <rect x="40" y="28" width="10" height="6"  fill="#f7cac9" opacity="0.7"/>
      <rect x="20" y="22" width="6"  height="6"  fill="#2d2b3d"/>
      <rect x="38" y="22" width="6"  height="6"  fill="#2d2b3d"/>
      <rect x="20" y="22" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="38" y="22" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="28" y="30" width="8"  height="4"  fill="#f7cac9"/>
      <rect x="24" y="34" width="16" height="2"  fill="#2d2b3d"/>
      <rect x="22" y="32" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="38" y="32" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="12" y="52" width="16" height="8"  fill="#fdfcff"/>
      <rect x="36" y="52" width="16" height="8"  fill="#fdfcff"/>
    </svg>
  ),
  avatar_05: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="18" y="32" width="28" height="20" fill="#b5ead7"/>
      <rect x="44" y="40" width="8"  height="6"  fill="#b5ead7"/>
      <rect x="50" y="46" width="6"  height="4"  fill="#b5ead7"/>
      <rect x="54" y="48" width="4"  height="4"  fill="#6aab90"/>
      <rect x="14" y="14" width="34" height="24" fill="#b5ead7"/>
      <rect x="18" y="6"  width="6"  height="12" fill="#ffeaa7"/>
      <rect x="38" y="6"  width="6"  height="12" fill="#ffeaa7"/>
      <rect x="22" y="4"  width="4"  height="4"  fill="#c9a84c"/>
      <rect x="38" y="4"  width="4"  height="4"  fill="#c9a84c"/>
      <rect x="40" y="26" width="10" height="8"  fill="#6aab90"/>
      <rect x="44" y="28" width="4"  height="4"  fill="#fdfcff"/>
      <rect x="18" y="20" width="8"  height="8"  fill="#2d2b3d"/>
      <rect x="34" y="20" width="8"  height="8"  fill="#2d2b3d"/>
      <rect x="18" y="20" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="34" y="20" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="18" y="34" width="22" height="2"  fill="#2d2b3d"/>
      <rect x="4"  y="8"  width="4"  height="4"  fill="#ffe066"/>
      <rect x="6"  y="6"  width="2"  height="8"  fill="#ffe066"/>
      <rect x="2"  y="10" width="8"  height="2"  fill="#ffe066"/>
      <rect x="54" y="14" width="4"  height="4"  fill="#ffe066"/>
      <rect x="56" y="12" width="2"  height="8"  fill="#ffe066"/>
      <rect x="52" y="16" width="8"  height="2"  fill="#ffe066"/>
      <rect x="6"  y="32" width="14" height="10" fill="#6aab90" opacity="0.7"/>
      <rect x="44" y="32" width="14" height="10" fill="#6aab90" opacity="0.7"/>
      <rect x="18" y="50" width="10" height="6"  fill="#6aab90"/>
      <rect x="36" y="50" width="10" height="6"  fill="#6aab90"/>
    </svg>
  ),
  avatar_06: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="10" y="40" width="44" height="10" fill="#b5ead7"/>
      <rect x="10" y="48" width="44" height="8"  fill="#6aab90"/>
      <rect x="16" y="46" width="32" height="6"  fill="#b5ead7"/>
      <rect x="24" y="28" width="16" height="14" fill="#b5ead7"/>
      <rect x="16" y="12" width="32" height="22" fill="#b5ead7"/>
      <rect x="18" y="18" width="10" height="8"  fill="#2d2b3d"/>
      <rect x="36" y="18" width="10" height="8"  fill="#2d2b3d"/>
      <rect x="18" y="18" width="10" height="4"  fill="#b5ead7"/>
      <rect x="36" y="18" width="10" height="4"  fill="#b5ead7"/>
      <rect x="18" y="22" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="36" y="22" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="28" y="32" width="8"  height="2"  fill="#ffb7b2"/>
      <rect x="26" y="34" width="4"  height="2"  fill="#ffb7b2"/>
      <rect x="34" y="34" width="4"  height="2"  fill="#ffb7b2"/>
      <rect x="22" y="30" width="20" height="2"  fill="#2d2b3d"/>
      <rect x="24" y="42" width="6"  height="6"  fill="#6aab90"/>
      <rect x="34" y="44" width="6"  height="6"  fill="#6aab90"/>
    </svg>
  ),
  avatar_07: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="16" y="32" width="32" height="22" fill="#ffeaa7"/>
      <rect x="14" y="12" width="36" height="26" fill="#ffeaa7"/>
      <rect x="14" y="10" width="8"  height="14" fill="#c9a84c"/>
      <rect x="18" y="8"  width="6"  height="10" fill="#c9a84c"/>
      <rect x="22" y="6"  width="6"  height="8"  fill="#c9a84c"/>
      <rect x="18" y="28" width="28" height="10" fill="#ffb7b2"/>
      <rect x="22" y="32" width="6"  height="4"  fill="#c98a88"/>
      <rect x="36" y="32" width="6"  height="4"  fill="#c98a88"/>
      <rect x="16" y="18" width="10" height="10" fill="#2d2b3d"/>
      <rect x="38" y="18" width="10" height="10" fill="#2d2b3d"/>
      <rect x="16" y="18" width="4"  height="4"  fill="#fdfcff"/>
      <rect x="38" y="18" width="4"  height="4"  fill="#fdfcff"/>
      <rect x="18" y="20" width="2"  height="2"  fill="#2d2b3d"/>
      <rect x="40" y="20" width="2"  height="2"  fill="#2d2b3d"/>
      <rect x="22" y="36" width="20" height="2"  fill="#2d2b3d"/>
      <rect x="42" y="8"  width="8"  height="12" fill="#ffeaa7"/>
      <rect x="44" y="10" width="4"  height="8"  fill="#f7cac9"/>
      <rect x="16" y="52" width="8"  height="8"  fill="#c9a84c"/>
      <rect x="28" y="52" width="8"  height="8"  fill="#c9a84c"/>
      <rect x="40" y="52" width="8"  height="8"  fill="#c9a84c"/>
    </svg>
  ),
  avatar_08: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="16" y="34" width="32" height="20" fill="#fdfcff"/>
      <rect x="14" y="14" width="36" height="26" fill="#fdfcff"/>
      <rect x="16" y="8"  width="8"  height="10" fill="#c9b8f0"/>
      <rect x="40" y="8"  width="8"  height="10" fill="#c9b8f0"/>
      <rect x="18" y="6"  width="6"  height="6"  fill="#c9b8f0"/>
      <rect x="40" y="6"  width="6"  height="6"  fill="#c9b8f0"/>
      <rect x="28" y="14" width="8"  height="2"  fill="#ffe066"/>
      <rect x="30" y="12" width="4"  height="6"  fill="#ffe066"/>
      <rect x="26" y="16" width="12" height="2"  fill="#ffe066"/>
      <rect x="18" y="22" width="8"  height="6"  fill="#2d2b3d"/>
      <rect x="38" y="22" width="8"  height="6"  fill="#2d2b3d"/>
      <rect x="18" y="22" width="8"  height="2"  fill="#fdfcff"/>
      <rect x="38" y="22" width="8"  height="2"  fill="#fdfcff"/>
      <rect x="20" y="24" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="40" y="24" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="22" y="30" width="20" height="8"  fill="#f7cac9"/>
      <rect x="24" y="36" width="16" height="2"  fill="#2d2b3d"/>
      <rect x="26" y="38" width="12" height="6"  fill="#fdfcff"/>
      <rect x="28" y="44" width="8"  height="4"  fill="#e8e6f0"/>
      <rect x="6"  y="18" width="10" height="8"  fill="#fdfcff"/>
      <rect x="48" y="18" width="10" height="8"  fill="#fdfcff"/>
      <rect x="16" y="52" width="10" height="6"  fill="#c9b8f0"/>
      <rect x="38" y="52" width="10" height="6"  fill="#c9b8f0"/>
    </svg>
  ),
  avatar_09: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="18" y="32" width="28" height="20" fill="#ffb7b2"/>
      <rect x="12" y="12" width="40" height="28" fill="#ffb7b2"/>
      <rect x="4"  y="16" width="12" height="14" fill="#ffb7b2"/>
      <rect x="48" y="16" width="12" height="14" fill="#ffb7b2"/>
      <rect x="6"  y="18" width="8"  height="10" fill="#f7cac9"/>
      <rect x="50" y="18" width="8"  height="10" fill="#f7cac9"/>
      <rect x="18" y="22" width="28" height="16" fill="#ffeaa7"/>
      <rect x="16" y="16" width="12" height="12" fill="#2d2b3d"/>
      <rect x="36" y="16" width="12" height="12" fill="#2d2b3d"/>
      <rect x="16" y="16" width="6"  height="6"  fill="#fdfcff"/>
      <rect x="36" y="16" width="6"  height="6"  fill="#fdfcff"/>
      <rect x="18" y="18" width="4"  height="4"  fill="#2d2b3d"/>
      <rect x="38" y="18" width="4"  height="4"  fill="#2d2b3d"/>
      <rect x="18" y="18" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="38" y="18" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="28" y="28" width="8"  height="4"  fill="#c98a88"/>
      <rect x="20" y="34" width="24" height="2"  fill="#2d2b3d"/>
      <rect x="18" y="32" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="42" y="32" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="8"  y="38" width="12" height="8"  fill="#ffb7b2"/>
      <rect x="44" y="38" width="12" height="8"  fill="#ffb7b2"/>
      <rect x="18" y="50" width="10" height="8"  fill="#f7cac9"/>
      <rect x="36" y="50" width="10" height="8"  fill="#f7cac9"/>
    </svg>
  ),
  avatar_10: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      <rect x="6"  y="14" width="14" height="22" fill="#c9a84c"/>
      <rect x="44" y="14" width="14" height="22" fill="#c9a84c"/>
      <rect x="16" y="34" width="32" height="20" fill="#ffeaa7"/>
      <rect x="14" y="12" width="36" height="28" fill="#ffeaa7"/>
      <rect x="18" y="28" width="28" height="12" fill="#fdfcff"/>
      <rect x="26" y="30" width="12" height="6"  fill="#2d2b3d"/>
      <rect x="28" y="30" width="4"  height="2"  fill="#7a6fa0"/>
      <rect x="16" y="18" width="10" height="10" fill="#2d2b3d"/>
      <rect x="38" y="18" width="10" height="10" fill="#2d2b3d"/>
      <rect x="16" y="18" width="4"  height="4"  fill="#fdfcff"/>
      <rect x="38" y="18" width="4"  height="4"  fill="#fdfcff"/>
      <rect x="18" y="20" width="2"  height="2"  fill="#2d2b3d"/>
      <rect x="40" y="20" width="2"  height="2"  fill="#2d2b3d"/>
      <rect x="20" y="36" width="24" height="2"  fill="#2d2b3d"/>
      <rect x="18" y="34" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="42" y="34" width="4"  height="2"  fill="#2d2b3d"/>
      <rect x="28" y="38" width="8"  height="6"  fill="#f7cac9"/>
      <rect x="46" y="30" width="10" height="6"  fill="#ffeaa7"/>
      <rect x="52" y="24" width="6"  height="10" fill="#ffeaa7"/>
      <rect x="14" y="52" width="12" height="8"  fill="#c9a84c"/>
      <rect x="38" y="52" width="12" height="8"  fill="#c9a84c"/>
    </svg>
  ),
  avatar_11: () => (
    // Pig
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      {/* Body */}
      <rect x="14" y="34" width="36" height="22" fill="#f7cac9"/>
      {/* Head */}
      <rect x="14" y="12" width="36" height="28" fill="#f7cac9"/>
      {/* Left ear */}
      <rect x="8"  y="6"  width="14" height="16" fill="#f7cac9"/>
      <rect x="10" y="8"  width="10" height="12" fill="#ffb7b2"/>
      {/* Right ear */}
      <rect x="42" y="6"  width="14" height="16" fill="#f7cac9"/>
      <rect x="44" y="8"  width="10" height="12" fill="#ffb7b2"/>
      {/* Snout */}
      <rect x="20" y="28" width="24" height="14" fill="#ffb7b2"/>
      {/* Nostrils */}
      <rect x="24" y="32" width="5"  height="5"  fill="#c98a88"/>
      <rect x="35" y="32" width="5"  height="5"  fill="#c98a88"/>
      {/* Eyes */}
      <rect x="17" y="20" width="8"  height="6"  fill="#2d2b3d"/>
      <rect x="39" y="20" width="8"  height="6"  fill="#2d2b3d"/>
      <rect x="17" y="20" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="39" y="20" width="2"  height="2"  fill="#fdfcff"/>
      {/* Smile */}
      <rect x="24" y="40" width="16" height="2"  fill="#c98a88"/>
      <rect x="22" y="38" width="4"  height="2"  fill="#c98a88"/>
      <rect x="38" y="38" width="4"  height="2"  fill="#c98a88"/>
      {/* Legs */}
      <rect x="18" y="54" width="8"  height="8"  fill="#f7cac9"/>
      <rect x="38" y="54" width="8"  height="8"  fill="#f7cac9"/>
      <rect x="18" y="58" width="8"  height="4"  fill="#ffb7b2"/>
      <rect x="38" y="58" width="8"  height="4"  fill="#ffb7b2"/>
      {/* Curly tail */}
      <rect x="48" y="34" width="6"  height="4"  fill="#f7cac9"/>
      <rect x="52" y="38" width="4"  height="6"  fill="#f7cac9"/>
      <rect x="48" y="44" width="6"  height="3"  fill="#ffb7b2"/>
    </svg>
  ),
  avatar_12: () => (
    // Rooster
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      {/* Colourful tail feathers behind body */}
      <rect x="6"  y="18" width="12" height="6"  fill="#ffe066"/>
      <rect x="4"  y="24" width="14" height="6"  fill="#b5f0c0"/>
      <rect x="4"  y="30" width="14" height="6"  fill="#c4d4f8"/>
      <rect x="6"  y="36" width="10" height="6"  fill="#f7cac9"/>
      {/* Body */}
      <rect x="16" y="32" width="32" height="22" fill="#ffeaa7"/>
      {/* Head */}
      <rect x="18" y="12" width="28" height="26" fill="#ffeaa7"/>
      {/* Red comb — three bumps */}
      <rect x="22" y="4"  width="6"  height="10" fill="#c98a88"/>
      <rect x="29" y="2"  width="8"  height="12" fill="#c98a88"/>
      <rect x="38" y="4"  width="6"  height="10" fill="#c98a88"/>
      {/* Eyes */}
      <rect x="22" y="20" width="8"  height="6"  fill="#2d2b3d"/>
      <rect x="38" y="20" width="8"  height="6"  fill="#2d2b3d"/>
      <rect x="22" y="20" width="2"  height="2"  fill="#fdfcff"/>
      <rect x="38" y="20" width="2"  height="2"  fill="#fdfcff"/>
      {/* Beak */}
      <rect x="28" y="28" width="8"  height="4"  fill="#c9a84c"/>
      <rect x="30" y="32" width="4"  height="4"  fill="#c9a84c"/>
      {/* Red wattle */}
      <rect x="26" y="32" width="12" height="8"  fill="#c98a88"/>
      <rect x="28" y="38" width="8"  height="4"  fill="#c98a88"/>
      {/* Wing stripe */}
      <rect x="18" y="40" width="28" height="4"  fill="#c9a84c" opacity="0.55"/>
      {/* Legs */}
      <rect x="22" y="52" width="6"  height="8"  fill="#c9a84c"/>
      <rect x="36" y="52" width="6"  height="8"  fill="#c9a84c"/>
      {/* Feet */}
      <rect x="14" y="58" width="18" height="2"  fill="#c9a84c"/>
      <rect x="32" y="58" width="18" height="2"  fill="#c9a84c"/>
      <rect x="20" y="60" width="4"  height="2"  fill="#c9a84c"/>
      <rect x="40" y="60" width="4"  height="2"  fill="#c9a84c"/>
    </svg>
  ),
};

const AVATAR_NAMES = {
  avatar_01: 'Rat',     avatar_02: 'Ox',      avatar_03: 'Tiger',
  avatar_04: 'Rabbit',  avatar_05: 'Dragon',   avatar_06: 'Snake',
  avatar_07: 'Horse',   avatar_08: 'Goat',     avatar_09: 'Monkey',
  avatar_10: 'Dog',     avatar_11: 'Pig',      avatar_12: 'Rooster',
};

function AvatarDisplay({ avatarId, size = 64 }) {
  const AvatarComponent = AVATARS[avatarId] || AVATARS['avatar_01'];
  const scale = size / 64;
  return (
    <div style={{ width: size, height: size, display: 'inline-block', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 64, height: 64 }}>
        <AvatarComponent />
      </div>
    </div>
  );
}

function AvatarPicker({ currentId, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
      {Object.keys(AVATARS).map(id => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          style={{
            background:    currentId === id ? '#c9b8f0' : '#16213e',
            border:        `2px solid ${currentId === id ? '#7a6fa0' : '#9b89c4'}`,
            borderRadius:   8,
            padding:        4,
            cursor:        'pointer',
            boxShadow:     currentId === id ? '3px 3px 0px #7a6fa0' : '2px 2px 0px #4a3f6e',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:            3,
          }}
        >
          <AvatarDisplay avatarId={id} size={36}/>
          <span style={{
            fontFamily: "'Fredoka'",
            fontSize:    10,
            color:      currentId === id ? '#2d2b3d' : '#9b89c4',
          }}>
            {AVATAR_NAMES[id]}
          </span>
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { AVATARS, AVATAR_NAMES, AvatarDisplay, AvatarPicker });
