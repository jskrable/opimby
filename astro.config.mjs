// @ts-check
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://opimby.org',
  integrations: [
    sitemap({ filter: (page) => !/\/(admin|thanks)(\/|$)/.test(new URL(page).pathname) }),
  ],
  // Without these two the adapter provisions SESSION KV and IMAGES bindings we don't use.
  adapter: cloudflare({ imageService: 'compile' }),
  session: false,
  // No Markdown here; Shiki's inline styles would conflict with the CSP.
  markdown: { syntaxHighlight: false },
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
      // Cloudflare Web Analytics is injected at the edge (auto-install) and reports to our own /cdn-cgi/rum.
      scriptDirective: { resources: ["'self'", "https://challenges.cloudflare.com", "https://static.cloudflareinsights.com"] },
    },
  },
  env: {
    // Build-time values only: astro:env/server reads every secret on import, which breaks prerendering.
    schema: {
      TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public' }),
    },
  },
});
