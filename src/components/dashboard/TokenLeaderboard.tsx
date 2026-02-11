import { motion, AnimatePresence } from "framer-motion";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { SignalToken, NadToken } from "@/types/dashboard";

interface TokenLeaderboardProps {
  signals: SignalToken[];
  nadItems: NadToken[];
  onSelectToken: (token: SignalToken) => void;
  selectedAddress?: string;
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

export function TokenLeaderboard({ signals, nadItems, onSelectToken, selectedAddress }: TokenLeaderboardProps) {
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
    <div className="overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/20 hover:bg-transparent">
              <TableHead className="w-10 text-[9px] uppercase tracking-wider">#</TableHead>
              <TableHead className="text-[9px] uppercase tracking-wider">Token</TableHead>
              <TableHead className="text-right text-[9px] uppercase tracking-wider">Score</TableHead>
              <TableHead className="text-right text-[9px] uppercase tracking-wider">B / S</TableHead>
              <TableHead className="text-right text-[9px] uppercase tracking-wider">MON</TableHead>
              <TableHead className="text-right text-[9px] uppercase tracking-wider">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {enriched.map((t, i) => {
                const isSelected = selectedAddress?.toLowerCase() === t.token.toLowerCase();
                return (
                  <motion.tr
                    key={t.token}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    onClick={() => onSelectToken(t)}
                    className={`cursor-pointer border-border/10 transition-colors ${
                      isSelected
                        ? "bg-primary/5"
                        : "hover:bg-muted/5"
                    }`}
                  >
                    <TableCell className="font-mono text-[11px] text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-mono text-[11px] font-medium">
                      {t.symbol ?? shortenAddr(t.token)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px]">{t.score}</TableCell>
                    <TableCell className="text-right font-mono text-[11px] text-muted-foreground">
                      <span className="text-emerald-400">{t.buys}</span>
                      {" / "}
                      <span className="text-red-400">{t.sells}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px]">{toMon(t.virtualMon)}</TableCell>
                    <TableCell className="text-right font-mono text-[11px]">
                      {t.priceUsd != null ? `$${t.priceUsd.toFixed(4)}` : "—"}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
