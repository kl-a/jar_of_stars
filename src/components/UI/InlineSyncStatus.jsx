// Inline sync status badge — renders in page headers (Stars, People, Settings).
// Shows a small coloured star + label; tapping when offline triggers sign-in.

function InlineSyncStatus() {
  const [status, setStatus] = React.useState(() => window.driveSync?.getStatus() || 'signed-out');

  React.useEffect(() => {
    if (!window.driveSync?.isConfigured()) return;
    return window.driveSync.onStatus(setStatus);
  }, []);

  if (!window.driveSync?.isConfigured()) return null;

  const isOnline  = ['loading', 'syncing', 'synced'].includes(status);
  const isSyncing = ['loading', 'syncing'].includes(status);
  const label     = isSyncing ? 'Syncing…' : isOnline ? 'Synced' : status === 'session-expired' ? 'Reconnect' : 'Sign In';

  return (
    <div
      onClick={!isOnline ? () => window.driveSync.signIn() : undefined}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:             6,
        background:     'rgba(22,33,62,0.88)',
        border:         `1.5px solid ${isOnline ? '#6aab90' : '#4a3f6e'}`,
        borderRadius:    20,
        padding:        '5px 10px 5px 8px',
        cursor:          !isOnline ? 'pointer' : 'default',
        backdropFilter: 'blur(4px)',
        transition:     'border-color 0.4s ease',
        flexShrink:      0,
      }}
    >
      <div style={{
        flexShrink: 0,
        animation:  isOnline && !isSyncing ? 'starGlow 2.5s ease-in-out infinite' : 'none',
      }}>
        <PixelStar size={10} color={isOnline ? '#b5ead7' : '#4a3f6e'} shadowColor={isOnline ? '#6aab90' : '#2d2b3d'}/>
      </div>
      <span style={{
        fontFamily: "'Fredoka'",
        fontSize:    11,
        color:       isOnline ? '#b5ead7' : '#7a6fa0',
        whiteSpace: 'nowrap',
        lineHeight:  1,
      }}>
        {label}
      </span>
    </div>
  );
}

Object.assign(window, { InlineSyncStatus });
