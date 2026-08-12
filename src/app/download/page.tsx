import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Placeholder } from "@/components/placeholder";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download Ivren for Windows: a guided installer or a ~15 MB portable executable. No account, no internet required.",
};

const STEPS = [
  {
    title: "Download",
    body: (
      <>
        <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em]">
          ivren-setup.exe
        </code>{" "}
        (Windows 10/11, x64, ~17 MB) — or the portable{" "}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em]">
          ivren.exe
        </code>{" "}
        (~15 MB, no install).
      </>
    ),
  },
  {
    title: "Run it",
    body: "A guided installer; or double-click the portable exe.",
  },
  {
    title: "Open Ivren",
    body: "It opens in its own window. Click Explore with sample data — the full product on bundled synthetic interfaces, no file needed. Or drop your own configuration exports; the console explains exactly how to export them from each supported engine.",
  },
];

const FACTS = [
  "No account. No license needed to evaluate (Trial tier).",
  "No internet connection required — the product is fully functional offline; the console is served locally at 127.0.0.1 and never binds a public interface.",
  "The optional AI features are the only thing that ever needs a network, are off by default, and require explicit configuration. See Security.",
];

export default function DownloadPage() {
  return (
    <>
      <PageHero
        eyebrow="Download"
        title="Download, run, and open Ivren."
        intro="No account. No cloud requirement. Nothing is uploaded."
      />

      <Section>
        <ol className="grid gap-10 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <p className="font-mono text-sm text-ink-label">0{i + 1}</p>
              <h2 className="mt-3 text-xl font-medium text-ink">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <h2 className="text-2xl font-medium tracking-tight text-ink">
          Releases
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-ink-label">
                <th className="py-2.5 pr-4 font-medium">Version</th>
                <th className="py-2.5 pr-4 font-medium">File</th>
                <th className="py-2.5 pr-4 font-medium">Size</th>
                <th className="py-2.5 font-medium">SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft">
              <tr>
                <td className="py-3 pr-4 font-mono text-ink">
                  <Placeholder>VERSION</Placeholder>
                </td>
                <td className="py-3 pr-4 font-mono text-ink-secondary">
                  ivren-setup.exe
                </td>
                <td className="py-3 pr-4 text-ink-secondary">~17 MB</td>
                <td className="py-3 font-mono text-xs text-ink-secondary">
                  <Placeholder>SHA256_SETUP</Placeholder>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-ink">
                  <Placeholder>VERSION</Placeholder>
                </td>
                <td className="py-3 pr-4 font-mono text-ink-secondary">
                  ivren.exe (portable)
                </td>
                <td className="py-3 pr-4 text-ink-secondary">~15 MB</td>
                <td className="py-3 font-mono text-xs text-ink-secondary">
                  <Placeholder>SHA256_EXE</Placeholder>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-ink-label">
          Download link: <Placeholder>DOWNLOAD_URL</Placeholder> (GitHub
          Releases expected). Releases are signed with Ed25519 release
          manifests.
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-medium text-ink">Facts</h2>
            <ul className="mt-4 space-y-3">
              {FACTS.map((f) => (
                <li
                  key={f}
                  className="border-t border-hairline-soft pt-3 text-sm leading-relaxed text-ink-secondary"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-medium text-ink">
              System requirements
            </h2>
            <ul className="mt-4 space-y-3">
              {[
                "Windows 10/11, x64",
                "~100 MB disk",
                "No admin rights required for portable use",
              ].map((f) => (
                <li
                  key={f}
                  className="border-t border-hairline-soft pt-3 text-sm leading-relaxed text-ink-secondary"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
