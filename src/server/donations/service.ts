import { screenSubmission, splitBotFields } from "../shared/submission";
import type { Notifier } from "../shared/notify";
import type { HumanVerifier } from "../shared/turnstile";
import type { SubmitResult } from "../shared/types";
import { donationNotification } from "./notification";
import type { DonationRepository } from "./repository";
import type { DonationForm } from "./types";

export type DonationService = ReturnType<typeof createDonationService>;

export function createDonationService(repo: DonationRepository, verifyHuman: HumanVerifier, notify: Notifier) {
  return {
    async submit(form: DonationForm, ip?: string): Promise<SubmitResult> {
      const [submission, bot] = splitBotFields(form);
      const screen = await screenSubmission(bot, verifyHuman, ip);
      if (screen !== "human") return { status: screen };

      const donation = submission.method === "pickup" ? submission : { ...submission, area: null };
      const id = await repo.create(donation);
      notify(donationNotification(donation, id));
      return { status: "saved" };
    },
  };
}
