// Home page — starfield canvas, jar scene, pull/add buttons.
// Next.js migration: export default function HomePage(...)

const SHOOTING_STAR_INTERVAL_MIN = 4000;
const SHOOTING_STAR_INTERVAL_MAX = 9000;

function StarfieldCanvas() {
  const canvasRef  = React.useRef(null);
  const animRef    = React.useRef(null);
  const timerRef   = React.useRef(null);
  const pausedRef  = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const bgStars = Array.from({ length: 120 }, () => ({
      x:             Math.random() * window.innerWidth,
      y:             Math.random() * window.innerHeight,
      size:          Math.random() < 0.25 ? 2 : 1,
      brightness:    0.3 + Math.random() * 0.7,
      twinkleSpeed:  0.008 + Math.random() * 0.018,
      twinkleOffset: Math.random() * Math.PI * 2,
      vx:            (Math.random() - 0.5) * 0.08,
      vy:            (Math.random() - 0.5) * 0.04,
    }));

    const shootingStars = [];

    function spawnShootingStar() {
      if (pausedRef.current) return;
      const fromTop = Math.random() < 0.6;
      const startX  = fromTop ? Math.random() * window.innerWidth * 0.8 : -20;
      const startY  = fromTop ? -20 : Math.random() * window.innerHeight * 0.5;
      const angle   = Math.PI / 6 + (Math.random() - 0.5) * 0.5;
      const speed   = 3.5 + Math.random() * 2.5;
      shootingStars.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        tailLen: 100 + Math.random() * 80,
        opacity: 0, fadingIn: true, done: false,
      });
      const next = SHOOTING_STAR_INTERVAL_MIN + Math.random() * (SHOOTING_STAR_INTERVAL_MAX - SHOOTING_STAR_INTERVAL_MIN);
      timerRef.current = setTimeout(spawnShootingStar, next);
    }

    let frame = 0;
    function draw() {
      if (pausedRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      bgStars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -2)                s.x = canvas.width  + 2;
        if (s.x > canvas.width  + 2) s.x = -2;
        if (s.y < -2)                s.y = canvas.height + 2;
        if (s.y > canvas.height + 2) s.y = -2;
        const b = s.brightness * (0.65 + 0.35 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset));
        ctx.fillStyle = `rgba(253,252,255,${b})`;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
      });

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (ss.done) { shootingStars.splice(i, 1); continue; }
        ss.x += ss.vx;
        ss.y += ss.vy;
        if (ss.fadingIn) {
          ss.opacity = Math.min(1, ss.opacity + 0.08);
          if (ss.opacity >= 1) ss.fadingIn = false;
        }
        const offscreen = ss.x > canvas.width + 50 || ss.y > canvas.height + 50;
        if (offscreen) {
          ss.opacity = Math.max(0, ss.opacity - 0.06);
          if (ss.opacity <= 0) { ss.done = true; continue; }
        }
        const len  = Math.hypot(ss.vx, ss.vy);
        const nx   = ss.vx / len;
        const ny   = ss.vy / len;
        const tailX = ss.x - nx * ss.tailLen;
        const tailY = ss.y - ny * ss.tailLen;
        const grad  = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0,   `rgba(255,224,102,0)`);
        grad.addColorStop(0.5, `rgba(255,224,102,${ss.opacity * 0.4})`);
        grad.addColorStop(1,   `rgba(253,252,255,${ss.opacity})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x,  ss.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(253,252,255,${ss.opacity})`;
        ctx.fillRect(Math.round(ss.x) - 1, Math.round(ss.y) - 1, 3, 3);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    function pause() {
      pausedRef.current = true;
      cancelAnimationFrame(animRef.current);
      clearTimeout(timerRef.current);
      shootingStars.length = 0; // discard accumulated stars so they don't burst on resume
    }

    function resume() {
      pausedRef.current = false;
      draw();
      timerRef.current = setTimeout(spawnShootingStar, 1500);
    }

    function handleVisibility() {
      if (document.hidden) pause(); else resume();
    }

    document.addEventListener('visibilitychange', handleVisibility);
    draw();
    timerRef.current = setTimeout(spawnShootingStar, 1500);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(timerRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}/>
  );
}

