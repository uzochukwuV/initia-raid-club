"use client"

import type { PropsWithChildren } from "react"
import { useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  InterwovenKitProvider,
  MAINNET,
  initiaPrivyWalletConnector,
  injectStyles,
} from "@initia/interwovenkit-react"
import InterwovenKitStyles from "@initia/interwovenkit-react/styles.js"
import { createConfig, http, WagmiProvider } from "wagmi"
import { mainnet } from "wagmi/chains"
import { customPhantasmaChain, isMainnetRuntimeConfigured, phantasmaViemChain } from "@/lib/initia/config"

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: phantasmaViemChain ? [mainnet, phantasmaViemChain] : [mainnet],
  transports: phantasmaViemChain
    ? {
        [mainnet.id]: http(),
        [phantasmaViemChain.id]: http(phantasmaViemChain.rpcUrls.default.http[0]),
      }
    : { [mainnet.id]: http() },
})

export default function Providers({ children }: PropsWithChildren) {
  useEffect(() => {
    injectStyles(InterwovenKitStyles)
  }, [])

  if (!isMainnetRuntimeConfigured || !customPhantasmaChain) {
    return <>{children}</>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <InterwovenKitProvider
          {...MAINNET}
          defaultChainId={customPhantasmaChain.chain_id}
          customChain={customPhantasmaChain}
          enableAutoSign={{ [customPhantasmaChain.chain_id]: ["/minievm.evm.v1.MsgCall"] }}
          autoSignFeePolicy={{
            [customPhantasmaChain.chain_id]: {
              allowedFeeDenoms: customPhantasmaChain.fees.fee_tokens.map((token) => token.denom),
            },
          }}
          theme="dark"
        >
          {children}
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
