// Add Star modal — slides up on mobile, scales in on desktop.
// Next.js migration: export function AddStarModal(...)

const _addStarInputStyle = {
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

const _addStarLabelStyle = {
  fontFamily:   "'Fredoka'",
  fontSize:      14,
  color:        '#7a6fa0',
  display:      'block',
  marginBottom:  6,
};

function AddStarModal({ onClose, onAdded, people, promptContext = null }) {
  const [message,   setMessage]   = React.useState('');
  const [personIds, setPersonIds] = React.useState([]);
  const [date,      setDate]      = React.useState(new Date().toISOString().split('T')[0]);
  const [tags,      setTags]      = React.useState([]);
  const [visible,   setVisible]   = React.useState(false);
  const allTags  = window.store.getAllTags();
  const isMobile = window.innerWidth < 640;

  React.useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  function handleSave() {
    if (!message.trim()) return;
    const star = window.store.addStar({ message: message.trim(), from_people_ids: personIds, date, tags });
    setVisible(false);
    setTimeout(() => { onAdded(star); onClose(); }, 300);
  }

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const panelStyle = isMobile ? {
    borderRadius:  '8px 8px 0 0',
    boxShadow:    '0 -4px 0px #7a6fa0',
    width:        '100%',
    transform:     visible ? 'translateY(0)' : 'translateY(100%)',
    opacity:       visible ? 1 : 0,
    transition:   'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
  } : {
    borderRadius:  8,
    boxShadow:    '4px 4px 0px #7a6fa0',
    width:        '100%',
    maxWidth:      500,
    margin:       '0 16px',
    transform:     visible ? 'scale(1)' : 'scale(0.92)',
    opacity:       visible ? 1 : 0,
    transition:   'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease',
  };

  return (
    <ModalOverlay onClose={handleClose} center={!isMobile}>
      <div style={{
        background:  '#c9b8f0',
        border:      '2px solid #7a6fa0',
        maxHeight:   '90vh',
        overflowY:   'auto',
        padding:     '24px 20px 32px',
        ...panelStyle,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <PixelStar size={16}/>
          <span style={{ fontFamily: "'Fredoka'", fontSize: 18, color: '#2d2b3d' }}>Add a Star</span>
        </div>

        {promptContext && (
          <div style={{
            background:   'rgba(22,33,62,0.5)',
            border:       '1.5px solid #7a6fa0',
            borderRadius:  6,
            padding:      '10px 12px',
            marginBottom:  16,
            fontFamily:   "'Fredoka'",
            fontSize:      13,
            color:        '#c9b8f0',
            lineHeight:    1.8,
          }}>
            🎈 {promptContext}
          </div>
        )}

        <label style={_addStarLabelStyle}>MEMORY ✦</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="What's the memory?"
          rows={4}
          style={{ ..._addStarInputStyle, resize: 'vertical' }}
          onFocus={e  => e.target.style.borderColor = '#c9b8f0'}
          onBlur={e   => e.target.style.borderColor = '#9b89c4'}
        />

        <label style={{ ..._addStarLabelStyle, marginTop: 16 }}>WHO'S INVOLVED</label>
        <PersonInput selectedIds={personIds} onChange={setPersonIds} people={people}/>

        <label style={{ ..._addStarLabelStyle, marginTop: 16 }}>DATE</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={_addStarInputStyle}
        />

        <label style={{ ..._addStarLabelStyle, marginTop: 16 }}>TAGS</label>
        <TagInput tags={tags} onChange={setTags} suggestions={allTags}/>

        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
          <PixelButton onClick={handleClose} color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff" small>
            Cancel
          </PixelButton>
          <PixelButton onClick={handleSave} disabled={!message.trim()} small>
            ✦ Save Star
          </PixelButton>
        </div>
      </div>
    </ModalOverlay>
  );
}

Object.assign(window, { AddStarModal });
