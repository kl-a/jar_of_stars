// Collection page — searchable, filterable star card list.
// Filters: favourites toggle, person (single-select), tag (single-select), sort order.
// Next.js migration: export default function CollectionPage(...)

function CollectionPage({ stars, people, onNavigate }) {
  const [expandedStar, setExpandedStar] = React.useState(null);
  const [favOnly,      setFavOnly]      = React.useState(false);
  const [filterPerson, setFilterPerson] = React.useState('');
  const [filterTag,    setFilterTag]    = React.useState('');
  const [sortBy,       setSortBy]       = React.useState('newest');
  const [search,       setSearch]       = React.useState('');
  const allTags = window.store.getAllTags();

  const selectStyle = {
    fontFamily:  "'Fredoka'",
    fontSize:     12,
    background:  '#16213e',
    border:      '2px solid #9b89c4',
    borderRadius: 6,
    padding:     '6px 8px',
    color:       '#9b89c4',
    cursor:      'pointer',
    outline:     'none',
  };

  function handleToggleFavourite(id, val) { window.store.updateStar(id, { favourite: val }); }
  function handleDelete(id)               { window.store.deleteStar(id); }

  let filtered = [...stars];
  if (favOnly)       filtered = filtered.filter(s => s.favourite);
  if (filterPerson)  filtered = filtered.filter(s => (s.from_people_ids || []).includes(filterPerson));
  if (filterTag)     filtered = filtered.filter(s => (s.tags || []).includes(filterTag));
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s =>
      s.message.toLowerCase().includes(q) || (s.tags || []).some(t => t.includes(q))
    );
  }
  filtered.sort((a, b) => {
    if (sortBy === 'newest')      return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest')      return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'most-pulled') return b.pull_count - a.pull_count;
    if (sortBy === 'least-pulled')return a.pull_count - b.pull_count;
    if (sortBy === 'alpha')       return a.message.localeCompare(b.message);
    return 0;
  });

  return (
    <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <PixelStar size={16}/>
        <span style={{ fontFamily: "'Fredoka'", fontSize: 18, color: '#fdfcff' }}>Collection</span>
        <span style={{
          marginLeft:  'auto',
          fontFamily:  "'Fredoka'",
          fontSize:     14,
          background:  '#9b89c4',
          border:      '2px solid #7a6fa0',
          borderRadius: 4,
          padding:     '3px 8px',
          color:       '#fdfcff',
          boxShadow:   '2px 2px 0 #7a6fa0',
        }}>{stars.length}</span>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search memories..."
        style={{
          width:        '100%',
          boxSizing:    'border-box',
          background:   '#16213e',
          border:       '2px solid #9b89c4',
          borderRadius:  6,
          padding:      '10px 14px',
          color:        '#fdfcff',
          fontFamily:   "'Fredoka'",
          fontSize:      14,
          outline:      'none',
          marginBottom:  12,
          lineHeight:    2,
        }}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {/* Favourites toggle */}
        <button
          onClick={() => setFavOnly(!favOnly)}
          style={{
            fontFamily:  "'Fredoka'",
            fontSize:     12,
            background:   favOnly ? '#f7cac9' : '#16213e',
            border:      `2px solid ${favOnly ? '#c98a88' : '#9b89c4'}`,
            borderRadius:  6,
            padding:     '6px 10px',
            cursor:      'pointer',
            color:        favOnly ? '#2d2b3d' : '#9b89c4',
            boxShadow:    favOnly ? '2px 2px 0 #c98a88' : '2px 2px 0 #4a3f6e',
          }}
        >♥ Favs</button>

        {/* Person filter */}
        {people.length > 0 && (
          <select value={filterPerson} onChange={e => setFilterPerson(e.target.value)} style={selectStyle}>
            <option value="">All people</option>
            {people.map(p => (
              <option key={p.people_id} value={p.people_id}>{p.name}</option>
            ))}
          </select>
        )}

        {/* Tag filter */}
        {allTags.length > 0 && (
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)} style={selectStyle}>
            <option value="">All tags</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        )}

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most-pulled">Most Pulled</option>
          <option value="least-pulled">Least Pulled</option>
          <option value="alpha">A–Z</option>
        </select>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9b89c4' }}>
          <PixelStar size={32} color="#9b89c4" shadowColor="#7a6fa0" style={{ opacity: 0.5 }}/>
          <div style={{ fontFamily: "'Fredoka'", fontSize: 16, marginTop: 16, color: '#7a6fa0' }}>
            {stars.length === 0 ? 'No stars yet' : 'No matches'}
          </div>
          {stars.length === 0 && (
            <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#7a6fa0', marginTop: 10, lineHeight: 2 }}>
              Add your first memory from the home page ✦
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(star => (
            <StarCard
              key={star.star_id}
              star={star}
              people={people}
              onToggleFavourite={handleToggleFavourite}
              onExpand={() => setExpandedStar(star)}
            />
          ))}
        </div>
      )}

      {expandedStar && (
        <StarExpandModal
          star={stars.find(s => s.star_id === expandedStar.star_id) || expandedStar}
          people={people}
          onClose={() => setExpandedStar(null)}
          onToggleFavourite={handleToggleFavourite}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

Object.assign(window, { CollectionPage });
