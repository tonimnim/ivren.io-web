import { NextResponse } from "next/server";
import { z } from "zod";
import { authHeader, controlPlane } from "@/lib/control-plane";
import { getSession } from "@/lib/session";
import { isSameOrigin } from "@/lib/same-origin";

/**
 * Mint this organisation's licence key, replacing any previous one.
 *
 * The plaintext crosses this handler exactly once, on its way to the person who
 * asked for it. It is never logged or stored here, and the control plane keeps
 * only a digest — so a lost key is replaced, never recovered.
 */
const MintedSchema = z.object({ key: z.string().min(1) });

const NO_STORE = { "Cache-Control": "no-store" };

function refusal(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE });
}

function messageFor(status: number): string {
  switch (status) {
    case 401:
      return "Your session has ended. Sign in again to mint a key.";
    case 403:
      return "Minting the licence key belongs to owners and admins.";
    case 409:
      return "This organisation has no licence yet, so there is no key to mint. A paid plan creates one.";
    case 503:
      return "Licensing is unavailable on our side right now, so no key was minted and nothing changed.";
    default:
      return status >= 500
        ? UNCONFIRMED
        : "That didn't go through. No key was minted and nothing changed.";
  }
}

/**
 * Minting rotates: the previous key stops working the moment the licence
 * server succeeds. When the answer is lost or unreadable after that point we
 * cannot say "nothing changed" — so this says what is actually known.
 */
const UNCONFIRMED =
  "We couldn't confirm whether a new key was minted. If one was, the previous key has stopped working — mint again to get a key you can copy.";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return refusal("That request didn't come from ivren.io.", 403);
  }

  const token = await getSession();
  if (!token) return refusal(messageFor(401), 401);

  let result;
  try {
    result = await controlPlane.POST("/licensing/key", {
      headers: authHeader(token),
    });
  } catch {
    return refusal(UNCONFIRMED, 502);
  }

  const { data, error, response } = result;
  // Read before the success check narrows `result`: this operation declares
  // no error responses, so the typed remainder would be `never`.
  const status = response.status;
  if (!error && data) {
    const minted = MintedSchema.safeParse(data);
    if (!minted.success) return refusal(UNCONFIRMED, 502);
    return NextResponse.json({ key: minted.data.key }, { headers: NO_STORE });
  }

  return refusal(messageFor(status), status);
}
