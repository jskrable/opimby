import { env } from "cloudflare:workers";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2048;
const TIMEOUT_MS = 10_000;

export type HumanVerifier = (token: string | null, ip?: string) => Promise<boolean>;

export const verifyTurnstile: HumanVerifier = async (token, ip) => {
  if (!token || token.length > MAX_TOKEN_LENGTH) return false;

  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET_KEY);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  try {
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return false;
    const outcome = await res.json<{ success: boolean; hostname?: string }>();
    return outcome.success && env.TURNSTILE_HOSTNAMES.includes(outcome.hostname ?? "");
  } catch {
    return false;
  }
};
