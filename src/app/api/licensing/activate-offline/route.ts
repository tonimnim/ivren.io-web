import { NextResponse } from "next/server";
import { z } from "zod";
import { controlPlane } from "@/lib/control-plane";

/**
 * Offline activation, on behalf of a machine that cannot reach us.
 *
 * Public on purpose, like the endpoint behind it: the request carries the
 * licence key it was generated with, and that key is the credential. Somebody
 * carrying a USB stick to a borrowed computer should not have to sign in there
 * to finish the job.
 *
 * Because the request holds a live licence key, it is never logged, never
 * echoed back in an error, and never kept. It passes through this handler to
 * the licence server and nowhere else.
 */
const BodySchema = z.object({
  // The control plane's own bound; anything longer is not a request.
  request: z.string().trim().min(1).max(16384),
});

const IssuedSchema = z.object({
  licence: z.string().min(1),
  seat: z.number().int().nullish(),
  seats: z.number().int().nullish(),
  seats_in_use: z.number().int().nullish(),
  expires_at: z.string().nullish(),
  new_machine: z.boolean().nullish(),
});

const NO_STORE = { "Cache-Control": "no-store" };

const UNREACHABLE =
  "The licence server didn't answer. Nothing was issued — try again in a moment.";

function refusal(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE });
}

/** The `detail` of a FastAPI refusal, whatever shape it arrived in. */
function detailOf(error: unknown): unknown {
  return error && typeof error === "object" && "detail" in error
    ? (error as { detail: unknown }).detail
    : undefined;
}

/**
 * One sentence per refusal, each saying what to do next. The licence server
 * deliberately gives one answer for every reason a key is not recognised, so
 * this page does not guess at which reason it was.
 */
function messageFor(status: number, error: unknown): string {
  switch (status) {
    case 400:
      return "That isn't a complete activation request. Copy the block whole, including both ----- lines, and try again.";
    case 401:
      return "The licence key inside that request isn't one we recognise. If your organisation has minted a new key since, generate a fresh request on the machine with the new one.";
    case 403:
      return "The organisation that key belongs to has no active plan, so it can't activate machines.";
    case 409: {
      // The one refusal that names numbers, because it is the one a customer
      // can act on.
      const detail = detailOf(error) as { seats?: unknown } | undefined;
      const seats = typeof detail?.seats === "number" ? detail.seats : null;
      return seats === null
        ? "Every seat on this licence is in use. Contact us to move a seat to this machine."
        : `All ${seats} seats on this licence are in use. Contact us to move a seat to this machine.`;
    }
    case 422:
      return "The machine details in that request couldn't be read. Generate a fresh request on that machine and try again.";
    case 503:
      // The licence server is up but cannot issue: in production this has
      // meant no licensing store is wired in. It is ours to fix, not theirs,
      // and it refuses every machine alike, so the sentence says exactly that.
      return "Licensing is unavailable on our side right now, so no licence can be issued for any machine. Nothing was issued or kept. Try again later, or contact us.";
    default:
      return status >= 500
        ? UNREACHABLE
        : "That didn't go through. Nothing was issued.";
  }
}

export async function POST(request: Request) {
  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return refusal(
      "Paste the whole activation request, including both ----- lines.",
      400,
    );
  }

  let result;
  try {
    result = await controlPlane.POST("/licensing/activate/offline", {
      body: { request: parsed.data.request },
    });
  } catch {
    return refusal(UNREACHABLE, 502);
  }

  const { data, error, response } = result;

  if (!error && data) {
    const issued = IssuedSchema.safeParse(data);
    // A 200 without a licence in it would leave somebody carrying nothing back.
    if (!issued.success) return refusal(UNREACHABLE, 502);
    return NextResponse.json(issued.data, { headers: NO_STORE });
  }

  const status = response.status;
  return refusal(
    messageFor(status, error),
    status === 503 ? 503 : status >= 500 ? 502 : status,
  );
}
