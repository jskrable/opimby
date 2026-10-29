import type { NoteRepository } from "./repository";
import type { FollowUpForm, Note, Respondable, SubmissionKind } from "./types";

export type FollowUpService = ReturnType<typeof createFollowUpService>;

export function createFollowUpService(notes: NoteRepository, submissions: Record<SubmissionKind, Respondable>) {
  return {
    notes: (kind: SubmissionKind, id: number): Promise<Note[]> => notes.list(kind, id),

    async apply(kind: SubmissionKind, id: number, input: FollowUpForm, admin: string): Promise<void> {
      const submission = submissions[kind];
      if (!(await submission.findById(id))) return;

      switch (input.intent) {
        case "respond":
          return submission.markResponded(id, admin);
        case "unrespond":
          return submission.clearResponded(id);
        case "add-note":
          return notes.create(kind, id, admin, input.body);
        case "delete-note":
          return notes.delete(kind, id, input.noteId, admin);
      }
    },
  };
}
