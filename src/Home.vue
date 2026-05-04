<template>
  <div class="home">
    <header>
      <h1 class="title">AKASHA</h1>
      <p class="sub">all that was, is, and will be</p>
    </header>

    <nav class="app-list">
      <router-link
        v-for="app in apps"
        :key="app.path"
        :to="app.path"
        class="app-card"
      >
        <span class="app-glyph">{{ app.glyph }}</span>
        <span class="app-name">{{ app.name }}</span>
        <span class="app-desc">{{ app.desc }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
const apps = [
  {
    path: '/stat-tracker',
    glyph: '⚔',
    name: 'STAT TRACKER',
    desc: 'optimize your avatar daily'
  },
  // Add new apps here as you build them
]
</script>

<style scoped>
.home {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  gap: 3rem;
}

header {
  text-align: center;
}

.title {
  font-size: 2.5rem;
  letter-spacing: 0.4em;
  color: var(--accent);
  text-shadow: 0 0 20px rgba(200, 169, 110, 0.4);
}

.sub {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--muted);
  text-transform: lowercase;
}

.app-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 420px;
}

.app-card {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  grid-template-rows: auto auto;
  gap: 0 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  text-decoration: none;
  color: var(--text);
  transition: border-color 0.2s, background 0.2s;
}

.app-card:hover, .app-card:focus {
  border-color: var(--accent);
  background: #1a1a24;
  outline: none;
}

.app-glyph {
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
}

.app-name {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  color: var(--accent);
}

.app-desc {
  font-size: 0.7rem;
  color: var(--muted);
  letter-spacing: 0.05em;
}
</style>
