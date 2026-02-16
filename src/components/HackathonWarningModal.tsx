import { useEffect, useState } from "react";

const STORAGE_KEY = "molter_hackathon_warning_ack_v1";

export function HackathonWarningModal({ isConnected }: { isConnected: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    const ack = localStorage.getItem(STORAGE_KEY);
    if (!ack) setOpen(true);
  }, [isConnected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-400">Molter OS</div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Hackathon Demo Warning
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-200 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-200">
          <li>Experimental prototype; may be unstable.</li>
          <li>Not audited; smart contract risk exists.</li>
          <li>Use small amounts only.</li>
          <li>1-minute rounds are high variance.</li>
          <li>5% operator fee is taken from the pool.</li>
          <li>Auto-claim may trigger wallet prompts.</li>
          <li>RPC/network delays can cause UI lag.</li>
        </ol>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "1");
              setOpen(false);
            }}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
          >
            I Understand — Continue
          </button>
          <span className="text-xs text-zinc-500">
            Stored locally in this browser.
          </span>
        </div>
      </div>
    </div>
  );
}



