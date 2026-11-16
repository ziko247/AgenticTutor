"use client";
import Link from "next/link";
import { useState } from "react";
import { recoverPassword, changePassword } from "./actions";
export function PasswordForm({ reset = false }: { reset?: boolean }) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  return (
    <main id="main" className="container dashboard-main">
      <h1>{reset ? "Nouveau mot de passe" : "Mot de passe oublié"}</h1>
      <form
        className="auth-form-wrap"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          try {
            const result = await (reset ? changePassword : recoverPassword)(
              new FormData(event.currentTarget),
            );
            setMessage(result.error || result.message || "");
          } catch {
            setMessage("Service indisponible. Réessayez.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="field">
          <label htmlFor="recovery-field">
            {reset ? "Mot de passe" : "Adresse e-mail"}
          </label>
          <input
            id="recovery-field"
            name={reset ? "password" : "email"}
            type={reset ? "password" : "email"}
            autoComplete={reset ? "new-password" : "email"}
            required
            minLength={reset ? 8 : undefined}
          />
        </div>
        <button className="button" disabled={busy} aria-busy={busy}>
          {busy ? "Traitement…" : reset ? "Enregistrer" : "Recevoir un lien"}
        </button>
        <p role="status">{message}</p>
        <Link className="text-link" href="/sign-in">
          Se connecter
        </Link>
      </form>
    </main>
  );
}
