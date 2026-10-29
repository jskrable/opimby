import type { Note, SubmissionKind } from "./types";

type Row = { id: number; author: string; body: string; created_at: string };

export type NoteRepository = ReturnType<typeof createNoteRepository>;

export function createNoteRepository(db: D1Database) {
  return {
    async list(kind: SubmissionKind, submissionId: number): Promise<Note[]> {
      const { results } = await db
        .prepare(
          `SELECT id, author, body, created_at FROM submission_notes
           WHERE submission_type = ? AND submission_id = ? ORDER BY created_at, id`,
        )
        .bind(kind, submissionId)
        .all<Row>();
      return results.map((r) => ({ id: r.id, author: r.author, body: r.body, createdAt: r.created_at }));
    },

    async create(kind: SubmissionKind, submissionId: number, author: string, body: string): Promise<void> {
      await db
        .prepare(`INSERT INTO submission_notes (submission_type, submission_id, author, body) VALUES (?, ?, ?, ?)`)
        .bind(kind, submissionId, author, body)
        .run();
    },

    // Scoped to the author, so nobody can delete someone else's note.
    async delete(kind: SubmissionKind, submissionId: number, noteId: number, author: string): Promise<void> {
      await db
        .prepare(`DELETE FROM submission_notes WHERE id = ? AND submission_type = ? AND submission_id = ? AND author = ?`)
        .bind(noteId, kind, submissionId, author)
        .run();
    },
  };
}
