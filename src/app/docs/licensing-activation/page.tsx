import type { Metadata } from "next";

export const metadata: Metadata = { title: "Licensing & activation" };

export default function LicensingActivationPage() {
  return (
    <div>
      <h1>Licensing & activation</h1>
      <p>
        Three tiers — Trial, Professional, Enterprise — billed monthly or
        yearly. See <a href="/licensing">How licensing & billing works</a>{" "}
        for the full purchase path.
      </p>

      <h2 id="online">Online activation</h2>
      <p>Enter the license key. Done. A license is a signed key (Ed25519), verified locally by the product.</p>

      <h2 id="air-gapped">Air-gapped activation</h2>
      <ol>
        <li>
          The product generates an activation request — armored text, safe
          to print or carry on USB.
        </li>
        <li>
          Paste it at a connected machine, or send it to us.
        </li>
        <li>Paste the signed license back into Ivren.</li>
      </ol>
      <p>
        Line-wrapping by email clients cannot break the request — it&rsquo;s
        deliberately robust to that.
      </p>

      <h2 id="grace">Grace period</h2>
      <p>
        An activated install re-checks weekly when it can. If the license
        server is unreachable — a proxy change, firewall work — the
        product keeps working for 14 days and says so quietly. A
        never-connected air-gapped install is simply licensed, full stop,
        no grace nagging.
      </p>
      <p>
        An expired or unlicensed install never locks the user out of{" "}
        <code>activate</code>, <code>help</code>, <code>version</code>, or
        uninstall.
      </p>

      <h2 id="seats">Seats and machine binding</h2>
      <p>
        Seat licenses bind to a machine via a privacy-preserving fingerprint
        — hashed hardware signals. The license server never learns
        hostnames or MAC addresses. A swapped network card does not cost a
        seat (threshold matching). Site licenses exist with no machine
        binding, for fleet installs.
      </p>
    </div>
  );
}
