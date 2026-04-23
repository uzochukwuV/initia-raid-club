/**
 * Phantasma Sportsbook Contract ABI
 * Module: quadratic_market::sportsbook
 * 
 * This ABI defines the contract interface for the Phantasma sportsbook/prediction market.
 * All amounts are in USDC (6 decimals) unless otherwise noted.
 * Odds are stored as u64 with basis 10,000 (e.g., 200 = 2.00x odds).
 */

export const ODDS_BASIS = 10000

// ============================================================================
// Types for Contract Interaction
// ============================================================================

/**
 * Bet Outcome for 1X2 market
 * 0 = Home win
 * 1 = Draw
 * 2 = Away win
 */
export type BetOutcome = 0 | 1 | 2

/**
 * Bet Slip Status
 * 0 = ACTIVE (awaiting settlement)
 * 1 = WON (all legs won)
 * 2 = LOST (at least one leg lost)
 */
export type BettingStatus = 0 | 1 | 2

/**
 * Match Status
 * 0 = OPEN (accepting bets)
 * 1 = SUSPENDED (no new bets)
 * 2 = SETTLED (outcome determined)
 */
export type MatchStatus = 0 | 1 | 2

/**
 * Selection - single leg of a bet
 */
export type Selection = {
  match_id: number // u64
  market_id: number // u8, typically 0 for 1X2
  outcome_id: BetOutcome
  odds: number // u64 with basis 10,000
}

/**
 * Bet Slip - full parlay or single bet
 */
export type BetSlip = {
  slip_id: string
  bettor: string // address
  selections: Selection[]
  stake: number // u64 in USDC
  potential_payout: number // u64 in USDC
  status: BettingStatus
  placed_at: number // u64 timestamp
}

/**
 * Match details
 */
export type Match = {
  match_id: number // u64
  start_time: number // u64 unix timestamp
  status: MatchStatus
  current_exposure: number // u64 in USDC
}

/**
 * Market (1X2) odds for a match
 */
export type Market = {
  match_id: number // u64
  market_id: number // u8, typically 0
  odds: [number, number, number] // [home, draw, away] with basis 10,000
  suspended: boolean
}

/**
 * House pool state
 */
export type HousePool = {
  pool_address: string
  locked_payouts: number // u64 in USDC
  max_match_exposure: number // u64 in USDC
  admin: string // address
  paused: boolean
}

/**
 * LP Position
 */
export type LPState = {
  provider_address: string
  shares: number // u64 LP shares
  value_in_usdc: number // calculated (shares * reserve) / total_supply
}

// ============================================================================
// Entry Functions
// ============================================================================

/**
 * Place a bet or multi-leg parlay
 * 
 * @param user - Bettor's address
 * @param match_ids - Array of match IDs for each selection
 * @param market_ids - Array of market IDs (typically all 0 for 1X2)
 * @param outcome_ids - Array of outcomes (0=Home, 1=Draw, 2=Away)
 * @param stake_amount - Total stake in USDC (6 decimals)
 * 
 * @returns BetSlip with slip_id, potential payout, and ACTIVE status
 * 
 * Requirements:
 * - User must have approved contract to spend stake_amount of USDC
 * - stake_amount must be > 0
 * - All arrays must have same length
 * - House pool must have sufficient balance to cover max exposure
 */
export function place_bet(
  user: string,
  match_ids: number[],
  market_ids: number[],
  outcome_ids: BetOutcome[],
  stake_amount: number,
): BetSlip {
  // Implemented on contract side
  return {} as BetSlip
}

/**
 * Add liquidity to the house pool
 * 
 * @param provider - LP provider's address
 * @param amount - USDC amount to deposit (6 decimals)
 * 
 * Returns:
 * - Mints LP shares using ERC4626 formula: shares = (amount * total_supply) / reserve_balance
 * - For first depositor, shares equal amount (to prevent inflation attacks)
 * 
 * Requirements:
 * - Provider must have approved contract to spend amount of USDC
 * - amount must be > 0
 * - Pool must not be paused
 */
