# opimby.org

Astro static site plus a Cloudflare Worker for `/api/*` and `/admin`, with data in D1. Conventions are in `AGENTS.md`.

## Develop

```sh
bun install
cp .dev.vars.example .dev.vars
bun run db:migrate:local
bun run preview   # build and run locally, including the form and /admin (http://localhost:8787)
bun run dev       # Astro only, for quick page edits (no /api or /admin)
bun run check
```

## First deploy

1. `bunx wrangler login`
2. `bunx wrangler d1 create opimby`, then put the id in `wrangler.jsonc`
3. `bun run db:migrate:remote`
4. Create a Turnstile widget:
   - `bunx wrangler secret put TURNSTILE_SECRET_KEY`
   - build with `PUBLIC_TURNSTILE_SITE_KEY=<site key>`
5. Create a Cloudflare Access application for `/admin*`, then set `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` in `wrangler.jsonc`
6. `bun run deploy`
