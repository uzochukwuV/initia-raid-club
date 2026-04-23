"use client"

import { useState } from "react"
import type { BettingSession } from "@/lib/game/types"

type BetSlipModalProps = {
  isOpen: boolean
  onClose: () => void
  bettingSession: BettingSession | null
  onUpdateStake: (amount: number) => void
  onRemoveSelection: (index: number) => void
  onPlaceBet: () => Promise<void>
  userBalance: number
}

export function BetSlipModal({
  isOpen,
  onClose,
  bettingSession,
  onUpdateStake,
  onRemoveSelection,
  onPlaceBet,
  userBalance,
}: BetSlipModalProps) {
  const [stake, setStake] = useState<string>("")
  const [isPlacing, setIsPlacing] = useState(false)

  if (!isOpen || !bettingSession) return null

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStake(value)
    if (value && !isNaN(Number(value))) {
      onUpdateStake(Number(value))
    }
  }

  const handlePlaceBet = async () => {
    setIsPlacing(true)
    try {
      await onPlaceBet()
      setStake("")
      onClose()
    } finally {
      setIsPlacing(false)
    }
  }

  const handleQuickStake = (amount: number) => {
    setStake(amount.toString())
    onUpdateStake(amount)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white border-t border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Your Bet Slip</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Selections */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Selections ({bettingSession.selections.length})
            </h3>

            {bettingSession.selections.map((selection, index) => {
              const match = undefined // In a real app, get match details from store
              const outcomes = ["Home", "Draw", "Away"]
              const odds = (selection.odds / 10000).toFixed(2)

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-[#1a1a1a]">
                      Match #{selection.match_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {outcomes[selection.outcome_id]} @ {odds}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveSelection(index)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>

          {/* Odds Summary */}
          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 mb-6">
            <p className="text-xs text-blue-700 uppercase tracking-wider mb-2">
              Parlay Odds
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {(bettingSession.potential_payout / Math.max(bettingSession.stake, 1)).toFixed(2)}x
            </p>
          </div>

          {/* Stake Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stake (USDC)
            </label>
            <input
              type="number"
              value={stake}
              onChange={handleStakeChange}
              placeholder="Enter stake amount"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />

            {/* Quick Stake Buttons */}
            <div className="flex gap-2 mt-3">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleQuickStake(amount)}
                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-300 bg-gray-50 text-[#1a1a1a] hover:bg-gray-100 transition"
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          {/* Payout Summary */}
          {stake && (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Stake</span>
                <span className="font-semibold text-[#1a1a1a]">{stake} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Potential Payout</span>
                <span className="font-semibold text-green-600">
                  {bettingSession.potential_payout.toFixed(2)} USDC
                </span>
              </div>
            </div>
          )}

          {/* Place Bet Button */}
          <button
            onClick={handlePlaceBet}
            disabled={!stake || isPlacing || Number(stake) > userBalance}
            className="w-full py-4 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isPlacing ? "Placing Bet..." : "Place Bet"}
          </button>

          {Number(stake) > userBalance && stake && (
            <p className="text-sm text-red-600 mt-3 text-center">
              Insufficient balance
            </p>
          )}
        </div>
      </div>
    </>
  )
}
