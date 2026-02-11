import { motion, AnimatePresence } from "framer-motion";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { SignalToken, NadToken } from "@/types/dashboard";

interface TokenLeaderboardProps {
  signals: SignalToken[];
  nadItems: NadToken[];
}

function shortenAddr(addr: string) {
  return addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

function toMon(virtualMon: string): string {
  try {
    const val = BigInt(virtualMon);
    const mon = Number(val) / 1e18;
    return mon < 0.01 ? mon.toExponential(2) : mon.toFixed(2);
  } catch {
    return "—";
  }
}

export function TokenLeaderboard({ signals, nadItems }: TokenLeaderboardProps) {
  const nadMap = new Map(
    nadItems.map((n) => [n.tokenAddress.toLowerCase(), n])
  );

  const enriched = signals.map((s) => {
    const nad = nadMap.get(s.token.toLowerCase());
    return {
      ...s,
      symbol: nad?.symbol && nad.symbol !== "UNKNOWN" ? nad.symbol : null,
      priceUsd: nad?.priceUsd ?? null,
    };
  });

  return (
    <div className="overflow-hidden rounded-lg border border-border/50 bg-card/60 backdrop-blur">
      <div className="border-b border-border/50 px-4 py-3">
        <h3 className="text-sm font-medium text-muted-foreground">Token Leaderboard</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="w-12 text-[10px] uppercase">#</TableHead>
              <TableHead className="text-[10px] uppercase">Token</TableHead>
              <TableHead className="text-right text-[10px] uppercase">Score</TableHead>
              <TableHead className="text-right text-[10px] uppercase">B / S / Net</TableHead>
              <TableHead className="text-right text-[10px] uppercase">MON</TableHead>
              <TableHead className="text-right text-[10px] uppercase">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {enriched.map((t, i) => (
                <motion.tr
                  key={t.token}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {t.symbol ?? shortenAddr(t.token)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{t.score}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    <span className="text-emerald-400">{t.buys}</span>
                    {" / "}
                    <span className="text-red-400">{t.sells}</span>
                    {" / "}
                    <span className="text-foreground">{t.net}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{toMon(t.virtualMon)}</TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {t.priceUsd != null ? `$${t.priceUsd.toFixed(4)}` : "—"}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
