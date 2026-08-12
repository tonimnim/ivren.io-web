import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { company } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Company",
  path: "/company",
  description:
    "Ivren builds healthcare interface assurance and integration software for hospital IT and integration teams. Based in Texas.",
});

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Built by people who read the exports nobody else would."
        intro={`${company.legalName} builds software for the hospital interface layer — the feeds that carry orders, admissions, results, and charges between clinical systems. Based in ${company.location}.`}
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
            So we built the tool we wanted: it reads the configuration your
            engine already has, shows you the estate as it actually is,
            proves a change is safe before it ships, and runs entirely on
            your own machine — no account, no upload, no telemetry. That
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
