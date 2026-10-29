import { VOLUNTEER_INTEREST_LABELS, VOLUNTEER_INTEREST_SHORT_LABELS } from "../../forms/volunteer";
import { contactFields, type Notification, REPLY_HINT } from "../shared/notify";
import type { NewVolunteerApplication } from "./types";

export function volunteerNotification(a: NewVolunteerApplication, id: number): Notification {
  const interests = a.interests.map((i) => VOLUNTEER_INTEREST_SHORT_LABELS[i]).join(", ");
  return {
    subject: `Volunteer signup: ${a.name}${interests ? ` (${interests})` : ""}`,
    intro: `${a.name} signed up to volunteer on opimby.org. ${REPLY_HINT}`,
    fields: [
      ["Name", a.name],
      ...contactFields(a),
      ["Wants to help with", a.interests.map((i) => VOLUNTEER_INTEREST_LABELS[i]).join("\n") || "Nothing picked"],
      ["Message", a.message ?? "None"],
    ],
    replyTo: a.email,
    adminPath: `/admin/volunteers/${id}/`,
  };
}
