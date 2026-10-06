import { ActionError, defineAction } from "astro:actions";
import { VERIFY_MESSAGE } from "../forms/common";
import { donations, volunteers } from "../server/container";
import { donationFormSchema } from "../server/donations/schema";
import type { SubmitResult } from "../server/shared/types";
import { volunteerFormSchema } from "../server/volunteers/schema";

// Spam gets the same success response as a real submission so bots don't retry.
function respond(result: SubmitResult) {
  if (result.status === "unverified") throw new ActionError({ code: "FORBIDDEN", message: VERIFY_MESSAGE });
  return { ok: true };
}

export const server = {
  volunteer: defineAction({
    accept: "form",
    input: volunteerFormSchema,
    handler: async (input, { clientAddress }) => respond(await volunteers.submit(input, clientAddress)),
  }),

  donation: defineAction({
    accept: "form",
    input: donationFormSchema,
    handler: async (input, { clientAddress }) => respond(await donations.submit(input, clientAddress)),
  }),
};
