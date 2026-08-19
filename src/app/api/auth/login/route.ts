import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { controlPlane } from "@/lib/control-plane";
import { setSession } from "@/lib/session";

/**
 * Login takes an email and a password. Nothing else.
 *
 * `org_id` is an internal lookup detail, not a credential, and asking a
 * person to type a UUID to sign in is not a login form. The control plane
 * is dropping the requirement; until that deploys, a remembered org from a
 * previous successful sign-in is sent when we have one, so returning users
 * are unaffected either way.
 */
const ORG_HINT_COOKIE = "ivren_org";

const LoginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(1024),
  // Optional, and temporary. Sent only if supplied or remembered.
  org_id: z.string().max(64).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const parsed = LoginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter your email and password." },
      { status: 400 },
    );
  }

  const jar = await cookies();
  const orgHint = jar.get(ORG_HINT_COOKIE)?.value;

  const { email, password } = parsed.data;
  const orgId = parsed.data.org_id || orgHint;

  const { data, error } = await controlPlane.POST("/auth/login", {
    body: { email, password, ...(orgId ? { org_id: orgId } : {}) } as never,
  });

  // Deliberately uniform: never reveal whether the address or the password
  // was the part that did not match.
  if (error || !data?.token) {
    return NextResponse.json(
      { error: "Those details did not match an account." },
      { status: 401 },
    );
  }

  await setSession(data.token, data.expires_at);

  // Remember the org so the next sign-in needs nothing but email and
  // password, even before the backend stops requiring it. Not a secret —
  // it identifies a tenant, it does not authenticate one.
  const sessionOrgId = (data as { user?: { org_id?: string } }).user?.org_id;
  if (sessionOrgId) {
    jar.set(ORG_HINT_COOKIE, sessionOrgId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return NextResponse.json({ ok: true });
}
