/** Display names are a local visual preference, not a unique account handle. */
export function parsePlayerName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const name = value.trim()
  return name.length >= 2 && name.length <= 32 && /^[\p{L}\p{N} _.-]+$/u.test(name) ? name : null
}

export function playerNameFallback(value: unknown): string {
  if (typeof value !== 'string' || /^player_[a-f0-9]{32}$/i.test(value)) return 'Player'
  return parsePlayerName(value) ?? 'Player'
}
