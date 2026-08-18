import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "EULA" };

export default function EulaPage() {
  return (
    <LegalPage
      title="End-user license agreement"
      draftNote="Draft — pending legal review. This page is a summary, not the binding agreement."
    >
      <p>
        The EULA governs use of the Ivren software (as distinct from this
        website&rsquo;s{" "}
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
        For a copy of the full agreement, email{" "}
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
