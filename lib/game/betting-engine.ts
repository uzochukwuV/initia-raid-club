import type { Selection, BetSlip } from "./types"

const ODDS_BASIS = 10000

/**
 * Calculate combined odds for a parlay bet
 * Parlay odds = (odds1 / basis) × (odds2 / basis) × ... × stake
 */
export function calculateParlayCombinedOdds(selections: Selection[], oddsBasis: number = ODDS_BASIS): number {
  if (selections.length === 0) return 0

  let numerator = 1n
  let denominator = 1n

  for (const selection of selections) {
    numerator *= BigInt(selection.odds)
    denominator *= BigInt(oddsBasis)
  }

  return Number(numerator / denominator)
}

/**
 * Calculate potential payout for a bet slip
 * Payout = stake × combined_odds
 */
export function calculatePotentialPayout(stake: number, selections: Selection[], oddsBasis: number = ODDS_BASIS): number {
  if (selections.length === 0) return 0

  let combinedOdds = 1
  for (const selection of selections) {
    combinedOdds *= selection.odds / oddsBasis
  }

  return Math.floor(stake * combinedOdds)
}

/**
 * Calculate LP share value
 * Value = (shares × reserve_balance) / total_supply
 */
export function calculateLPShareValue(shares: number, totalSupply: number, reserveBalance: number): number {
  if (totalSupply === 0) return 0
  return Math.floor((shares * reserveBalance) / totalSupply)
}

/**
 * Calculate number of LP shares minted for a deposit
 * Shares = (deposit / reserve_balance) × total_supply
 */
export function calculateSharesMinted(depositAmount: number, reserveBalance: number, totalSupply: number): number {
  if (reserveBalance === 0) return depositAmount // For first depositor

  return Math.floor((depositAmount * totalSupply) / reserveBalance)
}

/**
 * Determine if a bet slip won or lost based on settlement outcomes
 * Returns 1 for WON, 2 for LOST
 */
export function settleBetSlip(
  slip: BetSlip,
  winningOutcomes: Map<string, number>,
): number {
  for (const selection of slip.selections) {
    const outcomeKey = `${selection.match_id}-${selection.market_id}`
    const winningOutcome = winningOutcomes.get(outcomeKey)

    if (winningOutcome === undefined || winningOutcome !== selection.outcome_id) {
      return 2 // LOST - one leg didn't match
    }
  }

  return 1 // WON - all legs matched
}

/**
 * Calculate house exposure for a set of bets
 * Exposure = sum of potential payouts if all bets win
 */
export function calculateHouseExposure(bets: BetSlip[]): Map<number, number> {
  const exposure = new Map<number, number>()

  for (const bet of bets) {
    for (const selection of bet.selections) {
      const currentExposure = exposure.get(selection.match_id) ?? 0
      exposure.set(selection.match_id, currentExposure + bet.potential_payout)
    }
  }

  return exposure
}

/**
 * Check if a new bet would exceed max exposure on any match
 */
export function wouldExceedMaxExposure(
  newBet: BetSlip,
  existingBets: BetSlip[],
  maxExposure: number,
): boolean {
  const currentExposure = calculateHouseExposure(existingBets)

  for (const selection of newBet.selections) {
    const matchExposure = currentExposure.get(selection.match_id) ?? 0
    if (matchExposure + newBet.potential_payout > maxExposure) {
      return true
    }
  }

  return false
}

/**
 * Format odds from contract basis (10000) to decimal display format
 * E.g., 200 becomes 2.00
 */
export function formatOddsToDecimal(odds: number, basis: number = ODDS_BASIS): string {
  return (odds / basis).toFixed(2)
}

/**
 * Convert decimal odds display back to contract basis
 * E.g., 2.00 becomes 200
 */
export function formatDecimalToOdds(decimal: number, basis: number = ODDS_BASIS): number {
  return Math.floor(decimal * basis)
}
