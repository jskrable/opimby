import type { AstroGlobal } from "astro";
import { isInputError } from "astro:actions";

export type FormErrors = { fields: Record<string, string>; message?: string };

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

export function formErrors(error: unknown): FormErrors | null {
  if (!error) return null;
  if (isInputError(error)) {
    const fields = Object.entries(error.fields).map(([name, messages]) => [name, messages?.[0] ?? FALLBACK_MESSAGE]);
    return { fields: Object.fromEntries(fields) };
  }
  const { code, message } = error as { code?: string; message?: string };
  return { fields: {}, message: code === "FORBIDDEN" && message ? message : FALLBACK_MESSAGE };
}

// Actions don't hand back what was submitted, so re-read the POST body to refill the form.
export async function submittedValues(astro: AstroGlobal): Promise<FormData> {
  if (astro.request.method !== "POST") return new FormData();
  try {
    return await astro.request.clone().formData();
  } catch {
    return new FormData();
  }
}
