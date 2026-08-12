import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/button";
import { featureGroups } from "@/lib/features";

export const metadata: Metadata = {
  title: "Product",
  description:
    "The full Ivren platform: estate mapping and impact analysis, regression testing and the deployment gate, the local engine, shadow-run migration, and revenue-cycle tooling.",
};

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Map the estate, prove every change, run interfaces that don’t drop messages."
        intro="Everything below ships in the product you download — one executable, no cloud requirement, working entirely on your machine."
      />

      {featureGroups.map((group) => (
        <Section key={group.key} id={group.key} className="scroll-mt-28">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
                {group.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                {group.summary}
              </p>
            </div>
            <div className="divide-y divide-hairline-soft border-t border-hairline">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="-mx-4 rounded-md px-4 py-5 transition-colors duration-200 ease-out hover:bg-surface"
                >
                  <h3 className="font-medium text-ink">{item.name}</h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      ))}

      <Section className="bg-surface">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink">
              Try it against your own exports.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-secondary">
              Or skip the file entirely — every install ships with sample
              data.
            </p>
          </div>
          <Button href="/download" className="shrink-0">
            Download Ivren
          </Button>
        </div>
      </Section>
    </>
  );
}
