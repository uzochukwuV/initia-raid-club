"use client"

import { mockSportEvents } from "@/lib/game/data"
import { MatchRow } from "@/components/match-row"

type LivePageProps = {
  onOddsClick: (matchId: number, outcome: 0 | 1 | 2) => void
}

export function LivePage({ onOddsClick }: LivePageProps) {
  // Filter for live matches (simulated as all for now)
  const liveMatches = mockSportEvents.slice(0, 2)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2 flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500 animate-pulse" />
          Live Matches
        </h1>
        <p className="text-gray-600">{liveMatches.length} matches in progress</p>
      </div>

      <div className="space-y-3">
        {liveMatches.map((match) => (
          <MatchRow
            key={match.match_id}
            match={match}
            onOddsClick={onOddsClick}
          />
        ))}
      </div>
    </div>
  )
}
