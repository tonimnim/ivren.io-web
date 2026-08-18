import type { Metadata } from "next";

export const metadata: Metadata = { title: "The console" };

export default function ConsolePage() {
  return (
    <div>
      <h1>The console</h1>
      <p>
        Ivren serves a local web console from the binary itself, bound to{" "}
        <code>127.0.0.1</code> only. It never binds a public interface and
        makes no external network requests.
      </p>

      <h2 id="screens">Screens</h2>
      <ul>
        <li>
          <strong>Overview</strong> — a health summary of the whole estate.
        </li>
        <li>
          <strong>Interfaces</strong> — every mapped interface, with a
          detail panel for source, destinations, protocol, and impact.
        </li>
        <li>
          <strong>Live status</strong> — current state of anything Ivren is
          running.
        </li>
      </ul>

      <h2 id="findings">Findings, not errors</h2>
      <p>
        When Ivren can&rsquo;t fully process something — a malformed export,
        a truncated file — it surfaces a located finding rather than
        failing silently or aborting the whole import. A finding tells you
        exactly what and where; the rest of the import proceeds.
      </p>

      <h2 id="credentials">Credential stripping</h2>
      <p>
        Passwords found inside imported engine exports are stripped at
        import time and reported so they can be rotated. They never render
        in the console.
      </p>

      <h2 id="sample-data">Explore with sample data</h2>
      <p>
        A one-click option loads bundled synthetic sample interfaces, so the
        whole product can be seen without supplying a file of your own.
      </p>
    </div>
  );
}
