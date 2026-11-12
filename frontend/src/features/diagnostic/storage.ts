import { questions } from "./questions";
export const STORAGE_KEY = "agentictutor.onboarding.v1";
export type Draft = {
  version: 1;
  answers: Record<string, number>;
  step: number;
  review: boolean;
  completed: boolean;
};
export const emptyDraft: Draft = {
  version: 1,
  answers: {},
  step: 0,
  review: false,
  completed: false,
};
export function parseDraft(raw: string | null): Draft {
  if (!raw) return { ...emptyDraft, answers: {} };
  try {
    const x = JSON.parse(raw);
    if (x.version !== 1 || !x.answers || typeof x.answers !== "object")
      return { ...emptyDraft, answers: {} };
    const answers: Record<string, number> = {};
    for (const q of questions) {
      const a = x.answers[q.id];
      if (Number.isInteger(a) && a >= 0 && a < q.options.length)
        answers[q.id] = a;
    }
    const complete = questions.every((q) => answers[q.id] !== undefined);
    return {
      version: 1,
      answers,
      step: Number.isInteger(x.step) ? Math.max(0, Math.min(19, x.step)) : 0,
      review: x.review === true && complete,
      completed: x.completed === true && complete,
    };
  } catch {
    return { ...emptyDraft, answers: {} };
  }
}
