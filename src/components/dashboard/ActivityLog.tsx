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
    <div className="overflow-hidden rounded-lg border border-border/50 bg-card/60 backdrop-blur">
      <div className="border-b border-border/50 px-4 py-3">
        <h3 className="text-sm font-medium text-muted-foreground">Activity Log</h3>
      </div>
      <div className="flex flex-col gap-2 border-b border-border/30 p-3 sm:flex-row">
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="h-8 w-full rounded-md text-xs sm:w-40">
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
          className="h-8 rounded-md text-xs"
        />
      </div>
      <div className="max-h-80 overflow-y-auto">
        <AnimatePresence initial={false}>
          {filtered.slice(0, 50).map((item, i) => (
            <motion.div
              key={`${item.ts}-${item.stage}-${i}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 border-b border-border/10 px-4 py-2.5 last:border-0"
            >
              <Badge variant="outline" className="mt-0.5 shrink-0 rounded-md text-[10px] uppercase">
                {item.stage}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-foreground">{item.reason}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(item.ts), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-xs text-muted-foreground">No logs found</p>
        )}
      </div>
    </div>
  );
}
