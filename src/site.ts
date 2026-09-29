export const site = {
  name: "Operation In My Backyard",
  shortName: "OPIMBY",
  ein: "82-5527661",
  email: "info@opimby.org",
  links: {
    instagram: "https://www.instagram.com/op_imby/",
    facebook: "https://www.facebook.com/OPIMBY/",
    amazonWishlist: "https://www.amazon.com/hz/wishlist/ls/282AJ6MNXDPBB",
    paypal: "https://www.paypal.com/us/fundraiser/charity/3371519",
  },
  // TODO: set once the Zeffy donation form exists (Zeffy form > Share > Embed).
  zeffy: {
    formUrl: "",
    embedUrl: "",
  },
  // Cloudflare's always-pass test key.
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA",
} as const;
