"use client";

import { useState } from "react";
import { company, newsletterEndpoint } from "@/lib/company";

/**
 * Subscribe bar. If a real list endpoint is configured it posts there;
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
    <div>
      <p className="font-mono text-[10.5px] font-medium tracking-[0.14em] text-white/35 uppercase">
        Stay updated
      </p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
        Release notes and interface engineering write-ups. No marketing
        cadence, no more than a handful a year.
      </p>

      <form onSubmit={onSubmit} className="mt-4 max-w-xs">
        <div className="flex gap-2">
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
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-white/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-white/90 disabled:opacity-60"
          >
            {state === "sending" ? "…" : "Subscribe"}
          </button>
        </div>

        <p
          aria-live="polite"
          className="mt-2 min-h-[1.25rem] text-xs text-white/45"
        >
          {state === "done" && "Thanks — you're on the list."}
          {state === "error" && (
            <>
              That didn&rsquo;t send. Email{" "}
              <a
                href={`mailto:${company.email}`}
                className="underline underline-offset-2"
              >
                {company.email}
              </a>
              .
            </>
          )}
        </p>
      </form>
    </div>
  );
}
