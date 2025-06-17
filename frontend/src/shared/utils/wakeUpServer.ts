export const CACHE_KEY = 'lastServerPing'
const CACHE_DURATION_MS = 1000 * 60 * 15 // 15 minutes

// Decide if enough time passed before last ping
export const shouldPingServer = () => {
  const lastPing = localStorage.getItem(CACHE_KEY)
  if (!lastPing) return true
  const timePassed = Date.now() - parseInt(lastPing)
  return timePassed > CACHE_DURATION_MS
}
