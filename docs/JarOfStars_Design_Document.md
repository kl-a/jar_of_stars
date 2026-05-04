# Jar of Stars — Design Document

## Overview

Jar of Stars is a browser-based, mobile-first web application for capturing and revisiting fond memories. Users collect memories as "stars" inside a glowing glass jar. When feeling low, they can pull a random star out of the jar and be presented with a warm, celebratory memory reveal. The app is built to feel like a cosy pixel-art DS game (Animal Crossing, Nintendogs, Touch Detective aesthetic) with a pastel colour palette, rounded chunky UI, and gentle animations throughout.

Data is stored as a local JSON file that the user can export and re-import across devices. A future implementation will sync this file via Google Drive (KeePass-style).

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React + Vite | Fast builds, HMR, scalable for future features |
| Language | TypeScript | Full type safety across data models |
| Styling | Tailwind CSS | Utility-first, easy responsive design |
| Animations | Framer Motion | Declarative animations for star pulls, modal slides, star zip effects |
| Routing | React Router v6 | Multi-page navigation (Home, Collection, People, Settings) |
| State management | Zustand | Lightweight global store for app state |
| Persistence | Local JSON file (import/export) | KeePass-style portable database; Google Drive sync in v2 |
| Asset format | SVG (inline or imported as React components) | Pixel-art style avatars and decorative assets |
| Build/Deploy | Vite → GitHub Pages | Local dev → static site deploy |
| Package manager | npm | Standard |

### Environment Setup Note for Claude Code
> **IMPORTANT:** When setting up this project, create an isolated Node.js environment rather than installing dependencies globally. Use the following approach:
> ```bash
> mkdir jar-of-stars && cd jar-of-stars
> npm create vite@latest . -- --template react-ts
> npm install
> ```
> All dependencies should be installed locally within this project directory. Do **not** use global npm installs for any dependency listed below. Use `npx` for any one-off CLI tools.

---

## Data Architecture

### JSON File Structure

The entire app state is serialised to a single JSON file that the user can download and re-upload. The file has the following top-level shape:

```typescript
interface JarOfStarsDatabase {
  version: string;              // schema version, e.g. "1.0.0"
  exportedAt: string;           // ISO date string
  stars: Star[];
  people: Person[];
}
```

### Star Schema

```typescript
interface Star {
  star_id: string;              // UUID, generated automatically
  message: string;              // Free text memory description
  from_people_ids: string[];    // Array of Person.people_id — can be empty
  date: string;                 // ISO date string (defaults to today)
  tags: string[];               // User-defined free-form tags
  favourite: boolean;           // Defaults to false
  pull_count: number;           // Increments by 1 each time this star is pulled
  created_at: string;           // ISO timestamp
  updated_at: string;           // ISO timestamp
}
```

### Person Schema

```typescript
interface Person {
  people_id: string;            // UUID, generated automatically
  name: string;                 // Display name (real name or nickname)
  note: string;                 // Free text about this person
  avatar_id: string;            // ID referencing one of 10 default avatars
  star_ids: string[];           // Array of Star.star_id this person is linked to
  is_new: boolean;              // True if created within the last session; cleared on next load
  created_at: string;           // ISO timestamp
}
```

---

## Visual Design & Aesthetic

### Core Aesthetic Direction

The visual language is **cosy pixel DS** — every element should feel like it belongs on the screen of a 2004 Nintendo DS game. The references are Animal Crossing DS, Nintendogs, and Touch Detective: chunky hand-drawn-feeling UI, pastel fills with visible pixel-level detail, soft dithered edges, and a warmth that makes you want to keep tapping. The overall impression should be nostalgic and tactile, like holding a tiny glowing screen under a blanket.

This is a **pixel-first** design. It does not use smooth vector gradients, glassmorphism, blurs, or modern "flat design" conventions. Instead, everything is rendered or simulated as if it were built on a pixel grid. Shading is done with dithering or flat stepped colours, not gradients. Borders have visible weight. Corners are blocky or very slightly rounded at pixel scale, not the smooth pill shapes of a modern app.

