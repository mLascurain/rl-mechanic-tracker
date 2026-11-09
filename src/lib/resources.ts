/** Accept only canonical HTTPS YouTube hosts and eleven-character video IDs. */
export function getYouTubeEmbedUrl(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null
    let id: string | null = null
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1)
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v')
      else id = url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})$/)?.[1] ?? null
    }
    return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  } catch {
    return null
  }
}
