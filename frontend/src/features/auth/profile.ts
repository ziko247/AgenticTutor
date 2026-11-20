import "server-only";
import type { User } from "@supabase/supabase-js";
import { authClient, verifiedUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function profileRequest(
  method: "GET" | "PUT" | "PATCH",
  body?: object,
) {
  const client = await authClient();
  const {
    data: { user },
    error,
  } = await verifiedUser();
  if (error && (!error.status || error.status >= 500 || error.status === 429))
    return new Response(null, { status: 503 });
  if (error || !user) redirect("/sign-in");
  const {
    data: { session },
  } = await client.auth.getSession();
  if (!session) redirect("/sign-in");
  try {
    return await fetch(
      (process.env.API_BASE_URL || "http://127.0.0.1:8000") +
        "/api/v1/me/profile",
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
  } catch {
    return new Response(null, { status: 503 });
  }
}

export async function loadOrCreateProfile(user: User) {
  const profile = await profileRequest("GET");
  if (profile.status !== 404) return profile;
  const name = String(
    user.user_metadata.display_name || user.user_metadata.full_name || "",
  ).trim();
  return profileRequest("PUT", {
    display_name: name.slice(0, 80).trimEnd() || "Étudiant",
    preferred_language: null,
  });
}
