import { ReactNode } from "react";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";

export function LegalPage({
  title,
  draftNote,
  children,
}: {
  title: string;
  draftNote?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} />
      <Section hairline={false}>
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-secondary">
          {draftNote && (
            <p className="rounded-lg border border-dashed border-warn/50 bg-warn-soft px-4 py-3 text-sm text-warn">
              {draftNote}
            </p>
          )}
          {children}
        </div>
      </Section>
    </>
  );
}
