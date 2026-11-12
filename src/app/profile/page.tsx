import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, CalendarDays, CheckCircle2, CircleDashed, Flame } from 'lucide-react'
import { createClient, getUser } from '@/lib/supabase/server'
import { RankSelector } from '@/components/profile/RankSelector'
import { EditablePlayerName } from '@/components/profile/LocalPlayerName'
import { RankBadge, RankIcon } from '@/components/profile/RankBadge'
import { getRankVisuals } from '@/lib/ranks'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Player Profile | RL Mechanic Tracker', description: 'Your rank, practice progress and next steps.' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await getUser()
  if (!user) redirect('/auth/login?redirectTo=/profile')

  const [profileResult, ranksResult, progressResult, totalResult] = await Promise.all([
    supabase.from('profiles').select('username, current_rank_id').eq('id', user.id).maybeSingle(),
    supabase.from('ranks').select('id, name, sort_order').order('sort_order'),
    supabase.from('user_mechanics').select('mechanic_id, status').eq('user_id', user.id),
    supabase.from('mechanics').select('id', { count: 'exact', head: true }),
  ])
  if ([profileResult, ranksResult, progressResult, totalResult].some(result => result.error)) throw new Error('Your profile could not be loaded. Please try again.')

  const profile = profileResult.data
  const ranks = ranksResult.data ?? []
  const progress = progressResult.data ?? []
  const total = totalResult.count ?? 0
  const done = progress.filter(item => item.status === 'mastered').length
  const learning = progress.filter(item => item.status === 'learning').length
  const remaining = Math.max(0, total - done - learning)
  const percent = total ? Math.round(done / total * 100) : 0
  const currentRank = ranks.find(rank => rank.id === profile?.current_rank_id)
  const visuals = getRankVisuals(currentRank?.name)
  const username = profile?.username || user.email?.split('@')[0] || 'Rocket Player'
  const joined = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header>
        <p className="rl-eyebrow mb-3">Your training space</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Player profile</h1>
        <p className="mt-3 text-sm text-muted sm:text-base">Your rank sets the starting point. Your practice builds the path.</p>
      </header>

      <section className="rl-card overflow-hidden" aria-label="Player identity">
        <div className="profile-identity p-6 sm:p-8" style={{ '--rank-color': visuals.color } as CSSProperties}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="rank-emblem-frame"><RankIcon rankName={currentRank?.name} size={112} /></div>
            <div className="min-w-0 flex-1">
              <RankBadge rankName={currentRank?.name} />
              <EditablePlayerName userId={user.id} fallback={username} />
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                <span className="break-all">{user.email}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays size={14} aria-hidden="true" />Joined {joined}</span>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{visuals.summary}</p>
            </div>
            <Link href="/recommendations" className="rl-btn-cyan self-start sm:self-center">Your learning path<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
          {[{ label: 'Done', value: done, Icon: CheckCircle2, color: 'text-success' }, { label: 'Learning', value: learning, Icon: Flame, color: 'text-progress' }, { label: 'Not started', value: remaining, Icon: CircleDashed, color: 'text-muted' }].map(stat => (
            <div key={stat.label} className="px-3 py-5 sm:px-6">
              <div className={`mb-2 flex items-center gap-2 text-xs sm:text-sm ${stat.color}`}><stat.Icon size={16} aria-hidden="true" /><span>{stat.label}</span></div>
              <p className="font-mono text-2xl font-semibold tabular-nums sm:text-3xl">{stat.value}<span className="ml-1 text-xs font-normal text-muted">/ {total}</span></p>
            </div>
          ))}
        </div>
      </section>

      <section className="rl-card p-6 sm:p-8" aria-labelledby="practice-heading">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h2 id="practice-heading" className="text-lg font-semibold">Your mechanics, in motion</h2><p className="mt-1 text-sm text-muted">{done === 0 ? 'Start with one mechanic and build from there.' : `${done} mechanics marked Done. Keep building consistency.`}</p></div>
          <Link href="/progress" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent">View progress<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="mt-5 flex items-center justify-between text-xs"><span className="text-muted">Catalogue completion</span><span className="font-mono text-success">{percent}%</span></div>
        <div role="progressbar" aria-label="Mechanics marked Done" aria-valuenow={done} aria-valuemin={0} aria-valuemax={Math.max(1, total)} className="mt-2 h-2 overflow-hidden rounded-full bg-surface-raised"><div className="h-full rounded-full bg-success" style={{ width: `${percent}%` }} /></div>
      </section>

      <section className="rl-card p-6 sm:p-8" aria-labelledby="rank-heading">
        <div className="mb-6 max-w-2xl"><p className="rl-eyebrow mb-2">Make it personal</p><h2 id="rank-heading" className="text-xl font-semibold">Choose your current rank</h2><p className="mt-2 text-sm leading-relaxed text-muted">Pick the rank you play at now. We use it with your completed prerequisites to suggest what to practice next. You can change it anytime.</p></div>
        <RankSelector ranks={ranks} currentRankId={profile?.current_rank_id ?? null} />
      </section>
    </div>
  )
}
