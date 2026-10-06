import { screenSubmission, splitBotFields } from "../shared/submission";
import type { HumanVerifier } from "../shared/turnstile";
import type { SubmitResult } from "../shared/types";
import type { VolunteerRepository } from "./repository";
import type { VolunteerForm } from "./types";

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

    listRecent: (limit = 500) => repo.listRecent(limit),
  };
}
