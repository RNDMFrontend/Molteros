import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface TopNavProps {
  ts?: string;
  isLoading: boolean;
  monPrice?: number;
}

export function TopNav({ ts, isLoading, monPrice }: TopNavProps) {
  const staleness = ts ? formatDistanceToNow(new Date(ts), { addSuffix: true }) : "—";
  const isStale = ts ? Date.now() - new Date(ts).getTime() > 30000 : true;

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-11 max-w-[1600px] items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-bold tracking-tight text-foreground">
            Molter<span className="text-primary"> OS</span>
          </Link>
          <Link
            to="/insights"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Insights
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {monPrice != null && (
            <span className="rounded-lg border border-border/40 bg-card/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              MON <span className="text-foreground">${monPrice.toFixed(4)}</span>
            </span>
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
