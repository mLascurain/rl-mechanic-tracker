'use client'

import { useState, useMemo, useRef } from 'react'
import type { MechanicCatalogItem } from '@/lib/data/mechanics'
import type { RankInfo } from '@/lib/ranks'
import { MechanicCard } from './MechanicCard'
import { Pagination } from '@/components/layout/Pagination'
import {
  Search,
  RotateCcw,
  Filter,
  X,
} from 'lucide-react'

interface MechanicsCatalogProps {
  initialMechanics: MechanicCatalogItem[]
  ranks: RankInfo[]
}

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'All Difficulties' },
  { value: 1, label: '1 - Basic' },
  { value: 2, label: '2 - Intermediate' },
  { value: 3, label: '3 - Advanced' },
  { value: 4, label: '4 - Expert' },
  { value: 5, label: '5 - Pro' },
]

const SORT_OPTIONS = [
  { value: 'rank_asc', label: 'Rank: Low to High' },
  { value: 'rank_desc', label: 'Rank: High to Low' },
  { value: 'difficulty_asc', label: 'Difficulty: Low to High' },
  { value: 'difficulty_desc', label: 'Difficulty: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
]

const PAGE_SIZE = 12

export function MechanicsCatalog({ initialMechanics, ranks }: MechanicsCatalogProps) {
  // Local state for interactive filtering
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all')
  const [selectedRankId, setSelectedRankId] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'not_started' | 'learning' | 'mastered'>('all')
  const [sortBy, setSortBy] = useState<string>('rank_asc')
  const [page, setPage] = useState(1)
  const resultsHeading = useRef<HTMLDivElement>(null)

  // Extract unique categories from mechanics data
  const categories = useMemo(() => {
    const set = new Set<string>()
    initialMechanics.forEach((m) => {
      if (m.category) set.add(m.category)
    })
    return Array.from(set).sort()
  }, [initialMechanics])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchQuery.trim() !== '') count++
    if (selectedCategory !== 'all') count++
    if (selectedDifficulty !== 'all') count++
    if (selectedRankId !== 'all') count++
    if (selectedStatus !== 'all') count++
    return count
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedRankId, selectedStatus])

  // Reset all filters to default
  const handleResetFilters = () => {
    setPage(1)
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedDifficulty('all')
    setSelectedRankId('all')
    setSelectedStatus('all')
    setSortBy('rank_asc')
  }

  // Filter & Sort mechanics
  const filteredMechanics = useMemo(() => {
    return initialMechanics
      .filter((mechanic) => {
        // 1. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const nameMatches = mechanic.name.toLowerCase().includes(q)
          const descMatches = mechanic.description?.toLowerCase().includes(q) ?? false
          const catMatches = mechanic.category?.toLowerCase().includes(q) ?? false
          if (!nameMatches && !descMatches && !catMatches) {
            return false
          }
        }

        // 2. Category
        if (selectedCategory !== 'all') {
          if (mechanic.category !== selectedCategory) {
            return false
          }
        }

        // 3. Difficulty
        if (selectedDifficulty !== 'all') {
          if (mechanic.difficulty !== selectedDifficulty) {
            return false
          }
        }

        // 4. Rank
        if (selectedRankId !== 'all') {
          if (mechanic.recommended_rank_id !== selectedRankId) {
            return false
          }
        }

        // 5. User Status
        if (selectedStatus !== 'all') {
          if (selectedStatus === 'not_started' && mechanic.userStatus !== null) {
            return false
          }
          if (selectedStatus === 'learning' && mechanic.userStatus !== 'learning') {
            return false
          }
          if (selectedStatus === 'mastered' && mechanic.userStatus !== 'mastered') {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rank_asc': {
            const orderA = a.rank?.sort_order ?? 999
            const orderB = b.rank?.sort_order ?? 999
            if (orderA !== orderB) return orderA - orderB
            return a.difficulty - b.difficulty
          }
          case 'rank_desc': {
            const orderA = a.rank?.sort_order ?? -1
            const orderB = b.rank?.sort_order ?? -1
            if (orderA !== orderB) return orderB - orderA
            return b.difficulty - a.difficulty
          }
          case 'difficulty_asc': {
            if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty
            return a.name.localeCompare(b.name)
          }
          case 'difficulty_desc': {
            if (a.difficulty !== b.difficulty) return b.difficulty - a.difficulty
            return a.name.localeCompare(b.name)
          }
          case 'name_asc': {
            return a.name.localeCompare(b.name)
          }
          default:
            return 0
        }
      })
  }, [
    initialMechanics,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedRankId,
    selectedStatus,
    sortBy,
  ])

  const pageCount = Math.max(1, Math.ceil(filteredMechanics.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleMechanics = filteredMechanics.slice(startIndex, startIndex + PAGE_SIZE)

  function changePage(nextPage: number) {
    setPage(nextPage)
    resultsHeading.current?.focus({ preventScroll: true })
    resultsHeading.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className="space-y-6">
      {/* Control Panel: Search & Filter Toolbar */}
      <div className="rl-card p-4 sm:p-6 border-slate-800 space-y-4">
        {/* Row 1: Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              aria-label="Search mechanics"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              placeholder="Search mechanics by name, skill, or keyword (e.g. flick, aerial, wavedash)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="sort-select" className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden lg:block">
              Sort:
            </label>
            <select
              aria-label="Sort mechanics"
              id="sort-select"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
              className="bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 rounded-xl px-3 py-2.5 focus-visible:outline-none focus:border-accent transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Dropdowns (Difficulty, Rank, Status) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          {/* Difficulty Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Difficulty
            </label>
            <select
              aria-label="Filter by difficulty"
              value={selectedDifficulty}
              onChange={(e) => {
                const val = e.target.value
                setSelectedDifficulty(val === 'all' ? 'all' : Number(val))
                setPage(1)
              }}
              className="w-full bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 rounded-lg px-3 py-2 focus-visible:outline-none focus:border-accent cursor-pointer"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rank Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Recommended Rank
            </label>
            <select
              aria-label="Filter by recommended rank"
              value={selectedRankId}
              onChange={(e) => { setSelectedRankId(e.target.value); setPage(1) }}
              className="w-full bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 rounded-lg px-3 py-2 focus-visible:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All Ranks (Bronze - SSL)</option>
              {ranks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mastery Status Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Mastery Status
            </label>
            <select
              aria-label="Filter by mastery status"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as 'all' | 'not_started' | 'learning' | 'mastered')
                setPage(1)
              }}
              className="w-full bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 rounded-lg px-3 py-2 focus-visible:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="learning">Learning</option>
              <option value="mastered">Done</option>
            </select>
          </div>
        </div>

        {/* Row 3: Category Pills (Horizontal scrolling list) */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories
            </span>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-accent hover:text-accent font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => { setSelectedCategory('all'); setPage(1) }}
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-primary text-foreground font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => { setSelectedCategory(cat); setPage(1) }}
                  className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-foreground font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat.replace(/_/g, ' ')}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results Header: Count & Active Badges */}
      <div ref={resultsHeading} tabIndex={-1} className="flex scroll-mt-24 flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
        <div role="status" aria-live="polite" className="flex items-center gap-2">
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            {filteredMechanics.length > 0 ? `Showing ${startIndex + 1}–${Math.min(startIndex + PAGE_SIZE, filteredMechanics.length)} of ${filteredMechanics.length}` : '0'} Mechanics
            {activeFiltersCount > 0 ? ` (${initialMechanics.length} total)` : ''}
          </span>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-accent/80 text-accent border border-primary/40">
              {activeFiltersCount} {activeFiltersCount === 1 ? 'Filter' : 'Filters'} Active
            </span>
          )}
        </div>

        {/* Quick status summary counts if any filtered */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>Done</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-progress" />
            <span>Learning</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            <span>Not Started</span>
          </span>
        </div>
      </div>

      {/* Mechanics Grid */}
      {filteredMechanics.length > 0 ? (
        <div id="mechanics-results" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleMechanics.map((mechanic) => (
            <MechanicCard key={mechanic.id} mechanic={mechanic} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rl-card p-12 text-center border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
            <Filter className="w-8 h-8 text-accent/80" />
          </div>

          <div className="max-w-md">
            <h3 className="text-xl font-bold uppercase tracking-tight text-white">
              No Mechanics Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              No mechanics match your current combination of search query and filters. Try clearing
              the search or resetting your filters to see all available Rocket League techniques.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="rl-btn-cyan text-xs !py-2.5 !px-5 mt-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All Filters</span>
          </button>
        </div>
      )}
      <Pagination page={currentPage} pageCount={pageCount} label="Mechanics pages" controls="mechanics-results" onPageChange={changePage} />
    </div>
  )
}
