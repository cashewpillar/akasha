import { ref, onUnmounted } from 'vue'
import { liveQuery } from 'dexie'

/**
 * Wraps a Dexie liveQuery in a Vue ref so your components
 * stay reactive automatically when DB data changes.
 *
 * Usage:
 *   const entries = useLiveQuery(() => db.entries.toArray(), [])
 */
export function useLiveQuery(queryFn, defaultValue = null) {
  const result = ref(defaultValue)
  const subscription = liveQuery(queryFn).subscribe({
    next: (val) => { result.value = val },
    error: (err) => { console.error('liveQuery error:', err) }
  })
  onUnmounted(() => subscription.unsubscribe())
  return result
}
