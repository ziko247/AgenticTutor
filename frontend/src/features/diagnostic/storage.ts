import { profileQuestions } from "./questions";
import { diagnosticBanks } from "./banks";
import { examples, type Language } from "../tutor/examples";
export const STORAGE_KEY = "agentictutor.onboarding.v2";
export type Answer = number;
export const answerLabel = (options: string[], answer: Answer | undefined) =>
  answer === undefined ? "" : options[answer];
export type Draft = {
  version: 2;
  language: Language | null;
  answers: Record<string, Answer>;
  step: number;
  review: boolean;
  completed: boolean;
};
export const emptyDraft: Draft = {
  version: 2,
  language: null,
  answers: {},
  step: 0,
  review: false,
  completed: false,
};
export function getQuestions(language: Language) {
  return [...profileQuestions, ...diagnosticBanks[language]];
}
export function parseDraft(raw: string | null): Draft {
  try {
    const x = JSON.parse(raw ?? "null");
    if (
      !x ||
      x.version !== 2 ||
      !Object.hasOwn(examples, x.language) ||
      !x.answers ||
      typeof x.answers !== "object"
    )
      return { ...emptyDraft, answers: {} };
    const language = x.language as Language;
    const questions = getQuestions(language);
    const answers: Record<string, number> = {};
    for (const q of questions) {
      const a = x.answers[q.id];
      if (Number.isInteger(a) && a >= 0 && a < q.options.length)
        answers[q.id] = a;
    }
    const complete = questions.every((q) => answers[q.id] !== undefined);
    return {
      version: 2,
      language,
      answers,
      step: Number.isInteger(x.step)
        ? Math.max(0, Math.min(questions.length - 1, x.step))
        : 0,
      review: x.review === true && complete,
      completed: x.completed === true && complete,
    };
  } catch {
    return { ...emptyDraft, answers: {} };
  }
}
