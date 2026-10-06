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
  friends: [
    { name: "Dietz & Watson", url: "https://www.dietzandwatson.com/" },
    { name: "Love Works Resource Center", url: "https://www.loveworksrc.org/" },
    { name: "In Kind Baking Project", url: "https://www.inkindbakingproject.org/" },
  ],
  // TODO: set once the Zeffy donation form exists (Zeffy form > Share > Embed).
  zeffy: {
    formUrl: "",
    embedUrl: "",
  },
  turnstileSiteKey: TURNSTILE_SITE_KEY,
} as const;
