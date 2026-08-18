"use client";

import { useState } from "react";
import { Field, SubmitButton } from "@/components/auth/field";
import { company } from "@/lib/company";

/**
 * Three fields, because that is everything provisioning needs.
 *
 * This does not call POST /auth/orgs: that endpoint is gated behind a
 * deployment-wide vendor secret (verified — it answers 401 "invalid
 * provisioning token"), and the header carrying it is excluded from the
 * API's CORS allow-list so a browser could never send it. The moment the
 * control plane exposes a public signup route, only the submit handler
 * here changes.
 */
export function GetStartedForm() {
  const [pending, setPending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const f = new FormData(e.currentTarget);
    const body = [
      `Organisation: ${f.get("organisation") ?? ""}`,
      `Name: ${f.get("full_name") ?? ""}`,
      `Work email: ${f.get("email") ?? ""}`,
    ].join("\n");

    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      "Ivren — get started",
    )}&body=${encodeURIComponent(body)}`;
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field
        id="organisation"
        label="Organisation"
        required
        maxLength={200}
        placeholder="Mercy General Hospital"
        autoComplete="organization"
      />
      <Field
        id="full_name"
        label="Your name"
        required
        maxLength={200}
        placeholder="Alex Okoro"
        autoComplete="name"
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

      <SubmitButton pending={pending} pendingLabel="Opening…">
        Get started
      </SubmitButton>
    </form>
  );
}
