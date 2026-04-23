import type { ActivityEntry, LeaderboardEntry, SportEvent, HousePool } from "./types"

// Mock Sport Events - Available betting markets
export const mockSportEvents: SportEvent[] = [
  {
    match_id: 1,
    sport: "Soccer",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    start_time: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    status: 0, // OPEN
    current_exposure: 50000000, // 50 USDC in exposure
    market_id: 0, // 1X2 market
    odds: [180, 320, 240], // 1.80, 3.20, 2.40
    suspended: false,
  },
  {
    match_id: 2,
    sport: "Basketball",
    homeTeam: "Lakers",
    awayTeam: "Celtics",
    start_time: Math.floor(Date.now() / 1000) + 7200, // 2 hours from now
    status: 0,
    current_exposure: 75000000,
    market_id: 0,
    odds: [210, 280, 210],
    suspended: false,
  },
  {
    match_id: 3,
    sport: "Tennis",
    homeTeam: "Djokovic",
    awayTeam: "Alcaraz",
    start_time: Math.floor(Date.now() / 1000) + 5400, // 1.5 hours from now
    status: 0,
    current_exposure: 35000000,
    market_id: 0,
    odds: [220, 310, 190], // Player 1 favored
    suspended: false,
  },
  {
    match_id: 4,
    sport: "Soccer",
    homeTeam: "Manchester City",
    awayTeam: "Manchester United",
    start_time: Math.floor(Date.now() / 1000) + 10800, // 3 hours from now
    status: 0,
    current_exposure: 120000000,
    market_id: 0,
    odds: [175, 350, 260],
    suspended: false,
  },
  {
    match_id: 5,
    sport: "Rugby",
    homeTeam: "All Blacks",
    awayTeam: "Springboks",
    start_time: Math.floor(Date.now() / 1000) + 14400, // 4 hours from now
    status: 0,
    current_exposure: 65000000,
    market_id: 0,
    odds: [195, 320, 215],
    suspended: false,
  },
]

// Mock LP Pool State
export const mockHousePool: HousePool = {
  total_supply: 1000000, // 1M total LP shares minted
  reserve_balance: 500000000, // 500M USDC in pool
  locked_payouts: 120000000, // 120M USDC locked for pending payouts
  max_match_exposure: 100000000, // Max 100M USDC exposure per match
}

export const starterActivity: ActivityEntry[] = [
  {
    id: "seed-1",
    title: "Pool initialized",
    detail: "Phantasma sportsbook launched with 500M USDC liquidity.",
    timestamp: "Just now",
    tone: "neutral",
  },
  {
    id: "seed-2",
    title: "Arsenal vs Liverpool",
    detail: "1X2 market open with odds 1.80 / 3.20 / 2.40.",
    timestamp: "2m ago",
    tone: "warning",
  },
  {
    id: "seed-3",
    title: "Lakers vs Celtics",
    detail: "Championship matchup now live for betting.",
    timestamp: "5m ago",
    tone: "neutral",
  },
]

export const rivalLeaderboard: LeaderboardEntry[] = [
  {
    id: "whale-1",
    address: "0x1a2b3c4d5e6f7g8h9i0j",
    totalVolume: 5280000,
    winRate: 0.62,
    profitLoss: 850000,
    lpReturns: 45000,
    highlight: true,
  },
  {
    id: "bettor-2",
    address: "0x2k3l4m5n6o7p8q9r0s1t",
    totalVolume: 3170000,
    winRate: 0.58,
    profitLoss: 420000,
    lpReturns: 28000,
  },
  {
    id: "sharp-3",
    address: "0x3u4v5w6x7y8z9a0b1c2d",
    totalVolume: 2898000,
    winRate: 0.71,
    profitLoss: 680000,
    lpReturns: 52000,
  },
]
