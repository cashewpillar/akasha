import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'

// ─── Routes ───────────────────────────────────────────────
// Add a new route for each prototype app you build
import StatTracker from '@apps/stat-tracker/App.vue'

const routes = [
  { path: '/', component: () => import('./Home.vue') },
  { path: '/stat-tracker', component: StatTracker, meta: { title: 'Stat Tracker' } },
  // { path: '/next-app', component: () => import('@apps/next-app/App.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} — Akasha` : 'Akasha'
})

const app = createApp(App)
app.use(router)
app.mount('#app')
