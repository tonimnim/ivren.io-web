import type { Metadata } from "next";
import { artifacts } from "@/lib/releases";

export const metadata: Metadata = { title: "Quick start" };

export default function QuickStartPage() {
  return (
    <div>
      <h1>Quick start</h1>
      <p>Three steps. Your licence key comes from your ivren.io organisation; the engine needs no connection to run.</p>

      <h2 id="download">Download</h2>
      <p>
        Get the desktop app for Windows 10/11 (x64) from the{" "}
        <a href="/download">Download page</a>:{" "}
        <code>{artifacts[0].file}</code> for a single machine, or the MSI to
        deploy across a fleet.
      </p>

      <h2 id="run">Install it</h2>
      <p>
        The installer sets Ivren up for the signed-in user and needs no
        administrator rights. IT can push the MSI through its usual
        deployment tooling instead.
      </p>

      <h2 id="open">Open Ivren</h2>
      <p>
        Ivren opens in its own window, serving a local console at{" "}
        <code>127.0.0.1</code>. From there:
      </p>
      <ul>
        <li>
          Click <strong>Explore with sample data</strong> to load the
          bundled synthetic sample interfaces — the full product, no file of
          your own required.
        </li>
        <li>
          Or drop your own configuration exports. See{" "}
          <a href="/docs/importing-your-estate">Importing your estate</a>{" "}
          for the export steps.
        </li>
      </ul>

      <h2 id="next">Next</h2>
      <p>
        Read <a href="/docs/console">The console</a> for a tour of the
        screens, or jump straight to the{" "}
        <a href="/docs/cli-reference">CLI reference</a>.
      </p>
    </div>
  );
}
