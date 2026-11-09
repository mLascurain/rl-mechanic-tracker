import Link from 'next/link'
import { Compass, Sparkles } from 'lucide-react'

export function ProgressEmptyState() {
  return (
    <div className="rl-card p-8 sm:p-12 border-slate-800 bg-slate-900/60 text-center flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-accent">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="max-w-md">
        <h3 className="text-xl font-bold uppercase tracking-tight text-white">
          Begin Your Mechanic Arsenal
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          You haven&apos;t marked any mechanics as <strong className="text-progress">Learning</strong> or{' '}
          <strong className="text-success">Done</strong> yet. Jump into the mechanics catalog,
          explore prerequisite paths for your rank, and start tracking your skill milestones.
        </p>
      </div>

      <Link
        href="/mechanics"
        className="rl-btn-cyan text-xs !py-3 !px-6 mt-2 inline-flex items-center gap-2"
      >
        <Compass className="w-4 h-4" />
        <span>Explore Mechanics Catalog</span>
      </Link>
    </div>
  )
}
