import { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

/** Shared frame for the auth screens — same grid and bloom as page headers. */
export function AuthShell({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden py-16">
      <div aria-hidden className="bg-grid absolute inset-0 -z-20" />
      <div aria-hidden className="bg-bloom-soft absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-[26rem] px-5">
        <Logo className="mb-8" />

        <h1 className="text-[clamp(1.6rem,3vw,2rem)] leading-tight font-medium tracking-[-0.024em] text-ink">
          {title}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-secondary">
          {intro}
        </p>

        <div className="mt-8 rounded-2xl border border-hairline bg-paper p-6 shadow-[0_1px_2px_rgb(20_24_29/0.03),0_12px_32px_-16px_rgb(20_24_29/0.12)]">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-ink-secondary">{footer}</p>

        <p className="mt-8 text-center font-mono text-[11px] leading-relaxed text-ink-label">
          An account issues your licence. The product itself never phones
          home —{" "}
          <Link href="/security" className="underline underline-offset-2">
            see the boundary
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
