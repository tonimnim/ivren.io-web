import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Placeholder } from "@/components/placeholder";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description:
    "What this site targets for accessibility, known gaps, and how to report an issue.",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Accessibility statement"
        title="We target WCAG 2.2 AA."
      />
      <Section hairline={false}>
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-secondary">
          <p>
            This site targets WCAG 2.2 Level AA: visible focus rings on
            every interactive element, text and status colors checked for
            contrast on their backgrounds, keyboard operability throughout,
            and alt text on every screenshot. Motion — the hero animation,
            the terminal set piece, scroll reveals — is paused entirely
            under a reduced-motion preference.
          </p>
          <p>
            Every page is built to render sensibly with JavaScript
            disabled, since hospital security workstations sometimes run
            that way.
          </p>
          <p>
            Known gaps: none tracked yet. If you find one, tell us —{" "}
            <Placeholder>CONTACT_EMAIL</Placeholder>.
          </p>
        </div>
      </Section>
    </>
  );
}
