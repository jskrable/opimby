// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  // Without these two the adapter provisions SESSION KV and IMAGES bindings we don't use.
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
  env: {
    // Build-time values only: astro:env/server reads every secret on import, which breaks prerendering.
    schema: {
      TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public' }),
    },
  },
});
