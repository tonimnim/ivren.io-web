import { NextResponse } from "next/server";
import { z } from "zod";
import { authHeader, controlPlane } from "@/lib/control-plane";
import { getSession } from "@/lib/session";
import { isSameOrigin } from "@/lib/same-origin";

/**
 * Change one person's role.
 *
 * Deliberately thin: which roles exist, who may confer them, and the two
 * refusals that matter (nobody changes their own role; an organisation always
 * keeps an owner) are the control plane's rules, enforced there. This handler
 * checks the request came from our own page and passes it on.
 */
const BodySchema = z.object({ role: z.string().min(1).max(32) });

function refusal(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function messageFor(status: number): string {
  switch (status) {
    case 401:
      return "Your session has ended. Sign in again to change roles.";
    case 403:
      return "Changing roles belongs to owners and admins.";
    case 404:
      return "That person isn't in this organisation any more.";
    case 409:
      return "That change isn't allowed: nobody changes their own role, and an organisation always keeps an owner.";
    case 422:
      return "That role can't be given here.";
    default:
      return "That didn't go through. The role is unchanged.";
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  if (!isSameOrigin(request)) {
    return refusal("That request didn't come from ivren.io.", 403);
  }

  const token = await getSession();
  if (!token) return refusal(messageFor(401), 401);

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return refusal("Choose a role.", 400);

  const { userId } = await params;

  try {
    const { data, error, response } = await controlPlane.PATCH(
      "/auth/users/{user_id}/role",
      {
        params: { path: { user_id: userId } },
        body: { role: parsed.data.role },
        headers: authHeader(token),
      },
    );
    if (!error && data) return NextResponse.json({ role: data.role });
    return refusal(messageFor(response.status), response.status);
  } catch {
    return refusal(
      "We couldn't confirm the change. Refresh to see the current role.",
      502,
    );
  }
}