---

### Pixel Grid & Rendering Rules

- **Base pixel unit:** All UI elements are designed on a **2px pixel grid**. Every measurement — padding, border, radius, icon size — should be a multiple of 2px. This gives everything the chunky, slightly oversized feel of a DS game.
- **No CSS `border-radius` above 8px** on structural elements (cards, panels, modals). DS-era UI had softly rounded corners but they were always tight and slightly boxy — never the sweeping pill shapes of modern apps. Buttons are the one exception and may use up to `12px`.
- **Borders are always 2px solid** — never 1px, never `0.5px`. The heavier border is essential to the pixel aesthetic.
- **No `box-shadow` with large blur radii.** Instead of soft glows, use a hard 2–4px offset shadow with no blur (e.g. `box-shadow: 3px 3px 0px #7a6fa0`) — this is the classic DS/GBA "hard drop shadow" that makes elements feel stamped onto the screen.
- **No CSS gradients on UI panels, cards, or buttons.** Fills are flat. If a shading effect is needed on an illustration (the jar, the scroll, the trumpeters), it is achieved with layered flat SVG shapes at different opacities — not a CSS or SVG gradient.
- **Dithering for depth:** Where depth or shading transitions are needed on illustrated assets, simulate dithering using a repeating SVG `<pattern>` of alternating pixels (2x2 checkerboard) at reduced opacity layered over a flat fill. This is the authentic pixel-art technique.
- **All illustrative assets (jar, stars, scroll, trumpeters, avatars) are drawn on a pixel grid** — meaning paths snap to whole-number coordinates and shapes are composed of rectangles, not smooth curves. Rounded corners on illustrations use a stair-step approximation rather than a Bézier curve.

---

### Colour Palette

The palette is pastel-dominant with a dark night-sky background. Colours are deliberately limited to reinforce the DS aesthetic — DS games used small, constrained palettes and got enormous warmth from them.

| Name | Hex | Usage |
|---|---|---|
| Night Sky | `#1a1a2e` | Page/game background |
| Deep Indigo | `#16213e` | Secondary background, sidebar |
| Soft Lilac | `#c9b8f0` | UI panels, card fills, primary surface |
| Lilac Shadow | `#7a6fa0` | Hard drop shadows on lilac elements, borders |
| Blush Pink | `#f7cac9` | Favourite state, heart accents |
| Blush Shadow | `#c98a88` | Hard drop shadows on blush elements |
| Mint Green | `#b5ead7` | Tags, success states, Add Star button |
| Mint Shadow | `#6aab90` | Hard drop shadows on mint elements |
| Butter Yellow | `#ffeaa7` | Stars, primary action button highlight |
| Butter Shadow | `#c9a84c` | Hard drop shadows on butter elements |
| Peach | `#ffb7b2` | Warm accents, streamer colours |
| Cloud White | `#fdfcff` | Text on dark backgrounds, scroll fill |
| Muted Purple | `#9b89c4` | Borders, subtle UI chrome, inactive nav |
| Star Gold | `#ffe066` | Glowing/active stars, pull count badges |
| Pixel Black | `#2d2b3d` | Text on light surfaces, icon fills |

**Palette discipline:** Do not introduce colours outside this palette. If a new colour seems needed, find the closest palette entry. The constraint is intentional — DS games were famously limited and the warmth comes from the relationships between a small number of colours, not variety.

---

### Typography

