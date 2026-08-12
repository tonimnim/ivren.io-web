export type Feature = {
  name: string;
  description: string;
};

export type FeatureGroup = {
  key: string;
  title: string;
  summary: string;
  items: Feature[];
};

export const featureGroups: FeatureGroup[] = [
  {
    key: "map",
    title: "Map",
    summary:
      "Turn the configuration your interface engine already holds into a live map of the estate.",
    items: [
      {
        name: "Estate mapping",
        description:
          "Drop the configuration exports from a supported interface engine onto Ivren. It reads them and shows every interface: source, destinations, protocols, and which fields carry patient identifiers.",
      },
      {
        name: "Impact analysis",
        description:
          "See what breaks downstream if a field changes, before you change it. Credentials found inside exports are stripped at import and reported so they can be rotated. A malformed or truncated export is reported as a located finding, never silently skipped.",
      },
      {
        name: "The console",
        description:
          "A local web console served by the binary itself, bound to 127.0.0.1 only: overview, interfaces with a detail panel, live status, and a health summary. One click loads bundled synthetic sample data so you can see the whole product without supplying a file. Keyboard-accessible, with no external network requests.",
      },
    ],
  },
  {
    key: "prove",
    title: "Prove",
    summary:
      "Interfaces as provable artifacts: versioned, tested against recorded traffic, and gated on evidence.",
    items: [
      {
        name: "Regression testing & the deployment gate",
        description:
          "ivren run compares two output sets and decides PASS or FAIL. ivren gate decides whether a change may deploy, with an exit-code vocabulary built for CI: 0 PASS, 1 FAIL, 2 could-not-complete, 3 INDETERMINATE, 4 REFUSED.",
      },
      {
        name: "Replay & probe",
        description:
          "ivren replay replays a recorded corpus against approved, pinned, non-production targets only — a production-class target is structurally refused. ivren probe shows exactly what a connector would do without doing it.",
      },
      {
        name: "Message tooling",
        description:
          "ivren parse prints an HL7 message's field tree with spec names, backed by an embedded HL7 dictionary spanning multiple versions.",
      },
      {
        name: "Wire-format depth",
        description:
          "Parsers and conformance machinery for HL7 v2 (multiple versions), FHIR R4, DICOM metadata and worklists (pixel data is structurally never stored), X12 claims envelopes, NCPDP pharmacy claims, and HL7 batch files (FHS/BHS), plus database-to-database connector modeling and SFTP/MLLP/HTTP transports.",
      },
    ],
  },
  {
    key: "run",
    title: "Run",
    summary:
      "Ivren runs interfaces itself — durable, crash-safe, and honest about failure.",
    items: [
      {
        name: "Local engine",
        description:
          "Durable queues (fsync-before-ack, crash-safe), MLLP/HTTP/file listeners, per-destination retry lanes with backoff, dead-letter handling, and alert-on-silence — an alert when an expected feed goes quiet.",
      },
      {
        name: "Transforms",
        description:
          "Declarative field mapping with static “silent drop” analysis — finding fields a mapping loses before it runs.",
      },
      {
        name: "Message search & resend",
        description:
          "Search the archive by time, interface, and type, and resend from the console — with a permission model that separates metadata, masked view, full view, and export.",
      },
      {
        name: "Offline licensing",
        description:
          "License keys with air-gapped activation: an activation request can be carried out on paper or USB and the signed license pasted back. An expired license never locks you out of activate, help, or uninstall.",
      },
    ],
  },
  {
    key: "migrate",
    title: "Migrate",
    summary:
      "Prove a migration is safe before you commit to it — one interface at a time.",
    items: [
      {
        name: "Shadow-run migration",
        description:
          "Run a proposed Ivren route beside your existing engine on the same traffic, deliver nothing, and produce a signed divergence report: what Ivren would have sent versus what the incumbent actually sent, day by day, with any difference located to the exact field. Cut over one interface at a time when the report reads zero.",
      },
      {
        name: "Role-based access",
        description:
          "A closed role set (admin, engineer, operator, revenue, auditor) with server-side enforcement and a hash-chained audit trail; every sensitive view and change recorded.",
      },
    ],
  },
  {
    key: "money",
    title: "Money",
    summary:
      "Give revenue-cycle and compliance staff their own reasons to care about the interface layer.",
    items: [
      {
        name: "Charge reconciliation",
        description:
          "Hospital charges travel as interface messages. When a feed drops them, that's unbilled revenue nobody connects to the IT queue. Ivren counts both ends and reports exactly what didn't arrive, by interface and by day.",
      },
      {
        name: "Claims pre-flight",
        description:
          "X12 and NCPDP claims validation before submission — catch a rejectable claim before the clearinghouse does.",
      },
    ],
  },
];
