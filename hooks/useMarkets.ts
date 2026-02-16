"use client";

import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { MARKET_ABI, MARKET_ADDRESS, TOKENS } from "@/lib/market";

export type RoundView = {
  token: `0x${string}`;
  roundId: bigint;
  startTime: number;
  endTime: number;
  upPool: bigint;
  downPool: bigint;
  settled: boolean;
  outcome: number;
  piPick: number;
  confidence: number;
  whyHash: `0x${string}`;
};

export function useMarkets(pollMs = 2000) {
  const publicClient = usePublicClient();
  const [rounds, setRounds] = useState<RoundView[]>([]);

  useEffect(() => {
    if (!publicClient) return;

    let alive = true;

    async function tick() {
      try {
        const roundIds = await Promise.all(
          TOKENS.map((t) =>
            publicClient.readContract({
              address: MARKET_ADDRESS,
              abi: MARKET_ABI,
              functionName: "activeRoundIdByToken",
              args: [t],
            })
          )
        );

        const filled = await Promise.all(
          roundIds.map(async (rid, i) => {
            const token = TOKENS[i];
            if (rid === 0n) {
              return {
                token,
                roundId: 0n,
                startTime: 0,
                endTime: 0,
                upPool: 0n,
                downPool: 0n,
                settled: false,
                outcome: 0,
                piPick: 0,
                confidence: 0,
                whyHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
              } as RoundView;
            }

            const r: any = await publicClient.readContract({
              address: MARKET_ADDRESS,
              abi: MARKET_ABI,
              functionName: "rounds",
              args: [rid],
            });

            return {
              token,
              roundId: rid,
              startTime: Number(r[1]),
              endTime: Number(r[2]),
              upPool: BigInt(r[5]),
              downPool: BigInt(r[6]),
              settled: Boolean(r[7]),
              outcome: Number(r[8]),
              piPick: Number(r[9]),
              whyHash: r[10],
              confidence: Number(r[11]),
            } as RoundView;
          })
        );

        if (alive) setRounds(filled);
      } catch {
        // ignore transient RPC errors
      }
    }

    tick();
    const id = setInterval(tick, pollMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [publicClient, pollMs]);

  return rounds;
}