- **Display / headings / UI labels / buttons:** `Press Start 2P` (Google Fonts). This is the primary typeface and the one that carries the pixel DS identity most strongly. Used for screen titles, button labels, badges, counters, and any text that is part of the game UI chrome.
- **Body / input fields / memory text / notes:** `Nunito` (Google Fonts). Rounded and friendly. Used only for user-written content (memory messages, notes, names) and helper text inside forms — content that needs to be comfortably readable at length.
- **Minimum pixel font size: 10px.** `Press Start 2P` is illegible below this. For very small labels (badges, counters), use exactly 8px with generous letter-spacing.
- **No other typefaces.** Do not introduce a third font.
- **Text on dark backgrounds** is always `#fdfcff` (Cloud White). Never pure `#ffffff`.
- **Text on light/pastel panels** is always `#2d2b3d` (Pixel Black). Never `#000000`.
- **No font weights other than the defaults** for each face — `Press Start 2P` has only one weight; `Nunito` should be used at `400` for body and `700` for emphasis only.

---

### Component Visual Language

Every UI component follows a consistent pixel-art treatment. These rules apply globally.

#### Panels & Cards
- Background fill: flat colour from palette (typically Soft Lilac `#c9b8f0` or a dark variant `rgba(201,184,240,0.12)` on the night sky)
- Border: `2px solid` using the shadow variant of the fill colour (e.g. Lilac Shadow `#7a6fa0` for a lilac panel)
- Corner radius: `6px` — just enough to soften the corner one pixel, not a smooth curve
- Hard drop shadow: `3px 3px 0px [shadow colour]` — no blur, offset down-right
- No `backdrop-filter`, no blur, no glassmorphism

#### Buttons
- All buttons use `Press Start 2P` for their label text
- Standard shape: `border-radius: 8px` (slightly more rounded than panels to feel tappable)
- Border: `2px solid [shadow colour]`
- Hard drop shadow: `3px 3px 0px [shadow colour]`
- **Active/pressed state:** `transform: translate(2px, 2px)` + `box-shadow: 1px 1px 0px [shadow colour]` — simulates the button physically pressing down by consuming the shadow. This is the authentic DS button press feel.
- Hover state: brighten fill by one step, no other changes
- Button label padding: `12px 20px` minimum, always centred

#### Icons
- All icons are custom SVG drawn on a pixel grid (paths snap to 2px multiples)
- Icons use flat fills only — no strokes on icon shapes themselves (the pixel-art look comes from the shape, not an outline)
- Standard icon size: `16x16px` for inline UI, `24x24px` for nav items
- Icons are drawn as chunky, simplified silhouettes — not fine-line vector icons

#### Tags & Badges
- Small rectangular chips, `border-radius: 4px`
- `2px solid` border, hard `2px 2px 0px` shadow
- `Press Start 2P` text at `8px`
- `NEW` badge specifically: bright Mint Green `#b5ead7` fill, Mint Shadow `#6aab90` border and shadow

#### Navigation
- **Mobile bottom nav:** Dark panel (`#16213e`), `2px solid` top border in Muted Purple. Each nav item has a pixel icon above a `Press Start 2P` label at `8px`. Active item: Soft Lilac icon + label. Inactive: Muted Purple at 60% opacity.
- **Desktop sidebar nav:** Same dark panel treatment. Active item gets a Soft Lilac left-side accent bar (`4px wide`, full item height) and a slightly lighter background (`rgba(201,184,240,0.1)`).

#### Form Inputs
- Textarea and text inputs: flat Dark Indigo fill `#16213e`, `2px solid` Muted Purple border, `border-radius: 6px`
- Focus state: border changes to Soft Lilac `#c9b8f0`, no glow, no box-shadow — just the border colour change
- Placeholder text: Muted Purple at 60% opacity
- Font: `Nunito 14px` for all input content

#### Modals
- Slide up from bottom on mobile (Framer Motion `y` transition)
- Centre fade-in on desktop
- Background overlay: `rgba(13,13,40,0.82)` — dark night, not pure black
- Panel treatment: same as Cards above
- A small `Press Start 2P` title at `10px` at the top of every modal
- A pixel-art decorative element (a small star or sparkle drawn in SVG) adjacent to the title

---

### Illustrated Assets — Pixel Art Specification

