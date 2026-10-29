import type { AstroGlobal } from "astro";
import { followUp } from "../../server/container";
import { followUpFormSchema } from "../../server/followup/schema";
import type { SubmissionKind } from "../../server/followup/types";

export type FollowUpState = { error?: string; value?: string };

// Admin forms post back to their own /admin page rather than to an Astro Action. An action also runs from
// /_actions/<name> and from any on-demand page with ?_action=<name>, where neither Access nor the middleware's
// /admin check applies.
export async function handleFollowUp(astro: AstroGlobal, kind: SubmissionKind, id: number): Promise<Response | FollowUpState> {
  if (astro.request.method !== "POST") return {};

  const admin = astro.locals.adminEmail;
  if (!admin) return new Response("Forbidden", { status: 403 });

  const form = await astro.request.formData();
  const parsed = followUpFormSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    astro.response.status = 400;
    return { error: parsed.error.issues[0]?.message, value: form.get("body")?.toString() };
  }

  await followUp.apply(kind, id, parsed.data, admin);
  return astro.redirect(astro.url.pathname, 303);
}
