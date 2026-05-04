<template>
  <div class="tracker">

    <!-- Header -->
    <header class="header">
      <router-link to="/" class="back">◀ akasha</router-link>
      <h1>stat tracker</h1>
      <span class="date-label">{{ displayDate }}</span>
    </header>

    <div v-if="day" class="content">

      <!-- ─── Avatar / Level Bar ─── -->
      <section class="avatar-block">
        <div class="avatar-art">{{ avatarGlyph }}</div>
        <div class="avatar-info">
          <div class="level-label">LVL {{ level }} — {{ levelTitle }}</div>
          <div class="xp-bar-wrap">
            <div class="xp-bar" :style="{ width: xpPercent + '%' }"></div>
          </div>
          <div class="xp-label">{{ xp }} / {{ xpNeeded }} XP</div>
        </div>
      </section>

      <!-- ─── Sleep / Wake ─── -->
      <section class="stat-section">
        <h2 class="section-title">⏰ REST</h2>
        <div class="time-row">
          <label>SLEEP
            <input type="time" :value="day.sleepTime" @change="e => save({ sleepTime: e.target.value })" />
          </label>
          <label>WAKE
            <input type="time" :value="day.wakeTime" @change="e => save({ wakeTime: e.target.value })" />
          </label>
        </div>
        <div class="sleep-duration" v-if="sleepDuration">{{ sleepDuration }}</div>
      </section>

      <!-- ─── Negative Habits ─── -->
      <section class="stat-section">
        <h2 class="section-title">📉 NEGATIVE HABITS</h2>
        <div class="habit-grid">
          <GridButton
            v-for="h in habitTypes" :key="h.key"
            :label="h.label"
            :glyph="h.glyph"
            :count="day[h.key]"
            :type="h.type"
            @increment="increment(h.key, 1)"
            @decrement="increment(h.key, -1)"
          />
        </div>
      </section>

      <!-- ─── Zone Sessions ─── -->
      <section class="stat-section">
        <h2 class="section-title">🌀 THE ZONE</h2>
        <p class="zone-sub">low-stimulation, body-present flow states</p>
        <div class="zone-grid">
          <GridButton
            v-for="z in zoneTypes" :key="z.key"
            :label="z.label"
            :glyph="z.glyph"
            :count="zoneCount(z.key)"
            @increment="logZone(z.key)"
            @decrement="decrementZone(z.key)"
          />
        </div>
      </section>

      <!-- ─── Exploited Time ─── -->
      <section class="stat-section">
        <h2 class="section-title">⚡ EXPLOITED TIME</h2>
        <p class="zone-sub">focused work / deep session minutes</p>
        <div class="time-stepper">
          <button class="step-btn" @click="increment('exploitedMinutes', -15)">−15m</button>
          <span class="step-val">{{ day.exploitedMinutes }}m</span>
          <button class="step-btn" @click="increment('exploitedMinutes', 15)">+15m</button>
        </div>
      </section>

      <!-- ─── Notes ─── -->
      <section class="stat-section">
        <h2 class="section-title">📜 NOTES</h2>
        <textarea
          class="notes"
          :value="day.notes"
          placeholder="anything worth recording..."
          @input="e => save({ notes: e.target.value })"
          rows="3"
        ></textarea>
      </section>

      <!-- ─── Export / Import ─── -->
      <section class="stat-section io-section">
        <button class="io-btn" @click="doExport">⬇ EXPORT</button>
        <label class="io-btn">
          ⬆ IMPORT
          <input type="file" accept=".json" @change="doImport" hidden />
        </label>
      </section>

    </div>

    <div v-else class="loading">LOADING RECORDS...</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { db, today, getOrCreateDay, updateDay, incrementField } from './db.js'
import { exportDb, importDb } from '@shared/db.js'
import GridButton from './components/GridButton.vue'

// ─── State ────────────────────────────────────────────────
const day = ref(null)
const dateKey = ref(today())
const zoneEvents = ref([])

