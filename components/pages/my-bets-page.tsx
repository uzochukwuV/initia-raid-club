"use client"

import type { UserProfile } from "@/lib/game/types"

type MyBetsPageProps = {
  user: UserProfile
}

export function MyBetsPage({ user }: MyBetsPageProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f3eee4] mb-2">My Bets</h1>
        <p className="text-[#8f877c]">
          {user.totalBetsPlaced} bets placed • {user.totalWon} wins
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/2 p-8 text-center">
        <p className="text-[#8f877c] mb-4">No active bets</p>
        <p className="text-sm text-[#6b6460]">
          Your placed bets will appear here
        </p>
      </div>
    </div>
  )
}
