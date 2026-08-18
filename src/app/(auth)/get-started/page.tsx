import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { GetStartedForm } from "@/components/auth/get-started-form";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Get started",
  path: "/get-started",
  description:
    "Start with Ivren free. Use the hosted console, install the engine locally, or both.",
});

export default function GetStartedPage() {
  return (
    <AuthShell
      title="Get started"
      intro="Free to start — hosted console, local engine, or both."
      footer={
        <>
          Already have an organisation?{" "}
          <Link href="/login" className="text-accent hover:text-accent-strong">
            Sign in
          </Link>
        </>
      }
    >
      <GetStartedForm />
    </AuthShell>
  );
}
