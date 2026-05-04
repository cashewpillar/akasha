<template>
  <router-view />
</template>

<script setup>
// Root shell — each app is fully self-contained via router
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #f7f6f2;
  --surface:   #ffffff;
  --border:    rgba(0, 0, 0, 0.09);
  --text:      #1a1a18;
  --muted:     #6b6b67;
  --accent:    #1a1a18;
  --danger:    #c0392b;
  --success:   #27ae60;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg:        #1a1a18;
    --surface:   #232321;
    --border:    rgba(255, 255, 255, 0.07);
    --text:      #f0efe9;
    --muted:     #a0a09b;
    --accent:    #f0efe9;
  }
}

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
}
</style>
