<template>
  <router-view />
</template>

<script setup>
// Root shell — each app is fully self-contained via router
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #0a0a0f;
  --surface:   #13131a;
  --border:    #2a2a3a;
  --text:      #e8e8f0;
  --muted:     #6b6b80;
  --accent:    #c8a96e;  /* aged gold */
  --danger:    #c0392b;
  --success:   #27ae60;
  --font-mono: 'Courier New', monospace;
}

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-mono);
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
}
</style>
