import Link from '@/components/layout/NavigationLink'
import type { RelatedMechanic } from '@/lib/data/mechanics'
import { RankBadge } from '@/components/profile/RankBadge'
import {
  CheckCircle2,
  Flame,
  Circle,
  Sparkles,
  Trophy,
  ArrowRight,
} from 'lucide-react'

interface PrerequisiteSectionProps {
  prerequisites: RelatedMechanic[]
  unlocks: RelatedMechanic[]
}

function RelatedMechanicCard({
  mechanic,
  relationType,
}: {
  mechanic: RelatedMechanic
  relationType: 'prerequisite' | 'unlock'
}) {


  return (
    <Link
      href={`/mechanics/${mechanic.slug}`}
      className="group block p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-150 relative overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-accent border border-slate-700/60">
          {mechanic.category ? mechanic.category.replace(/_/g, ' ') : 'General'}
        </span>

        <RankBadge rankName={mechanic.rank?.name} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm sm:text-base font-bold uppercase tracking-tight text-white group-hover:text-accent transition-colors">
          {mechanic.name}
        </h4>
        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>

      {/* Metrics Row */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {/* Difficulty pips */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 font-medium mr-1">Diff:</span>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className={`w-2 h-2 rounded-sm ${
                lvl <= mechanic.difficulty
                  ? 'bg-primary'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* User Mastery Status */}
        <div>
          {mechanic.userStatus === 'mastered' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-success/10 text-success border border-success/50">
              <CheckCircle2 className="w-3 h-3 text-success" />
              <span>Done</span>
            </span>
          ) : mechanic.userStatus === 'learning' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-progress/10 text-progress border border-progress/50">
              <Flame className="w-3 h-3 text-progress" />
              <span>Learning</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
              <Circle className="w-2.5 h-2.5 text-slate-500" />
              <span>{relationType === 'prerequisite' ? 'Required' : 'Locked'}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function PrerequisiteSection({
  prerequisites,
  unlocks,
}: PrerequisiteSectionProps) {
  return (
    <div className="space-y-8">
      {/* 1. Required Prerequisites Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <span>Required Prerequisites</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {prerequisites.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Foundational mechanics you should master before practicing this technique.
              </p>
            </div>
          </div>
        </div>

        {prerequisites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {prerequisites.map((prereq) => (
              <RelatedMechanicCard
                key={prereq.id}
                mechanic={prereq}
                relationType="prerequisite"
              />
            ))}
          </div>
        ) : (
          <div className="rl-card p-5 border-slate-800/80 bg-slate-900/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-progress/10 border border-progress/40 flex items-center justify-center text-progress shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                No Prerequisites Required
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                This is a cornerstone foundation mechanic — perfect to start practicing right away
                with zero skill tree barriers!
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 2. Unlocks Advanced Mechanics Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <span>Unlocks Advanced Mechanics</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {unlocks.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Techniques and advanced maneuvers that become directly accessible once you master this
                mechanic.
              </p>
            </div>
          </div>
        </div>

        {unlocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unlocks.map((unlocked) => (
              <RelatedMechanicCard
                key={unlocked.id}
                mechanic={unlocked}
                relationType="unlock"
              />
            ))}
          </div>
        ) : (
          <div className="rl-card p-5 border-slate-800/80 bg-slate-900/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/40 flex items-center justify-center text-secondary shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                Pinnacle Mechanic
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                The apex of this skill tree! Mastering this mechanic marks advanced execution with
                no further direct mechanical dependencies.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
