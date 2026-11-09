import type { RankProgressItem } from '@/lib/data/progress'
import { RankBadge } from '@/components/profile/RankBadge'
import { Trophy } from 'lucide-react'

interface ProgressByRankProps {
  rankProgress: RankProgressItem[]
}

export function ProgressByRank({ rankProgress }: ProgressByRankProps) {
  return (
    <div className="rl-card p-5 sm:p-6 border-slate-800 bg-slate-900/60 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          <h2 className="text-base font-bold uppercase tracking-tight text-white">
            Progress by Rank
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Recommended mechanics completed
        </span>
      </div>

      <div className="space-y-4">
        {rankProgress.map((item) => {
          const isComplete = item.totalMechanics > 0 && item.masteredCount === item.totalMechanics

          return (
            <div
              key={item.rankId}
              className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                {/* Rank Badge and Title */}
                <div className="flex items-center gap-2.5">
                  <RankBadge rankName={item.rankName} />
                  {isComplete && (
                    <span className="text-xs uppercase font-bold text-success bg-success/10 border border-success/40 px-2 py-0.5 rounded">
                      Done
                    </span>
                  )}
                </div>

                {/* Counts & Percentage */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">
                    <strong className="text-white font-semibold">{item.masteredCount}</strong>
                    <span className="text-slate-500"> / {item.totalMechanics} Done</span>
                  </span>

                  {item.learningCount > 0 && (
                    <span className="text-progress text-xs font-medium">
                      ({item.learningCount} learning)
                    </span>
                  )}

                  <span className="font-mono font-bold text-slate-200 min-w-[3rem] text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                {/* Done portion */}
                <div
                  className="h-full bg-success transition-all duration-300"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                  title={`${item.masteredCount} Done (${item.percentage}%)`}
                />
                {/* Learning portion */}
                {item.totalMechanics > 0 && item.learningCount > 0 && (
                  <div
                    className="h-full bg-progress transition-all duration-300"
                    style={{
                      width: `${Math.round((item.learningCount / item.totalMechanics) * 100)}%`,
                    }}
                    title={`${item.learningCount} In Training`}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
