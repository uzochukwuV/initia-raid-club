"use client"

import type { UserProfile } from "@/lib/game/types"

type AccountPageProps = {
  user: UserProfile
  onConnectWallet: () => void
  onDepositBalance: () => void
  onAddLiquidity: () => void
}

export function AccountPage({
  user,
  onConnectWallet,
  onDepositBalance,
  onAddLiquidity,
}: AccountPageProps) {
  const winRatePercent = Math.round(user.winRate * 100)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Account</h1>
        <p className="text-gray-600">
          {user.address
            ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
            : "Not connected"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="text-xs text-gray-600 uppercase tracking-wider">
            Balance
          </p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {user.balanceUSDC}
          </p>
          <p className="text-xs text-gray-500 mt-1">USDC</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="text-xs text-gray-600 uppercase tracking-wider">
            Win Rate
          </p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {winRatePercent}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {user.totalBetsPlaced} bets
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="text-xs text-gray-600 uppercase tracking-wider">
            LP Position
          </p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {user.lpShares}
          </p>
          <p className="text-xs text-gray-500 mt-1">shares</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="text-xs text-gray-600 uppercase tracking-wider">
            LP Value
          </p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            ${user.lpValue}
          </p>
          <p className="text-xs text-gray-500 mt-1">total returns</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onConnectWallet}
          disabled={!!user.address}
          className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {user.address ? "Wallet Connected" : "Connect Wallet"}
        </button>
        <button
          onClick={onDepositBalance}
          disabled={!user.address}
          className="w-full rounded-lg bg-gray-100 text-blue-600 py-3 font-semibold hover:bg-gray-200 transition disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Deposit 100 USDC
        </button>
        <button
          onClick={onAddLiquidity}
          disabled={!user.address}
          className="w-full rounded-lg bg-gray-100 text-blue-600 py-3 font-semibold hover:bg-gray-200 transition disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Add Liquidity
        </button>
      </div>
    </div>
  )
}
