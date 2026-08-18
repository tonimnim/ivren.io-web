import createClient from "openapi-fetch";
import type { paths } from "@/lib/api-types";

/**
 * Server-side client for the Ivren control plane.
 *
 * Never import this from a Client Component. The session token it
 * attaches lives in an httpOnly cookie and must not reach the browser —
 * a credential in browser storage is one XSS away from full org access.
 */
export const CONTROL_PLANE_URL =
  process.env.CONTROL_PLANE_URL ??
  "https://ivren-control-production.up.railway.app";

export const controlPlane = createClient<paths>({
  baseUrl: CONTROL_PLANE_URL,
});

/** Bearer header for a stored session token. */
export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
