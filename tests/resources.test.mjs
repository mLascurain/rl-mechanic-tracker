import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getYouTubeEmbedUrl } from '../src/lib/resources.ts'

test('normalizes supported HTTPS video URLs', () => {
  for (const url of ['https://www.youtube.com/watch?v=abcdefghijk&t=30', 'https://youtu.be/abcdefghijk', 'https://www.youtube.com/shorts/abcdefghijk']) {
    assert.equal(getYouTubeEmbedUrl(url), 'https://www.youtube-nocookie.com/embed/abcdefghijk')
  }
})
test('rejects lookalike domains, unsafe schemes, credentials and invalid IDs', () => {
  for (const url of ['https://youtube.com.evil.test/watch?v=abcdefghijk', 'http://youtube.com/watch?v=abcdefghijk', 'javascript:alert(1)', 'https://evil.test/youtu.be/abcdefghijk', 'https://user@youtube.com/watch?v=abcdefghijk', 'https://youtube.com/watch?v=bad', null]) {
    assert.equal(getYouTubeEmbedUrl(url), null)
  }
})
