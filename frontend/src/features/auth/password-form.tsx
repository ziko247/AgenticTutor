"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Brand } from "@/components/brand";
import { recoverPassword, changePassword } from "./actions";

export function PasswordForm({
  reset = false,
  invalidLink = false,
}: {
  reset?: boolean;
  invalidLink?: boolean;
}) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(
      invalidLink
        ? "Ce lien est invalide ou expiré. Demandez un nouveau lien."
        : "",
    );

  return (
    <main id="main" className="auth-layout">
      <aside className="auth-story">
        <Brand />
        <div>
          <h2>Retrouvons votre accès.</h2>
          <p>Reprenez votre apprentissage là où vous l’aviez laissé.</p>
        </div>
        <span>Comprendre. Essayer. Recommencer.</span>
      </aside>
      <section className="auth-main">
        <Link href="/sign-in" className="back-link">
          <ArrowLeft size={17} aria-hidden="true" />
          Retour à la connexion
        </Link>
        <div className="auth-form-wrap">
          <h1>{reset ? "Nouveau mot de passe" : "Mot de passe oublié ?"}</h1>
          <p className="intro">
            {reset
              ? "Choisissez un nouveau mot de passe pour accéder à votre compte."
              : "Indiquez votre adresse e-mail pour recevoir un lien de réinitialisation."}
          </p>
          <div className="prototype-note">
            <LockKeyhole size={18} aria-hidden="true" />
            <p>
              {reset
                ? "Utilisez un mot de passe d’au moins 8 caractères."
                : "Le lien reçu vous permettra de choisir un nouveau mot de passe."}
            </p>
          </div>
          <form
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
                {reset ? "Nouveau mot de passe" : "Adresse e-mail"}{" "}
                <span>(obligatoire)</span>
              </label>
              <input
                id="recovery-field"
                name={reset ? "password" : "email"}
                type={reset ? "password" : "email"}
                autoComplete={reset ? "new-password" : "email"}
                required
                minLength={reset ? 8 : undefined}
                aria-describedby="recovery-help"
              />
              <p id="recovery-help" className="field-help">
                {reset
                  ? "Au moins 8 caractères."
                  : "Exemple : vous@universite.ma"}
              </p>
            </div>
            <button
              className="button full"
              type="submit"
              disabled={busy}
              aria-busy={busy}
            >
              {busy
                ? "Traitement…"
                : reset
                  ? "Enregistrer"
                  : "Recevoir un lien"}
            </button>
            <p role="status" className="field-help">
              {message}
            </p>
          </form>
          <p className="auth-switch">
            Vous connaissez votre mot de passe ?{" "}
            <Link href="/sign-in">Se connecter</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
