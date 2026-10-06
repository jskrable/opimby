import { z } from "astro/zod";
import { VOLUNTEER_INTERESTS, VOLUNTEER_MAX } from "../../forms/volunteer";
import { botFields, contactSchema, optionalText } from "../shared/schema";

export const volunteerApplicationSchema = contactSchema.extend({
  interests: z.array(z.enum(VOLUNTEER_INTERESTS)),
  message: optionalText(VOLUNTEER_MAX.message),
});

export const volunteerFormSchema = volunteerApplicationSchema.extend(botFields.shape);
