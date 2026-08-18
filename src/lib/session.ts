import { cookies } from "next/headers";

/**
 * Session handling. The control plane returns a bearer token on login;
 * it is stored httpOnly so only server code can read it, and every call
 * to a protected endpoint is made server-side on the browser's behalf.
 */
export const SESSION_COOKIE = "ivren_session";

export async function setSession(token: string, expiresAt?: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(expiresAt ? { expires: new Date(expiresAt) } : {}),
  });
}

export async function getSession() {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