function FloatingStarsInJar({ count, jarW, jarH }) {
  const numStars = Math.min(Math.max(count, 0), 3);
  const stars = React.useMemo(() => Array.from({ length: numStars }, (_, i) => ({
    id:    i,
    xPct:  0.25 + Math.random() * 0.5,
    yPct:  0.15 + (i / Math.max(numStars, 1)) * 0.35,
    phase: (i / numStars) * Math.PI * 2,
    speed: 0.6 + Math.random() * 0.5,
    size:  10 + Math.floor(Math.random() * 2) * 2,
  })), [numStars]);

  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (numStars === 0) return;
    const id = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(id);
  }, [numStars]);

  if (numStars === 0) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map(s => {
        const bobY = Math.sin(tick * 0.05 * s.speed + s.phase) * 7;
        const x    = jarW * s.xPct - s.size / 2;
        const y    = jarH * 0.15 + jarH * s.yPct + bobY;
        return (
          <div key={s.id} style={{
            position: 'absolute',
            left:      x,
            top:       y,
            filter:   'drop-shadow(0 0 5px #ffe066)',
            zIndex:    3,
          }}>
            <PixelStar size={s.size} color="#ffe066" shadowColor="#c9a84c"/>
          </div>
        );
      })}
    </div>
  );
}

function JarGlowPulse({ children }) {
  const [pulse, setPulse] = React.useState(1);
  React.useEffect(() => {
    let up = true;
    const id = setInterval(() => {
      setPulse(p => {
        const next = up ? p + 0.012 : p - 0.012;
        if (next >= 1.35) up = false;
        if (next <= 0.75) up = true;
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, []);
  return children(pulse);
}

function HomePage({ onNavigate, stars, people }) {
  const [showAdd,     setShowAdd]    = React.useState(false);
  const [showPull,    setShowPull]   = React.useState(null);
  const [showZip,     setShowZip]    = React.useState(false);
  const [jarWobble,   setJarWobble]  = React.useState(false);

  const count     = stars.length;
  const fillLevel = count === 0 ? 0 : count < 20 ? 1 : count < 40 ? 2 : count < 60 ? 3 : count < 80 ? 4 : 5;

  function handlePull(favouritesOnly) {
    const star = window.store.pullRandomStar(favouritesOnly);
    if (star) setShowPull(star);
  }

  function handleAdded() { setShowZip(true); }

  function handleZipDone() {
    setShowZip(false);
    setJarWobble(true);
    setTimeout(() => setJarWobble(false), 600);
  }

  const isMobile = window.innerWidth < 640;
  const availH   = window.innerHeight - 64; // always subtract nav height
  const jarH     = Math.min(Math.round(availH * 0.62), 520);
  const jarW     = Math.round(jarH * 0.68);

  return (
    <div style={{
      position:      'relative',
      width:         '100%',
      height:        '100%',
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      overflow:      'hidden',
    }}>
      <StarfieldCanvas/>

      {/* Title */}
      <div style={{ marginTop: isMobile ? 16 : 28, position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Fredoka'", fontSize: isMobile ? 22 : 28, color: '#fdfcff', letterSpacing: 2, textShadow: '2px 2px 0px #2d2b3d', fontWeight: 700 }}>
          Jar of Stars
        </div>
        <div style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#9b89c4', marginTop: 6, letterSpacing: 1 }}>
          {count === 0 ? 'add your first memory ✦' : `${count} memor${count === 1 ? 'y' : 'ies'} inside`}
        </div>
      </div>

      {/* Jar */}
      <div style={{
        position:       'relative',
        zIndex:          2,
        marginTop:       isMobile ? 10 : 16,
        width:           jarW,
        height:          jarH,
        animation:       jarWobble ? 'jarWobble 0.5s ease' : 'none',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <JarGlowPulse>
          {pulse => <JarSVG fillLevel={fillLevel} starCount={count} glowPulse={pulse} width={jarW} height={jarH}/>}
        </JarGlowPulse>
        <FloatingStarsInJar count={fillLevel} jarW={jarW} jarH={jarH}/>
      </div>

      {/* Buttons */}
      <div style={{
        position:      'relative',
        zIndex:         2,
        display:       'flex',
        flexDirection: 'column',
        gap:            12,
        alignItems:    'center',
        marginTop:      isMobile ? 14 : 20,
      }}>
        <PixelButton
          onClick={() => handlePull(false)}
          color="#ffeaa7" shadowColor="#c9a84c" textColor="#2d2b3d"
          disabled={count === 0}
          style={{ fontSize: isMobile ? 16 : 18, minWidth: 210 }}
        >
          ✦ Pull a Star
        </PixelButton>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <PixelButton onClick={() => handlePull(true)} color="#f7cac9" shadowColor="#c98a88" textColor="#2d2b3d" disabled={count === 0} small>
            ♥ Favourite
          </PixelButton>
          <PixelButton onClick={() => setShowAdd(true)} color="#b5ead7" shadowColor="#6aab90" textColor="#2d2b3d" small>
            + Add Star
          </PixelButton>
        </div>
      </div>

      {showAdd  && <AddStarModal onClose={() => setShowAdd(false)} onAdded={handleAdded} people={people}/>}
      {showZip  && <StarZipAnimation onComplete={handleZipDone}/>}
      {showPull && <PullReveal star={showPull} people={people} onClose={() => setShowPull(null)}/>}
    </div>
  );
}

Object.assign(window, { HomePage });
