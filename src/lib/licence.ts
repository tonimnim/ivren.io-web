import { authHeader, controlPlane } from "@/lib/control-plane";

/**
 * What the licence says, read for a page.
 *
 * Four states rather than a nullable record, because "licensing is down",
 * "you may not read this" and "there is no licence" are three different
 * sentences on a page. Collapsing them is how a paying hospital gets told it
 * is on the free tier the day the licence server has a bad afternoon.
 *
 * Server-only: it carries the session token.
 */
export type LicenceState =
  | { kind: "unavailable" }
  | { kind: "refused" }
  | { kind: "none" }
  | {
      kind: "entitled";
      seats: number | null;
      seatsInUse: number | null;
      periodEnd: string | null;
      keyIssued: boolean;
    };

const num = (v: unknown) => (typeof v === "number" ? v : null);

export async function readLicence(token: string): Promise<LicenceState> {
  try {
    const { data, response } = await controlPlane.GET("/licensing/status", {
      headers: authHeader(token),
    });
    if (response.status === 401 || response.status === 403) {
      return { kind: "refused" };
    }
    if (!data) return { kind: "unavailable" };

    const d = data as Record<string, unknown>;
    if (d.entitled !== true) return { kind: "none" };
    return {
      kind: "entitled",
      seats: num(d.seats),
      seatsInUse: num(d.seats_in_use),
      periodEnd: typeof d.period_end === "string" ? d.period_end : null,
      keyIssued: d.key_issued === true,
    };
  } catch {
    return { kind: "unavailable" };
  }
}
