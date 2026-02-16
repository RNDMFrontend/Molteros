"use client";

import { useEffect, useRef } from "react";
import { parseEther } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { MARKET_ABI, MARKET_ADDRESS } from "@/lib/market";
import type { RoundView } from "./useMarkets";

export function useBetAndAutoClaim(rounds: RoundView[]) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const claiming = useRef<Record<string, boolean>>({});

  async function bet(roundId: bigint, side: "UP" | "DOWN", amountMon: string) {
    if (!walletClient) throw new Error("Connect wallet");
    const fn = side === "UP" ? "betUp" : "betDown";
    const hash = await walletClient.writeContract({
      address: MARKET_ADDRESS,
      abi: MARKET_ABI,
      functionName: fn,
      args: [roundId],
      value: parseEther(amountMon),
    });
    return hash;
  }

  // Auto-claim after settlement: attempt once per settled round.
  useEffect(() => {
    if (!address || !walletClient || !publicClient) return;

    async function maybeClaim(r: RoundView) {
      if (r.roundId === 0n) return;
      if (!r.settled) return;

      const key = `${address}-${r.roundId.toString()}`;
      if (claiming.current[key]) return;
      claiming.current[key] = true;

      try {
        // This will revert if nothing to claim; we swallow that.
        const hash = await walletClient.writeContract({
          address: MARKET_ADDRESS,
          abi: MARKET_ABI,
          functionName: "claim",
          args: [r.roundId],
        });
        // Optionally wait for receipt:
        await publicClient.waitForTransactionReceipt({ hash });
      } catch {
        // ignore (already claimed / nothing to claim / user rejected)
      } finally {
        // allow retry later if needed
        setTimeout(() => { claiming.current[key] = false; }, 15000);
      }
    }

    for (const r of rounds) {
      maybeClaim(r);
    }
  }, [address, walletClient, publicClient, rounds]);

  return { bet };
}

