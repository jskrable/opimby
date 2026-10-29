import type { VolunteerInterest } from "../../forms/volunteer";
import type { NewVolunteerApplication, VolunteerApplication } from "./types";

type Row = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  interests: string;
  message: string | null;
  created_at: string;
  responded_at: string | null;
  responded_by: string | null;
};

const OPEN = " WHERE responded_at IS NULL";

export type VolunteerRepository = ReturnType<typeof createVolunteerRepository>;

export function createVolunteerRepository(db: D1Database) {
  return {
    async create(a: NewVolunteerApplication): Promise<number> {
      const { meta } = await db
        .prepare(
          `INSERT INTO volunteer_applications (name, email, phone, interests, message)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(a.name, a.email, a.phone, JSON.stringify(a.interests), a.message)
        .run();
      return meta.last_row_id;
    },

    // Keeps the first person who marked it, so a second click doesn't take the credit.
    async markResponded(id: number, by: string): Promise<void> {
      await db
        .prepare(`UPDATE volunteer_applications SET responded_at = datetime('now'), responded_by = ? WHERE id = ? AND responded_at IS NULL`)
        .bind(by, id)
        .run();
    },

    async clearResponded(id: number): Promise<void> {
      await db.prepare(`UPDATE volunteer_applications SET responded_at = NULL, responded_by = NULL WHERE id = ?`).bind(id).run();
    },

    async count(open = false): Promise<number> {
      const row = await db.prepare(`SELECT COUNT(*) AS n FROM volunteer_applications${open ? OPEN : ""}`).first<{ n: number }>();
      return row?.n ?? 0;
    },

    async list(limit: number, offset: number, open = false): Promise<VolunteerApplication[]> {
      const { results } = await db
        .prepare(
          `SELECT id, name, email, phone, interests, message, created_at, responded_at, responded_by
           FROM volunteer_applications${open ? OPEN : ""} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
        )
        .bind(limit, offset)
        .all<Row>();
      return results.map(toApplication);
    },

    async findById(id: number): Promise<VolunteerApplication | null> {
      const row = await db
        .prepare(`SELECT id, name, email, phone, interests, message, created_at, responded_at, responded_by FROM volunteer_applications WHERE id = ?`)
        .bind(id)
        .first<Row>();
      return row ? toApplication(row) : null;
    },
  };
}

function toApplication(r: Row): VolunteerApplication {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    interests: JSON.parse(r.interests) as VolunteerInterest[],
    message: r.message,
    createdAt: r.created_at,
    respondedAt: r.responded_at,
    respondedBy: r.responded_by,
  };
}
