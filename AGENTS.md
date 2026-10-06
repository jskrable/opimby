# OPIMBY

Website for Operation In My Backyard (OPIMBY), a 501(c)(3) harm reduction outreach group in Kensington, Philadelphia.

## Working here

- Ask before making content or product decisions: copy, form fields and options, what the site shows or collects.
- Never write site copy. Use `[PLACEHOLDER: …]`.
- Comments only for open TODOs or code that doesn't explain itself.
- Use bun for everything.
- Run `bun run check` before calling something done.

## Stack

- Astro on Cloudflare Workers via `@astrojs/cloudflare`, with no UI framework. Pages are prerendered and served straight from Cloudflare. Only the two form pages and `src/pages/admin.astro` run on demand (`prerender = false`).
- Server code lives in `src/server/`, one folder per feature: `schema`, `types`, `repository` (all D1 access) and `service` (the logic). Forms post to Astro Actions (`src/actions/`), which stay thin: the zod schema validates, the handler calls a service. `container.ts` wires them together; shared pieces are in `src/server/shared/`.
- D1 holds the data. Migrations are in `migrations/`. Never edit an applied migration; add a new one.
- Env vars are declared in `astro.config.mjs` (`astro:env`). Public values go in `vars` in `wrangler.jsonc`; secrets go through `wrangler secret put` and are listed under `secrets.required`. Local values live in the `local` env and `.dev.vars.local`. Never create a plain `.dev.vars`: production builds read it.
- Donations go through Zeffy. Never build payments or sell anything that could read as drug supplies, which risks the payment processor shutting the account down.
- Config lives in `src/site.ts`: the name ("Operation In My Backyard", one word), links, EIN and contact.
- Form options, field limits, patterns and error messages live in `src/forms/`, which the pages, the client validation script and the server schemas all read. Form markup goes through `src/components/form/`.

## Privacy

- Collect the minimum.
- No third-party trackers, scripts or fonts, except Cloudflare Turnstile.
- Worker logs stay off.
- Never ask participants for real names or anything about drug use.

## Language

- Say "people who use drugs", "participants", "sterile syringes", "safer use supplies".
- Never say "addict", "abuser", or "clean"/"dirty" about people.

## Style

- Spare and old-school: dark, single column, text links, no hero images.
- Colours: black, purple and green, set as variables in `src/styles/global.css`. Red is only for form errors.
- Fonts:
  - Anton for headings only.
  - Special Elite for body text.
  - System sans, not bold, in the footer.
- Plain semantic HTML: mobile-first, accessible, touch targets at least 44px.