All illustrated SVG assets must be drawn as authentic pixel art: shapes built from axis-aligned rectangles, no smooth Bézier curves, all coordinates at whole-number pixel positions.

#### The Jar
- Drawn as a classic round-shouldered preserving jar viewed straight-on
- Constructed entirely from rectangles and right-angle paths — no `<ellipse>` or curved `<path>` elements
- The round shoulders and base are approximated with a stair-step silhouette (2px steps)
- Lid: a flat rectangular cap with a slightly wider rim, drawn with Soft Lilac + Lilac Shadow shading using two flat rectangles
- Glass body: very dark near-transparent fill with a 2px Muted Purple border. Interior glow is a separate flat-filled light rectangle, not a gradient
- Shading on the glass (the reflective highlight stripe): a 4px-wide column of Cloud White at 15% opacity, positioned at 1/4 of the jar width — flat, no gradient
- The "fill level" of stars inside the jar is shown as a flat glowing mass at the base — a rectangle of Butter Yellow at low opacity, height proportional to star count

#### Stars
- Pixel-art 5-pointed star shape drawn as a polygon with coordinates snapped to 2px grid
- Small variant (floating in jar): approximately 8×8px on the pixel grid
- Full variant (collection card icon): approximately 16×16px
- Star Gold `#ffe066` fill, Butter Shadow `#c9a84c` 1-pixel shadow on the lower-right edges only
- Favourite state: same shape but Blush Pink `#f7cac9` fill with Blush Shadow border

#### The Parchment Scroll
- Rectangular body with rolled top and bottom edges, drawn as flat layered rectangles
- Main body: Cloud White `#fdfcff` with a very subtle Butter Yellow tint — achieved by overlaying a 10% opacity Butter Yellow rectangle, not a gradient
- Rolled edges: slightly darker Cloud White (`#e8e6f0`), 4px tall rectangles at top and bottom with a 2px shadow below each
- Decorative border: a 2px inner border in Butter Shadow `#c9a84c`, inset 6px from the scroll edge, drawn as four separate `<rect>` elements (not `border`)
- Text content area sits between the rolled edges with `Nunito` body text

#### Trumpeters
- Two small pixel-art characters, approximately 40×60px each on their pixel grid
- Simple humanoid shape: a round head (approximated with a stair-step circle ~10px diameter), small body rectangle, arm rectangle angled upward holding a trumpet
- The trumpet: an L-shaped pixel path, wider at the bell end
- Colour: one in Soft Lilac outfit, one in Mint Green outfit — both with Cloud White faces and Pixel Black eyes (2×2px squares)
- Expression: simple pixel-art happy face — two 2px square eyes, a 4px wide smile made of two pixels

#### Zodiac Avatars
- Each avatar is drawn on a **32×32px pixel grid**, scaled up 2× to render at 64×64px (each "pixel" is a 2×2 CSS pixel)
- This gives them the authentic GBA/DS sprite look
- Construction: flat-filled rectangles and stair-step curves only
- Each animal has a distinctive silhouette readable at small size — ears, snout, tail suggestion where relevant
- All use pastel fills from the main palette — no new colours introduced for avatars
- Eyes: 2×2px Pixel Black squares
- Expressions are always happy/neutral — no angry or sad expressions

---

### Animation Constraints for Pixel Aesthetic

Animations should feel bouncy and game-like, not smooth and modern. Specific guidance:

- **Easing:** Prefer `cubic-bezier` spring-style easings or stepped timing functions. Avoid `ease-in-out` on anything meant to feel game-like — use `cubic-bezier(0.34, 1.56, 0.64, 1)` (back/overshoot) for popups and button presses.
- **Stepped animations:** Where possible, use `animation-timing-function: steps(N)` for pixel-art animations (avatar blinking, star sparkle) to make them feel like sprite animations rather than smooth tweens.
- **Star sparkle:** A 4-frame stepped animation cycling through 4 pixel art star shapes (full, slightly rotated, small, tiny) — not a smooth scale/rotate.
- **No motion blur, no ease curves on position animations for pixel assets** — pixel art characters should move in discrete steps, not glide.
- All other animation rules from the Animations & Motion section apply.

