import { ACCESS_AUD, ACCESS_TEAM_DOMAIN, ADMIN_DEV_BYPASS } from "astro:env/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

// Access already guards /admin at the edge; verifying its JWT here keeps the route locked if
// Access is misconfigured or the workers.dev hostname is hit directly.
export async function isAdmin(request: Request): Promise<boolean> {
  if (ADMIN_DEV_BYPASS) return true;
  if (!ACCESS_TEAM_DOMAIN || !ACCESS_AUD) return false;

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return false;

  const issuer = ACCESS_TEAM_DOMAIN.replace(/\/$/, "");
  const jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  try {
    await jwtVerify(token, jwks, { issuer, audience: ACCESS_AUD });
    return true;
  } catch {
    return false;
  }
}
