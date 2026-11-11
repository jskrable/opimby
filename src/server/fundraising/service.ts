import type { CampaignSource } from "./zeffy";

export type Progress = { raised: number; goal: number };

const CACHE_SECONDS = 300;

// The Cache API needs a URL key; this one is never fetched.
const cacheKey = (id: string) => new Request(`https://opimby.org/cache/zeffy-campaign/${encodeURIComponent(id)}`);

export function createFundraisingService(source: CampaignSource) {
  return {
    async progress(campaignId: string): Promise<Progress | null> {
      const cache = await caches.open("zeffy");
      const cached = await cache.match(cacheKey(campaignId));
      if (cached) return cached.json<Progress>();

      const campaign = await source(campaignId);
      if (!campaign?.goal_amount) return null;

      const progress: Progress = { raised: Math.round(campaign.volume / 100), goal: Math.round(campaign.goal_amount / 100) };
      await cache.put(cacheKey(campaignId), Response.json(progress, { headers: { "Cache-Control": `max-age=${CACHE_SECONDS}` } }));
      return progress;
    },
  };
}