---

## App Structure

```
src/
├── main.tsx                     # Vite entry point
├── App.tsx                      # Router root + global layout
├── store/
│   └── useStore.ts              # Zustand global state (stars, people, settings)
├── types/
│   └── index.ts                 # Star, Person, JarOfStarsDatabase interfaces
├── utils/
│   ├── uuid.ts                  # UUID generation helper
│   ├── fileIO.ts                # JSON import/export logic
│   ├── starEngine.ts            # Random pull logic, favourite fallback, pull count update
│   └── tagSuggestions.ts        # Derives tag suggestions from existing stars
├── assets/
│   └── avatars/                 # 10 SVG avatar files (avatar_01.svg ... avatar_10.svg)
├── components/
│   ├── Jar/
│   │   ├── JarScene.tsx         # Full animated jar + starry background
│   │   ├── FloatingStars.tsx    # Stars floating inside jar (based on fill level)
│   │   └── ShootingStars.tsx    # Periodic background shooting star animation
│   ├── StarPull/
│   │   ├── PullReveal.tsx       # Full-screen scroll reveal with trumpeters and streamers
│   │   ├── Scroll.tsx           # Animated parchment scroll SVG component
│   │   ├── Trumpeter.tsx        # Animated pixel trumpeter SVG component
│   │   └── Streamers.tsx        # Floating streamer confetti animation
│   ├── Stars/
│   │   ├── StarCard.tsx         # Card in collection view
│   │   ├── StarCardFoil.tsx     # Foil hover effect for favourite cards
│   │   ├── AddStarModal.tsx     # Slide-in modal for adding a new star
│   │   └── StarZipAnimation.tsx # Star forming into ball and zipping to jar
│   ├── People/
│   │   ├── PersonCard.tsx       # Person in people list
│   │   ├── PersonProfile.tsx    # Full profile view with linked stars
│   │   └── AvatarPicker.tsx     # Avatar selection grid
│   ├── UI/
│   │   ├── PillButton.tsx       # Pill-shaped button component
│   │   ├── TagInput.tsx         # Tag input with autocomplete suggestions
│   │   ├── PersonInput.tsx      # Person input with autocomplete + auto-create
│   │   └── NewBanner.tsx        # "NEW" badge for recently created people
│   └── Onboarding/
│       └── WelcomeFlow.tsx      # First-launch welcome + first star prompt
├── pages/
│   ├── Home.tsx                 # Jar scene + pull buttons
│   ├── Collection.tsx           # Card list, filters, search
│   ├── People.tsx               # People list
│   └── Settings.tsx             # Import/export, about
└── index.css                    # Tailwind base + custom CSS vars
```

---

## Pages & Features

### Home Page — The Jar

The centrepiece of the app. Full-screen view with:

**Background:**
- Deep night-sky gradient (`#1a1a2e` to `#16213e`)
- Twinkling static pixel stars scattered across the canvas
- Shooting stars that animate across the screen every 8–15 seconds (randomised interval)

**The Jar:**
- A tall, rounded glass jar rendered as an SVG, centred on screen
- A soft pulsing glow emanates from inside the jar (white/gold, low opacity)
- Jar fill level is determined by star count:

| Star count | Jar fill level | Stars visible floating |
|---|---|---|
| 0 | Empty (glow only) | 0 |
| 1–19 | 1/5 full | 1–3 small floating stars at top |
| 20–39 | 2/5 full | 1–3 stars floating above a shimmering pool |
| 40–59 | 3/5 full | 1–3 stars |
| 60–79 | 4/5 full | 1–3 stars |
| 80+ | Full | 1–3 stars crowning the top |

- The "pool" of stars inside the jar is implied by a soft glowing mass at the bottom — the exact count is not shown individually for performance reasons
- 1–3 stars float visibly near the top/surface of the mass, with gentle bobbing animation (`sin` wave offset per star)
- Stars glow softly yellow/gold

