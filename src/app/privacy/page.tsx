import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      draftNote="Draft — pending legal review. The facts below are accurate today."
    >
      <p>
        This site (ivren.io) sets no cookies and runs no trackers, and no
        analytics are in use.
      </p>
      <p>
        Data submitted through a contact or quote form on this site is used
        solely to reply to your inquiry, and for nothing else.
      </p>
      <p>
        This policy covers the website only. For how the Ivren product
        itself handles data on your machine, see{" "}
        <a href="/security" className="text-accent hover:text-accent-strong">
          Security
        </a>
        .
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
