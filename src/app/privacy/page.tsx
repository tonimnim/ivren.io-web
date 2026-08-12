import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { Placeholder } from "@/components/placeholder";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      draftNote={
        <>
          Draft — pending legal review. The facts below are true today; the
          full legal text is <Placeholder>PRIVACY_POLICY</Placeholder>.
        </>
      }
    >
      <p>
        This site (ivren.io) sets no cookies and runs no trackers. If
        analytics are ever added, they will be cookieless (
        <Placeholder>ANALYTICS</Placeholder>).
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
        Questions: <Placeholder>CONTACT_EMAIL</Placeholder>.
      </p>
    </LegalPage>
  );
}
