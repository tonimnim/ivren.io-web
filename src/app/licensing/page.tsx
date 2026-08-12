import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Placeholder } from "@/components/placeholder";

export const metadata: Metadata = {
  title: "How licensing & billing works",
  description:
    "How Ivren licensing, activation, and purchasing work today — for procurement and security reviewers.",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-hairline py-12 first:border-t-0 first:pt-0">
      <h2 className="text-2xl font-medium tracking-tight text-ink">{title}</h2>
      <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-ink-secondary">
        {children}
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: "Can we get a W-9 / supplier forms?",
    a: (
      <>
        Yes — email <Placeholder>CONTACT_EMAIL</Placeholder>.
      </>
    ),
  },
  {
    q: "Do licenses phone home?",
    a: (
      <>
        A weekly check when online, with a 14-day grace period. Air-gapped
        operation is fully supported — see{" "}
        <a href="/security" className="text-accent hover:text-accent-strong">
          Security
        </a>
        .
      </>
    ),
  },
  {
    q: "Can we true-up seats mid-term?",
    a: "Contact us; seat changes are prorated.",
  },
  {
    q: "What happens to our data if we don't renew?",
    a: "Nothing. Everything lives on your machines. The product's licensed verbs stop; your data never does.",
  },
];

export default function LicensingPage() {
  return (
    <>
      <PageHero
        eyebrow="How licensing & billing works"
        title="Everything here is the real, built system."
        intro="Where the purchase pipeline isn’t live yet, this page says “contact us” rather than pretending."
      />

      <Section>
        <Block title="The model">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Three tiers — Trial, Professional, Enterprise — billed
              monthly or yearly. A license is a signed key (Ed25519),
              verified locally by the product; nothing about licensing
              requires it to be online.
            </li>
            <li>
              Seat licenses bind to a machine via a privacy-preserving
              fingerprint — hashed hardware signals. The license server
              never learns hostnames or MAC addresses. A swapped network
              card does not cost a seat (threshold matching). Site
              licenses exist with no machine binding, for fleet installs.
            </li>
            <li>
              Online activation: enter the key, done. Air-gapped
              activation: generate an activation request (armored text,
              safe to print or carry on USB), paste it at a connected
              machine or send it to us, paste the signed license back.
              Line-wrapping by email clients cannot break it.
            </li>
            <li>
              An activated install re-checks weekly when it can. If the
              license server is unreachable, the product keeps working for
              14 days and says so quietly; a never-connected air-gapped
              install is simply licensed, full stop. An expired or
              unlicensed install never locks the user out of{" "}
              <code>activate</code>, <code>help</code>, or uninstall.
            </li>
          </ul>
          <p className="border-t border-hairline-soft pt-4 font-mono text-sm text-ink">
            &ldquo;Locking a hospital out of the command that fixes the lock
            is the one failure this gate must not have.&rdquo;
          </p>
        </Block>

        <Block title="The purchase path — hospitals buy by PO">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              Request a quote — organization, contact, tier, seat count,
              billing period — to <Placeholder>QUOTE_ENDPOINT</Placeholder>{" "}
              or <Placeholder>CONTACT_EMAIL</Placeholder>. We accept
              purchase orders. Quotes within one business day.
            </li>
            <li>
              Invoice (<Placeholder>PAYMENT_TERMS</Placeholder>) → on
              payment, the license key is issued and emailed within{" "}
              <Placeholder>FULFILLMENT_SLA</Placeholder>.
            </li>
            <li>
              Renewals: keys are dated; renewal issues a fresh key, with a
              reminder email 30 days out.
            </li>
          </ol>
        </Block>

        <Block title="Support, not a portal maze">
          <p>
            License questions — seats, invoices, key rotation — go to{" "}
            <Placeholder>CONTACT_EMAIL</Placeholder>, and a human fixes it
            within a business day.
          </p>
        </Block>

        <Block title="FAQ for procurement">
          <div className="space-y-6">
            {FAQS.map((f) => (
              <div key={f.q}>
                <p className="font-medium text-ink">{f.q}</p>
                <p className="mt-1.5">{f.a}</p>
              </div>
            ))}
          </div>
        </Block>
      </Section>
    </>
  );
}
