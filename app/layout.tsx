import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "Phantasma Sportsbook",
  description:
    "An onchain sportsbook and prediction market built as a Move appchain on Initia. Place 1X2 bets and provide liquidity to the House Pool.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
