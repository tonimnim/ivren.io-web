import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { Placeholder } from "@/components/placeholder";

export const metadata: Metadata = { title: "EULA" };

export default function EulaPage() {
  return (
    <LegalPage
      title="End-user license agreement"
      draftNote={
        <>
          Draft — pending legal review. This page is a placeholder, not a
          binding agreement. The full EULA is{" "}
          <Placeholder>EULA</Placeholder>.
        </>
      }
    >
      <p>
        The EULA will govern use of the Ivren software (as distinct from
        this website&rsquo;s{" "}
        <a href="/terms" className="text-accent hover:text-accent-strong">
          terms of use
        </a>
        ), covering license grant and scope by tier, activation and seat
        binding as described in{" "}
        <a href="/licensing" className="text-accent hover:text-accent-strong">
          how licensing works
        </a>
        , and standard warranty and liability terms.
      </p>
      <p>
        Questions: <Placeholder>CONTACT_EMAIL</Placeholder>.
      </p>
    </LegalPage>
  );
}
