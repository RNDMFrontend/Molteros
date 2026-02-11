import { useState } from "react";
import { motion } from "framer-motion";
import { TopNav } from "@/components/dashboard/TopNav";
import { IntentCards } from "@/components/dashboard/IntentCards";
import { USDCCard } from "@/components/dashboard/USDCCard";
import { TokenLeaderboard } from "@/components/dashboard/TokenLeaderboard";
import { BarChartPanel } from "@/components/dashboard/BarChartPanel";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { TokenDetail } from "@/components/dashboard/TokenDetail";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useStatus, useNadTop, useLogs } from "@/hooks/useDashboardData";
import type { SignalToken } from "@/types/dashboard";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function Dashboard() {
  const { data: status, isLoading: statusLoading } = useStatus();
  const { data: nadTop, isLoading: nadLoading } = useNadTop();
  const { data: logs, isLoading: logsLoading } = useLogs();
  const [selectedToken, setSelectedToken] = useState<SignalToken | null>(null);

  const signals = status?.signals?.top10 ?? [];
  const nadItems = nadTop?.items ?? [];
  const logItems = logs?.items ?? [];

  const firstLoad = statusLoading && !status;

  return (
    <div className="min-h-screen bg-background">
      <TopNav ts={status?.ts} isLoading={statusLoading} monPrice={status?.mon_price_usd} />

      {firstLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12">

            {/* LEFT COLUMN — Summary */}
            <motion.div className="space-y-6 lg:col-span-5" {...fadeUp}>
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur"
                >
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Decision Summary
                  </h3>
                  <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/70">
                    {status.decision_summary}
                  </pre>
                </motion.div>
              )}
            </motion.div>

            {/* RIGHT COLUMN — Live Feed */}
            <motion.div
              className="space-y-6 lg:col-span-7"
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 } as const}
            >
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
            </motion.div>
          </div>
        </div>
      )}

      <TokenDetail
        signal={selectedToken}
        nadItems={nadItems}
        onClose={() => setSelectedToken(null)}
      />
    </div>
  );
}