export function add_liquidity(provider: string, amount: number): void {
  // Implemented on contract side
}

/**
 * Request withdrawal of LP shares
 * 
 * @param provider - LP provider's address
 * @param shares - Number of LP shares to withdraw
 * 
 * Effects:
 * - Queues withdrawal request
 * - Shares are held in withdrawal queue
 * - Admin must process queue batch to complete withdrawal
 * 
 * Requirements:
 * - Provider must own at least 'shares' LP shares
 * - Pool must not be paused
 */
export function request_withdraw(provider: string, shares: number): void {
  // Implemented on contract side
}

/**
 * Settle a match and determine bet outcomes
 * 
 * @param admin - Admin/operator address
 * @param match_id - Match to settle
 * @param market_ids - Array of market IDs being settled
 * @param winning_outcome_ids - Array of winning outcomes for each market
 * @param signature_bytes - ED25519 signature from admin private key
 * 
 * Effects:
 * - Marks match as SETTLED
 * - Determines all affected bet slips (WON or LOST)
 * - Transfers winnings to bettors
 * - Returns house profits to LP pool
 * 
 * Requirements:
 * - Caller must be admin
 * - Signature must be valid ED25519 from admin key
 * - Match must be in OPEN or SUSPENDED status
 */
export function batch_settle_match(
  admin: string,
  match_id: number,
  market_ids: number[],
  winning_outcome_ids: BetOutcome[],
  signature_bytes: Uint8Array,
): void {
  // Implemented on contract side
}

// ============================================================================
// View Functions
// ============================================================================

/**
 * Get all active bet slips for a user
 * 
 * @param user_address - User's address
 * @returns Array of BetSlips with status ACTIVE (0)
 */
export function get_user_bets(user_address: string): BetSlip[] {
  return [] // Query against contract state
}

/**
 * Get LP share balance and value for a provider
 * 
 * @param provider_address - LP provider's address
 * @returns { shares, value_in_usdc }
 */
export function get_lp_balance(provider_address: string): LPState {
  return {} as LPState
}

/**
 * Get match details
 * 
 * @param match_id - Match ID
 * @returns Match with current exposure and status
 */
export function get_match(match_id: number): Match {
  return {} as Match
}

/**
 * Get 1X2 odds for a match
 * 
 * @param match_id - Match ID
 * @param market_id - Market ID (typically 0)
 * @returns [home_odds, draw_odds, away_odds] with basis 10,000
 */
export function get_market_odds(match_id: number, market_id: number): [number, number, number] {
  return [0, 0, 0]
}

/**
 * Get current house pool state
 * 
 * @returns HousePool with reserve balance, locked payouts, exposure limits
 */
export function get_pool_state(): HousePool {
  return {} as HousePool
}

/**
 * Get bet slip by ID
 * 
 * @param slip_id - Bet slip ID
 * @returns BetSlip or null if not found
 */
export function get_bet_slip(slip_id: string): BetSlip | null {
  return null
}

// ============================================================================
// Constants for Frontend
// ============================================================================

/**
 * Minimum stake amount (in USDC, 6 decimals)
 * e.g., 1000000 = 1 USDC
 */
export const MIN_STAKE_USDC = 1000000

/**
 * Maximum stake amount (in USDC, 6 decimals)
 * e.g., 1000000000 = 1000 USDC
 */
export const MAX_STAKE_USDC = 1000000000

/**
 * LP minimum initial deposit (in USDC, 6 decimals)
 * e.g., 1000000 = 1 USDC
 */
export const MIN_LP_DEPOSIT = 1000000

/**
 * Gas cost estimates (in native token)
 */
export const GAS_ESTIMATES = {
  place_bet: 150000,
  add_liquidity: 120000,
  request_withdraw: 100000,
  settle_match: 300000,
} as const
