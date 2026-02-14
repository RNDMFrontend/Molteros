import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const STAGES = [
  "Loading System Policy",
  "Applying Policy Overrides",
  "Booting Local Model",
  "Parsing JSON Output",
  "Syncing Vault State",
  "Indexing nad.fun Flow",
  "Warming Signal Engine",
  "Ready",
];

const BOOT_LINES = [
  "[policy] loading default_policy.json …",
  "[policy] MIN_VIRTUAL_MON = 20000",
  "[policy] score_threshold = 35",
  "[policy] cooldown_buy = 180s",
  "[override] rotate_top_changed → enabled",
  "[override] score_too_low_for_swap → skip",
  "[json] validating intent schema …",
  "[json] schema OK: { action, token, max_mon, reason }",
  "[vault] connecting to vault 0x…a4f2",
  "[vault] USDC idle: 412.80  lent: 0.00",
  "[vault] exposure ratio: 100% idle",
  "[nad] fetching /nad/top?limit=10 …",
  "[nad] 10 tokens indexed, top score: 89",
  "[signal] building signal matrix …",
  "[signal] warm-up complete, 60 samples buffered",
  "[signal] engine ready — latency 12ms",
  "[system] all subsystems nominal",
  "[system] MolterOS boot complete ✓",
];

const TOTAL_DURATION = 3500;

export default function Boot() {
  const navigate = useNavigate();
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [verbose, setVerbose] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // Progress bar
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Stage cycling
  useEffect(() => {
    const stageInterval = TOTAL_DURATION / STAGES.length;
    const interval = setInterval(() => {
      setStageIdx((prev) => {
        if (prev >= STAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, stageInterval);
    return () => clearInterval(interval);
  }, []);

  // Log lines
  useEffect(() => {
    const lineInterval = TOTAL_DURATION / BOOT_LINES.length;
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLogLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, lineInterval);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logLines]);

  // Navigate on completion
  useEffect(() => {
    if (progress >= 100 && stageIdx >= STAGES.length - 1) {
      const timer = setTimeout(() => setDone(true), 600);
      return () => clearTimeout(timer);
    }
  }, [progress, stageIdx]);

  const handleExit = useCallback(() => {
    navigate("/sync");
  }, [navigate]);

  useEffect(() => {
    if (done) {
      const timer = setTimeout(handleExit, 400);
      return () => clearTimeout(timer);
    }
  }, [done, handleExit]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
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
            className="mb-10"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Molter<span className="text-primary"> OS</span>
            </h1>
          </motion.div>

          {/* Stage label */}
          <div className="h-8 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.span
                key={stageIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className={`text-sm font-medium tracking-wide ${
                  stageIdx === STAGES.length - 1
                    ? "text-green-400"
                    : "text-muted-foreground"
                }`}
              >
                {STAGES[stageIdx]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="w-72 sm:w-80 h-1.5 rounded-full bg-secondary overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          {/* Spinner */}
          {progress < 100 && (
            <Loader2 className="w-4 h-4 text-primary animate-spin mb-6" />
          )}
          {progress >= 100 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-green-400 mb-6"
            >
              ✓ Boot complete
            </motion.span>
          )}

          {/* Verbose log panel */}
          <AnimatePresence>
            {verbose && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 200 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-[90vw] max-w-lg rounded-xl border border-border bg-card/60 backdrop-blur overflow-hidden"
              >
                <div
                  ref={logRef}
                  className="h-[200px] overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-muted-foreground"
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
                            : line.includes("override")
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
