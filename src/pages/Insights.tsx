import { useInsights } from "@/hooks/useDashboardData";
import { TopNav } from "@/components/dashboard/TopNav";
import { useStatus } from "@/hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

function renderValue(val: unknown, depth = 0): React.ReactNode {
  if (val === null || val === undefined) return <span className="text-muted-foreground">—</span>;
  if (typeof val === "string") return <span className="text-foreground">{val}</span>;
  if (typeof val === "number") return <span className="font-mono text-foreground">{val}</span>;
  if (typeof val === "boolean") return <span className="text-foreground">{val ? "Yes" : "No"}</span>;
  if (Array.isArray(val)) {
    return (
      <div className="space-y-1 pl-3">
        {val.map((item, i) => (
          <div key={i} className="border-l border-border/30 pl-3">
            {renderValue(item, depth + 1)}
          </div>
        ))}
      </div>
    );
  }
  if (typeof val === "object") {
    return (
      <div className="space-y-1.5 pl-3">
        {Object.entries(val as Record<string, unknown>).map(([key, v]) => (
          <div key={key}>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{key}</span>
            <div className="mt-0.5">{renderValue(v, depth + 1)}</div>
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(val)}</span>;
}

export default function Insights() {
  const { data: status } = useStatus();
  const { data: insights, isLoading, error } = useInsights();

  return (
    <div className="min-h-screen bg-background">
      <TopNav ts={status?.ts} isLoading={false} />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <h2 className="text-2xl font-bold text-foreground">Insights</h2>
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-destructive">Failed to load insights.</p>}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-border/50 bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">API Response</CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                {renderValue(insights)}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
