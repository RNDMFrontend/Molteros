import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { LogItem } from "@/types/dashboard";

interface ActivityLogProps {
  items: LogItem[];
}

export function ActivityLog({ items }: ActivityLogProps) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const stages = useMemo(
    () => Array.from(new Set(items.map((i) => i.stage))).sort(),
    [items]
  );

  const filtered = useMemo(() => {
    let result = [...items].sort(
      (a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()
    );
    if (stageFilter !== "all") {
      result = result.filter((i) => i.stage === stageFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.stage.toLowerCase().includes(q) ||
          i.reason.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, stageFilter, search]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur">
      <div className="flex flex-col gap-2 border-b border-border/20 p-3 sm:flex-row">
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="h-7 w-full rounded-lg border-border/30 bg-background/40 text-[11px] sm:w-36">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {stages.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search logs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 rounded-lg border-border/30 bg-background/40 text-[11px]"
        />
      </div>
      <div className="max-h-72 overflow-y-auto">
        <AnimatePresence initial={false}>
          {filtered.slice(0, 50).map((item, i) => (
            <motion.div
              key={`${item.ts}-${item.stage}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-3 border-b border-border/10 px-4 py-2 last:border-0"
            >
              <Badge variant="outline" className="mt-0.5 shrink-0 rounded-lg border-border/20 text-[9px] uppercase tracking-wider">
                {item.stage}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] text-foreground/80">{item.reason}</p>
                <p className="text-[9px] text-muted-foreground">
                  {formatDistanceToNow(new Date(item.ts), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-[11px] text-muted-foreground/50">No logs found</p>
        )}
      </div>
    </div>
  );
}
