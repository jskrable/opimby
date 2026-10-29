import { env } from "cloudflare:workers";
import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

const DEV_ADMIN = "dev@opimby.org";

// Second check behind Access, for a misconfigured app or a URL Access doesn't match. Returns the signed-in admin's email.
export async function adminEmail(request: Request): Promise<string | null> {
  if (env.ADMIN_DEV_BYPASS === "true") return DEV_ADMIN;
  const { ACCESS_TEAM_DOMAIN, ACCESS_AUD } = env;
  if (!ACCESS_TEAM_DOMAIN || !ACCESS_AUD) return null;

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;

  const issuer = ACCESS_TEAM_DOMAIN.replace(/\/$/, "");
  jwks ??= createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer, audience: ACCESS_AUD });
    return typeof payload.email === "string" && payload.email ? payload.email : null;
  } catch {
    return null;
  }
}
