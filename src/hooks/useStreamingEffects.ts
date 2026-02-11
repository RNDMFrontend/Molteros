import { useRef, useEffect, useState, useCallback } from "react";

/** Detects when a value changes and returns true for `durationMs` */
export function useFlash(value: unknown, durationMs = 600): boolean {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (prev.current !== undefined && prev.current !== value) {
      setFlash(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setFlash(false), durationMs);
    }
    prev.current = value;
    return () => clearTimeout(timer.current);
  }, [value, durationMs]);

  return flash;
}

export interface HistoryPoint {
  ts: number;
  score: number;
  priceUsd: number | null;
  virtualMon: number;
}

const MAX_HISTORY = 60;

/** Keeps a rolling 60-sample in-memory history for a given token address */
export function useTokenHistory(
  tokenAddress: string | undefined,
  score: number | undefined,
  priceUsd: number | null | undefined,
  virtualMon: string | undefined
) {
  const histories = useRef<Map<string, HistoryPoint[]>>(new Map());

  const getHistory = useCallback((): HistoryPoint[] => {
    if (!tokenAddress) return [];
    return histories.current.get(tokenAddress.toLowerCase()) ?? [];
  }, [tokenAddress]);

  useEffect(() => {
    if (!tokenAddress || score === undefined) return;
    const key = tokenAddress.toLowerCase();
    const arr = histories.current.get(key) ?? [];
    const mon = virtualMon ? Number(BigInt(virtualMon)) / 1e18 : 0;
    arr.push({ ts: Date.now(), score, priceUsd: priceUsd ?? null, virtualMon: mon });
    if (arr.length > MAX_HISTORY) arr.shift();
    histories.current.set(key, arr);
  }, [tokenAddress, score, priceUsd, virtualMon]);

  return getHistory();
}
