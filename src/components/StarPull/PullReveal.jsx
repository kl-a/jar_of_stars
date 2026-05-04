// Full-screen pull reveal — scroll unroll, trumpeters, streamers, share button.
// Next.js migration: export function PullReveal(...)

function PullReveal({ star, people, onClose }) {
  const [phase,  setPhase]  = React.useState(0); // 0=overlay 1=scroll 2=content 3=trumpeters
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const starPeople = (star.from_people_ids || [])
    .map(id => people.find(p => p.people_id === id)).filter(Boolean);

  function handleShare() {
    const date = new Date(star.date).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    const text = `📜 A memory from ${date}: "${star.message}" — shared from Jar of Stars`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const isMobile = window.innerWidth < 640;
  const scrollW  = Math.min(window.innerWidth - 32, 400);
  const scrollH  = Math.min(window.innerHeight * 0.72, 520);

  return (
    <div style={{
      position:        'fixed',
      inset:            0,
      zIndex:           150,
      background:      'rgba(13,13,40,0.92)',
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'center',
      justifyContent:  'center',
      opacity:          phase >= 0 ? 1 : 0,
      transition:      'opacity 0.3s',
    }}>
      <Streamers/>

      {/* Trumpeters */}
      <div style={{
        position:   'absolute',
        bottom:      60,
        left:        0,
        transform:   phase >= 3 ? 'translateX(0)' : 'translateX(-200px)',
        transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <TrumpeterSVG color="#c9b8f0"/>
      </div>
      <div style={{
        position:   'absolute',
        bottom:      60,
        right:       0,
        transform:   phase >= 3 ? 'translateX(0)' : 'translateX(200px)',
        transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <TrumpeterSVG color="#b5ead7" flip/>
      </div>

      {/* Scroll */}
      <div style={{
        position:        'relative',
        zIndex:           10,
        transform:        phase >= 1 ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'center',
        transition:      'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <ScrollSVG width={scrollW} height={scrollH}/>

        {/* Content overlaid on scroll */}
        <div style={{
          position:       'absolute',
          top:             32,
          left:            16,
          right:           16,
          bottom:          32,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:             12,
          padding:        '0 16px',
          opacity:         phase >= 2 ? 1 : 0,
          transition:     'opacity 0.4s ease',
        }}>
          <PixelStar size={20}/>

          <div style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', textAlign: 'center' }}>
            {new Date(star.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          <div style={{
            fontFamily:  "'Fredoka'",
            fontSize:     14,
            color:        '#2d2b3d',
            textAlign:    'center',
            lineHeight:   2,
            maxHeight:    scrollH * 0.60,
            overflowY:   'auto',
            wordBreak:   'break-word',
          }}>
            {star.message}
          </div>

          {starPeople.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {starPeople.map(p => (
                <span key={p.people_id} style={{
                  fontFamily:   "'Fredoka'",
                  fontSize:      12,
                  color:        '#2d2b3d',
                  background:   '#c9b8f0',
                  border:       '2px solid #7a6fa0',
                  borderRadius:  4,
                  padding:      '2px 8px',
                }}>✦ {p.name}</span>
              ))}
            </div>
          )}

          {star.tags && star.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {star.tags.map(t => <Tag key={t} label={t}/>)}
            </div>
          )}

          <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#9b89c4' }}>
            ✦ pulled {star.pull_count} {star.pull_count === 1 ? 'time' : 'times'}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        display:         'flex',
        gap:              12,
        marginTop:        24,
        flexWrap:        'wrap',
        justifyContent:  'center',
        opacity:          phase >= 2 ? 1 : 0,
        transition:      'opacity 0.4s ease 0.3s',
        position:        'relative',
        zIndex:           10,
      }}>
        <PixelButton onClick={handleShare} color="#c9b8f0" shadowColor="#7a6fa0" small>
          {copied ? '✓ Copied!' : '📜 Share'}
        </PixelButton>
        <PixelButton onClick={onClose} color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff" small>
          Close
        </PixelButton>
      </div>
    </div>
  );
}

Object.assign(window, { PullReveal });
