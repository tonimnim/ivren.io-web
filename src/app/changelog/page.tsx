import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { company } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  path: "/changelog",
  description:
    "Ivren release notes, newest first — written for the analyst who reads diffs.",
});

type Release = {
  version: string;
  date: string;
  summary: string;
  sections: { heading: string; items: string[] }[];
};

const RELEASES: Release[] = [
  {
    version: company.version,
    date: "August 2026",
    summary:
      "The current shipping build. This is where per-release notes begin; earlier versions were internal.",
    sections: [
      {
        heading: "Mapping",
        items: [
          "Import configuration exports from supported interface engines and render the full estate: sources, destinations, protocols, and the fields carrying patient identifiers.",
          "Downstream impact analysis for field changes.",
          "Credentials found inside imported exports are stripped at import and reported for rotation.",
          "A malformed or truncated export is reported as a located finding and never fails the rest of the import.",
        ],
      },
      {
        heading: "Verification",
        items: [
          "ivren run compares two output sets and returns PASS or FAIL.",
          "ivren gate decides deployability using CI exit codes: 0 PASS, 1 FAIL, 2 could-not-complete, 3 INDETERMINATE, 4 REFUSED. Missing evidence can never become PASS.",
          "ivren replay replays a recorded corpus against approved, pinned, non-production targets; production-class targets are structurally refused.",
          "ivren probe reports what a connector would do without doing it.",
          "ivren parse prints an HL7 message field tree with spec names.",
        ],
      },
      {
        heading: "Formats and transport",
        items: [
          "HL7 v2 across multiple versions with an embedded data dictionary, FHIR R4, DICOM metadata and worklists, X12 claims envelopes, NCPDP pharmacy claims, and HL7 batch files (FHS/BHS).",
          "MLLP, HTTP, SFTP and file transports, plus database-to-database connector modelling.",
          "DICOM pixel data is structurally never stored.",
        ],
      },
      {
        heading: "Engine",
        items: [
          "Durable queues with fsync-before-ack, per-destination retry lanes with backoff, and dead-letter handling.",
          "Alert-on-silence when an expected feed stops producing traffic.",
          "Declarative transforms with static silent-drop analysis.",
          "Message search and resend from the console, with metadata, masked, full and export permissions separated.",
        ],
      },
      {
        heading: "Migration",
        items: [
          "Shadow-run: execute a proposed route beside the incumbent on the same traffic, deliver nothing, and produce a signed divergence report locating any difference to the exact field.",
        ],
      },
      {
        heading: "Security and licensing",
        items: [
          "Console binds to 127.0.0.1 only and makes no external network requests.",
          "Hash-chained, append-only audit logging with tamper detection behind server-side role-based access control.",
          "Signed licences (Ed25519) verified locally, with fully air-gapped activation and a 14-day grace period when the licence server is unreachable.",
          "An expired or unlicensed install never blocks activate, help, version, or uninstall.",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="Newest first."
        intro="Written for the analyst who reads diffs. No marketing language in entries."
      />

      <Section>
        <div className="max-w-3xl space-y-16">
          {RELEASES.map((r) => (
            <article key={r.version}>
              <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-hairline pt-8">
                <h2 className="font-mono text-lg font-medium text-accent">
                  v{r.version}
                </h2>
                <time className="font-mono text-sm text-ink-label">
                  {r.date}
                </time>
              </header>

              <p className="mt-4 text-base leading-relaxed text-ink-secondary">
                {r.summary}
              </p>

              <div className="mt-8 space-y-8">
                {r.sections.map((s) => (
                  <section key={s.heading}>
                    <h3 className="text-xs font-semibold tracking-[0.14em] text-ink-label uppercase">
                      {s.heading}
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {s.items.map((item) => (
                        <li
                          key={item}
                          className="border-t border-hairline-soft pt-2.5 text-sm leading-relaxed text-ink-secondary"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-14 max-w-3xl border-t border-hairline pt-6 text-sm text-ink-label">
          Subscribe via RSS at{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
            /changelog/feed.xml
          </code>
          .
        </p>
      </Section>
    </>
  );
}
