import { env } from "cloudflare:workers";
import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

// Second check behind Access, for a misconfigured app or a URL Access doesn't match.
export async function isAdmin(request: Request): Promise<boolean> {
  if (env.ADMIN_DEV_BYPASS === "true") return true;
  const { ACCESS_TEAM_DOMAIN, ACCESS_AUD } = env;
  if (!ACCESS_TEAM_DOMAIN || !ACCESS_AUD) return false;

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return false;

  const issuer = ACCESS_TEAM_DOMAIN.replace(/\/$/, "");
  jwks ??= createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  try {
    await jwtVerify(token, jwks, { issuer, audience: ACCESS_AUD });
    return true;
  } catch {
    return false;
  }
}
