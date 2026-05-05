// Google Drive sync — stores one JSON file in the app's hidden appDataFolder.
// Uses Google Identity Services (GIS) token flow + Drive REST API via fetch().
// No backend or gapi client library required.
//
// SETUP (one-time):
//   1. Go to console.cloud.google.com → New project
//   2. Enable the Google Drive API
//   3. APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application)
//   4. Authorised JavaScript origins: add https://kl-a.github.io and http://localhost:8080
//   5. Paste the Client ID below

(function () {
  const CLIENT_ID  = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
  const SCOPE      = 'https://www.googleapis.com/auth/drive.appdata email profile';
  const FILE_NAME  = 'jar-of-stars.json';
  const SYNC_DELAY = 3000; // ms debounce before writing

  let _tokenClient = null;
  let _token       = null;
  let _tokenExpiry = 0;
  let _fileId      = null;
  let _userInfo    = null;
  let _syncTimer   = null;
  let _configured  = !CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID');

  // 'signed-out' | 'signing-in' | 'loading' | 'syncing' | 'synced' | 'error'
  let _status    = 'signed-out';
  let _listeners = [];

  function _setStatus(s) {
    _status = s;
    _listeners.forEach(fn => fn(s));
  }

  // ── Drive helpers (all via fetch) ────────────────────────────────────────────

  function _auth() {
    return { Authorization: `Bearer ${_token}` };
  }

  async function _findFile() {
    const q   = encodeURIComponent(`name='${FILE_NAME}'`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id)`,
      { headers: _auth() }
    );
    const { files = [] } = await res.json();
    return files.length > 0 ? files[0].id : null;
  }

  async function _readFile(fileId) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers: _auth() }
    );
    return res.json();
  }

  async function _writeFile(data) {
    const body = JSON.stringify(data);
    if (_fileId) {
      await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${_fileId}?uploadType=media`,
        { method: 'PATCH', headers: { ..._auth(), 'Content-Type': 'application/json' }, body }
      );
    } else {
      const boundary = 'jos_bnd';
      const meta     = JSON.stringify({ name: FILE_NAME, parents: ['appDataFolder'] });
      const mp = [
        `--${boundary}`,
        'Content-Type: application/json; charset=UTF-8',
        '',
        meta,
        `--${boundary}`,
        'Content-Type: application/json',
        '',
        body,
        `--${boundary}--`,
      ].join('\r\n');
      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method:  'POST',
          headers: { ..._auth(), 'Content-Type': `multipart/related; boundary=${boundary}` },
          body:    mp,
        }
      );
      const result = await res.json();
      _fileId = result.id;
    }
  }

  async function _fetchUserInfo() {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: _auth() });
    _userInfo = await res.json();
  }

  // ── Token callback ────────────────────────────────────────────────────────────

  async function _onToken(response) {
    if (response.error) {
      _setStatus('signed-out');
      return;
    }
    _token       = response.access_token;
    _tokenExpiry = Date.now() + (response.expires_in - 60) * 1000;

    _setStatus('loading');
    try {
      await _fetchUserInfo();
      _fileId = await _findFile();
      if (_fileId) {
        const data = await _readFile(_fileId);
        if (data && data.stars) {
          window.store.importDatabase(data, true); // true = skip Drive write-back
        }
      }
      _setStatus('synced');
    } catch (e) {
      console.error('[DriveSync] load error', e);
      _setStatus('error');
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────────

  const driveSync = {
    isConfigured() { return _configured; },
    getStatus()    { return _status; },
    getUserInfo()  { return _userInfo; },
    isSignedIn()   { return !!_token && Date.now() < _tokenExpiry; },

    onStatus(fn) {
      _listeners.push(fn);
      return () => { _listeners = _listeners.filter(f => f !== fn); };
    },

    init() {
      if (!_configured) return;
      _tokenClient = google.accounts.oauth2.initTokenClient({
        client_id:      CLIENT_ID,
        scope:          SCOPE,
        callback:       _onToken,
        error_callback: () => _setStatus('signed-out'),
      });
      // Silent attempt on load — shows no popup if user hasn't consented yet
      _tokenClient.requestAccessToken({ prompt: '' });
    },

    // Call directly from button onClick — synchronous so iOS Safari allows the popup
    signIn() {
      _setStatus('signing-in');
      _tokenClient.requestAccessToken({ prompt: 'select_account' });
    },

    signOut() {
      if (_token) google.accounts.oauth2.revoke(_token, () => {});
      _token       = null;
      _tokenExpiry = 0;
      _fileId      = null;
      _userInfo    = null;
      _setStatus('signed-out');
    },

    scheduleSave() {
      if (!driveSync.isSignedIn()) return;
      clearTimeout(_syncTimer);
      _syncTimer = setTimeout(async () => {
        _setStatus('syncing');
        try {
          await _writeFile(window.store.exportRaw());
          _setStatus('synced');
        } catch (e) {
          console.error('[DriveSync] save error', e);
          _setStatus('error');
        }
      }, SYNC_DELAY);
    },
  };

  window.driveSync = driveSync;
})();
