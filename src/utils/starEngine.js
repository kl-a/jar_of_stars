// Star pull logic + tag helpers
// Next.js migration: export { pullRandomStar, getAllTags, getStarColor }

function pullRandomStar(stars, favouritesOnly) {
  const pool = favouritesOnly ? stars.filter(s => s.favourite) : stars;
  const activePool = pool.length > 0 ? pool : stars;
  if (activePool.length === 0) return null;
  return activePool[Math.floor(Math.random() * activePool.length)];
}

function getAllTags(stars) {
  const tags = new Set();
  stars.forEach(s => s.tags.forEach(t => tags.add(t)));
  return [...tags];
}

// Konpeito palette — soft pastel star-candy colours, one per star (deterministic from star_id)
const _KONPEITO = [
  { color: '#ffb3c1', shadow: '#d47a8a' },  // rose
  { color: '#ffe4a0', shadow: '#c9a84c' },  // butter
  { color: '#b5f0c0', shadow: '#6aab90' },  // mint
  { color: '#c4d4f8', shadow: '#7a9fd4' },  // periwinkle
  { color: '#d4b8f0', shadow: '#9b89c4' },  // lavender
  { color: '#ffd4b8', shadow: '#c9935a' },  // peach
  { color: '#f7cac9', shadow: '#c98a88' },  // blush
  { color: '#b8e8f0', shadow: '#6aaab5' },  // sky
];

function getStarColor(star_id) {
  let h = 0;
  for (let i = 0; i < star_id.length; i++) {
    h = (Math.imul(31, h) + star_id.charCodeAt(i)) | 0;
  }
  return _KONPEITO[Math.abs(h) % _KONPEITO.length];
}

Object.assign(window, { getStarColor });
