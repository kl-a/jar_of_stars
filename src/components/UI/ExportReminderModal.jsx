// Export reminder — slides up from the bottom without blocking the page.
// Shown once per session when the user has stars but hasn't been reminded yet.
// Next.js migration: export function ExportReminderModal(...)

function ExportReminderModal({ onClose }) {
  const [visible, setVisible] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);

  React.useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  function handleDownload() {
    window.store.exportDatabase();
    setDownloaded(true);
    setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 1200);
  }

  function handleDismiss() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const isMobile = window.innerWidth < 640;

  return (
    <div style={{
      position:       'fixed',
      bottom:          isMobile ? 72 : 16,
      left:            '50%',
      transform:      `translateX(-50%) translateY(${visible ? '0' : '120px'})`,
      transition:     'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
      opacity:         visible ? 1 : 0,
      zIndex:          200,
      width:          'calc(100% - 32px)',
      maxWidth:        420,
      pointerEvents:  'all',
    }}>
      <div style={{
        background:   '#1a1a2e',
        border:       '2px solid #ffe066',
        borderRadius:  8,
        boxShadow:    '4px 4px 0px #c9a84c',
        padding:      '16px 18px',
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
          <PixelStar size={16} color="#ffe066"/>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Fredoka'",
              fontSize:    14,
              color:      '#fdfcff',
              lineHeight:  2,
              marginBottom: 6,
            }}>
              Don't lose your stars!
            </div>
            <div style={{
              fontFamily: "'Fredoka'",
              fontSize:    12,
              color:      '#9b89c4',
              lineHeight:  2,
            }}>
              Memories are stored locally in your browser. Download a backup to keep them safe.
            </div>
          </div>
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      '#7a6fa0',
              fontSize:    16,
              lineHeight:  1,
              padding:     0,
              flexShrink:  0,
            }}
          >×</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <PixelButton
            onClick={handleDownload}
            color="#ffe066" shadowColor="#c9a84c"
            small
          >
            {downloaded ? '✓ Saved!' : '↓ Download backup'}
          </PixelButton>
          <PixelButton
            onClick={handleDismiss}
            color="#16213e" shadowColor="#2d2b3d" textColor="#9b89c4"
            small
          >
            Not now
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ExportReminderModal });
