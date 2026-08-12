import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Placeholder } from "@/components/placeholder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Brand & press",
  path: "/brand",
  description:
    "Ivren logo files, colour palette, and a company description you can quote.",
});

const SWATCHES = [
  { name: "Canvas", value: "#ffffff" },
  { name: "Surface", value: "#f6f7f9" },
  { name: "Ink", value: "#14181d" },
  { name: "Accent", value: "#0d63b3" },
  { name: "Ok", value: "#1a6f45" },
  { name: "Warn", value: "#6f4e00" },
  { name: "Flag", value: "#9d3419" },
];

export default function BrandPage() {
  return (
    <>
      <PageHero
        eyebrow="Brand & press"
        title="Logo files, palette, and a description you can use."
      />

      <Section>
        <h2 className="text-xl font-medium text-ink">Logo</h2>
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="w-48 rounded-lg border border-hairline p-6 text-center">
            <Image
              src="/logo.png"
              alt="Ivren mark"
              width={64}
              height={64}
              className="mx-auto"
            />
            <a
              href="/logo.png"
              download
              className="mt-4 block text-sm text-accent hover:text-accent-strong"
            >
              logo.png
            </a>
          </div>
          <div className="w-48 rounded-lg border border-hairline p-6 text-center">
            <Image
              src="/icon-192.png"
              alt="Ivren favicon"
              width={64}
              height={64}
              className="mx-auto"
            />
            <a
              href="/favicon.ico"
              download
              className="mt-4 block text-sm text-accent hover:text-accent-strong"
            >
              ivren.ico
            </a>
          </div>
        </div>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-secondary">
          Never recolor, stretch, add effects, or place the mark on a
          background darker than white. Keep clear space around it of at
          least half its height. For an SVG, request one — don&rsquo;t
          auto-trace the PNG.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-medium text-ink">Palette</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SWATCHES.map((s) => (
            <div key={s.name}>
              <div
                className="h-16 w-full rounded-md border border-hairline"
                style={{ backgroundColor: s.value }}
              />
              <p className="mt-2 text-sm font-medium text-ink">{s.name}</p>
              <p className="font-mono text-xs text-ink-label">{s.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-xl font-medium text-ink">Company description</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-secondary">
          Ivren is a healthcare interface assurance and integration
          platform. It maps, verifies, runs, and monitors the data
          interfaces inside a hospital, reading the configuration exports
          of existing interface engines and running entirely on the
          hospital&rsquo;s own machine.
        </p>
        <div className="mt-6">
          <Placeholder>PRESS_PHOTO</Placeholder>
        </div>
      </Section>
    </>
  );
}
