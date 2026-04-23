"use client"

type FloatingBetSlipProps = {
  count: number
  onClick: () => void
}

export function FloatingBetSlip({ count, onClick }: FloatingBetSlipProps) {
  if (count === 0) return null

  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-30 flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:scale-110"
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs font-bold">BET SLIP</span>
        <span className="text-lg font-bold">{count}</span>
      </div>
    </button>
  )
}
