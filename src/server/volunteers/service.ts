import { type Page, toPage } from "../shared/pagination";
import { screenSubmission, splitBotFields } from "../shared/submission";
import type { HumanVerifier } from "../shared/turnstile";
import type { SubmitResult } from "../shared/types";
import type { VolunteerRepository } from "./repository";
import type { VolunteerApplication, VolunteerForm } from "./types";

export type VolunteerService = ReturnType<typeof createVolunteerService>;

export function createVolunteerService(repo: VolunteerRepository, verifyHuman: HumanVerifier) {
  return {
    async submit(form: VolunteerForm, ip?: string): Promise<SubmitResult> {
      const [application, bot] = splitBotFields(form);
      const screen = await screenSubmission(bot, verifyHuman, ip);
      if (screen !== "human") return { status: screen };

      await repo.create({ ...application, interests: [...new Set(application.interests)] });
      return { status: "saved" };
    },

    async listPage(pageParam: string | null): Promise<Page<VolunteerApplication>> {
      const total = await repo.count();
      const { page, totalPages, offset, limit } = toPage(pageParam, total);
      return { items: await repo.list(limit, offset), page, totalPages, total };
    },

    get: (id: number) => (Number.isSafeInteger(id) && id > 0 ? repo.findById(id) : Promise.resolve(null)),

    count: () => repo.count(),
  };
}
