// Settings page — export/import backup, about section.
// Next.js migration: export default function SettingsPage(...)

const FAQ_ITEMS = [
  {
    q: 'Is my data private?',
    a: "Yes. Your memories are stored in your own Google Drive under a hidden app folder that only Jar of Stars can see. We never have access to your data.",
  },
  {
    q: 'What happens if I add memories while offline?',
    a: "No problem. Your memories are always saved locally on this device first. When you reconnect and sign back in, Jar of Stars compares timestamps and keeps whichever version of each memory or person was updated most recently — nothing gets lost.",
  },
  {
    q: 'Will signing out delete my memories?',
    a: "No. Signing out only disconnects the sync — your memories stay saved locally on this device. They are also safely stored in your Google Drive for when you sign back in.",
  },
  {
    q: 'How long does a Google sign-in session last?',
    a: "Google access tokens last about one hour. Jar of Stars will silently renew your session in the background while you use the app. If the renewal fails (e.g. after a very long break), you will see a 'Session expired' prompt and can tap Reconnect — no memories are lost.",
  },
  {
    q: 'Can I use Jar of Stars on multiple devices?',
    a: "Yes! Sign in with the same Google account on each device. The last-updated version of each memory wins when syncing, so you can freely add memories on any device.",
  },
  {
    q: 'How do I back up or move my data?',
    a: "Use Export Data (above) to download a JSON file of all your memories and people. You can import it on any device using Import Data — even without a Google account.",
  },
];

