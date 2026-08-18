import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RequestAccessForm } from "@/components/auth/request-access-form";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Request access",
  path: "/request-access",
  description:
    "Request an Ivren organisation. Accounts are provisioned by a person, then you download the engine and activate it with your licence key.",
});

export default function RequestAccessPage() {
  return (
    <AuthShell
      title="Request access"
      intro="We provision your organisation and send your licence key, usually within a business day."
      footer={
        <>
          Already have an organisation?{" "}
          <Link href="/login" className="text-accent hover:text-accent-strong">
            Sign in
          </Link>
        </>
      }
    >
      <RequestAccessForm />
    </AuthShell>
  );
}
