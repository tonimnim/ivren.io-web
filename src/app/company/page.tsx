import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { company, offices } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Company",
  path: "/company",
  description:
    "Ivren builds a healthcare interface engine for hospital IT and integration teams. A product of 42degrees, based in Texas.",
});

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Built by people who read the exports nobody else would."
        intro={`${company.legalName} builds the interface engine that carries orders, admissions, results, and charges between hospital systems — and proves what it carried. A product of ${company.parent}, based in ${company.location}.`}
      />

      <Section>
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-secondary">
          <p>
            Every hospital runs on interfaces. Orders, admissions, results,
            and charges move between clinical systems as HL7, FHIR, DICOM,
            X12, and NCPDP messages, around the clock, largely unwatched.
            The teams responsible for them are small, and the tooling they
            inherited was built to move messages — not to explain them.
          </p>
          <p>
            Ivren exists because that gap is where the expensive failures
            live. A field changes and three systems downstream break. A feed
            goes quiet and nobody notices until someone asks where their
            results went. A migration gets deferred for years because no
            one can prove it is safe.
          </p>
          <p>
            The incumbents&rsquo; unit of thought is the channel — a live
            configuration object on one server, edited in place through a
            GUI, sometimes in production at 02:00. Nobody reviews one. When
            the person who built channel 47 leaves, the truth leaves with
            them.
          </p>
          <p>
            So we built an engine whose unit of thought is the interface as
            a versioned artifact, with the estate — not any one server — as
            the source of truth. It routes the same messages every engine
            routes, and it can tell you what it carried, what changed, and
            what a change would break before it ships. It runs entirely on
            your own machine: no upload, no telemetry, no phone-home. That
            last constraint is not a feature we added. It is the premise we
            started from.
          </p>
          <p className="border-t border-hairline pt-6 font-mono text-sm text-ink">
            &ldquo;We do not claim what we cannot prove. If you catch this
            site saying something the product can&rsquo;t do, we want to
            know.&rdquo;
          </p>
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-xl font-medium text-ink">Offices</h2>
          <p className="font-mono text-[11px] tracking-[0.1em] text-ink-label uppercase">
            {offices.length} location{offices.length === 1 ? "" : "s"}
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary">
          Ivren runs on your own machines, so support never depends on a
          data centre near you — but the people do sit somewhere, and this
          is where.
        </p>

        {/*
          Row layout rather than a card grid: reads as intentional with a
          single location and stays readable as more are added.
        */}
        <ul className="mt-10 border-t border-hairline">
          {offices.map((o) => (
            <li
              key={`${o.city}-${o.country}`}
              className="grid gap-4 border-b border-hairline-soft py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto] md:items-start md:gap-10"
            >
              <div className="min-w-0">
                <h3 className="text-lg font-medium text-ink">{o.city}</h3>
                <p className="mt-0.5 text-sm text-ink-secondary">
                  {o.country}
                </p>
              </div>

              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[10.5px] tracking-[0.1em] text-accent uppercase">
                  {o.role}
                </span>
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-ink-secondary">
                  {o.detail}
                </p>
                {o.address && (
                  <p className="mt-2 font-mono text-xs text-ink-label">
                    {o.address}
                  </p>
                )}
              </div>

              <p className="font-mono text-xs whitespace-nowrap text-ink-label md:text-right">
                {o.timezone}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="text-xl font-medium text-ink">Contact</h2>
        <dl className="mt-5 max-w-md space-y-4 text-sm">
          <div className="flex justify-between gap-6 border-t border-hairline-soft pt-4">
            <dt className="text-ink-label">Email</dt>
            <dd>
              <a
                href={`mailto:${company.email}`}
                className="font-mono text-accent hover:text-accent-strong"
              >
                {company.email}
              </a>
            </dd>
          </div>
          <div className="flex justify-between gap-6 border-t border-hairline-soft pt-4">
            <dt className="text-ink-label">Phone</dt>
            <dd>
              <a
                href={company.phoneHref}
                className="font-mono text-ink hover:text-accent"
              >
                {company.phone}
              </a>
            </dd>
          </div>
          <div className="flex justify-between gap-6 border-t border-hairline-soft pt-4">
            <dt className="text-ink-label">Location</dt>
            <dd className="text-ink">{company.location}</dd>
          </div>
          <div className="flex justify-between gap-6 border-t border-hairline-soft pt-4">
            <dt className="text-ink-label">Security reports</dt>
            <dd>
              <a
                href={`mailto:${company.securityEmail}`}
                className="font-mono text-accent hover:text-accent-strong"
              >
                {company.securityEmail}
              </a>
            </dd>
          </div>
        </dl>
      </Section>
    </>
  );
}
