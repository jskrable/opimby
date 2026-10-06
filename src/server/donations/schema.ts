import { z } from "astro/zod";
import { DONATION_MAX, DONATION_MESSAGES, DONATION_METHODS } from "../../forms/donation";
import { botFields, contactSchema, optionalText, requiredText } from "../shared/schema";

export const donationSubmissionSchema = contactSchema.extend({
  items: requiredText(DONATION_MAX.items, DONATION_MESSAGES.items),
  method: z.enum(DONATION_METHODS, { error: DONATION_MESSAGES.method }),
  area: optionalText(DONATION_MAX.area),
});

export const donationFormSchema = donationSubmissionSchema.extend(botFields.shape);
