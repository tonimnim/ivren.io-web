import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/button";
import { Placeholder } from "@/components/placeholder";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Ivren licensing: Trial, Professional, and Enterprise tiers, billed monthly or yearly. No prices are set yet — request a quote.",
};

const TIERS = [
  {
    name: "Trial",
    blurb: "Evaluate the full product. No license required.",
  },
  {
    name: "Professional",
    blurb: "For a single interface team.",
  },
  {
    name: "Enterprise",
    blurb: "Site licenses, fleet installs, no machine binding.",
  },
];

const MATRIX = [
  "Estate mapping & impact analysis",
  "The console",
  "Regression testing & the deployment gate",
  "Replay & probe",
  "Message tooling",
  "Local engine & transforms",
  "Message search & resend",
  "Shadow-run migration",
  "Role-based access & audit trail",
  "Charge reconciliation & claims pre-flight",
  "Offline licensing & air-gapped activation",
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Three tiers. No prices set yet."
        intro="Licenses activate offline — air-gapped hospital networks are a first-class deployment, not an exception."
      />

      <Section>
        <div className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="flex min-w-0 flex-col bg-canvas p-6 transition-colors duration-200 ease-out hover:bg-surface sm:p-8"
            >
              <h2 className="text-lg font-medium text-ink">{tier.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {tier.blurb}
              </p>
              <p className="mt-6 text-xl font-medium break-all text-ink">
                <Placeholder>{`PRICE_${tier.name.toUpperCase()}`}</Placeholder>
              </p>
              <p className="mt-1 text-xs text-ink-label">
                billed monthly or yearly
              </p>
              <Button href="#contact" variant="secondary" className="mt-6">
                Contact us
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Included in every tier
        </h2>
        <ul className="mt-6 divide-y divide-hairline-soft border-t border-hairline sm:columns-2 sm:gap-10">
          {MATRIX.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2.5 py-3.5 text-sm break-inside-avoid"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
                className="shrink-0 text-ok"
              >
                <path
                  d="M2.5 7.5l3 3 6-7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-ink-secondary">{f}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="contact" className="bg-surface">
        <div className="max-w-xl">
          <h2 className="text-2xl font-medium tracking-tight text-ink">
            Request a quote
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-secondary">
            We accept purchase orders. Quotes within one business day. Email{" "}
            <Placeholder>CONTACT_EMAIL</Placeholder> with your organization,
            tier, seat count, and billing period — or use the form below.
          </p>
          <form className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Organization"
                className="rounded-md border border-hairline bg-canvas px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <input
                type="email"
                placeholder="Work email"
                className="rounded-md border border-hairline bg-canvas px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <textarea
              placeholder="Tier, seat count, billing period, anything else"
              rows={4}
              className="w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md bg-accent/50 px-5 py-2.5 text-sm font-medium text-white"
            >
              Send request
            </button>
            <p className="text-xs text-ink-label">
              Posts to <Placeholder>QUOTE_ENDPOINT</Placeholder> once
              configured. Until then, email{" "}
              <Placeholder>CONTACT_EMAIL</Placeholder> directly.
            </p>
          </form>
        </div>
      </Section>
    </>
  );
}
