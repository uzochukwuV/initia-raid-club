"use client"

import { mockSportEvents } from "@/lib/game/data"
import { MatchGroups } from "@/components/match-groups"
import type { SportEvent } from "@/lib/game/types"

type MarketsPageProps = {
  onOddsClick: (matchId: number, outcome: 0 | 1 | 2) => void
}

export function MarketsPage({ onOddsClick }: MarketsPageProps) {
  // Group matches by sport
  const grouped = mockSportEvents.reduce(
    (acc, match) => {
      const existingGroup = acc.find((g) => g.league === match.sport)
      if (existingGroup) {
        existingGroup.matches.push(match)
      } else {
        acc.push({ league: match.sport, matches: [match] })
      }
      return acc
    },
    [] as Array<{ league: string; matches: SportEvent[] }>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">All Markets</h1>
        <p className="text-gray-600">{mockSportEvents.length} upcoming matches</p>
      </div>

      <MatchGroups groups={grouped} onOddsClick={onOddsClick} />
    </div>
  )
}
