import type { AstroGlobal } from "astro";
import { type ActionError, isActionError, isInputError } from "astro:actions";

export type FormErrors = { fields: Record<string, string>; message?: string };

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

export function formErrors(error: unknown): FormErrors | null {
  if (!error) return null;
  if (isInputError(error)) {
    const fields = Object.entries(error.fields).map(([name, messages]) => [name, messages?.[0] ?? FALLBACK_MESSAGE]);
    return { fields: Object.fromEntries(fields) };
  }
  return { fields: {}, message: isForbidden(error) && error.message ? error.message : FALLBACK_MESSAGE };
}

const isForbidden = (error: unknown): error is ActionError => isActionError(error) && error.code === "FORBIDDEN";

// Actions don't return the submitted values. Only re-read a body the action already parsed within its size limit.
export async function submittedValues(astro: AstroGlobal, error: unknown): Promise<FormData> {
  if (!isInputError(error) && !isForbidden(error)) return new FormData();
  try {
    return await astro.request.clone().formData();
  } catch {
    return new FormData();
  }
}
