export const DONATION_METHODS = ["outreach", "pickup"] as const;

export type DonationMethod = (typeof DONATION_METHODS)[number];

export const DONATION_METHOD_LABELS: Record<DonationMethod, string> = {
  outreach: "I'll bring it to outreach (Tuesdays at 6pm, Ruth and Somerset)",
  pickup: "I need a pickup",
};

export const DONATION_METHOD_SHORT_LABELS: Record<DonationMethod, string> = {
  outreach: "Bringing to outreach",
  pickup: "Needs pickup",
};

export const DONATION_MAX = { items: 2000, area: 100 } as const;

export const DONATION_MESSAGES = {
  items: "Tell us what you have",
  method: "Choose how you want to get it to us",
} as const;
