import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Placeholder } from "@/components/placeholder";

export const metadata: Metadata = {
  title: "Company",
  description: "About Ivren.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Built by people who read the exports nobody else would."
      />

      <Section>
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-secondary">
          <Placeholder as="div">COMPANY_BLURB</Placeholder>
          <p className="border-t border-hairline pt-6 font-mono text-sm text-ink">
            &ldquo;We do not claim what we cannot prove. If you catch this
            site saying something the product can&rsquo;t do, we want to
            know.&rdquo;
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="text-xl font-medium text-ink">Contact</h2>
        <p className="mt-3 text-base text-ink-secondary">
          <Placeholder>CONTACT_EMAIL</Placeholder>
        </p>
      </Section>
    </>
  );
}
