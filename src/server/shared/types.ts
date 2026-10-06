import type { ScreenResult } from "./submission";

export type SubmitResult = { status: "saved" } | { status: Exclude<ScreenResult, "human"> };
