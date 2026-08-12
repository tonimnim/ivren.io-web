import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { Placeholder } from "@/components/placeholder";

export const metadata: Metadata = { title: "Refund policy" };

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund policy"
      draftNote={
        <>
          Draft — pending legal review. Terms are{" "}
          <Placeholder>REFUND_POLICY</Placeholder>.
        </>
      }
    >
      <p>
        Evaluation happens on the Trial tier before any purchase, so paid
        licenses are entered into deliberately. Specific refund windows and
        conditions for Professional and Enterprise purchase orders will be
        published here once set.
      </p>
      <p>
        Questions: <Placeholder>CONTACT_EMAIL</Placeholder>.
      </p>
    </LegalPage>
  );
}
