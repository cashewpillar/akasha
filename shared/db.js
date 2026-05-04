import Dexie from 'dexie'

/**
 * Creates (or opens) a Dexie database for a specific app.
 * Each prototype gets its own isolated DB — no collisions.
 *
 * Usage:
 *   import { createAppDb } from '@shared/db'
 *   const db = createAppDb('stat-tracker', (db) => {
 *     db.version(1).stores({ entries: '++id, date, type' })
 *   })
 */
export function createAppDb(appName, defineSchema) {
  const db = new Dexie(`akasha__${appName}`)
  defineSchema(db)
  return db
}

/**
 * Export all data from a Dexie DB as a JSON blob download.
 * Call this from any app's settings/export button.
 */
export async function exportDb(db, filename) {
  const tables = {}
  for (const table of db.tables) {
    tables[table.name] = await table.toArray()
  }
  const payload = {
    app: db.name,
    exportedAt: new Date().toISOString(),
    tables
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `${db.name}-export-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Import data from a JSON file (produced by exportDb) into a Dexie DB.
 * Strategy: 'replace' clears existing data first. 'merge' adds on top.
 */
export async function importDb(db, file, strategy = 'replace') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const payload = JSON.parse(e.target.result)
        if (!payload.tables) throw new Error('Invalid export file')

        await db.transaction('rw', db.tables, async () => {
          for (const table of db.tables) {
            const rows = payload.tables[table.name]
            if (!rows) continue
            if (strategy === 'replace') await table.clear()
            await table.bulkPut(rows)
          }
        })
        resolve(payload)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsText(file)
  })
}
