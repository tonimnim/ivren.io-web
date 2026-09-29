import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/button";
import { company } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";
import { artifactHref, artifacts, installerRequestHref } from "@/lib/releases";

export const metadata: Metadata = pageMetadata({
  title: "Download",
  path: "/download",
  description:
    "Download Ivren for Windows 10 or 11 — the desktop app, console and engine in one, as a per-user installer or an MSI for managed deployment. No cloud requirement; it runs fully offline.",
});

const code = (s: string) => (
  <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em]">
    {s}
  </code>
);

const STEPS = [
  {
    title: "Download",
    body: (
      <>
        {code(artifacts[0].file)} for a single machine, or the{" "}
        {code(artifacts[1].file)} to deploy across a fleet.
      </>
    ),
  },
  {
    title: "Install",
    body: "The installer sets Ivren up for the signed-in user and needs no administrator rights. IT can push the MSI through its usual deployment tooling instead.",
  },
  {
    title: "Map the estate",
    body: "The free tier maps and analyses your whole estate with no account and no network. To run the engine, activate the machine with your organisation's licence key — offline machines use a request file at ivren.io/activate.",
  },
];

const FACTS = [
  "Your licence key comes from your ivren.io organisation. The engine itself never calls us to run.",
  "No internet connection required — the product is fully functional offline; the console is served locally at 127.0.0.1 and never binds a public interface.",
  "The optional AI features are the only thing that ever needs a network, are off by default, and require explicit configuration. See Security.",
];

const REQUIREMENTS = [
  "Windows 10 or 11, x64",
  "The Microsoft Edge WebView2 runtime. It is part of Windows 11; on Windows 10 the installer adds it if it is missing, which needs a connection once — deploy WebView2 first on an air-gapped Windows 10 machine",
  "No administrator rights for the per-user installer",
];

export default function DownloadPage() {
  const primary = artifactHref(artifacts[0].file);

  return (
    <>
      <PageHero
        eyebrow="Download"
        title="Download, install, and open Ivren."
        intro="The desktop app is the console and the engine in one. No cloud requirement. Nothing is uploaded. The engine never phones home."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            href={primary ?? installerRequestHref}
            external={!primary}
            className="w-full sm:w-auto"
          >
            {primary
              ? `Download for Windows — v${company.version}`
              : `Request the v${company.version} installer`}
          </Button>
          <Button
            href="/docs/quick-start"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Read the quick start
          </Button>
        </div>
      </PageHero>

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
                <th className="py-2.5 pr-4 font-medium">For</th>
                <th className="py-2.5 font-medium">SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft">
              {artifacts.map((a) => {
                const href = artifactHref(a.file);
                return (
                  <tr key={a.file}>
                    <td className="py-3 pr-4 font-mono text-ink">
                      {company.version}
                    </td>
                    <td className="py-3 pr-4 font-mono text-ink-secondary">
                      {href ? (
                        <a
                          href={href}
                          className="text-accent hover:text-accent-strong"
                        >
                          {a.file}
                        </a>
                      ) : (
                        a.file
                      )}
                    </td>
                    <td className="py-3 pr-4 text-ink-secondary">
                      {a.detail}
                    </td>
                    <td className="py-3 text-xs text-ink-label">
                      published with the release
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-ink-label">
          Every release ships an SHA-256 checksum alongside the artifact,
          and releases are signed with Ed25519 release manifests. Verify
          before you install.
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
              {REQUIREMENTS.map((f) => (
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
