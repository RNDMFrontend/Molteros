import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIDEO_URL =
  "https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FwN9gr7D53un73iG7LD9D%2Fuploads%2FBR48pS2KXLCAbrMKDRsW%2Fc1_fast_mute.mp4?alt=media&token=faa62275-1fa8-43bb-9f1d-c5f95c2999ff";

function useGatewayStatus() {
  const [status, setStatus] = useState<"connected" | "stale" | "loading">("loading");

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        if (!mounted) return;
        const ts = new Date(data.ts).getTime();
        const age = Date.now() - ts;
        setStatus(age < 10_000 ? "connected" : "stale");
      } catch {
        if (mounted) setStatus("stale");
      }
    };
    check();
    const interval = setInterval(check, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return status;
}

export default function Lock() {
  const navigate = useNavigate();
  const gwStatus = useGatewayStatus();
  const [exiting, setExiting] = useState(false);

  const enter = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => navigate("/dashboard"), 500);
  }, [exiting, navigate]);

  // Key press to enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") enter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enter]);

  return (
    <motion.div
      animate={exiting ? { scale: 1.05, filter: "blur(12px)", opacity: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
    >
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
        src={VIDEO_URL}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top-left logo */}
        <div className="px-6 py-6">
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Molter<span className="text-primary"> OS</span>
          </span>
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground text-center"
          >
            Decision Engine Online
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground text-center"
          >
            Policy loaded. JSON stable. Vault synced.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Button size="lg" className="gap-2" onClick={enter}>
              Enter Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-[10px] text-muted-foreground tracking-wide">
            Raspberry Pi 5 · Local Device
          </span>

          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                gwStatus === "connected"
                  ? "bg-green-400"
                  : gwStatus === "stale"
                  ? "bg-amber-400"
                  : "bg-muted animate-pulse"
              }`}
            />
            <span className="text-[10px] text-muted-foreground">
              {gwStatus === "connected"
                ? "Gateway Connected"
                : gwStatus === "stale"
                ? "Stale"
                : "Checking…"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
