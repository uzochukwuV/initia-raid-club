"use client"

import { useState } from "react"
import { TopNav, type Page } from "@/components/top-nav"
import { FloatingBetSlip } from "@/components/floating-bet-slip"
import { BetSlipModal } from "@/components/bet-slip-modal"
import { MarketsPage } from "@/components/pages/markets-page"
import { LivePage } from "@/components/pages/live-page"
import { MyBetsPage } from "@/components/pages/my-bets-page"
import { AccountPage } from "@/components/pages/account-page"
import { isMainnetRuntimeConfigured } from "@/lib/initia/config"
import { usePhantasmaStore } from "@/lib/game/store"
import { mockSportEvents } from "@/lib/game/data"

export function RaidClubApp() {
  return isMainnetRuntimeConfigured ? <MainnetPhantasmaApp /> : <MockPhantasmaApp />
}

function MockPhantasmaApp() {
  const [currentPage, setCurrentPage] = useState<Page>("markets")
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false)

  const user = usePhantasmaStore((s) => s.user)
  const bettingSession = usePhantasmaStore((s) => s.bettingSession)
  const addSelectionToBet = usePhantasmaStore((s) => s.addSelectionToBet)
  const removeSelectionFromBet = usePhantasmaStore((s) => s.removeSelectionFromBet)
  const updateStake = usePhantasmaStore((s) => s.updateStake)
  const placeBet = usePhantasmaStore((s) => s.placeBet)

  const handleOddsClick = (matchId: number, outcome: 0 | 1 | 2) => {
    const match = mockSportEvents.find((m) => m.match_id === matchId)

    if (match) {
      addSelectionToBet({
        match_id: matchId,
        market_id: match.market_id,
        outcome_id: outcome,
        odds: match.odds[outcome],
      })
      setIsBetSlipOpen(true)
    }
  }

  const handleRemoveSelection = (index: number) => {
    removeSelectionFromBet(index)
  }

  const selectionCount = bettingSession?.selections.length ?? 0

  return (
    <main className="min-h-screen bg-white">
      {/* Top Navigation */}
      <TopNav currentPage={currentPage} onPageChange={setCurrentPage} />

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
              onDepositBalance={() => usePhantasmaStore.getState().depositBalance(100)}
              onAddLiquidity={() => usePhantasmaStore.getState().addLiquidity(500)}
            />
          )}
        </div>
      </div>

      {/* Floating Bet Slip Button */}
      <FloatingBetSlip
        count={selectionCount}
        onClick={() => setIsBetSlipOpen(true)}
      />

      {/* Bet Slip Modal */}
      <BetSlipModal
        isOpen={isBetSlipOpen}
        onClose={() => setIsBetSlipOpen(false)}
        bettingSession={bettingSession}
        onUpdateStake={updateStake}
        onRemoveSelection={handleRemoveSelection}
        onPlaceBet={placeBet}
        userBalance={user.balanceUSDC}
      />
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

