export async function hashFile(base64: string): Promise<string> {
  const buf = new TextEncoder().encode(base64)
  const hashBuffer = await crypto.subtle.digest("SHA-256", buf)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
