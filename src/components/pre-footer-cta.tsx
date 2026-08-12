import { Container } from "@/components/container";
import { NewsletterSignup } from "@/components/newsletter-signup";

/**
 * The band between page content and the footer. Sits on the light canvas
 * so it reads as the last piece of the page rather than the first piece
 * of the footer, and carries the same grid texture as the page headers.
 */
export function PreFooterCta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-hairline bg-surface">
      <div aria-hidden className="bg-grid absolute inset-0 -z-20" />
      <div aria-hidden className="bg-bloom-soft absolute inset-0 -z-10" />

      <Container className="py-16 md:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-xl">
            <p className="kicker flex items-center gap-3">
              <span
                aria-hidden
                className="inline-block h-px w-6 bg-ink-label/50 sm:w-8"
              />
              Stay updated
            </p>
            <h2 className="mt-5 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] font-medium tracking-[-0.025em] text-balance text-ink">
              Release notes, written for the person who reads diffs.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-ink-secondary">
              What shipped, what changed, and the occasional write-up on
              interface engineering. A handful of emails a year, no
              marketing cadence.
            </p>
          </div>

          <div className="w-full lg:w-auto lg:shrink-0">
            <NewsletterSignup />
          </div>
        </div>
      </Container>
    </section>
  );
}
