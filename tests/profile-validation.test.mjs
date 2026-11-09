import assert from 'node:assert/strict'
import test from 'node:test'
import { parsePlayerName, playerNameFallback } from '../src/lib/profile.ts'

test('local display names preserve friendly capitalization and spaces within length boundaries', () => {
  assert.equal(parsePlayerName('  Aerial Ace27  '), 'Aerial Ace27')
  assert.equal(parsePlayerName('Álex_27'), 'Álex_27')
  assert.equal(parsePlayerName('ab'), 'ab')
  assert.equal(parsePlayerName('a'.repeat(32)), 'a'.repeat(32))
})

test('local display names reject missing, oversized, non-text and unsupported input', () => {
  for (const value of [null, undefined, 12, {}, '', 'a', 'a'.repeat(33), '<script>', 'a/b', 'a\nb', 'a\u200bb']) {
    assert.equal(parsePlayerName(value), null)
  }
})

test('generated account identifiers are hidden behind a friendly fallback', () => {
  assert.equal(playerNameFallback('player_204271c7bfa041859fef2beb05e38c2c'), 'Player')
  assert.equal(playerNameFallback(null), 'Player')
  assert.equal(playerNameFallback('Existing Name'), 'Existing Name')
})
