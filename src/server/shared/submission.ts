import { HONEYPOT, TURNSTILE_FIELD } from "../../forms/common";
import type { BotFields } from "./schema";
import type { HumanVerifier } from "./turnstile";

export type ScreenResult = "human" | "spam" | "unverified";

// Honeypot first so obvious bots never cost a Turnstile call.
export async function screenSubmission(bot: BotFields, verifyHuman: HumanVerifier, ip?: string): Promise<ScreenResult> {
  if (bot[HONEYPOT]?.trim()) return "spam";
  return (await verifyHuman(bot[TURNSTILE_FIELD] ?? null, ip)) ? "human" : "unverified";
}

export function splitBotFields<T extends BotFields>(input: T): [Omit<T, keyof BotFields>, BotFields] {
  const { [HONEYPOT]: honeypot, [TURNSTILE_FIELD]: token, ...rest } = input;
  return [rest, { [HONEYPOT]: honeypot, [TURNSTILE_FIELD]: token }];
}
