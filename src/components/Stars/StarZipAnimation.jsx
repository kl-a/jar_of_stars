// Star zip animation — forms at screen centre then zips to the real jar position.
// Uses data-jar attribute on JarSVG to locate the target dynamically.
// Next.js migration: export function StarZipAnimation(...)

function StarZipAnimation({ onComplete }) {
  const [phase, setPhase] = React.useState(0); // 0=form, 1=zip
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight / 2;
  const [pos, setPos] = React.useState({ x: startX, y: startY });

  React.useEffect(() => {
    const t1 = setTimeout(() => {
      const jarEl = document.querySelector('[data-jar]');
      let targetX = startX;
      let targetY = window.innerHeight * 0.35;
      if (jarEl) {
        const rect = jarEl.getBoundingClientRect();
        targetX = rect.left + rect.width  * 0.5;
        targetY = rect.top  + rect.height * 0.4;
      }
      setPos({ x: targetX, y: targetY });
      setPhase(1);
    }, 300);

    const t2 = setTimeout(onComplete, 950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: 'none' }}>
      <div style={{
        position:   'absolute',
        left:        pos.x,
        top:         pos.y,
        transform:  'translate(-50%,-50%)',
        transition:  phase >= 1
          ? 'left 0.5s cubic-bezier(0.34,1.56,0.64,1), top 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s ease 0.42s'
          : 'none',
        opacity:     phase === 1 ? 0 : 1,
      }}>
        <PixelStar size={phase === 0 ? 32 : 20} color="#ffe066"/>
      </div>
    </div>
  );
}

Object.assign(window, { StarZipAnimation });
