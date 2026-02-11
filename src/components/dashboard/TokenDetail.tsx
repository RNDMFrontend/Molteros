import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SignalToken, NadToken } from "@/types/dashboard";

interface TokenDetailProps {
  signal: SignalToken | null;
  nadItems: NadToken[];
  onClose: () => void;
}

function shortenAddr(addr: string) {
  return addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

function toMon(virtualMon: string): string {
  try {
    const val = BigInt(virtualMon);
    const mon = Number(val) / 1e18;
    return mon < 0.01 ? mon.toExponential(2) : mon.toFixed(4);
  } catch {
    return "—";
  }
}

export function TokenDetail({ signal, nadItems, onClose }: TokenDetailProps) {
  const nad = signal
    ? nadItems.find(
        (n) => n.tokenAddress.toLowerCase() === signal.token.toLowerCase()
      )
    : null;

  const symbol =
    nad?.symbol && nad.symbol !== "UNKNOWN" ? nad.symbol : signal ? shortenAddr(signal.token) : "";

  return (
    <AnimatePresence>
      {signal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/30 bg-card/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/20 px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Selected Token
                </p>
                <h3 className="mt-0.5 font-mono text-lg font-bold text-foreground">{symbol}</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted/10 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {/* Address */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Address</p>
                <p className="mt-1 break-all font-mono text-[11px] text-foreground/80">
                  {signal.token}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatItem label="Score" value={String(signal.score)} />
                <StatItem label="Net" value={String(signal.net)} />
                <StatItem label="Buys" value={String(signal.buys)} highlight="emerald" />
                <StatItem label="Sells" value={String(signal.sells)} highlight="red" />
                <StatItem label="Total" value={String(signal.total)} />
                <StatItem label="Virtual MON" value={toMon(signal.virtualMon)} />
              </div>

              {/* NAD enriched data */}
              {nad && (
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Market Data
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <StatItem
                      label="Price USD"
                      value={nad.priceUsd != null ? `$${nad.priceUsd.toFixed(6)}` : "—"}
                    />
                    <StatItem
                      label="Price MON"
                      value={nad.priceMon != null ? nad.priceMon.toFixed(6) : "—"}
                    />
                    <StatItem
                      label="24h Change"
                      value={
                        nad.change24h != null ? `${nad.change24h > 0 ? "+" : ""}${nad.change24h.toFixed(2)}%` : "—"
                      }
                      highlight={nad.change24h != null ? (nad.change24h >= 0 ? "emerald" : "red") : undefined}
                    />
                    <StatItem
                      label="Liquidity"
                      value={nad.liquidityUsd != null ? `$${nad.liquidityUsd.toLocaleString()}` : "—"}
                    />
                    <StatItem
                      label="Volume 24h"
                      value={nad.volume24h != null ? `$${nad.volume24h.toLocaleString()}` : "—"}
                    />
                    <StatItem label="NAD Score" value={String(nad.score)} />
                  </div>
                </div>
              )}

              {!nad && (
                <div className="rounded-xl border border-border/20 bg-muted/5 p-3">
                  <p className="text-[11px] text-muted-foreground">
                    No enriched market data available for this token.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Badge variant="outline" className="rounded-lg text-[9px] uppercase tracking-wider">
                  View Only
                </Badge>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function StatItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "emerald" | "red";
}) {
  return (
    <div className="rounded-xl border border-border/20 bg-background/40 p-3">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-mono text-sm font-semibold tabular-nums ${
          highlight === "emerald"
            ? "text-emerald-400"
            : highlight === "red"
            ? "text-red-400"
            : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
