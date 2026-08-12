export type Term = {
  slug: string;
  term: string;
  short: string;
  body: string;
  group: string;
};

/**
 * Definitions are written answer-first: the first sentence stands alone
 * as a complete answer, because that is the fragment an answer engine
 * will lift.
 */
export const GLOSSARY: Term[] = [
  {
    slug: "hl7-v2",
    term: "HL7 v2",
    group: "Standards",
    short:
      "HL7 v2 is the pipe-delimited messaging standard that carries most clinical data between hospital systems.",
    body: "A message is a series of segments, one per line, each identified by a three-character code such as MSH, PID, or OBX. Segments contain fields separated by pipes, which in turn contain components separated by carets. Despite FHIR's growth, HL7 v2 still carries the overwhelming majority of real hospital interface traffic, and versions from 2.1 through 2.8 remain in production simultaneously.",
  },
  {
    slug: "fhir",
    term: "FHIR R4",
    group: "Standards",
    short:
      "FHIR is a REST-based interoperability standard that models clinical concepts as addressable resources such as Patient, Observation, and Encounter.",
    body: "R4 is the version most widely deployed in production and the one referenced by US regulation. A FHIR server advertises what it supports through a CapabilityStatement, which is the practical starting point when assessing whether an integration will work.",
  },
  {
    slug: "dicom",
    term: "DICOM",
    group: "Standards",
    short:
      "DICOM is the standard for medical imaging, covering both the image format and the network protocol used to move studies between modalities and archives.",
    body: "Each object carries extensive metadata alongside pixel data. A modality worklist (MWL) query lets an imaging device fetch its scheduled procedures, which is why worklist failures surface immediately as technologists typing patient details by hand.",
  },
  {
    slug: "x12",
    term: "X12",
    group: "Standards",
    short:
      "X12 is the EDI standard used for US healthcare administrative transactions, including claims, remittance, and eligibility.",
    body: "The transaction sets most often seen are 837 (claim submission), 835 (remittance advice), 270/271 (eligibility inquiry and response), and 276/277 (claim status). Envelopes are structured as ISA and GS headers wrapping one or more ST transaction sets.",
  },
  {
    slug: "ncpdp",
    term: "NCPDP",
    group: "Standards",
    short:
      "NCPDP is the standard governing retail pharmacy transactions, including prescription claims and eligibility.",
    body: "It is distinct from X12 and is used for the pharmacy benefit path rather than the medical benefit path, which is why pharmacy claims often travel a completely separate interface route from medical claims.",
  },
  {
    slug: "mllp",
    term: "MLLP",
    group: "Transport",
    short:
      "MLLP (Minimal Lower Layer Protocol) is the framing protocol used to send HL7 v2 messages over a raw TCP connection.",
    body: "It wraps each message in start and end block characters so the receiver knows where one message ends and the next begins. MLLP has no built-in authentication or encryption, which is why it is normally confined to internal networks or tunnelled.",
  },
  {
    slug: "interface-engine",
    term: "Interface engine",
    group: "Concepts",
    short:
      "An interface engine is the middleware that routes, transforms, and delivers messages between clinical systems.",
    body: "It typically owns connection handling, message transformation, queuing, and retry. Because it sits between every system, its configuration is the single most accurate description of how a hospital's data actually flows — and it is usually the least documented.",
  },
  {
    slug: "interface-estate",
    term: "Interface estate",
    group: "Concepts",
    short:
      "An interface estate is the complete set of live interfaces in an organisation, together with what each one connects and what depends on it.",
    body: "Estates commonly run from dozens to several hundred interfaces. The practical problem is not building one interface but knowing what the other two hundred will do when you change a field.",
  },
  {
    slug: "adt",
    term: "ADT",
    group: "Message types",
    short:
      "ADT (Admit, Discharge, Transfer) messages communicate patient demographics and movement, and are the backbone feed of most hospitals.",
    body: "Event types such as A01 (admit), A03 (discharge), A08 (update), and A40 (merge) drive downstream registration in nearly every connected system. When ADT breaks, everything else breaks shortly afterwards.",
  },
  {
    slug: "oru",
    term: "ORU",
    group: "Message types",
    short:
      "ORU messages carry observation results — most commonly laboratory results — from a producing system to the ordering or receiving system.",
    body: "Results are structured as OBR (order) segments each followed by one or more OBX (observation) segments. A dropped ORU is a result a clinician never sees.",
  },
  {
    slug: "dft",
    term: "DFT",
    group: "Message types",
    short:
      "DFT (Detail Financial Transaction) messages carry billable charges from clinical systems into billing.",
    body: "Because charges travel as interface messages, a silently failing DFT feed produces unbilled revenue that is rarely traced back to the integration layer. Counting DFT messages at both ends is the fastest way to detect it.",
  },
  {
    slug: "z-segment",
    term: "Z-segment",
    group: "Concepts",
    short:
      "A Z-segment is a custom, site-defined HL7 segment beginning with the letter Z, used for data the standard does not define.",
    body: "Z-segments are legitimate and extremely common, but they are undocumented by definition — no published specification describes their contents, so their meaning lives only in local knowledge and in the interface configuration itself.",
  },
  {
    slug: "alert-on-silence",
    term: "Alert on silence",
    group: "Operations",
    short:
      "Alert on silence is monitoring that fires when an expected feed stops producing traffic, rather than when it produces an error.",
    body: "Conventional monitoring watches for failures. The more dangerous failure mode is a feed that simply goes quiet: queues drain, dashboards stay green, and nothing alarms until someone downstream notices missing data hours or days later.",
  },
  {
    slug: "dead-letter-queue",
    term: "Dead-letter queue",
    group: "Operations",
    short:
      "A dead-letter queue holds messages that could not be delivered after exhausting their retry policy, so they can be inspected and resent rather than lost.",
    body: "Its depth is one of the few honest health metrics for an interface: a growing dead-letter queue means real clinical or financial data is not arriving.",
  },
  {
    slug: "shadow-run",
    term: "Shadow run",
    group: "Operations",
    short:
      "A shadow run executes a proposed interface alongside the existing one on the same live traffic while delivering nothing, so the two outputs can be compared before cutover.",
    body: "The output is a divergence report: what the new route would have sent versus what the current one actually sent, with any difference located to the exact field. It converts a migration from a scheduled risk into an observation with a number at the end.",
  },
  {
    slug: "deployment-gate",
    term: "Deployment gate",
    group: "Operations",
    short:
      "A deployment gate is an automated check that decides whether an interface change is allowed to reach production, based on recorded evidence.",
    body: "A useful gate distinguishes a genuine failure from an inability to evaluate. Returning INDETERMINATE when evidence is missing — rather than defaulting to pass — is what keeps an untested change from shipping.",
  },
  {
    slug: "conformance-profile",
    term: "Conformance profile",
    group: "Concepts",
    short:
      "A conformance profile constrains a broad standard into the specific subset an organisation actually requires.",
    body: "Standards like HL7 v2 and FHIR permit far more than any single deployment uses. A profile records which segments, fields, and value sets are mandatory locally, turning 'valid HL7' into 'valid here'.",
  },
  {
    slug: "mrn",
    term: "MRN",
    group: "Concepts",
    short:
      "An MRN (Medical Record Number) is the identifier a facility assigns to a patient within its own systems.",
    body: "MRNs are local, not universal. Multi-facility organisations routinely carry several identifiers for one person, which is why identifier mapping in PID-3 is a frequent source of interface defects and duplicate records.",
  },
];

export const GLOSSARY_GROUPS = [
  "Standards",
  "Transport",
  "Message types",
  "Concepts",
  "Operations",
];
