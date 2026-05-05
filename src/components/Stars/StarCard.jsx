// Star card with foil hover effect for favourites + heart burst animation.
// Next.js migration: export { FoilCard, StarCard }

function FoilCard({ children, isFavourite, style = {} }) {
  const cardRef  = React.useRef(null);
  const [tilt,    setTilt]    = React.useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = React.useState({ x: 50, y: 50 });
  const [hovered, setHovered] = React.useState(false);

  function onMouseMove(e) {
    if (!isFavourite || !cardRef.current) return;
    const r  = cardRef.current.getBoundingClientRect();
    const rx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const ry = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    setTilt({ x: ry * 10, y: rx * -10 });
    setGlowPos({ x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 });
  }

  function onMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
    setHovered(false);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => isFavourite && setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{
        position:   'relative',
        overflow:   'hidden',
        transform:  `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition:  hovered ? 'none' : 'transform 0.4s ease-out',
        ...style,
      }}
    >
      {children}
      {isFavourite && hovered && (
        <div style={{
          position:   'absolute',
          inset:       0,
          pointerEvents: 'none',
          zIndex:      5,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,224,102,0.18) 0%, rgba(201,184,240,0.12) 40%, transparent 70%)`,
          animation:  'foilHue 3s linear infinite',
          borderRadius: 6,
        }}/>
      )}
    </div>
  );
}

function StarCard({ star, people, onToggleFavourite, onExpand }) {
  const [heartBurst, setHeartBurst] = React.useState(false);
  const starColor = getStarColor(star.star_id);
  const starPeople = (star.from_people_ids || [])
    .map(id => people.find(p => p.people_id === id)).filter(Boolean);

  function handleFavourite(e) {
    e.stopPropagation();
    if (!star.favourite) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 900);
    }
    onToggleFavourite(star.star_id, !star.favourite);
  }

  return (
    <div
      style={{
        position:     'relative',
        background:   '#c9b8f0',
        border:       '2px solid #7a6fa0',
        borderRadius:  6,
        boxShadow:    '3px 3px 0px #7a6fa0',
        padding:      '14px 14px 12px',
        cursor:       'pointer',
        transition:   'transform 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translate(-1px,-1px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translate(0,0)'}
    >
      {/* Gold star badge for favourites */}
      {star.favourite && (
        <div style={{
          position:       'absolute',
          top:            -7,
          right:          -7,
          background:    '#ffe066',
          border:        '2px solid #c9a84c',
          borderRadius:  '50%',
          width:          22,
          height:         22,
          display:       'flex',
          alignItems:    'center',
          justifyContent: 'center',
          fontSize:       13,
          boxShadow:     '1px 1px 0 #c9a84c',
          zIndex:         2,
          pointerEvents: 'none',
        }}>★</div>
      )}
      <div onClick={onExpand}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <PixelStar size={18} color={starColor.color} shadowColor={starColor.shadow}/>
            {heartBurst && (
              <div style={{ position: 'absolute', top: -4, left: -4 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    position:  'absolute',
                    fontSize:   18,
                    animation: `heartFloat 0.8s ${i * 0.12}s ease-out forwards`,
                    left:      [0, 14, -6, 10][i],
                    top:        0,
                    opacity:    0,
                  }}>♥</div>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily:        "'Fredoka'",
              fontSize:           14,
                            color:             '#2d2b3d',
              display:           '-webkit-box',
              WebkitLineClamp:    2,
              WebkitBoxOrient:   'vertical',
              overflow:          'hidden',
              lineHeight:         1.8,
              wordBreak:         'break-word',
            }}>
              {star.message}
            </div>
          </div>
          <button
            onClick={handleFavourite}
            style={{
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              fontSize:    22,
              color:      star.favourite ? '#c98a88' : '#9b89c4',
              flexShrink:  0,
              padding:     2,
            }}
            title={star.favourite ? 'Unfavourite' : 'Favourite'}
          >
            {star.favourite ? '♥' : '♡'}
          </button>
        </div>

        {/* Meta */}
        <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#7a6fa0', marginBottom: 8 }}>
          {new Date(star.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          {' · '}
          <span style={{ color: '#9b89c4' }}>✦ {star.pull_count}</span>
        </div>

        {/* People */}
        {starPeople.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
            {starPeople.map(p => (
              <span key={p.people_id} style={{
                display:    'inline-flex',
                alignItems: 'center',
                gap:         4,
                background: '#c9b8f0',
                border:     '2px solid #7a6fa0',
                borderRadius: 4,
                padding:    '1px 6px',
                fontFamily: "'Fredoka'",
                fontSize:    12,
                color:      '#2d2b3d',
              }}>
                <AvatarDisplay avatarId={p.avatar_id} size={14}/>
                {p.name}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {star.tags && star.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {star.tags.map(t => <Tag key={t} label={t}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { FoilCard, StarCard });
