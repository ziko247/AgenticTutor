"use client";

import { useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { authClient } from "./client";

export function PasswordResetForm({ token }: { token?: string }) {
  const resetting = token !== undefined;
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const invalid = resetting && !token;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const result = resetting
        ? await authClient.resetPassword({
            token,
            newPassword: String(data.get("password") ?? ""),
          })
        : await authClient.requestPasswordReset({
            email: String(data.get("email") ?? "")
              .trim()
              .toLowerCase(),
          });

      if (!result.error) {
        setDone(true);
      } else if (result.error.code === "INVALID_TOKEN") {
        setError("Le lien est invalide ou a expiré.");
      } else if (result.error.status === 429) {
        setError("Trop de tentatives. Réessayez dans quelques instants.");
      } else {
        setError("L’opération a échoué. Réessayez dans quelques instants.");
      }
    } catch {
      setError("L’opération a échoué. Réessayez dans quelques instants.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="main" className="auth-layout">
      <aside className="auth-story">
        <Brand />
        <div>
          <h2>Retrouvez votre espace.</h2>
        </div>
      </aside>
      <section className="auth-main">
        <Link href="/sign-in" className="back-link">
          Retour à la connexion
        </Link>
        <div className="auth-form-wrap">
          <h1>
            {resetting ? "Nouveau mot de passe" : "Mot de passe oublié ?"}
          </h1>
          {done ? (
            <p className="intro" role="status">
              {resetting
                ? "Votre mot de passe a été modifié. Vous pouvez vous reconnecter."
                : "Si un compte correspond à cette adresse, vous recevrez un lien de réinitialisation."}
            </p>
          ) : invalid ? (
            <p className="intro">Le lien est invalide ou a expiré.</p>
          ) : (
            <form method="post" onSubmit={submit}>
              {resetting ? (
                <div className="field">
                  <label htmlFor="reset-password">Nouveau mot de passe</label>
                  <input
                    id="reset-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    aria-describedby="reset-password-help"
                  />
                  <p id="reset-password-help" className="field-help">
                    Au moins 8 caractères.
                  </p>
                </div>
              ) : (
                <div className="field">
                  <label htmlFor="reset-email">Adresse e-mail</label>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
              )}
              <button className="button full" type="submit" disabled={busy}>
                {busy
                  ? "Veuillez patienter…"
                  : resetting
                    ? "Modifier mon mot de passe"
                    : "Envoyer le lien"}
              </button>
              <p className="form-error" role="status">
                {error}
              </p>
            </form>
          )}
          {resetting && (
            <p className="auth-switch">
              <Link href={done ? "/sign-in" : "/forgot-password"}>
                {done ? "Se connecter" : "Demander un nouveau lien"}
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
