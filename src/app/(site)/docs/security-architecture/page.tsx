import type { Metadata } from "next";

export const metadata: Metadata = { title: "Security architecture" };

export default function SecurityArchitecturePage() {
  return (
    <div>
      <h1>Security architecture</h1>
      <p>
        This page covers the same material as{" "}
        <a href="/security">the Security page</a>, at reviewer depth.
      </p>

      <h2 id="data-boundary">The data boundary</h2>
      <p>
        Ivren reads interface configuration and message structure on the
        customer&rsquo;s machine. There is no telemetry. Air-gapped machines never contact us; Ivren connects to ivren.io only when you activate online or use an AI feature, and it never sends messages or patient data. Passwords found inside imported exports are stripped at
        import and reported for rotation — they never render in the UI.
        The message archive, when the engine runs interfaces, is the only
        component holding raw message content; it lives on customer-managed
        storage with customer-held encryption keys.
      </p>

      <h2 id="ai-boundary">The AI boundary</h2>
      <p>
        AI features are optional, off by default, and require the customer
        to supply their own model API key. What may cross to a model: run
        metadata, counts, field paths, tokenised values, verdicts. What may
        never cross: raw or partial message content, untokenised values,
        free-text clinical fields — enforced by two independent gates that
        both fail closed.
      </p>

      <h2 id="signing">Signing</h2>
      <p>
        Licenses, gate decisions, and releases are signed with
        domain-separated keys: a signature issued for one purpose can never
        verify as another.
      </p>

      <h2 id="audit">Audit</h2>
      <p>
        Hash-chained, append-only audit logging with tamper detection,
        behind a closed role set — owner, admin, engineer, operator,
        revenue and auditor — enforced server-side. Every sensitive view
        and change is recorded. The engine&apos;s local console compiles
        five of those six: revenue is a control-plane role, and minting it
        over the engine vocabulary would hand revenue-cycle staff
        operational sight of the interfaces in order to give them a role
        name they already hold upstream. A session carrying only that
        group resolves to no role and is refused.
      </p>
    </div>
  );
}
