export const explanationLabels = {
  brief: "L’essentiel",
  steps: "Pas à pas",
  image: "Avec une image",
} as const;
export type Explanation = keyof typeof explanationLabels;

export function suggestedExplanation(score: number): Explanation {
  if (score < 10) return "image";
  if (score < 16) return "steps";
  return "brief";
}
