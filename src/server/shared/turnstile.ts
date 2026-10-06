import { env } from "cloudflare:workers";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type HumanVerifier = (token: string | null, ip?: string) => Promise<boolean>;

export const verifyTurnstile: HumanVerifier = async (token, ip) => {
  if (!token) return false;

  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET_KEY);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  const res = await fetch(SITEVERIFY_URL, { method: "POST", body });
  if (!res.ok) return false;
  const outcome = await res.json<{ success: boolean }>();
  return outcome.success;
};