const displayDate = computed(() => {
  const d = new Date(dateKey.value + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
})

onMounted(async () => {
  try {
    day.value = await getOrCreateDay(dateKey.value)
    await refreshZoneEvents()
  } catch (err) {
    console.error('Failed to load data:', err)
  }
})

async function refreshZoneEvents() {
  zoneEvents.value = await db.events
    .where('[date+type]')
    .equals([dateKey.value, 'zone'])
    .toArray()
}

async function save(patch) {
  day.value = await updateDay(dateKey.value, patch)
}

async function increment(field, delta) {
  day.value = await incrementField(field, dateKey.value, delta)
}

// ─── Negative Habits config ───────────────────────────────
const habitTypes = [
  { key: 'earPicking',       label: 'EAR PICKING',    glyph: '🐚', type: 'bad', penalty: 3 },
  { key: 'nosePicking',       label: 'NOSE PICKING',    glyph: '🍄', type: 'bad', penalty: 3 },
  { key: 'beardPlucking',       label: 'BEARD PLUCKING',    glyph: '🌵', type: 'bad', penalty: 3 },
  { key: 'unhealthyFood',    label: 'JUNK FOOD',       glyph: '🍟', type: 'bad', penalty: 5 },
  { key: 'hormonalActivity', label: 'HORMONAL',        glyph: '🔥', type: 'neutral' },
]

// ─── Zone ─────────────────────────────────────────────────
const zoneTypes = [
  { key: 'poop',        label: 'POOP',        glyph: '💩' },
  { key: 'bath',        label: 'BATH',  glyph: '🚿' },
  { key: 'dishes',      label: 'DISHES',       glyph: '🍽' },
  { key: 'teeth',       label: 'TOOTHBRUSH',   glyph: '🦷' },
  { key: 'stargaze',    label: 'STARGAZE',     glyph: '🌌' },
  { key: 'mealprep',    label: 'MEALPREP',    glyph: '🥘' },
  { key: 'walk',        label: 'WALK',         glyph: '🚶' },
  { key: 'stretch',     label: 'STRETCH',      glyph: '🧘' },
  { key: 'laundry',     label: 'LAUNDRY',      glyph: '👕' },
  { key: 'shave',     label: 'SHAVE',      glyph: '🪞' },
]

async function logZone(subtype) {
  const event = { date: dateKey.value, type: 'zone', subtype, createdAt: Date.now() }
  await db.events.add(event)
  await refreshZoneEvents()
  await increment('zone', 1)
}

async function decrementZone(subtype) {
  // Fetch directly from DB to avoid race conditions with reactive state
  const latest = await db.events
    .where('[date+type]')
    .equals([dateKey.value, 'zone'])
    .filter(e => e.subtype === subtype)
    .last()

  if (latest) {
    await db.events.delete(latest.id)
    await refreshZoneEvents()
    await increment('zone', -1)
  }
}

function zoneCount(subtype) {
  return zoneEvents.value.filter(e => e.subtype === subtype).length || ''
}

// ─── Sleep duration ───────────────────────────────────────
const sleepDuration = computed(() => {
  if (!day.value?.sleepTime || !day.value?.wakeTime) return null
  const [sh, sm] = day.value.sleepTime.split(':').map(Number)
  let [wh, wm] = day.value.wakeTime.split(':').map(Number)
  let mins = (wh * 60 + wm) - (sh * 60 + sm)
  if (mins < 0) mins += 1440 // past midnight
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
})

// ─── Gamification (simple XP model) ──────────────────────
const xp = computed(() => {
  if (!day.value) return 0
  let score = 0
  score += (day.value.zone || 0) * 10
  score += Math.min(day.value.exploitedMinutes || 0, 480) / 10
  if (sleepDuration.value) {
    const [h] = sleepDuration.value.split('h').map(Number)
    if (h >= 7 && h <= 9) score += 20
  }
  // Penalties
  habitTypes.forEach(h => {
    if (h.type === 'bad') {
      score -= (day.value[h.key] || 0) * (h.penalty || 3)
    }
  })
  return Math.max(0, Math.round(score))
})

const level = computed(() => Math.floor(xp.value / 50) + 1)
const xpNeeded = computed(() => level.value * 50)
const xpPercent = computed(() => Math.min(100, (xp.value % 50) / 50 * 100))

const levelTitles = ['PEASANT', 'SERF', 'SQUIRE', 'KNIGHT', 'LORD', 'CHAMPION', 'LEGEND', 'SAGE', 'ORACLE', 'AKASHA']
const levelTitle = computed(() => levelTitles[Math.min(level.value - 1, levelTitles.length - 1)])

const avatarGlyph = computed(() => {
  const glyphs = ['🧍','🧍','🧑‍🦯','🧑','🧑‍💼','🧝','🧙','🧙‍♂️','👑','🌟']
  return glyphs[Math.min(level.value - 1, glyphs.length - 1)]
})

// ─── Export / Import ──────────────────────────────────────
async function doExport() {
  await exportDb(db, `stat-tracker-${today()}.json`)
}

async function doImport(e) {
  const file = e.target.files[0]
  if (!file) return
  try {
    await importDb(db, file, 'replace')
    day.value = await getOrCreateDay(dateKey.value)
    await refreshZoneEvents()
    alert('Import successful.')
  } catch (err) {
    alert('Import failed: ' + err.message)
  }
}
</script>

<style scoped>
.tracker {
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

/* Header */
.header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
}

.header h1 {
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  color: var(--accent);
  text-align: center;
}

.back {
  font-size: 0.7rem;
  color: var(--muted);
  text-decoration: none;
  letter-spacing: 0.1em;
}

.back:hover { color: var(--accent); }

.date-label {
  font-size: 0.65rem;
  color: var(--muted);
  letter-spacing: 0.05em;
  text-align: right;
}

/* Avatar */
.avatar-block {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.avatar-art {
  font-size: 3rem;
  line-height: 1;
}

.avatar-info {
  flex: 1;
}

.level-label {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.xp-bar-wrap {
  width: 100%;
  height: 6px;
  background: var(--border);
  position: relative;
  overflow: hidden;
}

.xp-bar {
  height: 100%;
  background: var(--accent);
  transition: width 0.4s ease;
}

.xp-label {
  font-size: 0.65rem;
  color: var(--muted);
  margin-top: 0.35rem;
  letter-spacing: 0.1em;
}

/* Sections */
.content { padding: 0 1.25rem; }

.stat-section {
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--muted);
  margin-bottom: 0.85rem;
}

/* Sleep/Wake */
.time-row {
  display: flex;
  gap: 1.5rem;
}

.time-row label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.time-row input[type="time"] {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 1rem;
  padding: 0.4rem 0.6rem;
  width: 130px;
  border-radius: 8px;
}

.sleep-duration {
  margin-top: 0.6rem;
  font-size: 0.75rem;
  color: var(--accent);
  letter-spacing: 0.1em;
}

/* Habits */
.habit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

/* Zone */
.zone-sub {
  font-size: 0.65rem;
  color: var(--muted);
  margin-bottom: 0.85rem;
  letter-spacing: 0.05em;
}

.zone-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

/* Exploited time */
.time-stepper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.8rem;
  padding: 0.5rem 0.85rem;
  cursor: pointer;
  letter-spacing: 0.05em;
  border-radius: 8px;
}

.step-btn:active { border-color: var(--accent); }

.step-val {
  font-size: 1.25rem;
  color: var(--accent);
  min-width: 5ch;
  text-align: center;
}

/* Notes */
.notes {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.8rem;
  padding: 0.75rem;
  resize: vertical;
  line-height: 1.5;
  border-radius: 12px;
}

.notes:focus { outline: 1px solid var(--accent); }

/* IO */
.io-section {
  display: flex;
  gap: 1rem;
}

.io-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  border-radius: 12px;
}

.io-btn:hover { color: var(--accent); border-color: var(--accent); }

/* Loading */
.loading {
  padding: 3rem;
  text-align: center;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--muted);
}
</style>
