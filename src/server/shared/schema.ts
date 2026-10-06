import { z } from "astro/zod";
import {
  CONTACT_MAX,
  CONTACT_MESSAGES,
  EMAIL_PATTERN,
  HONEYPOT,
  matchesPattern,
  tooLongMessage,
  TURNSTILE_FIELD,
} from "../../forms/common";
import { isValidPhone, toE164 } from "../../forms/phone";

// Actions submit empty form fields as null.
export const requiredText = (max: number, message: string) =>
  z
    .string({ error: message })
    .trim()
    .min(1, message)
    .max(max, tooLongMessage(max));

export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, tooLongMessage(max))
    .nullish()
    .transform((v) => v || null);

export const contactSchema = z.object({
  name: requiredText(CONTACT_MAX.name, CONTACT_MESSAGES.name),
  email: requiredText(CONTACT_MAX.email, CONTACT_MESSAGES.email).refine(
    (v) => matchesPattern(EMAIL_PATTERN, v),
    CONTACT_MESSAGES.emailFormat,
  ),
  phone: optionalText(CONTACT_MAX.phone)
    .refine((v) => v === null || isValidPhone(v), CONTACT_MESSAGES.phoneFormat)
    .transform((v) => v && toE164(v)),
});

export const botFields = z.object({
  [HONEYPOT]: z.string().nullish(),
  [TURNSTILE_FIELD]: z.string().nullish(),
});

export type BotFields = z.output<typeof botFields>;
