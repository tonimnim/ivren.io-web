import { cache } from "react";
import { authHeader, controlPlane } from "@/lib/control-plane";
import { getSession } from "@/lib/session";

/**
 * The signed-in org and what this credential may see. Cached per request so
 * the layout and the page share one call rather than two.
 */
export const getMe = cache(async () => {
  const token = await getSession();
  if (!token) return null;

  const { data, error } = await controlPlane.GET("/auth/me", {
    headers: authHeader(token),
  });
  if (error || !data) return null;
  return data;
});
