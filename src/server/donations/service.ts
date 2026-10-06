import { screenSubmission, splitBotFields } from "../shared/submission";
import type { HumanVerifier } from "../shared/turnstile";
import type { SubmitResult } from "../shared/types";
import type { DonationRepository } from "./repository";
import type { DonationForm } from "./types";

export type DonationService = ReturnType<typeof createDonationService>;

export function createDonationService(repo: DonationRepository, verifyHuman: HumanVerifier) {
  return {
    async submit(form: DonationForm, ip?: string): Promise<SubmitResult> {
      const [submission, bot] = splitBotFields(form);
      const screen = await screenSubmission(bot, verifyHuman, ip);
      if (screen !== "human") return { status: screen };

      await repo.create(submission);
      return { status: "saved" };
    },

    listRecent: (limit = 500) => repo.listRecent(limit),
  };
}
