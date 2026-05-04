import { createAppDb } from '@shared/db'

export const db = createAppDb('stat-tracker', (db) => {
  db.version(1).stores({
    // date: 'YYYY-MM-DD string (primary key per day)
    // All daily stats are stored as one record per day
    days: 'date',

    // For counters that need individual timestamps (zone sessions, etc.)
    events: '++id, date, type, createdAt'
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
    // Negative habits (counters)
    earPicking: 0,
    unhealthyFood: 0,
    // Positive / zone sessions
    zone: 0,
    // Time tracking (stored as HH:MM strings)
    sleepTime: null,
    wakeTime: null,
    // Misc
    hormonalActivity: 0,
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
  const day = await getOrCreateDay(date)
  const current = day[field] ?? 0
  return updateDay(date, { [field]: Math.max(0, current + delta) })
}
