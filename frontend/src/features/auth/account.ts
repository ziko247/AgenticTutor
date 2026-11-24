import { cache } from "react";
import { redirect } from "next/navigation";
import { verifiedUser } from "@/lib/supabase/server";
import { loadOrCreateProfile } from "./profile";
import type { Language } from "@/lib/languages";

export const account = cache(async () => {
  const {
    data: { user },
    error,
  } = await verifiedUser();
  if (error && (!error.status || error.status >= 500 || error.status === 429))
    return null;
  if (!user || error) redirect("/sign-in");
  const response = await loadOrCreateProfile(user);
  if (!response.ok) return null;
  const profile: {
    display_name: string;
    preferred_language: Language | null;
    revision: number;
  } = await response.json();
  return { user, profile };
});