**Controls:**
- **Pull a Star** button — large, prominent, pill-shaped, butter yellow. Triggers random pull from full pool.
- **Pull a Favourite** button — smaller, pill-shaped, blush pink, heart icon. Pulls only from favourites. If no favourites exist, silently falls back to the full pool.
- **Add a Star** button — pill-shaped, mint green, `+` icon. Opens the Add Star modal.
- Navigation bar (bottom on mobile, left sidebar on desktop): Home / Collection / People / Settings

---

### Add Star Modal

Slides up from the bottom (mobile) or fades in centred (desktop). Pixel-art style panel with rounded corners and a soft drop shadow.

**Fields:**
- **Message** — multi-line textarea, required. Placeholder: "What's the memory?"
- **Who's involved** — text input with autocomplete. As the user types, it filters existing people by name and shows a dropdown of matches. If no match exists and the user presses Enter or comma, a new Person is auto-created in the background and shown with a `NEW` badge. Multiple people can be added (displayed as pill tags).
- **Date** — date picker, defaults to today
- **Tags** — tag input. As the user types, existing tags from other stars are suggested in a dropdown. Pressing Enter or comma saves the tag.
- **Save** button

**On save animation:**
1. The modal collapses with a satisfying "pop" scale-down
2. A small glowing star particle forms at the centre of the screen
3. It zips with a curved motion path toward the jar (Framer Motion `useAnimation` + `motion.div`)
4. On arrival it "plops" into the jar with a brief jar wobble and a subtle flash of light inside

---

### Star Pull Reveal

Triggered by the "Pull a Star" or "Pull a Favourite" buttons.

1. The `pull_count` for the selected star is incremented by 1 and saved immediately
2. Full-screen overlay fades in (dark, slightly translucent)
3. A parchment scroll SVG unrolls from the centre of the screen (Framer Motion `scaleY` from 0 → 1)
4. The memory message, date, and tags fade in on the scroll
5. Two pixel-art trumpeter characters animate in from the left and right bottom corners of the screen, raising their trumpets
6. Colourful streamers float upward from the bottom of the screen (staggered Framer Motion particles)
7. A **Share Memory** button appears — copies a formatted text snippet to clipboard:
   `📜 A memory from [date]: "[message]" — shared from Jar of Stars`
8. A **Close** button returns to the home screen with a gentle fade

---

### Collection Page

A scrollable list of star cards, with filter/sort controls at the top.

**Filters (stackable):**
- Favourites only toggle
- Filter by person (multi-select dropdown of people)
- Filter by tag (multi-select)
- Sort by: Date Added (desc/asc) / Most Pulled / Least Pulled / Alphabetical

**Star Card — standard:**
- Soft lilac or white card with star icon, message preview (truncated to 2 lines), date, people pill tags, tag chips, pull count (`✦ 3 pulls`), and favourite toggle
- **Favourite toggle interaction:** When toggled ON — the star icon briefly morphs into a heart with 3–4 tiny hearts floating upward for ~1 second, then settles as a filled star (Framer Motion keyframe sequence). When toggled OFF — simple icon swap.
- Clicking a card opens an expanded card view (not a full scroll reveal — just a larger version of the card with the full message)

**Star Card — favourite (foil effect):**
- When `favourite: true`, hovering the card triggers a 3D tilt + shimmer effect:
  - CSS `perspective` + `rotateX/Y` based on mouse position relative to card centre (JavaScript `mousemove` listener)
  - A `radial-gradient` overlay moves with the mouse position, simulating the rainbow sheen of a holographic Pokémon card
  - The gradient cycles through pastel rainbow colours (`hue-rotate` animation on the overlay layer)
  - Card returns to flat on `mouseleave` with a smooth ease-out transition
- This effect is CSS/JS only, no library required

---

### People Page

