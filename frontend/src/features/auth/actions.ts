"use server";
import { clearRecovery, hasRecovery } from "./recovery";
import { authClient, verifiedUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function origin() {
  return process.env.APP_ORIGIN || "http://127.0.0.1:3000";
}
export async function authenticate(
  mode: "sign-in" | "sign-up",
  data: FormData,
) {
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");
  const name = String(data.get("name") || "").trim();
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < (mode === "sign-up" ? 8 : 1) ||
    (mode === "sign-up" && (!name || name.length > 80))
  )
    return { error: "Vérifiez les champs du formulaire." };
  try {
    const client = await authClient();
    const result =
      mode === "sign-up"
        ? await client.auth.signUp({
            email,
            password,
            options: {
              data: { display_name: name },
              emailRedirectTo: origin() + "/auth/callback",
            },
          })
        : await client.auth.signInWithPassword({ email, password });
    if (result.error)
      return {
        error:
          mode === "sign-in"
            ? "Connexion impossible. Vérifiez vos identifiants ou réessayez plus tard."
            : "Inscription impossible. Vérifiez vos informations ou réessayez plus tard.",
      };
    if (!result.data.session)
      return {
        message:
          "Consultez votre boîte e-mail pour confirmer votre inscription, puis connectez-vous.",
      };
    return { success: true };
  } catch {
    return {
      error:
        "Le service d’authentification est indisponible. Réessayez plus tard.",
    };
  }
}
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
export async function signOut() {
  const client = await authClient();
  const { error } = await client.auth.signOut({ scope: "local" });
  if (error) throw new Error("Déconnexion impossible. Réessayez.");
  redirect("/sign-in");
}
export async function recoverPassword(data: FormData) {
  const email = String(data.get("email") || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Saisissez une adresse e-mail valide." };
  try {
    const client = await authClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: origin() + "/auth/callback?flow=recovery",
    });
    if (error) return { error: "Envoi impossible. Réessayez plus tard." };
    return {
      message:
        "Si cette adresse permet une récupération, un e-mail vous a été envoyé.",
    };
  } catch {
    return { error: "Service indisponible. Réessayez plus tard." };
  }
}
export async function changePassword(data: FormData) {
  const password = String(data.get("password") || "");
  if (password.length < 8) return { error: "Utilisez au moins 8 caractères." };
  try {
    const client = await authClient();
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();
    if (authError || !user)
      return { error: "Ce lien n’est plus valide. Demandez un nouvel e-mail." };
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session || !(await hasRecovery(session.access_token)))
      return { error: "Ce lien n’est plus valide. Demandez un nouvel e-mail." };
    const { error } = await client.auth.updateUser({ password });
    if (error)
      return { error: "Modification impossible. Demandez un nouveau lien." };
    await clearRecovery();
    await client.auth.signOut({ scope: "local" });
    return { message: "Mot de passe modifié. Vous pouvez vous connecter." };
  } catch {
    return { error: "Service indisponible. Réessayez plus tard." };
  }
}
