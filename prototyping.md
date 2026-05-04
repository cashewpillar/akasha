# AKASHA — Prototype Vault Context

> Paste this at the start of a new session when building a new prototype.

---

## What is Akasha

A personal Vue 3 PWA monorepo. Multiple prototype apps live under `/apps`, share tooling, and deploy together to GitHub Pages. Each prototype is self-contained but inherits shared DB utilities, routing, and global styles.

---

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite** + `@vitejs/plugin-vue`
- **vite-plugin-pwa** (Workbox, auto-update)
- **Vue Router 4** (hash history — required for GitHub Pages)
- **Dexie 4** (IndexedDB wrapper, one DB per app)
- **No UI framework** — custom CSS using CSS variables
- Deploy: **GitHub Actions → GitHub Pages**

---

## Repo Structure

```
akasha/
├── package.json
├── vite.config.js         ← base: '/akasha/', path aliases, PWA config
├── index.html
├── src/
│   ├── main.js            ← createApp, router, all routes registered here
│   ├── App.vue            ← root shell, just <router-view />
│   └── Home.vue           ← launcher listing all apps
├── shared/
│   ├── db.js              ← Dexie factory + export/import helpers
│   └── useDb.js           ← useLiveQuery composable
└── apps/
    └── [app-name]/
        ├── App.vue        ← app root component
        ├── db.js          ← app-specific Dexie schema + helpers
        └── components/    ← app-specific components
```

---

## Path Aliases

```js
'@'       → /src
'@shared' → /shared
'@apps'   → /apps
```

---

## Global CSS Variables (defined in src/App.vue)

```css
--bg:        #0a0a0f
--surface:   #13131a
--border:    #2a2a3a
--text:      #e8e8f0
--muted:     #6b6b80
--accent:    #c8a96e   /* aged gold */
--danger:    #c0392b
--success:   #27ae60
--font-mono: 'Courier New', monospace
```

Global reset and base styles are in `src/App.vue` `<style>` (unscoped). All prototype components inherit these variables.

---

## Aesthetic Direction

Old game / RPG terminal aesthetic. Dark background, monospace font, gold accent. Think DOS-era stat screens. Minimal, intentional, no gradients or rounded corners. New prototypes should fit this language unless explicitly overriding.

---

## Shared DB API (`shared/db.js`)

### Create an app DB
Each app defines its own Dexie schema via `createAppDb`. DB is namespaced as `akasha__[appName]` to avoid collisions.

```js
import { createAppDb } from '@shared/db'

export const db = createAppDb('my-app', (db) => {
  db.version(1).stores({
    items: '++id, date, type'
  })
})
```

### Export (download JSON)
```js
import { exportDb } from '@shared/db'
await exportDb(db, 'my-app-export.json')
```

### Import (from JSON file input)
```js
import { importDb } from '@shared/db'
await importDb(db, file, 'replace') // strategy: 'replace' | 'merge'
```

---

## Shared Composable (`shared/useDb.js`)

Wraps Dexie `liveQuery` in a Vue ref — auto-updates when DB changes, auto-unsubscribes on unmount.

```js
import { useLiveQuery } from '@shared/useDb'

const items = useLiveQuery(() => db.items.toArray(), [])
// items.value is reactive, updates automatically
```

---

## How to Add a New Prototype

### 1. Create the app folder
```
apps/my-app/
  App.vue
  db.js
  components/   (if needed)
```

### 2. Register the route in `src/main.js`
```js
import MyApp from '@apps/my-app/App.vue'

const routes = [
  { path: '/', component: () => import('./Home.vue') },
  { path: '/stat-tracker', component: StatTracker, meta: { title: 'Stat Tracker' } },
  { path: '/my-app', component: MyApp, meta: { title: 'My App' } }, // ← add this
]
```

### 3. Add a card in `src/Home.vue`
```js
const apps = [
  { path: '/stat-tracker', glyph: '⚔', name: 'STAT TRACKER', desc: 'optimize your avatar daily' },
  { path: '/my-app', glyph: '◈', name: 'MY APP', desc: 'short description' }, // ← add this
]
```

That's it. No other config needed.

---

## Existing Apps

### `/stat-tracker` — Daily Life RPG Stat Tracker

Tracks daily habits and activities with an old-game RPG aesthetic. Avatar levels up based on daily score.

**DB schema** (`apps/stat-tracker/db.js`):
```js
db.version(1).stores({
  days:   'date',           // one record per day (PK: 'YYYY-MM-DD')
  events: '++id, date, type, createdAt'  // individual timestamped events
})
```

**Day record shape:**
```js
{
  date: 'YYYY-MM-DD',
  earPicking: 0,
  unhealthyFood: 0,
  hormonalActivity: 0,
  zone: 0,               // total zone sessions
  sleepTime: null,       // 'HH:MM'
  wakeTime: null,        // 'HH:MM'
  exploitedMinutes: 0,
  notes: ''
}
```

**Zone types tracked:** poop, bath/shower, dishes, toothbrushing, stargazing, meal prep, walking, stretching, laundry. Zone sessions are also stored individually in `events` table with `{ type: 'zone', subtype: '...' }`.

**Helpers exported from db.js:**
- `today()` → current date string
- `getOrCreateDay(date)` → get or init a day record
- `updateDay(date, patch)` → merge patch into day record
- `incrementField(field, date, delta)` → increment/decrement a numeric field (min 0)

**XP model:**
- +10 per zone session
- +1 per 10 min of exploited time (cap 480min)
- +20 for 7–9h sleep
- −3 per ear pick
- −5 per junk food
- Level = floor(xp / 50) + 1

**Components:**
- `Counter.vue` — reusable `+`/`−` tap counter
  - Props: `label`, `glyph`, `value`, `type` ('bad' | 'good' | 'neutral')
  - Emits: `increment`, `decrement`

---

## PWA Notes

- Registered with `registerType: 'autoUpdate'`
- Icons expected at `public/icons/icon-192.png` and `public/icons/icon-512.png`
- Theme color: `#0a0a0f`
- Display: `standalone`, orientation: `portrait`

---

## GitHub Pages Notes

- `base` in `vite.config.js` must match the GitHub repo name: `/akasha/`
- Router uses `createWebHashHistory()` — no server config needed
- Auto-deploy via `.github/workflows/deploy.yml` on push to `main`
- Manual deploy: `npm run deploy` (uses `gh-pages` package)

---

## Conventions

- All components use `<script setup>` (Composition API)
- Styles are `<style scoped>` per component
- DB helpers live in `apps/[name]/db.js`, not inside components
- One Dexie DB per app, never shared across apps
- Export/import is always available — no cloud sync, no conflicts
- `useLiveQuery` for reactive DB reads; direct `await db.table.method()` for writes