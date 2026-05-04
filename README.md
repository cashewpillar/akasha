# Akasha

Because the below things are such a bottleneck:
1. Table builder UI (a catch-all without any specific use-case)
2. Vanila HTML prototypes (then migration when grown)

## Setup

```bash
npm install
npm run dev
```

## Deploy

Push to `main` → GitHub Actions builds and deploys automatically.

Or manually:
```bash
npm run deploy
```

**One-time GitHub setup:**
1. Repo Settings → Pages → Source: **GitHub Actions**
2. In `vite.config.js`, set `base` to your repo name: `/your-repo-name/`

## Adding a new prototype

1. Create `apps/your-app/App.vue` (and any components/db files)
2. Add a route in `src/main.js`:
   ```js
   { path: '/your-app', component: () => import('@apps/your-app/App.vue') }
   ```
3. Add an entry in `src/Home.vue`'s `apps` array
4. Done — it's live on next push

## Structure

```
akasha/
├── shared/
│   ├── db.js          ← Dexie factory + export/import helpers
│   └── useDb.js       ← useLiveQuery composable
├── apps/
│   └── stat-tracker/  ← prototype 1
│       ├── App.vue
│       ├── db.js      ← app-specific schema
│       └── components/
└── src/
    ├── main.js        ← router + app entry
    ├── App.vue        ← root shell
    └── Home.vue       ← launcher
```

## Apps

| App | Path | Description |
|-----|------|-------------|
| Stat Tracker | `/stat-tracker` | Daily life RPG stats |
