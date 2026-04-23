"use client"

import { useState } from "react"
import { RaidClubBrandMark } from "@/components/raid-club-logo"
import { ActivityLog } from "@/features/profile/activity-log"
import { HomeBase } from "@/features/profile/home-base"
import { LeaderboardPanel } from "@/features/leaderboard/leaderboard-panel"
import { isMainnetRuntimeConfigured } from "@/lib/initia/config"
import { buildMockLeaderboard, usePhantasmaStore } from "@/lib/game/store"
import type { ActivityEntry, LeaderboardEntry, NativeFeatureStatus, Screen, UserProfile } from "@/lib/game/types"

const tabs: Array<{ id: Screen; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "betting", label: "Betting" },
  { id: "liquidity", label: "Liquidity" },
  { id: "leaderboard", label: "Board" },
  { id: "log", label: "Log" },
]

export function RaidClubApp() {
  return isMainnetRuntimeConfigured ? <MainnetPhantasmaApp /> : <MockPhantasmaApp />
}

type ControlAction = {
  label: string
  onClick: () => void
}

type ShellRuntime = {
  screen: Screen
  user: UserProfile
  activity: ActivityEntry[]
  nativeFeatures: NativeFeatureStatus
  leaderboard: LeaderboardEntry[]
  setScreen: (screen: Screen) => void
  connectWallet: () => void
  depositBalance: () => void
  addLiquidity: () => void
  requestWithdraw: () => void
  selectEvent: (eventId: number) => void
  resetDemo: () => void
  headerBadges: string[]
  identityTitle: string
  identityHelp: string
  footerTitle: string
  footerPoints: string[]
}

function MockPhantasmaApp() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const screen = usePhantasmaStore((s) => s.screen)
  const user = usePhantasmaStore((s) => s.user)
  const activity = usePhantasmaStore((s) => s.activity)
  const nativeFeatures = usePhantasmaStore((s) => s.nativeFeatures)
  const setScreen = usePhantasmaStore((s) => s.setScreen)
  const connectWallet = usePhantasmaStore((s) => s.connectWallet)
  const depositBalance = usePhantasmaStore((s) => s.depositBalance)
  const addLiquidity = usePhantasmaStore((s) => s.addLiquidity)
  const requestWithdraw = usePhantasmaStore((s) => s.requestWithdraw)
  const resetDemo = usePhantasmaStore((s) => s.resetDemo)
  const leaderboard = buildMockLeaderboard(user)

  const runtime: ShellRuntime = {
    screen,
    user,
    activity,
    nativeFeatures,
    leaderboard,
    setScreen,
    connectWallet: () => {
      if (!user.address) {
        connectWallet("0x1a2b3c4d5e6f7g8h9i0j")
      }
    },
    depositBalance: () => depositBalance(100),
    addLiquidity: () => addLiquidity(500),
    requestWithdraw: () => requestWithdraw(10),
    selectEvent: (eventId) => {
      setSelectedEventId(eventId)
      setScreen("betting")
    },
    resetDemo,
    headerBadges: ["Mainnet", "Phantasma", "Auto-signing"],
    identityTitle: "Sportsbook Status",
    identityHelp: "Connected to Phantasma prediction market.",
    footerTitle: "How to Play",
    footerPoints: [
      "1. Connect your wallet to the Phantasma appchain.",
      "2. Place 1X2 bets (Home/Draw/Away) against the shared House Pool.",
      "3. Build multi-leg parlays for higher payouts.",
      "4. Provide liquidity as an LP to earn returns.",
    ],
  }

  return <PhantasmaShell runtime={runtime} />
}

function MainnetPhantasmaApp() {
  return (
    <main className="raid-shell relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-noise" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1520px] items-center px-5 md:px-8 xl:px-10">
        <div className="w-full border-t border-white/10 pt-6">
          <p className="section-code text-[10px] text-[#8f877c]">Mainnet</p>
          <h1 className="editorial-title mt-4 text-[4rem] leading-[0.9] text-[#f3eee4] md:text-[5.5rem]">Phantasma</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#c7c0b5]">
            Connected to mainnet. Loading wallet state and market data from the Phantasma contract.
          </p>
        </div>
      </div>
    </main>
  )
}

type PhantasmaShellProps = {
  runtime: ShellRuntime
}

