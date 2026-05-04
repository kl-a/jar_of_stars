# Jar of Stars ✦

A cosy browser app for collecting fond memories. Add moments you want to remember, tag the people in them, and pull a random star whenever you need a boost.

All data is stored locally in your browser — nothing is sent anywhere.

---

## Running locally

There is no build step. The app is plain HTML + CDN React, so you just need a local HTTP server (opening the file directly with `file://` won't work because browsers block local script loading).

**Option 1 — Python (no install needed):**
```bash
cd /path/to/jar_of_stars
python3 -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

**Option 2 — Node (npx, no install needed):**
```bash
cd /path/to/jar_of_stars
npx serve .
```

**Option 3 — VS Code:**
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html`, and choose **Open with Live Server**.

---

## Tech stack

| Layer | What's used |
|---|---|
| UI framework | React 18 (CDN) |
| JSX transpiler | Babel Standalone (CDN) |
| Styling | Inline styles |
| Font | Press Start 2P (Google Fonts) |
| Storage | `localStorage` |
| Build tool | None |

---

## Project structure

```
index.html              ← entry point
src/
  utils/                uuid · fileIO · starEngine
  store/                global store (localStorage)
  types/                JSDoc type definitions
  components/
    UI/                 PixelButton · PixelStar · Tag · ModalOverlay
                        AvatarPicker · TagInput · PersonInput
                        ExportReminderModal
    Jar/                JarSVG
    Stars/              AddStarModal · StarCard · StarExpandModal
                        StarZipAnimation
    StarPull/           PullReveal · ScrollSVG · TrumpeterSVG · Streamers
    People/             PersonCard · PersonProfile
    Onboarding/         WelcomeFlow
  pages/                HomePage · CollectionPage · PeoplePage · SettingsPage
  App.jsx               shell, routing, export-reminder hooks
docs/                   design document + wireframes
```

---

## Data & privacy

- All memories and people are saved only in the browser's `localStorage` under the key `jar_of_stars_db`.
- Nothing is sent to any server.
- Use **Settings → Download Backup** to export your data as a JSON file you can restore later.
- The app will warn you before you close the tab if you have unsaved stars and haven't downloaded a backup.
