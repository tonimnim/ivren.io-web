"use client";

import { useState } from "react";
import Link from "next/link";
import { Field, FormError, SubmitButton } from "@/components/auth/field";

type Created = {
  org?: { id?: string; name?: string };
  api_key?: { key?: string; name?: string };
};

export function SignupForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Created | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    const body = await res.json().catch(() => ({}));

    setPending(false);
    if (!res.ok) {
      setError(body.error ?? "That didn't go through.");
      return;
    }
    setCreated(body);
  }

  // The key is returned exactly once. Showing it plainly with the warning
  // attached beats letting someone discover that after they navigate away.
  if (created) {
    const key = created.api_key?.key;
    return (
      <div>
        <div className="flex items-center gap-2 text-ok">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M5 8.2l2 2 4-4.4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm font-medium">Organisation created</p>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
          Copy your API key now. It is shown once and cannot be retrieved
          again — you will paste it into Ivren to activate your licence.
        </p>

        {key && (
          <div className="mt-5 overflow-hidden rounded-xl border border-hairline">
            <div className="flex items-center justify-between border-b border-white/10 bg-terminal-bg px-3 py-2">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-white/40 uppercase">
                API key
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(key);
                  setCopied(true);
                }}
                className="rounded px-2 py-1 font-mono text-[11px] text-white/60 transition-colors hover:text-white"
              >
                {copied ? "copied" : "copy"}
              </button>
            </div>
            <pre className="overflow-x-auto bg-terminal-bg px-3 py-3 font-mono text-xs break-all whitespace-pre-wrap text-terminal-ink">
              {key}
            </pre>
          </div>
        )}

        {created.org?.id && (
          <p className="mt-4 text-xs leading-relaxed text-ink-label">
            Organisation ID{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-ink">
              {created.org.id}
            </code>{" "}
            — you need this to sign in. Keep it somewhere your team can find
            it.
          </p>
        )}

        <Link
          href="/login"
          className="mt-7 flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] transition-colors duration-150 hover:bg-accent-strong"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field
        id="name"
        label="Organisation"
        required
        maxLength={200}
        placeholder="Mercy General Hospital"
        autoComplete="organization"
      />
      <Field
        id="admin_name"
        label="Your name"
        required
        maxLength={200}
        placeholder="Alex Okoro"
        autoComplete="name"
      />
      <Field
        id="admin_email"
        label="Work email"
        type="email"
        required
        maxLength={320}
        placeholder="alex@hospital.org"
        autoComplete="email"
      />
      <Field
        id="admin_password"
        label="Password"
        type="password"
        required
        minLength={12}
        maxLength={1024}
        autoComplete="new-password"
        hint="At least 12 characters."
      />

      <FormError message={error} />

      <SubmitButton pending={pending} pendingLabel="Creating…">
        Create organisation
      </SubmitButton>

      <p className="text-xs leading-relaxed text-ink-label">
        By creating an organisation you agree to the{" "}
        <Link href="/terms" className="underline underline-offset-2">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
