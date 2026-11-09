'use client'

import Link from 'next/link'
import type { MechanicCatalogItem } from '@/lib/data/mechanics'
import { RankBadge } from '@/components/profile/RankBadge'
import { MechanicStatusToggle } from './MechanicStatusToggle'
import {
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

interface MechanicCardProps {
  mechanic: MechanicCatalogItem
}

const difficultyLabels: Record<number, { label: string; bg: string; text: string }> = {
  1: { label: 'Basic', bg: 'bg-progress', text: 'text-progress' },
  2: { label: 'Intermediate', bg: 'bg-primary', text: 'text-accent' },
  3: { label: 'Advanced', bg: 'bg-progress', text: 'text-progress' },
  4: { label: 'Expert', bg: 'bg-progress', text: 'text-progress' },
  5: { label: 'Pro', bg: 'bg-secondary', text: 'text-secondary' },
}

export function MechanicCard({ mechanic }: MechanicCardProps) {

  const diffInfo = difficultyLabels[mechanic.difficulty] || difficultyLabels[2]

  return (
    <div
      className="group relative rl-card rl-card-interactive p-5 flex flex-col justify-between border-slate-800 bg-slate-900/60 transition-all duration-150 hover:border-slate-700 hover:bg-slate-900/80"
    >
      {/* Main card body */}
      <div>
        {/* Header Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Category Pill */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold tracking-wider uppercase bg-slate-800/80 text-accent border border-slate-700/60">
            {mechanic.category ? mechanic.category.replace(/_/g, ' ') : 'General'}
          </span>

          {/* Recommended Rank Badge */}
          <RankBadge rankName={mechanic.rank?.name} />
        </div>

        {/* Mechanic Name */}
        <Link
          href={`/mechanics/${mechanic.slug}`}
          className="block group/link focus-visible:outline-none"
        >
          <h3 className="text-lg font-semibold tracking-tight text-white group-hover/link:text-accent transition-colors">
            {mechanic.name}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
          {mechanic.description || 'Master the timing, aerial touches, and car positioning for this technique.'}
        </p>

        {/* Metrics: Difficulty (Clean & Sleek) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-400">Difficulty</span>
              <span className={`font-semibold ${diffInfo.text}`}>
                {mechanic.difficulty}/5 • {diffInfo.label}
              </span>
            </div>

            {/* 5-pip segments */}
            <div className="grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map((level) => {
                const isLit = level <= mechanic.difficulty
                return (
                  <div
                    key={level}
                    className={`h-1.5 rounded-sm transition-all duration-200 ${
                      isLit
                        ? diffInfo.bg
                        : 'bg-slate-800/80'
                    }`}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Prerequisites Badge */}
        <div className="mt-3 flex items-center justify-between text-xs">
          {mechanic.prerequisiteCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
              <Layers className="w-3.5 h-3.5 text-accent" />
              <span>
                {mechanic.prerequisiteCount}{' '}
                {mechanic.prerequisiteCount === 1 ? 'Prerequisite' : 'Prerequisites'}
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-progress/90 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-progress" />
              <span>Starter mechanic</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Interactive Status Toggle & Detail Link */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        {/* Direct interactive status toggle */}
        <div className="relative z-10">
          <MechanicStatusToggle
            mechanicId={mechanic.id}
            initialStatus={mechanic.userStatus}
            pathSlug={mechanic.slug}
            compact={true}
          />
        </div>

        {/* Details Arrow Link */}
        <Link
          href={`/mechanics/${mechanic.slug}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 border border-slate-700/60 transition-all shrink-0"
        >
          <span>Details</span>
          <ArrowRight className="w-3 h-3 text-accent group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
