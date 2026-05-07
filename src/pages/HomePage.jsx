// Home page — sky canvas, jar scene, pull/add buttons.
// Next.js migration: export default function HomePage(...)

const SHOOTING_STAR_INTERVAL_MIN = 4000;
const SHOOTING_STAR_INTERVAL_MAX = 9000;

// ── Time-of-day helpers ───────────────────────────────────────────────────────

function _skyPeriod() {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  if (h >= 4  && h < 9)  return 'dawn';
  if (h >= 9  && h < 16) return 'day';
  if (h >= 16 && h < 18) return 'golden';
  return 'night';
}

function _skyGradient(ctx, w, h, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  stops.forEach(([pos, col]) => g.addColorStop(pos, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

// Cloud puff shape templates — relative (dx, dy, r) offsets from cloud centre
const _CLOUD_PUFFS = [
  [{ dx:0,dy:0,r:42 },{ dx:-50,dy:14,r:32 },{ dx:50,dy:14,r:32 },{ dx:-30,dy:-18,r:28 },{ dx:30,dy:-18,r:28 },{ dx:0,dy:-32,r:24 },{ dx:-72,dy:22,r:26 },{ dx:72,dy:22,r:26 }],
  [{ dx:0,dy:0,r:36 },{ dx:-42,dy:12,r:28 },{ dx:42,dy:12,r:28 },{ dx:-24,dy:-14,r:24 },{ dx:24,dy:-14,r:24 },{ dx:0,dy:-26,r:20 },{ dx:-60,dy:20,r:22 }],
  [{ dx:0,dy:0,r:52 },{ dx:-58,dy:16,r:40 },{ dx:58,dy:16,r:40 },{ dx:-34,dy:-24,r:35 },{ dx:34,dy:-24,r:35 },{ dx:0,dy:-44,r:30 },{ dx:-86,dy:26,r:32 },{ dx:86,dy:26,r:32 },{ dx:-12,dy:-54,r:22 },{ dx:18,dy:-50,r:20 }],
];

// ── Southern hemisphere constellations (visible from Sydney) ──────────────────
const _CONSTELLATIONS = [
  { // Crux — the Southern Cross
    stars: [
      { xf: 0.762, yf: 0.072, r: 2.0, color: 'rgba(255,210,200,0.90)' }, // Gacrux — reddish
      { xf: 0.762, yf: 0.218, r: 2.6, color: 'rgba(210,225,255,0.95)' }, // Acrux — blue-white
      { xf: 0.698, yf: 0.145, r: 2.3, color: 'rgba(210,225,255,0.90)' }, // Mimosa
      { xf: 0.826, yf: 0.145, r: 1.8, color: 'rgba(253,252,255,0.85)' }, // δ Cru
      { xf: 0.778, yf: 0.156, r: 1.3, color: 'rgba(253,252,255,0.72)' }, // ε Cru
    ],
    lines: [[0,1],[2,3]],
  },
  { // Centaurus — α & β Cen, the "pointers" to the Cross
    stars: [
      { xf: 0.603, yf: 0.105, r: 2.8, color: 'rgba(255,248,220,0.95)' }, // α Centauri
      { xf: 0.640, yf: 0.192, r: 2.4, color: 'rgba(200,215,255,0.90)' }, // β Centauri (Hadar)
    ],
    lines: [[0,1]],
  },
  { // Scorpius — iconic S-curve with bright Antares
    stars: [
      { xf: 0.135, yf: 0.070, r: 1.7, color: 'rgba(253,252,255,0.80)' },
      { xf: 0.158, yf: 0.098, r: 1.8, color: 'rgba(253,252,255,0.82)' },
      { xf: 0.182, yf: 0.074, r: 1.5, color: 'rgba(253,252,255,0.78)' },
      { xf: 0.162, yf: 0.150, r: 2.6, color: 'rgba(255,175,100,0.95)' }, // Antares — orange-red
      { xf: 0.178, yf: 0.210, r: 1.7, color: 'rgba(253,252,255,0.80)' },
      { xf: 0.200, yf: 0.265, r: 1.8, color: 'rgba(253,252,255,0.82)' },
      { xf: 0.232, yf: 0.308, r: 2.0, color: 'rgba(253,252,255,0.85)' },
      { xf: 0.270, yf: 0.330, r: 1.6, color: 'rgba(253,252,255,0.78)' },
      { xf: 0.310, yf: 0.326, r: 1.7, color: 'rgba(253,252,255,0.80)' },
      { xf: 0.345, yf: 0.298, r: 2.2, color: 'rgba(253,252,255,0.88)' }, // Shaula (λ Sco)
      { xf: 0.364, yf: 0.264, r: 1.8, color: 'rgba(253,252,255,0.82)' },
    ],
    lines: [[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]],
  },
  { // Canopus — 2nd brightest star in the sky (Carina)
    stars: [{ xf: 0.882, yf: 0.084, r: 3.0, color: 'rgba(253,252,240,0.98)' }],
    lines: [],
  },
];

function _drawConstellations(ctx, w, h) {
  ctx.lineWidth   = 0.8;
  ctx.strokeStyle = 'rgba(180,170,220,0.18)';
  _CONSTELLATIONS.forEach(con => {
    con.lines.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(con.stars[a].xf * w, con.stars[a].yf * h);
      ctx.lineTo(con.stars[b].xf * w, con.stars[b].yf * h);
      ctx.stroke();
    });
    con.stars.forEach(s => {
      const x = s.xf * w, y = s.yf * h;
      if (s.r >= 2.0) {
        ctx.globalAlpha = 0.13;
        ctx.fillStyle   = '#d4d0ff';
        ctx.beginPath();
        ctx.arc(x, y, s.r * 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = s.color || 'rgba(253,252,255,0.88)';
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

// ── Sky canvas — handles all four time-of-day scenes ─────────────────────────
function StarfieldCanvas() {
  const canvasRef = React.useRef(null);
  const animRef   = React.useRef(null);
  const timerRef  = React.useRef(null);
  const pausedRef = React.useRef(false);

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

    // Drifting background stars (night + dawn)
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

    // Shooting stars (night only)
    const shootingStars = [];

    // Clouds (day + dawn)
    const clouds = Array.from({ length: 6 }, (_, i) => ({
      x:     -150 + Math.random() * (window.innerWidth + 300),
      y:     window.innerHeight * (0.08 + Math.random() * 0.46),
      speed: 0.10 + Math.random() * 0.22,
      scale: 0.55 + Math.random() * 0.90,
      puffs: _CLOUD_PUFFS[i % _CLOUD_PUFFS.length],
    }));


    function spawnShootingStar() {
      if (pausedRef.current) return;
      if (_skyPeriod() !== 'night') {
        timerRef.current = setTimeout(spawnShootingStar, 5000);
        return;
      }
      const fromTop = Math.random() < 0.6;
      const startX  = fromTop ? Math.random() * window.innerWidth * 0.8 : -20;
      const startY  = fromTop ? -20 : Math.random() * window.innerHeight * 0.5;
      const angle   = Math.PI / 6 + (Math.random() - 0.5) * 0.5;
      const speed   = 3.5 + Math.random() * 2.5;
      shootingStars.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
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
      const W = canvas.width, H = canvas.height;
      const period = _skyPeriod();

      // ── Night (6 pm – 4 am) ────────────────────────────────────────────────
      if (period === 'night') {
        _skyGradient(ctx, W, H, [
          [0,   '#05050f'],
          [0.4, '#0d0d1a'],
          [1,   '#1a1a2e'],
        ]);

        bgStars.forEach(s => {
          s.x += s.vx; s.y += s.vy;
          if (s.x < -2)    s.x = W + 2;
          if (s.x > W + 2) s.x = -2;
          if (s.y < -2)    s.y = H + 2;
          if (s.y > H + 2) s.y = -2;
          const b = s.brightness * (0.65 + 0.35 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset));
          ctx.fillStyle = `rgba(253,252,255,${b})`;
          ctx.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
        });

        _drawConstellations(ctx, W, H);

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const ss = shootingStars[i];
          if (ss.done) { shootingStars.splice(i, 1); continue; }
          ss.x += ss.vx; ss.y += ss.vy;
          if (ss.fadingIn) {
            ss.opacity = Math.min(1, ss.opacity + 0.08);
            if (ss.opacity >= 1) ss.fadingIn = false;
          }
          const offscreen = ss.x > W + 50 || ss.y > H + 50;
          if (offscreen) {
            ss.opacity = Math.max(0, ss.opacity - 0.06);
            if (ss.opacity <= 0) { ss.done = true; continue; }
          }
          const len  = Math.hypot(ss.vx, ss.vy);
          const nx   = ss.vx / len, ny = ss.vy / len;
          const tailX = ss.x - nx * ss.tailLen, tailY = ss.y - ny * ss.tailLen;
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
      }

      // ── Day (9 am – 4 pm) ─────────────────────────────────────────────────
      else if (period === 'day') {
        _skyGradient(ctx, W, H, [
          [0,    '#3a78c8'],
          [0.35, '#5498de'],
          [0.70, '#8ac4f0'],
          [1,    '#c8e8fa'],
        ]);

        // Sun — soft glow + bright disc
        const sx = W * 0.78, sy = H * 0.14;
        const sunG = ctx.createRadialGradient(sx, sy, 0, sx, sy, H * 0.24);
        sunG.addColorStop(0,    'rgba(255,255,220,0.55)');
        sunG.addColorStop(0.38, 'rgba(255,240,160,0.22)');
        sunG.addColorStop(1,    'rgba(255,240,160,0)');
        ctx.fillStyle = sunG;
        ctx.beginPath(); ctx.arc(sx, sy, H * 0.24, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,230,0.92)';
        ctx.beginPath(); ctx.arc(sx, sy, H * 0.048, 0, Math.PI * 2); ctx.fill();

        // Daytime crescent moon (visible in a blue sky, upper-left)
        const mx = W * 0.18, my = H * 0.10, mr = H * 0.022;
        ctx.fillStyle = 'rgba(240,242,255,0.75)';
        ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(88,152,212,0.72)'; // sky colour overlay → crescent
        ctx.beginPath(); ctx.arc(mx + mr * 0.45, my, mr * 0.86, 0, Math.PI * 2); ctx.fill();

        // Rolling clouds drifting slowly
        clouds.forEach(c => {
          c.x += c.speed;
          if (c.x - 220 * c.scale > W) c.x = -220 * c.scale;
          const cloudR = 75 * c.scale;
          const grd = ctx.createRadialGradient(c.x, c.y - cloudR * 0.28, cloudR * 0.05, c.x, c.y, cloudR * 1.15);
          grd.addColorStop(0,   'rgba(255,255,255,0.97)');
          grd.addColorStop(0.55,'rgba(248,251,255,0.88)');
          grd.addColorStop(1,   'rgba(205,222,242,0.68)');
          c.puffs.forEach(p => {
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.ellipse(c.x + p.dx * c.scale, c.y + p.dy * c.scale,
              p.r * c.scale * 1.22, p.r * c.scale * 0.80, 0, 0, Math.PI * 2);
            ctx.fill();
          });
        });
      }

      // ── Golden hour (4 pm – 6 pm) ─────────────────────────────────────────
      else if (period === 'golden') {
        // Dark night sky dominates the upper two-thirds; warm sunset colours
        // compressed into the lower third near the horizon
        _skyGradient(ctx, W, H, [
          [0,    '#04030e'],
          [0.28, '#120828'],
          [0.50, '#3a0e20'],
          [0.68, '#8c2010'],
          [0.82, '#d84810'],
          [0.92, '#f07818'],
          [1,    '#f8b020'],
        ]);

        // Stars fading out toward the warm horizon
        bgStars.forEach(s => {
          s.x += s.vx * 0.3; s.y += s.vy * 0.3;
          if (s.x < -2) s.x = W + 2; if (s.x > W + 2) s.x = -2;
          if (s.y < -2) s.y = H + 2; if (s.y > H + 2) s.y = -2;
          const fade = Math.max(0, 1 - s.y / (H * 0.62));
          if (fade <= 0) return;
          const b = s.brightness * fade * (0.65 + 0.35 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset));
          ctx.fillStyle = `rgba(253,252,255,${b})`;
          ctx.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
        });

        // Setting sun — large glow on the horizon
        const sx = W * 0.50, sy = H * 0.92;
        const sunG = ctx.createRadialGradient(sx, sy, 0, sx, sy, H * 0.36);
        sunG.addColorStop(0,    'rgba(255,220,100,0.80)');
        sunG.addColorStop(0.22, 'rgba(255,140, 30,0.50)');
        sunG.addColorStop(0.60, 'rgba(220, 60,  0,0.18)');
        sunG.addColorStop(1,    'rgba(220, 60,  0,0)');
        ctx.fillStyle = sunG;
        ctx.beginPath(); ctx.arc(sx, sy, H * 0.36, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,210,80,0.90)';
        ctx.beginPath(); ctx.arc(sx, sy, H * 0.048, 0, Math.PI * 2); ctx.fill();
      }

      // ── Dawn (4 am – 9 am) ────────────────────────────────────────────────
      else {
        _skyGradient(ctx, W, H, [
          [0,    '#050510'],
          [0.22, '#0a1828'],
          [0.48, '#1a3a60'],
          [0.72, '#4888a8'],
          [0.88, '#a8ccd8'],
          [1,    '#f0c048'],
        ]);

        // Faint fading stars near the top
        bgStars.slice(0, 55).forEach(s => {
          s.x += s.vx * 0.4; s.y += s.vy * 0.4;
          if (s.x < -2)    s.x = W + 2;
          if (s.x > W + 2) s.x = -2;
          if (s.y < -2)    s.y = H + 2;
          if (s.y > H + 2) s.y = -2;
          const fade = Math.max(0, 1 - s.y / (H * 0.52));
          if (fade <= 0) return;
          const b = s.brightness * 0.55 * fade * (0.7 + 0.3 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset));
          ctx.fillStyle = `rgba(253,252,255,${b})`;
          ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
        });

        // Rising sun glow from just below horizon
        const sx = W * 0.50, sy = H * 1.05;
        const sunG = ctx.createRadialGradient(sx, sy, 0, sx, sy, H * 0.68);
        sunG.addColorStop(0,    'rgba(255,240,180,0.70)');
        sunG.addColorStop(0.20, 'rgba(255,200, 80,0.40)');
        sunG.addColorStop(0.50, 'rgba(240,120, 20,0.15)');
        sunG.addColorStop(1,    'rgba(240,120, 20,0)');
        ctx.fillStyle = sunG;
        ctx.beginPath(); ctx.arc(sx, sy, H * 0.68, 0, Math.PI * 2); ctx.fill();

        // Soft pastel dawn clouds catching early light
        clouds.slice(0, 3).forEach(c => {
          c.x += c.speed * 0.4;
          if (c.x - 220 * c.scale > W) c.x = -220 * c.scale;
          const cy     = H * 0.52 + (c.y / H - 0.52) * H * 0.5;
          const cloudR = 65 * c.scale;
          const grd = ctx.createRadialGradient(c.x, cy - cloudR * 0.28, cloudR * 0.05, c.x, cy, cloudR * 1.1);
          grd.addColorStop(0,   'rgba(255,218,195,0.68)');
          grd.addColorStop(0.5, 'rgba(220,180,210,0.46)');
          grd.addColorStop(1,   'rgba(170,140,180,0.18)');
          c.puffs.forEach(p => {
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.ellipse(c.x + p.dx * c.scale, cy + p.dy * c.scale,
              p.r * c.scale * 1.18, p.r * c.scale * 0.78, 0, 0, Math.PI * 2);
            ctx.fill();
          });
        });
      }

      animRef.current = requestAnimationFrame(draw);
    }

    function pause() {
      pausedRef.current = true;
      cancelAnimationFrame(animRef.current);
      clearTimeout(timerRef.current);
      shootingStars.length = 0;
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

// Jar body proportions — must mirror JarSVG constants
const _BODY_TOP_FRAC    = 0.32;
const _BODY_BOTTOM_FRAC = 0.89;

// Pre-computed slots: 10 stable random positions, konpeito colours
const _FLOAT_SLOTS = Array.from({ length: 10 }, (_, i) => {
  const sc = getStarColor(`jar_float_${i}`);
  return {
    id:      i,
    xPct:    0.18 + Math.random() * 0.64,
    yInZone: Math.random(),
    phase:   (i / 10) * Math.PI * 2,
    speed:   0.5 + Math.random() * 0.6,
    size:    8 + (i % 3) * 2,
    color:   sc.color,
    shadow:  sc.shadow,
  };
});

// ── Audio ─────────────────────────────────────────────────────────────────────
let _audioCtx      = null;
let _lastTwinkleMs = 0;
let _lastRippleMs  = 0; // tracks when last ripple fired, for sound gating

function _soundOn() { return localStorage.getItem('josSoundEnabled') !== 'false'; }

function _ensureAudio() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function _playGlassPing() {
  if (!_soundOn()) return;
  try {
    const ctx = _ensureAudio();
    const t   = ctx.currentTime;
    // Fundamental tone — sine with gentle pitch drop, like tapping a glass
    const o1 = ctx.createOscillator(), g1 = ctx.createGain();
    o1.connect(g1); g1.connect(ctx.destination);
    o1.type = 'sine';
    o1.frequency.setValueAtTime(1080, t);
    o1.frequency.exponentialRampToValueAtTime(820, t + 0.4);
    g1.gain.setValueAtTime(0.16, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o1.start(t); o1.stop(t + 0.5);
    // Subtle 2nd harmonic for glassiness
    const o2 = ctx.createOscillator(), g2 = ctx.createGain();
    o2.connect(g2); g2.connect(ctx.destination);
    o2.type = 'sine';
    o2.frequency.setValueAtTime(2160, t);
    o2.frequency.exponentialRampToValueAtTime(1640, t + 0.25);
    g2.gain.setValueAtTime(0.055, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    o2.start(t); o2.stop(t + 0.3);
  } catch (e) {}
}

function _playStarTwinkle() {
  if (!_soundOn()) return;
  const now = Date.now();
  if (now - _lastTwinkleMs < 100) return; // cap at ~10 twinkles/sec
  _lastTwinkleMs = now;
  try {
    const ctx  = _ensureAudio();
    const t    = ctx.currentTime;
    const freq = 1800 + Math.random() * 1600; // random pitch each time
    const osc  = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, t + 0.04);
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    osc.start(t); osc.stop(t + 0.12);
  } catch (e) {}
}

function FloatingStarsInJar({ floatingCount, fillFraction, jarW, jarH, mousePos, ripple }) {
  const physRef     = React.useRef([]);
  const elemRefs    = React.useRef([]);
  const rafRef      = React.useRef(null);
  const mpRef       = React.useRef(null);
  const ripRef      = React.useRef(null);
  const fillFracRef = React.useRef(fillFraction);

  React.useEffect(() => { mpRef.current = mousePos; }, [mousePos]);
  React.useEffect(() => { fillFracRef.current = fillFraction; }, [fillFraction]);
  React.useEffect(() => { if (ripple) ripRef.current = ripple; }, [ripple]);

  // Initialise physics positions when count or jar dims change
  React.useEffect(() => {
    if (floatingCount === 0) { physRef.current = []; return; }
    const minY = jarH * (_BODY_TOP_FRAC + 0.03) + 6;
    const maxY = jarH * _BODY_BOTTOM_FRAC - 8;
    const minX = jarW * 0.14;
    const maxX = jarW * 0.86;
    physRef.current = Array.from({ length: floatingCount }, () => ({
      x:     minX + Math.random() * (maxX - minX),
      y:     minY + Math.random() * Math.max(6, maxY - minY),
      vx:    (Math.random() - 0.5) * 0.15,
      vy:    (Math.random() - 0.5) * 0.15,
      // Start at a diagonal (45°/135°/225°/315° ± a bit) so no star begins axis-aligned
      angle: Math.PI / 4 + Math.floor(Math.random() * 4) * (Math.PI / 2) + (Math.random() - 0.5) * 0.5,
    }));
  }, [floatingCount, jarW, jarH]);

  // Physics RAF loop — deps only include static dims, props read via refs
  React.useEffect(() => {
    if (floatingCount === 0) return;

    function step() {
      const mp  = mpRef.current;
      const rip = ripRef.current;
      if (rip) { ripRef.current = null; _lastRippleMs = Date.now(); }

      const minY   = jarH * (_BODY_TOP_FRAC + 0.03) + 6;
      const maxY   = jarH * _BODY_BOTTOM_FRAC - 8;
      const minX   = jarW * 0.13;
      const maxX   = jarW * 0.87;
      const BOUNCE = 0.18;

      physRef.current.forEach((p, i) => {
        const s  = _FLOAT_SLOTS[i];
        if (!s || !p) return;
        const el = elemRefs.current[i];
        if (!el) return;
        const hs = s.size / 2;

        // Each star drifts in its own direction — angle turns quickly enough
        // to avoid getting stuck horizontal/vertical, plus independent x/y
        // noise so there's always a diagonal component
        p.angle += (Math.random() - 0.5) * 0.08;
        p.vx += Math.cos(p.angle) * 0.006 + (Math.random() - 0.5) * 0.04;
        p.vy += Math.sin(p.angle) * 0.006 + (Math.random() - 0.5) * 0.04;

        // Ripple: outward impulse from click point
        if (rip) {
          const dx    = p.x - rip.x;
          const dy    = p.y - rip.y;
          const dist  = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 7 / (1 + dist * 0.028);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        if (mp) {
          // Mouse attraction: slow, dreamy pull toward cursor
          p.vx += (mp.x - p.x) * 0.0005;
          p.vy += (mp.y - p.y) * 0.0005;
        }

        // High viscosity — slow, syrupy movement
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        // Boundary collisions with soft bounce + small perpendicular jitter
        let nearWall = false;
        if (p.x - hs < minX) {
          p.x  = minX + hs;
          p.vx = Math.abs(p.vx) * BOUNCE;
          p.vy += (Math.random() - 0.5) * 0.4;
          nearWall = true;
        } else if (p.x + hs > maxX) {
          p.x  = maxX - hs;
          p.vx = -Math.abs(p.vx) * BOUNCE;
          p.vy += (Math.random() - 0.5) * 0.4;
          nearWall = true;
        }
        if (p.y - hs < minY) {
          p.y  = minY + hs;
          p.vy = Math.abs(p.vy) * BOUNCE;
          p.vx += (Math.random() - 0.5) * 0.4;
          nearWall = true;
        } else if (p.y + hs > maxY) {
          p.y  = maxY - hs;
          p.vy = -Math.abs(p.vy) * BOUNCE;
          p.vx += (Math.random() - 0.5) * 0.4;
          nearWall = true;
        }
        // Twinkle only when the collision is mouse- or ripple-driven, not natural drift
        if (nearWall && (mp || Date.now() - _lastRippleMs < 2000)) _playStarTwinkle();

        // Near-wall glow even before hard collision
        if (!nearWall) {
          nearWall = p.x - hs < minX + 5 || p.x + hs > maxX - 5 ||
                     p.y - hs < minY + 5 || p.y + hs > maxY - 5;
        }

        el.style.left   = `${p.x - hs}px`;
        el.style.top    = `${p.y - hs}px`;
        el.style.filter = nearWall
          ? `drop-shadow(0 0 8px ${s.color}) drop-shadow(0 0 14px ${s.color})`
          : `drop-shadow(0 0 4px ${s.color})`;
      });

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [floatingCount, jarW, jarH]);

  if (floatingCount === 0) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {_FLOAT_SLOTS.slice(0, floatingCount).map((s, i) => (
        <div
          key={s.id}
          ref={el => { elemRefs.current[i] = el; }}
          onClick={e => {
            e.stopPropagation();
            const el = elemRefs.current[i];
            if (!el) return;
            el.style.filter = `drop-shadow(0 0 10px ${s.color}) drop-shadow(0 0 22px ${s.color})`;
            el.style.transform = 'scale(1.4)';
            setTimeout(() => {
              if (el) { el.style.filter = `drop-shadow(0 0 4px ${s.color})`; el.style.transform = ''; }
            }, 600);
          }}
          onTouchStart={e => e.stopPropagation()}
          style={{
            position:      'absolute',
            cursor:        'pointer',
            pointerEvents: 'all',
            zIndex:         3,
            transition:    'transform 0.15s ease',
          }}
        >
          <PixelStar size={s.size} color={s.color} shadowColor={s.shadow}/>
        </div>
      ))}
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

function SoundToggle() {
  const [on, setOn] = React.useState(() => localStorage.getItem('josSoundEnabled') !== 'false');
  function toggle() {
    const next = !on;
    setOn(next);
    localStorage.setItem('josSoundEnabled', String(next));
  }
  return (
    <button
      onClick={toggle}
      title={on ? 'Mute sounds' : 'Enable sounds'}
      style={{
        position:    'absolute',
        top:          12,
        left:         12,
        zIndex:       10,
        display:     'flex',
        alignItems:  'center',
        gap:          5,
        background:  'rgba(22,33,62,0.80)',
        border:      `1.5px solid ${on ? '#7a6fa0' : '#4a3f6e'}`,
        borderRadius: 20,
        padding:     '5px 10px',
        cursor:      'pointer',
        backdropFilter: 'blur(4px)',
      }}
    >
      <span style={{ fontFamily: "'Fredoka'", fontSize: 13, color: on ? '#c9b8f0' : '#4a3f6e', lineHeight: 1 }}>♪</span>
      <span style={{ fontFamily: "'Fredoka'", fontSize: 11, color: on ? '#9b89c4' : '#4a3f6e', lineHeight: 1 }}>
        {on ? 'Sound' : 'Muted'}
      </span>
    </button>
  );
}

function HomePage({ onNavigate, stars, people }) {
  const [showAdd,     setShowAdd]    = React.useState(false);
  const [showPull,    setShowPull]   = React.useState(null);
  const [showZip,     setShowZip]    = React.useState(false);
  const [jarWobble,   setJarWobble]  = React.useState(false);
  const [mousePos,    setMousePos]   = React.useState(null);
  const [ripple,      setRipple]     = React.useState(null);
  const [rippleRings, setRippleRings]= React.useState([]);
  const jarContainerRef = React.useRef(null);

  const count         = stars.length;
  // Liquid rises only at multiples of 10, one notch per 10 stars (full at 100)
  const fillFraction  = Math.min(Math.floor(count / 10) / 10, 1);
  const floatingCount = count === 0 ? 0 : (count % 10 === 0 ? 10 : count % 10);

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

  function handleJarClick(e) {
    const rect = jarContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    _playGlassPing();
    setJarWobble(true);
    setTimeout(() => setJarWobble(false), 600);
    const x  = e.clientX - rect.left;
    const y  = e.clientY - rect.top;
    const id = Date.now();
    setRipple({ x, y, id });
    setRippleRings(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRippleRings(prev => prev.filter(r => r.id !== id)), 1000);
  }

  function handleJarMouseMove(e) {
    const rect = jarContainerRef.current?.getBoundingClientRect();
    if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleJarTouchMove(e) {
    const rect = jarContainerRef.current?.getBoundingClientRect();
    if (rect) setMousePos({ x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top });
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
      <SoundToggle/>
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
        <InlineSyncStatus/>
      </div>

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
      {/* Outer container — handles all pointer events */}
      <div
        ref={jarContainerRef}
        style={{
          position: 'relative',
          zIndex:    2,
          marginTop: isMobile ? 10 : 16,
          width:     jarW,
          height:    jarH,
          cursor:   'pointer',
        }}
        onClick={handleJarClick}
        onMouseMove={handleJarMouseMove}
        onMouseLeave={() => setMousePos(null)}
        onTouchStart={e => {
          const rect = jarContainerRef.current?.getBoundingClientRect();
          if (rect) setMousePos({ x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top });
        }}
        onTouchMove={handleJarTouchMove}
        onTouchEnd={() => setMousePos(null)}
      >
        {/* Measuring ruler — left of jar body, marks every 10 stars */}
        <div style={{ position: 'absolute', right: '100%', top: 0, width: 38, height: jarH, pointerEvents: 'none' }}>
          {Array.from({ length: 10 }, (_, i) => {
            const n      = i + 1; // 1–10 (bottom to top)
            const yPx    = jarH * (0.89 - n * 0.057);
            const filled = Math.floor(count / 10) >= n;
            return (
              <div key={n} style={{
                position:  'absolute',
                top:        yPx,
                right:      0,
                display:   'flex',
                alignItems: 'center',
                gap:         3,
                transform: 'translateY(-50%)',
              }}>
                <span style={{ fontFamily: "'Fredoka'", fontSize: 9, color: filled ? '#ffe066' : '#4a3f6e', lineHeight: 1 }}>
                  {n * 10}
                </span>
                <div style={{ width: filled ? 8 : 5, height: 2, background: filled ? '#ffe066' : '#4a3f6e', borderRadius: 1 }}/>
              </div>
            );
          })}
        </div>

        {/* Ripple rings on click/tap */}
        {rippleRings.map(ring => (
          <div key={ring.id} style={{
            position:      'absolute',
            left:           ring.x - 20,
            top:            ring.y - 20,
            width:           40,
            height:          40,
            borderRadius:   '50%',
            border:         '2px solid rgba(201,184,240,0.65)',
            pointerEvents:  'none',
            zIndex:          10,
            animation:      'rippleExpand 0.85s ease-out forwards',
          }}/>
        ))}

        {/* Inner jar — wobble-only transform layer */}
        <div
          style={{
            position:       'absolute',
            width:          '100%',
            height:         '100%',
            animation:       jarWobble ? 'jarWobble 0.5s ease' : 'none',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            pointerEvents:  'none',
          }}
        >
          <JarGlowPulse>
            {pulse => <JarSVG fillFraction={fillFraction} starCount={count} glowPulse={pulse} width={jarW} height={jarH}/>}
          </JarGlowPulse>
        </div>

        {/* Stars physics layer */}
        <FloatingStarsInJar
          floatingCount={floatingCount}
          fillFraction={fillFraction}
          jarW={jarW}
          jarH={jarH}
          mousePos={mousePos}
          ripple={ripple}
        />
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
