"use server";
import { profileRequest } from "./profile";
import { revalidatePath } from "next/cache";
export async function saveProfile(data: FormData) {
  const response = await profileRequest("PATCH", {
    display_name: String(data.get("display_name") || "").trim(),
    preferred_language: data.get("preferred_language") || null,
    revision: Number(data.get("revision")),
  });
  if (!response.ok)
    return response.status === 409
      ? "Le profil a changé. Rechargez la page avant de réessayer."
      : "Profil non enregistré. Vérifiez les champs.";
  revalidatePath("/dashboard", "layout");
  return "Profil enregistré.";
}
