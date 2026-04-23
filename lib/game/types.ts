export type Screen = "dashboard" | "betting" | "liquidity" | "leaderboard" | "log"

// Betting Outcomes and Statuses
export type BetOutcome = 0 | 1 | 2 // 0=Home, 1=Draw, 2=Away

export type BettingStatus = 0 | 1 | 2 // 0=ACTIVE, 1=WON, 2=LOST

export type MatchStatus = 0 | 1 | 2 // 0=OPEN, 1=SUSPENDED, 2=SETTLED

// Selection - A single bet on one outcome
export type Selection = {
  match_id: number
  market_id: number
  outcome_id: BetOutcome
  odds: number // Stored as u64 with 10,000 basis (e.g., 200 = 2.00 odds)
}

// BetSlip - A collection of selections (can be single or multi-leg parlay)
export type BetSlip = {
  slip_id: string
  bettor: string
  selections: Selection[]
  stake: number
  potential_payout: number
  status: BettingStatus
  placed_at: number
}

// SportEvent - A match/event that users can bet on
export type SportEvent = {
  match_id: number
  sport: string
  homeTeam: string
  awayTeam: string
  start_time: number
  status: MatchStatus
  current_exposure: number
  market_id: number // 0 for 1X2 market
  odds: [number, number, number] // [home_odds, draw_odds, away_odds]
  suspended: boolean
}

// LP Position - A user's liquidity provider stake
export type LPPosition = {
  provider_address: string
  shares: number
  value_of_shares: number // Calculated: (shares * reserve_balance) / total_supply
}

// HousePool - The shared liquidity pool state
export type HousePool = {
  total_supply: number
  reserve_balance: number
  locked_payouts: number
  max_match_exposure: number
}

// UserAccount - User's account state
export type UserAccount = {
  address: string
  total_bets_placed: number
  total_won: number
  total_lost: number
  active_slip_ids: string[]
  lp_shares: number
  withdrawal_request: number | null
}

// Activity Entry - Log of recent actions
export type ActivityEntry = {
  id: string
  title: string
  detail: string
  timestamp: string
  tone: "success" | "warning" | "neutral"
}

export type BettingTranscriptEntry = {
  id: string
  speaker: "player" | "system" | "market"
  message: string
}

// Auto-signing state for repeated transactions
export type AutoSigningState = {
  enabled: boolean
  pending: boolean
  lastAction: "place_bet" | "add_liquidity" | "request_withdraw" | null
  message: string
}

// Betting Session - Active betting interaction
export type BettingSession = {
  bettor: string
  selections: Selection[]
  stake: number
  potential_payout: number
  status: "building" | "reviewing" | "placing" | "confirmed"
  transcript: BettingTranscriptEntry[]
  autoSigning: AutoSigningState
}

// User Profile on Phantasma
export type UserProfile = {
  address: string | null
  balanceUSDC: number
  lpShares: number
  totalBetsPlaced: number
  totalWon: number
  totalLost: number
  winRate: number
  lpValue: number
  lpWithdrawalRequest: number | null
}

export type NativeFeatureStatus = {
  autoSigningArmed: boolean
  walletConnected: boolean
  bridgeConnected: boolean
}

// Leaderboard Entry
export type LeaderboardEntry = {
  id: string
  address: string
  totalVolume: number
  winRate: number
  profitLoss: number
  lpReturns: number
  highlight?: boolean
}
