import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sign in",
  path: "/login",
  description:
    "Sign in to your Ivren organisation to manage licences, seats, and users.",
});

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      intro="Manage licences, seats, and users."
      footer={
        <>
          No organisation yet?{" "}
          <Link href="/request-access" className="text-accent hover:text-accent-strong">
            Request access
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
