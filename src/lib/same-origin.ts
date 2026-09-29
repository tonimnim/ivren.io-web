/**
 * CSRF, for the handlers that change something using the session cookie.
 *
 * The cookie is SameSite=Lax, which already keeps it off cross-site POSTs in
 * current browsers. This is the second lock, and the one that does not depend
 * on the browser getting that right: a mutation is accepted only when its
 * Origin names this site. A request with no Origin is refused too — every
 * browser sends one with a fetch that changes something, so its absence means
 * the caller is not one of our pages.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  // Behind Railway's edge the public host arrives as x-forwarded-host. A page
  // on another site cannot set that header on a cross-site request without a
  // preflight this app never answers, so trusting it here opens nothing.
  const hosts = [
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
  ].filter((h): h is string => Boolean(h));

  return hosts.includes(originHost);
}
