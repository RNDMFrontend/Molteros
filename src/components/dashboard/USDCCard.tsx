import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatusData } from "@/types/dashboard";

interface USDCCardProps {
  status?: StatusData;
}

export function USDCCard({ status }: USDCCardProps) {
  const usdc = status?.usdc?.human;
  const idlePct = usdc && usdc.total > 0 ? ((usdc.idle / usdc.total) * 100).toFixed(1) : "—";

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">USDC Exposure</CardTitle>
      </CardHeader>
      <CardContent>
        {usdc ? (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">${usdc.idle.toFixed(2)}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Idle</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">${usdc.lent.toFixed(2)}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">${usdc.total.toFixed(2)}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No data</p>
        )}
        {usdc && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Idle %</span>
              <span>{idlePct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${idlePct}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
