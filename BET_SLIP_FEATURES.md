# Phantasma Sportsbook - Real Wallet Integration & Bet Slip Implementation

## Features Implemented

### 1. Real Wallet Connection
- Integrated **wagmi hooks** (`useAccount`, `useConnect`, `useDisconnect`) with the existing Initia InterwovenKit provider
- Wallet button in top navigation now connects to real Initia wallets
- Displays connected wallet address (shortened format: `0x...xxxx`)
- Shows "Connect Wallet" when disconnected, address when connected
- Click to toggle connection/disconnection

### 2. Floating Bet Slip Tracker
- **Floating Action Button (FAB)** appears in bottom-right corner when selections are added
- Displays count of selections currently in bet slip (e.g., "BET SLIP 3")
- Blue background with hover scale animation
- Only visible when there are selections (count > 0)
- Click to open the bet slip modal

### 3. Bet Slip Modal
- **Sliding modal** that appears from the bottom when odds are clicked or floating button is tapped
- Shows all current selections with match details and odds
- Each selection shows:
  - Match ID and outcome (Home/Draw/Away)
  - Decimal odds display
  - Remove button to delete selection
- **Parlay Odds** calculation showing combined odds multiplier
- **Stake Input** field with:
  - Manual entry for custom amounts
  - Quick-stake buttons ($10, $25, $50, $100)
- **Payout Summary** showing stake and potential payout
- **Place Bet** button that:
  - Validates sufficient balance
  - Shows "Placing Bet..." loading state
  - Closes modal on successful placement
- Overlay click or X button to close without placing bet

### 4. Odds Click Integration
- Clicking any odds button (1, X, 2) on match rows now:
  - Adds selection to betting session
  - Automatically opens bet slip modal
  - Updates floating button count
  - Retrieves correct match odds from mock data

### 5. Design Consistency
- Maintains light theme throughout
- Clean, modern UI with blue accent color
- Responsive design (mobile-first)
- Smooth transitions and animations
- Follows existing Phantasma design patterns

## File Structure

```
components/
├── top-nav.tsx              # Updated with wagmi wallet integration
├── raid-club-app.tsx        # Wired bet slip and odds handling
├── floating-bet-slip.tsx    # FAB button component
├── bet-slip-modal.tsx       # Sliding modal with full bet slip UI
└── pages/
    └── account-page.tsx     # Removed wallet connect button (moved to nav)
```

## How It Works

1. **User Flow**:
   - Click wallet button in top-nav → Real wallet connection dialog
   - Click odds button on match → Selection added → Modal opens
   - Enter stake amount → See potential payout → Click Place Bet
   - Selection removed or placed → Floating button updates count

2. **State Management**:
   - Zustand store manages `bettingSession` with selections and stake
   - `addSelectionToBet` adds new selections
   - `removeSelectionFromBet` removes by index
   - `updateStake` updates bet amount
   - `placeBet` processes the bet and clears selections

3. **Wallet Integration**:
   - Wagmi hooks connect directly to Initia wallets
   - No manual wallet connection in store anymore
   - Wallet state managed by wagmi/InterwovenKit provider

## Next Steps
- Connect stake/payout calculations to real odds data
- Integrate actual bet placement logic with smart contract
- Add bet history and live bet tracking
- Implement parlay validation and settlement
