# OPIMBY

Website for Operation In My Backyard (OPIMBY), a 501(c)(3) harm reduction outreach group in Kensington, Philadelphia.

## Working here

- Ask before making content or product decisions: copy, form fields and options, what the site shows or collects.
- Don't write site copy unless asked; otherwise use `[PLACEHOLDER: …]`. When asked, match the existing copy: plain, direct, first-person plural, naming the actual things we hand out.
- Before building something, check what Astro and Cloudflare recommend and look for a standard library. Don't hand-roll what the platform already does.
- Track follow-up work as GitHub issues.
- Comments only for open TODOs or code that doesn't explain itself.
- Use bun for everything.
- Run `bun run check` before calling something done.

## Stack

- Astro on Cloudflare Workers via `@astrojs/cloudflare`, with no UI framework. Pages are prerendered and served straight from Cloudflare. Only the two form pages and the admin pages (`src/pages/admin/`) run on demand (`prerender = false`). `src/middleware.ts` guards every `/admin` path on top of Cloudflare Access.
- Server code lives in `src/server/`, one folder per feature: `schema`, `types`, `repository` (all D1 access) and `service` (the logic). Forms post to Astro Actions (`src/actions/`), which stay thin: the zod schema validates, the handler calls a service. `container.ts` wires them together; shared pieces are in `src/server/shared/`.
- D1 holds the data. Migrations are in `migrations/`. Never edit an applied migration; add a new one.
- Config values live in `wrangler.jsonc`: public values in `vars`, secrets through `wrangler secret put` and listed under `secrets.required`. Server code reads them at request time from `import { env } from "cloudflare:workers"`. Only values the build itself needs (the Turnstile site key in the HTML) are also declared in `astro.config.mjs` (`astro:env`). Never put a secret or runtime-only value in `astro:env`: `astro:env/server` reads every secret on import, which breaks prerendering. Local values live in the `local` env and `.dev.vars.local`. Never create a plain `.dev.vars`: production builds read it.
- Cloudflare zone and account settings (bot settings, the rate-limit and www redirect rulesets, DNS we own, Web Analytics, the `/admin` Access app and policy) live in Terraform in `infra/`. Change them there and run `bun run infra plan` / `bun run infra apply`, not in the dashboard. The token (a user API token: account-owned tokens can't reach Web Analytics) and admin emails are in `infra/terraform.tfvars` and the state is local; both are gitignored. The Worker, its custom domains and bindings stay in `wrangler.jsonc`.
- Donations go through Zeffy. Never build payments or sell anything that could read as drug supplies, which risks the payment processor shutting the account down.
- Config lives in `src/site.ts`: the name ("Operation In My Backyard", one word), links, EIN and contact.
- Form options, field limits, patterns and error messages live in `src/forms/`, which the pages, the client validation script and the server schemas all read. Form markup goes through `src/components/form/`.
- Security headers: the CSP is a `<meta>` tag from `security.csp` in `astro.config.mjs`; add any new third-party script or embed there. The header-only parts are in both `public/_headers` (prerendered pages) and `src/server/shared/headers.ts` (on-demand pages); keep the two in step.
- `/admin` has two locks, Cloudflare Access and the middleware's JWT check. Never weaken either (see `src/middleware.ts`).
- Bot traffic: Bot Fight Mode stays off so participants never hit a challenge page. AI training crawlers are opted out in `public/robots.txt` only. Never turn on Cloudflare's AI training blocking or managed `robots.txt`: its firewall rule blocked real Googlebot. Forms rely on Turnstile, the honeypot and a zone rate-limiting rule (5 form POSTs per 10s per IP).

## Design before building

Before adding or changing a page, form or link, look at the whole site, not just the file:

- **Site map:** Home, About, Photos, Donate (Funds, Items → item form), Volunteer (form), Friends, plus thanks pages and `/admin` (Overview, Volunteers and Item donations, each a paged table with a detail page per submission). Where does the change belong, and does anything now overlap or duplicate?
- **Flow:** how does someone get there and what do they do next? Every action needs an obvious, standalone way in, not a link buried in a sentence, and a clear next step after it (a thanks page, a link home).
- **Overlap between forms:** a new form or option must not compete with an existing one (for example, volunteering to pick up donations vs. offering a donation).
- **Navigation:** the nav marks the current section on sub-pages (`aria-current`). Keep the footer short; don't repeat what the main nav already reaches.
- **Content:** no duplication between sections of the same page; copy follows the Language rules and the owner's voice.
- Sketch the structure (a short outline of the page or site map) and get agreement before building.

## Testing

Nothing is done until it's been checked in a real browser. curl alone has missed real bugs here.

### Running locally

- Use `bun run dev` or `bun run preview` (both use the `local` env and Turnstile test keys). Don't run `wrangler dev` on a build: it doesn't load `.dev.vars.local`.
- When an agent runs them, Astro starts the servers in the background. Stop them with `bunx astro dev stop` / `bunx astro preview stop`.
- Apply migrations locally first with `bun run db:migrate:local`.
- Before deploying, run a production `bun run build` too. Local builds load the test secrets and can hide failures that only happen in production (a missing secret broke a deploy once).
- Cloudflare treats browser navigations differently from plain requests (see the `not_found_handling` note in `wrangler.jsonc`), and Astro's CSRF check rejects POSTs without a matching `Origin` header, so test through a browser.

### Forms

For every form change, drive the real flow in a browser (chrome-devtools MCP) and check the result in `/admin` or D1:

- Empty submit: every required field shows its inline error, the error summary appears by the submit button and takes focus, and the title starts with "Error:".
- Bad values (email, phone, too long): the right message for each; errors clear as fields are fixed.
- Phone: formats as you type, backspacing works, and a test number like `(555) 555-5555` submits and is stored as E.164.
- Valid submit: lands on the thanks page and the row appears in `/admin` with every field.
- Without JavaScript (or a direct POST): server errors render inline and keep what was typed.
- Honeypot filled: shows the thanks page and saves nothing. Missing Turnstile token: shows the verification error.
- After deploying, submit once on the live site and confirm the row in remote D1 (`wrangler d1 execute opimby --remote`).

### Accessibility

Run on every changed page and state, including form errors and `/admin`, at phone width (320–390px):

- axe-core against WCAG 2.2 AA plus best practices: zero violations. Plant one known violation first to prove the check is running.
- Touch targets: every standalone link and control is at least 44px. Use `.link-list` or `.standalone`, never `:only-child` (it ignores text, so it also catches links inside sentences). Checkbox and radio rows use the whole label as the target.
- No horizontal scroll at 320px; wide tables scroll inside a labelled, focusable region.
- Keyboard: everything reachable with Tab, focus always visible, the skip link works.
- Screen reader semantics: one `h1` and ordered headings, labels on every control, errors linked with `aria-describedby` and `aria-invalid`, nothing announced as invalid before the user interacts.
- Contrast: text at least 4.5:1 against the background (the red is for errors only).

### Secrets

- Set the Turnstile secret by piping it from `wrangler turnstile widget get <sitekey> --json` into `wrangler secret put`. Never paste it: a pasted value broke the live forms once.

## Privacy

- Collect the minimum.
- No third-party trackers, scripts or fonts, except Cloudflare Turnstile, Cloudflare Web Analytics (cookieless, injected by Cloudflare's automatic setup and reporting to our own `/cdn-cgi/rum`) and Zeffy's embed script on Donate (it only sizes the donation form's iframe). JavaScript detections stays off.
- Worker logs stay off.
- Submissions are kept indefinitely; there's no automatic deletion.
- Never ask participants for real names or anything about drug use.
- Photos: no identifiable participants. Only supplies, places, events, and volunteers who've agreed. Photos are added to `src/content/photos/` with alt text in `photos.yaml`.

## Language

- Say "people who use drugs", "participants", "sterile syringes", "safer use supplies".
- Say "safer", never "safe", about supplies: "safer consumption kits", "safer sex supplies".
- Never say "addict", "abuser", or "clean"/"dirty" about people.

## Style

- Spare and old-school: dark, single column, text links, no hero images.
- Colours: black, purple and green, set as variables in `src/styles/global.css`. Red is only for form errors.
- Fonts:
  - Anton for headings only.
  - Special Elite for body text.
  - System sans, not bold, in the footer.
- Plain semantic HTML: mobile-first, accessible, touch targets at least 44px.
