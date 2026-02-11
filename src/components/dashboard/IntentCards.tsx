import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StatusData } from "@/types/dashboard";

interface IntentCardsProps {
  status?: StatusData;
}

export function IntentCards({ status }: IntentCardsProps) {
  const llm = status?.llm?.intent;
  const decision = status?.decision?.intent;
  const executed = status?.decision?.executed;

  const isBlocked =
    decision?.action === "none" ||
    (llm && decision && (llm.action !== decision.action || llm.token !== decision.token));

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <motion.div layout transition={{ duration: 0.3 }}>
        <Card className="rounded-2xl border-border/30 bg-card/50 backdrop-blur">
          <CardContent className="space-y-2.5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              LLM Suggested
            </p>
            {llm ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-lg font-mono text-[10px] uppercase">
                    {llm.action}
                  </Badge>
                  {llm.token && (
                    <span className="font-mono text-xs text-foreground">{llm.token.slice(0, 8)}…</span>
                  )}
                </div>
                {llm.amount_usdc != null && (
                  <p className="text-[11px] text-muted-foreground">
                    Amount: <span className="text-foreground">${llm.amount_usdc.toFixed(2)}</span>
                  </p>
                )}
                <p className="text-[11px] leading-relaxed text-muted-foreground">{llm.reason}</p>
              </>
            ) : (
              <p className="text-[11px] text-muted-foreground/60">Awaiting data…</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div layout transition={{ duration: 0.3 }}>
        <Card
          className={`rounded-2xl backdrop-blur ${
            isBlocked
              ? "border-destructive/20 bg-destructive/5"
              : "border-border/30 bg-card/50"
          }`}
        >
          <CardContent className="space-y-2.5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Final Executed
              </p>
              {isBlocked && (
                <Badge variant="destructive" className="rounded-lg text-[9px] uppercase tracking-wider">
                  Blocked
                </Badge>
              )}
            </div>
            {decision ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-lg font-mono text-[10px] uppercase">
                    {decision.action}
                  </Badge>
                  {decision.token && (
                    <span className="font-mono text-xs text-foreground">{decision.token.slice(0, 8)}…</span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{decision.reason}</p>
                {executed === null && (
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Not executed</p>
                )}
              </>
            ) : (
              <p className="text-[11px] text-muted-foreground/60">Awaiting data…</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
