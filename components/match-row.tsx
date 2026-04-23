"use client"

import { useState } from "react"
import type { SportEvent } from "@/lib/game/types"

type MatchRowProps = {
  match: SportEvent
  onOddsClick: (matchId: number, outcome: 0 | 1 | 2) => void
}

export function MatchRow({ match, onOddsClick }: MatchRowProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const oddsDisplay = [
    (match.odds[0] / 10000).toFixed(2),
    (match.odds[1] / 10000).toFixed(2),
    (match.odds[2] / 10000).toFixed(2),
  ]

  const isLive = match.status === 1

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center gap-3 sm:gap-4 rounded-lg border transition-all duration-200 px-3 sm:px-4 py-3 ${
        isHovered
          ? "border-gray-300 bg-gray-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Time / Status */}
      <div className="w-14 sm:w-16 flex-shrink-0 text-center">
        <p className={`text-xs font-medium ${isLive ? "text-red-500" : "text-gray-600"}`}>
          {isLive ? "LIVE" : formatTime(match.start_time)}
        </p>
        {isLive && (
          <div className="mt-1 flex justify-center">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1a1a1a] truncate">
          {match.homeTeam}
        </p>
        <p className="text-xs text-gray-600 truncate">
          vs {match.awayTeam}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
          {match.sport}
        </p>
      </div>

      {/* Odds Buttons */}
      <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          onClick={() => onOddsClick(match.match_id, 0)}
          className="min-w-12 sm:min-w-14 rounded bg-gray-100 py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-[#1a1a1a] hover:bg-blue-100 hover:text-blue-600 transition"
          title="Home Win"
        >
          {oddsDisplay[0]}
        </button>
        <button
          onClick={() => onOddsClick(match.match_id, 1)}
          className="min-w-12 sm:min-w-14 rounded bg-gray-100 py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-[#1a1a1a] hover:bg-blue-100 hover:text-blue-600 transition flex flex-col items-center justify-center"
          title="Draw"
        >
          <span className="text-[10px]">X</span>
          <span>{oddsDisplay[1]}</span>
        </button>
        <button
          onClick={() => onOddsClick(match.match_id, 2)}
          className="min-w-12 sm:min-w-14 rounded bg-gray-100 py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-[#1a1a1a] hover:bg-blue-100 hover:text-blue-600 transition"
          title="Away Win"
        >
          {oddsDisplay[2]}
        </button>
      </div>
    </div>
  )
}
