import type { z } from "astro/zod";
import type { volunteerApplicationSchema, volunteerFormSchema } from "./schema";

export type VolunteerForm = z.output<typeof volunteerFormSchema>;

export type NewVolunteerApplication = z.output<typeof volunteerApplicationSchema>;

export type VolunteerApplication = NewVolunteerApplication & {
  id: number;
  createdAt: string;
};
