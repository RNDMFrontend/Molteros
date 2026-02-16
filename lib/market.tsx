import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { defineChain } from "viem";

export const monadChain = defineChain({
  id: 143,
  name: "Monad",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_MONAD_RPC || ""] },
    public: { http: [process.env.NEXT_PUBLIC_MONAD_RPC || ""] },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.monad.xyz" }, // adjust if you use a different explorer
  },
});

export const wagmiConfig = getDefaultConfig({
  appName: "Molter Markets",
  projectId: "molter-hackathon", // for WalletConnect you’ll want a real projectId later; RainbowKit will still work with injected wallets
  chains: [monadChain],
  transports: {
    [monadChain.id]: http(process.env.NEXT_PUBLIC_MONAD_RPC),
  },
});

