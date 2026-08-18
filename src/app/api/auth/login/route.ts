import { NextResponse } from "next/server";
import { z } from "zod";
import { controlPlane } from "@/lib/control-plane";
import { setSession } from "@/lib/session";

const LoginSchema = z.object({
  org_id: z.string().min(1).max(64),
  email: z.string().email().max(320),
  password: z.string().min(1).max(1024),
});

export async function POST(request: Request) {
  const parsed = LoginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter your organisation ID, email, and password." },
      { status: 400 },
    );
  }

  const { data, error } = await controlPlane.POST("/auth/login", {
    body: parsed.data,
  });

  // Deliberately uniform: never reveal whether the org, the email, or the
  // password was the part that did not match.
  if (error || !data?.token) {
    return NextResponse.json(
      { error: "Those details did not match an account." },
      { status: 401 },
    );
  }

  await setSession(data.token, data.expires_at);
  return NextResponse.json({ ok: true });
}
