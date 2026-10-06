import { env } from "cloudflare:workers";
import { createDonationRepository } from "./donations/repository";
import { createDonationService } from "./donations/service";
import { verifyTurnstile } from "./shared/turnstile";
import { createVolunteerRepository } from "./volunteers/repository";
import { createVolunteerService } from "./volunteers/service";

export const volunteers = createVolunteerService(createVolunteerRepository(env.DB), verifyTurnstile);
export const donations = createDonationService(createDonationRepository(env.DB), verifyTurnstile);
