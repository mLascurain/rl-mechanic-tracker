import { test } from 'node:test'
import assert from 'node:assert/strict'
import { recommendMechanics } from '../src/lib/recommendations.ts'

const mechanic = (id, difficulty = 1, rankOrder = 1) => ({ id, slug: id, name: id, difficulty, rankOrder, rankName: 'Bronze' })

test('requires every prerequisite to be mastered, excludes mastered and ranks above current + 1', () => {
  const items = [mechanic('base'), mechanic('ready', 2, 2), mechanic('blocked'), mechanic('high', 1, 3), mechanic('unknown', 1, null)]
  const edges = [{ mechanic_id: 'ready', prerequisite_id: 'base' }, { mechanic_id: 'blocked', prerequisite_id: 'ready' }]
  assert.deepEqual(recommendMechanics(items, edges, new Set(['base']), 1).map((s) => s.mechanic.id), ['ready'])
})

test('sorts difficulty first, then rank, without mutating inputs', () => {
  const items = [mechanic('hard', 3, 1), mechanic('later', 1, 2), mechanic('first', 1, 1)]
  assert.deepEqual(recommendMechanics(items, [], new Set(), 1).map((s) => s.mechanic.id), ['first', 'later', 'hard'])
  assert.equal(items[0].id, 'hard')
})

test('does not unlock subsequent steps until actual mastery; explains eligible prerequisites', () => {
  const items = [mechanic('base'), mechanic('next'), mechanic('last')]
  const edges = [{ mechanic_id: 'next', prerequisite_id: 'base' }, { mechanic_id: 'last', prerequisite_id: 'next' }]
  const steps = recommendMechanics(items, edges, new Set(['base']), 1)
  assert.equal(steps.length, 1)
  assert.match(steps[0].explanation, /mastered base/)
})

test('missing prerequisite records, cycles and invalid current ranks fail closed', () => {
  const items = [mechanic('a'), mechanic('b'), mechanic('orphan')]
  const edges = [{ mechanic_id: 'a', prerequisite_id: 'b' }, { mechanic_id: 'b', prerequisite_id: 'a' }, { mechanic_id: 'orphan', prerequisite_id: 'missing' }]
  assert.deepEqual(recommendMechanics(items, edges, new Set(['missing']), 1), [])
  assert.deepEqual(recommendMechanics(items, [], new Set(), NaN), [])
})
