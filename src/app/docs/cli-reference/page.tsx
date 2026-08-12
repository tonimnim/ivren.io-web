import type { Metadata } from "next";

export const metadata: Metadata = { title: "CLI reference" };

const VERBS = [
  { verb: "run", purpose: "Compare two output sets; decide PASS or FAIL.", network: "Never" },
  { verb: "gate", purpose: "Decide whether a change may deploy.", network: "Never" },
  { verb: "corpus", purpose: "Manage recorded traffic corpora.", network: "Never" },
  { verb: "import", purpose: "Import engine configuration exports.", network: "Never" },
  { verb: "parse", purpose: "Print an HL7 message's field tree with spec names.", network: "Never" },
  { verb: "probe", purpose: "Show exactly what a connector would do, without doing it.", network: "Never" },
  { verb: "versions", purpose: "Print version information.", network: "Never" },
  { verb: "replay", purpose: "Replay a recorded corpus against approved, pinned, non-production targets.", network: "Only to approved non-production targets" },
  { verb: "engine", purpose: "Run the local engine: queues, listeners, retry lanes.", network: "Yes — the interfaces it's configured to run" },
];

const EXIT_CODES = [
  { code: "0", meaning: "PASS" },
  { code: "1", meaning: "FAIL" },
  { code: "2", meaning: "Could not complete" },
  { code: "3", meaning: "INDETERMINATE" },
  { code: "4", meaning: "REFUSED" },
];

export default function CliReferencePage() {
  return (
    <div>
      <h1>CLI reference</h1>
      <p>
        Every verb below is real and shipped. Most never touch the network
        — only <code>replay</code> and <code>engine</code> do, and{" "}
        <code>replay</code> refuses production-class targets structurally.
      </p>

      <h2 id="verbs">Verbs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[560px]">
          <thead>
            <tr>
              <th>Verb</th>
              <th>Purpose</th>
              <th>Network</th>
            </tr>
          </thead>
          <tbody>
            {VERBS.map((v) => (
              <tr key={v.verb}>
                <td>
                  <code>{v.verb}</code>
                </td>
                <td>{v.purpose}</td>
                <td>{v.network}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="exit-codes">Exit-code vocabulary</h2>
      <p>
        <code>ivren gate</code> uses a fixed exit-code vocabulary built for
        CI pipelines. Missing evidence can never become PASS.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-[320px]">
          <thead>
            <tr>
              <th>Code</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {EXIT_CODES.map((e) => (
              <tr key={e.code}>
                <td>
                  <code>{e.code}</code>
                </td>
                <td>{e.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
