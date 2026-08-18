"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormError, SubmitButton } from "@/components/auth/field";

export function LoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setPending(false);
      setError(body.error ?? "Those details did not match an account.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field
        id="org_id"
        label="Organisation ID"
        required
        maxLength={64}
        placeholder="org_…"
        hint="Issued when your organisation was created."
      />
      <Field
        id="email"
        label="Work email"
        type="email"
        required
        maxLength={320}
        placeholder="alex@hospital.org"
        autoComplete="email"
      />
      <Field
        id="password"
        label="Password"
        type="password"
        required
        maxLength={1024}
        autoComplete="current-password"
      />

      <FormError message={error} />

      <SubmitButton pending={pending} pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
