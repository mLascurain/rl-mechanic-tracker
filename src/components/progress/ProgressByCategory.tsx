import type { CategoryProgressItem } from '@/lib/data/progress'
import { Layers } from 'lucide-react'

interface ProgressByCategoryProps {
  categoryProgress: CategoryProgressItem[]
}

export function ProgressByCategory({ categoryProgress }: ProgressByCategoryProps) {
  return (
    <div className="rl-card p-5 sm:p-6 border-slate-800 bg-slate-900/60 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <h2 className="text-base font-bold uppercase tracking-tight text-white">
            Progress by Category
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Domain competencies
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {categoryProgress.map((cat) => {
          return (
            <div
              key={cat.categoryKey}
              className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                    {cat.categoryName}
                  </h3>
                  <span className="text-xs font-mono font-bold text-accent">
                    {cat.percentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                  <span>
                    <strong className="text-slate-200">{cat.masteredCount}</strong> of{' '}
                    {cat.totalMechanics} Done
                  </span>
                  {cat.learningCount > 0 && (
                    <span className="text-progress font-medium text-xs">
                      {cat.learningCount} learning
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-success transition-all duration-300"
                  style={{ width: `${cat.percentage}%` }}
                />
                {cat.totalMechanics > 0 && cat.learningCount > 0 && (
                  <div
                    className="h-full bg-progress transition-all duration-300"
                    style={{
                      width: `${Math.round((cat.learningCount / cat.totalMechanics) * 100)}%`,
                    }}
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
