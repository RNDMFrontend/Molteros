import { TopNav } from "@/components/dashboard/TopNav";
import { IntentCards } from "@/components/dashboard/IntentCards";
import { USDCCard } from "@/components/dashboard/USDCCard";
import { TokenLeaderboard } from "@/components/dashboard/TokenLeaderboard";
import { BarChartPanel } from "@/components/dashboard/BarChartPanel";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { useStatus, useNadTop, useLogs } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { data: status, isLoading: statusLoading } = useStatus();
  const { data: nadTop } = useNadTop();
  const { data: logs } = useLogs();

  const signals = status?.signals?.top10 ?? [];
  const nadItems = nadTop?.items ?? [];
  const logItems = logs?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <TopNav ts={status?.ts} isLoading={statusLoading} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <IntentCards status={status} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <USDCCard status={status} />
          </div>
          <div className="lg:col-span-2">
            <BarChartPanel signals={signals} nadItems={nadItems} />
          </div>
        </div>

        <TokenLeaderboard signals={signals} nadItems={nadItems} />

        <ActivityLog items={logItems} />

        {status?.decision_summary && (
          <div className="rounded-lg border border-border/50 bg-card/60 p-4 backdrop-blur">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Decision Summary</h3>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/80">
              {status.decision_summary}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
