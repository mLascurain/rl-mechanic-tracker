import { createClient } from '@/lib/supabase/server'
import type { MechanicStatus, Rank } from '@/types/database.types'

export interface ProgressMechanicItem {
  id: string
  slug: string
  name: string
  description: string | null
  category: string | null
  difficulty: number
  recommended_rank_id: string | null
  rank: Rank | null
  userStatus: MechanicStatus | null
  prerequisiteCount: number
}

export interface RankProgressItem {
  rankId: string
  rankName: string
  sortOrder: number
  totalMechanics: number
  masteredCount: number
  learningCount: number
  unstartedCount: number
  percentage: number
}

export interface CategoryProgressItem {
  categoryKey: string
  categoryName: string
  totalMechanics: number
  masteredCount: number
  learningCount: number
  unstartedCount: number
  percentage: number
}

export interface UserProgressStats {
  user: {
    id: string
    email?: string
    username: string
    currentRank: Rank | null
  }
  kpi: {
    totalMechanics: number
    masteredCount: number
    learningCount: number
    unstartedCount: number
    completionPercentage: number
  }
  rankProgress: RankProgressItem[]
  categoryProgress: CategoryProgressItem[]
  learningMechanics: ProgressMechanicItem[]
  masteredMechanics: ProgressMechanicItem[]
}

/**
 * Format category keys (e.g. 'dribble_flick' -> 'Dribble & Flick', 'movement' -> 'Movement')
 */
