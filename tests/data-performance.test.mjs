import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

function loadDataModule(file, responses, user = null) {
  const calls = []
  const client = {
    from(table) {
      const call = { table, filters: [] }
      const query = {
        select() { return query },
        eq(...filter) { call.filters.push(filter); return query },
        in(...filter) { call.filters.push(filter); return query },
        order() { return query },
        maybeSingle() { return query },
        then(resolve, reject) {
          calls.push(call)
          return Promise.resolve().then(() => responses(table, call)).then(resolve, reject)
        },
      }
      return query
    },
  }
  const exports = {}
  const compiled = ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'react') return { cache: (fn) => fn }
      if (name === '@/lib/supabase/server') return {
        createClient: async () => client,
        getUser: async () => ({ data: { user }, error: null }),
      }
      throw new Error(`Unexpected module: ${name}`)
    },
  })
  return { ...exports, calls }
}

function deferred() {
  let resolve
  const promise = new Promise((done) => { resolve = done })
  return { promise, resolve }
}
const tick = () => new Promise((resolve) => setImmediate(resolve))

test('catalog starts independent reads without waiting for catalog response', async () => {
  const gate = deferred()
  const data = loadDataModule('../src/lib/data/mechanics.ts', (table) =>
    table === 'mechanics' ? gate.promise : { data: [], error: null }, { id: 'user-a' })
  const result = data.getMechanicsCatalog()
  await tick()
  assert.deepEqual(data.calls.map((call) => call.table).sort(),
    ['mechanic_prerequisites', 'mechanics', 'user_mechanics'])
  assert.deepEqual(data.calls.find((call) => call.table === 'user_mechanics').filters, [['user_id', 'user-a']])
  gate.resolve({ data: [], error: null })
  assert.equal((await result).length, 0)
})

test('detail starts resources and unlocks while prerequisites are pending', async () => {
  const gate = deferred()
  const data = loadDataModule('../src/lib/data/mechanics.ts', (table, call) => {
    if (table === 'mechanics') return { data: { id: 'mechanic-a', slug: 'a' }, error: null }
    if (table === 'mechanic_prerequisites' && call.filters[0][0] === 'mechanic_id') return gate.promise
    return { data: [], error: null }
  })
  const result = data.getMechanicDetail('a')
  await tick()
  assert.equal(data.calls.length, 4)
  assert.ok(data.calls.some((call) => call.table === 'mechanic_resources'))
  gate.resolve({ data: [], error: null })
  assert.equal((await result).id, 'mechanic-a')
})

test('query failures are not presented as an empty catalog or a missing mechanic', async () => {
  const data = loadDataModule('../src/lib/data/mechanics.ts', () => ({ data: null, error: { message: 'network unavailable' } }))
  await assert.rejects(data.getMechanicsCatalog(), /Unable to load mechanics catalog/)
  await assert.rejects(data.getMechanicDetail('a'), /Unable to load mechanic/)
})

test('progress query failures cannot masquerade as zero progress', async () => {
  const data = loadDataModule('../src/lib/data/progress.ts', (table) => ({
    data: [], error: table === 'user_mechanics' ? { message: 'network unavailable' } : null,
  }), { id: 'user-a' })
  await assert.rejects(data.getUserProgressStats(), /Unable to load progress/)
})
