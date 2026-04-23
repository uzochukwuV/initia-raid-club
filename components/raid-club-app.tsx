"use client"

import { useState } from "react"
import { RaidClubBrandMark } from "@/components/raid-club-logo"
import { BottomNav, type Page } from "@/components/bottom-nav"
import { Sidebar } from "@/components/sidebar"
import { MarketsPage } from "@/components/pages/markets-page"
import { LivePage } from "@/components/pages/live-page"
import { MyBetsPage } from "@/components/pages/my-bets-page"
import { AccountPage } from "@/components/pages/account-page"
import { isMainnetRuntimeConfigured } from "@/lib/initia/config"
import { buildMockLeaderboard, usePhantasmaStore } from "@/lib/game/store"
import type { UserProfile } from "@/lib/game/types"

export function RaidClubApp() {
  return isMainnetRuntimeConfigured ? <MainnetPhantasmaApp /> : <MockPhantasmaApp />
}

function MockPhantasmaApp() {
  const [currentPage, setCurrentPage] = useState<Page>("markets")

  const user = usePhantasmaStore((s) => s.user)
  const connectWallet = usePhantasmaStore((s) => s.connectWallet)
  const depositBalance = usePhantasmaStore((s) => s.depositBalance)
  const addLiquidity = usePhantasmaStore((s) => s.addLiquidity)
  const resetDemo = usePhantasmaStore((s) => s.resetDemo)

  const handleOddsClick = (matchId: number, outcome: 0 | 1 | 2) => {
    console.log(`Odds clicked: Match ${matchId}, Outcome ${outcome}`)
  }

  const handleConnectWallet = () => {
    if (!user.address) {
      connectWallet("0x1a2b3c4d5e6f7g8h9i0j")
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0d0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-[#0f0d0a]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <RaidClubBrandMark className="h-10 w-10" />
            <div>
              <h1 className="font-bold text-[#f3eee4]">Phantasma</h1>
              <p className="text-xs text-[#8f877c]">Sportsbook</p>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="rounded bg-white/5 px-3 py-1 text-xs text-[#8f877c]">
              Demo
            </span>
            {user.address && (
              <span className="rounded bg-white/5 px-3 py-1 text-xs text-[#d7b37b]">
                {user.address.slice(0, 6)}...
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar>
        <div>
          <p className="text-xs text-[#8f877c] uppercase tracking-wider">
            Account
          </p>
          <p className="text-sm font-semibold text-[#f3eee4] mt-2">
            {user.address ? `${user.address.slice(0, 6)}...` : "Not Connected"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-[#8f877c] uppercase tracking-wider">
            Quick Stats
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-[#c7c0b5]">
              <span>Balance:</span>
              <span className="text-[#d7b37b]">{user.balanceUSDC} USDC</span>
            </div>
            <div className="flex justify-between text-[#c7c0b5]">
              <span>Win Rate:</span>
              <span className="text-[#d7b37b]">
                {Math.round(user.winRate * 100)}%
              </span>
            </div>
            <div className="flex justify-between text-[#c7c0b5]">
              <span>LP Shares:</span>
              <span className="text-[#d7b37b]">{user.lpShares}</span>
            </div>
          </div>
        </div>

        <button
          onClick={resetDemo}
          className="w-full rounded bg-white/8 py-2 px-3 text-xs text-[#8f877c] hover:text-[#c7c0b5] transition"
        >
          Reset Demo
        </button>
      </Sidebar>

      {/* Main Content */}
      <div className="pt-20 pb-24 lg:ml-80">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {currentPage === "markets" && (
            <MarketsPage onOddsClick={handleOddsClick} />
          )}
          {currentPage === "live" && (
            <LivePage onOddsClick={handleOddsClick} />
          )}
          {currentPage === "my-bets" && <MyBetsPage user={user} />}
          {currentPage === "account" && (
            <AccountPage
              user={user}
              onConnectWallet={handleConnectWallet}
              onDepositBalance={() => depositBalance(100)}
              onAddLiquidity={() => addLiquidity(500)}
            />
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </main>
  )
}

function MainnetPhantasmaApp() {
  return (
    <main className="min-h-screen bg-[#0f0d0a] flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-xs text-[#8f877c] uppercase tracking-wider">
          Mainnet
        </p>
        <h1 className="mt-4 text-4xl font-bold text-[#f3eee4]">Phantasma</h1>
        <p className="mt-4 text-sm text-[#c7c0b5] max-w-md">
          Connected to mainnet. Loading wallet state and market data from the
          Phantasma contract.
        </p>
      </div>
    </main>
  )
}

