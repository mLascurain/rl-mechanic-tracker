import assert from 'node:assert/strict'

const base = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000'
const publicPages = [
  ['/', 'Build your game.'],
  ['/mechanics', 'Fast Aerial'],
  ['/mechanics/fast-aerial', '10jGIo1n8hg'],
  ['/auth/login', 'email'],
  ['/auth/register', 'email'],
]
for (const [path, expected] of publicPages) {
  const response = await fetch(new URL(path, base), { redirect: 'manual' })
  assert.equal(response.status, 200, path)
  const html = await response.text()
  assert(html.includes(expected), `${path} missing expected content`)
  assert(!html.includes('Application error'), `${path} application error`)
  console.log(`PASS ${path}: 200, expected content rendered`)
}
for (const path of ['/recommendations', '/progress', '/profile']) {
  const response = await fetch(new URL(path, base), { redirect: 'manual' })
  assert.equal(response.status, 307, path)
  const location = new URL(response.headers.get('location'), base)
  assert.equal(location.pathname, '/auth/login')
  assert.equal(location.searchParams.get('redirectTo'), path)
  console.log(`PASS ${path}: login redirect preserves destination`)
}
