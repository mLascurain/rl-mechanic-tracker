import Image from 'next/image'
import type { CSSProperties } from 'react'
import { getRankVisuals } from '@/lib/ranks'

interface RankProps { rankName?: string | null; className?: string }

export function RankIcon({ rankName, size = 24, decorative = true, className = '' }: RankProps & { size?: number; decorative?: boolean }) {
  const rank = getRankVisuals(rankName)
  return <Image src={rank.icon} alt={decorative ? '' : `${rank.label} emblem`} width={size} height={size} unoptimized className={`shrink-0 object-contain ${className}`} style={{ width: size, height: size }} />
}

export function RankBadge({ rankName, className = '' }: RankProps) {
  const rank = getRankVisuals(rankName)
  return (
    <span className={`rank-badge ${className}`} style={{ '--rank-color': rank.color } as CSSProperties}>
      <RankIcon rankName={rankName} size={22} />
      <span>{rank.label}</span>
    </span>
  )
}