A grid of person cards showing avatar, name, star count, and `NEW` badge if recently created.

**Person Card:**
- Avatar (SVG from pool), display name, note preview, star count (`✦ 12 stars`)
- `NEW` banner in the top-right corner if `is_new: true`

**Person Profile (full view, opens on card click):**
- Avatar (tappable to open AvatarPicker)
- Name (editable inline)
- Note (editable textarea)
- List of linked stars (mini cards, same foil effect if favourite)
- Star count

**AvatarPicker:**
- Grid of 10 avatar options, current selection highlighted
- Selecting a new one immediately updates the person record

---

### Settings Page

- **Export Data** — downloads `jar-of-stars-[date].json`
- **Import Data** — file picker for `.json`, replaces in-memory state (with a confirmation dialog)
- **About** — version, short description

---

## Onboarding Flow

Triggered only on first launch (detected by absence of any data in the store and no imported file).

1. Fade in: a gentle welcome screen with the jar illustration (empty, softly glowing) and the app name in pixel font
2. Short welcome message: *"Every moment of joy deserves to be remembered. Let's add your first star."*
3. A single-field prompt: *"What's a lovely memory you've had recently?"* (textarea only — no other fields required for first star)
4. On submit, the first star is created and zips into the jar
5. The first star in the jar pulses with a slightly stronger glow and a gentle scale breathe animation to invite the user to pull it
6. A small tooltip/hint appears: *"Tap the jar or press 'Pull a Star' whenever you need a boost ✦"*

---

## Avatars

Ten default pixel-art SVG avatars based on the **Chinese Zodiac**, using the pastel colour palette. The 10 selected animals:

| Avatar ID | Animal | Personality flavour |
|---|---|---|
| `avatar_01` | Rat | Clever, curious — winking expression |
| `avatar_02` | Ox | Steady, warm — gentle closed-eyes smile |
| `avatar_03` | Tiger | Bold, bright — big grin, little stripes |
| `avatar_04` | Rabbit | Soft, sweet — rosy cheeks, floppy ears |
| `avatar_05` | Dragon | Playful drama — tiny curled dragon, sparkles |
| `avatar_06` | Snake | Calm, wise — coiled peacefully, half-lidded eyes |
| `avatar_07` | Horse | Energetic — bright eyes, little mane tufts |
| `avatar_08` | Goat | Dreamy — star on forehead, soft horns |
| `avatar_09` | Monkey | Cheeky — big eyes, little paws |
| `avatar_10` | Dog | Loyal, happy — floppy ears, tail implied |

Each avatar is a 64×64px SVG rendered in chunky, rounded pixel-art style with pastel fills. They are stored as individual `.svg` files imported as React components. The avatar shown uses `avatar_id` to resolve the correct component at runtime — no image URLs or base64 encoded data is stored.

---

## Animations & Motion

All animations use **Framer Motion** unless noted.

| Interaction | Animation |
|---|---|
| Add Star modal open | `y: 300 → 0`, `opacity: 0 → 1`, spring easing |
| Add Star modal close | Scale down + fade |
| Star zip to jar | Curved `motion.div` path from modal centre to jar, scale 1 → 0.2, duration 0.6s |
| Jar wobble on star arrival | Brief `rotate: [-2, 2, -1, 1, 0]` keyframe on jar element |
| Star floating in jar | Continuous `y` sine-wave offset per star, staggered phase |
| Shooting star | CSS `@keyframes` translate diagonal across sky, random interval 8–15s |
| Pull scroll unroll | `scaleY: 0 → 1` from centre, `transformOrigin: center` |
| Trumpeters enter | `x: ±200 → 0` slide in from sides, spring |
| Streamers | Staggered `y: 0 → -300`, `opacity: 1 → 0`, random `x` drift |
| Favourite heart burst | Keyframe: star → heart icon + 4 floating mini hearts scale up and fade |
| Foil card tilt | CSS `perspective` + JS `mousemove` → `rotateX/Y` + moving radial gradient |
| First star pulse | Repeating `scale: 1 → 1.15 → 1`, `box-shadow` glow pulse, `ease-in-out` |
| Onboarding fade-in | Staggered `opacity` + `y` entrance for each text element |

