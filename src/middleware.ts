import { defineMiddleware } from "astro:middleware";
import { isAdmin } from "./server/shared/access";

const ADMIN_PATH = /^\/admin(\/|$)/;

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered || !ADMIN_PATH.test(context.url.pathname)) return next();
  if (!(await isAdmin(context.request))) return new Response("Forbidden", { status: 403 });

  const response = await next();
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex");
  return response;
});
