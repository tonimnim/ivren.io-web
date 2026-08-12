import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quick start" };

export default function QuickStartPage() {
  return (
    <div>
      <h1>Quick start</h1>
      <p>Three steps, no account required.</p>

      <h2 id="download">Download</h2>
      <p>
        Get <code>ivren-setup.exe</code> (Windows 10/11, x64, ~17 MB) for a
        guided install, or the portable <code>ivren.exe</code> (~15 MB, no
        install) from the{" "}
        <a href="/download">Download page</a>.
      </p>

      <h2 id="run">Run it</h2>
      <p>
        Run the guided installer, or double-click the portable executable.
        No admin rights are required for portable use.
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
