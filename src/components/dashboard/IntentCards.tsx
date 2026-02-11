import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="grid gap-4 md:grid-cols-2">
      <motion.div layout transition={{ duration: 0.3 }}>
        <Card className="border-border/50 bg-card/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              LLM Suggested
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {llm ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-md font-mono text-xs uppercase">
                    {llm.action}
                  </Badge>
                  {llm.token && (
                    <span className="font-mono text-sm text-foreground">{llm.token.slice(0, 8)}…</span>
                  )}
                </div>
                {llm.amount_usdc != null && (
                  <p className="text-xs text-muted-foreground">
                    Amount: <span className="text-foreground">${llm.amount_usdc.toFixed(2)}</span>
                  </p>
                )}
                <p className="text-xs leading-relaxed text-muted-foreground">{llm.reason}</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div layout transition={{ duration: 0.3 }}>
        <Card className={`border-border/50 backdrop-blur ${isBlocked ? "bg-destructive/5 border-destructive/30" : "bg-card/60"}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Final Executed
              </CardTitle>
              {isBlocked && (
                <Badge variant="destructive" className="rounded-md text-[10px] uppercase tracking-wider">
                  Policy Blocked
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {decision ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-md font-mono text-xs uppercase">
                    {decision.action}
                  </Badge>
                  {decision.token && (
                    <span className="font-mono text-sm text-foreground">{decision.token.slice(0, 8)}…</span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{decision.reason}</p>
                {executed === null && (
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Not executed</p>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
