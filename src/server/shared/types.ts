import type { ScreenResult } from "./submission";

export type SubmitResult = { status: "saved" } | { status: Exclude<ScreenResult, "human"> };

export type Responded = { respondedAt: string | null; respondedBy: string | null };
