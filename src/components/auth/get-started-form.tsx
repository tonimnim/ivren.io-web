"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormError, SubmitButton } from "@/components/auth/field";

type Created = {
  org?: { id?: string; name?: string };
  api_key?: { secret?: string };
};

type Details = { name: string; admin_name: string; admin_email: string };

export function GetStartedForm() {
  const [step, setStep] = useState<"details" | "password" | "key">("details");
  const [details, setDetails] = useState<Details | null>(null);
  const [created, setCreated] = useState<Created | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...details, admin_password: password }),
    });
    const body = await res.json().catch(() => ({}));
    setPending(false);

    if (!res.ok) {
      setError(body.error ?? "That didn't go through.");
      return;
    }
    setCreated(body);
    setStep("key");
  }

  // The key is returned exactly once. Showing it before the dashboard is
  // one extra click that stops it being lost on the redirect.
  if (step === "key") {
    const secret = created?.api_key?.secret;
    return (
      <div>
        <p className="text-sm font-medium text-ok">Organisation created</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Your API key, shown once. You need it to activate a local install.
        </p>

        {secret && (
          <div className="mt-5 overflow-hidden rounded-xl border border-hairline">
            <div className="flex items-center justify-between border-b border-white/10 bg-terminal-bg px-3 py-2">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-white/40 uppercase">
                API key
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(secret);
                  setCopied(true);
                }}
                className="rounded px-2 py-1 font-mono text-[11px] text-white/60 transition-colors hover:text-white"
              >
                {copied ? "copied" : "copy"}
              </button>
            </div>
            <pre className="overflow-x-auto bg-terminal-bg px-3 py-3 font-mono text-xs break-all whitespace-pre-wrap text-terminal-ink">
              {secret}
            </pre>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
          className="mt-7 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] transition-colors duration-150 hover:bg-accent-strong"
        >
          Continue to dashboard
        </button>
      </div>
    );
  }

  if (step === "password") {
    return (
      <form onSubmit={onPassword} className="space-y-5" noValidate>
        <Field
          id="admin_password"
          label="Password"
          type="password"
          required
          minLength={12}
          maxLength={1024}
          autoComplete="new-password"
          autoFocus
          hint="At least 12 characters."
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
