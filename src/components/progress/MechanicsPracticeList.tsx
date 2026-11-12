'use client'

import { useState } from 'react'
import Link from '@/components/layout/NavigationLink'
import type { ProgressMechanicItem } from '@/lib/data/progress'
import { RankBadge } from '@/components/profile/RankBadge'
import { MechanicStatusToggle } from '@/components/mechanics/MechanicStatusToggle'
import {
  Flame,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react'

interface MechanicsPracticeListProps {
  initialLearning: ProgressMechanicItem[]
  initialMastered: ProgressMechanicItem[]
}

const difficultyLabels: Record<number, { label: string; bg: string; text: string }> = {
  1: { label: 'Basic', bg: 'bg-progress', text: 'text-progress' },
  2: { label: 'Intermediate', bg: 'bg-primary', text: 'text-accent' },
  3: { label: 'Advanced', bg: 'bg-progress', text: 'text-progress' },
  4: { label: 'Expert', bg: 'bg-progress', text: 'text-progress' },
  5: { label: 'Pro', bg: 'bg-secondary', text: 'text-secondary' },
}

export function MechanicsPracticeList({
  initialLearning,
  initialMastered,
}: MechanicsPracticeListProps) {
  const [activeTab, setActiveTab] = useState<'learning' | 'mastered'>('learning')

  const items = activeTab === 'learning' ? initialLearning : initialMastered

  return (
    <div className="rl-card p-5 sm:p-6 border-slate-800 bg-slate-900/60 space-y-6">
      {/* Header and Tab Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold uppercase tracking-tight text-white">
            Arsenal Practice List
          </h2>
          <p className="text-xs text-slate-400">
            Quick status controls and training references
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('learning')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'learning'
                ? 'bg-progress/10 text-progress border border-progress/70'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-progress" />
            <span>Currently Learning ({initialLearning.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mastered')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'mastered'
                ? 'bg-success/10 text-success border border-success/70'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span>Done ({initialMastered.length})</span>
          </button>
        </div>
      </div>

      {/* Mechanics Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {items.map((mechanic) => {

            const diffInfo = difficultyLabels[mechanic.difficulty] || difficultyLabels[2]

            return (
              <div
                key={mechanic.id}
                className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  {/* Badges row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-accent border border-slate-700/60">
                      {mechanic.category ? mechanic.category.replace(/_/g, ' ') : 'General'}
                    </span>

                    <RankBadge rankName={mechanic.rank?.name} />
                  </div>

                  {/* Title */}
                  <Link
                    href={`/mechanics/${mechanic.slug}`}
                    className="block group/link focus-visible:outline-none"
                  >
                    <h3 className="text-base font-semibold tracking-tight text-white group-hover/link:text-accent transition-colors">
                      {mechanic.name}
                    </h3>
                  </Link>

                  {/* Description snippet */}
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                    {mechanic.description || 'Practice timing, aerial touches, and car positioning.'}
                  </p>

                  {/* Difficulty & Prerequisites info */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {/* Difficulty */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">Diff:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`w-2 h-2 rounded-sm ${
                              lvl <= mechanic.difficulty ? diffInfo.bg : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Prereq count */}
                    <div>
                      {mechanic.prerequisiteCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Layers className="w-3 h-3 text-accent" />
                          <span>{mechanic.prerequisiteCount} prereq</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-progress">
                          <Sparkles className="w-3 h-3" />
                          <span>Foundation</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <MechanicStatusToggle
                    mechanicId={mechanic.id}
                    initialStatus={mechanic.userStatus}
                    pathSlug={mechanic.slug}
                    compact={true}
                  />

                  <Link
                    href={`/mechanics/${mechanic.slug}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all shrink-0"
                  >
                    <span>Guide</span>
                    <ArrowRight className="w-3 h-3 text-accent" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty tab state */
        <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
          <p className="text-xs sm:text-sm text-slate-400">
            {activeTab === 'learning'
              ? 'No mechanics currently in your learning queue. Set mechanics to "Learning" from the catalog to follow your daily training regiment!'
              : 'You have not marked any mechanics as Done yet. Keep grinding repetitions in Free Play and celebrate your milestones here!'}
          </p>
          <Link
            href="/mechanics"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Browse Mechanics Catalog</span>
          </Link>
        </div>
      )}
    </div>
  )
}
