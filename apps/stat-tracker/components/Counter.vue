<template>
  <div class="counter" :class="type">
    <span class="c-glyph">{{ glyph }}</span>
    <span class="c-label">{{ label }}</span>
    <div class="c-controls">
      <button class="c-btn minus" @click="$emit('decrement')">−</button>
      <span class="c-value">{{ value }}</span>
      <button class="c-btn plus" @click="$emit('increment')">+</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label:   { type: String, required: true },
  glyph:   { type: String, default: '•' },
  value:   { type: Number, default: 0 },
  type:    { type: String, default: 'neutral' } // 'bad' | 'good' | 'neutral'
})
defineEmits(['increment', 'decrement'])
</script>

<style scoped>
.counter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
}

.counter.bad    { border-left: 3px solid var(--danger); }
.counter.good   { border-left: 3px solid var(--success); }
.counter.neutral { border-left: 3px solid var(--muted); }

.c-glyph  { font-size: 1.1rem; }

.c-label {
  flex: 1;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.c-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.c-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 1.1rem;
  cursor: pointer;
  font-family: var(--font-mono);
  transition: background 0.1s, border-color 0.1s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.c-btn:active {
  background: var(--border);
}

.c-value {
  min-width: 2.5ch;
  text-align: center;
  font-size: 1rem;
  color: var(--accent);
}
</style>
