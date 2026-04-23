"use client"

import { useState } from "react"
import type { SportEvent } from "@/lib/game/types"
import { MatchRow } from "./match-row"

type LeagueGroup = {
  league: string
  matches: SportEvent[]
}

type MatchGroupProps = {
  groups: LeagueGroup[]
  onOddsClick: (matchId: number, outcome: 0 | 1 | 2) => void
}

export function MatchGroups({ groups, onOddsClick }: MatchGroupProps) {
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>(
    groups.reduce((acc, g) => ({ ...acc, [g.league]: true }), {})
  )

  const toggleLeague = (league: string) => {
    setExpandedLeagues((prev) => ({
      ...prev,
      [league]: !prev[league],
    }))
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.league} className="space-y-2">
          {/* League Header */}
          <button
            onClick={() => toggleLeague(group.league)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-white/10 bg-white/3 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">⚽</span>
              <h3 className="font-semibold text-[#f3eee4]">{group.league}</h3>
              <span className="text-xs text-[#8f877c]">({group.matches.length})</span>
            </div>
            <span className="text-[#d7b37b]">
              {expandedLeagues[group.league] ? "−" : "+"}
            </span>
          </button>

          {/* Matches */}
          {expandedLeagues[group.league] && (
            <div className="space-y-2 pl-4">
              {group.matches.map((match) => (
                <MatchRow
                  key={match.match_id}
                  match={match}
                  onOddsClick={onOddsClick}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
