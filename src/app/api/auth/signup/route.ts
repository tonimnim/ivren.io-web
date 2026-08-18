import { NextResponse } from "next/server";
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
  admin_password: z.string().min(12).max(1024),
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
    return NextResponse.json(
      { error: "Check the details and try again." },
      { status: 400 },
    );
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

  // Sign them straight in so the next screen is the product, not a login
  // form asking for credentials they set ten seconds ago.
  const orgId = (data as { org?: { id?: string } }).org?.id;
  if (orgId) {
    const { data: session } = await controlPlane.POST("/auth/login", {
      body: {
        org_id: orgId,
        email: parsed.data.admin_email,
        password: parsed.data.admin_password,
      },
    });
    if (session?.token) await setSession(session.token, session.expires_at);
  }

  return NextResponse.json(data, { status: 201 });
}
