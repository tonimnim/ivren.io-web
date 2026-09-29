import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/button";
import { company } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";
import {
  CARD_CHECKOUT_AVAILABLE,
  PLAN_AUDIENCE,
  formatPrice,
  getPlans,
  isSelfServe,
  siteBand,
  type Plan,
} from "@/lib/plans";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  path: "/pricing",
  description:
    "Ivren is free to map and analyse your whole estate — offline, with no account. Paid plans run the engine, priced per site per year. Licences activate offline, so an air-gapped network is a first-class deployment.",
});

/**
 * What the free tier does: the binary's unlicensed verbs, in plain words.
 * `unlicensedVerbs` in the engine decides this list, not this page — with one
 * deliberate exception. The AI layer (Astra: explain and ask) is never free;
 * it belongs to the paid plans the catalogue marks `ai_layer`. The engine
 * still lists `ask` and `explain` as unlicensed, which is the engine's bug to
 * fix, not a reason to list them here.
 */
const FREE = [
  "Import your current engine's configuration and map the whole estate",
  "The console, served locally, with every interface in one model",
  "Living interface specs, generated from the estate",
  "Capacity and retention analysis",
  "Message tooling: HL7 v2 field trees and CDA inspection",
  "Passive wire discovery from a packet capture",
  "The coverage catalogue: every transport, format and authentication method",
];

/** What a paid plan adds: the verbs behind the licence. */
const PAID = [
  "The engine: listeners, the reviewed pipeline and durable fan-out",
  "Regression testing and the deployment gate",
  "Replay and probe against approved non-production targets",
  "Shadow runs against your current engine's output",
  "Charge reconciliation",
  "Certificate expiry watch",
  "Change governance with separate approval",
  "Vendor self-test kits",
  "The pack registry",
  "Encryption posture reports",
  "DICOM worklist and imaging checks",
];

const quoteHref = (plans: Plan[] | null) =>
  `mailto:${company.email}?subject=${encodeURIComponent(
    "Ivren quote request",
  )}&body=${encodeURIComponent(
    `Organisation:\nPlan${plans ? ` (${plans.map((p) => p.name).join(" / ")})` : ""}:\nNumber of sites:\nAnything else:`,
  )}`;

function Tick() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="mt-[3px] shrink-0 text-ok"
    >
      <path
        d="M2.5 7.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Card({
  name,
  audience,
  price,
  priceNote,
  details,
  cta,
}: {
  name: string;
  audience: string;
  price: string;
  priceNote: string;
  details: string[];
  cta: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col bg-canvas p-6 transition-colors duration-200 ease-out hover:bg-surface sm:p-8">
      <h2 className="text-lg font-medium text-ink">{name}</h2>
      <p className="mt-1 text-sm text-ink-secondary">{audience}</p>
      <p className="mt-6 font-tabular text-2xl font-medium text-ink">{price}</p>
      <p className="mt-1 text-xs text-ink-label">{priceNote}</p>
      <ul className="mt-6 flex-1 space-y-2.5">
        {details.map((d) => (
          <li
            key={d}
            className="flex gap-2 text-sm leading-snug text-ink-secondary"
          >
            <Tick />
            {d}
          </li>
        ))}
      </ul>
      <div className="mt-8">{cta}</div>
    </div>
  );
}

export default async function PricingPage() {
  // Rendered from the control plane's catalogue. If it cannot be reached the
  // page says so and offers a quote — it never falls back to typed-in prices.
  const plans = await getPlans();
  // Every paid plan includes the AI layer (owner decision, 2026-09-29). It
  // joins this list once the catalogue says so for every plan, so the page
  // never claims more than the AI gate, which reads the same flag, enforces.
  const paid =
    plans && plans.length > 0 && plans.every((p) => p.ai_layer)
      ? ["The AI layer: explain and ask", ...PAID]
      : PAID;

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Free to map. Priced per site to run."
        intro="The free tier is your whole estate, understood — offline, with no account and no time limit. A paid plan runs the engine, per site, per year. Licences activate offline, so an air-gapped network is a first-class deployment."
      />

      <Section>
        <div
          className={`grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline md:grid-cols-2 ${
            plans && plans.length >= 3 ? "xl:grid-cols-4" : ""
          }`}
        >
          <Card
            name="Free"
            audience="Anyone, for as long as you like"
            price="$0"
            priceNote="no account, no time limit"
            details={[
              "Map and analyse the whole estate",
              "Runs offline; nothing leaves the machine",
              "No licence key needed",
            ]}
            cta={
              <Button href="/download" className="w-full">
                Download Ivren
              </Button>
            }
          />

          {plans ? (
            plans.map((plan) => (
              <Card
                key={plan.id}
                name={plan.name}
                audience={PLAN_AUDIENCE[plan.id] ?? siteBand(plan)}
                price={formatPrice(plan.annual_cents_per_site, plan.currency)}
                priceNote="per site, per year"
                details={[
                  siteBand(plan),
                  `${plan.seats_per_site} machines per site`,
                  plan.ai_layer
                    ? "The AI layer: explain and ask"
                    : "The AI layer is not included",
                ]}
                cta={
                  CARD_CHECKOUT_AVAILABLE && isSelfServe(plan) ? (
                    <Button href="/get-started" className="w-full">
                      Buy now
                    </Button>
                  ) : (
                    <Button
                      href="#contact"
                      variant="secondary"
                      className="w-full"
                    >
                      Request a quote
                    </Button>
                  )
                }
              />
            ))
          ) : (
            <Card
              name="Paid plans"
              audience="Per site, per year"
              price="Ask us"
              priceNote="the price list couldn't be loaded just now"
              details={[
                "Everything in Free",
                "Runs the engine",
                "Quotes within one business day",
              ]}
              cta={
                <Button href="#contact" variant="secondary" className="w-full">
                  Request a quote
                </Button>
              }
            />
          )}
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-secondary">
          If a paid licence lapses, Ivren falls back to the free tier rather
          than locking you out. The estate you mapped stays readable, because
          it was always yours.
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Free, for good
            </h2>
            <ul className="mt-6 divide-y divide-hairline-soft border-t border-hairline">
              {FREE.map((f) => (
                <li key={f} className="flex gap-2.5 py-3.5 text-sm">
                  <Tick />
                  <span className="text-ink-secondary">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              A paid plan adds
            </h2>
            <ul className="mt-6 divide-y divide-hairline-soft border-t border-hairline">
              {paid.map((f) => (
                <li key={f} className="flex gap-2.5 py-3.5 text-sm">
                  <Tick />
                  <span className="text-ink-secondary">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-medium tracking-tight text-ink">
            Licences activate offline
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-secondary">
            Every machine that runs the engine activates with your
            organisation&apos;s licence key. A machine that never touches the
            internet writes a request; bring it to ivren.io from any connected
            computer, and take the licence back.
          </p>
          <Button href="/activate" variant="secondary" className="mt-6">
            Activate an offline machine
          </Button>
        </div>
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
            with your organisation, the plan and your number of sites, or call{" "}
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
              href={quoteHref(plans)}
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
            We accept purchase orders and can supply W-9 and supplier forms on
            request.
          </p>
        </div>
      </Section>
    </>
  );
}
