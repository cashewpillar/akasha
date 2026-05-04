<template>
  <div class="grid-btn" :class="type">
    <div 
      class="half left" 
      @mousedown="startRepeat('decrement')" 
      @touchstart.prevent="startRepeat('decrement')"
      @mouseup="stopRepeat" 
      @mouseleave="stopRepeat"
      @touchend="stopRepeat"
      @touchcancel="stopRepeat"
    >
      <span class="icon">−</span>
    </div>
    <div 
      class="half right" 
      @mousedown="startRepeat('increment')" 
      @touchstart.prevent="startRepeat('increment')"
      @mouseup="stopRepeat" 
      @mouseleave="stopRepeat"
      @touchend="stopRepeat"
      @touchcancel="stopRepeat"
    >
      <span class="icon">+</span>
    </div>
    
    <div class="content">
      <span class="glyph">{{ glyph }}</span>
      <span class="name">{{ label }}</span>
      <span class="count">{{ count || '' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

defineProps({
  label: { type: String, required: true },
  glyph: { type: String, default: '' },
  count: { type: [Number, String], default: '' },
  type:  { type: String, default: '' }
})
const emit = defineEmits(['increment', 'decrement'])

let timer = null
let repeatTimer = null

function startRepeat(action) {
  // Trigger once immediately
  emit(action)
  
  // Wait 500ms, then repeat every 100ms
  timer = setTimeout(() => {
    repeatTimer = setInterval(() => {
      emit(action)
    }, 80)
  }, 400)
}

function stopRepeat() {
  if (timer) clearTimeout(timer)
  if (repeatTimer) clearInterval(repeatTimer)
  timer = null
  repeatTimer = null
}

onBeforeUnmount(() => stopRepeat())
</script>

<style scoped>
.grid-btn {
  display: flex;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-sans);
  position: relative;
  overflow: hidden;
  user-select: none;
  height: 90px;
  border-radius: 12px;
}

.half {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: background 0.1s;
}

.half.left { justify-content: flex-start; padding-left: 10px; }
.half.right { justify-content: flex-end; padding-right: 10px; }

.half:active {
  background: rgba(255, 255, 255, 0.05);
}

.icon {
  font-size: 0.8rem;
  color: var(--muted);
  opacity: 0.3;
  pointer-events: none;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  pointer-events: none; /* Let clicks pass to .half */
  padding: 0.5rem;
}

.grid-btn.bad.left:active { border-left-color: var(--danger); }
.grid-btn:active { border-color: var(--accent); }

.glyph { font-size: 1.25rem; }
.name  { font-size: 0.55rem; letter-spacing: 0.05em; color: var(--muted); text-align: center; }
.count { font-size: 0.7rem; color: var(--accent); min-height: 1em; }
</style>
