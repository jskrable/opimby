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
};

export type VolunteerRepository = ReturnType<typeof createVolunteerRepository>;

export function createVolunteerRepository(db: D1Database) {
  return {
    async create(a: NewVolunteerApplication): Promise<void> {
      await db
        .prepare(
          `INSERT INTO volunteer_applications (name, email, phone, interests, message)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(a.name, a.email, a.phone, JSON.stringify(a.interests), a.message)
        .run();
    },

    async count(): Promise<number> {
      const row = await db.prepare(`SELECT COUNT(*) AS n FROM volunteer_applications`).first<{ n: number }>();
      return row?.n ?? 0;
    },

    async list(limit: number, offset: number): Promise<VolunteerApplication[]> {
      const { results } = await db
        .prepare(
          `SELECT id, name, email, phone, interests, message, created_at
           FROM volunteer_applications ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
        )
        .bind(limit, offset)
        .all<Row>();
      return results.map(toApplication);
    },

    async findById(id: number): Promise<VolunteerApplication | null> {
      const row = await db
        .prepare(`SELECT id, name, email, phone, interests, message, created_at FROM volunteer_applications WHERE id = ?`)
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
  };
}
