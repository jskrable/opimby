import { TURNSTILE_SITE_KEY } from "astro:env/client";

export const site = {
  name: "Operation In My Backyard",
  shortName: "OPIMBY",
  ein: "82-5527661",
  email: "info@opimby.org",
  links: {
    instagram: "https://www.instagram.com/op_imby/",
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
  // Zeffy form paths, as in the form's link after "https://www.zeffy.com/en-US/".
  zeffy: {
    donate: "donation-form/donate-to-change-lives-26031",
    sponsor: "donation-form/sponsor-an-outreach",
  },
  turnstileSiteKey: TURNSTILE_SITE_KEY,
} as const;
