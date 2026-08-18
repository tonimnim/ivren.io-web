import { NextResponse } from "next/server";
import { z } from "zod";
import { controlPlane } from "@/lib/control-plane";
import { setSession } from "@/lib/session";

/**
 * Organisation signup.
 *
 * POST /auth/orgs is gated by a deployment-wide provisioning secret, and
 * that header is excluded from the API's CORS allow-list so a browser can
 * never send it. This route is not a browser: it runs on ivren.io's own
 * server, which is vendor infrastructure, so it holds the token in an env
 * var and presents it on the caller's behalf. The browser still cannot
 * provision an org directly — only this validated form can.
 */
const SignupSchema = z.object({
  name: z.string().min(1).max(200),
  admin_name: z.string().min(1).max(200),
  admin_email: z.string().email().max(320),
  admin_password: z.string().min(12).max(1024),
  seats: z.coerce.number().int().positive().default(1),
});

export async function POST(request: Request) {
  const token = process.env.IVREN_PROVISIONING_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Signup is not configured on this deployment. Set IVREN_PROVISIONING_TOKEN.",
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
    headers: { "X-Ivren-Provisioning-Token": token },
  });

  if (error || !data) {
    const conflict = response?.status === 409;
    return NextResponse.json(
      {
        error: conflict
          ? "An organisation with that email already exists."
          : "That didn't go through. Try again, or contact us.",
      },
      { status: response?.status ?? 502 },
    );
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
