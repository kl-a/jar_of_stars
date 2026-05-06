// Star expand modal with inline edit mode.
// Read-only view: shows full memory + Edit / Favourite / Delete buttons.
// Edit mode: all fields (message, people, date, tags) become editable in the same panel.
// Next.js migration: export function StarExpandModal(...)

const _expandInputStyle = {
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

const _expandLabelStyle = {
  fontFamily:   "'Fredoka'",
  fontSize:      14,
  color:        '#7a6fa0',
  display:      'block',
  marginBottom:  6,
};

function StarExpandModal({ star, people, onClose, onToggleFavourite, onDelete }) {
  const [visible,       setVisible]       = React.useState(false);
  const [editing,       setEditing]       = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [editMessage,   setEditMessage]   = React.useState(star.message);
  const [editDate,      setEditDate]      = React.useState(star.date);
  const [editTags,      setEditTags]      = React.useState(star.tags || []);
  const [editPersonIds, setEditPersonIds] = React.useState(star.from_people_ids || []);
  const [foilPos,       setFoilPos]       = React.useState({ x: 50, y: 50 });
  const [foilActive,    setFoilActive]    = React.useState(false);
  const panelRef = React.useRef(null);
  const allTags = window.store.getAllTags();
  const starColor = getStarColor(star.star_id);

  React.useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  function handlePanelMouseMove(e) {
    if (!star.favourite || !panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    setFoilPos({
      x: ((e.clientX - r.left) / r.width)  * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
    });
  }

  const starPeople = (star.from_people_ids || [])
    .map(id => people.find(p => p.people_id === id)).filter(Boolean);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  function startEdit() {
    setEditMessage(star.message);
    setEditDate(star.date);
    setEditTags(star.tags || []);
    setEditPersonIds(star.from_people_ids || []);
    setEditing(true);
  }

  function handleSave() {
    if (!editMessage.trim()) return;
    window.store.updateStar(star.star_id, {
      message:         editMessage.trim(),
      date:            editDate,
      tags:            editTags,
      from_people_ids: editPersonIds,
    });
    setEditing(false);
  }

  const panelStyle = {
    position:     'relative',
    background:    star.favourite
      ? 'linear-gradient(135deg, #f9e4f0 0%, #c9b8f0 45%, #c4e8e0 100%)'
      : '#c9b8f0',
    border:       '2px solid #7a6fa0',
    borderRadius: '8px 8px 0 0',
    boxShadow:    '0 -4px 0px #7a6fa0',
    width:        '100%',
    maxWidth:      540,
    maxHeight:    '85vh',
    overflowY:    'auto',
    padding:      '24px 20px 80px',
    transform:     visible ? 'translateY(0)' : 'translateY(100%)',
    opacity:       visible ? 1 : 0,
    transition:   'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease',
  };

  return (
    <ModalOverlay onClose={handleClose}>
      <div
        ref={panelRef}
        style={panelStyle}
        onMouseMove={handlePanelMouseMove}
        onMouseEnter={() => star.favourite && setFoilActive(true)}
        onMouseLeave={() => { setFoilActive(false); setFoilPos({ x: 50, y: 50 }); }}
      >
        {/* Dog-ear worn corner for well-loved memories */}
        {star.pull_count >= 10 && (
          <div
            title={`Pulled ${star.pull_count} times`}
            style={{
              position:    'absolute',
              top:          0,
              right:        0,
              width:         0,
              height:        0,
              borderStyle:  'solid',
              borderWidth:  '20px 20px 0 0',
              borderColor:  '#7a6fa0 transparent transparent transparent',
              zIndex:        10,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Holographic shimmer overlay — only on favourite stars, on hover */}
        {star.favourite && foilActive && (
          <div style={{
            position:      'absolute',
            inset:          0,
            pointerEvents: 'none',
            zIndex:         5,
            borderRadius:  '8px 8px 0 0',
            background:    `radial-gradient(ellipse at ${foilPos.x}% ${foilPos.y}%, rgba(255,224,102,0.28) 0%, rgba(201,184,240,0.18) 30%, rgba(181,234,215,0.14) 55%, transparent 75%)`,
            animation:     'foilHue 4s linear infinite',
            mixBlendMode:  'screen',
          }}/>
        )}
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <PixelStar size={16} color={starColor.color} shadowColor={starColor.shadow}/>
          <span style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#2d2b3d', flex: 1 }}>
            {editing ? 'Edit Memory' : 'Memory'}
          </span>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a6fa0', fontSize: 18 }}
          >×</button>
        </div>

        {editing ? (
          /* ── Edit mode ──────────────────────────────────────────────── */
          <>
            <label style={_expandLabelStyle}>MEMORY ✦</label>
            <textarea
              value={editMessage}
              onChange={e => setEditMessage(e.target.value)}
              rows={4}
              autoFocus
              style={{ ..._expandInputStyle, resize: 'vertical', marginBottom: 16 }}
              onFocus={e => e.target.style.borderColor = '#c9b8f0'}
              onBlur={e  => e.target.style.borderColor = '#9b89c4'}
            />

            <label style={_expandLabelStyle}>WHO'S INVOLVED</label>
            <PersonInput selectedIds={editPersonIds} onChange={setEditPersonIds} people={people}/>

            <label style={{ ..._expandLabelStyle, marginTop: 16 }}>DATE</label>
            <input
              type="date"
              value={editDate}
              onChange={e => setEditDate(e.target.value)}
              style={{ ..._expandInputStyle, marginBottom: 16 }}
            />

            <label style={_expandLabelStyle}>TAGS</label>
            <TagInput tags={editTags} onChange={setEditTags} suggestions={allTags}/>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <PixelButton onClick={handleSave} disabled={!editMessage.trim()} small>✦ Save</PixelButton>
              <PixelButton
                onClick={() => setEditing(false)}
                color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff" small
              >Cancel</PixelButton>
            </div>
          </>
        ) : (
          /* ── Read-only view ─────────────────────────────────────────── */
          <>
            <div style={{
              fontFamily:  "'Fredoka'",
              fontSize:     14,
              color:        '#2d2b3d',
              lineHeight:   1.8,
              marginBottom: 16,
              wordBreak:   'break-word',
            }}>
              {star.message}
            </div>

            <div style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', marginBottom: 12 }}>
              {new Date(star.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>

            {starPeople.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {starPeople.map(p => (
                  <span key={p.people_id} style={{
                    display:    'inline-flex',
                    alignItems: 'center',
                    gap:         6,
                    background: 'rgba(201,184,240,0.5)',
                    border:     '2px solid #7a6fa0',
                    borderRadius: 4,
                    padding:    '3px 8px',
                    fontFamily: "'Fredoka'",
                    fontSize:    12,
                    color:      '#2d2b3d',
                  }}>
                    <AvatarDisplay avatarId={p.avatar_id} size={20}/>
                    {p.name}
                  </span>
                ))}
              </div>
            )}

            {star.tags && star.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {star.tags.map(t => <Tag key={t} label={t}/>)}
              </div>
            )}

            <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#9b89c4', marginBottom: 20 }}>
              ✦ pulled {star.pull_count} {star.pull_count === 1 ? 'time' : 'times'}
            </div>

            {confirmDelete ? (
              <div style={{
                background:   'rgba(201,138,136,0.15)',
                border:       '2px solid #c98a88',
                borderRadius:  6,
                padding:       14,
                marginTop:     4,
              }}>
                <div style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#2d2b3d', marginBottom: 12, lineHeight: 2 }}>
                  Delete this memory forever?
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <PixelButton onClick={() => { onDelete(star.star_id); handleClose(); }} color="#c98a88" shadowColor="#7a6fa0" textColor="#fdfcff" small>
                    Yes, delete
                  </PixelButton>
                  <PixelButton onClick={() => setConfirmDelete(false)} color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff" small>
                    Cancel
                  </PixelButton>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <PixelButton
                  onClick={startEdit}
                  color="#ffeaa7" shadowColor="#c9a84c"
                  small
                >✎ Edit</PixelButton>
                <PixelButton
                  onClick={() => { onToggleFavourite(star.star_id, !star.favourite); handleClose(); }}
                  color={star.favourite ? '#f7cac9' : '#c9b8f0'}
                  shadowColor={star.favourite ? '#c98a88' : '#7a6fa0'}
                  small
                >{star.favourite ? '♥ Unfav' : '♡ Fav'}</PixelButton>
                <PixelButton
                  onClick={() => setConfirmDelete(true)}
                  color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff"
                  small
                >Delete</PixelButton>
              </div>
            )}
          </>
        )}
      </div>
    </ModalOverlay>
  );
}

Object.assign(window, { StarExpandModal });
