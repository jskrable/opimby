import { z } from "astro/zod";
import { NOTE_MAX, NOTE_MESSAGES } from "../../forms/notes";
import { requiredText } from "../shared/schema";

const id = z.coerce.number().int().positive();

export const followUpFormSchema = z.discriminatedUnion("intent", [
  z.object({ intent: z.literal("respond") }),
  z.object({ intent: z.literal("unrespond") }),
  z.object({ intent: z.literal("add-note"), body: requiredText(NOTE_MAX.body, NOTE_MESSAGES.body) }),
  z.object({ intent: z.literal("delete-note"), noteId: id }),
]);
