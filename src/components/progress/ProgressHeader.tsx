import Link from 'next/link'
import { RankBadge } from '@/components/profile/RankBadge'
import type { Rank } from '@/types/database.types'
import { Compass } from 'lucide-react'
import { LocalPlayerName } from '@/components/profile/LocalPlayerName'

interface ProgressHeaderProps {
  userId: string
  username: string
  currentRank: Rank | null
}

export function ProgressHeader({ userId, username, currentRank }: ProgressHeaderProps) {

  return (
    <div className="rl-card p-6 sm:p-8 border-slate-800 bg-slate-900/60">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {/* Rank Badge & Callout */}
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/profile"
              className="inline-flex rounded-md hover:opacity-90"
              title="Change your rank in Player Profile"
            >
              <RankBadge rankName={currentRank?.name} />
            </Link>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-medium">Player Arsenal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
            <LocalPlayerName userId={userId} fallback={username} />
          </h1>

          <p className="text-sm sm:text-base text-slate-400 mt-1">
            Your Training Arsenal & Progression
          </p>
        </div>

        {/* Action Link to Catalog */}
        <div className="flex items-center gap-3">
          <Link
            href="/mechanics"
            className="rl-btn-ghost text-xs !py-2.5 !px-4 hover:border-slate-700"
          >
            <Compass className="w-4 h-4 text-accent" />
            <span>Explore All Mechanics</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