function PhantasmaShell({ runtime }: PhantasmaShellProps) {
  const identityActions: ControlAction[] = [
    { label: "Connect wallet", onClick: runtime.connectWallet },
    { label: "Deposit 100 USDC", onClick: runtime.depositBalance },
    { label: "Add liquidity", onClick: runtime.addLiquidity },
  ]

  return (
    <main className="raid-shell relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-noise" />

      <header className="border-b border-white/10">
        <div className="relative mx-auto flex w-full max-w-[1520px] items-center justify-between gap-8 px-5 py-6 md:px-8 xl:px-10">
          <div className="flex items-center gap-6">
            <RaidClubBrandMark className="h-14 w-14 flex-shrink-0" />
            <div className="border-l border-white/10 pl-6">
              <h1 className="font-bold text-[#f3eee4]">Phantasma</h1>
              <p className="text-xs text-[#8f877c]">Onchain Sportsbook</p>
            </div>
          </div>

          <div className="flex gap-2">
            {runtime.headerBadges.map((badge) => (
              <span key={badge} className="rounded bg-white/5 px-3 py-1 text-xs text-[#8f877c]">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex w-full max-w-[1520px] gap-6 px-5 py-8 md:px-8 xl:px-10">
        <div className="flex-1">
          {runtime.screen === "dashboard" && (
            <HomeBase
              user={runtime.user}
              nativeFeatures={runtime.nativeFeatures}
              onConnectWallet={runtime.connectWallet}
              onDepositBalance={runtime.depositBalance}
              onAddLiquidity={runtime.addLiquidity}
              onRequestWithdraw={runtime.requestWithdraw}
              onSelectEvent={runtime.selectEvent}
            />
          )}

          {runtime.screen === "leaderboard" && <LeaderboardPanel leaderboard={runtime.leaderboard} />}

          {runtime.screen === "log" && <ActivityLog entries={runtime.activity} />}

          {runtime.screen === "betting" && (
            <div className="rounded border border-white/10 bg-white/3 p-8 text-center">
              <p className="text-[#c7c0b5]">Betting panel coming soon</p>
            </div>
          )}

          {runtime.screen === "liquidity" && (
            <div className="rounded border border-white/10 bg-white/3 p-8 text-center">
              <p className="text-[#c7c0b5]">Liquidity management panel coming soon</p>
            </div>
          )}
        </div>

        <aside className="w-80 flex-shrink-0 space-y-6">
          <div className="paper-panel p-6">
            <p className="section-code text-[10px] text-[#8f877c]">{runtime.identityTitle}</p>
            <p className="editorial-title mt-4 text-[1.5rem] leading-[0.9] text-[#f3eee4]">
              {runtime.user.address ? `${runtime.user.address.slice(0, 6)}...${runtime.user.address.slice(-4)}` : "Disconnected"}
            </p>
            <p className="mt-3 text-[13px] leading-6 text-[#d0c8bb]">{runtime.identityHelp}</p>

            <div className="mt-6 flex flex-col gap-2">
              {identityActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="rounded bg-white/8 py-2 px-4 text-sm text-[#d7b37b] transition hover:bg-white/12"
                >
                  {action.label}
                </button>
              ))}
              <button
                onClick={runtime.resetDemo}
                className="mt-4 text-xs text-[#6b6460] underline transition hover:text-[#8f877c]"
              >
                Reset demo
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => runtime.setScreen(tab.id)}
                className={`rounded px-4 py-3 text-left text-sm transition ${
                  runtime.screen === tab.id ? "bg-white/8 text-[#f3eee4]" : "text-[#a9a193] hover:text-[#d0c8bb]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>
      </div>

      <footer className="border-t border-white/10">
        <div className="relative mx-auto w-full max-w-[1520px] px-5 py-8 md:px-8 xl:px-10">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="section-code text-[10px] text-[#8f877c]">{runtime.footerTitle}</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#d0c8bb]">
                {runtime.footerPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="section-code text-[10px] text-[#8f877c]">Quick Stats</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8f877c]">Balance</dt>
                  <dd className="font-mono text-[#d7b37b]">{runtime.user.balanceUSDC} USDC</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8f877c]">Win Rate</dt>
                  <dd className="font-mono text-[#d7b37b]">{Math.round(runtime.user.winRate * 100)}%</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8f877c]">LP Value</dt>
                  <dd className="font-mono text-[#d7b37b]">${runtime.user.lpValue}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
