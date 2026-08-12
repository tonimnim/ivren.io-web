import Link from "next/link";
import { Logo } from "@/components/logo";
import { Placeholder } from "@/components/placeholder";
import { footerColumns } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="bg-footer-deep relative overflow-hidden">
      <div aria-hidden className="bg-grid-dark absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 sm:pt-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
          {/* brand block */}
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Healthcare interface assurance and integration. Runs entirely
              on your machine.
            </p>
            <p className="mt-5 max-w-xs border-t border-white/10 pt-5 font-mono text-xs leading-relaxed text-white/40">
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
        <div className="mt-14 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6 font-mono text-[11px] tracking-[0.06em] text-white/40">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[#4ade80]/80"
          />
          HL7 v2 · FHIR R4 · DICOM · X12 · NCPDP — runs offline, no
          account, no telemetry
        </div>

        {/* legal strip */}
        <div className="mt-6 space-y-2.5 text-xs leading-relaxed text-white/45">
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
          <p>
            © 2026 <Placeholder>LEGAL_NAME</Placeholder>. All rights
            reserved.
          </p>
        </div>

        {/* giant watermark, clipped by the footer */}
        <div
          aria-hidden
          className="pointer-events-none relative mt-10 h-[clamp(64px,13vw,150px)] select-none"
        >
          <span className="font-display absolute -bottom-[0.24em] left-1/2 -translate-x-1/2 text-[clamp(5rem,20vw,17rem)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap text-white/[0.05]">
            Ivren
          </span>
        </div>
      </div>
    </footer>
  );
}
