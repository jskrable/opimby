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

    async listRecent(limit: number): Promise<VolunteerApplication[]> {
      const { results } = await db
        .prepare(
          `SELECT id, name, email, phone, interests, message, created_at
           FROM volunteer_applications ORDER BY created_at DESC LIMIT ?`,
        )
        .bind(limit)
        .all<Row>();
      return results.map(toApplication);
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
