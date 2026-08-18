import { NextResponse } from "next/server";
import { z } from "zod";
import { controlPlane } from "@/lib/control-plane";

/**
 * Backend-for-frontend: the browser posts here, this calls the control
 * plane. Bounds mirror CreateOrgRequest so bad input fails locally
 * rather than burning a round trip.
 */
const SignupSchema = z.object({
  name: z.string().min(1).max(200),
  admin_name: z.string().min(1).max(200),
  admin_email: z.string().email().max(320),
  admin_password: z.string().min(12).max(1024),
  // Required by CreateOrgRequest. One seat for the admin; more are
  // added from the dashboard rather than asked for at signup.
  seats: z.coerce.number().int().positive().default(1),
});

export async function POST(request: Request) {
  const parsed = SignupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form and retry." },
      { status: 400 },
    );
  }

  const { data, error, response } = await controlPlane.POST("/auth/orgs", {
    body: parsed.data,
  });

  if (error || !data) {
    return NextResponse.json(
      { error: "That didn't go through. Check the details and try again." },
      { status: response?.status ?? 502 },
    );
  }

  // The API key is returned exactly once, so it is handed straight to the
  // page that will show it. It is deliberately not persisted here.
  return NextResponse.json(data, { status: 201 });
}
