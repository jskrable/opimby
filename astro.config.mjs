// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  // Without these two the adapter provisions SESSION KV and IMAGES bindings we don't use.
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
  security: {
    // Header-only parts (frame-ancestors) are in src/server/shared/headers.ts and public/_headers.
    csp: {
      directives: [
        "default-src 'self'",
        // TODO: add the Zeffy embed's origin once site.zeffy.embedUrl is set.
        "frame-src https://challenges.cloudflare.com",
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
      ],
      scriptDirective: { resources: ["'self'", "https://challenges.cloudflare.com"] },
    },
  },
  env: {
    // Build-time values only: astro:env/server reads every secret on import, which breaks prerendering.
    schema: {
      TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public' }),
    },
  },
});
