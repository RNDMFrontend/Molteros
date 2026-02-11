import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useFlash } from "@/hooks/useStreamingEffects";

interface TopNavProps {
  ts?: string;
  isLoading: boolean;
  monPrice?: number;
}

export function TopNav({ ts, isLoading, monPrice }: TopNavProps) {
  const staleness = ts ? formatDistanceToNow(new Date(ts), { addSuffix: true }) : "—";
  const isStale = ts ? Date.now() - new Date(ts).getTime() > 30000 : true;
  const priceFlash = useFlash(monPrice);

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-11 max-w-[1600px] items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-bold tracking-tight text-foreground">
            Molter<span className="text-primary"> OS</span>
          </Link>
          <span className="hidden sm:inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/80">
            Raspberry Pi 5
          </span>
          <Link
            to="/insights"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Insights
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {monPrice != null && (
            <motion.span
              animate={priceFlash ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors duration-500 ${
                priceFlash
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border/40 bg-card/50 text-muted-foreground"
              }`}
            >
              MON <span className="text-foreground">${monPrice.toFixed(4)}</span>
            </motion.span>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/50 px-2.5 py-1">
            <motion.div
              className={`h-1.5 w-1.5 rounded-full ${isStale ? "bg-destructive" : "bg-emerald-500"}`}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="text-[11px] text-muted-foreground">
              {isLoading ? "…" : staleness}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
