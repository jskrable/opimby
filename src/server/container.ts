import { env } from "cloudflare:workers";
import { createDonationRepository } from "./donations/repository";
import { createDonationService } from "./donations/service";
import { createNoteRepository } from "./followup/repository";
import { createFollowUpService } from "./followup/service";
import { notifyByEmail } from "./shared/notify";
import { verifyTurnstile } from "./shared/turnstile";
import { createVolunteerRepository } from "./volunteers/repository";
import { createVolunteerService } from "./volunteers/service";

const volunteerRepo = createVolunteerRepository(env.DB);
const donationRepo = createDonationRepository(env.DB);

export const volunteers = createVolunteerService(volunteerRepo, verifyTurnstile, notifyByEmail);
export const donations = createDonationService(donationRepo, verifyTurnstile, notifyByEmail);
export const followUp = createFollowUpService(createNoteRepository(env.DB), { volunteer: volunteerRepo, donation: donationRepo });
