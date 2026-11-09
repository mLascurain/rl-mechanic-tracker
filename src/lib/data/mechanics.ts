import { createClient } from '@/lib/supabase/server'
import type { MechanicStatus, Rank } from '@/types/database.types'

export type { MechanicStatus }

export interface MechanicCatalogItem {
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

export interface RelatedMechanic {
  id: string
  slug: string
  name: string
  difficulty: number
  category: string | null
  rank: Rank | null
  userStatus: MechanicStatus | null
}

export interface MechanicResourceItem {
  id: string
  mechanic_id: string
  type: 'video' | 'map_code'
  title: string | null
  video_url: string | null
  map_code: string | null
}

export interface MechanicDetail {
  id: string
  slug: string
  name: string
  description: string | null
  category: string | null
  difficulty: number
  recommended_rank_id: string | null
  rank: Rank | null
  userStatus: MechanicStatus | null
  prerequisites: RelatedMechanic[]
  unlocks: RelatedMechanic[]
  resources: MechanicResourceItem[]
}

/**
 * Fetches all mechanics from `mechanics` joined with `ranks (id, name, sort_order)`.
 * If the user is logged in, fetches user's `user_mechanics` status and maps it.
 * Computes prerequisite counts for each mechanic.
 * Returns a typed array of mechanics.
 */
export async function getMechanicsCatalog(): Promise<MechanicCatalogItem[]> {
  const supabase = await createClient()

  // 1. Check user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. Fetch mechanics joined with ranks
  const { data: mechanics, error: mechanicsError } = await supabase
    .from('mechanics')
    .select(`
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
    `)

  if (mechanicsError || !mechanics) {
    console.error('Error fetching mechanics catalog:', mechanicsError?.message)
    return []
  }

  // 3. Fetch all prerequisite edges to count prerequisites per mechanic
  const { data: prereqRows } = await supabase
    .from('mechanic_prerequisites')
    .select('mechanic_id')

  const prereqCountMap = new Map<string, number>()
  if (prereqRows) {
    for (const row of prereqRows) {
      prereqCountMap.set(row.mechanic_id, (prereqCountMap.get(row.mechanic_id) || 0) + 1)
    }
  }

  // 4. If user is logged in, fetch user's mechanic statuses
  const userStatusMap = new Map<string, MechanicStatus>()
  if (user) {
    const { data: userMechanics } = await supabase
      .from('user_mechanics')
      .select('mechanic_id, status')
      .eq('user_id', user.id)

    if (userMechanics) {
      for (const item of userMechanics) {
        if (item.status === 'learning' || item.status === 'mastered') {
          userStatusMap.set(item.mechanic_id, item.status)
        }
      }
    }
  }

  // 5. Map into typed catalog items
  const catalog: MechanicCatalogItem[] = mechanics.map((m) => {
    const rank = m.ranks as Rank | null
    return {
      id: m.id,
      slug: m.slug,
      name: m.name,
      description: m.description,
      category: m.category,
      difficulty: m.difficulty,
      recommended_rank_id: m.recommended_rank_id,
      rank,
      userStatus: userStatusMap.get(m.id) ?? null,
      prerequisiteCount: prereqCountMap.get(m.id) ?? 0,
    }
  })

  // Sort by rank sort_order ascending (nulls last), then difficulty ascending, then name ascending
  catalog.sort((a, b) => {
    const rankOrderA = a.rank?.sort_order ?? 999
    const rankOrderB = b.rank?.sort_order ?? 999
    if (rankOrderA !== rankOrderB) return rankOrderA - rankOrderB
    if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty
    return a.name.localeCompare(b.name)
  })

  return catalog
}

/**
 * Fetches single mechanic by slug with:
 * - Recommended rank info
 * - Required prerequisites (joined through mechanic_prerequisites where mechanic_id = current.id)
 * - Unlocks / "Desbloquea" (joined through mechanic_prerequisites where prerequisite_id = current.id)
 * - Resources (videos and custom training map codes)
 * - Current user status for this mechanic and prerequisites
 */
export async function getMechanicDetail(slug: string): Promise<MechanicDetail | null> {
  if (!slug) return null

  const supabase = await createClient()

  // 1. Fetch mechanic by slug joined with ranks (*)
  const { data: mechanic, error: mechanicError } = await supabase
    .from('mechanics')
    .select(`
      id,
      slug,
      name,
      description,
      category,
      difficulty,
      recommended_rank_id,
      ranks (*)
    `)
    .eq('slug', slug)
    .maybeSingle()

  if (mechanicError || !mechanic) {
    if (mechanicError) {
      console.error(`Error fetching mechanic by slug ${slug}:`, mechanicError.message)
    }
    return null
  }

  // 2. Fetch required prerequisites: mechanic_prerequisites where mechanic_id = mechanic.id
  const { data: prereqLinks, error: prereqError } = await supabase
    .from('mechanic_prerequisites')
    .select(`
      prerequisite:mechanics!mechanic_prerequisites_prerequisite_id_fkey (
        id,
        slug,
        name,
        difficulty,
        category,
        ranks (*)
      )
    `)
    .eq('mechanic_id', mechanic.id)

  if (prereqError) {
    console.error('Error fetching prerequisites:', prereqError.message)
  }

  // 3. Fetch unlocked mechanics ("Desbloquea"): mechanic_prerequisites where prerequisite_id = mechanic.id
  const { data: unlockLinks, error: unlockError } = await supabase
    .from('mechanic_prerequisites')
    .select(`
      unlocked:mechanics!mechanic_prerequisites_mechanic_id_fkey (
        id,
        slug,
        name,
        difficulty,
        category,
        ranks (*)
      )
    `)
    .eq('prerequisite_id', mechanic.id)

  if (unlockError) {
    console.error('Error fetching unlocks:', unlockError.message)
  }

  // 4. Fetch resources for this mechanic
  const { data: resourcesData, error: resourcesError } = await supabase
    .from('mechanic_resources')
    .select('id, mechanic_id, type, title, video_url, map_code')
    .eq('mechanic_id', mechanic.id)

  if (resourcesError) {
    console.error('Error fetching resources:', resourcesError.message)
  }

  // 5. Gather all relevant IDs to query user statuses if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userStatusMap = new Map<string, MechanicStatus>()

  if (user) {
    const relevantIds: string[] = [mechanic.id]

    if (prereqLinks) {
      for (const item of prereqLinks) {
        const prereq = item.prerequisite as { id: string } | null
        if (prereq?.id) relevantIds.push(prereq.id)
      }
    }

    if (unlockLinks) {
      for (const item of unlockLinks) {
        const unlocked = item.unlocked as { id: string } | null
        if (unlocked?.id) relevantIds.push(unlocked.id)
      }
    }

    const { data: userMechanics } = await supabase
      .from('user_mechanics')
      .select('mechanic_id, status')
      .eq('user_id', user.id)
      .in('mechanic_id', relevantIds)

    if (userMechanics) {
      for (const um of userMechanics) {
        if (um.status === 'learning' || um.status === 'mastered') {
          userStatusMap.set(um.mechanic_id, um.status)
        }
      }
    }
  }

  // Format prerequisites
  type JoinedMechanic = {
    id: string
    slug: string
    name: string
    difficulty: number
    category: string | null
    ranks: Rank | null
  }

  const prerequisites: RelatedMechanic[] = (prereqLinks || [])
    .map((item) => {
      const p = item.prerequisite as unknown as JoinedMechanic | null
      if (!p) return null
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        difficulty: p.difficulty,
        category: p.category,
        rank: p.ranks,
        userStatus: userStatusMap.get(p.id) ?? null,
      }
    })
    .filter((p): p is RelatedMechanic => p !== null)

  // Format unlocks
  const unlocks: RelatedMechanic[] = (unlockLinks || [])
    .map((item) => {
      const u = item.unlocked as unknown as JoinedMechanic | null
      if (!u) return null
      return {
        id: u.id,
        slug: u.slug,
        name: u.name,
        difficulty: u.difficulty,
        category: u.category,
        rank: u.ranks,
        userStatus: userStatusMap.get(u.id) ?? null,
      }
    })
    .filter((u): u is RelatedMechanic => u !== null)

  // Format resources
  const resources: MechanicResourceItem[] = (resourcesData || []).map((r) => ({
    id: r.id,
    mechanic_id: r.mechanic_id,
    type: r.type as 'video' | 'map_code',
    title: r.title,
    video_url: r.video_url,
    map_code: r.map_code,
  }))

  return {
    id: mechanic.id,
    slug: mechanic.slug,
    name: mechanic.name,
    description: mechanic.description,
    category: mechanic.category,
    difficulty: mechanic.difficulty,
    recommended_rank_id: mechanic.recommended_rank_id,
    rank: mechanic.ranks as Rank | null,
    userStatus: userStatusMap.get(mechanic.id) ?? null,
    prerequisites,
    unlocks,
    resources,
  }
}
