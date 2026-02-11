import { Card, CardContent } from "@/components/ui/card";
import type { StatusData } from "@/types/dashboard";

interface USDCCardProps {
  status?: StatusData;
}

export function USDCCard({ status }: USDCCardProps) {
  const usdc = status?.usdc?.human;
  const idlePct = usdc && usdc.total > 0 ? ((usdc.idle / usdc.total) * 100).toFixed(1) : "—";

  return (
    <Card className="rounded-2xl border-border/30 bg-card/50 backdrop-blur">
      <CardContent className="p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          USDC Exposure
        </p>
        {usdc ? (
          <>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold tabular-nums text-foreground">${usdc.idle.toFixed(2)}</p>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Idle</p>
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums text-foreground">${usdc.lent.toFixed(2)}</p>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Lent</p>
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums text-foreground">${usdc.total.toFixed(2)}</p>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Total</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground">
                <span>Idle</span>
                <span>{idlePct}%</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-border/30">
                <div
                  className="h-full rounded-full bg-primary/80 transition-all duration-700"
                  style={{ width: `${idlePct}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <p className="text-[11px] text-muted-foreground/60">Awaiting data…</p>
        )}
      </CardContent>
    </Card>
  );
}
