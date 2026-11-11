import { screenSubmission, splitBotFields } from "../shared/submission";
import type { Notifier } from "../shared/notify";
import type { HumanVerifier } from "../shared/turnstile";
import type { SubmitResult } from "../shared/types";
import { volunteerNotification } from "./notification";
import type { VolunteerRepository } from "./repository";
import type { VolunteerForm } from "./types";

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
  };
}
