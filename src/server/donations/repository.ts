import type { DonationMethod } from "../../forms/donation";
import type { DonationSubmission, NewDonationSubmission } from "./types";

type Row = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  items: string;
  method: DonationMethod;
  area: string | null;
  created_at: string;
};

export type DonationRepository = ReturnType<typeof createDonationRepository>;

export function createDonationRepository(db: D1Database) {
  return {
    async create(d: NewDonationSubmission): Promise<void> {
      await db
        .prepare(
          `INSERT INTO donation_submissions (name, email, phone, items, method, area)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(d.name, d.email, d.phone, d.items, d.method, d.area)
        .run();
    },

    async count(): Promise<number> {
      const row = await db.prepare(`SELECT COUNT(*) AS n FROM donation_submissions`).first<{ n: number }>();
      return row?.n ?? 0;
    },

    async list(limit: number, offset: number): Promise<DonationSubmission[]> {
      const { results } = await db
        .prepare(
          `SELECT id, name, email, phone, items, method, area, created_at
           FROM donation_submissions ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
        )
        .bind(limit, offset)
        .all<Row>();
      return results.map(toSubmission);
    },

    async findById(id: number): Promise<DonationSubmission | null> {
      const row = await db
        .prepare(`SELECT id, name, email, phone, items, method, area, created_at FROM donation_submissions WHERE id = ?`)
        .bind(id)
        .first<Row>();
      return row ? toSubmission(row) : null;
    },
  };
}

function toSubmission(r: Row): DonationSubmission {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    items: r.items,
    method: r.method,
    area: r.area,
    createdAt: r.created_at,
  };
}
