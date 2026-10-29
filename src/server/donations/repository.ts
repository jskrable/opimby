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
  responded_at: string | null;
  responded_by: string | null;
};

const OPEN = " WHERE responded_at IS NULL";

export type DonationRepository = ReturnType<typeof createDonationRepository>;

export function createDonationRepository(db: D1Database) {
  return {
    async create(d: NewDonationSubmission): Promise<number> {
      const { meta } = await db
        .prepare(
          `INSERT INTO donation_submissions (name, email, phone, items, method, area)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(d.name, d.email, d.phone, d.items, d.method, d.area)
        .run();
      return meta.last_row_id;
    },

    // Keeps the first person who marked it, so a second click doesn't take the credit.
    async markResponded(id: number, by: string): Promise<void> {
      await db
        .prepare(`UPDATE donation_submissions SET responded_at = datetime('now'), responded_by = ? WHERE id = ? AND responded_at IS NULL`)
        .bind(by, id)
        .run();
    },

    async clearResponded(id: number): Promise<void> {
      await db.prepare(`UPDATE donation_submissions SET responded_at = NULL, responded_by = NULL WHERE id = ?`).bind(id).run();
    },

    async count(open = false): Promise<number> {
      const row = await db.prepare(`SELECT COUNT(*) AS n FROM donation_submissions${open ? OPEN : ""}`).first<{ n: number }>();
      return row?.n ?? 0;
    },

    async list(limit: number, offset: number, open = false): Promise<DonationSubmission[]> {
      const { results } = await db
        .prepare(
          `SELECT id, name, email, phone, items, method, area, created_at, responded_at, responded_by
           FROM donation_submissions${open ? OPEN : ""} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
        )
        .bind(limit, offset)
        .all<Row>();
      return results.map(toSubmission);
    },

    async findById(id: number): Promise<DonationSubmission | null> {
      const row = await db
        .prepare(`SELECT id, name, email, phone, items, method, area, created_at, responded_at, responded_by FROM donation_submissions WHERE id = ?`)
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
    respondedAt: r.responded_at,
    respondedBy: r.responded_by,
  };
}
