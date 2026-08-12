import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Placeholder } from "@/components/placeholder";
import { company } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  path: "/changelog",
  description:
    "Ivren release notes, newest first — written for the analyst who reads diffs.",
});

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="Newest first."
        intro="Written for the analyst who reads diffs. No marketing language in entries."
      />

      <Section>
        <div className="max-w-2xl">
          <div className="border-t border-hairline pt-8">
            <p className="font-mono text-sm text-accent">
              v{company.version}
            </p>
            <Placeholder as="div">CHANGELOG</Placeholder>
          </div>
          <p className="mt-10 text-sm text-ink-label">
            Subscribe via RSS at{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
              /changelog/feed.xml
            </code>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
