import { TURNSTILE_SITE_KEY } from "astro:env/client";

export const site = {
  name: "Operation In My Backyard",
  shortName: "OPIMBY",
  ein: "82-5527661",
  email: "info@opimby.org",
  links: {
    instagram: "https://www.instagram.com/op_imby/",
    tiktok: "https://www.tiktok.com/@opimby",
    facebook: "https://www.facebook.com/OPIMBY/",
    amazonWishlist: "https://www.amazon.com/hz/wishlist/ls/282AJ6MNXDPBB",
    venmo: "https://venmo.com/u/OpImby",
    paypal: "https://www.paypal.com/us/fundraiser/charity/3371519",
  },
  outreach: { day: "Tuesday", time: "6pm", place: "Ruth and Somerset" },
  office: "our office in Kensington",
  kitMaking: { day: "Sunday", frequency: "about once a month", length: "about two hours" },
  friends: [
    { name: "Dietz & Watson", url: "https://www.dietzandwatson.com/" },
    { name: "Love Works Resource Center", url: "https://www.loveworksrc.org/" },
    { name: "In Kind Baking Project", url: "https://www.inkindbakingproject.org/" },
  ],
  zeffy: {
    donate: "https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-26031",
    sponsor: "https://www.zeffy.com/en-US/donation-form/sponsor-an-outreach",
    // From GET https://api.zeffy.com/api/v1/campaigns.
    sponsorCampaignId: "6288e341-569f-4a9c-9d33-7714c25e9b4a",
  },
  turnstileSiteKey: TURNSTILE_SITE_KEY,
} as const;
