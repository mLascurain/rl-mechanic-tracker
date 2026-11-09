import assert from 'node:assert/strict'
import test from 'node:test'
import { safeRedirectPath, isUuid } from '../src/lib/supabase/validation.ts'

test('auth destinations cannot redirect outside the application', () => {
  for (const value of ['https://evil.example', '//evil.example', '///evil.example', '/\\evil.example', '/\n/evil.example', '/\tevil.example', '/\u0000evil.example', null, new Blob()]) {
    assert.equal(safeRedirectPath(value), '/profile')
  }
  assert.equal(safeRedirectPath('/mechanics?category=aerial#results'), '/mechanics?category=aerial#results')
  assert.equal(safeRedirectPath('/progress/../profile'), '/profile')
  assert.equal(safeRedirectPath('/progress/..//evil.example'), '/profile')
  assert.equal(safeRedirectPath(undefined, '/'), '/')
  assert.equal(safeRedirectPath('/mechanics?q=https://example.com'), '/mechanics?q=https://example.com')
})

test('server action identifiers accept UUIDs and reject untrusted input', () => {
  assert.equal(isUuid('1bb71ca9-38a7-45d4-92b4-06d4ba69a019'), true)
  for (const value of ['', 'not-a-uuid', null, 123, {}]) assert.equal(isUuid(value), false)
})
