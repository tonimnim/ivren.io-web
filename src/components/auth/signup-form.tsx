"use client";

import { useState } from "react";
import { Field } from "@/components/auth/field";

type Created = {
  org?: { id?: string; name?: string };
  api_key?: { key?: string; name?: string };
};

export function SignupForm() {
  const [state, setState] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Created | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("sending");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const body = await res.json().catch(() => ({}));

    setState("idle");
    if (!res.ok) {
      setError(body.error ?? "That didn't go through.");
      return;
    }
    setCreated(body);
  }

  // The API key comes back exactly once. Showing it plainly, with the
  // warning attached, beats letting someone discover that later.
  if (created) {
    const key = created.api_key?.key;
    return (
      <div>
        <p className="text-sm font-medium text-ok">Organisation created.</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Copy your API key now — it is shown once and cannot be retrieved
          again. You will paste it into Ivren to activate your licence.
        </p>
        {key && (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-terminal-bg px-4 py-3 font-mono text-xs text-terminal-ink">
            {key}
          </pre>
        )}
        {created.org?.id && (
          <p className="mt-4 text-xs text-ink-label">
            Organisation ID{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono">
              {created.org.id}
            </code>{" "}
            — you need this to sign in.
          </p>
        )}
        <a
          href="/login"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-strong"
        >
          Continue to sign in
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field id="name" label="Organisation" required maxLength={200} placeholder="Mercy General Hospital" />
      <Field id="admin_name" label="Your name" required maxLength={200} placeholder="Alex Okoro" autoComplete="name" />
      <Field id="admin_email" label="Work email" type="email" required maxLength={320} placeholder="alex@hospital.org" autoComplete="email" />
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

      {error && (
        <p aria-live="polite" className="text-sm text-flag">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] transition-colors duration-150 hover:bg-accent-strong disabled:opacity-60"
      >
        {state === "sending" ? "Creating…" : "Create organisation"}
      </button>
    </form>
  );
}
