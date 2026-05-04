// Star pull logic + tag helpers
// Next.js migration: export { pullRandomStar, getAllTags }

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
