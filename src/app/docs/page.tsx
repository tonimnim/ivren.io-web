import type { Metadata } from "next";
import Link from "next/link";
import { docsNav } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Docs",
  description: "Ivren documentation: quick start, importing your estate, the console, CLI reference, licensing, security architecture, and FAQ.",
};

const BLURBS: Record<string, string> = {
  "/docs/quick-start": "Download, run, and open the console in three steps.",
  "/docs/importing-your-estate":
    "How to export from your interface engine and load the estate.",
  "/docs/console": "A tour of the screens, and what a finding means.",
  "/docs/cli-reference": "Every verb, its purpose, and the exit-code vocabulary.",
  "/docs/licensing-activation": "Tiers, online activation, and the full air-gapped flow.",
  "/docs/security-architecture": "The data boundary and AI boundary, in reviewer depth.",
  "/docs/faq": "Short answers to the questions we get most.",
};

export default function DocsIndexPage() {
  return (
    <div>
      <h1>Documentation</h1>
      <p>
        Everything here reflects the shipped build — the same one you
        download.
      </p>
      <ul className="!mt-8 !list-none !space-y-4 !pl-0">
        {docsNav.map((item) => (
          <li
            key={item.href}
            className="border-t border-hairline-soft pt-4 first:border-t-0 first:pt-0"
          >
            <Link
              href={item.href}
              className="text-base font-medium text-ink hover:text-accent"
            >
              {item.title}
            </Link>
            <p className="mt-1 text-sm text-ink-secondary">
              {BLURBS[item.href]}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
