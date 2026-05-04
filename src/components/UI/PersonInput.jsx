// Person multi-select input with autocomplete + auto-create.
// Next.js migration: export function PersonInput(...)

function PersonInput({ selectedIds, onChange, people }) {
  const [input, setInput] = React.useState('');
  const [open, setOpen]   = React.useState(false);
  const selected = selectedIds.map(id => people.find(p => p.people_id === id)).filter(Boolean);
  const filtered = people.filter(
    p => p.name.toLowerCase().includes(input.toLowerCase()) && !selectedIds.includes(p.people_id)
  );

  function addPerson(person) {
    onChange([...selectedIds, person.people_id]);
    setInput('');
    setOpen(false);
  }

  function createAndAdd() {
    if (!input.trim()) return;
    const p = window.store.addPerson({ name: input.trim() });
    onChange([...selectedIds, p.people_id]);
    setInput('');
    setOpen(false);
  }

  function onKey(e) {
    if (e.key === 'Enter') {
      if (filtered.length > 0) addPerson(filtered[0]);
      else createAndAdd();
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background:  '#16213e',
        border:      '2px solid #9b89c4',
        borderRadius: 6,
        padding:      8,
        display:    'flex',
        flexWrap:   'wrap',
        gap:          6,
        minHeight:   44,
      }}>
        {selected.map(p => (
          <span key={p.people_id} style={{
            display:    'inline-flex',
            alignItems: 'center',
            gap:         4,
            background: '#c9b8f0',
            border:     '2px solid #7a6fa0',
            borderRadius: 4,
            padding:    '4px 8px',
            fontFamily: "'Fredoka'",
            fontSize:    12,
            color:      '#2d2b3d',
            boxShadow:  '2px 2px 0px #7a6fa0',
            lineHeight:  1.8,
          }}>
            {p.name}
            {p.is_new && <NewBadge/>}
            <span
              onClick={() => onChange(selectedIds.filter(id => id !== p.people_id))}
              style={{ cursor: 'pointer', marginLeft: 2 }}
            >×</span>
          </span>
        ))}
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); }}
          onKeyDown={onKey}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Who was involved?"
          style={{
            background: 'transparent',
            border:     'none',
            outline:    'none',
            color:      '#fdfcff',
            fontFamily: "'Fredoka'",
            fontSize:    14,
            minWidth:   120,
            flex:        1,
            lineHeight:  2,
          }}
        />
      </div>
      {open && (filtered.length > 0 || input.trim()) && (
        <div style={{
          position:  'absolute',
          top:       '100%',
          left:       0,
          right:      0,
          zIndex:     10,
          background: '#16213e',
          border:    '2px solid #9b89c4',
          borderRadius: 6,
          marginTop:  2,
          maxHeight: 140,
          overflowY: 'auto',
        }}>
          {filtered.map(p => (
            <div
              key={p.people_id}
              onMouseDown={() => addPerson(p)}
              style={{
                padding:    '10px 12px',
                cursor:     'pointer',
                color:      '#fdfcff',
                fontFamily: "'Fredoka'",
                fontSize:    14,
                lineHeight:  2,
                display:    'flex',
                alignItems: 'center',
                gap:         8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2d2b3d'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <AvatarDisplay avatarId={p.avatar_id} size={24}/>
              {p.name}
              {p.is_new && <NewBadge/>}
            </div>
          ))}
          {input.trim() && !people.find(p => p.name.toLowerCase() === input.toLowerCase()) && (
            <div
              onMouseDown={createAndAdd}
              style={{
                padding:    '10px 12px',
                cursor:     'pointer',
                color:      '#b5ead7',
                fontFamily: "'Fredoka'",
                fontSize:    14,
                lineHeight:  2,
                borderTop:  '1px solid #2d2b3d',
                display:    'flex',
                alignItems: 'center',
                gap:         6,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2d2b3d'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span>+</span> Create "{input.trim()}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PersonInput });
