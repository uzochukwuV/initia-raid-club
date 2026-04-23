"use client"

import { create } from "zustand"
import { mockSportEvents, mockHousePool, starterActivity, rivalLeaderboard } from "./data"
import type {
  ActivityEntry,
  BetSlip,
  BettingSession,
  LeaderboardEntry,
  NativeFeatureStatus,
  Selection,
  SportEvent,
  UserProfile,
  Screen,
} from "./types"

type GameState = {
  screen: Screen
  user: UserProfile
  sportEvents: SportEvent[]
  housePool: typeof mockHousePool
  bettingSession: BettingSession | null
  activeBets: BetSlip[]
  betHistory: BetSlip[]
  activity: ActivityEntry[]
  nativeFeatures: NativeFeatureStatus
  setScreen: (screen: Screen) => void
  connectWallet: (address: string) => void
  depositBalance: (amount: number) => void
  addSelectionToBet: (selection: Selection) => void
  removeSelectionFromBet: (index: number) => void
  updateStake: (amount: number) => void
  placeBet: () => Promise<void>
  addLiquidity: (amount: number) => Promise<void>
  requestWithdraw: (shares: number) => Promise<void>
  settleBet: (slipId: string, won: boolean) => void
  resetDemo: () => void
}

const initialUser = (): UserProfile => ({
  address: null,
  balanceUSDC: 1000,
  lpShares: 0,
  totalBetsPlaced: 0,
  totalWon: 0,
  totalLost: 0,
  winRate: 0,
  lpValue: 0,
  lpWithdrawalRequest: null,
})

const demoPresetUser = (): UserProfile => ({
  ...initialUser(),
  address: "0x1a2b3c4d5e6f7g8h9i0j",
  balanceUSDC: 5000,
  lpShares: 100,
  totalBetsPlaced: 45,
  totalWon: 28,
  totalLost: 17,
  winRate: 0.62,
  lpValue: 505000,
})

const demoPresetActivity = (): ActivityEntry[] => [
  {
    id: crypto.randomUUID(),
    title: "Wallet connected",
    detail: "Demo wallet loaded with 5000 USDC and 100 LP shares.",
    timestamp: "Now",
    tone: "success",
  },
  {
    id: crypto.randomUUID(),
    title: "Markets live",
    detail: "5 sports betting markets available for placing bets.",
    timestamp: "Now",
    tone: "success",
  },
  ...starterActivity,
]

export const buildMockLeaderboard = (user: UserProfile): LeaderboardEntry[] =>
  [
    {
      id: "player",
      address: user.address ?? "0x0000000000000000",
      totalVolume: user.totalBetsPlaced * 150,
      winRate: user.winRate,
      profitLoss: (user.totalWon - user.totalLost) * 50,
      lpReturns: user.lpValue - 50000,
      highlight: true,
    },
    ...rivalLeaderboard,
  ].sort((left, right) => right.totalVolume - left.totalVolume)

