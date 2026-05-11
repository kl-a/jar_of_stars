# Jar of Stars — Architectural Design Document

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Repository Structure](#3-repository-structure)
4. [Data Models](#4-data-models)
5. [State Management](#5-state-management)
6. [Persistence & Sync](#6-persistence--sync)
7. [Component Architecture](#7-component-architecture)
8. [Page Architecture](#8-page-architecture)
9. [Rendering Systems](#9-rendering-systems)
10. [Audio System](#10-audio-system)
11. [Visual Design System](#11-visual-design-system)
12. [Script Loading & Execution Order](#12-script-loading--execution-order)
13. [Deployment Pipeline](#13-deployment-pipeline)
14. [Key Architectural Patterns](#14-key-architectural-patterns)

---

## 1. Project Overview

Jar of Stars is a cosy, privacy-first memory-collecting app. Users write short memories ("stars"), tag people involved, and drop them into a jar. Stars can be pulled out at random — like reaching into a jar and drawing a memory. The app runs entirely in the browser with no backend; data lives in localStorage and optionally in the user's own Google Drive.

**Core design values:**
- Zero server dependency (fully static)
- Delightful, tactile UI (pixel art, physics, canvas animations)
- Data owned entirely by the user
- No accounts, no tracking, no ads

---

## 2. Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| UI framework | React 18.3.1 (CDN UMD) | No bundler required; fast to iterate |
| JSX transform | Babel Standalone 7.29.0 | Transforms JSX in-browser at runtime |
| Styling | Inline CSS objects | Collocated with components; no class conflicts |
| Persistence | localStorage + Google Drive REST API | Works offline; optional cloud backup |
| Auth | Google Identity Services (GIS) | Token-based, no backend callback needed |
| Canvas | Web Canvas 2D API | Sky backgrounds and physics animation |
| Audio | Web Audio API | Synthesised sounds; no asset files needed |
| Deploy | GitHub Pages via GitHub Actions | Static hosting, zero cost |

There is intentionally no build step, no `node_modules`, and no bundler. Scripts are loaded as `<script>` tags in dependency order. Babel Standalone fetches each `type="text/babel"` file via XHR and transforms it client-side before execution.

---

## 3. Repository Structure

```
jar_of_stars/
├── index.html                        # Entry point — loads all scripts in order
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Pages deployment workflow
├── docs/
│   └── architecture.md               # This document
├── src/
│   ├── App.jsx                       # Root component — routing, nav bar, onboarding gate
│   ├── data/
│   │   └── balloon_prompts.json      # 30 memory prompts across 6 categories
│   ├── store/
│   │   └── store.js                  # Global data store (singleton, observer pattern)
│   ├── utils/
│   │   ├── uuid.js                   # UUID v4 generator
│   │   ├── fileIO.js                 # localStorage read/write, JSON export
│   │   ├── starEngine.js             # Star colour hashing, tag aggregation, random pull
│   │   └── driveSync.js              # Google Drive sync (IIFE singleton)
│   ├── components/
│   │   ├── UI/                       # Primitive, reusable UI elements
│   │   │   ├── PixelStar.jsx         # SVG pixel-art star icon
│   │   │   ├── PixelButton.jsx       # Pixel-art press-down button
│   │   │   ├── Tag.jsx               # Removable chip label
│   │   │   ├── ModalOverlay.jsx      # Dark backdrop + dismiss on outside click
│   │   │   ├── AvatarPicker.jsx      # 12 zodiac avatar grid + AvatarDisplay
│   │   │   ├── TagInput.jsx          # Multi-tag input with autocomplete
│   │   │   ├── PersonInput.jsx       # Multi-person select + auto-create
│   │   │   ├── InlineSyncStatus.jsx  # Compact Drive sync status badge
│   │   │   └── ExportReminderModal.jsx # Backup nudge shown on tab focus
│   │   ├── Jar/
│   │   │   └── JarSVG.jsx            # Mason jar SVG with liquid fill + sparkles
│   │   ├── Stars/
│   │   │   ├── AddStarModal.jsx      # New star creation form
│   │   │   ├── StarCard.jsx          # Memory card with holographic foil
│   │   │   ├── StarExpandModal.jsx   # Full star detail + edit view
│   │   │   └── StarZipAnimation.jsx  # Star-forms-then-flies-to-jar animation
│   │   ├── People/
│   │   │   ├── PersonCard.jsx        # Person summary card with avatar
│   │   │   └── PersonProfile.jsx     # Editable profile + linked stars
│   │   ├── StarPull/
│   │   │   ├── PullReveal.jsx        # Full-screen celebratory reveal animation
│   │   │   ├── ScrollSVG.jsx         # Parchment scroll SVG
│   │   │   ├── TrumpeterSVG.jsx      # Pixel-art trumpeter character
│   │   │   ├── Streamers.jsx         # Falling confetti streamers
│   │   │   └── SootSprite.jsx        # Soot sprite character (Spirited Away)
│   │   └── Onboarding/
│   │       └── WelcomeFlow.jsx       # First-launch onboarding with first star input
│   └── pages/
│       ├── HomePage.jsx              # Jar scene, sky canvas, physics, floating present
│       ├── CollectionPage.jsx        # Star grid with search, filter, sort
│       ├── PeoplePage.jsx            # People grid with profiles
│       └── SettingsPage.jsx          # Sync, export/import, about, FAQ
```

---

## 4. Data Models

All data is plain JSON. No external schema validation library is used.

### Star

```js
{
  star_id:          string,   // UUID v4
  message:          string,   // The memory text
  from_people_ids:  string[], // Array of people_id references
  date:             string,   // YYYY-MM-DD
  tags:             string[], // Lowercase strings
  favourite:        boolean,
  pull_count:       number,   // How many times pulled from jar
  created_at:       string,   // ISO 8601
  updated_at:       string    // ISO 8601
}
```

### Person

```js
{
  people_id:  string,   // UUID v4
  name:       string,
  note:       string,   // Optional description
  avatar_id:  string,   // 'avatar_01' through 'avatar_12' (zodiac animals)
  star_ids:   string[], // Stars this person is linked to (denormalised)
  is_new:     boolean,  // Cleared 500ms after app loads
  created_at: string,   // ISO 8601
  updated_at: string    // ISO 8601
}
```

### Database envelope (localStorage / Drive)

```js
{
  version: '1.0.0',
  stars:   Star[],
  people:  Person[]
}
```

### Balloon Prompt

```js
{
  id:       string,   // 'prompt_001', etc.
  text:     string,   // The question shown to the user
  category: string,   // small_magic | people | firsts_and_adventures |
                      // comfort_and_safety | laughter | reflective
  weight:   string    // 'common' (3× draw probability) or 'rare' (1×)
}
```

---

## 5. State Management

There is no third-party state library. State lives at three levels:

### Global Store (`window.store`)

`src/store/store.js` is a hand-written singleton loaded as a plain `<script>` tag (no Babel). It exposes:

| Method | Description |
|---|---|
| `addStar(fields)` | Creates star with UUID + timestamps, notifies |
| `updateStar(id, updates)` | Merges updates, stamps `updated_at`, notifies |
| `deleteStar(id)` | Removes star + cleans up `from_people_ids` references |
| `pullRandomStar(favouritesOnly)` | Increments `pull_count`, notifies |
| `addPerson(fields)` | Creates person with UUID + `is_new: true` |
| `updatePerson(id, updates)` | Merges updates, stamps `updated_at` |
| `deletePerson(id)` | Removes person, strips ID from all linked stars |
| `importDatabase(db)` | Replaces store state and triggers Drive write |
| `exportRaw()` | Returns raw `{version, stars, people}` object |
| `subscribe(fn)` | Registers listener; returns unsubscribe function |

Every mutating method calls `_save()` (persists to localStorage + schedules Drive write) and `_notify()` (calls all subscribers).

**Subscription pattern used in React:**
```jsx
React.useEffect(() => window.store.subscribe(refreshStore), []);
```
`refreshStore` calls `setStoreState({ stars: [...window.store.stars], ... })`, triggering a re-render. This means any store mutation anywhere in the app automatically propagates to all subscribing components.

### Drive Sync Singleton (`window.driveSync`)

Detailed in section 6. Components read status via `window.driveSync.onStatus(fn)` and call `window.driveSync.signIn()` / `signOut()` directly.

### Component State (React `useState`)

Local UI state — modal open/closed, filter values, edit modes, animation flags — lives in component state. Nothing that doesn't need to survive a re-mount is lifted to the store.

---

## 6. Persistence & Sync

### localStorage

`src/utils/fileIO.js` handles localStorage under the key `'jar-of-stars-db'`. Every store mutation serialises the full database to JSON and writes it. Reads happen once on store initialisation (constructor).

### Google Drive Sync (`src/utils/driveSync.js`)

Drive sync is optional and uses the user's own Google Drive `appDataFolder` — a hidden folder only accessible to this app. The implementation is a single IIFE that sets `window.driveSync`.

**Token lifecycle:**
1. On `init()`, the GIS token client is created lazily
2. If `localStorage.josConnected === 'true'`, a silent token refresh is attempted immediately (no browser popup)
3. Tokens expire after 1 hour; expiry is tracked by `_tokenExpiry`. On the next write, if expired, a silent refresh runs first
4. If the silent refresh fails (revoked access), status becomes `'session-expired'` and the user is prompted to sign in explicitly

**Write flow:**
1. Store calls `window.driveSync?.scheduleSave(db)` after every mutation
2. `scheduleSave` debounces writes by 3000ms to batch rapid edits
3. On write: if no `_fileId`, search Drive for `jar-of-stars.json`; if not found, create it
4. PATCH/create the file with the serialised database

**Merge strategy (last-write-wins per item):**
When the app loads and Drive is available, local data is merged with Drive data. For each item the winner is determined by comparing `updated_at` (falling back to `created_at`). The merged result is written back to Drive immediately.

```
merge(localItems, driveItems, idKey):
  For each item, keep whichever copy has the newer timestamp.
  Items present only in one side are always kept.
```

**Status states:**

```
signed-out → signing-in → loading → synced
                                  → syncing (on debounced write)
                                  → error
                         → session-expired (silent refresh failed)
```

---

## 7. Component Architecture

All React components are global functions assigned to `window` at the bottom of each file:

```js
Object.assign(window, { ComponentName });
```

This is the inter-script communication mechanism in lieu of ES modules. Components can reference other components (e.g. `<PixelButton>`) as long as their script tag appears earlier in `index.html`.

### UI Primitives

**PixelStar** — SVG 5-pointed star. Used as a decorative icon throughout. Accepts `size`, `color`, `shadowColor` props.

**PixelButton** — Pixel-art styled button. Tracks `pressed` state with mouse/touch events to shift `translate(-1px, -1px)` on press. Accepts `color`, `shadowColor`, `textColor`, `small`, `disabled`.

**ModalOverlay** — Shared backdrop for all modals. Sets `position: fixed; top: 0; left: 0; right: 0; bottom: 64px` (the 64px accounts for the fixed nav bar so modals don't overlap it). Clicking outside calls `onClose`. Centres children on desktop; bottom-aligns on mobile.

**TagInput** — Controlled multi-value input. Autocomplete dropdown filters from `suggestions` prop. Adds tag on Enter or comma; removes last tag on Backspace when input is empty.

**PersonInput** — Controlled multi-person selector. On Enter with no match, auto-creates a new person via `window.store.addPerson()`. Shows avatar + name + NEW badge per selected person.

**InlineSyncStatus** — Pill-shaped Drive status badge placed in page headers. Uses `window.driveSync.onStatus()` subscription. Shows a 10px PixelStar (green when synced, grey when offline) + text label. Clicking when offline calls `window.driveSync.signIn()`.

### Star Components

**AddStarModal** — Slides up on mobile, scales in on desktop, with cubic-bezier spring animation. Accepts an optional `promptContext` string (from the floating present prompt system) which renders a balloon-themed context card above the message field.

**StarCard** — The primary list item. Colour is determined by a deterministic hash of `star_id` against the 8-colour Konpeito palette (see `src/utils/starEngine.js`). On hover, the card tilts in 3D using cursor position relative to card centre. Favourite stars get a holographic foil overlay (animated `hue-rotate` + radial gradient that follows cursor). A "dog-ear" corner renders if `pull_count >= 10`.

**StarZipAnimation** — Plays once after a star is saved. A PixelStar grows to 32px at screen centre (0–300ms), then translates to the position of `[data-jar]` in the DOM while shrinking (300–950ms). Uses `getBoundingClientRect()` to locate the jar at runtime.

### Jar

**JarSVG** — A fully hand-drawn SVG mason jar. The liquid fill is an SVG `<rect>` clipped to the jar body, tinted with a yellow-gold gradient. `fillFraction` (0–1) controls the liquid height. Eight sparkle pixels inside the liquid cycle through CSS `twinkle` animation with staggered delays. Two ambient halo ellipses pulse with `glowPulse` prop when the jar is clicked.

### Pull Reveal

**PullReveal** — A four-phase orchestrated animation triggered when pulling a star:

| Phase | Timing | What happens |
|---|---|---|
| Overlay | 0–300ms | Dark backdrop fades in |
| Scroll unroll | 300–900ms | Parchment SVG expands into view |
| Content | 900–1400ms | Star message + metadata fade in on the scroll |
| Celebration | 1400ms+ | Two trumpeters slide in from sides, 5 soot sprites bounce up, streamers fall continuously |

A share button copies the star message + date to the clipboard.

### Onboarding

**WelcomeFlow** — Shown on first launch when `store.isOnboarded === false`. Renders an empty jar with a textarea for the first memory. Entrance animations are staggered across the page elements. Background stars are `useMemo`-ised so their positions don't regenerate on each keystroke. On submit, the first star is saved and `store.isOnboarded = true` is persisted.

---

## 8. Page Architecture

Pages are rendered conditionally in `App.jsx` based on `page` state:

```jsx
{page === 'home'       && <HomePage .../>}
{page === 'collection' && <CollectionPage .../>}
{page === 'people'     && <PeoplePage .../>}
{page === 'settings'   && <SettingsPage .../>}
```

Navigation is bottom tab bar (`NavBar` in `App.jsx`), fixed at 64px height.

### HomePage (`src/pages/HomePage.jsx`)

The most complex page. Has three independent rendering systems running simultaneously:

**1. Sky Canvas (`StarfieldCanvas`)**

A `<canvas>` element fills the entire screen. A `requestAnimationFrame` loop runs continuously, redrawing the sky. The scene is determined by `_skyPeriod()` which buckets the current hour:

| Period | Hours | Sky |
|---|---|---|
| Night | 18:00–04:00 | Deep navy gradient, 120 drifting stars, shooting stars, constellations |
| Dawn | 04:00–09:00 | Warm pink-to-blue gradient, clouds, dimmer stars |
| Day | 09:00–16:00 | Blue sky gradient, bright clouds |
| Golden | 16:00–18:00 | Orange-coral-purple gradient, star clusters near horizon |

Background stars (120) drift slowly with `vx`/`vy` velocities and wrap at canvas edges. 28% are "sharp" stars that use a squared sine function for dramatic on/off blink:
```js
bright = Math.pow(Math.max(0, Math.sin(t)), 2)
```
The remaining 72% breathe gently: `0.1 + 0.9 * (0.5 + 0.5 * sin(t))`.

Four Southern Hemisphere constellations are hard-coded by fractional canvas coordinates: Crux (Southern Cross), Centaurus (the Pointers), Scorpius, and Canopus.

Shooting stars spawn at a random interval (4–9 seconds) during night only. Each tracks fade-in → travel → fade-out with a fading tail.

**2. Floating Stars Physics (`FloatingStarsInJar`)**

Up to `floatingCount` (= `count % 10`, max 10) stars float inside the jar container. This is a separate RAF loop operating on direct DOM manipulation — no React state updates per frame.

Physics per star per frame:
- Mouse/touch attraction: `force = 0.0005 * distance` toward cursor if within the jar
- Boundary collision: velocity reflects and multiplies by `0.18` on jar wall contact
- Collision glow: brief `drop-shadow` on impact, fades over 30 frames
- Viscosity damping: velocity multiplied by `0.985` each frame
- Twinkle on collision: brief opacity flash

The jar boundary is defined by the rendered `[data-jar]` element dimensions at runtime.

**3. FloatingPresent**

An Animal Crossing-inspired balloon with a present box floats across the screen at every 10-minute clock mark (`Date.now() % 600000` alignment). The balloon:
- Picks a random colour from 8 saturated palette options
- Traverses screen edge-to-edge over 24–38 seconds with a sine-wave vertical drift
- Is clickable; clicking shows a prompt card with a randomly selected question from `balloon_prompts.json`
- Prompts are picked with weighted random: `common` prompts appear 3× as often as `rare`
- The prompt card has "Write a Star" (opens `AddStarModal` with the prompt pre-filled as context) and "Skip" buttons

### CollectionPage (`src/pages/CollectionPage.jsx`)

Stars are filtered client-side in this order: search → favourite toggle → person filter → tag filter, then sorted. Sort options: newest, oldest, most pulled, least pulled, alphabetical. The filtered list renders `StarCard` components in a masonry-style flex grid. Clicking a card opens `StarExpandModal`.

### PeoplePage (`src/pages/PeoplePage.jsx`)

Person cards render in a grid. Clicking opens `PersonProfile` as a bottom-sheet modal. New people can be added via an inline creation form. People with 10 or more linked stars get a halo glow ring on their card.

### SettingsPage (`src/pages/SettingsPage.jsx`)

Three main sections: Drive Sync (conditional on `CLIENT_ID` being configured), Data Management (export/import), and About + FAQ. The FAQ uses a controlled accordion: `faqOpen` is a Set of open item indices. Import triggers a confirmation dialog before applying.

---

## 9. Rendering Systems

### Canvas Sky

The starfield canvas is sized to `window.innerWidth × window.innerHeight` and resized on `window.resize`. It uses a single `requestAnimationFrame` loop that:
1. Clears the canvas
2. Draws the sky gradient for the current time period
3. Draws clouds (day/dawn) or stars + constellations + shooting stars (night/dawn/golden)
4. Increments the frame counter

The loop pauses via `pausedRef` when the tab is hidden (via `visibilitychange`) to save CPU.

### Physics (FloatingStarsInJar)

Each star element is a `position: absolute` div inside the jar container. The RAF loop reads element positions from `stateRef` (not the DOM) for performance, and writes back via `el.style.transform`. React is not involved in the per-frame update — the initial render creates the elements, the RAF loop animates them.

### CSS Animations

All keyframe animations are declared globally in `index.html`:

| Name | Duration | Used for |
|---|---|---|
| `jarWobble` | 0.6s | Jar rotates on click |
| `streamerRise` | 1.2–2.4s | Confetti in PullReveal |
| `heartFloat` | 0.8s | Hearts burst on favourite |
| `foilHue` | 2s | Holographic foil hue rotation |
| `starGlow` | 2.5s | Synced star pulse in InlineSyncStatus |
| `rippleExpand` | 0.85s | Click ripple on jar |
| `haloGlow` | 2s | Halo ring on PersonCard |
| `twinkle` | 1.6s | Sparkles in JarSVG liquid |
| `fadeIn` | 0.4s | Modal entrance, prompt card |
| `starSparkle` | 0.6s | Star icon burst |

---

## 10. Audio System

Synthesised using Web Audio API — no audio files required. The audio context is created lazily on first interaction (required by browser autoplay policy).

**`_soundOn()`** — Checks `localStorage.josSoundEnabled !== 'false'`.

**`_ensureAudio()`** — Creates `window._josAudio` on first call, resumes if suspended.

**`_playGlassPing()`** — Plays two detuned sine waves (1080→820 Hz + 2160→1640 Hz) with exponential ramp decay over 500ms. Triggered on jar click/tap.

**`_playStarTwinkle()`** — Plays a single 120ms tone at a random pitch between 1800–3400 Hz. Rate-limited to one play per 100ms to prevent overlapping bursts during rapid physics collisions.

Both functions are defined at the module level in `HomePage.jsx` (outside any component) so they are created once.

---

## 11. Visual Design System

### Colour Tokens

| Token | Value | Usage |
|---|---|---|
| Background | `#1a1a2e` | Page/app background |
| Surface | `#16213e` | Input fields, overlays, deep cards |
| Card | `#c9b8f0` | Modal panels, star pull scroll |
| Border | `#7a6fa0` | All component borders |
| Text Primary | `#fdfcff` | Headings, input text |
| Text Secondary | `#9b89c4` | Labels, captions, muted text |
| Text Hint | `#d4cce8` | Subtitle (e.g. "x memories inside") |
| Accent / Link | `#c9b8f0` | Highlights, selected states |
| Success | `#b5ead7` | Save buttons, synced indicator |
| Favourite | `#f7cac9` | Starred memory backgrounds |
| Warning | `#ffeaa7` | Edit badges, rename hints |
| Danger | `#c98a88` | Delete buttons |

### Typography

Single typeface: **Fredoka** (Google Fonts, 300–700 weights). Used at sizes 11px (micro labels) → 28px (page title). Letter-spacing of 1–2px on labels.

### Konpeito Star Palette

Stars are coloured deterministically by hashing `star_id`:

```js
function getStarColor(star_id) {
  let h = 0;
  for (const c of star_id) h = Math.imul(31, h) + c.charCodeAt(0);
  return KONPEITO[((h >>> 0) % 8)];
}
```

The 8 colours are pastel pairs (fill + shadow): rose, butter, mint, periwinkle, lavender, peach, blush, sky. The same star always gets the same colour across sessions.

### Balloon Palette

8 saturated colours for the floating present balloon, randomly picked on each spawn: rose red, violet purple, mint green, gold amber, hot pink, sky blue, coral orange, forest green.

### Responsive Breakpoint

A single breakpoint at **640px** (`window.innerWidth < 640`). Below this: modals slide up from the bottom, buttons are slightly smaller, layout stacks vertically.

---

## 12. Script Loading & Execution Order

Since there is no bundler, load order in `index.html` is the dependency graph. The order is:

```
1. CDN: React, ReactDOM, Babel Standalone (sync, from unpkg)
2. CDN: Google Identity Services (sync, from accounts.google.com)

3. src/utils/uuid.js          → window.generateId
4. src/utils/fileIO.js        → window.{STORAGE_KEY, loadFromStorage, saveToStorage, exportDatabase}
5. src/utils/starEngine.js    → window.{pullRandomStar, getAllTags, getStarColor}
6. src/store/store.js         → window.store
7. src/utils/driveSync.js     → window.driveSync

[Babel-compiled scripts below — fetched via XHR, transformed client-side]

8.  UI/PixelStar.jsx
9.  UI/PixelButton.jsx
10. UI/Tag.jsx
11. UI/ModalOverlay.jsx
12. UI/AvatarPicker.jsx         (defines AvatarDisplay + AvatarPicker)
13. UI/TagInput.jsx
14. UI/PersonInput.jsx          (depends on AvatarDisplay)
15. UI/ExportReminderModal.jsx
16. UI/InlineSyncStatus.jsx

17. Jar/JarSVG.jsx

18. StarPull/ScrollSVG.jsx
19. StarPull/TrumpeterSVG.jsx
20. StarPull/Streamers.jsx
21. StarPull/SootSprite.jsx

22. Stars/StarZipAnimation.jsx
23. Stars/StarCard.jsx          (depends on AvatarDisplay, PixelStar, PixelButton, Tag)
24. Stars/AddStarModal.jsx      (depends on ModalOverlay, PersonInput, TagInput, PixelButton, PixelStar)
25. Stars/StarExpandModal.jsx   (depends on StarCard)

26. StarPull/PullReveal.jsx     (depends on ScrollSVG, TrumpeterSVG, Streamers, SootSprite)

27. People/PersonCard.jsx       (depends on AvatarDisplay)
28. People/PersonProfile.jsx    (depends on AvatarDisplay, AvatarPicker, PixelButton, ModalOverlay)

29. Onboarding/WelcomeFlow.jsx  (depends on JarSVG, PixelButton, PixelStar)

30. pages/HomePage.jsx          (depends on JarSVG, AddStarModal, StarZipAnimation, PullReveal)
31. pages/CollectionPage.jsx    (depends on StarCard, StarExpandModal, AddStarModal)
32. pages/PeoplePage.jsx        (depends on PersonCard, PersonProfile)
33. pages/SettingsPage.jsx

34. App.jsx                     → root.render(<App/>)
```

Any violation of this order (e.g. using a component before its script tag) results in a `ReferenceError` and a blank page.

---

## 13. Deployment Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment: github-pages
    steps:
      - Checkout
      - Setup Pages
      - Upload artifact (path: .)   # entire repo as static artifact
      - Deploy to GitHub Pages
```

The entire repository is uploaded as the artifact and served as-is. There is no build step — the repo _is_ the deployment. Deployment completes in ~22 seconds.

**Live URL:** `https://kl-a.github.io/jar_of_stars/`

**Cache policy:** `Cache-Control: max-age=600` (10 minutes CDN TTL). After pushing a fix, users may need a hard refresh (`Cmd+Shift+R`) to bypass browser cache.

### Google Drive OAuth Configuration

The Google OAuth Client ID is hardcoded in `driveSync.js`. Authorised JavaScript origins must include both:
- `https://kl-a.github.io` (production)
- `http://localhost:8080` (local development)

Any new deployment domain must be added in Google Cloud Console → APIs & Services → Credentials.

---

## 14. Key Architectural Patterns

### Observer (Store Subscriptions)
The store implements a minimal pub/sub. React components subscribe in `useEffect`, receive a synchronous callback on every mutation, and update their local state snapshot. This gives React full control over rendering without the store needing to know anything about React.

### Singleton Globals
`window.store` and `window.driveSync` are singletons created once at script load time. Components access them directly rather than through props or context. This works because there is exactly one instance of each in the app lifetime.

### Last-Write-Wins Merge
Google Drive conflict resolution uses timestamp comparison per item. This is appropriate because Jar of Stars is a personal single-user app — true simultaneous multi-device conflicts are rare, and the most recently modified record is almost always the correct one.

### Debounced Persistence
Drive writes are debounced by 3000ms. localStorage writes are synchronous and immediate (the database is small). This means offline changes are never lost (localStorage), and Drive writes are batched to avoid rate limiting.

### RAF-Separated Rendering
The physics loop and canvas loop both use `requestAnimationFrame` and operate via direct DOM manipulation or canvas draw calls, completely bypassing React's reconciler. React sets up the DOM structure; the RAF loops animate it. This prevents expensive React re-renders at 60fps.

### Deterministic Colouring
Star colours are derived from a hash of `star_id`, not stored in the database. This means the colour palette never needs to be migrated if the palette changes, and colours are consistent across exports/imports/devices without any extra data.

### Weighted Random Prompts
The 30 balloon prompts are pooled with `common` items appearing 3× (via `flatMap`) before a uniform random pick. This gives a simple weighted distribution without any bookkeeping or anti-repeat logic, keeping the implementation to three lines.

### No Build Step as a Feature
The absence of a bundler is deliberate. Any text editor can open any file and make a change that immediately takes effect on refresh. There is no transpilation step to run, no hot reload server to start, no `node_modules` to reinstall. The tradeoff is that load time is longer (Babel transforms JSX client-side on first load) and the code cannot be minified or obfuscated without adding a build step.
