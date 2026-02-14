import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { StatusData } from "@/types/dashboard";

const DEFAULT_POLICY = {
  policy_gates: {
    MIN_VIRTUAL_MON: 20000,
    score_threshold: 35,
    top_net_threshold: 3,
    cooldown_buy_s: 180,
    cooldown_sell_s: 60,
    max_exposure_pct: 40,
  },
  overrides: {
    rotate_top_changed: true,
    score_too_low_for_swap: true,
    buy_signal_too_weak: false,
  },
  intent_schema: {
    action: "string — buy | sell | hold | lend",
    token: "string? — contract address",
    max_mon: "number? — max MON to spend",
    amount_usdc: "number? — USDC amount",
    reason: "string — LLM reasoning",
  },
  data_sources: ["/api/status", "/api/nad/top", "/api/logs"],
};

interface SystemPolicyProps {
  status?: StatusData;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="ml-auto p-1 rounded hover:bg-secondary transition-colors"
      title="Copy"
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-400" />
      ) : (
        <Copy className="w-3 h-3 text-muted-foreground" />
      )}
    </button>
  );
}

function JsonBlock({ data }: { data: unknown }) {
  const str = JSON.stringify(data, null, 2);
  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <CopyButton text={str} />
      </div>
      <pre className="rounded-lg bg-secondary/50 p-4 text-[11px] font-mono text-muted-foreground overflow-x-auto leading-relaxed">
        {str}
      </pre>
    </div>
  );
}

export function SystemPolicy({ status }: SystemPolicyProps) {
  const lastIntent = status?.llm?.intent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-border bg-card/50 backdrop-blur overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 pb-0">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          System Policy
        </h2>
        <Badge variant="outline" className="text-[9px] tracking-wider">
          Default Policy (UI)
        </Badge>
      </div>

      <div className="p-5 pt-4">
        <Accordion type="multiple" defaultValue={["gates"]}>
          <AccordionItem value="gates">
            <AccordionTrigger className="text-xs font-medium text-foreground/80 py-3">
              Policy Gates
            </AccordionTrigger>
            <AccordionContent>
              <JsonBlock data={DEFAULT_POLICY.policy_gates} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="overrides">
            <AccordionTrigger className="text-xs font-medium text-foreground/80 py-3">
              Overrides
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {Object.entries(DEFAULT_POLICY.overrides).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2"
                  >
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {key}
                    </span>
                    <Badge
                      variant={val ? "default" : "secondary"}
                      className="text-[9px]"
                    >
                      {val ? "enabled" : "disabled"}
                    </Badge>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="json-contract">
            <AccordionTrigger className="text-xs font-medium text-foreground/80 py-3">
              JSON Contract
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-2">
                    Expected Intent Schema
                  </span>
                  <JsonBlock data={DEFAULT_POLICY.intent_schema} />
                </div>
                {lastIntent && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-2">
                      Last Extracted Intent
                    </span>
                    <JsonBlock data={lastIntent} />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data-sources">
            <AccordionTrigger className="text-xs font-medium text-foreground/80 py-3">
              Data Sources
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1.5">
                {DEFAULT_POLICY.data_sources.map((src) => (
                  <div
                    key={src}
                    className="flex items-center gap-2 rounded-lg bg-secondary/30 px-3 py-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    <code className="text-[11px] font-mono text-muted-foreground">
                      {src}
                    </code>
                    <CopyButton text={src} />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );
}
