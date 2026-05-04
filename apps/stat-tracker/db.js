import { createAppDb } from '@shared/db'

export const db = createAppDb('stat-tracker', (db) => {
  db.version(2).stores({
    // date: 'YYYY-MM-DD string (primary key per day)
    // All records are stored as one record per day
    days: 'date',

    // For counters that need individual timestamps (zone sessions, etc.)
    events: '++id, [date+type], date, type, subtype, createdAt'
  })
})

// ─── Helpers ──────────────────────────────────────────────

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export async function getOrCreateDay(date = today()) {
  const existing = await db.days.get(date)
  if (existing) return existing

  const fresh = {
    date,
    // Negative habits
    earPicking: 0,
    nosePicking: 0,
    beardPlucking: 0,
    unhealthyFood: 0,
    hormonalActivity: 0,
    // Positive / zone sessions
    zone: 0,
    // Time tracking (stored as HH:MM strings)
    sleepTime: null,
    wakeTime: null,
    // Misc
    exploitedMinutes: 0,
    notes: ''
  }
  await db.days.put(fresh)
  return fresh
}

export async function updateDay(date, patch) {
  const day = await getOrCreateDay(date)
  const updated = { ...day, ...patch }
  await db.days.put(updated)
  return updated
}

export async function incrementField(field, date = today(), delta = 1) {
  await db.days.where(':id').equals(date).modify(d => {
    const current = d[field] ?? 0
    d[field] = Math.max(0, current + delta)
  })
  return db.days.get(date)
}
