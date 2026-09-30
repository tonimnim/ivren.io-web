/**
 * The home hero's sample: one synthetic admit, three destinations, and what
 * the deployment gate says about a handful of changes to it.
 *
 * Scripted, and labelled as a synthetic sample on screen. The model is small
 * but honest: each destination reads particular fields, and a change breaks a
 * destination only when it alters a field that destination reads — the same
 * reasoning the gate applies when it compares a candidate's output with
 * yesterday's. Anything the script does not cover is INDETERMINATE, which is
 * what the real gate says when its evidence cannot speak to a change.
 */

export type DestId = "lab" | "pharmacy" | "billing";
export type Verdict = "PASS" | "FAIL" | "INDETERMINATE";
export type FieldKey = "PV1-2" | "PV1-3";

export type Change = { key: FieldKey; value: string };

export type Outcome = {
  verdict: Verdict;
  /** Destinations the change breaks, each with the located reason. */
  breaks: Partial<Record<DestId, string>>;
  /** What the gate reports: located to the field, counted over the replay. */
  finding: string;
  /** The same finding in the words of whoever has to act on it. */
  why: string;
};

export type Preset = { value: string; hint: string; outcome: Outcome };

export type Editable = {
  name: string;
  original: string;
  presets: Preset[];
};

/** Yesterday's traffic on this feed, replayed against every change. */
export const REPLAYED = 4213;

export const DESTINATIONS: {
  id: DestId;
  name: string;
  transport: string;
  reads: string;
}[] = [
  { id: "lab", name: "Lab", transport: "MLLP", reads: "PV1-3.1" },
  { id: "pharmacy", name: "Pharmacy", transport: "MLLP", reads: "PV1-3.1, PV1-3.2" },
  { id: "billing", name: "Billing", transport: "file", reads: "PV1-2, PV1-3.3" },
];

const NO_EVIDENCE = "Missing evidence never becomes a pass.";

export const EDITABLE: Record<FieldKey, Editable> = {
  "PV1-3": {
    name: "Bed location",
    original: "4W^412^1",
    presets: [
      {
        value: "4W^412",
        hint: "drop the bed",
        outcome: {
          verdict: "FAIL",
          breaks: { billing: "PV1-3.3 missing" },
          finding: "Billing · PV1-3.3 (bed) missing in 1,406 of 4,213 messages",
          why: "Billing reads the bed to post bed-day charges. None of those would bill.",
        },
      },
      {
        value: "4W^412^1^A",
        hint: "add a component",
        outcome: {
          verdict: "PASS",
          breaks: {},
          finding: "0 divergences in 4,213 messages",
          why: "Every destination still gets the fields it reads. Safe to ship.",
        },
      },
      {
        value: "4W-412-1",
        hint: "flatten it",
        outcome: {
          verdict: "FAIL",
          breaks: {
            lab: "PV1-3.1 changed",
            pharmacy: "PV1-3.2 missing",
            billing: "PV1-3.3 missing",
          },
          finding: "3 destinations · PV1-3 components lost in 1,406 of 4,213 messages",
          why: "One string where three fields were: unit, room and bed all stop resolving.",
        },
      },
    ],
  },
  "PV1-2": {
    name: "Patient class",
    original: "I",
    presets: [
      {
        value: "O",
        hint: "outpatient",
        outcome: {
          verdict: "FAIL",
          breaks: { billing: "PV1-2 changed" },
          finding: "Billing · PV1-2 changed in 1,406 of 4,213 messages",
          why: "Every inpatient admit would open an outpatient account.",
        },
      },
      {
        value: "E",
        hint: "emergency",
        outcome: {
          verdict: "INDETERMINATE",
          breaks: {},
          finding: "No recorded message carries class E · nothing to compare against",
          why: NO_EVIDENCE,
        },
      },
      {
        value: "X",
        hint: "not a code",
        outcome: {
          verdict: "FAIL",
          breaks: { lab: "refused", pharmacy: "refused", billing: "refused" },
          finding: "PV1-2 'X' is not in HL7 table 0004 · 4,213 messages refused at conformance",
          why: "Nothing would reach any destination.",
        },
      },
    ],
  },
};

/** The change the hero proposes on its own before handing over. */
export const INTRO: Change = { key: "PV1-3", value: "4W^412" };

const UNPROVEN: Outcome = {
  verdict: "INDETERMINATE",
  breaks: {},
  finding: "The sample holds no evidence for that change · nothing to compare against",
  why: NO_EVIDENCE,
};

const UNCHANGED: Outcome = {
  verdict: "PASS",
  breaks: {},
  finding: "No change to prove",
  why: "Every destination receives exactly what it did yesterday.",
};

export function outcomeFor({ key, value }: Change): Outcome {
  const field = EDITABLE[key];
  if (value === field.original) return UNCHANGED;
  return field.presets.find((p) => p.value === value)?.outcome ?? UNPROVEN;
}

/** Keep the sample well-formed: no HL7 separators a field could not hold. */
export function sanitize(key: FieldKey, raw: string) {
  return key === "PV1-3"
    ? raw.toUpperCase().replace(/[^A-Z0-9^-]/g, "").slice(0, 16)
    : raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);
}
