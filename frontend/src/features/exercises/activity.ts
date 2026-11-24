"use server";
import { accountRequest } from "@/features/auth/profile";
import { revalidatePath } from "next/cache";
import type { Language } from "@/lib/languages";
export type Activity = {
  today: string;
  days: Record<string, number>;
  completed: string[];
};
export async function loadActivity(): Promise<Activity | null> {
  const response = await accountRequest("activity", "GET");
  return response.ok ? response.json() : null;
}
export async function completeExercise(language: Language, id: string) {
  if (!/^[a-z]+$/.test(language) || !/^[a-z]+-\d+$/.test(id)) return false;
  const response = await accountRequest(
    "activity/" + language + "/" + id,
    "PUT",
  );
  if (response.ok) revalidatePath("/dashboard");
  return response.ok;
}
