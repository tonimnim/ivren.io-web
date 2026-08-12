import Link from "next/link";
import { Logo } from "@/components/logo";
import { footerColumns } from "@/lib/nav";
import { company } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="bg-footer-deep relative overflow-hidden">
      <div aria-hidden className="bg-grid-dark absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8 sm:pt-24 lg:px-12 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr] lg:gap-20">
          {/* brand block */}
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Healthcare interface assurance and integration. Runs entirely
              on your machine.
            </p>
            <div className="mt-7 space-y-1.5 font-mono text-xs text-white/50">
              <p>
                <a
                  href={`mailto:${company.email}`}
                  className="transition-colors duration-150 hover:text-white"
                >
                  {company.email}
                </a>
              </p>
              <p>
                <a
                  href={company.phoneHref}
                  className="transition-colors duration-150 hover:text-white"
                >
                  {company.phone}
                </a>
              </p>
              <p className="text-white/35">{company.location}</p>
            </div>

            <p className="mt-7 max-w-xs font-mono text-xs leading-relaxed text-white/40">
              Nothing is uploaded. Ivren reads your files in one process,
              on your machine — and works with no internet at all.
            </p>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="mb-4 font-mono text-[10.5px] font-medium tracking-[0.14em] text-white/35 uppercase">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors duration-150 ease-out hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* spec line */}
        <div className="mt-20 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-8 font-mono text-[11px] tracking-[0.06em] text-white/40">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[#4ade80]/80"
          />
          HL7 v2 · FHIR R4 · DICOM · X12 · NCPDP — runs offline, no
          account, no telemetry
        </div>

        {/* legal strip */}
        <div className="mt-8 space-y-3 text-xs leading-relaxed text-white/45">
          <p>
            Ivren is not a medical device and is not intended for clinical
            decision-making.
          </p>
          <p>
            All product names and trademarks referenced anywhere on this
            site are the property of their respective owners. Ivren is
            independent and is not affiliated with or endorsed by any of
            them.
          </p>
          <p>© 2026 {company.legalName}. All rights reserved.</p>
        </div>

        {/* giant watermark, clipped by the footer */}
        <div
          aria-hidden
          className="pointer-events-none relative mt-16 h-[clamp(72px,14vw,170px)] select-none"
        >
          <span className="font-display absolute -bottom-[0.24em] left-1/2 -translate-x-1/2 bg-gradient-to-b from-white/[0.13] to-white/[0.03] bg-clip-text text-[clamp(5.5rem,21vw,18rem)] leading-none font-semibold tracking-[-0.045em] lowercase whitespace-nowrap text-transparent">
            ivren
          </span>
        </div>
      </div>
    </footer>
  );
}
