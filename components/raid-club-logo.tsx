type PhantasmaBrandMarkProps = {
  className?: string
}

export function RaidClubBrandMark({ className = "" }: PhantasmaBrandMarkProps) {
  return (
    <div
      className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-[24px] border border-[#d7b37b]/18 bg-[#0f0d0a] shadow-[0_10px_30px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(243,238,228,0.05),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(215,179,123,0.12),transparent_38%)]" />
      <svg viewBox="0 0 100 100" className="relative h-full w-full">
        <defs>
          <linearGradient id="phantasmaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d7b37b" />
            <stop offset="100%" stopColor="#f3eee4" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#phantasmaGrad)" strokeWidth="1.5" opacity="0.3" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="url(#phantasmaGrad)" strokeWidth="1" opacity="0.2" />
        <text x="50" y="60" fontSize="24" fontWeight="bold" fill="url(#phantasmaGrad)" textAnchor="middle" fontFamily="monospace">Φ</text>
      </svg>
    </div>
  )
}

