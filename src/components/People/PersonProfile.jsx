// Person profile modal — editable name, note, avatar + linked stars list.
// Includes delete person (removes person from all linked stars automatically via store).
// Next.js migration: export function PersonProfile(...)

const _profileInputStyle = {
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

function PersonProfile({ person, stars, onClose, onUpdate, onDelete }) {
  const [visible,          setVisible]          = React.useState(false);
  const [editingName,      setEditingName]      = React.useState(false);
  const [name,             setName]             = React.useState(person.name);
  const [note,             setNote]             = React.useState(person.note || '');
  const [avatarId,         setAvatarId]         = React.useState(person.avatar_id);
  const [showAvatarPicker, setShowAvatarPicker] = React.useState(false);
  const [confirmDelete,    setConfirmDelete]    = React.useState(false);

  React.useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const linkedStars = stars.filter(s => (s.from_people_ids || []).includes(person.people_id));

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  function saveName() {
    setEditingName(false);
    if (name.trim()) {
      window.store.updatePerson(person.people_id, { name: name.trim() });
      onUpdate();
    }
  }

  function saveNote() {
    window.store.updatePerson(person.people_id, { note });
    onUpdate();
  }

  function selectAvatar(id) {
    setAvatarId(id);
    setShowAvatarPicker(false);
    window.store.updatePerson(person.people_id, { avatar_id: id });
    onUpdate();
  }

  function handleDelete() {
    window.store.deletePerson(person.people_id);
    onDelete();
    handleClose();
  }

  const panelStyle = {
    background:   '#c9b8f0',
    border:       '2px solid #7a6fa0',
    borderRadius: '8px 8px 0 0',
    boxShadow:    '0 -4px 0px #7a6fa0',
    width:        '100%',
    maxWidth:      540,
    maxHeight:    '90vh',
    overflowY:    'auto',
    padding:      '24px 20px 80px',
    transform:     visible ? 'translateY(0)' : 'translateY(100%)',
    opacity:       visible ? 1 : 0,
    transition:   'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease',
  };

  return (
    <ModalOverlay onClose={handleClose}>
      <div style={panelStyle}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#2d2b3d', flex: 1 }}>Profile</span>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a6fa0', fontSize: 18 }}
          >×</button>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          <div
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}
          >
            <AvatarDisplay avatarId={avatarId} size={80}/>
            <div style={{
              position:    'absolute',
              bottom:       0,
              right:        0,
              background:  '#ffeaa7',
              border:      '2px solid #c9a84c',
              borderRadius: 4,
              padding:     '2px 4px',
              fontFamily:  "'Fredoka'",
              fontSize:     11,
              color:       '#2d2b3d',
              boxShadow:   '1px 1px 0 #c9a84c',
            }}>Edit</div>
          </div>
          {showAvatarPicker && (
            <div style={{
              marginTop:   12,
              background:  '#16213e',
              border:      '2px solid #9b89c4',
              borderRadius: 6,
              padding:      12,
              boxShadow:   '3px 3px 0 #7a6fa0',
            }}>
              <AvatarPicker currentId={avatarId} onSelect={selectAvatar}/>
            </div>
          )}
        </div>

        {/* Name */}
        <label style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', display: 'block', marginBottom: 6 }}>
          NAME
        </label>
        {editingName ? (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus
              style={{ ..._profileInputStyle, flex: 1, borderColor: '#c9b8f0' }}
            />
            <PixelButton onClick={saveName} small color="#b5ead7" shadowColor="#6aab90">Save</PixelButton>
          </div>
        ) : (
          <div
            onClick={() => setEditingName(true)}
            style={{
              fontFamily:   "'Fredoka'",
              fontSize:      16,
              color:        '#2d2b3d',
              marginBottom:  16,
              cursor:       'text',
              padding:      '6px 0',
              borderBottom: '2px dashed #9b89c4',
              lineHeight:    1.8,
            }}
          >{name}</div>
        )}

        {/* Note */}
        <label style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', display: 'block', marginBottom: 6 }}>
          NOTE
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="A note about this person..."
          rows={3}
          style={{ ..._profileInputStyle, resize: 'vertical', marginBottom: 20 }}
          onFocus={e => e.target.style.borderColor = '#c9b8f0'}
          onBlur={e  => { e.target.style.borderColor = '#9b89c4'; saveNote(); }}
        />

        {/* Linked stars */}
        <div style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', marginBottom: 12 }}>
          ✦ {linkedStars.length} {linkedStars.length === 1 ? 'STAR' : 'STARS'}
        </div>
        {linkedStars.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {linkedStars.slice(0, 5).map(s => (
              <div key={s.star_id} style={{
                background:   s.favourite ? '#f7cac9' : 'rgba(201,184,240,0.5)',
                border:       `2px solid ${s.favourite ? '#c98a88' : '#7a6fa0'}`,
                borderRadius:  6,
                padding:      '10px 12px',
                fontFamily:   "'Fredoka'",
                fontSize:      12,
                color:        '#2d2b3d',
                lineHeight:    1.8,
              }}>
                {s.favourite && <span style={{ marginRight: 6 }}>♥</span>}
                {s.message.length > 80 ? s.message.slice(0, 80) + '…' : s.message}
              </div>
            ))}
            {linkedStars.length > 5 && (
              <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#9b89c4', textAlign: 'center', marginTop: 4 }}>
                + {linkedStars.length - 5} more
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#9b89c4', lineHeight: 2, marginBottom: 24 }}>
            No stars linked yet. Mention {person.name} when adding a memory.
          </div>
        )}

        {/* Delete */}
        {confirmDelete ? (
          <div style={{
            background:   'rgba(201,138,136,0.15)',
            border:       '2px solid #c98a88',
            borderRadius:  6,
            padding:      '14px',
          }}>
            <div style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#2d2b3d', marginBottom: 12, lineHeight: 2 }}>
              Delete {person.name}? They will be removed from all linked stars.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <PixelButton onClick={handleDelete} color="#c98a88" shadowColor="#7a6fa0" textColor="#fdfcff" small>
                Yes, delete
              </PixelButton>
              <PixelButton onClick={() => setConfirmDelete(false)} color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff" small>
                Cancel
              </PixelButton>
            </div>
          </div>
        ) : (
          <PixelButton
            onClick={() => setConfirmDelete(true)}
            color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff"
            small
          >
            Delete Person
          </PixelButton>
        )}
      </div>
    </ModalOverlay>
  );
}

Object.assign(window, { PersonProfile });
