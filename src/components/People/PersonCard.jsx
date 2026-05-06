// Person card shown in the People page grid.
// Next.js migration: export function PersonCard(...)

function PersonCard({ person, starCount, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:   '#c9b8f0',
        border:       '2px solid #7a6fa0',
        borderRadius:  6,
        boxShadow:    '3px 3px 0px #7a6fa0',
        padding:      '14px 14px 12px',
        cursor:       'pointer',
        position:     'relative',
        display:      'flex',
        alignItems:   'center',
        gap:           14,
        transition:   'transform 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translate(-1px,-1px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translate(0,0)'}
    >
      {person.is_new && (
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <NewBadge/>
        </div>
      )}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {starCount >= 10 && (
          <div style={{
            position:     'absolute',
            inset:         -4,
            borderRadius: '50%',
            border:       '2.5px solid #ffe066',
            animation:    'haloGlow 2s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex:        2,
          }}/>
        )}
        <AvatarDisplay avatarId={person.avatar_id} size={56}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#2d2b3d', marginBottom: 6 }}>
          {person.name}
        </div>
        {person.note && (
          <div style={{
            fontFamily:   "'Fredoka'",
            fontSize:      12,
            color:        '#7a6fa0',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
            marginBottom:  6,
            maxWidth:      200,
            lineHeight:    1.8,
          }}>
            {person.note}
          </div>
        )}
        <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#9b89c4' }}>
          ✦ {starCount} {starCount === 1 ? 'star' : 'stars'}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PersonCard });
