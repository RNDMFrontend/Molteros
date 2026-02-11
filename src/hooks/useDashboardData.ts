import { useQuery } from "@tanstack/react-query";
import type { StatusData, NadTopResponse, LogsResponse } from "@/types/dashboard";

export function useStatus() {
  return useQuery<StatusData>({
    queryKey: ["status"],
    queryFn: () => fetch("/api/status").then((r) => r.json()),
    refetchInterval: 4000,
  });
}

export function useNadTop() {
  return useQuery<NadTopResponse>({
    queryKey: ["nad-top"],
    queryFn: () => fetch("/api/nad/top?limit=10").then((r) => r.json()),
    refetchInterval: 12000,
  });
}

export function useLogs() {
  return useQuery<LogsResponse>({
    queryKey: ["logs"],
    queryFn: () => fetch("/api/logs?limit=200").then((r) => r.json()),
    refetchInterval: 7000,
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ["insights"],
    queryFn: () => fetch("/api/insights").then((r) => r.json()),
  });
}
