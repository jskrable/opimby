// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  // Without these two the adapter provisions SESSION KV and IMAGES bindings we don't use.
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
  env: {
    schema: {
      TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public' }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret' }),
      ACCESS_TEAM_DOMAIN: envField.string({ context: 'server', access: 'public', default: '' }),
      ACCESS_AUD: envField.string({ context: 'server', access: 'public', default: '' }),
      ADMIN_DEV_BYPASS: envField.boolean({ context: 'server', access: 'public', default: false }),
    },
  },
});
