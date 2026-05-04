// Tag chip and NEW badge primitives.
// Next.js migration: export { Tag, NewBadge }

function Tag({ label, onRemove, color = '#b5ead7', shadowColor = '#6aab90' }) {
  return (
    <span style={{
      display:    'inline-flex',
      alignItems: 'center',
      gap:         4,
      background:  color,
      border:     `2px solid ${shadowColor}`,
      borderRadius: 4,
      padding:    '2px 6px',
      boxShadow:  `2px 2px 0px ${shadowColor}`,
      fontFamily: "'Fredoka'",
      fontSize:    14,
      color:      '#2d2b3d',
    }}>
      {label}
      {onRemove && (
        <span
          onClick={onRemove}
          style={{ cursor: 'pointer', marginLeft: 2, color: '#7a6fa0' }}
        >×</span>
      )}
    </span>
  );
}

function NewBadge() {
  return (
    <span style={{
      fontFamily:  "'Fredoka'",
      fontSize:     12,
      background:  '#b5ead7',
      border:      '2px solid #6aab90',
      borderRadius: 4,
      padding:     '2px 6px',
      boxShadow:   '2px 2px 0px #6aab90',
      color:       '#2d2b3d',
    }}>
      NEW
    </span>
  );
}

Object.assign(window, { Tag, NewBadge });