function FaqItem({ item }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(122,111,160,0.3)', paddingBottom: open ? 10 : 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 0', textAlign: 'left', gap: 10,
        }}
      >
        <span style={{ fontFamily: "'Fredoka'", fontSize: 13, color: '#c9b8f0', lineHeight: 1.4, flex: 1 }}>
          {item.q}
        </span>
        <span style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', flexShrink: 0, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </span>
      </button>
      {open && (
        <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#9b89c4', lineHeight: 2, paddingBottom: 4 }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

function SettingsPage({ stars, people }) {
  const [importConfirm, setImportConfirm] = React.useState(false);
  const [pendingDb,     setPendingDb]     = React.useState(null);
  const [importError,   setImportError]   = React.useState('');
  const [importSuccess, setImportSuccess] = React.useState(false);
  const [driveStatus,   setDriveStatus]   = React.useState(() => window.driveSync?.getStatus() || 'signed-out');
  const [driveUser,     setDriveUser]     = React.useState(() => window.driveSync?.getUserInfo() || null);
  const [faqOpen,       setFaqOpen]       = React.useState(false);
  const fileRef = React.useRef(null);

  React.useEffect(() => {
    if (!window.driveSync?.isConfigured()) return;
    return window.driveSync.onStatus(s => {
      setDriveStatus(s);
      setDriveUser(window.driveSync.getUserInfo());
    });
  }, []);

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const db = JSON.parse(ev.target.result);
        if (!db.stars || !db.people) throw new Error('Invalid schema');
        setPendingDb(db);
        setImportConfirm(true);
        setImportError('');
      } catch {
        setImportError("This file doesn't look like a valid Jar of Stars backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function confirmImport() {
    window.store.importDatabase(pendingDb);
    setImportConfirm(false);
    setPendingDb(null);
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 3000);
  }

  const cardStyle = {
    background:   '#c9b8f0',
    border:       '2px solid #7a6fa0',
    borderRadius:  6,
    boxShadow:    '3px 3px 0 #7a6fa0',
    padding:      '18px 16px',
    marginBottom:  14,
  };

  const bodyTextStyle = {
    fontFamily: "'Fredoka'",
    fontSize:    12,
    color:      '#7a6fa0',
    lineHeight:  2,
    marginBottom: 14,
  };

  return (
    <div style={{ padding: '20px 16px', maxWidth: 500, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <span style={{ fontSize: 16 }}>⚙</span>
        <span style={{ fontFamily: "'Fredoka'", fontSize: 18, color: '#fdfcff' }}>Settings</span>
      </div>

      {/* Google Drive Sync */}
      {window.driveSync?.isConfigured() && (
        <div style={cardStyle}>
          <div style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#2d2b3d', marginBottom: 10 }}>
            Google Drive Sync
          </div>

          {driveStatus === 'signed-out' || driveStatus === 'signing-in' ? (
            <>
              <div style={bodyTextStyle}>
                Sign in to automatically sync your memories across all your devices.
                Your data is stored in your own Google Drive — we never see it.
              </div>
              <PixelButton
                onClick={() => window.driveSync.signIn()}
                color="#c4d4f8" shadowColor="#7a9fd4"
                disabled={driveStatus === 'signing-in'}
                small
              >
                {driveStatus === 'signing-in' ? '⏳ Signing in…' : 'Sign in with Google'}
              </PixelButton>
            </>
          ) : driveStatus === 'session-expired' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                {driveUser?.picture && (
                  <img
                    src={driveUser.picture}
                    alt=""
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #c98a88', flexShrink: 0, opacity: 0.7 }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Fredoka'", fontSize: 13, color: '#2d2b3d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {driveUser?.email || 'Google Account'}
                  </div>
                  <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#c98a88', marginTop: 2 }}>
                    ⚠ Session expired
                  </div>
                </div>
              </div>
              <div style={bodyTextStyle}>
                Your sync session has expired. Tap below to reconnect — your memories are safe.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <PixelButton onClick={() => window.driveSync.signIn()} color="#ffeaa7" shadowColor="#c9a84c" small>
                  ↺ Reconnect
                </PixelButton>
                <PixelButton onClick={() => window.driveSync.signOut()} color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff" small>
                  Sign Out
                </PixelButton>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {driveUser?.picture && (
                <img
                  src={driveUser.picture}
                  alt=""
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #7a6fa0', flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Fredoka'", fontSize: 13, color: '#2d2b3d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {driveUser?.email || 'Google Account'}
                </div>
                <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: {
                  loading:  '#9b89c4',
                  syncing:  '#9b89c4',
                  synced:   '#6aab90',
                  error:    '#c98a88',
                }[driveStatus] || '#9b89c4', marginTop: 2 }}>
                  {{ loading: '⏳ Loading…', syncing: '⟳ Syncing…', synced: '✓ Synced', error: '⚠ Sync error — check connection' }[driveStatus] || ''}
                </div>
              </div>
              <PixelButton
                onClick={() => window.driveSync.signOut()}
                color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff"
                small
              >Sign Out</PixelButton>
            </div>
          )}
        </div>
      )}

      {/* Export */}
      <div style={cardStyle}>
        <div style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#2d2b3d', marginBottom: 10 }}>
          Export Data
        </div>
        <div style={bodyTextStyle}>
          Download your {stars.length} {stars.length === 1 ? 'memory' : 'memories'} and {people.length} {people.length === 1 ? 'person' : 'people'} as a JSON file.
        </div>
        <PixelButton onClick={() => window.store.exportDatabase()} color="#b5ead7" shadowColor="#6aab90" small>
          ↓ Download Backup
        </PixelButton>
      </div>

      {/* Import */}
      <div style={cardStyle}>
        <div style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#2d2b3d', marginBottom: 10 }}>
          Import Data
        </div>
        <div style={bodyTextStyle}>
          Restore from a previous backup. This will replace your current data.
        </div>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileSelect}/>
        <PixelButton onClick={() => fileRef.current.click()} color="#ffeaa7" shadowColor="#c9a84c" small>
          ↑ Import Backup
        </PixelButton>
        {importError && (
          <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#c98a88', marginTop: 10, lineHeight: 2 }}>
            {importError}
          </div>
        )}
        {importSuccess && (
          <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#6aab90', marginTop: 10, lineHeight: 2 }}>
            ✓ Import successful!
          </div>
        )}
      </div>

      {/* About */}
      <div style={{
        background:   'rgba(201,184,240,0.1)',
        border:       '2px solid #7a6fa0',
        borderRadius:  6,
        padding:      '18px 16px',
        marginBottom:  14,
      }}>
        <div style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#fdfcff', marginBottom: 12 }}>
          About
        </div>
        <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#9b89c4', lineHeight: 2.2 }}>
          Jar of Stars v1.0.0
          <br/>
          A cosy place to collect fond memories.
          <br/><br/>
          Every joy deserves to be remembered. ✦
        </div>
      </div>

      {/* FAQ */}
      <div style={{
        background:   'rgba(201,184,240,0.1)',
        border:       '2px solid #7a6fa0',
        borderRadius:  6,
        overflow:     'hidden',
      }}>
        <button
          onClick={() => setFaqOpen(o => !o)}
          style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px',
          }}
        >
          <span style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#fdfcff' }}>FAQ</span>
          <span style={{ fontFamily: "'Fredoka'", fontSize: 14, color: '#7a6fa0', transition: 'transform 0.2s', display: 'inline-block', transform: faqOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▾
          </span>
        </button>
        {faqOpen && (
          <div style={{ padding: '0 16px 8px' }}>
            {FAQ_ITEMS.map((item, i) => <FaqItem key={i} item={item}/>)}
          </div>
        )}
      </div>

      {/* Confirm import dialog */}
      {importConfirm && (
        <ModalOverlay onClose={() => setImportConfirm(false)} center>
          <div style={{
            background:   '#c9b8f0',
            border:       '2px solid #7a6fa0',
            borderRadius:  8,
            boxShadow:    '4px 4px 0 #7a6fa0',
            width:        '100%',
            maxWidth:      400,
            padding:      '24px 20px 32px',
            margin:       '0 16px',
          }}>
            <div style={{ fontFamily: "'Fredoka'", fontSize: 16, color: '#2d2b3d', marginBottom: 14 }}>
              Replace Data?
            </div>
            <div style={{ fontFamily: "'Fredoka'", fontSize: 12, color: '#7a6fa0', marginBottom: 24, lineHeight: 2 }}>
              This will replace your current {stars.length} {stars.length === 1 ? 'memory' : 'memories'} and {people.length} {people.length === 1 ? 'person' : 'people'} with the imported data. Are you sure?
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <PixelButton onClick={confirmImport} color="#ffeaa7" shadowColor="#c9a84c" small>
                Yes, Replace
              </PixelButton>
              <PixelButton onClick={() => setImportConfirm(false)} color="#9b89c4" shadowColor="#7a6fa0" textColor="#fdfcff" small>
                Cancel
              </PixelButton>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

Object.assign(window, { SettingsPage });
