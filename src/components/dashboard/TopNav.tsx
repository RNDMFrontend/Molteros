import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface TopNavProps {
  ts?: string;
  isLoading: boolean;
}

export function TopNav({ ts, isLoading }: TopNavProps) {
  const staleness = ts ? formatDistanceToNow(new Date(ts), { addSuffix: true }) : "—";
  const isStale = ts ? Date.now() - new Date(ts).getTime() > 30000 : true;

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Molter<span className="text-primary"> OS</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <motion.div
              className={`h-2 w-2 rounded-full ${isStale ? "bg-destructive" : "bg-emerald-500"}`}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span className="text-muted-foreground">
              {isLoading ? "Connecting…" : staleness}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
