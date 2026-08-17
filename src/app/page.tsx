import { Section, Eyebrow, Container } from "@/components/container";
import { Button } from "@/components/button";
import { HeroOpsPanel } from "@/components/hero-ops-panel";
import { TerminalPanel } from "@/components/terminal-panel";
import { WindowChrome } from "@/components/window-chrome";
import { Reveal } from "@/components/reveal";
import { featureGroups } from "@/lib/features";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const HOME_TITLE = "Ivren — the healthcare interface engine that proves it";

/*
 * openGraph is spelled out in full rather than just adding `url`:
 * metadata merges shallowly, so a partial object here would replace the
 * root layout's openGraph entirely and drop title/description/siteName.
 */
export const metadata = {
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website" as const,
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
  },
};

const PROBLEMS = [
  {
    title: "The estate is undocumented.",
    body: "Dozens to hundreds of feeds carry orders, admissions, results, and charges between systems. The diagram, if one exists, is out of date, and the person who built half of it has left.",
  },
  {
    title: "Changes ship on hope.",
    body: "There is usually no way to know what a field change breaks three systems downstream until something breaks three systems downstream.",
  },
  {
    title: "Silence looks like success.",
    body: "When a feed stops, nothing alarms. The queue is empty, the dashboard is green, and the first signal is a phone call from someone who noticed missing results.",
  },
];

const STANCES = [
  {
    title: "It moves the messages.",
    body: "MLLP, HTTP and file spool inbound. HL7 v2 across twelve embedded dictionaries, plus FHIR, CDA, DICOM, X12 and NCPDP. Filters and transforms through one durable pipeline, then fan-out — with fsync-before-ack, dead letters, replay and retention behind it.",
  },
  {
    title: "It proves what it did.",
    body: "Every other engine moves messages and forgets. Ivren keeps a hash-chained record of what it carried, and treats a change the way modern software treats code: versioned, tested against recorded traffic, and gated on evidence that can never become PASS by being absent.",
  },
  {
    title: "The estate is the source of truth, not one server.",
    body: "Certificates that expire, feeds running unencrypted, interfaces that die when a vendor moves — Ivren inventories them across the whole estate and correlates each finding to the interfaces that depend on it. No incumbent does this, because each one only knows its own channels.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero — full-bleed deep-blue field, light type */}
      <section className="bg-hero-deep relative isolate -mt-14 overflow-hidden pt-14 sm:-mt-16 sm:pt-16">
        <div aria-hidden className="bg-grid-dark absolute inset-0 -z-10" />

        <Container className="pt-14 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
          <div className="mx-auto max-w-[840px] text-center">
            <p className="kicker kicker-dark flex items-center justify-center gap-3">
              <span
                aria-hidden
                className="inline-block h-px w-6 bg-white/30 sm:w-8"
              />
              Healthcare integration · Interface assurance
              <span
                aria-hidden
                className="inline-block h-px w-6 bg-white/30 sm:w-8"
              />
            </p>

            <h1 className="mt-6 text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.028em] text-balance text-white">
              The interface engine{" "}
              <span className="font-normal text-white/50">
                that proves it.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-[52ch] text-base leading-[1.65] text-pretty text-white/75 sm:text-lg">
              Ivren routes clinical messages like any interface engine —
              and unlike any of them, shows you what it carried, what
              changed, and what a change would break, before you ship it.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
              <Button
                href="/download"
                variant="onDark"
                className="w-full sm:w-auto"
              >
                Download Ivren
              </Button>
              <Button
                href="/docs"
                variant="onDarkSecondary"
                className="w-full sm:w-auto"
              >
                Explore the docs
              </Button>
            </div>
          </div>

          <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
            {/* horizon light rising behind the console */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-4 -top-20 h-40 bg-[radial-gradient(52%_100%_at_50%_100%,rgb(124_196_245/0.3),rgb(124_196_245/0.1)_60%,rgb(124_196_245/0)_100%)] blur-md"
            />
            <Reveal>
              <HeroOpsPanel />
            </Reveal>

            <div className="kicker mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-tabular">
              <span className="text-white/60">
                HL7 v2 · FHIR R4 · DICOM · X12 · NCPDP
              </span>
              <span className="text-white/40">
                Runs offline · No account · No telemetry
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* The problem */}
      <Section hairline={false} className="bg-surface">
        <Reveal>
          <Eyebrow>The problem</Eyebrow>
          <h2 className="max-w-3xl text-[clamp(1.75rem,2.8vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
            The interface layer runs the hospital, and almost nobody can
            see it.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p) => (
            <Reveal key={p.title}>
              <h3 className="text-lg font-medium leading-snug text-ink">
                {p.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-secondary">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* What Ivren is */}
      <Section>
        <Reveal>
          <Eyebrow>What Ivren is</Eyebrow>
        </Reveal>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {STANCES.map((s, i) => (
            <Reveal key={s.title}>
              <p className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-lg font-medium leading-snug text-ink">
                {s.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-secondary">
                {s.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Deployment gate */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>Prove it before it ships</Eyebrow>
            <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
              A deployment gate a pipeline can trust.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-secondary">
              Exit codes with no ambiguity: 0 PASS · 1 FAIL · 3
              INDETERMINATE · 4 REFUSED. An answer your CI doesn&rsquo;t
              understand is an answer it refuses to deploy — and missing
              evidence can never become PASS.
            </p>
            <div className="mt-6">
              <Button href="/docs/cli-reference" variant="ghost">
                Read the CLI reference →
              </Button>
            </div>
          </Reveal>
          <Reveal>
            <TerminalPanel />
          </Reveal>
        </div>
      </Section>

      {/* Sample data */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <WindowChrome title="ivren — explore with sample data" />
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <Eyebrow>See it without a file</Eyebrow>
            <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
              Explore with sample data.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-secondary">
              Every install ships with bundled synthetic interfaces. One
              click loads the full console — overview, interfaces, live
              status, health — with no file of your own required. The
              product is the demo; there is nothing to book.
            </p>
            <p className="mt-4 text-sm text-ink-label">
              Screenshots on this site are of the real product, taken
              against labeled synthetic data.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Platform */}
      <Section className="bg-surface">
        <Reveal>
          <Eyebrow>The platform</Eyebrow>
          <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
            Map. Prove. Run. Migrate.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-secondary">
            One platform for the whole lifecycle of a hospital interface —
            from the first import of your estate to the day you cut a route
            over.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {featureGroups.map((group) => (
            <div
              key={group.key}
              className="group min-w-0 bg-canvas p-6 transition-colors duration-200 ease-out hover:bg-surface-2"
            >
              <h3 className="text-base font-medium text-ink transition-colors duration-200 group-hover:text-accent">
                {group.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {group.summary}
              </p>
              <ul className="mt-4 space-y-2">
                {group.items.slice(0, 3).map((item) => (
                  <li
                    key={item.name}
                    className="border-t border-hairline-soft pt-2 text-sm text-ink-secondary"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button href="/product" variant="secondary">
            See the full platform
          </Button>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <Reveal className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
              Download Ivren.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-secondary">
              One ~15 MB executable for Windows. No account. No internet
              required. Evaluate on the Trial tier, or explore with sample
              data first.
            </p>
          </div>
          <Button href="/download" className="shrink-0">
            Download Ivren
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
