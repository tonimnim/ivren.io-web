import { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { company } from "@/lib/company";

/**
 * Split-screen auth frame. Deliberately spare: someone here is signing in,
 * not reading marketing, so the panel states the product once and the form
 * says nothing the form does not need.
 */
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
    <div className="grid min-h-svh lg:grid-cols-[1fr_minmax(0,42%)]">
      <div className="flex min-h-svh flex-col px-5 py-8 sm:px-10 lg:min-h-0 lg:px-14">
        {/* The mark links home; a separate "back" link would say it twice. */}
        <Logo />

        <div className="flex flex-1 items-center py-12">
          <div className="mx-auto w-full max-w-[24rem]">
            <h1 className="text-[clamp(1.6rem,2.8vw,2rem)] leading-[1.1] font-medium tracking-[-0.026em] text-ink">
              {title}
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-secondary">
              {intro}
            </p>

            <div className="mt-8">{children}</div>

            <p className="mt-7 text-sm text-ink-secondary">{footer}</p>
          </div>
        </div>

        <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-label">
          <span>© 2026 {company.legalName}</span>
          <Link href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-ink">
            Terms
          </Link>
        </footer>
      </div>

      <aside
        aria-hidden
        className="bg-hero-deep relative isolate hidden overflow-hidden lg:block"
      >
        <div className="bg-grid-dark absolute inset-0 -z-10" />

        <div className="flex h-full flex-col justify-end p-14">
          <p className="text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.15] font-medium tracking-[-0.024em] text-balance text-white">
            The interface engine{" "}
            <span className="font-normal text-white/50">that proves it.</span>
          </p>
          <p className="mt-10 border-t border-white/10 pt-6 font-mono text-[11px] tracking-[0.12em] text-white/40 uppercase">
            HL7 v2 · FHIR R4 · DICOM · X12 · NCPDP
          </p>
        </div>
      </aside>
    </div>
  );
}
