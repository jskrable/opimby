# opimby.org

Astro on Cloudflare Workers: static pages, plus on-demand `/api/*` and `/admin`, with data in D1. Conventions are in `AGENTS.md`.

## Develop

```sh
bun install
cp .dev.vars.local.example .dev.vars.local
bun run db:migrate:local
bun run dev       # everything, including forms and /admin
bun run preview   # production build with local settings
bun run check
bun run types     # after changing wrangler.jsonc
```

## First deploy

1. `bunx wrangler login`
2. `bunx wrangler d1 create opimby`, then put the id in `wrangler.jsonc`
3. `bun run db:migrate:remote`
4. Create a Turnstile widget:
   - `bunx wrangler secret put TURNSTILE_SECRET_KEY`
   - put the site key in `vars` in `wrangler.jsonc`
5. Create a Cloudflare Access application for `/admin*`, then set `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` in `wrangler.jsonc`
6. `bun run deploy`
