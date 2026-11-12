export const highlights = [
  { video: '/media/highlight-1.mp4', source: 'https://tenor.com/view/mustard-flick-rocket-league-rl-clip-gif-17812876926335918190' },
  { video: '/media/highlight-2.mp4', source: 'https://tenor.com/view/rocket-league-gif-23920878' },
  { video: '/media/highlight-3.mp4', source: 'https://tenor.com/view/rocket-league-gif-11402637139491905335' },
  { video: '/media/highlight-4.mp4', source: 'https://tenor.com/view/rocket-league-musty-flick-musty-flip-reset-reset-gif-10815203066088994654' },
  { video: '/media/highlight-5.mp4', source: 'https://tenor.com/view/rocket-league-gif-13942045968203875427' },
] as const

export function chooseHighlight(previous: string | null, random = Math.random()) {
  const candidates = highlights.filter(clip => clip.video !== previous)
  return candidates[Math.min(candidates.length - 1, Math.max(0, Math.floor(random * candidates.length)))]
}
