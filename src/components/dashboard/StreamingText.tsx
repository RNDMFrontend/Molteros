import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface StreamingTextProps {
  text: string;
  speed?: number;
}

export function StreamingText({ text, speed = 12 }: StreamingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const prevText = useRef("");
  const rafId = useRef<number>();
  const idx = useRef(0);

  useEffect(() => {
    if (text === prevText.current) return;
    prevText.current = text;
    setDisplayed("");
    idx.current = 0;

    const step = () => {
      idx.current += 1;
      const next = text.slice(0, idx.current);
      setDisplayed(next);
      if (idx.current < text.length) {
        rafId.current = window.setTimeout(() => requestAnimationFrame(step), speed);
      }
    };
    rafId.current = window.setTimeout(() => requestAnimationFrame(step), 80);

    return () => {
      if (rafId.current) clearTimeout(rafId.current);
    };
  }, [text, speed]);

  return (
    <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/70 font-mono">
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="inline-block w-[6px] h-[14px] bg-primary/70 ml-0.5 align-middle rounded-sm"
        />
      )}
    </pre>
  );
}
