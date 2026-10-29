import { env, waitUntil } from "cloudflare:workers";
import { displayPhone } from "../../forms/phone";
import { site } from "../../site";

const FROM = { email: "notifications@opimby.org", name: site.shortName };

export type Notification = {
  subject: string;
  intro: string;
  fields: [label: string, value: string][];
  replyTo: string;
  adminPath: string;
};

export type Notifier = (notification: Notification) => void;

// A failed send doesn't fail the submission: it's already saved and shows up in /admin.
export const notifyByEmail: Notifier = ({ subject, intro, fields, replyTo, adminPath }) => {
  const link = new URL(adminPath, import.meta.env.SITE).href;
  const text = [intro, ...fields.map(([label, value]) => `${label}:\n${value}`), link].join("\n\n");
  // Subjects carry the submitter's name, and a direct POST can put line breaks in it.
  const oneLine = subject.replace(/\s+/g, " ");
  waitUntil(env.NOTIFY.send({ to: site.email, from: FROM, replyTo, subject: oneLine, text }).catch(() => {}));
};

export const REPLY_HINT = "Reply to this email to write back to them.";

export function contactFields(c: { email: string; phone: string | null }): Notification["fields"] {
  return [
    ["Email", c.email],
    ["Phone", c.phone ? displayPhone(c.phone) : "Not given"],
  ];
}
