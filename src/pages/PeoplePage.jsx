// People page — searchable person grid with Add Person modal.
// Next.js migration: export default function PeoplePage(...)

const _peopleInputStyle = {
  width:        '100%',
  boxSizing:    'border-box',
  background:   '#16213e',
  border:       '2px solid #9b89c4',
  borderRadius:  6,
  padding:      '10px 12px',
  color:        '#fdfcff',
  fontFamily:   "'Fredoka'",
  fontSize:      14,
  outline:      'none',
  lineHeight:    2,
};

function AddPersonModal({ onClose, onAdded }) {
  const [visible,  setVisible]  = React.useState(false);
  const [name,     setName]     = React.useState('');
  const [avatarId, setAvatarId] = React.useState('avatar_01');

  React.useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  function handleSave() {
    if (!name.trim()) return;
    const person = window.store.addPerson({ name: name.trim(), avatar_id: avatarId });
    setVisible(false);
    setTimeout(() => { onAdded(person); onClose(); }, 300);
  }

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const isMobile = window.innerWidth < 640;

  return (
    <ModalOverlay onClose={handleClose} center={!isMobile}>
      <div style={{
        background:   '#c9b8f0',
        border:       '2px solid #7a6fa0',
        borderRadius:  isMobile ? '8px 8px 0 0' : 8,
        boxShadow:     isMobile ? '0 -4px 0 #7a6fa0' : '4px 4px 0 #7a6fa0',
        width:        '100%',
        maxWidth:      460,
        padding:      '24px 20px 32px',
        margin:        isMobile ? 0 : '0 16px',
        transform:     visible ? (isMobile ? 'translateY(0)' : 'scale(1)') : (isMobile ? 'translateY(100%)' : 'scale(0.92)'),
        opacity:       visible ? 1 : 0,
        transition:   'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
        maxHeight:    '90vh',
        overflowY:    'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontFamily: "'Fredoka'", fontSize: 18, color: '#2d2b3d', flex: 1 }}>Add Person</span>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a6fa0', fontSize: 18 }}>×</button>
        </div>

        <label style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', display: 'block', marginBottom: 8 }}>
          AVATAR
        </label>
        <div style={{ background: '#16213e', border: '2px solid #9b89c4', borderRadius: 6, padding: 8, marginBottom: 16 }}>
          <AvatarPicker currentId={avatarId} onSelect={setAvatarId}/>
        </div>

        <label style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', display: 'block', marginBottom: 6 }}>
          NAME ✦
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="Name..."
          autoFocus
          style={{ ..._peopleInputStyle, marginBottom: 24 }}
          onFocus={e => e.target.style.borderColor = '#c9b8f0'}
          onBlur={e  => e.target.style.borderColor = '#9b89c4'}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <PixelButton onClick={handleSave} disabled={!name.trim()} small>+ Add</PixelButton>
          <PixelButton onClick={handleClose} color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff" small>Cancel</PixelButton>
        </div>
      </div>
    </ModalOverlay>
  );
}

function PeoplePage({ people, stars, onUpdate }) {
  const [selected,      setSelected]      = React.useState(null);
  const [search,        setSearch]        = React.useState('');
  const [showAddPerson, setShowAddPerson] = React.useState(false);

  const filtered = people.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  function handlePersonDeleted() {
    setSelected(null);
    onUpdate();
  }

  return (
    <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>👥</span>
        <span style={{ fontFamily: "'Fredoka'", fontSize: 18, color: '#fdfcff' }}>People</span>
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
        }}>{people.length}</span>
        <PixelButton onClick={() => setShowAddPerson(true)} color="#b5ead7" shadowColor="#6aab90" textColor="#2d2b3d" small>
          + Add
        </PixelButton>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search people..."
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
          marginBottom:  16,
          lineHeight:    2,
        }}
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9b89c4' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
          <div style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#7a6fa0' }}>
            {people.length === 0 ? 'No people yet' : 'No matches'}
          </div>
          {people.length === 0 && (
            <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#7a6fa0', marginTop: 10, lineHeight: 2 }}>
              Tag someone in a memory or press + Add ✦
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(p => (
            <PersonCard
              key={p.people_id}
              person={p}
              starCount={(p.star_ids || []).length}
              onClick={() => setSelected(p)}
            />
          ))}
        </div>
      )}

      {selected && (
        <PersonProfile
          person={people.find(p => p.people_id === selected.people_id) || selected}
          stars={stars}
          onClose={() => setSelected(null)}
          onUpdate={onUpdate}
          onDelete={handlePersonDeleted}
        />
      )}

      {showAddPerson && (
        <AddPersonModal
          onClose={() => setShowAddPerson(false)}
          onAdded={() => onUpdate()}
        />
      )}
    </div>
  );
}

Object.assign(window, { PeoplePage });
