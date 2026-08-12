import type { Metadata } from "next";
import { Section } from "@/components/container";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Ivren draws its data boundary, its AI boundary, and its operational security posture — written for a hospital security reviewer.",
};

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-hairline py-12 first:border-t-0 first:pt-0">
      <h2 className="text-2xl font-medium tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-ink-secondary">
        {children}
      </div>
    </div>
  );
}

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Claims a reviewer can verify, not adjectives."
        intro="Written for the person who has to sign off on this before it touches your network."
      />

      <Section>
        <Block title="The data boundary">
          <p>
            Ivren reads interface configuration and message structure on the
            customer&rsquo;s machine. Nothing is uploaded; there is no
            telemetry, no account, no phone-home. The console states it
            plainly: &ldquo;Nothing is uploaded. The files are read in this
            process, on this machine.&rdquo;
          </p>
          <p>
            Passwords found inside imported engine exports are stripped at
            import and reported for rotation — they never render in the UI.
          </p>
          <p>
            The message archive, when the engine runs interfaces, is the
            only component holding raw message content. It lives on the
            customer&rsquo;s disk. Customer-managed storage with
            customer-held encryption keys (S3-compatible, envelope
            encryption) is built for it.
          </p>
        </Block>

        <Block title="The AI boundary">
          <p>
            AI features are optional, off by default, and require the
            customer to supply their own model API key.
          </p>
          <p>
            What may cross to a model: run metadata, counts, field paths
            (like <code className="font-mono text-sm">PID-11</code>),
            tokenised values, verdicts. What may never cross: raw or partial
            message content, untokenised values, free-text clinical fields.
          </p>
          <p>
            Enforced by two independent gates — one before bytes leave the
            machine, one on the service side — both fail closed. Refusals
            never echo the refused value. The test suite includes canary
            tests that plant marker values and assert they can never reach
            an output.
          </p>
        </Block>

        <Block title="Operational security posture">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Deployment gate: missing evidence can never become PASS;
              production-class replay targets are structurally refused.
            </li>
            <li>
              Signed artifacts: licenses, gate decisions, and releases are
              signed with domain-separated keys — a signature for one
              purpose can never verify as another.
            </li>
            <li>
              Hash-chained, append-only audit logging with tamper
              detection, behind server-side role-based access control —
              every sensitive view and change recorded.
            </li>
          </ul>
          <p className="border-t border-hairline-soft pt-4 font-mono text-sm text-ink">
            &ldquo;We do not claim what we cannot prove.&rdquo;
          </p>
        </Block>

        <Block title="What we don't claim">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Ivren is not a medical device; it makes no clinical
              decisions.
            </li>
            <li>
              We say Ivren is designed for HIPAA-regulated environments,
              with the specifics above that let a reviewer verify the
              design — never &ldquo;HIPAA certified,&rdquo; because no such
              certification exists.
            </li>
          </ul>
        </Block>
      </Section>
    </>
  );
}
