import { ReactNode } from "react";
import { Container } from "@/components/container";

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-hairline">
      <div aria-hidden className="bg-grid absolute inset-0 -z-30" />
      <div aria-hidden className="bg-bloom-soft absolute inset-0 -z-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-canvas"
      />

      <Container className="py-16 md:py-20">
        <p className="kicker flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-px w-6 bg-ink-label/60 sm:w-8"
          />
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-[clamp(2rem,3.4vw,2.875rem)] font-medium leading-[1.06] tracking-[-0.024em] text-balance text-ink">
          {title}
        </h1>
        {intro && (
          <div className="mt-5 max-w-[52ch] text-base leading-[1.6] text-pretty text-ink-secondary sm:text-[1.0625rem]">
            {intro}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
