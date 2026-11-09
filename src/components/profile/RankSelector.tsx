'use client'

import { useState, useTransition, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Check, Loader2 } from 'lucide-react'
import { updateRank } from '@/app/profile/actions'
import { getRankVisuals, type RankInfo } from '@/lib/ranks'
import { RankIcon } from './RankBadge'

export function RankSelector({ ranks, currentRankId }: { ranks: RankInfo[]; currentRankId: string | null }) {
  const router = useRouter()
  const [selectedRankId, setSelectedRankId] = useState(currentRankId)
  const [pendingRankId, setPendingRankId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null)

  function selectRank(rank: RankInfo) {
    if (rank.id === selectedRankId || isPending) return
    setPendingRankId(rank.id)
    setFeedback(null)
    startTransition(async () => {
      try {
        const result = await updateRank(rank.id)
        setSelectedRankId(rank.id)
        setFeedback({ success: true, message: `Saved ${result.rankName}. Your learning path is ready.` })
        router.refresh()
      } catch (error) {
        setFeedback({ success: false, message: error instanceof Error ? error.message : 'Could not save your rank. Try again.' })
      } finally { setPendingRankId(null) }
    })
  }

  return (
    <div aria-busy={isPending}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ranks.map(rank => {
          const selected = selectedRankId === rank.id
          const pending = pendingRankId === rank.id
          const visuals = getRankVisuals(rank.name)
          return (
            <button key={rank.id} type="button" aria-pressed={selected} disabled={isPending} onClick={() => selectRank(rank)} className={`rank-option ${selected ? 'rank-option-selected' : ''}`} style={{ '--rank-color': visuals.color } as CSSProperties}>
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center" aria-hidden="true">
                {pending ? <Loader2 size={16} className="animate-spin text-accent" /> : selected ? <Check size={16} /> : null}
              </span>
              <RankIcon rankName={rank.name} size={64} />
              <span className="text-sm font-semibold leading-snug">{rank.name}</span>
              <span className="text-[11px] text-muted">{selected ? 'Current rank' : 'Select rank'}</span>
            </button>
          )
        })}
      </div>
      {ranks.length === 0 && <p className="text-sm text-muted">Ranks could not be loaded. Please refresh to try again.</p>}
      <div className="mt-4 min-h-6" role="status" aria-live="polite">
        {feedback && <p className={`flex items-center gap-2 text-sm ${feedback.success ? 'text-success' : 'text-secondary'}`}>{feedback.success ? <Check size={16} aria-hidden="true" /> : <AlertCircle size={16} aria-hidden="true" />}{feedback.message}</p>}
      </div>
    </div>
  )
}
