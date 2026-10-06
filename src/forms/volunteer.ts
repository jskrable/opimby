export const VOLUNTEER_INTERESTS = ["outreach", "kits", "donations"] as const;

export type VolunteerInterest = (typeof VOLUNTEER_INTERESTS)[number];

export const VOLUNTEER_INTEREST_LABELS: Record<VolunteerInterest, string> = {
  outreach: "Outreach (Tuesday nights)",
  kits: "Kit making (once a month at the office in Kensington)",
  donations: "Picking up donations (whenever)",
};

export const VOLUNTEER_INTEREST_SHORT_LABELS: Record<VolunteerInterest, string> = {
  outreach: "Outreach",
  kits: "Kit making",
  donations: "Donation pickups",
};

export const VOLUNTEER_MAX = { message: 2000 } as const;
