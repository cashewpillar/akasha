<template>
  <div class="launcher-screen">
    <main class="launcher-main">
      <h1>AKASHA</h1>
      <ul>
        <li v-for="app in apps" :key="app.name">
          <router-link :to="app.path">
            <span>{{ app.name }}</span>
            <span class="meta">{{ app.desc }}</span>
          </router-link>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup>
const apps = [
  {
    path: '/stat-tracker',
    name: 'stat-tracker',
    desc: 'optimize your avatar daily'
  },
  // Add new apps here as you build them
]
</script>

<style scoped>
.launcher-screen {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.launcher-main {
  width: 100%;
  max-width: 400px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
  color: var(--text);
  text-transform: lowercase;
}

ul {
  list-style: none;
  padding: 0;
}

li + li {
  margin-top: 0.75rem;
}

a {
  display: block;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  transition: transform 0.1s ease, border-color 0.1s ease;
}

a:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.meta {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--muted);
}
</style>
