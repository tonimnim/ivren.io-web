import type { Metadata } from "next";

export const metadata: Metadata = { title: "Licensing & activation" };

export default function LicensingActivationPage() {
  return (
    <div>
      <h1>Licensing & activation</h1>
      <p>
        Free to map and analyse the whole estate, with no licence at all.
        Paid plans run the engine and are priced per site, per year — see{" "}
        <a href="/pricing">Pricing</a>, and{" "}
        <a href="/licensing">How licensing & billing works</a> for the full
        purchase path.
      </p>

      <h2 id="online">The licence</h2>
      <p>A licence is a signed key (Ed25519), verified locally by the product. Activation also works fully offline, in both directions: nothing about it requires the machine to be online.</p>

      <h2 id="air-gapped">Air-gapped activation</h2>
      <ol>
        <li>
          The product generates an activation request — armored text, safe
          to print or carry on USB.
        </li>
        <li>
          Bring it to <a href="/activate">ivren.io/activate</a> from any
          connected machine, or send it to us.
        </li>
        <li>Load the signed licence back into Ivren.</li>
      </ol>
      <p>
        Line-wrapping by email clients cannot break the request — it&rsquo;s
        deliberately robust to that.
      </p>

      <h2 id="connections">When Ivren connects</h2>
      <p>
        Air-gapped machines never contact us. Ivren connects to ivren.io
        only when you activate online or use an AI feature, and it never
        sends messages or patient data.
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
