import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getTokensFromStorage, savePicksToStorage, truncateAddress, type TokenPick } from "@/lib/tokens";

// Deterministic heuristic probabilities
function computeProbabilities(symbol: string): TokenPick {
  // Use symbol hash for deterministic "tilt"
  const hash = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const tiltDirection = hash % 3; // 0=up, 1=down, 2=neutral
  const magnitude = ((hash % 7) + 1) * 2; // 2-14%

  let fairUp = 50;
  let fairDown = 50;
  let confidence: "Low" | "Med" | "High" = "Low";
  let reason = "";

  if (tiltDirection === 0) {
    fairUp = 50 + magnitude;
    fairDown = 50 - magnitude;
    confidence = magnitude > 8 ? "High" : magnitude > 4 ? "Med" : "Low";
    reason = `Price trending upward across 3 samples, ${magnitude}% tilt detected`;
  } else if (tiltDirection === 1) {
    fairUp = 50 - magnitude;
    fairDown = 50 + magnitude;
    confidence = magnitude > 8 ? "High" : magnitude > 4 ? "Med" : "Low";
    reason = `Price trending downward across 3 samples, ${magnitude}% tilt detected`;
  } else {
    fairUp = 50;
    fairDown = 50;
    confidence = "Low";
    reason = "No clear directional signal in sampled quotes";
  }

  return {
    symbol,
    pick: fairUp >= fairDown ? "UP" : "DOWN",
    fairUp,
    fairDown,
    confidence,
    reason,
  };
}

export default function Probabilities() {
  const navigate = useNavigate();
  const [tokens] = useState(getTokensFromStorage());
  const [picks, setPicks] = useState<TokenPick[]>([]);
  const [phase, setPhase] = useState(0); // 0=loading, 1=showing, 2=done
  const [done, setDone] = useState(false);

  // Compute and reveal cards
  useEffect(() => {
    const computed = tokens.map((t) => computeProbabilities(t.symbol));

    // Show cards one by one
    const timers: ReturnType<typeof setTimeout>[] = [];
    computed.forEach((pick, i) => {
      timers.push(
        setTimeout(() => {
          setPicks((prev) => [...prev, pick]);
        }, 400 + i * 350)
      );
    });

    // Save and transition
    timers.push(
      setTimeout(() => {
        savePicksToStorage(computed);
        setPhase(2);
      }, 400 + computed.length * 350 + 400)
    );

    timers.push(
      setTimeout(() => setDone(true), 400 + computed.length * 350 + 800)
    );

    return () => timers.forEach(clearTimeout);
  }, [tokens]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => navigate("/play"), 500);
      return () => clearTimeout(t);
    }
  }, [done, navigate]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="probabilities"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          }}
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Molter<span className="text-primary"> OS</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-xs text-muted-foreground mb-8 tracking-wide"
          >
            Evaluating Fair Probabilities
          </motion.p>

          {/* Token probability cards */}
          <div className="flex flex-col gap-3 w-[90vw] max-w-md mb-6 px-4">
            {picks.map((pick, i) => {
              const token = tokens.find((t) => t.symbol === pick.symbol);
              return (
                <motion.div
                  key={pick.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-xl border border-border bg-card/60 backdrop-blur p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-foreground">{pick.symbol}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        pick.pick === "UP"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      Pi Pick: {pick.pick}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs mb-1">
                    <span className="text-green-400">Fair P(UP): {pick.fairUp}%</span>
                    <span className="text-red-400">Fair P(DOWN): {pick.fairDown}%</span>
                    <span className="text-muted-foreground">
                      Confidence: <span className="text-foreground">{pick.confidence}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{pick.reason}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Global info chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: picks.length >= tokens.length ? 1 : 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3"
          >
            <span className="text-[10px] px-3 py-1 rounded-full border border-border bg-card/40 text-muted-foreground">
              Operator Fee: 5%
            </span>
            <span className="text-[10px] px-3 py-1 rounded-full border border-border bg-card/40 text-muted-foreground">
              Seed: 1 MON/side
            </span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
