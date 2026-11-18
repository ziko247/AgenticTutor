import type { Language } from "@/lib/languages";

export type Answer = number;
export const answerLabel = (options: string[], answer: Answer | undefined) =>
  answer === undefined ? "" : options[answer];
export type Draft = {
  language: Language | null;
  answers: Record<string, Answer>;
  step: number;
  review: boolean;
  completed: boolean;
};
export const emptyDraft: Draft = {
  language: null,
  answers: {},
  step: 0,
  review: false,
  completed: false,
};
