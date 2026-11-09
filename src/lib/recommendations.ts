export interface LearningMechanic {
  id: string
  slug: string
  name: string
  difficulty: number
  rankOrder: number | null
  rankName: string | null
}

export interface PrerequisiteEdge {
  mechanic_id: string
  prerequisite_id: string
}

export interface LearningStep {
  mechanic: LearningMechanic
  prerequisites: LearningMechanic[]
  explanation: string
}

/** Pure eligibility calculation; unknown ranks and broken prerequisite links fail closed. */
export function recommendMechanics(
  mechanics: readonly LearningMechanic[],
  edges: readonly PrerequisiteEdge[],
  masteredIds: ReadonlySet<string>,
  currentRankOrder: number,
): LearningStep[] {
  if (!Number.isFinite(currentRankOrder)) return []
  const byId = new Map(mechanics.map((mechanic) => [mechanic.id, mechanic]))
  const prerequisites = new Map<string, string[]>()
  for (const edge of edges) {
    const ids = prerequisites.get(edge.mechanic_id) ?? []
    if (!ids.includes(edge.prerequisite_id)) ids.push(edge.prerequisite_id)
    prerequisites.set(edge.mechanic_id, ids)
  }
  return mechanics
    .filter((mechanic) => !masteredIds.has(mechanic.id)
      && mechanic.rankOrder !== null
      && mechanic.rankOrder <= currentRankOrder + 1
      && (prerequisites.get(mechanic.id) ?? []).every((id) => byId.has(id) && masteredIds.has(id)))
    .sort((a, b) => a.difficulty - b.difficulty
      || a.rankOrder! - b.rankOrder!
      || a.name.localeCompare(b.name)
      || a.id.localeCompare(b.id))
    .map((mechanic) => {
      const required = (prerequisites.get(mechanic.id) ?? []).map((id) => byId.get(id)!)
      const readiness = required.length
        ? `You have mastered ${required.map((item) => item.name).join(', ')}.`
        : 'No prerequisites are required.'
      return {
        mechanic,
        prerequisites: required,
        explanation: `${readiness} Recommended for ${mechanic.rankName ?? 'your rank range'}, within your current rank or one rank above. Difficulty ${mechanic.difficulty}/5.`,
      }
    })
}
