import { env } from "cloudflare:workers";
import { createRemoteJWKSet, jwtVerify } from "jose";

// Second check behind Access, for a misconfigured app or a request to the workers.dev hostname.
export async function isAdmin(request: Request): Promise<boolean> {
  if (env.ADMIN_DEV_BYPASS === "true") return true;
  const { ACCESS_TEAM_DOMAIN, ACCESS_AUD } = env;
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
