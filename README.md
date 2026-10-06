# opimby.org

Astro on Cloudflare Workers: prerendered pages, plus on-demand form pages (Astro Actions) and `/admin`, with data in D1. Conventions, design and testing checklists are in `AGENTS.md`.

## Develop

```sh
bun install
cp .dev.vars.local.example .dev.vars.local
bun run db:migrate:local
bun run dev       # everything, including forms and /admin (no login locally)
bun run preview   # production build with local settings
bun run check
bun run types     # after changing wrangler.jsonc
```

## Deploy

```sh
bun run deploy
```

To change the database, add a new file in `migrations/` (never edit one that's been applied), then run `bun run db:migrate:remote` before deploying.

## Admin

`opimby.org/admin` lists volunteer signups and item donations. Cloudflare Access protects it: sign in with an allowed email and the one-time code Cloudflare sends.

To add or remove someone: Cloudflare dashboard → Zero Trust → Access → Policies → "opimby admins", then edit the emails. No code change or deploy needed.

## First deploy

These steps are already done for opimby.org. They're here for setting it up from scratch.

1. `bunx wrangler login`
2. `bunx wrangler d1 create opimby`, then put the id in `wrangler.jsonc`
3. `bun run db:migrate:remote`
4. Create a Turnstile widget for `opimby.org` and `www.opimby.org`:
   - put the site key in `vars` in `wrangler.jsonc`
   - set the secret by piping it from the widget, never by pasting:
     `bunx wrangler turnstile widget get <sitekey> --json | jq -r .secret | tr -d '\n' | bunx wrangler secret put TURNSTILE_SECRET_KEY`
5. In Zero Trust, add the One-time PIN login method and a self-hosted Access application for `opimby.org/admin` and `www.opimby.org/admin`, with an allow policy listing the admin emails. Then set `ACCESS_TEAM_DOMAIN` (`https://<team>.cloudflareaccess.com`) and `ACCESS_AUD` (the application's AUD tag) in `wrangler.jsonc`.
6. `bun run deploy`
