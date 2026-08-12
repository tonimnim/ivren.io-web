import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { JsonLd } from "@/components/json-ld";
import { GLOSSARY, GLOSSARY_GROUPS } from "@/lib/glossary";
import {
  SITE_URL,
  breadcrumbSchema,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Healthcare interoperability glossary",
  description:
    "Plain-language definitions of the terms used in hospital integration: HL7 v2, FHIR R4, DICOM, X12, NCPDP, MLLP, ADT, ORU, DFT, Z-segments, dead-letter queues, shadow runs, and deployment gates.",
  path: "/glossary",
  keywords: [
    "healthcare interoperability glossary",
    "HL7 terminology",
    "what is MLLP",
    "what is an interface engine",
    "what is a Z-segment",
    "ADT ORU DFT message types",
    "X12 837 835 claims",
  ],
});

const definedTermSet = {
  "@type": "DefinedTermSet",
  "@id": `${SITE_URL}/glossary#termset`,
  name: "Healthcare interoperability glossary",
  url: `${SITE_URL}/glossary`,
  hasDefinedTerm: GLOSSARY.map((t) => ({
    "@type": "DefinedTerm",
    "@id": `${SITE_URL}/glossary#${t.slug}`,
    name: t.term,
    description: `${t.short} ${t.body}`,
    inDefinedTermSet: `${SITE_URL}/glossary#termset`,
  })),
};

export default function GlossaryPage() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          definedTermSet,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Glossary", path: "/glossary" },
          ]),
        )}
      />

      <PageHero
        eyebrow="Glossary"
        title="The vocabulary of hospital integration."
        intro="Every term below is one we use elsewhere on this site. Definitions are written to be read once and understood, not to be impressive."
      />

      <Section>
        <nav aria-label="Glossary sections" className="mb-12">
          <ul className="flex flex-wrap gap-2">
            {GLOSSARY_GROUPS.map((g) => (
              <li key={g}>
                <a
                  href={`#${g.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-block rounded-full border border-hairline px-3 py-1.5 text-sm text-ink-secondary transition-colors duration-150 hover:border-ink-label/50 hover:text-ink"
                >
                  {g}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16">
          {GLOSSARY_GROUPS.map((group) => {
            const terms = GLOSSARY.filter((t) => t.group === group);
            if (!terms.length) return null;
            return (
              <section
                key={group}
                id={group.toLowerCase().replace(/\s+/g, "-")}
                className="scroll-mt-28"
              >
                <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-label uppercase">
                  {group}
                </h2>
                <dl className="mt-6 divide-y divide-hairline-soft border-t border-hairline">
                  {terms.map((t) => (
                    <div
                      key={t.slug}
                      id={t.slug}
                      className="scroll-mt-28 py-7 lg:grid lg:grid-cols-[200px_1fr] lg:gap-12"
                    >
                      <dt className="text-lg font-medium text-ink">
                        {t.term}
                      </dt>
                      <dd className="mt-2 max-w-2xl lg:mt-0">
                        <p className="text-base leading-relaxed text-ink">
                          {t.short}
                        </p>
                        <p className="mt-2.5 text-sm leading-relaxed text-ink-secondary">
                          {t.body}
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      </Section>
    </>
  );
}
