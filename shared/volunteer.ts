export const VOLUNTEER_INTERESTS = [
  { value: "outreach", label: "Outreach (Tuesday nights)" },
  { value: "kits", label: "Kit making (once a month at the office)" },
  { value: "donations", label: "Donations and pickups (whenever)" },
] as const;

export const FIELD_MAX = { name: 100, email: 254, phone: 30, message: 2000 } as const;

export const HONEYPOT = "website";
