"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/auth/field";

export function LoginForm() {
  const [state, setState] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("sending");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setState("idle");
      setError(body.error ?? "Those details did not match an account.");
      return;
    }

    router.push("/download");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field
        id="org_id"
        label="Organisation ID"
        required
        maxLength={64}
        placeholder="org_…"
        hint="Shown when your organisation was created."
      />
      <Field id="email" label="Work email" type="email" required maxLength={320} autoComplete="email" />
      <Field id="password" label="Password" type="password" required maxLength={1024} autoComplete="current-password" />

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
        {state === "sending" ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
