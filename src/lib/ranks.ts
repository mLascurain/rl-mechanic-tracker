export interface RankInfo { id: string; name: string; sort_order: number }

export interface RankVisualConfig {
  tier: string
  label: string
  color: string
  accentColor: string
  icon: string
  badgeClass: string
  borderColor: string
  bgColor: string
  borderClass: string
  summary: string
}

// UI accents follow the original emblem hues; these are not official color specs.
const TIERS = {
  bronze: { tier: 'Bronze', color: '#D7A568', summary: 'Build a reliable foundation, one mechanic at a time.' },
  silver: { tier: 'Silver', color: '#B9C9DF', summary: 'Turn the fundamentals into consistent, repeatable habits.' },
  gold: { tier: 'Gold', color: '#F0CA62', summary: 'Find the next step in your mechanics practice.' },
  platinum: { tier: 'Platinum', color: '#80D5E8', summary: 'Give your practice a clear direction.' },
  diamond: { tier: 'Diamond', color: '#7DA8FF', summary: 'Connect the skills you know with the ones you want to learn.' },
  champion: { tier: 'Champion', color: '#C39AF6', summary: 'Build control through deliberate, focused practice.' },
  'grand-champion-i': { tier: 'Grand Champion', color: '#FF8594', summary: 'Refine your mechanics and follow the next challenge.' },
  'grand-champion-ii': { tier: 'Grand Champion', color: '#FF8594', summary: 'Refine your mechanics and follow the next challenge.' },
  'grand-champion-iii': { tier: 'Grand Champion', color: '#FF8594', summary: 'Refine your mechanics and follow the next challenge.' },
  'supersonic-legend': { tier: 'Supersonic Legend', color: '#E8DFFC', summary: 'Keep exploring. There is always another skill to refine.' },
  unranked: { tier: 'Unranked', color: '#AEB6C2', summary: 'Choose your current rank to personalize your learning path.' },
} as const

export function getRankVisuals(rankName?: string | null): RankVisualConfig {
  const name = rankName?.toLowerCase().trim() ?? ''
  let key: keyof typeof TIERS = 'unranked'
  if (name.includes('supersonic legend') || name === 'ssl') key = 'supersonic-legend'
  else if (name.includes('grand champion')) key = name.endsWith('iii') ? 'grand-champion-iii' : name.endsWith('ii') ? 'grand-champion-ii' : 'grand-champion-i'
  else if (name.includes('champion')) key = 'champion'
  else if (name.includes('diamond')) key = 'diamond'
  else if (name.includes('platinum')) key = 'platinum'
  else if (name.includes('gold')) key = 'gold'
  else if (name.includes('silver')) key = 'silver'
  else if (name.includes('bronze')) key = 'bronze'
  const config = TIERS[key]
  return {
    ...config,
    label: rankName || 'Unranked',
    accentColor: config.color,
    icon: `/ranks/${key}.png`,
    badgeClass: 'bg-surface-raised text-foreground border-border',
    borderColor: 'border-border',
    bgColor: 'bg-surface-raised',
    borderClass: 'border-border hover:border-muted',
  }
}
