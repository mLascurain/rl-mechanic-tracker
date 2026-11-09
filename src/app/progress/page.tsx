import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserProgressStats } from '@/lib/data/progress'
import { ProgressHeader } from '@/components/progress/ProgressHeader'
import { ProgressKpiGrid } from '@/components/progress/ProgressKpiGrid'
import { ProgressByRank } from '@/components/progress/ProgressByRank'
import { ProgressByCategory } from '@/components/progress/ProgressByCategory'
import { MechanicsPracticeList } from '@/components/progress/MechanicsPracticeList'
import { ProgressEmptyState } from '@/components/progress/ProgressEmptyState'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Progress & Arsenal | RL Mechanic Tracker',
  description:
    'Track your personal mechanic progression, completion by rank, and active training queue.',
}

export default async function ProgressPage() {
  const stats = await getUserProgressStats()

  if (!stats) {
    redirect('/auth/login?redirectTo=/progress')
  }

  const hasActivity = stats.kpi.masteredCount > 0 || stats.kpi.learningCount > 0

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. Header: Player Callout with Rank & Subtitle */}
      <ProgressHeader
        userId={stats.user.id}
        username={stats.user.username}
        currentRank={stats.user.currentRank}
      />

      {/* 2. Overview KPI Cards */}
      <ProgressKpiGrid kpi={stats.kpi} />

      {/* 3. Empty State if no mechanics started yet */}
      {!hasActivity && <ProgressEmptyState />}

      {/* 4. Active Practice List & Done Archive */}
      <MechanicsPracticeList
        initialLearning={stats.learningMechanics}
        initialMastered={stats.masteredMechanics}
      />

      {/* 5. Progress Breakdown by Rank & Category Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Breakdown by Rank */}
        <ProgressByRank rankProgress={stats.rankProgress} />

        {/* Breakdown by Category */}
        <ProgressByCategory categoryProgress={stats.categoryProgress} />
      </div>
    </div>
  )
}
