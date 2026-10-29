import { type Page, toPage } from "../shared/pagination";
import { screenSubmission, splitBotFields } from "../shared/submission";
import type { Notifier } from "../shared/notify";
import type { HumanVerifier } from "../shared/turnstile";
import type { SubmitResult } from "../shared/types";
import { donationNotification } from "./notification";
import type { DonationRepository } from "./repository";
import type { DonationSubmission, DonationForm } from "./types";

export type DonationService = ReturnType<typeof createDonationService>;

export function createDonationService(repo: DonationRepository, verifyHuman: HumanVerifier, notify: Notifier) {
  return {
    async submit(form: DonationForm, ip?: string): Promise<SubmitResult> {
      const [submission, bot] = splitBotFields(form);
      const screen = await screenSubmission(bot, verifyHuman, ip);
      if (screen !== "human") return { status: screen };

      const id = await repo.create(submission);
      notify(donationNotification(submission, id));
      return { status: "saved" };
    },

    async listPage(pageParam: string | null, open = false): Promise<Page<DonationSubmission>> {
      const total = await repo.count(open);
      const { page, totalPages, offset, limit } = toPage(pageParam, total);
      return { items: await repo.list(limit, offset, open), page, totalPages, total };
    },

    get: (id: number) => (Number.isSafeInteger(id) && id > 0 ? repo.findById(id) : Promise.resolve(null)),

    count: () => repo.count(),

    countOpen: () => repo.count(true),
  };
}
