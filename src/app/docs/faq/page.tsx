import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "Is my data uploaded anywhere?",
    a: "No. Ivren reads your files in one process, on your machine. There is no telemetry, no account, and no phone-home. It works with no internet connection at all.",
  },
  {
    q: "Do I need to replace my engine to use this?",
    a: "No. Mapping and assurance work directly on the exports your existing engine already produces. The local engine is optional.",
  },
  {
    q: "Will it work with our EHR?",
    a: "Ivren consumes standard healthcare wire formats — HL7 v2, FHIR R4, DICOM, X12, and NCPDP — rather than integrating with any specific EHR product. If your systems speak the standards, Ivren reads them; it is not certified by or affiliated with any EHR vendor, and we say that plainly.",
  },
  {
    q: "What happens when my license expires?",
    a: "Licensed verbs stop running and the product says exactly why in plain words. It never locks you out of activate, help, version, or uninstall.",
  },
  {
    q: "Can it run with no internet?",
    a: "Yes. The console is served locally and never binds a public interface. The only feature that ever needs a network is the optional, off-by-default AI integration.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <h1>FAQ</h1>
      {FAQS.map((f) => (
        <div key={f.q}>
          <h2 id={f.q.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>{f.q}</h2>
          <p>{f.a}</p>
        </div>
      ))}
    </div>
  );
}
