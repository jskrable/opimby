import { env } from "cloudflare:workers";

const API_URL = "https://api.zeffy.com/api/v1";
const TIMEOUT_MS = 5_000;

// Amounts are in cents.
export type Campaign = { goal_amount: number | null; volume: number };

export type CampaignSource = (id: string) => Promise<Campaign | null>;

export const fetchZeffyCampaign: CampaignSource = async (id) => {
  try {
    const res = await fetch(`${API_URL}/campaigns/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${env.ZEFFY_API_KEY}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return await res.json<Campaign>();
  } catch {
    return null;
  }
};
