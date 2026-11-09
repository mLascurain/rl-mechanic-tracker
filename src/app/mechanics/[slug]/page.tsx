import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getMechanicDetail } from '@/lib/data/mechanics'
import { RankBadge } from '@/components/profile/RankBadge'
import { MechanicStatusToggle } from '@/components/mechanics/MechanicStatusToggle'
import { PrerequisiteSection } from '@/components/mechanics/PrerequisiteSection'
import { ResourceEmbeds } from '@/components/mechanics/ResourceEmbeds'
import {
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

const difficultyLabels: Record<
  number,
  { label: string; bg: string; text: string; description: string }
> = {
  1: {
    label: 'Basic',
    bg: 'bg-progress',
    text: 'text-progress',
    description: 'Foundational mechanic. Essential for consistent gameplay and recoveries.',
  },
  2: {
    label: 'Intermediate',
    bg: 'bg-primary',
    text: 'text-accent',
    description: 'Core competitive skill required to climb through Gold and Platinum ranks.',
  },
  3: {
    label: 'Advanced',
    bg: 'bg-progress',
    text: 'text-progress',
    description: 'Complex execution requiring precise air-roll, aerial reads, or momentum cancels.',
  },
  4: {
    label: 'Expert',
    bg: 'bg-progress',
    text: 'text-progress',
    description: 'High-level technique prevalent in Champion and Grand Champion lobbies.',
  },
  5: {
    label: 'Pro',
    bg: 'bg-secondary',
    text: 'text-secondary',
    description: 'Apex technical execution. Demands pixel-perfect timing and high mechanical dexterity.',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const mechanic = await getMechanicDetail(slug)

  if (!mechanic) {
    return {
      title: 'Mechanic Not Found | RL Mechanic Tracker',
      description: 'The requested Rocket League mechanic could not be found.',
    }
  }

  return {
    title: `${mechanic.name} | Rocket League Mechanic Guide`,
    description:
      mechanic.description ||
      `Master ${mechanic.name} in Rocket League. Step-by-step prerequisites, custom training pack codes, and video tutorials.`,
  }
}

export default async function MechanicDetailPage({ params }: PageProps) {
  const { slug } = await params
  const mechanic = await getMechanicDetail(slug)

  if (!mechanic) {
    notFound()
  }

  const diffInfo = difficultyLabels[mechanic.difficulty] || difficultyLabels[2]

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Breadcrumb Navigation & Back Link */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Breadcrumb Path */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/mechanics" className="hover:text-accent transition-colors">
            Mechanics
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          {mechanic.category && (
            <>
              <span className="uppercase text-slate-500">
                {mechanic.category.replace(/_/g, ' ')}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </>
          )}
          <span className="text-white font-semibold">{mechanic.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/mechanics"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-accent px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Hero Banner Card */}
      <div className="rl-card p-6 sm:p-8 relative overflow-hidden border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Column: Mechanic Details */}
          <div className="max-w-3xl space-y-4">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-800/90 text-accent border border-slate-700/80">
                {mechanic.category ? mechanic.category.replace(/_/g, ' ') : 'General'}
              </span>

              <RankBadge rankName={mechanic.rank?.name} />

              {mechanic.prerequisites.length === 0 && (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-progress/10 text-progress border border-progress/50 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Foundation Skill</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              {mechanic.name}
            </h1>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal w-150">
              {mechanic.description ||
                'Mastering this technique gives you superior recovery speed, offensive unpredictability, and ball trajectory control.'}
            </p>

            {/* Difficulty Meter */}
            <div className="pt-4 border-t border-slate-800/80 max-w-md">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-400">
                    Difficulty Level
                  </span>
                  <span className={`font-bold ${diffInfo.text}`}>
                    {mechanic.difficulty} / 5 • {diffInfo.label}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isLit = lvl <= mechanic.difficulty
                    return (
                      <div
                        key={lvl}
                        className={`h-2 rounded-sm transition-all duration-200 ${
                          isLit
                            ? diffInfo.bg
                            : 'bg-slate-800/80'
                        }`}
                      />
                    )
                  })}
                </div>

                <p className="text-xs text-slate-400 leading-tight">
                  {diffInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mastery Status Toggle Action */}
          <div className="w-full lg:w-auto p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shrink-0 lg:min-w-[320px]">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                Your Mastery Status
              </span>
              <p className="text-xs text-slate-400 mb-4">
                Record your practice progress to calibrate your skill tree roadmaps.
              </p>
            </div>

            <MechanicStatusToggle
              mechanicId={mechanic.id}
              initialStatus={mechanic.userStatus}
              pathSlug={mechanic.slug}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Section: Prerequisites & Unlocks DAG Grids */}
      <PrerequisiteSection
        prerequisites={mechanic.prerequisites}
        unlocks={mechanic.unlocks}
      />

      {/* Section: Video Tutorials and Custom Training Codes */}
      <ResourceEmbeds
        resources={mechanic.resources}
        mechanicName={mechanic.name}
      />
    </div>
  )
}
