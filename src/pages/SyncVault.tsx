import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStatus } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export default function SyncVault() {
  const navigate = useNavigate();
  const { data: status } = useStatus();
  const [visible, setVisible] = useState(true);

  const usdc = status?.usdc?.human;
  const idle = usdc?.idle;
  const lent = usdc?.lent;
  const total = usdc?.total;
  const exposurePct = total && total > 0 ? ((idle ?? 0) / total) * 100 : null;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      const exit = setTimeout(() => navigate("/lock"), 500);
      return () => clearTimeout(exit);
    }
  }, [visible, navigate]);

  const cards = [
    { label: "USDC_IDLE", value: idle != null ? `$${idle.toFixed(2)}` : null },
    { label: "USDC_LENT", value: lent != null ? `$${lent.toFixed(2)}` : null },
    { label: "EXPOSURE_%", value: exposurePct != null ? `${exposurePct.toFixed(1)}%` : null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0, filter: visible ? "blur(0px)" : "blur(6px)" }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-6"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
        Sync Vault Mode
      </span>

      <div className="flex gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-36 rounded-xl border border-border bg-card/60 backdrop-blur p-4 text-center"
          >
            <span className="block text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-2 font-mono">
              {card.label}
            </span>
            {card.value != null ? (
              <span className="text-lg font-bold text-foreground">{card.value}</span>
            ) : (
              <Skeleton className="h-6 w-16 mx-auto" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <motion.div
          className="h-1.5 w-1.5 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        <span className="text-[10px] text-muted-foreground">Diagnostics OK</span>
      </div>
    </motion.div>
  );
}
