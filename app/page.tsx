"use client"

import { useEffect, useState } from "react"
import { RaidClubApp } from "@/components/raid-club-app"

function LoadingShell() {
  return (
    <main className="raid-shell relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 grid-noise" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1520px] items-center px-5 md:px-8 xl:px-10">
        <div className="w-full border-t border-gray-200 pt-6">
          <p className="section-code text-[10px] text-gray-600">Loading</p>
          <h1 className="editorial-title mt-4 text-[4rem] leading-[0.9] text-[#1a1a1a] md:text-[5.5rem]">Phantasma</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600">
            An onchain sportsbook and prediction market on Initia Move appchain. Initializing wallet and market data.
          </p>
        </div>
      </div>
    </main>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingShell />
  }

  return <RaidClubApp />
}
