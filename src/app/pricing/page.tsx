import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/button";
import { company } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  path: "/pricing",
  description:
    "Ivren licensing: a free Trial tier, plus Professional and Enterprise, billed monthly or yearly. Licences activate offline, so air-gapped hospital networks are a first-class deployment.",
});

const TIERS = [
  {
    name: "Trial",
    blurb: "Evaluate the full product. No license required.",
    price: "Free",
    priceNote: "no time pressure",
  },
  {
    name: "Professional",
    blurb: "For a single interface team.",
    price: "Contact us",
    priceNote: "billed monthly or yearly",
  },
  {
    name: "Enterprise",
    blurb: "Site licenses, fleet installs, no machine binding.",
    price: "Contact us",
    priceNote: "billed monthly or yearly",
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
        title="Start free. Buy by seat or by site."
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
              <p className="mt-6 text-2xl font-medium text-ink">
                {tier.price}
              </p>
              <p className="mt-1 text-xs text-ink-label">{tier.priceNote}</p>
              <Button
                href={tier.name === "Trial" ? "/download" : "#contact"}
                variant={tier.name === "Trial" ? "primary" : "secondary"}
                className="mt-6"
              >
                {tier.name === "Trial" ? "Download Ivren" : "Request a quote"}
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
            <a
              href={`mailto:${company.email}?subject=Ivren%20quote%20request`}
              className="text-accent hover:text-accent-strong"
            >
              {company.email}
            </a>{" "}
            with your organization, tier, seat count, and billing period, or
            call{" "}
            <a
              href={company.phoneHref}
              className="text-accent hover:text-accent-strong"
            >
              {company.phone}
            </a>
            .
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href={`mailto:${company.email}?subject=${encodeURIComponent(
                "Ivren quote request",
              )}&body=${encodeURIComponent(
                "Organization:\nTier (Trial / Professional / Enterprise):\nSeat count:\nBilling period (monthly / yearly):\nAnything else:",
              )}`}
              external
              className="w-full sm:w-auto"
            >
              Request a quote
            </Button>
            <Button
              href={company.phoneHref}
              variant="secondary"
              external
              className="w-full sm:w-auto"
            >
              {company.phone}
            </Button>
          </div>
          <p className="mt-4 text-xs text-ink-label">
            We accept purchase orders and can supply W-9 and supplier
            forms on request.
          </p>
        </div>
      </Section>
    </>
  );
}