---

## File I/O (Import / Export)

### Export
```typescript
function exportDatabase(db: JarOfStarsDatabase): void {
  const json = JSON.stringify(db, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jar-of-stars-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### Import
- File input accepts `.json` only
- On file select: parse, validate schema version, and replace Zustand store state
- Show a confirmation dialog before replacing: *"This will replace your current stars and people. Are you sure?"*
- If the JSON is malformed or schema-incompatible, show a friendly error card

---

## State Management (Zustand)

```typescript
interface AppStore {
  stars: Star[];
  people: Person[];
  isOnboarded: boolean;
  
  // Star actions
  addStar: (star: Omit<Star, 'star_id' | 'pull_count' | 'created_at' | 'updated_at'>) => void;
  updateStar: (id: string, updates: Partial<Star>) => void;
  deleteStar: (id: string) => void;
  pullRandomStar: (favouritesOnly: boolean) => Star | null;
  
  // People actions
  addPerson: (person: Omit<Person, 'people_id' | 'star_ids' | 'is_new' | 'created_at'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  clearNewFlags: () => void;
  
  // IO actions
  importDatabase: (db: JarOfStarsDatabase) => void;
  exportDatabase: () => void;
}
```

State is initialised from `localStorage` on mount (as a temporary convenience for local dev). The primary persistence mechanism is the JSON export/import flow.

---

## Pull Logic

```typescript
function pullRandomStar(stars: Star[], favouritesOnly: boolean): Star | null {
  const pool = favouritesOnly
    ? stars.filter(s => s.favourite)
    : stars;
  
  // Fall back to full pool if favourites pool is empty
  const activePool = pool.length > 0 ? pool : stars;
  
  if (activePool.length === 0) return null;
  
  const index = Math.floor(Math.random() * activePool.length);
  return activePool[index];
}
```

After pulling, immediately call `updateStar(id, { pull_count: star.pull_count + 1 })`.

---

## Routing

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/collection" element={<Collection />} />
  <Route path="/people" element={<People />} />
  <Route path="/people/:id" element={<PersonProfile />} />
  <Route path="/settings" element={<Settings />} />
</Routes>
```

---

## Key Dependencies

```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "typescript": "^5",
  "vite": "^5",
  "tailwindcss": "^3",
  "framer-motion": "^11",
  "zustand": "^4",
  "uuid": "^9",
  "@types/uuid": "^9"
}
```

> **Claude Code note:** Install all of the above via `npm install` inside the project directory. Do not use global installs. Use `npm create vite@latest` to scaffold the project first, then install remaining packages.

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Mobile (< 640px) | Single column, bottom nav bar, modal slides from bottom |
| Tablet (640–1024px) | Single column with more padding, modal centred |
| Desktop (> 1024px) | Left sidebar nav, centred jar scene with max-width container, modal centred |

---

## Out of Scope (v1)

- Google Drive sync (architecture is designed to accommodate this in v2)
- Photo attachments to people or stars
- Push / scheduled notifications
- Cloud accounts or multi-user support
- Historical trends or charts
- Tag autocomplete while typing (UI accepts free-form tags in v1; suggestion dropdown is a v2 enhancement)
- Additional avatar styles (photos, custom uploads)

---

## Future Implementation Notes

### Google Drive Sync (v2)
The JSON export/import pattern directly mirrors the KeePass model. In v2:
1. Add Google OAuth via `@react-oauth/google`
2. On login, read the user's `jar-of-stars.json` from their Drive root (Google Drive API)
3. On any change, debounce and write the updated file back to Drive
4. On app load, pull the latest version from Drive and merge with local state (last-write-wins or a simple timestamp comparison)

The data schema is designed to be stable across this transition — no migration required.
