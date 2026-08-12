import { company } from "@/lib/company";

export const dynamic = "force-static";

/**
 * llms.txt — a concise, plain-text brief for answer engines and coding
 * agents. Written to be quotable: short factual lines, no marketing.
 */
const BODY = `# Ivren

> Ivren is a healthcare interface assurance and integration platform. It maps, verifies, runs, and monitors the data interfaces inside a hospital — the feeds carrying orders, admissions, results, and charges between clinical systems. It reads the configuration your existing interface engine already produces, proves changes are safe before they reach production, and runs entirely on the hospital's own machine.

## What it is

Ivren is a single executable (~15 MB) for Windows 10/11 x64. It requires no account, no cloud service, and no internet connection. It serves a local web console bound to 127.0.0.1 only. Version ${company.version}.

Ivren is not an EHR, not a clinical application, and not a medical device. Clinicians do not use it. Its users are hospital IT and integration teams, and revenue-cycle, compliance, and health-information-management staff.

## Wire formats supported

HL7 v2 (multiple versions, with an embedded data dictionary), FHIR R4, DICOM metadata and worklists, X12 claims envelopes, NCPDP pharmacy claims, and HL7 batch files (FHS/BHS). Transports: MLLP, HTTP, SFTP, and file. Database-to-database connector modelling is included.

## Core capabilities

- Estate mapping: imports configuration exports from supported interface engines and renders every interface — source, destinations, protocols, and which fields carry patient identifiers.
- Impact analysis: shows what breaks downstream if a field changes, before the change is made.
- Regression testing: \`ivren run\` compares two output sets and returns PASS or FAIL.
- Deployment gate: \`ivren gate\` decides whether a change may deploy, using CI exit codes — 0 PASS, 1 FAIL, 2 could-not-complete, 3 INDETERMINATE, 4 REFUSED. Missing evidence can never become PASS.
- Replay and probe: \`ivren replay\` replays a recorded corpus against approved non-production targets only; production-class targets are structurally refused. \`ivren probe\` shows what a connector would do without doing it.
- Shadow-run migration: runs a proposed route beside the existing engine on the same traffic, delivers nothing, and produces a signed divergence report locating any difference to the exact field.
- Local engine: durable queues with fsync-before-ack, retry lanes with backoff, dead-letter handling, and alert-on-silence when an expected feed goes quiet.
- Charge reconciliation: counts charge messages at both ends and reports what did not arrive, by interface and by day.

## Privacy and security posture

Nothing is uploaded. There is no telemetry, no account, and no phone-home. Files are read in one process on the customer's machine. Passwords found inside imported engine exports are stripped at import and reported for rotation. AI features are optional, off by default, and require the customer's own model API key; field paths, counts and verdicts may cross to a model, but raw message content, untokenised values and free-text clinical fields never may — enforced by two independent gates that fail closed. Ivren is designed for HIPAA-regulated environments; it makes no certification claims.

## Licensing

Trial is free with no account and no time pressure. Professional and Enterprise are licensed per seat or per site, billed monthly or yearly. Licences are signed keys verified locally; activation works fully air-gapped. An expired licence never blocks activation, help, or uninstall.

## Contact

Email: ${company.email}
Phone: ${company.phone}
Location: ${company.location}

## Key pages

- https://ivren.io/ — overview
- https://ivren.io/product — full capability list
- https://ivren.io/download — installation and system requirements
- https://ivren.io/pricing — tiers and licensing
- https://ivren.io/security — data boundary, AI boundary, audit
- https://ivren.io/docs — documentation index
- https://ivren.io/docs/cli-reference — every CLI verb and exit code
- https://ivren.io/docs/importing-your-estate — how to import engine exports
- https://ivren.io/docs/faq — common questions
- https://ivren.io/glossary — healthcare interoperability terms
`;

export function GET() {
  return new Response(BODY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
