"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const SCRIPT = `$ ivren shadow --route adt-to-billing --against mirth:adt_billing_channel --days 14
Recording live traffic on adt-to-billing (read-only, delivers nothing)...

  day  1/14   matched 1,204   diverged 0
  day  2/14   matched 1,180   diverged 0
  day  7/14   matched 1,233   diverged 0
  day 14/14   matched 1,241   diverged 0

Divergence report written: adt-to-billing.report.json
  messages compared   16,940
  fields diverged      0
  verdict              PASS - ready to cut over

$ ivren gate --route adt-to-billing --evidence adt-to-billing.report.json
PASS  (exit 0)`;

const TYPE_MS = 18;
const HOLD_MS = 6000;

export function TerminalPanel() {
  const [text, setText] = useState("");
  const [playing, setPlaying] = useState(true);
  const reduced = usePrefersReducedMotion();
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced || !playing) return;

    function tick() {
      indexRef.current += 1;
      setText(SCRIPT.slice(0, indexRef.current));

      if (indexRef.current >= SCRIPT.length) {
        timeoutRef.current = setTimeout(() => {
          indexRef.current = 0;
          setText("");
        }, HOLD_MS);
        return;
      }
      timeoutRef.current = setTimeout(tick, TYPE_MS);
    }

    timeoutRef.current = setTimeout(tick, TYPE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [playing, reduced]);

  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-terminal-bg">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded px-2 py-1 font-mono text-[11px] text-terminal-ink/60 hover:text-terminal-ink"
          >
            {playing ? "pause" : "play"}
          </button>
        )}
      </div>
      <pre className="min-h-[280px] overflow-x-auto whitespace-pre-wrap px-5 py-5 font-mono text-[13px] leading-relaxed text-terminal-ink">
        {reduced ? SCRIPT : text}
        {!reduced && <span className="animate-pulse text-accent">▍</span>}
      </pre>
    </div>
  );
}
