import type { z } from "astro/zod";
import type { donationFormSchema, donationSubmissionSchema } from "./schema";

export type DonationForm = z.output<typeof donationFormSchema>;

export type NewDonationSubmission = z.output<typeof donationSubmissionSchema>;

export type DonationSubmission = NewDonationSubmission & {
  id: number;
  createdAt: string;
};
