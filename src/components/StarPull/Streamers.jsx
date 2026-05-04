// Floating streamer confetti — used in the pull reveal celebration.
// Next.js migration: export function Streamers(...)

const STREAMER_COLORS = ['#f7cac9', '#b5ead7', '#ffeaa7', '#c9b8f0', '#ffb7b2'];

function Streamers() {
  const items = React.useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    id:       i,
    x:        Math.random() * 100,
    color:    STREAMER_COLORS[i % STREAMER_COLORS.length],
    delay:    Math.random() * 0.8,
    duration: 1.2 + Math.random() * 1.2,
    w:        4 + Math.floor(Math.random() * 3) * 2,
    h:        10 + Math.floor(Math.random() * 5) * 2,
  })), []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map(s => (
        <div key={s.id} style={{
          position:          'absolute',
          left:              `${s.x}%`,
          bottom:             0,
          width:              s.w,
          height:             s.h,
          background:         s.color,
          border:            '1px solid rgba(0,0,0,0.15)',
          animation:         `streamerRise ${s.duration}s ${s.delay}s ease-out infinite`,
          animationFillMode: 'backwards',
        }}/>
      ))}
    </div>
  );
}

Object.assign(window, { Streamers });
