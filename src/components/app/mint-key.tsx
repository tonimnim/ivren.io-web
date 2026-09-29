"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

type Stage =
  | { kind: "idle" }
  | { kind: "confirming" }
  | { kind: "pending" }
  | { kind: "minted"; key: string }
  | { kind: "error"; message: string };

/**
 * Mint, or replace, the organisation's licence key.
 *
 * The key exists in this component's state and nowhere else in the browser,
 * and "Done" drops it. Replacing asks first, because it is the one action on
 * this page that stops something working for somebody else.
 */
export function MintKey({ keyIssued }: { keyIssued: boolean }) {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  async function mint() {
    setStage({ kind: "pending" });
    try {
      const res = await fetch("/api/licensing/key", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || typeof body.key !== "string") {
        setStage({
          kind: "error",
          message: body.error ?? "That didn't go through. No key was minted.",
        });
        return;
      }
      setStage({ kind: "minted", key: body.key });
    } catch {
      setStage({
        kind: "error",
        message:
          "ivren.io couldn't be reached to confirm. If a key was minted, the previous one has stopped working — mint again to get a key you can copy.",
      });
    }
  }

  async function copy(key: string) {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Refused clipboard access; the key is selectable by hand.
    }
  }

  function done() {
    setStage({ kind: "idle" });
    setCopied(false);
    // Picks up key_issued from the server rather than guessing it here.
    router.refresh();
  }

  const primary =
    "rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60";
  const secondary =
    "rounded-lg border border-hairline px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink-label";

  if (stage.kind === "minted") {
    return (
      <div>
        <p className="text-[13px] font-medium text-ink">
          Your licence key — shown once
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 rounded-lg border border-hairline bg-surface px-3 py-2 font-mono text-[12.5px] break-all text-ink select-all">
            {stage.key}
          </code>
          <button
            type="button"
            onClick={() => copy(stage.key)}
            className={secondary}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-secondary">
          Copy it now. ivren.io keeps only a fingerprint of it, so it cannot be
          shown again — if it is lost, you mint a replacement.
        </p>
        <button type="button" onClick={done} className={`mt-4 ${primary}`}>
          Done
        </button>
      </div>
    );
  }

  if (stage.kind === "confirming") {
    return (
      <div className="rounded-lg border border-warn/30 bg-warn-soft/60 p-4">
        <p className="text-[13px] font-medium text-ink">
          Replace the licence key?
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-secondary">
          The current key stops working the moment the new one is minted.
          Machines already activated keep their licences; only new
          activations need the new key.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={mint} className={primary}>
            Replace the key
          </button>
          <button
            type="button"
            onClick={() => setStage({ kind: "idle" })}
            className={secondary}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-ink-label" aria-hidden />
        <p className="text-[13px] leading-relaxed text-ink-secondary">
          {keyIssued
            ? "A licence key has been minted. It is never shown again; if it is lost, replace it."
            : "No licence key has been minted yet. Every machine you activate needs it."}
        </p>
      </div>

      {stage.kind === "error" && (
        <p role="alert" className="mt-3 text-[12.5px] leading-relaxed text-flag">
          {stage.message}
        </p>
      )}

      <button
        type="button"
        disabled={stage.kind === "pending"}
        onClick={() =>
          keyIssued ? setStage({ kind: "confirming" }) : mint()
        }
        className={`mt-4 ${keyIssued ? secondary : primary}`}
      >
        {stage.kind === "pending"
          ? "Minting…"
          : keyIssued
            ? "Replace licence key"
            : "Mint licence key"}
      </button>
    </div>
  );
}
