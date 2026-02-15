import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TRENDING_TOKENS, saveTokensToStorage, truncateAddress } from "@/lib/tokens";

const STEPS = [
  "Load Trending Set",
  "Validate Tokens",
  "Create 1-Minute Rounds",
  "Seed Liquidity (1 MON / side)",
  "Fee Policy (5%)",
  "Ready",
];

const BOOT_LOGS = [
  '[market] fetching trending set …',
  '[market] found 3 tokens in trending index',
  '[market] CHOG — score 89, rank #1',
  '[market] emonad — score 74, rank #2',
  '[market] Motion — score 68, rank #3',
  '[validate] checking token contract 0x3500…7777',
  '[validate] checking token contract 0x81A2…7777',
  '[validate] checking token contract 0x91ce…7777',
  '[validate] all 3 contracts verified ✓',
  '[round] createRound(CHOG) → round #1',
  '[round] createRound(emonad) → round #1',
  '[round] createRound(Motion) → round #1',
  '[seed] seed 1 MON UP + 1 MON DOWN for CHOG',
  '[seed] seed 1 MON UP + 1 MON DOWN for emonad',
  '[seed] seed 1 MON UP + 1 MON DOWN for Motion',
  '[seed] total seeded: 6 MON across 3 markets',
  '[fee] feeBps=500 (5%) applied to all rounds',
  '[fee] keeper: permissionless settle',
  '[system] market setup complete ✓',
];

const TOTAL_DURATION = 3500;

export default function MarketSetup() {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [verbose, setVerbose] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [visibleTokens, setVisibleTokens] = useState(0);
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // Save tokens to localStorage on mount
  useEffect(() => {
    saveTokensToStorage(TRENDING_TOKENS);
  }, []);

  // Step cycling
  useEffect(() => {
    const interval = TOTAL_DURATION / STEPS.length;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < STEPS.length) {
        setStepIdx(i);
      } else {
        clearInterval(timer);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  // Token cards appear one by one
  useEffect(() => {
    const delays = [600, 1200, 1800];
    const timers = delays.map((d, i) =>
      setTimeout(() => setVisibleTokens(i + 1), d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Log lines
  useEffect(() => {
    const interval = TOTAL_DURATION / BOOT_LOGS.length;
    let i = 0;
    const timer = setInterval(() => {
      if (i < BOOT_LOGS.length) {
        setLogLines((prev) => [...prev, BOOT_LOGS[i]]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logLines]);

  // Auto-transition
  useEffect(() => {
    const timer = setTimeout(() => setDone(true), TOTAL_DURATION + 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (done) {
      const timer = setTimeout(() => navigate("/probabilities"), 500);
      return () => clearTimeout(timer);
    }
  }, [done, navigate]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="market-setup"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Molter<span className="text-primary"> OS</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-muted-foreground mb-8 tracking-wide"
          >
            Setting up Markets
          </motion.p>

          {/* Token cards */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 px-4">
            {TRENDING_TOKENS.map((token, i) => (
              <AnimatePresence key={token.symbol}>
                {i < visibleTokens && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="rounded-xl border border-border bg-card/60 backdrop-blur px-5 py-4 min-w-[200px]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">{token.symbol}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
                        Trending
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {truncateAddress(token.address)}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          {/* Progress rail */}
          <div className="w-[90vw] max-w-md mb-6">
            <div className="flex flex-col gap-2">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      i < stepIdx
                        ? "bg-primary border-primary"
                        : i === stepIdx
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    {i < stepIdx ? (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    ) : i === stepIdx ? (
                      <Loader2 className="w-3 h-3 text-primary animate-spin" />
                    ) : null}
                  </div>
                  <span
                    className={`text-xs transition-colors duration-300 ${
                      i <= stepIdx ? "text-foreground" : "text-muted-foreground/50"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verbose log panel */}
          <AnimatePresence>
            {verbose && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 180 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-[90vw] max-w-lg rounded-xl border border-border bg-card/60 backdrop-blur overflow-hidden"
              >
                <div
                  ref={logRef}
                  className="h-[180px] overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-muted-foreground"
                >
                  {logLines.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-muted-foreground/40 select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={
                          line.includes("✓") || line.includes("complete")
                            ? "text-green-400"
                            : line.includes("seed")
                            ? "text-primary/80"
                            : ""
                        }
                      >
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Verbose toggle */}
          <div className="fixed bottom-6 left-6 flex items-center gap-2">
            <Switch
              checked={verbose}
              onCheckedChange={setVerbose}
              className="scale-75"
            />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Verbose
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
