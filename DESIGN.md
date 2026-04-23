# Phantasma UI Redesign - Modern Sports Betting Layout

## Overview
Redesigned the Phantasma Sportsbook interface with a modern, multi-page layout matching contemporary sports betting platforms. The new design features a horizontal match row structure, collapsible league groupings, draggable sidebar, and Apple-style bottom navigation bar.

## Design System

### Color Palette
- **Background**: `#0f0d0a` (Deep black)
- **Accents**: `#d7b37b` (Gold)
- **Text Primary**: `#f3eee4` (Light cream)
- **Text Muted**: `#8f877c` (Muted brown)
- **Borders**: `rgba(243, 238, 228, 0.12)` (Subtle white)

### Layout Structure

#### Header (Fixed)
- Sticky header with Phantasma logo and brand
- Shows wallet connection status
- Demo/mainnet indicator

#### Sidebar (320px Fixed)
- Left sidebar on desktop (hidden on mobile)
- Draggable (ready for implementation)
- Contains:
  - Account info
  - Quick stats (balance, win rate, LP shares)
  - Reset demo button
- Stays in place while content scrolls

#### Main Content (Responsive)
- Adaptive width: full width on mobile, left-padded on desktop
- Accommodates sidebar layout
- Padding for header and bottom nav

#### Bottom Navigation (Fixed Apple-style)
- Fixed bottom bar with 4 main sections:
  - 📊 Markets - All available markets
  - 🔴 Live - Currently live matches
  - 🎯 My Bets - User's placed bets
  - 👤 Account - Account settings & actions

### Components

#### MatchRow
Displays a single match in horizontal layout:
```
| Time/Status | Home vs Away | Odds1 | OddsX | Odds2 |
```

Features:
- Time display (formatted HH:MM) or "LIVE" badge
- Red pulsing dot for live indicators
- Team names with league
- Three odds buttons (1, X, 2)
- Hover effects for interactivity

#### MatchGroups
Groups matches by sport/league with collapsible headers:
- League header with match count
- Collapse/expand toggle (+/−)
- Nested match rows with indentation
- Smooth transitions

#### Pages

**Markets Page**
- Grouped by sport
- All upcoming matches
- Collapsible league sections

**Live Page**
- Red indicator with pulsing animation
- Only currently live matches
- Same row layout

**My Bets Page**
- User's betting history
- Placeholder for active bets

**Account Page**
- Balance, win rate, LP stats in grid
- Action buttons (connect, deposit, add liquidity)
- Responsive card layout

### Responsive Design

**Desktop (1024px+)**
- Sidebar visible (320px fixed)
- Main content offset by sidebar
- Full header width

**Tablet (768px-1023px)**
- Sidebar visible but narrower on smaller tablets
- Main content adjusts

**Mobile (< 768px)**
- Sidebar hidden (only visible on tap)
- Full-width main content
- Bottom nav remains fixed
- Content takes priority

## Key Features

1. **Match Row Structure**: Clean, scannable horizontal cards with all essential info
2. **League Grouping**: Organize matches by sport/league with collapsible sections
3. **Quick Odds**: Direct odds buttons (1, X, 2) for fast betting
4. **Status Indicators**: Live badges and time displays for context
5. **Draggable Sidebar**: Ready for touch interactions (framework in place)
6. **Apple-Style Nav**: Modern bottom navigation with icons and labels
7. **Clean Aesthetics**: Dark theme with gold accents, minimal visual noise
8. **Accessibility**: Clear typography hierarchy, proper contrast, readable text

## Files Structure

```
components/
├── bottom-nav.tsx           # Apple-style bottom navigation
├── match-row.tsx            # Single match display
├── match-groups.tsx         # Grouped matches by league
├── sidebar.tsx              # Fixed left sidebar
└── pages/
    ├── markets-page.tsx     # All markets grouped by sport
    ├── live-page.tsx        # Live matches only
    ├── my-bets-page.tsx     # User's bets
    └── account-page.tsx     # Account settings
```

## Animation & Interactions

- **Hover Effects**: Subtle border and background changes on interactive elements
- **Live Indicator**: Pulsing red dot animation for live matches
- **Collapse Animation**: Smooth transitions on league expand/collapse
- **Button Feedback**: Visual feedback on odds button clicks
- **Responsive**: All responsive transitions are smooth with backdrop blur on header

## Next Steps for Enhancement

1. Implement actual dragging for sidebar (currently framework-ready)
2. Add parlay builder with bet slip persistence
3. Implement real-time odds updates via WebSocket
4. Add settlement animations for resolved bets
5. Create bet placement flow with confirmation
6. Add filtering and sorting options
7. Implement LP management interface
8. Create detailed match pages with statistics
