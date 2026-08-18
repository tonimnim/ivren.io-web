import { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { company } from "@/lib/company";

/**
 * Split-screen auth frame: the form owns the left column at full
 * attention, and the right column carries the brand field and the two
 * facts a hospital buyer actually weighs. The panel is decorative and
 * drops away below lg so a phone gets nothing but the form.
 */
export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_minmax(0,44%)]">
      {/* form column */}
      <div className="flex min-h-svh flex-col px-5 py-8 sm:px-10 lg:min-h-0 lg:px-14">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <Link
            href="/"
            className="text-sm text-ink-label transition-colors duration-150 hover:text-ink"
          >
            Back to site
          </Link>
        </header>

        <div className="flex flex-1 items-center py-12">
          <div className="mx-auto w-full max-w-[26rem]">
            <p className="kicker flex items-center gap-3">
              <span
                aria-hidden
                className="inline-block h-px w-6 bg-ink-label/50"
              />
              {eyebrow}
            </p>

            <h1 className="mt-5 text-[clamp(1.75rem,3.2vw,2.25rem)] leading-[1.1] font-medium tracking-[-0.026em] text-balance text-ink">
              {title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-pretty text-ink-secondary">
              {intro}
            </p>

            <div className="mt-9">{children}</div>

            <p className="mt-8 text-sm text-ink-secondary">{footer}</p>
          </div>
        </div>

        <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-label">
          <span>© 2026 {company.legalName}</span>
          <Link href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-ink">
            Terms
          </Link>
          <Link href="/security" className="transition-colors hover:text-ink">
            Security
          </Link>
        </footer>
      </div>

      {/* brand panel */}
      <aside
        aria-hidden
        className="bg-hero-deep relative isolate hidden overflow-hidden lg:block"
      >
        <div className="bg-grid-dark absolute inset-0 -z-10" />

        <div className="flex h-full flex-col justify-between p-14">
          <p className="kicker kicker-dark flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-white/30" />
            Healthcare integration
          </p>

          <div>
            <p className="text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.15] font-medium tracking-[-0.024em] text-balance text-white">
              The interface engine{" "}
              <span className="font-normal text-white/50">
                that proves it.
              </span>
            </p>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">
              Your account issues the licence key. The engine itself runs on
              your machine, offline, and never phones home.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8">
            {[
              ["Wire formats", "HL7 v2 · FHIR R4 · DICOM · X12 · NCPDP"],
              ["Deployment", "Local, offline, air-gapped supported"],
              ["Telemetry", "None. Nothing is uploaded."],
              ["Evidence", "Hash-chained audit of every message"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[10.5px] tracking-[0.14em] text-white/35 uppercase">
                  {k}
                </dt>
                <dd className="mt-1.5 text-[13px] leading-relaxed text-white/70">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>
  );
}
