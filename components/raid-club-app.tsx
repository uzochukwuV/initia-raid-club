"use client"

import { useState } from "react"
import { TopNav, type Page } from "@/components/top-nav"
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
      {/* Top Navigation */}
      <TopNav
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        walletAddress={user.address || undefined}
        balance={user.balanceUSDC}
        onConnectWallet={handleConnectWallet}
      />

      {/* Main Content */}
      <div className="pt-20">
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

