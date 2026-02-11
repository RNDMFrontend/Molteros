import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import type { SignalToken, NadToken } from "@/types/dashboard";

interface BarChartPanelProps {
  signals: SignalToken[];
  nadItems: NadToken[];
}

function shortenAddr(addr: string) {
  return addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

const COLORS = [
  "hsl(350, 80%, 55%)",
  "hsl(200, 70%, 55%)",
  "hsl(160, 60%, 45%)",
  "hsl(45, 80%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(20, 75%, 55%)",
  "hsl(120, 50%, 45%)",
  "hsl(330, 65%, 50%)",
  "hsl(220, 60%, 55%)",
  "hsl(60, 70%, 50%)",
];

export function BarChartPanel({ signals, nadItems }: BarChartPanelProps) {
  const nadMap = new Map(
    nadItems.map((n) => [n.tokenAddress.toLowerCase(), n])
  );

  const { data, label } = useMemo(() => {
    const enriched = signals.map((s) => {
      const nad = nadMap.get(s.token.toLowerCase());
      const symbol = nad?.symbol && nad.symbol !== "UNKNOWN" ? nad.symbol : shortenAddr(s.token);
      return {
        name: symbol,
        priceUsd: nad?.priceUsd ?? null,
        score: s.score,
        mon: Number(BigInt(s.virtualMon || "0")) / 1e18,
      };
    });

    const hasPrices = enriched.some((e) => e.priceUsd != null);
    if (hasPrices) {
      return {
        data: enriched.map((e) => ({ ...e, value: e.priceUsd ?? 0 })),
        label: "Price (USD)",
      };
    }
    return {
      data: enriched.map((e) => ({ ...e, value: e.score })),
      label: "Score",
    };
  }, [signals, nadItems]);

  return (
    <Card className="rounded-2xl border-border/30 bg-card/50 backdrop-blur">
      <CardContent className="p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 20, left: 4 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "hsl(0,0%,45%)" }}
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 9, fill: "hsl(0,0%,45%)" }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(0,0%,8%)",
                  border: "1px solid hsl(0,0%,15%)",
                  borderRadius: 12,
                  fontSize: 11,
                }}
                labelStyle={{ color: "hsl(0,0%,50%)" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={600}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
