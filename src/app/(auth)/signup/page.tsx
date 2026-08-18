import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Get started",
  path: "/signup",
  description:
    "Create your Ivren organisation to get a licence key and download the engine. The product runs on your own machine and never phones home.",
});

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Get started with Ivren"
      intro="Create your organisation to issue a licence key and download the engine. Takes a minute."
      footer={
        <>
          Already have an organisation?{" "}
          <Link href="/login" className="text-accent hover:text-accent-strong">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
