import { env } from "cloudflare:workers";
import { createDonationRepository } from "./donations/repository";
import { createDonationService } from "./donations/service";
import { createNoteRepository } from "./followup/repository";
import { createFollowUpService } from "./followup/service";
import { createFundraisingService } from "./fundraising/service";
import { fetchZeffyCampaign } from "./fundraising/zeffy";
import { type Admin, requireAdmin } from "./shared/access";
import { notifyByEmail } from "./shared/notify";
import { createSubmissionAdmin } from "./shared/submission-admin";
import { verifyTurnstile } from "./shared/turnstile";
import { createVolunteerRepository } from "./volunteers/repository";
import { createVolunteerService } from "./volunteers/service";

const volunteerRepo = createVolunteerRepository(env.DB);
const donationRepo = createDonationRepository(env.DB);

export const volunteers = createVolunteerService(volunteerRepo, verifyTurnstile, notifyByEmail);
export const donations = createDonationService(donationRepo, verifyTurnstile, notifyByEmail);
export const fundraising = createFundraisingService(fetchZeffyCampaign);

const noteRepo = createNoteRepository(env.DB);

// Built per request from the middleware's Admin (Astro.locals.admin). Each service checks it again when built.
export function adminServices(signedIn: Admin | undefined) {
  const admin = requireAdmin(signedIn);
  return {
    volunteers: createSubmissionAdmin(volunteerRepo, admin),
    donations: createSubmissionAdmin(donationRepo, admin),
    followUp: createFollowUpService(noteRepo, { volunteer: volunteerRepo, donation: donationRepo }, admin),
  };
}
