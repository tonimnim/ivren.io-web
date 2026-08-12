import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

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
        {company.legalName} operates from {company.location}. Governing law
        and jurisdiction will be stated here on completion of legal review.
      </p>
      <p>
        Questions:{" "}
        <a
          href={`mailto:${company.email}`}
          className="text-accent hover:text-accent-strong"
        >
          {company.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
