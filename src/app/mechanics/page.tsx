import type { Metadata } from 'next'
import { getMechanicsCatalog } from '@/lib/data/mechanics'
import { createClient } from '@/lib/supabase/server'
import { MechanicsCatalog } from '@/components/mechanics/MechanicsCatalog'
import {
  Compass,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Rocket League Mechanics Catalog | Skill Trees & Training Codes',
  description:
    'Explore the complete directory of Rocket League mechanics, categorized by difficulty, competitive rank, and skill tree prerequisites. Track your mastery.',
}

export default async function MechanicsPage() {
  const supabase = await createClient()

  // 1. Fetch mechanics catalog and ranks list concurrently
  const [catalog, ranksResult] = await Promise.all([
    getMechanicsCatalog(),
    supabase
      .from('ranks')
      .select('id, name, sort_order')
      .order('sort_order', { ascending: true }),
  ])

  const ranks = ranksResult.data || []

  // Check user session for personalized stats
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const totalMechanics = catalog.length
  const masteredCount = catalog.filter((m) => m.userStatus === 'mastered').length
  const learningCount = catalog.filter((m) => m.userStatus === 'learning').length
  const completionRate =
    totalMechanics > 0 ? Math.round((masteredCount / totalMechanics) * 100) : 0

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header Banner */}
      <div className="rl-card p-6 sm:p-8 relative overflow-hidden border-slate-800">
        {/* Stadium ambient light blobs */}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-bold uppercase tracking-wider text-accent mb-3">
              <Compass className="w-3.5 h-3.5 text-accent" />
              <span>RL Competitive Curriculum</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Mechanics library</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
              Rocket League <span className="text-accent">Mechanics Catalog</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Explore car control, flips, pinches, and aerial techniques. Browse
              by competitive rank, inspect prerequisite dependency trees, copy custom training pack
              codes, and track your personal mastery progression.
            </p>
            <p className="mt-3 text-sm text-muted">Suggested ranks are editorial learning guidelines, not requirements for ranking up.</p>
          </div>

          {/* Player Progress Stats Card */}
          <div className="w-full lg:w-auto p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between min-w-0 lg:min-w-[240px] shrink-0">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {user ? 'Your Arsenal Mastery' : 'Curriculum Stats'}
              </span>
              <span className="text-xs font-black text-accent">
                {user ? `${completionRate}% Complete` : `${totalMechanics} Total`}
              </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-success transition-all duration-700"
                style={{ width: `${user ? completionRate : 100}%` }}
              />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-base font-black text-white block">{totalMechanics}</span>
                <span className="text-xs uppercase font-bold text-slate-500">Total</span>
              </div>

              <div className="p-2 rounded-xl bg-success/10 border border-success/30">
                <span className="text-base font-black text-success block">{masteredCount}</span>
                <span className="text-xs uppercase font-bold text-success/80">Done</span>
              </div>

              <div className="p-2 rounded-xl bg-progress/10 border border-progress/30">
                <span className="text-base font-black text-progress block">{learningCount}</span>
                <span className="text-xs uppercase font-bold text-progress/80">Learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Catalog */}
      <MechanicsCatalog initialMechanics={catalog} ranks={ranks} />
    </div>
  )
}
