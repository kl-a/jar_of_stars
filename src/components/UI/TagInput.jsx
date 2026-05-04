// Tag input with autocomplete dropdown.
// Next.js migration: export function TagInput(...)

function TagInput({ tags, onChange, suggestions = [] }) {
  const [input, setInput]   = React.useState('');
  const [open, setOpen]     = React.useState(false);
  const filtered = suggestions.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  function addTag(tag) {
    const t = tag.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
    setOpen(false);
  }

  function onKey(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addTag(input.replace(',', '').trim());
    } else if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          background:  '#16213e',
          border:      '2px solid #9b89c4',
          borderRadius: 6,
          padding:      8,
          display:    'flex',
          flexWrap:   'wrap',
          gap:          6,
          minHeight:   44,
          cursor:     'text',
        }}
        onClick={() => document.getElementById('tag-input-field').focus()}
      >
        {tags.map(t => <Tag key={t} label={t} onRemove={() => onChange(tags.filter(x => x !== t))}/>)}
        <input
          id="tag-input-field"
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); }}
          onKeyDown={onKey}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={tags.length ? '' : 'Add tags...'}
          style={{
            background: 'transparent',
            border:     'none',
            outline:    'none',
            color:      '#fdfcff',
            fontFamily: "'Fredoka'",
            fontSize:    14,
            minWidth:   80,
            flex:        1,
            lineHeight:  2,
          }}
        />
      </div>
      {open && filtered.length > 0 && (
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
          maxHeight: 120,
          overflowY: 'auto',
        }}>
          {filtered.map(s => (
            <div
              key={s}
              onMouseDown={() => addTag(s)}
              style={{
                padding:    '10px 12px',
                cursor:     'pointer',
                color:      '#fdfcff',
                fontFamily: "'Fredoka'",
                fontSize:    14,
                lineHeight:  2,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2d2b3d'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TagInput });
