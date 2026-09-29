import { createRemoteJWKSet, jwtVerify } from "jose";
import { FIELD_MAX, HONEYPOT, VOLUNTEER_INTERESTS } from "../shared/volunteer";

const INTEREST_VALUES = new Set<string>(VOLUNTEER_INTERESTS.map((i) => i.value));
const INTEREST_LABELS = new Map<string, string>(VOLUNTEER_INTERESTS.map((i) => [i.value, i.label]));

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/volunteer") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
      }
      return handleVolunteer(request, env, url);
    }

    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      if (!(await isAdmin(request, env))) {
        return new Response("Forbidden", { status: 403 });
      }
      return renderAdmin(env);
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;

async function handleVolunteer(request: Request, env: Env, url: URL): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirect(url, "/volunteer/?error=invalid");
  }

  // Bots that fill every field get a fake success so they don't retry.
  if (field(form, HONEYPOT, 1)) {
    return redirect(url, "/volunteer/thanks/");
  }

  const token = field(form, "cf-turnstile-response", 2048);
  const ip = request.headers.get("CF-Connecting-IP") ?? undefined;
  if (!token || !(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip))) {
    return redirect(url, "/volunteer/?error=verify");
  }

  const name = field(form, "name", FIELD_MAX.name);
  const email = field(form, "email", FIELD_MAX.email);
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return redirect(url, "/volunteer/?error=invalid");
  }

  const interests = form
    .getAll("interests")
    .filter((v): v is string => typeof v === "string" && INTEREST_VALUES.has(v));

  await env.DB.prepare(
    `INSERT INTO volunteers (name, email, phone, interests, message)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(
      name,
      email,
      field(form, "phone", FIELD_MAX.phone),
      JSON.stringify([...new Set(interests)]),
      field(form, "message", FIELD_MAX.message),
    )
    .run();

  return redirect(url, "/volunteer/thanks/");
}

// Access already guards /admin at the edge; verifying its JWT here keeps the route locked if
// Access is misconfigured or the workers.dev hostname is hit directly.
async function isAdmin(request: Request, env: Env): Promise<boolean> {
  if (env.ADMIN_DEV_BYPASS === "true") return true;
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return false;

  const issuer = env.ACCESS_TEAM_DOMAIN.replace(/\/$/, "");
  const jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  try {
    await jwtVerify(token, jwks, { issuer, audience: env.ACCESS_AUD });
    return true;
  } catch {
    return false;
  }
}

type VolunteerRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  interests: string;
  message: string | null;
  created_at: string;
};

async function renderAdmin(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT id, name, email, phone, interests, message, created_at
     FROM volunteers ORDER BY created_at DESC LIMIT 500`,
  ).all<VolunteerRow>();

  const rows = results
    .map((r) => {
      const interests = (JSON.parse(r.interests) as string[]).map((v) => INTEREST_LABELS.get(v) ?? v).join(", ");
      return `<tr>
        <td>${esc(r.created_at)} UTC</td>
        <td>${esc(r.name)}</td>
        <td><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td>
        <td>${r.phone ? `<a href="tel:${esc(r.phone)}">${esc(r.phone)}</a>` : ""}</td>
        <td>${esc(interests)}</td>
        <td>${esc(r.message ?? "")}</td>
      </tr>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Volunteer signups | Admin</title>
</head>
<body>
  <main>
    <h1>Volunteer signups</h1>
    <p>${results.length} most recent</p>
    <table>
      <thead><tr><th>Signed up</th><th>Name</th><th>Email</th><th>Phone</th><th>Interests</th><th>Message</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </main>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function field(form: FormData, key: string, max: number): string | null {
  const value = form.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed || null;
}

async function verifyTurnstile(token: string, secret: string, ip?: string): Promise<boolean> {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!res.ok) return false;
  const outcome = await res.json<{ success: boolean }>();
  return outcome.success;
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function redirect(url: URL, path: string): Response {
  return Response.redirect(new URL(path, url.origin).toString(), 303);
}
