"use client";

import { useState } from "react";
import { company, newsletterEndpoint } from "@/lib/company";

/**
 * Subscribe control. If a real list endpoint is configured it posts there;
 * until then it opens a pre-addressed mail draft, so the control always
 * does something real rather than silently swallowing the address.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    if (!newsletterEndpoint) {
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
        "Subscribe to Ivren updates",
      )}&body=${encodeURIComponent(`Please add ${email} to the update list.`)}`;
      setState("done");
      return;
    }

    setState("sending");
    try {
      const res = await fetch(newsletterEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      {/* Single bordered group: the field and its action read as one control. */}
      <div className="flex items-center gap-2 rounded-xl border border-hairline bg-canvas p-1.5 transition-colors duration-200 focus-within:border-accent/60">
        <label htmlFor="newsletter-email" className="sr-only">
          Work email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@hospital.org"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-label"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] transition-colors duration-150 hover:bg-accent-strong disabled:opacity-60"
        >
          {state === "sending" ? "…" : "Subscribe"}
        </button>
      </div>

      <p
        aria-live="polite"
        className="mt-3 min-h-[1.25rem] text-xs text-ink-label"
      >
        {state === "idle" &&
          "Release notes and interface engineering write-ups. No cadence, no selling."}
        {state === "done" && "Thanks — you're on the list."}
        {state === "error" && (
          <>
            That didn&rsquo;t send. Email{" "}
            <a
              href={`mailto:${company.email}`}
              className="text-accent underline underline-offset-2"
            >
              {company.email}
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}
