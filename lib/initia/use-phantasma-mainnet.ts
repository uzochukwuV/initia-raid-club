"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useInterwovenKit } from "@initia/interwovenkit-react"
import { isAddress } from "viem"
import { mockSportEvents, mockHousePool, starterActivity } from "@/lib/game/data"
import type {
  ActivityEntry,
  BetSlip,
  LeaderboardEntry,
  NativeFeatureStatus,
  Selection,
  SportEvent,
  UserProfile,
  Screen,
} from "@/lib/game/types"
import { phantasmaEnv } from "./config"
import {
  place_bet,
  add_liquidity,
  request_withdraw,
  batch_settle_match,
  get_user_bets,
  get_lp_balance,
  get_pool_state,
  get_market_odds,
} from "./phantasma-abi"

type RuntimeControl = {
  label: string
  onClick: () => void
}

type RuntimeModel = {
  mode: "mainnet"
  screen: Screen
  user: UserProfile
  sportEvents: SportEvent[]
  bettingSession: any
  activeBets: BetSlip[]
  betHistory: BetSlip[]
  activity: ActivityEntry[]
  nativeFeatures: NativeFeatureStatus
  leaderboard: LeaderboardEntry[]
  setScreen: (screen: Screen) => void
  connectWallet: () => void
  depositBalance: (amount: number) => Promise<void>
  addSelectionToBet: (selection: Selection) => void
  removeSelectionFromBet: (index: number) => void
  updateStake: (amount: number) => void
  placeBet: () => Promise<void>
  addLiquidity: (amount: number) => Promise<void>
  requestWithdraw: (shares: number) => Promise<void>
  settleBet: (slipId: string, won: boolean) => void
  headerBadges: string[]
  judgePathTitle: string
  judgePath: string[]
  identityTitle: string
  identityHelp: string
  identityActions: RuntimeControl[]
  footerTitle: string
  footerPoints: string[]
}

const baseUser: UserProfile = {
  address: null,
  balanceUSDC: 0,
  lpShares: 0,
  totalBetsPlaced: 0,
  totalWon: 0,
  totalLost: 0,
  winRate: 0,
  lpValue: 0,
  lpWithdrawalRequest: null,
}

const initialActivity: ActivityEntry[] = [
  {
    id: crypto.randomUUID(),
    title: "Mainnet client ready",
    detail: "Connect a wallet, enable autosign, and start betting on Phantasma sportsbook.",
    timestamp: "Now",
    tone: "neutral",
  },
]

/**
 * Mainnet hook for Phantasma sportsbook
 * 
 * Manages:
 * - Wallet connection via InterwovenKit
 * - Contract interactions for betting, LP operations
 * - User activity logging
 * - Auto-signing for repeated transactions
 * 
 * Note: This is a template. Full implementation requires:
 * 1. Contract ABI JSON from deployed sportsbook
 * 2. Custom message building for Phantasma Move calls
 * 3. Signature verification for admin operations
 */
