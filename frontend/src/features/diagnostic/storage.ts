import { questions } from "./questions";
export const STORAGE_KEY = "agentictutor.onboarding.v1";
export type Answer = number | number[];
export function answerLabel(
  options: string[],
  answer: Answer | undefined,
): string {
  return (Array.isArray(answer) ? answer : answer === undefined ? [] : [answer])
    .map((i) => options[i])
    .join(", ");
}
export type Draft = {
  version: 1;
  answers: Record<string, Answer>;
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
    const answers: Record<string, Answer> = {};
    for (const q of questions) {
      const a = x.answers[q.id];
      if (q.multiple) {
        if (
          Array.isArray(a) &&
          a.length > 0 &&
          a.every((i) => Number.isInteger(i) && i >= 0 && i < q.options.length)
        ) {
          const unique = [...new Set<number>(a)];
          answers[q.id] = unique.includes(q.options.length - 1)
            ? [q.options.length - 1]
            : unique;
        }
      } else if (Number.isInteger(a) && a >= 0 && a < q.options.length)
        answers[q.id] = a;
    }
    const complete = questions.every((q) => answers[q.id] !== undefined);
    return {
      version: 1,
      answers,
      step:
        !complete && (x.review === true || x.completed === true)
          ? questions.findIndex((q) => answers[q.id] === undefined)
          : Number.isInteger(x.step)
            ? Math.max(0, Math.min(questions.length - 1, x.step))
            : 0,
      review: x.review === true && complete,
      completed: x.completed === true && complete,
    };
  } catch {
    return { ...emptyDraft, answers: {} };
  }
}
