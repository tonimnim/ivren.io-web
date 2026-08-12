import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "Refund policy" };

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund policy"
      draftNote="Draft — pending legal review."
    >
      <p>
        Evaluation happens on the Trial tier before any purchase, so paid
        licenses are entered into deliberately. If a purchase was made in
        error, contact us and we will work it out.
      </p>
      <p>
        Refund requests:{" "}
        <a
          href={`mailto:${company.email}`}
          className="text-accent hover:text-accent-strong"
        >
          {company.email}
        </a>{" "}
        or {company.phone}.
      </p>
    </LegalPage>
  );
}
