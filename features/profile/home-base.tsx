import { Panel } from "@/components/panel"
import { ProgressBar } from "@/components/progress-bar"
import { mockSportEvents } from "@/lib/game/data"
import type { NativeFeatureStatus, UserProfile, SportEvent } from "@/lib/game/types"

type HomeBaseProps = {
  user: UserProfile
  nativeFeatures: NativeFeatureStatus
  onConnectWallet: () => void
  onDepositBalance: () => void
  onAddLiquidity: () => void
  onRequestWithdraw: () => void
  onSelectEvent: (eventId: number) => void
}

export function HomeBase({
  user,
  nativeFeatures,
  onConnectWallet,
  onDepositBalance,
  onAddLiquidity,
  onRequestWithdraw,
  onSelectEvent,
}: HomeBaseProps) {
  const winRatePercent = Math.round(user.winRate * 100)
  const nextEventTime = mockSportEvents.length > 0 ? new Date(mockSportEvents[0].start_time * 1000).toLocaleTimeString() : "—"

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Panel eyebrow="Sportsbook" title="Your Account" accent="orange">
          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="border-t border-white/10 pt-4">
              <p className="section-code text-[10px] text-[#8f877c]">Wallet Status</p>
              <p className="editorial-title mt-4 text-[2rem] leading-[0.92] text-[#f3eee4]">
                {user.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : "Not connected"}
              </p>
              <p className="mt-3 text-[15px] leading-7 text-[#d0c8bb]">
                {user.address ? "Ready to bet and provide liquidity" : "Connect your wallet to get started"}
              </p>

              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-[#8f877c]">Auto-signing</dt>
                  <dd className="text-[#f3eee4]">{nativeFeatures.autoSigningArmed ? "Armed" : "Offline"}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-[#8f877c]">Wallet</dt>
                  <dd className="text-[#f3eee4]">{nativeFeatures.walletConnected ? "Connected" : "Disconnected"}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-[#8f877c]">Bridge</dt>
                  <dd className="text-[#f3eee4]">{nativeFeatures.bridgeConnected ? "Ready" : "Offline"}</dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="section-code text-[10px] text-[#8f877c]">Quick Actions</p>
              <p className="mt-4 text-[15px] leading-7 text-[#d0c8bb]">Manage your balance and liquidity.</p>
              <div className="mt-5 flex flex-col gap-3">
                <button
                  onClick={onConnectWallet}
                  className="border-b border-white/10 pb-3 text-left text-[15px] text-[#d7b37b] transition hover:text-[#f3eee4]"
                >
                  {user.address ? "Wallet connected" : "Connect wallet"}
                </button>
                <button
                  onClick={onDepositBalance}
                  disabled={!user.address}
                  className="border-b border-white/10 pb-3 text-left text-[15px] text-[#d7b37b] transition hover:text-[#f3eee4] disabled:text-[#6b6460] disabled:cursor-not-allowed"
                >
                  Deposit 100 USDC
                </button>
                <button
                  onClick={onAddLiquidity}
                  disabled={!user.address}
                  className="border-b border-white/10 pb-3 text-left text-[15px] text-[#d7b37b] transition hover:text-[#f3eee4] disabled:text-[#6b6460] disabled:cursor-not-allowed"
                >
                  Add liquidity
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="section-code text-[10px] text-[#8f877c]">Balance</p>
                  <p className="editorial-title mt-3 text-[2.1rem] text-[#f3eee4]">{user.balanceUSDC}</p>
                </div>
                <p className="text-[13px] text-[#a9a193]">USDC</p>
              </div>
              <div className="mt-4">
                <ProgressBar value={Math.min(user.balanceUSDC, 1000)} max={1000} tone="blue" />
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="section-code text-[10px] text-[#8f877c]">Win Rate</p>
                  <p className="editorial-title mt-3 text-[2.1rem] text-[#f3eee4]">{winRatePercent}%</p>
                </div>
                <p className="text-[13px] text-[#a9a193]">{user.totalBetsPlaced} bets</p>
              </div>
              <div className="mt-4">
                <ProgressBar value={winRatePercent} max={100} tone="green" />
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="section-code text-[10px] text-[#8f877c]">LP Position</p>
              <p className="editorial-title mt-3 text-[2.1rem] text-[#f3eee4]">{user.lpShares}</p>
              <p className="mt-2 text-[15px] leading-7 text-[#d0c8bb]">Shares earning returns.</p>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Featured Market" title="Top Match" accent="blue">
          <div className="border-t border-white/10 pt-4">
            {mockSportEvents.length > 0 ? (
              <>
                <p className="section-code text-[10px] text-[#8f877c]">{mockSportEvents[0].sport}</p>
                <p className="mt-4 text-[15px] leading-7 text-[#d0c8bb]">
                  {mockSportEvents[0].homeTeam} vs {mockSportEvents[0].awayTeam}
                </p>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="section-code text-[10px] text-[#8f877c]">Current Odds (1X2)</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div className="p-2 rounded border border-white/10">
                      <p className="text-[#8f877c] text-xs">Home</p>
                      <p className="text-[#d7b37b] font-mono mt-1">{(mockSportEvents[0].odds[0] / 10000).toFixed(2)}</p>
                    </div>
                    <div className="p-2 rounded border border-white/10">
                      <p className="text-[#8f877c] text-xs">Draw</p>
                      <p className="text-[#d7b37b] font-mono mt-1">{(mockSportEvents[0].odds[1] / 10000).toFixed(2)}</p>
                    </div>
                    <div className="p-2 rounded border border-white/10">
                      <p className="text-[#8f877c] text-xs">Away</p>
                      <p className="text-[#d7b37b] font-mono mt-1">{(mockSportEvents[0].odds[2] / 10000).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="section-code text-[10px] text-[#8f877c]">Start Time</p>
                  <p className="mt-3 text-[15px] leading-7 text-[#d0c8bb]">{nextEventTime}</p>
                </div>
              </>
            ) : (
              <p className="text-[#a9a193]">No markets available</p>
            )}
          </div>

          <button
            onClick={() => onSelectEvent(mockSportEvents[0]?.match_id || 0)}
            disabled={mockSportEvents.length === 0}
            className="mt-5 text-[15px] text-[#d7b37b] underline underline-offset-4 disabled:text-[#6b6460] disabled:cursor-not-allowed"
          >
            Place bet on this match
          </button>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {mockSportEvents.map((event: SportEvent) => (
          <button
            key={event.match_id}
            onClick={() => onSelectEvent(event.match_id)}
            className="paper-panel p-5 text-left transition hover:border-white/20"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-code text-[10px] text-[#8f877c]">{event.sport}</p>
                <h3 className="editorial-title mt-4 text-[1.3rem] leading-[0.92] text-[#f3eee4]">
                  {event.homeTeam} vs {event.awayTeam}
                </h3>
              </div>
              <span className="text-[13px] text-[#a9a193]">1X2</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-[#8f877c]">Home</p>
                <p className="mt-1 text-[#d7b37b] font-mono">{(event.odds[0] / 10000).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[#8f877c]">Draw</p>
                <p className="mt-1 text-[#d7b37b] font-mono">{(event.odds[1] / 10000).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[#8f877c]">Away</p>
                <p className="mt-1 text-[#d7b37b] font-mono">{(event.odds[2] / 10000).toFixed(2)}</p>
              </div>
            </div>
            <p className="mt-5 text-[13px] uppercase tracking-[0.16em] text-[#d7b37b]">Build parlay</p>
          </button>
        ))}
      </div>
    </div>
  )
}

