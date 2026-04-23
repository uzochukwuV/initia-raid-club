"use client"

import type { UserProfile } from "@/lib/game/types"

type MyBetsPageProps = {
  user: UserProfile
}

export function MyBetsPage({ user }: MyBetsPageProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">My Bets</h1>
        <p className="text-gray-600">
          {user.totalBetsPlaced} bets placed • {user.totalWon} wins
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600 mb-4">No active bets</p>
        <p className="text-sm text-gray-500">
          Your placed bets will appear here
        </p>
      </div>
    </div>
  )
}