export function usePhantasmaMainnet(): RuntimeModel {
  const [screen, setScreen] = useState<Screen>("dashboard")
  const [user, setUser] = useState<UserProfile>(baseUser)
  const [sportEvents, setSportEvents] = useState<SportEvent[]>(mockSportEvents)
  const [bettingSession, setBettingSession] = useState<any>(null)
  const [activeBets, setActiveBets] = useState<BetSlip[]>([])
  const [betHistory, setBetHistory] = useState<BetSlip[]>([])
  const [activity, setActivity] = useState<ActivityEntry[]>(initialActivity)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isBusy, setIsBusy] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)

  const {
    isConnected,
    initiaAddress,
    hexAddress,
    username,
    openBridge,
    openConnect,
    openWallet,
    requestTxBlock,
    autoSign,
  } = useInterwovenKit()

  const walletAddress = isAddress(hexAddress) ? (hexAddress as `0x${string}`) : null
  const autoSignEnabled = autoSign.isEnabledByChain[phantasmaEnv.chainId] ?? false

  const pushActivity = useCallback((title: string, detail: string, tone: ActivityEntry["tone"]) => {
    setActivity((current) => [
      {
        id: crypto.randomUUID(),
        title,
        detail,
        timestamp: "Now",
        tone,
      },
      ...current,
    ])
  }, [])

  // ============================================================================
  // Wallet Management
  // ============================================================================

  const handleConnectWallet = useCallback(() => {
    if (!isConnected) {
      openConnect()
    } else if (walletAddress) {
      setUser((prev) => ({
        ...prev,
        address: walletAddress,
      }))
      pushActivity("Wallet connected", `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`, "success")
    }
  }, [isConnected, walletAddress, openConnect, pushActivity])

  // ============================================================================
  // Balance and LP Operations
  // ============================================================================

  const handleDepositBalance = useCallback(
    async (amount: number) => {
      if (!walletAddress) {
        pushActivity("Wallet required", "Connect a wallet to deposit balance", "warning")
        return
      }

      setIsBusy(true)
      try {
        // TODO: Call bridge or direct deposit function
        // Simulate for now
        await new Promise((resolve) => setTimeout(resolve, 800))

        setUser((prev) => ({
          ...prev,
          balanceUSDC: prev.balanceUSDC + amount,
        }))
        pushActivity("Deposit successful", `${amount} USDC deposited to wallet`, "success")
      } catch (error) {
        pushActivity("Deposit failed", String(error), "warning")
      } finally {
        setIsBusy(false)
      }
    },
    [walletAddress, pushActivity],
  )

  const handleAddLiquidity = useCallback(
    async (amount: number) => {
      if (!walletAddress) {
        pushActivity("Wallet required", "Connect a wallet to add liquidity", "warning")
        return
      }

      if (user.balanceUSDC < amount) {
        pushActivity("Insufficient balance", `You have ${user.balanceUSDC} USDC`, "warning")
        return
      }

      setIsBusy(true)
      try {
        // TODO: Call add_liquidity contract function
        // Simulate for now
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Calculate shares minted (simple calculation)
        const sharesMinted = (amount / mockHousePool.reserve_balance) * mockHousePool.total_supply
        const newLPValue = (user.lpShares + sharesMinted) * (mockHousePool.reserve_balance / mockHousePool.total_supply)

        setUser((prev) => ({
          ...prev,
          balanceUSDC: prev.balanceUSDC - amount,
          lpShares: prev.lpShares + sharesMinted,
          lpValue: newLPValue,
        }))
        pushActivity("Liquidity added", `${amount} USDC deposited. You received ${Math.floor(sharesMinted)} LP shares.`, "success")
      } catch (error) {
        pushActivity("Liquidity add failed", String(error), "warning")
      } finally {
        setIsBusy(false)
      }
    },
    [walletAddress, user.balanceUSDC, user.lpShares, pushActivity],
  )

  const handleRequestWithdraw = useCallback(
    async (shares: number) => {
      if (!walletAddress) {
        pushActivity("Wallet required", "Connect a wallet to request withdrawal", "warning")
        return
      }

      if (user.lpShares < shares) {
        pushActivity("Insufficient shares", `You have ${user.lpShares} LP shares`, "warning")
        return
      }

      setIsBusy(true)
      try {
        // TODO: Call request_withdraw contract function
        // Simulate for now
        await new Promise((resolve) => setTimeout(resolve, 800))

        setUser((prev) => ({
          ...prev,
          lpWithdrawalRequest: shares,
        }))
        pushActivity("Withdrawal queued", `${shares} LP shares queued. Processing in next batch.`, "neutral")
      } catch (error) {
        pushActivity("Withdrawal request failed", String(error), "warning")
      } finally {
        setIsBusy(false)
      }
    },
    [walletAddress, user.lpShares, pushActivity],
  )

  // ============================================================================
  // Betting Operations
  // ============================================================================

  const handleAddSelectionToBet = useCallback((selection: Selection) => {
    setBettingSession((prev: any) => {
      if (!prev) {
        return {
          bettor: walletAddress,
          selections: [selection],
          stake: 0,
          potential_payout: 0,
          status: "building",
        }
      }

      // Avoid duplicate selections on same match
      if (prev.selections.some((s: Selection) => s.match_id === selection.match_id && s.market_id === selection.market_id)) {
        return prev
      }

      return {
        ...prev,
        selections: [...prev.selections, selection],
      }
    })
  }, [walletAddress])

  const handleRemoveSelectionFromBet = useCallback((index: number) => {
    setBettingSession((prev: any) => {
      if (!prev) return null

      const newSelections = prev.selections.filter((_: any, i: number) => i !== index)

      if (newSelections.length === 0) {
        return null
      }

      return {
        ...prev,
        selections: newSelections,
      }
    })
  }, [])

  const handleUpdateStake = useCallback((amount: number) => {
    setBettingSession((prev: any) => {
      if (!prev) return null

      // Calculate potential payout (parlay)
      let potentialPayout = amount
      const oddsBasis = 10000

      for (const selection of prev.selections) {
        potentialPayout = (potentialPayout * selection.odds) / oddsBasis
      }

      return {
        ...prev,
        stake: amount,
        potential_payout: Math.floor(potentialPayout),
      }
    })
  }, [])

  const handlePlaceBet = useCallback(
    async () => {
      if (!walletAddress || !bettingSession) {
        return
      }

      if (user.balanceUSDC < bettingSession.stake) {
        pushActivity("Insufficient balance", `Need ${bettingSession.stake} USDC`, "warning")
        return
      }

      setIsBusy(true)
      try {
        // TODO: Call place_bet contract function
        // For now, simulate
        await new Promise((resolve) => setTimeout(resolve, 800))

        const newBet: BetSlip = {
          slip_id: crypto.randomUUID(),
          bettor: walletAddress,
          selections: bettingSession.selections,
          stake: bettingSession.stake,
          potential_payout: bettingSession.potential_payout,
          status: 0, // ACTIVE
          placed_at: Math.floor(Date.now() / 1000),
        }

        setUser((prev) => ({
          ...prev,
          balanceUSDC: prev.balanceUSDC - bettingSession.stake,
          totalBetsPlaced: prev.totalBetsPlaced + 1,
        }))

        setActiveBets((prev) => [newBet, ...prev])
        setBettingSession(null)

        pushActivity(
          "Bet placed",
          `${bettingSession.selections.length}-leg parlay for ${bettingSession.stake} USDC`,
          "success",
        )
      } catch (error) {
        pushActivity("Bet placement failed", String(error), "warning")
      } finally {
        setIsBusy(false)
      }
    },
    [walletAddress, bettingSession, user.balanceUSDC, pushActivity],
  )

  const handleSettleBet = useCallback((slipId: string, won: boolean) => {
    const bet = activeBets.find((b) => b.slip_id === slipId)

    if (!bet) return

    setActiveBets((prev) => prev.filter((b) => b.slip_id !== slipId))
    setBetHistory((prev) => [
      ...prev,
      {
        ...bet,
        status: won ? 1 : 2,
      },
    ])

    setUser((prev) => ({
      ...prev,
      balanceUSDC: prev.balanceUSDC + (won ? bet.potential_payout : 0),
      totalWon: prev.totalWon + (won ? 1 : 0),
      totalLost: prev.totalLost + (won ? 0 : 1),
      winRate: (prev.totalWon + (won ? 1 : 0)) / prev.totalBetsPlaced,
    }))

    pushActivity(won ? "Bet won" : "Bet lost", won ? `You won ${bet.potential_payout} USDC!` : "One or more legs lost", won ? "success" : "warning")
  }, [activeBets, pushActivity])

  // ============================================================================
  // Fetch On-Chain Data
  // ============================================================================

  useEffect(() => {
    if (!walletAddress) return

    const loadUserData = async () => {
      try {
        // TODO: Fetch user bets, LP balance, etc. from contract
        // For now, use mock data
      } catch (error) {
        console.error("Failed to load user data:", error)
      }
    }

    loadUserData()
  }, [walletAddress])

  // ============================================================================
  // Runtime Model
  // ============================================================================

  const runtime: RuntimeModel = useMemo(
    () => ({
      mode: "mainnet",
      screen,
      user,
      sportEvents,
      bettingSession,
      activeBets,
      betHistory,
      activity,
      nativeFeatures: {
        autoSigningArmed: autoSignEnabled,
        walletConnected: isConnected && walletAddress !== null,
        bridgeConnected: true,
      },
      leaderboard,
      setScreen,
      connectWallet: handleConnectWallet,
      depositBalance: handleDepositBalance,
      addSelectionToBet: handleAddSelectionToBet,
      removeSelectionFromBet: handleRemoveSelectionFromBet,
      updateStake: handleUpdateStake,
      placeBet: handlePlaceBet,
      addLiquidity: handleAddLiquidity,
      requestWithdraw: handleRequestWithdraw,
      settleBet: handleSettleBet,
      headerBadges: ["Mainnet", isConnected ? "Connected" : "Offline"],
      judgePathTitle: "Phantasma Sportsbook",
      judgePath: ["Betting", "Liquidity", "Markets"],
      identityTitle: "Wallet Address",
      identityHelp: "Connect your wallet to start betting",
      identityActions: isConnected
        ? [
            {
              label: "Disconnect",
              onClick: () => {
                setUser(baseUser)
                pushActivity("Wallet disconnected", "You have been disconnected", "neutral")
              },
            },
          ]
        : [
            {
              label: "Connect Wallet",
              onClick: handleConnectWallet,
            },
          ],
      footerTitle: "Phantasma Sportsbook",
      footerPoints: [
        "1X2 markets with real odds",
        "Multi-leg parlay support",
        "Liquidity provider pool",
        "ED25519 admin signatures",
      ],
    }),
    [screen, user, sportEvents, bettingSession, activeBets, betHistory, activity, leaderboard, autoSignEnabled, isConnected, walletAddress, handleConnectWallet, handleDepositBalance, handleAddSelectionToBet, handleRemoveSelectionFromBet, handleUpdateStake, handlePlaceBet, handleAddLiquidity, handleRequestWithdraw, handleSettleBet, pushActivity],
  )

  return runtime
}
