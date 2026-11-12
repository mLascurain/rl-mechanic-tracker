import { RankBadge } from '@/components/profile/RankBadge'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, getUser } from '@/lib/supabase/server'
import { recommendMechanics } from '@/lib/recommendations'
import { LearningPathSteps } from '@/components/mechanics/LearningPathSteps'

export const metadata: Metadata = { title: 'Learning path' }

export default async function RecommendationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await getUser()
  if (!user) redirect('/auth/login?redirectTo=/recommendations')

  const [profile, ranks, mechanics, edges, progress] = await Promise.all([
    supabase.from('profiles').select('current_rank_id').eq('id', user.id).maybeSingle(),
    supabase.from('ranks').select('id, name, sort_order'),
    supabase.from('mechanics').select('id, slug, name, difficulty, recommended_rank_id'),
    supabase.from('mechanic_prerequisites').select('mechanic_id, prerequisite_id'),
    supabase.from('user_mechanics').select('mechanic_id, status').eq('user_id', user.id),
  ])
  const failed = [profile, ranks, mechanics, edges, progress].some((result) => result.error)
  const currentRank = ranks.data?.find((rank) => rank.id === profile.data?.current_rank_id)
  const rankById = new Map(ranks.data?.map((rank) => [rank.id, rank]))
  const mastered = new Set(progress.data?.filter((item) => item.status === 'mastered').map((item) => item.mechanic_id))
  const steps = !failed && currentRank ? recommendMechanics(
    (mechanics.data ?? []).map((mechanic) => {
      const rank = mechanic.recommended_rank_id ? rankById.get(mechanic.recommended_rank_id) : null
      return { ...mechanic, rankOrder: rank?.sort_order ?? null, rankName: rank?.name ?? null }
    }), edges.data ?? [], mastered, currentRank.sort_order,
  ) : []

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-[#FF8A1E]">YOUR NEXT SESSION</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">A clear path forward.</h1>
        <p className="max-w-2xl text-[#AEB6C2]">Build on what you already know. Each step is ready to practice: all prerequisites marked Done, and a recommended rank no more than one rank above yours.</p>
        <p className="text-sm text-muted">Suggested ranks are editorial learning guidelines. Choose the skills that fit your playstyle.</p>
        {currentRank && <div className="flex flex-wrap items-center gap-2 text-sm text-muted"><RankBadge rankName={currentRank.name} /><span className="text-success">{mastered.size} Done</span><span>· {steps.length} ready to learn</span></div>}
      </header>
      {failed ? <div role="alert" className="rl-card p-6">Your learning path could not be loaded. Please try again shortly.</div>
        : !currentRank ? <div className="rl-card space-y-4 p-6"><h2 className="text-xl font-semibold">Start with your current rank</h2><p className="text-[#AEB6C2]">Choose a rank in your profile to get recommendations matched to your level.</p><Link href="/profile" className="rl-btn-cyan">Set my rank</Link></div>
          : steps.length === 0 ? <div className="rl-card space-y-4 p-6"><h2 className="text-xl font-semibold">No new steps are ready yet</h2><p className="text-[#AEB6C2]">Review your progress and prerequisites in the catalog, or update your rank if it has changed.</p><Link href="/mechanics" className="rl-btn-ghost">Explore mechanics</Link></div>
            : <LearningPathSteps key={currentRank.id} steps={steps.map(step => ({ id: step.mechanic.id, slug: step.mechanic.slug, name: step.mechanic.name, explanation: step.explanation }))} />}
    </div>
  )
}
