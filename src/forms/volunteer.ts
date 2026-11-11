import { site } from "../site";

const { outreach, office, kitMaking } = site;

export const VOLUNTEER_INTERESTS = ["outreach", "kits", "donations"] as const;

export type VolunteerInterest = (typeof VOLUNTEER_INTERESTS)[number];

export const VOLUNTEER_INTEREST_LABELS: Record<VolunteerInterest, string> = {
  outreach: `Outreach (${outreach.day}s at ${outreach.time})`,
  kits: `Kit making (${kitMaking.frequency}, ${kitMaking.day}s at ${office})`,
  donations: "Picking up donations (whenever)",
};

export const VOLUNTEER_INTEREST_SHORT_LABELS: Record<VolunteerInterest, string> = {
  outreach: "Outreach",
  kits: "Kit making",
  donations: "Donation pickups",
};

export const VOLUNTEER_MAX = { message: 2000 } as const;
