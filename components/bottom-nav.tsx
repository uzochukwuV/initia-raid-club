"use client"

import { useState } from "react"

export type NavItem = {
  id: string
  label: string
  icon: string
}

export type Page = "markets" | "live" | "my-bets" | "account"

type BottomNavProps = {
  currentPage: Page
  onPageChange: (page: Page) => void
}

const navItems: NavItem[] = [
  { id: "markets", label: "Markets", icon: "📊" },
  { id: "live", label: "Live", icon: "🔴" },
  { id: "my-bets", label: "My Bets", icon: "🎯" },
  { id: "account", label: "Account", icon: "👤" },
]

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#1a1a1a]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-around px-4 py-3 sm:px-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id as Page)}
            className={`flex flex-col items-center gap-1 py-2 px-3 transition ${
              currentPage === item.id
                ? "text-[#d7b37b]"
                : "text-[#8f877c] hover:text-[#b5ada0]"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
