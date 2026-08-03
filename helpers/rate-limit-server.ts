const WINDOW_MS = 60_000 // 1 minute window
const MAX_REQUESTS = 3 // max generations per IP per window

const hits = new Map<string, number[]>()

setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS
  for (const [ip, timestamps] of hits.entries()) {
    const recent = timestamps.filter((t) => t > cutoff)
    if (recent.length === 0) hits.delete(ip)
    else hits.set(ip, recent)
  }
}, WINDOW_MS).unref?.()

export function checkServerRateLimit(ip: string): {
  allowed: boolean
  retryAfterSeconds?: number
} {
  const now = Date.now()
  const cutoff = now - WINDOW_MS
  const timestamps = (hits.get(ip) || []).filter((t) => t > cutoff)

  if (timestamps.length >= MAX_REQUESTS) {
    const oldestInWindow = timestamps[0]
    const retryAfterSeconds = Math.ceil(
      (oldestInWindow + WINDOW_MS - now) / 1000
    )
    return { allowed: false, retryAfterSeconds }
  }

  timestamps.push(now)
  hits.set(ip, timestamps)
  return { allowed: true }
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0].trim()
  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp
  return "unknown"
}
