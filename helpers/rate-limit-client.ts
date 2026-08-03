const COOLDOWN_MS = 45_000 // 45s between generations
const STORAGE_KEY = "last_generation_at"

export function checkClientRateLimit(): {
  allowed: boolean
  waitSeconds?: number
} {
  if (typeof window === "undefined") return { allowed: true }

  const last = localStorage.getItem(STORAGE_KEY)
  if (!last) return { allowed: true }

  const elapsed = Date.now() - parseInt(last, 10)
  if (elapsed >= COOLDOWN_MS) return { allowed: true }

  return {
    allowed: false,
    waitSeconds: Math.ceil((COOLDOWN_MS - elapsed) / 1000),
  }
}

export function markGenerationSent() {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, Date.now().toString())
}
