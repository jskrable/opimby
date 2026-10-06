import { defineMiddleware } from "astro:middleware";
import { isAdmin } from "./server/shared/access";
import { SECURITY_HEADERS } from "./server/shared/headers";

const ADMIN_PATH = /^\/admin(\/|$)/;
// Astro decodes the path up to ten times before routing, but Access matches it once, so "/%2561dmin/" gets past Access.
const MULTI_ENCODED = /%25/i;

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();
  if (MULTI_ENCODED.test(new URL(context.request.url).pathname)) return new Response("Not found", { status: 404 });

  const admin = ADMIN_PATH.test(context.url.pathname);
  if (admin && !(await isAdmin(context.request))) return new Response("Forbidden", { status: 403 });

  const response = await next();
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
  if (admin) {
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex");
  }
  return response;
});
