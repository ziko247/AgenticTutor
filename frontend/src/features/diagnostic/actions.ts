"use server";

import { authClient } from "@/lib/supabase/server";
import type { Language } from "@/lib/languages";

export type DiagnosticAttempt = {
  id: string;
  language: Language;
  revision: number;
  step: number;
  review: boolean;
  completed: boolean;
  score: number | null;
  correct_count: number | null;
  answers: Record<string, number>;
  questions: {
    id: string;
    title: string;
    code: string | null;
    options: string[];
    kind: "profile" | "technical";
  }[];
};

type Result =
  | { attempt: DiagnosticAttempt | null; error?: never }
  | { error: string; attempt?: never };

async function request(
  path: string,
  method: "GET" | "POST" | "PUT",
  body?: object,
): Promise<Result> {
  try {
    const client = await authClient();
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session) return { error: "Votre session a expiré. Reconnectez-vous." };
    const response = await fetch(
      (process.env.API_BASE_URL || "http://127.0.0.1:8000") +
        "/api/v1/diagnostic" +
        path,
      {
        method,
        cache: "no-store",
        headers: {
          Authorization: "Bearer " + session.access_token,
          "Content-Type": "application/json",
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      },
    );
    if (response.status === 401)
      return { error: "Votre session a expiré. Reconnectez-vous." };
    if (response.status === 409)
      return {
        error: "Le diagnostic a changé. Rechargez la page avant de continuer.",
      };
    if (!response.ok)
      return {
        error: "Enregistrement indisponible. Réessayez dans un instant.",
      };
    return { attempt: await response.json() };
  } catch {
    return { error: "Enregistrement indisponible. Réessayez dans un instant." };
  }
}

export async function loadDiagnostic() {
  return request("/current", "GET");
}
export async function startDiagnostic(language: Language, requestId: string) {
  return request("/attempts", "POST", { language, request_id: requestId });
}
export async function saveDiagnostic(
  id: string,
  body: {
    revision: number;
    step: number;
    review: boolean;
    answers: Record<string, number>;
    complete: boolean;
  },
) {
  return request("/attempts/" + encodeURIComponent(id), "PUT", body);
}
export async function resetDiagnostic(id: string, revision: number) {
  const result = await request("/reset", "POST", { attempt_id: id, revision });
  return result.error ? result : { attempt: null };
}
