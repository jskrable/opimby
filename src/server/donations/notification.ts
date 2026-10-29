import { DONATION_METHOD_SHORT_LABELS } from "../../forms/donation";
import { contactFields, type Notification, REPLY_HINT } from "../shared/notify";
import type { NewDonationSubmission } from "./types";

export function donationNotification(d: NewDonationSubmission, id: number): Notification {
  const pickup = d.method === "pickup";
  const plan = pickup ? `needs a pickup${d.area ? ` around ${d.area}` : ""}` : "is bringing them to outreach";
  return {
    subject: `Item donation: ${d.name} ${pickup ? "needs a pickup" : "is bringing it to outreach"}`,
    intro: `${d.name} wants to donate items and ${plan}. ${REPLY_HINT}`,
    fields: [
      ["Name", d.name],
      ...contactFields(d),
      ["Getting it to us", DONATION_METHOD_SHORT_LABELS[d.method]],
      ...(pickup ? [["Pickup area", d.area ?? "Not given"] satisfies Notification["fields"][number]] : []),
      ["Items", d.items],
    ],
    replyTo: d.email,
    adminPath: `/admin/donations/${id}/`,
  };
}
