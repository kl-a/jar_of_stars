// Main App — navigation shell, routing, export reminder hooks.
// Next.js migration: move NavBar to src/components/Layout/NavBar.tsx,
// App becomes app/layout.tsx + app/page.tsx.

function NavBar({ page, onNavigate }) {
  const items = [
    { id: 'home',       label: 'Home',     icon: '⌂' },
    { id: 'collection', label: 'Stars',    icon: '✦' },
    { id: 'people',     label: 'People',   icon: '♟' },
    { id: 'settings',   label: 'Settings', icon: '⚙' },
  ];

  return (
    <nav style={{
      position:       'fixed',
      bottom:          0,
      left:            0,
      right:           0,
      zIndex:          50,
      background:     '#16213e',
      borderTop:      '2px solid #9b89c4',
      display:        'flex',
      justifyContent: 'space-around',
      alignItems:     'center',
      paddingBottom:  'env(safe-area-inset-bottom)',
      height:          64,
    }}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            background:    'none',
            border:        'none',
            cursor:        'pointer',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:            4,
            padding:       '6px 20px',
            opacity:        page === item.id ? 1 : 0.4,
            transition:    'opacity 0.15s',
          }}
        >
          <span style={{
            fontSize:   22,
            color:       page === item.id ? '#c9b8f0' : '#9b89c4',
            display:    'block',
            lineHeight:  1,
          }}>
            {item.icon}
          </span>
          <span style={{
            fontFamily:   "'Fredoka'",
            fontSize:      12,
            color:         page === item.id ? '#c9b8f0' : '#9b89c4',
            fontWeight:    page === item.id ? 700 : 400,
            letterSpacing:  0.5,
          }}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [page,               setPage]               = React.useState('home');
  const [showExportReminder, setShowExportReminder] = React.useState(false);
  const [storeState,         setStoreState]         = React.useState({
    stars:       window.store.stars,
    people:      window.store.people,
    isOnboarded: window.store.isOnboarded,
  });

  function refreshStore() {
    setStoreState({
      stars:       [...window.store.stars],
      people:      [...window.store.people],
      isOnboarded: window.store.isOnboarded,
    });
  }

  React.useEffect(() => window.store.subscribe(refreshStore), []);

  // Initialise Google Drive sync (no-op if CLIENT_ID not configured or GIS unavailable)
  React.useEffect(() => {
    try { window.driveSync?.init(); } catch (e) { console.error('[DriveSync]', e); }
  }, []);

  // Clear new-person badges shortly after load
  React.useEffect(() => {
    if (window.store.isOnboarded) {
      setTimeout(() => window.store.clearNewFlags(), 500);
    }
  }, []);

  // beforeunload — warn only when Drive sync is not active (data would be lost)
  React.useEffect(() => {
    function handleBeforeUnload(e) {
      if (window.store.stars.length === 0) return;
      if (window.driveSync?.isSignedIn()) return; // Drive keeps data safe
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // visibilitychange — show export reminder only when Drive sync is not active
  React.useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState !== 'visible') return;
      if (window.store.stars.length === 0) return;
      if (window.driveSync?.isSignedIn()) return; // Drive keeps data safe
      if (sessionStorage.getItem('exportReminderShown')) return;
      sessionStorage.setItem('exportReminderShown', '1');
      setShowExportReminder(true);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const { stars, people, isOnboarded } = storeState;

  const contentStyle = {
    position:  'fixed',
    top:        0,
    left:       0,
    right:      0,
    bottom:     64,
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e', position: 'relative' }}>
      {!isOnboarded ? (
        <OnboardingFlow onComplete={refreshStore}/>
      ) : (
        <>
          <NavBar page={page} onNavigate={setPage}/>
          <div style={contentStyle}>
            {page === 'home' && (
              <HomePage onNavigate={setPage} stars={stars} people={people}/>
            )}
            {page === 'collection' && (
              <CollectionPage stars={stars} people={people} onNavigate={setPage}/>
            )}
            {page === 'people' && (
              <PeoplePage people={people} stars={stars} onUpdate={refreshStore}/>
            )}
            {page === 'settings' && (
              <SettingsPage stars={stars} people={people}/>
            )}
          </div>
        </>
      )}

      {showExportReminder && (
        <ExportReminderModal
          onClose={() => setShowExportReminder(false)}
          onNavigateToSettings={() => { setPage('settings'); setShowExportReminder(false); }}
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