export const usePhantasmaStore = create<GameState>((set, get) => ({
  screen: "dashboard",
  user: initialUser(),
  sportEvents: mockSportEvents,
  housePool: mockHousePool,
  bettingSession: null,
  activeBets: [],
  betHistory: [],
  activity: starterActivity,
  nativeFeatures: {
    autoSigningArmed: true,
    walletConnected: false,
    bridgeConnected: true,
  },
  setScreen: (screen) => set({ screen }),
  connectWallet: (address) => {
    set((state) => ({
      user: { ...state.user, address },
      nativeFeatures: { ...state.nativeFeatures, walletConnected: true },
      activity: [
        {
          id: crypto.randomUUID(),
          title: "Wallet connected",
          detail: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}.`,
          timestamp: "Now",
          tone: "success",
        },
        ...state.activity,
      ],
    }))
  },
  depositBalance: (amount) =>
    set((state) => ({
      user: {
        ...state.user,
        balanceUSDC: state.user.balanceUSDC + amount,
      },
      activity: [
        {
          id: crypto.randomUUID(),
          title: "Balance topped up",
          detail: `${amount} USDC deposited to wallet.`,
          timestamp: "Now",
          tone: "success",
        },
        ...state.activity,
      ],
    })),
  addSelectionToBet: (selection) =>
    set((state) => {
      if (!state.bettingSession) {
        return {
          bettingSession: {
            bettor: state.user.address || "unknown",
            selections: [selection],
            stake: 0,
            potential_payout: 0,
            status: "building",
            transcript: [],
            autoSigning: {
              enabled: true,
              pending: false,
              lastAction: null,
              message: "",
            },
          },
        }
      }

      // Check for duplicate selection
      const hasDuplicate = state.bettingSession.selections.some(
        (s) => s.match_id === selection.match_id && s.market_id === selection.market_id
      )

      if (hasDuplicate) {
        return state
      }

      return {
        bettingSession: {
          ...state.bettingSession,
          selections: [...state.bettingSession.selections, selection],
        },
      }
    }),
  removeSelectionFromBet: (index) =>
    set((state) => {
      if (!state.bettingSession) return state

      const newSelections = state.bettingSession.selections.filter((_, i) => i !== index)

      if (newSelections.length === 0) {
        return { bettingSession: null }
      }

      return {
        bettingSession: {
          ...state.bettingSession,
          selections: newSelections,
        },
      }
    }),
  updateStake: (amount) =>
    set((state) => {
      if (!state.bettingSession) return state

      // Calculate potential payout (parlay odds)
      let potentialPayout = amount
      const oddsBasis = 10000

      for (const selection of state.bettingSession.selections) {
        potentialPayout = (potentialPayout * selection.odds) / oddsBasis
      }

      return {
        bettingSession: {
          ...state.bettingSession,
          stake: amount,
          potential_payout: Math.floor(potentialPayout),
        },
      }
    }),
  placeBet: async () => {
    const current = get()

    if (!current.bettingSession || current.bettingSession.selections.length === 0) {
      return
    }

    if (current.user.balanceUSDC < current.bettingSession.stake) {
      set((state) => ({
        activity: [
          {
            id: crypto.randomUUID(),
            title: "Insufficient balance",
            detail: `Need ${current.bettingSession!.stake} USDC to place this bet.`,
            timestamp: "Now",
            tone: "warning",
          },
          ...state.activity,
        ],
      }))
      return
    }

    // Simulate auto-signing
    set((state) => ({
      bettingSession: state.bettingSession
        ? {
            ...state.bettingSession,
            autoSigning: {
              ...state.bettingSession.autoSigning,
              pending: true,
              lastAction: "place_bet",
              message: "Auto-signing bet and broadcasting to Phantasma...",
            },
          }
        : null,
    }))

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    set((state) => {
      if (!state.bettingSession) return state

      const newBet: BetSlip = {
        slip_id: crypto.randomUUID(),
        bettor: state.user.address || "unknown",
        selections: state.bettingSession.selections,
        stake: state.bettingSession.stake,
        potential_payout: state.bettingSession.potential_payout,
        status: 0, // ACTIVE
        placed_at: Math.floor(Date.now() / 1000),
      }

      return {
        user: {
          ...state.user,
          balanceUSDC: state.user.balanceUSDC - state.bettingSession.stake,
          totalBetsPlaced: state.user.totalBetsPlaced + 1,
        },
        activeBets: [newBet, ...state.activeBets],
        bettingSession: null,
        activity: [
          {
            id: crypto.randomUUID(),
            title: "Bet placed",
            detail: `${state.bettingSession.selections.length}-leg parlay for ${state.bettingSession.stake} USDC placed.`,
            timestamp: "Now",
            tone: "success",
          },
          ...state.activity,
        ],
      }
    })
  },
  addLiquidity: async (amount) => {
    set((state) => ({
      nativeFeatures: {
        ...state.nativeFeatures,
        autoSigningArmed: true,
      },
      activity: [
        {
          id: crypto.randomUUID(),
          title: "Auto-signing liquidity",
          detail: `Depositing ${amount} USDC to the house pool...`,
          timestamp: "Now",
          tone: "neutral",
        },
        ...state.activity,
      ],
    }))

    await new Promise((resolve) => setTimeout(resolve, 800))

    set((state) => {
      const sharesMinted = (amount / state.housePool.reserve_balance) * state.housePool.total_supply
      const newLPValue = state.user.lpShares + (sharesMinted * state.housePool.reserve_balance) / state.housePool.total_supply

      return {
        user: {
          ...state.user,
          balanceUSDC: state.user.balanceUSDC - amount,
          lpShares: state.user.lpShares + sharesMinted,
          lpValue: newLPValue,
        },
        housePool: {
          ...state.housePool,
          reserve_balance: state.housePool.reserve_balance + amount,
        },
        activity: [
          {
            id: crypto.randomUUID(),
            title: "Liquidity added",
            detail: `${amount} USDC deposited. You received ${Math.floor(sharesMinted)} LP shares.`,
            timestamp: "Now",
            tone: "success",
          },
          ...state.activity,
        ],
      }
    })
  },
  requestWithdraw: async (shares) =>
    set((state) => {
      if (state.user.lpShares < shares) {
        set((s) => ({
          activity: [
            {
              id: crypto.randomUUID(),
              title: "Insufficient LP shares",
              detail: `You only have ${s.user.lpShares} LP shares.`,
              timestamp: "Now",
              tone: "warning",
            },
            ...s.activity,
          ],
        }))
        return state
      }

      return {
        user: {
          ...state.user,
          lpWithdrawalRequest: shares,
        },
        activity: [
          {
            id: crypto.randomUUID(),
            title: "Withdrawal queued",
            detail: `${shares} LP shares queued for withdrawal. Processing in next batch.`,
            timestamp: "Now",
            tone: "neutral",
          },
          ...state.activity,
        ],
      }
    }),
  settleBet: (slipId, won) =>
    set((state) => {
      const bet = state.activeBets.find((b) => b.slip_id === slipId)

      if (!bet) return state

      const updatedBet: BetSlip = {
        ...bet,
        status: won ? 1 : 2, // 1=WON, 2=LOST
      }

      const balanceGain = won ? updatedBet.potential_payout : 0
      const nextUser = {
        ...state.user,
        balanceUSDC: state.user.balanceUSDC + balanceGain,
        totalWon: state.user.totalWon + (won ? 1 : 0),
        totalLost: state.user.totalLost + (won ? 0 : 1),
        winRate: (state.user.totalWon + (won ? 1 : 0)) / (state.user.totalBetsPlaced),
      }

      return {
        user: nextUser,
        activeBets: state.activeBets.filter((b) => b.slip_id !== slipId),
        betHistory: [...state.betHistory, updatedBet],
        activity: [
          {
            id: crypto.randomUUID(),
            title: won ? "Bet won" : "Bet lost",
            detail: won
              ? `Parlay settled. You won ${updatedBet.potential_payout} USDC!`
              : `Parlay settled. One or more legs lost.`,
            timestamp: "Now",
            tone: won ? "success" : "warning",
          },
          ...state.activity,
        ],
      }
    }),
  resetDemo: () =>
    set({
      screen: "dashboard",
      user: demoPresetUser(),
      sportEvents: mockSportEvents,
      housePool: mockHousePool,
      bettingSession: null,
      activeBets: [],
      betHistory: [],
      activity: demoPresetActivity(),
      nativeFeatures: {
        autoSigningArmed: true,
        walletConnected: true,
        bridgeConnected: true,
      },
    }),
}))
