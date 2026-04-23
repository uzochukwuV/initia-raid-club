"use client"

import { useState, useRef, useEffect } from "react"

export type Page = "markets" | "live" | "my-bets" | "account"

type TopNavProps = {
  currentPage: Page
  onPageChange: (page: Page) => void
  walletAddress?: string
  balance?: number
  onConnectWallet: () => void
}

const menuItems: Array<{ id: Page; label: string }> = [
  { id: "markets", label: "Markets" },
  { id: "live", label: "Live" },
  { id: "my-bets", label: "My Bets" },
  { id: "account", label: "Account" },
]

export function TopNav({
  currentPage,
  onPageChange,
  walletAddress,
  balance,
  onConnectWallet,
}: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMenuClick = (page: Page) => {
    onPageChange(page)
    setIsOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg text-[#1a1a1a]">Phantasma</h1>

          {/* Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-gray-100 transition"
            >
              <span>{menuItems.find((m) => m.id === currentPage)?.label || "Menu"}</span>
              <span className="text-xs">▼</span>
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition first:rounded-t-lg last:rounded-b-lg ${
                      currentPage === item.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-[#1a1a1a] hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wallet Button */}
        <button
          onClick={onConnectWallet}
          className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition"
        >
          {walletAddress ? (
            <>
              <span className="text-xs">{walletAddress.slice(0, 6)}...</span>
              {balance && (
                <span className="text-xs bg-white/20 rounded px-2 py-0.5">
                  {balance} USDC
                </span>
              )}
            </>
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>
    </header>
  )
}
