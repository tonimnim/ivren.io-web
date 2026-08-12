import type { Metadata } from "next";

export const metadata: Metadata = { title: "Importing your estate" };

export default function ImportingPage() {
  return (
    <div>
      <h1>Importing your estate</h1>
      <p>
        Ivren reads the configuration exports your interface engine already
        produces. Nothing is uploaded — files are read in one process, on
        your machine.
      </p>

      <h2 id="supported-engines">Supported engines</h2>
      <p>
        Ivren imports configuration exports from supported interface
        engines. Rather than list them here, where the page would drift out
        of date, the console names every engine and export format the build
        you are running can read — open it and the import screen tells you
        exactly what it accepts.
      </p>
      <p>
        If your engine is not listed in your build, send us a sample export
        and we will tell you plainly whether Ivren can read it.
      </p>

      <h2 id="exporting">Exporting from your engine</h2>
      <p>
        Most interface engines expose an export function in their
        administration console that writes each interface or channel to its
        own configuration file. The usual shape of the task:
      </p>
      <ol>
        <li>Open the channel or interface list in your engine&rsquo;s console.</li>
        <li>
          Select the interfaces to export — typically select-all for the
          whole estate.
        </li>
        <li>
          Export. This produces a folder of configuration files, one per
          interface.
        </li>
        <li>Drop the whole folder onto Ivren.</li>
      </ol>
      <p>
        The console shows the exact steps for each supported engine,
        including where that engine writes its export files.
      </p>

      <h2 id="partial-failures">One bad file never fails the import</h2>
      <p>
        An unreadable, malformed, or truncated file is reported as a located
        finding — it never fails the rest of the import. Every other
        interface still imports, and the finding tells you exactly what and
        where.
      </p>

      <h2 id="what-happens">What happens on import</h2>
      <p>
        Ivren builds a live map of the estate: what talks to what, which
        fields carry patient identifiers, and what breaks downstream if a
        field changes. Credentials found inside exports are stripped at
        import and reported so they can be rotated — they never render in
        the UI.
      </p>
    </div>
  );
}
