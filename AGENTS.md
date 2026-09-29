# OPIMBY

Website for Operation In My Backyard (OPIMBY), a 501(c)(3) harm reduction outreach group in Kensington, Philadelphia.

## Working here

- Ask before making content or product decisions: copy, form fields and options, what the site shows or collects.
- Never write site copy. Use `[PLACEHOLDER: …]`.
- Comments only for open TODOs or code that doesn't explain itself.
- Use bun for everything.
- Run `bun run check` before calling something done.

## Stack

- Astro builds a fully static site into `dist/`, with no UI framework.
- `worker/index.ts` handles only `/api/*` and `/admin`. Cloudflare serves every other path straight from `dist/`.
- D1 holds the data. Migrations are in `migrations/`.
- Donations go through Zeffy. Never build payments or sell anything that could read as drug supplies, which risks the payment processor shutting the account down.
- Config lives in `src/site.ts`: the name ("Operation In My Backyard", one word), links, EIN and contact.
- Volunteer options live in `shared/volunteer.ts`, which the page and the Worker both read.

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
- Colours: black, purple and green, set as variables in `src/styles/global.css`.
- Fonts:
  - Anton for headings only.
  - Special Elite for body text.
  - System sans, not bold, in the footer.
- Plain semantic HTML: mobile-first, accessible, touch targets at least 44px.
