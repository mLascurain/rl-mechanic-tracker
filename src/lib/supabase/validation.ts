/** Only permit app-relative destinations, including after URL normalization. */
export function safeRedirectPath(value: unknown, fallback = '/profile'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || /[\\\u0000-\u0020\u007f]/.test(value)) return fallback
  try {
    const base = 'https://rlmt.invalid'
    const target = new URL(value, base)
    if (target.origin !== base || target.pathname.startsWith('//')) return fallback
    return `${target.pathname}${target.search}${target.hash}`
  } catch {
    return fallback
  }
}

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}
