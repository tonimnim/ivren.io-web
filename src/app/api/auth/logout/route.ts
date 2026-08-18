import { NextResponse } from "next/server";
import { controlPlane } from "@/lib/control-plane";
import { authHeader } from "@/lib/control-plane";
import { clearSession, getSession } from "@/lib/session";

export async function POST() {
  const token = await getSession();

  // Best-effort server-side revocation; the cookie is cleared regardless,
  // so a failed upstream call can never leave the browser looking signed in.
  if (token) {
    await controlPlane
      .POST("/auth/logout", { headers: authHeader(token) })
      .catch(() => undefined);
  }

  await clearSession();
  return NextResponse.json({ ok: true });
}
