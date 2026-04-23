"use client"

import { useState } from "react"
import { RaidClubBrandMark } from "@/components/raid-club-logo"
import { BottomNav, type Page } from "@/components/bottom-nav"
import { MarketsPage } from "@/components/pages/markets-page"
import { LivePage } from "@/components/pages/live-page"
import { MyBetsPage } from "@/components/pages/my-bets-page"
import { AccountPage } from "@/components/pages/account-page"
import { isMainnetRuntimeConfigured } from "@/lib/initia/config"
import { usePhantasmaStore } from "@/lib/game/store"

export function RaidClubApp() {
  return isMainnetRuntimeConfigured ? <MainnetPhantasmaApp /> : <MockPhantasmaApp />
}

function MockPhantasmaApp() {
  const [currentPage, setCurrentPage] = useState<Page>("markets")

  const user = usePhantasmaStore((s) => s.user)
  const connectWallet = usePhantasmaStore((s) => s.connectWallet)
  const depositBalance = usePhantasmaStore((s) => s.depositBalance)
  const addLiquidity = usePhantasmaStore((s) => s.addLiquidity)

  const handleOddsClick = (matchId: number, outcome: 0 | 1 | 2) => {
    console.log(`Odds clicked: Match ${matchId}, Outcome ${outcome}`)
  }

  const handleConnectWallet = () => {
    if (!user.address) {
      connectWallet("0x1a2b3c4d5e6f7g8h9i0j")
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <RaidClubBrandMark className="h-8 w-8" />
            <h1 className="font-bold text-[#1a1a1a]">Phantasma</h1>
          </div>

          <button
            onClick={handleConnectWallet}
            className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition"
          >
            {user.address ? (
              <>
                <span>{user.address.slice(0, 6)}...</span>
                <span className="text-xs bg-white/20 rounded px-2 py-0.5">
                  {user.balanceUSDC} USDC
                </span>
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <div className="pt-16 pb-24">
        <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
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
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-xs text-gray-600 uppercase tracking-wider">
          Mainnet
        </p>
        <h1 className="mt-4 text-4xl font-bold text-[#1a1a1a]">Phantasma</h1>
        <p className="mt-4 text-sm text-gray-600 max-w-md">
          Connected to mainnet. Loading wallet state and market data from the
          Phantasma contract.
        </p>
      </div>
    </main>
  )
}

