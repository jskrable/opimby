import { type Page, toPage } from "../shared/pagination";
import { screenSubmission, splitBotFields } from "../shared/submission";
import type { Notifier } from "../shared/notify";
import type { HumanVerifier } from "../shared/turnstile";
import type { SubmitResult } from "../shared/types";
import { volunteerNotification } from "./notification";
import type { VolunteerRepository } from "./repository";
import type { VolunteerApplication, VolunteerForm } from "./types";

export type VolunteerService = ReturnType<typeof createVolunteerService>;

export function createVolunteerService(repo: VolunteerRepository, verifyHuman: HumanVerifier, notify: Notifier) {
  return {
    async submit(form: VolunteerForm, ip?: string): Promise<SubmitResult> {
      const [application, bot] = splitBotFields(form);
      const screen = await screenSubmission(bot, verifyHuman, ip);
      if (screen !== "human") return { status: screen };

      const deduped = { ...application, interests: [...new Set(application.interests)] };
      const id = await repo.create(deduped);
      notify(volunteerNotification(deduped, id));
      return { status: "saved" };
    },

    async listPage(pageParam: string | null, open = false): Promise<Page<VolunteerApplication>> {
      const total = await repo.count(open);
      const { page, totalPages, offset, limit } = toPage(pageParam, total);
      return { items: await repo.list(limit, offset, open), page, totalPages, total };
    },

    get: (id: number) => (Number.isSafeInteger(id) && id > 0 ? repo.findById(id) : Promise.resolve(null)),

    count: () => repo.count(),

    countOpen: () => repo.count(true),
  };
}
