import type { z } from "astro/zod";
import type { followUpFormSchema } from "./schema";

export type SubmissionKind = "volunteer" | "donation";

export type FollowUpForm = z.output<typeof followUpFormSchema>;

export type Note = {
  id: number;
  author: string;
  body: string;
  createdAt: string;
};

// What follow-up needs from each submission feature's repository, which owns the responded columns.
export type Respondable = {
  findById(id: number): Promise<unknown>;
  markResponded(id: number, by: string): Promise<void>;
  clearResponded(id: number): Promise<void>;
};
