import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { OfflineActivation } from "@/components/activate/offline-activation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Activate an offline machine",
  path: "/activate",
  description:
    "Activate Ivren on a machine with no internet connection: paste the activation request it saved, and download its licence. Nothing is kept in the browser or on ivren.io.",
});

const STEPS = [
  {
    title: "The machine writes a request",
    body: "On the offline machine, Ivren saves an activation request — a short block of text between two ----- lines.",
  },
  {
    title: "Carry it here",
    body: "From any computer with a connection — on a USB stick, by email, however your site allows. You don't need to sign in.",
  },
  {
    title: "Carry the licence back",
    body: "Download the licence, take it back, and load it. The machine itself never has to reach the internet.",
  },
];

/**
 * Where the desktop app sends an air-gapped hospital. Public, because the
 * request carries the licence key and the key is the credential — and because
 * the computer somebody carries a USB stick to is rarely one they would sign in
 * on.
 */
export default function ActivatePage() {
  return (
    <>
      <PageHero
        eyebrow="Activation"
        title="Activate a machine that never touches the internet."
        intro="This is activation without a connection. The machine writes a request, you bring it here from any connected computer, and you take a licence back."
      />

      <Section hairline={false} className="!pt-10 md:!pt-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-16">
          <div className="min-w-0">
            <OfflineActivation />
          </div>

          <aside className="min-w-0 space-y-10">
            <div>
              <h2 className="text-base font-medium text-ink">How it works</h2>
              <ol className="mt-4 space-y-4">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="mt-0.5 font-mono text-[11px] text-ink-label">
                      0{i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-secondary">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t border-hairline-soft pt-8">
              <h2 className="text-base font-medium text-ink">
                What is in the request
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                The licence key your organisation was issued, a hash of a few
                ordinary machine signals, and the time. No message content, no
                configuration, no hostname in the clear. It is readable on
                purpose: your security team can open it before it leaves the
                building.
              </p>
            </div>

            <div className="border-t border-hairline-soft pt-8">
              <h2 className="text-base font-medium text-ink">
                What this page keeps
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Nothing. The request goes to the licence server and is cleared
                from this page once the licence is issued; it is not saved in
                this browser or on ivren.io. The licence server records the
                activation, because that is what a seat is.
              </p>
            </div>

            <div className="border-t border-hairline-soft pt-8">
              <h2 className="text-base font-medium text-ink">
                No licence key yet?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Owners and admins mint it on ivren.io, under{" "}
                <Link
                  href="/dashboard/devices"
                  className="text-accent hover:text-accent-strong"
                >
                  Devices
                </Link>
                . The free tier needs no key at all.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
