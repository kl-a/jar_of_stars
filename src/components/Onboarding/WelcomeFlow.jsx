// First-launch onboarding — empty jar, welcome message, first star prompt.
// Next.js migration: export function OnboardingFlow(...)

function OnboardingFlow({ onComplete }) {
  const [message,  setMessage]  = React.useState('');
  const [submitted,setSubmitted]= React.useState(false);
  const [show,     setShow]     = React.useState([false, false, false, false]);
  const [jarPulse, setJarPulse] = React.useState(1);

  // Pre-compute star positions once so typing doesn't re-randomise them
  const bgStars = React.useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id:       i,
      left:     `${Math.random() * 100}%`,
      top:      `${Math.random() * 80}%`,
      opacity:   0.3 + Math.random() * 0.5,
      duration: `${2 + Math.random() * 3}s`,
      delay:    `${Math.random() * 3}s`,
    }))
  , []);

  // Staggered entrance
  React.useEffect(() => {
    [0,1,2,3].forEach(i =>
      setTimeout(() => setShow(s => { const n = [...s]; n[i] = true; return n; }), 400 + i * 300)
    );
  }, []);

  // Jar pulse once submitted
  React.useEffect(() => {
    if (!submitted) return;
    let up = true;
    const id = setInterval(() => setJarPulse(p => {
      const n = up ? p + 0.02 : p - 0.02;
      if (n >= 1.4) up = false;
      if (n <= 0.8) up = true;
      return n;
    }), 50);
    return () => clearInterval(id);
  }, [submitted]);

  function handleSubmit() {
    if (!message.trim()) return;
    window.store.addStar({ message: message.trim() });
    window.store.setOnboarded();
    setSubmitted(true);
    setTimeout(onComplete, 1800);
  }

  const fadeIn = i => ({
    opacity:    show[i] ? 1 : 0,
    transform:  show[i] ? 'translateY(0)' : 'translateY(16px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  });

  return (
    <div style={{
      position:       'fixed',
      inset:           0,
      zIndex:          300,
      background:     '#1a1a2e',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:         24,
    }}>
      {/* Background twinkle stars — positions memoised so they don't jump on each keystroke */}
      {bgStars.map(s => (
        <div key={s.id} style={{
          position:   'absolute',
          left:        s.left,
          top:         s.top,
          width:       2,
          height:      2,
          background: '#fdfcff',
          opacity:     s.opacity,
          animation:  `twinkle ${s.duration} ${s.delay} ease-in-out infinite alternate`,
        }}/>
      ))}

      <div style={{
        maxWidth:  380,
        width:    '100%',
        display:  'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:            0,
        position:      'relative',
        zIndex:         1,
      }}>
        {/* Jar */}
        <div style={{ ...fadeIn(0), marginBottom: 16 }}>
          <JarSVG fillLevel={submitted ? 1 : 0} glowPulse={jarPulse} width={140} height={200}/>
        </div>

        {/* Title */}
        <div style={{ ...fadeIn(1), textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            fontFamily:  "'Fredoka'",
            fontSize:     22,
            color:       '#fdfcff',
            textShadow:  '2px 2px 0 #2d2b3d',
            letterSpacing: 2,
          }}>
            Jar of Stars
          </div>
        </div>

        {/* Welcome message */}
        <div style={{ ...fadeIn(2), textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontFamily: "'Fredoka'",
            fontSize:    14,
            color:      '#9b89c4',
            lineHeight:  2,
            maxWidth:    300,
          }}>
            {submitted
              ? 'Your first star is in the jar. ✦'
              : 'Every moment of joy deserves to be remembered. Let\'s add your first star.'}
          </div>
        </div>

        {/* Input */}
        {!submitted && (
          <div style={{ ...fadeIn(3), width: '100%' }}>
            <div style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', marginBottom: 8, lineHeight: 2 }}>
              A lovely memory...
            </div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
              placeholder="What's a lovely memory you've had recently?"
              rows={4}
              autoFocus
              style={{
                width:        '100%',
                boxSizing:    'border-box',
                background:   '#16213e',
                border:       '2px solid #9b89c4',
                borderRadius:  6,
                padding:      '12px 14px',
                color:        '#fdfcff',
                fontFamily:   "'Fredoka'",
                fontSize:      14,
                resize:       'vertical',
                outline:      'none',
                marginBottom:  16,
                lineHeight:    2,
              }}
              onFocus={e => e.target.style.borderColor = '#c9b8f0'}
              onBlur={e  => e.target.style.borderColor = '#9b89c4'}
            />
            <PixelButton
              onClick={handleSubmit}
              disabled={!message.trim()}
              style={{ width: '100%', justifyContent: 'center', fontSize: 18 }}
            >
              ✦ Add My First Star
            </PixelButton>

            <div style={{
              marginTop:    20,
              padding:      '10px 14px',
              background:   'rgba(22,33,62,0.6)',
              border:       '1.5px solid #7a6fa0',
              borderRadius:  8,
              textAlign:    'center',
              animation:    'fadeIn 0.6s ease 1.2s both',
            }}>
              <span style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#b8aed4', lineHeight: 1.8 }}>
                🔒 All data is protected by you and stored locally — no one other than yourself (and whoever is looking over your shoulder) will see these twinkling stars.
              </span>
            </div>
          </div>
        )}

        {submitted && (
          <div style={{
            fontFamily: "'Fredoka'",
            fontSize:    12,
            color:      '#6aab90',
            textAlign:  'center',
            lineHeight:  2,
            animation:  'fadeIn 0.5s ease',
          }}>
            Tap the jar or press Pull a Star whenever you need a boost ✦
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingFlow });
