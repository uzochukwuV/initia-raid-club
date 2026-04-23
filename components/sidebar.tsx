"use client"

import type { ReactNode } from "react"

type SidebarProps = {
  children: ReactNode
  isDragging?: boolean
}

export function Sidebar({ children, isDragging }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-80 border-r border-white/10 bg-[#0f0d0a]/95 backdrop-blur-md overflow-y-auto transition-transform z-30 ${
        isDragging ? "cursor-grabbing" : ""
      }`}
    >
      <div className="p-6 space-y-6">{children}</div>
    </aside>
  )
}
