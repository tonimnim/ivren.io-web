"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormError, SubmitButton } from "@/components/auth/field";

type Details = { name: string; admin_name: string; admin_email: string };

export function GetStartedForm() {
  const [step, setStep] = useState<"details" | "password">("details");
  const [details, setDetails] = useState<Details | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function onDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setDetails({
      name: String(f.get("name") ?? ""),
      admin_name: String(f.get("admin_name") ?? ""),
      admin_email: String(f.get("admin_email") ?? ""),
    });
    setError(null);
    setStep("password");
  }

  async function onPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!details) return;
    setError(null);
    setPending(true);

    const password = String(
      new FormData(e.currentTarget).get("admin_password") ?? "",
    );
    if (password.length < 10) {
      setPending(false);
      setError(
        "Passwords need at least 10 characters — length matters more than symbols.",
      );
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...details, admin_password: password }),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setPending(false);
      setError(body.error ?? "That didn't go through.");
      return;
    }
    // Signup signs you in — land on the console, not on a credential.
    router.push("/dashboard");
    router.refresh();
  }

  if (step === "password") {
    return (
      <form onSubmit={onPassword} className="space-y-5" noValidate>
        <Field
          id="admin_password"
          label="Password"
          type="password"
          required
          minLength={10}
          maxLength={1024}
          autoComplete="new-password"
          autoFocus
          hint="At least 10 characters."
        />

        <FormError message={error} />

        <SubmitButton pending={pending} pendingLabel="Creating…">
          Create organisation
        </SubmitButton>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setStep("details");
          }}
          className="w-full text-center text-sm text-ink-label transition-colors hover:text-ink"
        >
          Back
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onDetails} className="space-y-5" noValidate>
      <Field
        id="name"
        label="Organisation"
        required
        maxLength={200}
        placeholder="Mercy General Hospital"
        autoComplete="organization"
        defaultValue={details?.name}
      />
      <Field
        id="admin_name"
        label="Your name"
        required
        maxLength={200}
        placeholder="Alex Okoro"
        autoComplete="name"
        defaultValue={details?.admin_name}
      />
      <Field
        id="admin_email"
        label="Work email"
        type="email"
        required
        maxLength={320}
        placeholder="alex@hospital.org"
        autoComplete="email"
        defaultValue={details?.admin_email}
      />

      <FormError message={error} />

      <SubmitButton pending={false} pendingLabel="">
        Continue
      </SubmitButton>
    </form>
  );
}
