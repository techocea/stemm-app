export function slugify(text: string, maxLen = 40): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric -> hyphen
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .slice(0, maxLen)
    .replace(/-+$/g, "") // trim if slice cut mid-word leaving trailing hyphen
}

/** Short random suffix for uniqueness — not cryptographic, just collision-avoidance. */
function shortSuffix(len = 5): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + len)
}

/**
 * Generates a readable, unique-enough ID: "sn-linked-lists-x7k2q"
 * Pass `existingIds` (e.g. shortNotesList.map(n => n.id)) to guarantee no collision
 * within this session's data — regenerates the suffix on the rare clash.
 */
export function generateId(
  prefix: "sn" | "model" | "solved",
  title: string,
  existingIds: string[] = []
): string {
  const base = slugify(title) || "untitled"
  let id = `${prefix}-${base}-${shortSuffix()}`
  let attempts = 0
  while (existingIds.includes(id) && attempts < 5) {
    id = `${prefix}-${base}-${shortSuffix()}`
    attempts++
  }
  return id
}
