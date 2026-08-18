"use client";

import { useState } from "react";
import { Field, SubmitButton } from "@/components/auth/field";
import { company } from "@/lib/company";

/**
 * Access request, not account creation.
 *
 * Org provisioning on the control plane is gated behind a deployment-wide
 * vendor secret (X-Ivren-Provisioning-Token), and that header is
 * deliberately excluded from the API's CORS allow-list — a browser cannot
 * present it even by mistake. So there is no self-serve signup to call:
 * this collects what provisioning needs and hands it to a human.
 */
export function RequestAccessForm() {
  const [pending, setPending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const f = new FormData(e.currentTarget);
    const body = [
      `Organisation: ${f.get("organisation") ?? ""}`,
      `Name: ${f.get("full_name") ?? ""}`,
      `Work email: ${f.get("email") ?? ""}`,
      `Seats needed: ${f.get("seats") ?? ""}`,
      "",
      `Current interface engine / context:`,
      `${f.get("context") ?? ""}`,
    ].join("\n");

    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      "Ivren access request",
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
      <Field
        id="seats"
        label="Seats needed"
        type="number"
        min={1}
        max={10000}
        placeholder="5"
        hint="Rough is fine."
      />

      <div>
        <label
          htmlFor="context"
          className="block text-[13px] font-medium text-ink"
        >
          Anything useful
        </label>
        <textarea
          id="context"
          name="context"
          rows={3}
          placeholder="Engine you run today, rough interface count, timelines."
          className="mt-2 w-full rounded-lg border border-hairline bg-paper px-3.5 py-2.5 text-sm text-ink shadow-[inset_0_1px_2px_rgb(20_24_29/0.03)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-label/70 hover:border-ink-label/40 focus:border-accent focus:shadow-[0_0_0_3px_rgb(13_99_179/0.12)]"
        />
      </div>

      <SubmitButton pending={pending} pendingLabel="Opening…">
        Request access
      </SubmitButton>
    </form>
  );
}
