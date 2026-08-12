import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { Placeholder } from "@/components/placeholder";

export const metadata: Metadata = { title: "Terms of use" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      draftNote="Draft — pending legal review."
    >
      <p>
        These terms govern use of the ivren.io website. They are separate
        from the license terms governing use of the Ivren software — see the{" "}
        <a href="/eula" className="text-accent hover:text-accent-strong">
          EULA
        </a>
        .
      </p>
      <p>
        Governing law: <Placeholder>LEGAL_NAME</Placeholder> will specify
        jurisdiction here once finalized.
      </p>
      <p>
        Questions: <Placeholder>CONTACT_EMAIL</Placeholder>.
      </p>
    </LegalPage>
  );
}
