import { useState } from "react";
import { TopNav } from "@/components/dashboard/TopNav";
import { IntentCards } from "@/components/dashboard/IntentCards";
import { USDCCard } from "@/components/dashboard/USDCCard";
import { TokenLeaderboard } from "@/components/dashboard/TokenLeaderboard";
import { BarChartPanel } from "@/components/dashboard/BarChartPanel";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { TokenDetail } from "@/components/dashboard/TokenDetail";
import { useStatus, useNadTop, useLogs } from "@/hooks/useDashboardData";
import type { SignalToken } from "@/types/dashboard";

export default function Dashboard() {
  const { data: status, isLoading: statusLoading } = useStatus();
  const { data: nadTop } = useNadTop();
  const { data: logs } = useLogs();
  const [selectedToken, setSelectedToken] = useState<SignalToken | null>(null);

  const signals = status?.signals?.top10 ?? [];
  const nadItems = nadTop?.items ?? [];
  const logItems = logs?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <TopNav ts={status?.ts} isLoading={statusLoading} monPrice={status?.mon_price_usd} />

      <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">
        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-12">

          {/* LEFT COLUMN — Summary */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Summary
              </h2>
              <div className="space-y-4">
                <IntentCards status={status} />
                <USDCCard status={status} />
                <BarChartPanel signals={signals} nadItems={nadItems} />
              </div>
            </div>

            {status?.decision_summary && (
              <div className="rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Decision Summary
                </h3>
                <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/70">
                  {status.decision_summary}
                </pre>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Live Feed */}
          <div className="space-y-6 lg:col-span-7">
            <div>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Live Feed
              </h2>
              <div className="space-y-4">
                <TokenLeaderboard
                  signals={signals}
                  nadItems={nadItems}
                  onSelectToken={setSelectedToken}
                  selectedAddress={selectedToken?.token}
                />
                <ActivityLog items={logItems} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Token Detail Panel */}
      <TokenDetail
        signal={selectedToken}
        nadItems={nadItems}
        onClose={() => setSelectedToken(null)}
      />
    </div>
  );
}
