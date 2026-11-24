import type { Language } from "@/lib/languages";
import type { Exercise } from "./practice";
export async function loadExercises(language: Language): Promise<Exercise[]> {
  try {
    const response = await fetch(
      (process.env.API_BASE_URL || "http://127.0.0.1:8000") +
        "/api/v1/exercises/" +
        language,
      { cache: "no-store" },
    );
    if (response.ok) return await response.json();
  } catch {}
  return [];
}
