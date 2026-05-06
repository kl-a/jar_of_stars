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
  const CLIENT_ID  = '80276356803-oo1524sai73jnaica4srti6laacp793i.apps.googleusercontent.com';
  const SCOPE      = 'https://www.googleapis.com/auth/drive.appdata email profile';
  const FILE_NAME  = 'jar-of-stars.json';
  const SYNC_DELAY = 3000; // ms debounce before writing

  let _tokenClient  = null;
  let _token        = null;
  let _tokenExpiry  = 0;
  let _fileId       = null;
  let _userInfo     = null;
  let _syncTimer    = null;
  let _configured   = !CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID');
  let _isRefreshing = false; // true during a silent token refresh
  let _pendingSave  = false; // save was queued while refresh was in flight

  // 'signed-out' | 'signing-in' | 'loading' | 'syncing' | 'synced' | 'error' | 'session-expired'
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

  // Last-write-wins merge: items with a newer updated_at (or created_at fallback) win.
  function _merge(localItems, driveItems, idKey) {
    const map = new Map();
    driveItems.forEach(item => map.set(item[idKey], item));
    localItems.forEach(item => {
      const existing = map.get(item[idKey]);
      const localTs  = item.updated_at  || item.created_at  || '';
      const driveTs  = existing ? (existing.updated_at || existing.created_at || '') : '';
      if (!existing || localTs > driveTs) map.set(item[idKey], item);
    });
    return [...map.values()];
  }

  // ── Token callback ────────────────────────────────────────────────────────────

  async function _onToken(response) {
    if (response.error) {
      _isRefreshing = false;
      _setStatus('signed-out');
      return;
    }
    _token       = response.access_token;
    _tokenExpiry = Date.now() + (response.expires_in - 60) * 1000;
    localStorage.setItem('josConnected', '1');

    // Silent token refresh — just update the token and flush any queued save
    if (_isRefreshing) {
      _isRefreshing = false;
      _setStatus('synced');
      if (_pendingSave) {
        _pendingSave = false;
        driveSync.scheduleSave();
      }
      return;
    }

    _setStatus('loading');
    try {
      await _fetchUserInfo();
      _fileId = await _findFile();
      if (_fileId) {
        const driveData = await _readFile(_fileId);
        if (driveData && driveData.stars) {
          const local = window.store.exportRaw();
          const merged = {
            ...driveData,
            stars:  _merge(local.stars,  driveData.stars,  'star_id'),
            people: _merge(local.people, driveData.people, 'people_id'),
          };
          window.store.importDatabase(merged, true);
          // Write merged result back so Drive is up to date
          await _writeFile(window.store.exportRaw());
        }
      }
      _setStatus('synced');
    } catch (e) {
      console.error('[DriveSync] load error', e);
      _setStatus('error');
    }
  }

  // Creates the token client on first use — ensures GIS is fully ready
  function _ensureClient() {
    if (_tokenClient) return;
    _tokenClient = google.accounts.oauth2.initTokenClient({
      client_id:      CLIENT_ID,
      scope:          SCOPE,
      callback:       _onToken,
      error_callback: () => {
        _isRefreshing = false;
        if (localStorage.getItem('josConnected')) {
          // Was connected — session expired rather than never signed in
          _setStatus('session-expired');
        } else {
          localStorage.removeItem('josConnected');
          _setStatus('signed-out');
        }
      },
    });
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
      // Intentionally lightweight — token client is created lazily in signIn()
      // so GIS is guaranteed to be fully ready by the time it's needed.
      if (!_configured) return;
      // Silent re-auth for returning users (GIS is always loaded by window.load)
      window.addEventListener('load', () => {
        if (!localStorage.getItem('josConnected')) return;
        if (!window.google?.accounts?.oauth2) return;
        try {
          _ensureClient();
          _tokenClient.requestAccessToken({ prompt: '' });
        } catch (e) { console.error('[DriveSync] silent re-auth error', e); }
      });
    },

    // Call directly from button onClick — synchronous so iOS Safari allows the popup
    signIn() {
      if (!_configured) return;
      _isRefreshing = false; // explicit sign-in always does a full load
      _pendingSave  = false;
      _setStatus('signing-in');
      try {
        _ensureClient();
        _tokenClient.requestAccessToken({ prompt: 'select_account' });
      } catch (e) {
        console.error('[DriveSync] signIn error', e);
        _setStatus('error');
      }
    },

    signOut() {
      if (_token) google.accounts.oauth2.revoke(_token, () => {});
      _token       = null;
      _tokenExpiry = 0;
      _fileId      = null;
      _userInfo    = null;
      localStorage.removeItem('josConnected');
      _setStatus('signed-out');
    },

    scheduleSave() {
      if (!driveSync.isSignedIn()) {
        // Token expired mid-session — try a silent refresh first
        if (localStorage.getItem('josConnected') && !_isRefreshing) {
          _isRefreshing = true;
          _pendingSave  = true;
          try {
            _ensureClient();
            _tokenClient.requestAccessToken({ prompt: '' });
          } catch (e) {
            _isRefreshing = false;
            _setStatus('session-expired');
          }
        }
        return;
      }
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
