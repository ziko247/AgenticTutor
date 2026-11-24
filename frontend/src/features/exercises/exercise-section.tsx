import { languages, type Language } from "@/lib/languages";
import { Practice, type Exercise } from "./practice";
import { suggestedExplanation } from "./styles";

export async function ExerciseSection({
  language,
  score,
}: {
  language: Language;
  score: number;
}) {
  let exercises: Exercise[] = [];
  try {
    const base = process.env.API_BASE_URL || "http://127.0.0.1:8000";
    const response = await fetch(base + "/api/v1/exercises/" + language, {
      cache: "no-store",
    });
    if (response.ok) exercises = await response.json();
  } catch {
    // The profile and diagnostic remain accessible during an API outage.
  }
  return exercises.length ? (
    <Practice
      key={language + score}
      language={languages[language].label}
      exercises={exercises}
      recommended={suggestedExplanation(score)}
    />
  ) : (
    <p role="status">
      Les exercices sont indisponibles. Rechargez la page pour réessayer.
    </p>
  );
}
