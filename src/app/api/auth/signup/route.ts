import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { controlPlane } from "@/lib/control-plane";
import { setSession } from "@/lib/session";

/**
 * Organisation signup, on the narrow signup lane.
 *
 * Deliberately NOT the vendor provisioning token. That credential is
 * effectively root — unlimited orgs, unlimited seats, and it reads the
 * whole customer fleet via /fleet/summary — so parking it behind an
 * unauthenticated public endpoint gave this route far more power than
 * signing somebody up requires.
 *
 * X-Ivren-Signup-Token is accepted for org creation only, caps seats at
 * the free-tier limit, and is globally throttled server-side. The lane is
 * chosen by which header arrives, so a wrong token is never retried on
 * the other lane.
 */
const SignupSchema = z.object({
  name: z.string().min(1).max(200),
  admin_name: z.string().min(1).max(200),
  admin_email: z.string().email().max(320),
  admin_password: z.string().min(10).max(1024),
  // The signup lane caps seats server-side; never request beyond it.
  seats: z.coerce.number().int().min(1).max(5).default(1),
});

export async function POST(request: Request) {
  const token = process.env.IVREN_SIGNUP_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Signup is not configured on this deployment. Set IVREN_SIGNUP_TOKEN.",
      },
      { status: 503 },
    );
  }

  const parsed = SignupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    // Never surface raw validator text — it leaks internals and reads badly.
    // But "check the details" with no detail named sends a person hunting
    // through four fields for a rule nothing states, so each field gets one
    // handwritten sentence instead.
    const field = String(parsed.error.issues[0]?.path?.[0] ?? "");
    const message =
      field === "admin_password"
        ? "Passwords need at least 10 characters — length matters more than symbols."
        : field === "admin_email"
          ? "That email address doesn't look right."
          : field === "name"
            ? "Give your organisation a name."
            : field === "admin_name"
              ? "Tell us your name."
              : "Check the details and try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data, error, response } = await controlPlane.POST("/auth/orgs", {
    body: parsed.data,
    headers: { "X-Ivren-Signup-Token": token },
  });

  if (error || !data) {
    const status = response?.status;
    const message =
      status === 409
        ? "An organisation with that email already exists."
        : status === 429
          ? "Signups are busy right now. Try again shortly, or contact us."
          : status === 422
            ? "Some details weren't accepted. Check them and try again."
            : "That didn't go through. Try again, or contact us.";
    return NextResponse.json({ error: message }, { status: status ?? 502 });
  }

  // Signup signs you in. The control plane is moving to returning a session
  // directly; until that deploy lands it still returns a birth key, so fall
  // back to an explicit login. Either way the browser gets a cookie, never a
  // credential, and the deprecated api_key is dropped here rather than
  // travelling to the client.
  const created = data as {
    org?: { id?: string };
    session?: { token?: string; expires_at?: string };
  };

  let session = created.session;
  if (!session?.token && created.org?.id) {
    const { data: logged } = await controlPlane.POST("/auth/login", {
      body: {
        org_id: created.org.id,
        email: parsed.data.admin_email,
        password: parsed.data.admin_password,
      },
    });
    session = logged ?? undefined;
  }

  if (session?.token) await setSession(session.token, session.expires_at);

  // Remember the tenant so the next sign-in needs only email and password.
  if (created.org?.id) {
    const jar = await cookies();
    jar.set("ivren_org", created.org.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return NextResponse.json({ org: created.org }, { status: 201 });
}