export function formatCategoryName(categoryKey: string | null): string {
  if (!categoryKey) return 'General'
  const mapping: Record<string, string> = {
    movement: 'Movement',
    dash: 'Dashes & Recoveries',
    dribble: 'Ground Dribbling',
    dribble_flick: 'Dribbles & Flicks',
    air_dribble: 'Air Dribbles',
    shot: 'Shots & Strikes',
    flip_reset: 'Flip Resets',
    redirect: 'Redirects & Touches',
    pinch: 'Pinches',
    save: 'Defense & Saves',
    powershot: 'Power Shots',
    pogo: 'Freestyle / Pogo',
  }
  if (mapping[categoryKey]) return mapping[categoryKey]
  return categoryKey
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Fetches user progression stats across all mechanics.
 * If user is not authenticated, returns null.
 */
export async function getUserProgressStats(): Promise<UserProgressStats | null> {
  const supabase = await createClient()

  // 1. Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // 2. Fetch profile, ranks, mechanics, user status, prerequisites in parallel
  const [profileRes, ranksRes, mechanicsRes, userMechanicsRes, prereqRes] = await Promise.all([
    supabase
      .from('profiles')
      .select(`
        id,
        username,
        current_rank_id,
        ranks (
          id,
          name,
          sort_order
        )
      `)
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('ranks').select('id, name, sort_order').order('sort_order', { ascending: true }),
    supabase.from('mechanics').select(`
      id,
      slug,
      name,
      description,
      category,
      difficulty,
      recommended_rank_id,
      ranks (
        id,
        name,
        sort_order
      )
    `),
    supabase.from('user_mechanics').select('mechanic_id, status').eq('user_id', user.id),
    supabase.from('mechanic_prerequisites').select('mechanic_id'),
  ])

  const profile = profileRes.data
  const ranksList = ranksRes.data || []
  const mechanicsList = mechanicsRes.data || []
  const userMechanicsList = userMechanicsRes.data || []
  const prereqRows = prereqRes.data || []

  // Map user mechanics status
  const userStatusMap = new Map<string, MechanicStatus>()
  for (const row of userMechanicsList) {
    userStatusMap.set(row.mechanic_id, row.status as MechanicStatus)
  }

  // Count prerequisites per mechanic
  const prereqCountMap = new Map<string, number>()
  for (const row of prereqRows) {
    prereqCountMap.set(row.mechanic_id, (prereqCountMap.get(row.mechanic_id) || 0) + 1)
  }

  // Build full typed mechanic items
  const allMechanics: ProgressMechanicItem[] = mechanicsList.map((m) => {
    const rawRank = m.ranks as unknown
    let rankObj: Rank | null = null
    if (Array.isArray(rawRank)) {
      rankObj = rawRank[0] as Rank || null
    } else if (rawRank && typeof rawRank === 'object') {
      rankObj = rawRank as Rank
    }

    return {
      id: m.id,
      slug: m.slug,
      name: m.name,
      description: m.description,
      category: m.category,
      difficulty: m.difficulty,
      recommended_rank_id: m.recommended_rank_id,
      rank: rankObj,
      userStatus: userStatusMap.get(m.id) ?? null,
      prerequisiteCount: prereqCountMap.get(m.id) ?? 0,
    }
  })

  // Calculate Overall KPIs
  const totalMechanics = allMechanics.length
  let masteredCount = 0
  let learningCount = 0

  const learningMechanics: ProgressMechanicItem[] = []
  const masteredMechanics: ProgressMechanicItem[] = []

  for (const m of allMechanics) {
    if (m.userStatus === 'mastered') {
      masteredCount++
      masteredMechanics.push(m)
    } else if (m.userStatus === 'learning') {
      learningCount++
      learningMechanics.push(m)
    }
  }

  // Sort learning and mastered by rank sort_order then difficulty
  const sortMechanics = (a: ProgressMechanicItem, b: ProgressMechanicItem) => {
    const orderA = a.rank?.sort_order ?? 999
    const orderB = b.rank?.sort_order ?? 999
    if (orderA !== orderB) return orderA - orderB
    return a.difficulty - b.difficulty
  }
  learningMechanics.sort(sortMechanics)
  masteredMechanics.sort(sortMechanics)

  const unstartedCount = Math.max(0, totalMechanics - masteredCount - learningCount)
  const completionPercentage =
    totalMechanics > 0 ? Math.round((masteredCount / totalMechanics) * 100) : 0

  // Calculate Rank Breakdown
  const rankProgress: RankProgressItem[] = ranksList.map((rank) => {
    const mechanicsInRank = allMechanics.filter((m) => m.recommended_rank_id === rank.id)
    const rankTotal = mechanicsInRank.length
    const rankMastered = mechanicsInRank.filter((m) => m.userStatus === 'mastered').length
    const rankLearning = mechanicsInRank.filter((m) => m.userStatus === 'learning').length
    const rankUnstarted = Math.max(0, rankTotal - rankMastered - rankLearning)
    const rankPct = rankTotal > 0 ? Math.round((rankMastered / rankTotal) * 100) : 0

    return {
      rankId: rank.id,
      rankName: rank.name,
      sortOrder: rank.sort_order,
      totalMechanics: rankTotal,
      masteredCount: rankMastered,
      learningCount: rankLearning,
      unstartedCount: rankUnstarted,
      percentage: rankPct,
    }
  })

  // Calculate Category Breakdown
  const categoryGroups = new Map<string, ProgressMechanicItem[]>()
  for (const m of allMechanics) {
    const key = m.category || 'general'
    if (!categoryGroups.has(key)) {
      categoryGroups.set(key, [])
    }
    categoryGroups.get(key)!.push(m)
  }

  const categoryProgress: CategoryProgressItem[] = Array.from(categoryGroups.entries())
    .map(([catKey, items]) => {
      const catTotal = items.length
      const catMastered = items.filter((m) => m.userStatus === 'mastered').length
      const catLearning = items.filter((m) => m.userStatus === 'learning').length
      const catUnstarted = Math.max(0, catTotal - catMastered - catLearning)
      const catPct = catTotal > 0 ? Math.round((catMastered / catTotal) * 100) : 0

      return {
        categoryKey: catKey,
        categoryName: formatCategoryName(catKey),
        totalMechanics: catTotal,
        masteredCount: catMastered,
        learningCount: catLearning,
        unstartedCount: catUnstarted,
        percentage: catPct,
      }
    })
    .sort((a, b) => b.totalMechanics - a.totalMechanics)

  // Current rank object of user
  let userRankObj: Rank | null = null
  const rawUserRank = profile?.ranks as unknown
  if (Array.isArray(rawUserRank)) {
    userRankObj = rawUserRank[0] as Rank || null
  } else if (rawUserRank && typeof rawUserRank === 'object') {
    userRankObj = rawUserRank as Rank
  }

  const username =
    profile?.username || user.email?.split('@')[0] || 'Rocket Player'

  return {
    user: {
      id: user.id,
      email: user.email,
      username,
      currentRank: userRankObj,
    },
    kpi: {
      totalMechanics,
      masteredCount,
      learningCount,
      unstartedCount,
      completionPercentage,
    },
    rankProgress,
    categoryProgress,
    learningMechanics,
    masteredMechanics,
  }
}
