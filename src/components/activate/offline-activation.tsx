"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle2, FileUp } from "lucide-react";
import { FormError, SubmitButton } from "@/components/auth/field";
import { formatDate } from "@/lib/format";

type Issued = {
  licence: string;
  seat?: number | null;
  seats?: number | null;
  seats_in_use?: number | null;
  expires_at?: string | null;
  new_machine?: boolean | null;
};

const HEADER = "-----BEGIN IVREN ACTIVATION REQUEST-----";
const FOOTER = "-----END IVREN ACTIVATION REQUEST-----";
// A request is a few hundred bytes. This only stops somebody opening the wrong
// file — a database export, say — and freezing the tab.
const MAX_FILE_BYTES = 64 * 1024;
const LICENCE_FILE = "licence.txt";

/**
 * The air-gapped half of activation: a request in, a licence out.
 *
 * Shared by the public /activate page and the dashboard's Devices screen, so
 * there is one implementation of the flow the desktop app sends people to.
 */
export function OfflineActivation() {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const id = useId();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Cleared so the same file can be chosen again after a failed attempt.
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError(
        "That file is too large to be an activation request. Open the request.txt the machine saved.",
      );
      return;
    }
    setText(await file.text());
    setError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const request = text.trim();
    if (!request.includes(HEADER) || !request.includes(FOOTER)) {
      setError(
        "Copy the block whole, including both ----- lines. They are how we can tell nothing was cut off on the way.",
      );
      return;
    }

    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/licensing/activate-offline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || typeof body.licence !== "string") {
        setError(body.error ?? "That didn't go through. Nothing was issued.");
        return;
      }
      // The request holds a live licence key. Once it has done its job it
      // leaves the page, so a borrowed computer is not left displaying it.
      setText("");
      setIssued(body);
      requestAnimationFrame(() => resultHeading.current?.focus());
    } catch {
      setError(
        "ivren.io couldn't be reached from this computer. Nothing was issued — check the connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  function download() {
    if (!issued) return;
    // Written exactly as issued. A signed licence altered by one character is
    // a licence that no longer verifies.
    const url = URL.createObjectURL(
      new Blob([issued.licence], { type: "text/plain" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = LICENCE_FILE;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copy() {
    if (!issued) return;
    try {
      await navigator.clipboard.writeText(issued.licence);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the download is the primary path.
    }
  }

  if (issued) {
    const seats = issued.seats ?? null;
    return (
      <div className="rounded-xl border border-ok/25 bg-paper p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-ok" aria-hidden />
          <div className="min-w-0 flex-1">
            <h2
              ref={resultHeading}
              tabIndex={-1}
              className="text-lg font-medium text-ink outline-none"
            >
              Licence issued
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
              {issued.new_machine === false
                ? "This machine already held a seat, so its licence was issued again and no new seat was used."
                : "This machine took a seat on your organisation's licence."}
            </p>

            <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {seats !== null && issued.seats_in_use != null && (
                <div>
                  <dt className="text-ink-label">Licence seats in use</dt>
                  <dd className="mt-0.5 font-tabular text-ink">
                    {issued.seats_in_use} of {seats}
                  </dd>
                </div>
              )}
              {issued.expires_at && (
                <div>
                  <dt className="text-ink-label">Valid until</dt>
                  <dd className="mt-0.5 font-tabular text-ink">
                    {formatDate(issued.expires_at)}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={download}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(13_99_179/0.2)] transition-colors duration-150 hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Download {LICENCE_FILE}
              </button>
              <button
                type="button"
                onClick={copy}
                className="rounded-lg border border-hairline px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-150 hover:border-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {copied ? "Copied" : "Copy licence"}
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-ink-secondary">
              Carry {LICENCE_FILE} back to that machine and load it on
              Ivren&apos;s activation screen. It is issued for the machine that
              made the request.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIssued(null);
            setCopied(false);
            setError(null);
          }}
          className="mt-6 text-sm text-accent transition-colors hover:text-accent-strong"
        >
          Activate another machine
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label
            htmlFor={`${id}-request`}
            className="block text-[13px] font-medium text-ink"
          >
            Activation request
          </label>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="inline-flex items-center gap-1.5 text-[13px] text-accent transition-colors hover:text-accent-strong"
          >
            <FileUp className="h-3.5 w-3.5" aria-hidden />
            Open a request file
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".txt,text/plain"
            onChange={onFile}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
          />
        </div>
        <textarea
          id={`${id}-request`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={11}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-describedby={`${id}-hint`}
          aria-invalid={error ? true : undefined}
          placeholder={`${HEADER}\n…\n${FOOTER}`}
          className="mt-2 w-full resize-y rounded-lg border border-hairline bg-paper px-3.5 py-3 font-mono text-[12.5px] leading-relaxed text-ink shadow-[inset_0_1px_2px_rgb(20_24_29/0.03)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-label/60 hover:border-ink-label/40 focus:border-accent focus:shadow-[0_0_0_3px_rgb(13_99_179/0.12)]"
        />
        <p
          id={`${id}-hint`}
          className="mt-1.5 text-xs leading-relaxed text-ink-label"
        >
          Paste the block the machine printed, or open the request.txt it
          saved. Include both ----- lines.
        </p>
      </div>

      <FormError message={error} />

      <SubmitButton pending={pending} pendingLabel="Issuing…">
        Issue licence
      </SubmitButton>
    </form>
  );
}
