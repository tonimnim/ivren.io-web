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
      intro="Manage your licences, seats, and users."
      footer={
        <>
          No organisation yet?{" "}
          <Link href="/signup" className="text-accent hover:text-accent-strong">
            Get started
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
