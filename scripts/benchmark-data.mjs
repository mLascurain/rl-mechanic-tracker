// Synthetic dependency benchmark; no network, database, browser, or production timing.
// Run: node scripts/benchmark-data.mjs [baseline-git-ref]
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
const baselineRef = process.argv[2] ?? 'HEAD'
const sourcePath = 'src/lib/data/mechanics.ts'
const delayMs = 50
const samples = 5
const baselineCommit = execFileSync('git', ['rev-parse', baselineRef], { cwd: root, encoding: 'utf8' }).trim()
const compile = (source) => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const sources = {
  before: compile(execFileSync('git', ['show', `${baselineCommit}:${sourcePath}`], { cwd: root, encoding: 'utf8' })),
  after: compile(readFileSync(new URL(`../${sourcePath}`, import.meta.url), 'utf8')),
}
const wait = () => new Promise((resolve) => setTimeout(resolve, delayMs))
const mechanic = {
  id: 'mechanic-a', slug: 'fast-aerial', name: 'Fast Aerial', description: 'Practice aerials',
  category: 'movement', difficulty: 2, recommended_rank_id: 'rank-a',
  ranks: { id: 'rank-a', name: 'Gold', sort_order: 3 },
}

function instantiate(compiled) {
  const counts = { auth: 0, queries: 0 }
  // Models React request-local memoization. A fresh module/cache exists per sample.
  // This does not benchmark React or Next's own fetch memoization.
  const cache = (fn) => {
    const values = new Map()
    return (...args) => {
      const key = JSON.stringify(args)
      if (!values.has(key)) values.set(key, fn(...args))
      return values.get(key)
    }
  }
  const getUser = async () => {
    counts.auth++
    await wait()
    return { data: { user: { id: 'user-a' } }, error: null }
  }
  const client = {
    auth: { getUser },
    from(table) {
      let single = false
      const query = {
        select() { return query }, eq() { return query }, in() { return query },
        maybeSingle() { single = true; return query },
        then(resolve, reject) {
          counts.queries++
          return wait().then(() => {
            let data = []
            if (table === 'mechanics') data = single ? mechanic : [mechanic]
            if (table === 'user_mechanics') data = [{ mechanic_id: mechanic.id, status: 'learning' }]
            return { data, error: null }
          }).then(resolve, reject)
        },
      }
      return query
    },
  }
  const exports = {}
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'react') return { cache }
      if (name === '@/lib/supabase/server') return { createClient: async () => client, getUser: cache(getUser) }
      throw new Error(`Unexpected import: ${name}`)
    },
  })
  return { exports, counts }
}

const scenarios = {
  catalog: (api) => api.getMechanicsCatalog(),
  detail: (api) => api.getMechanicDetail('fast-aerial'),
  // Metadata and page are modeled as two concurrent consumers of the same slug.
  detailTwoConsumers: (api) => Promise.all([
    api.getMechanicDetail('fast-aerial'), api.getMechanicDetail('fast-aerial'),
  ]),
}
const results = {}
for (const [name, scenario] of Object.entries(scenarios)) {
  const measurements = {}
  const outputs = {}
  for (const [version, compiled] of Object.entries(sources)) {
    const durations = []
    let counts
    for (let index = 0; index < samples; index++) {
      const instance = instantiate(compiled)
      const start = performance.now()
      outputs[version] = JSON.stringify(await scenario(instance.exports))
      durations.push(performance.now() - start)
      counts = instance.counts
    }
    durations.sort((a, b) => a - b)
    measurements[version] = { medianMs: Number(durations[Math.floor(samples / 2)].toFixed(1)), ...counts }
  }
  assert.equal(outputs.after, outputs.before, `${name}: output changed`)
  results[name] = {
    ...measurements,
    improvementPercent: Number((100 * (1 - measurements.after.medianMs / measurements.before.medianMs)).toFixed(1)),
  }
}
console.log(JSON.stringify({
  kind: 'synthetic; not production latency', baselineCommit, delayMs, samples,
  exclusions: ['network', 'SQL execution', 'browser rendering', 'proxy', 'Next fetch memoization'],
  counts: 'logical Auth and database calls; not observed network requests',
  results,
}, null, 2))
