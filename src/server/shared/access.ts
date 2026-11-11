import { env } from "cloudflare:workers";
import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

const DEV_ADMIN = "dev@opimby.org";

declare const issued: unique symbol;
// Only signIn() makes one, so admin services can't be built from a bare email.
export type Admin = { readonly email: string; readonly [issued]: true };

const signedIn = new WeakSet<object>();

function issue(email: string): Admin {
  const admin = Object.freeze({ email }) as Admin;
  signedIn.add(admin);
  return admin;
}

// Admin services call this when they're built, so a cast or a missing sign-in fails at runtime too.
export function requireAdmin(admin: Admin | undefined): Admin {
  if (!admin || !signedIn.has(admin)) throw new Error("Admin services need a signed-in admin");
  return admin;
}

// Second check behind Access, for a misconfigured app or a URL Access doesn't match.
export async function signIn(request: Request): Promise<Admin | null> {
  if (env.ADMIN_DEV_BYPASS === "true") return issue(DEV_ADMIN);
  const { ACCESS_TEAM_DOMAIN, ACCESS_AUD } = env;
  if (!ACCESS_TEAM_DOMAIN || !ACCESS_AUD) return null;

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;

  const issuer = ACCESS_TEAM_DOMAIN.replace(/\/$/, "");
  jwks ??= createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer, audience: ACCESS_AUD });
    return typeof payload.email === "string" && payload.email ? issue(payload.email) : null;
  } catch {
    return null;
  }
}
