"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import { authClient } from "./client";
export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const signup = mode === "sign-up";
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  function validate(data: FormData) {
    const e: Record<string, string> = {};
    if (signup && !String(data.get("name") || "").trim())
      e.name = "Indiquez votre prénom.";
    if (signup && !String(data.get("lastName") || "").trim())
      e.lastName = "Indiquez votre nom.";
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") || "").trim())
    )
      e.email = "Saisissez une adresse e-mail valide.";
    if (String(data.get("password") || "").length < (signup ? 8 : 1))
      e.password = signup
        ? "Utilisez au moins 8 caractères."
        : "Saisissez votre mot de passe.";
    return e;
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const e = validate(data);
    setErrors(e);
    setError("");
    if (Object.keys(e).length) {
      (form.elements.namedItem(Object.keys(e)[0]) as HTMLElement)?.focus();
      return;
    }
    setBusy(true);
    const email = String(data.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(data.get("password") ?? "");
    try {
      const { error } = signup
        ? await authClient.signUp.email({
            name: String(data.get("name") ?? "").trim(),
            lastName: String(data.get("lastName") ?? "").trim(),
            email,
            password,
          })
        : await authClient.signIn.email({ email, password });

      if (!error) {
        window.location.replace("/account");
        return;
      }

      if (error.status === 429) {
        setError("Trop de tentatives. Réessayez dans quelques instants.");
      } else if (error.status >= 500) {
        setError("Service indisponible. Réessayez dans quelques instants.");
      } else {
        setError(
          signup
            ? "Impossible de créer ce compte. Vérifiez vos informations ou essayez de vous connecter."
            : "Adresse e-mail ou mot de passe incorrect.",
        );
      }
    } catch {
      setError("Service indisponible. Réessayez dans quelques instants.");
    }
    setBusy(false);
  }
  return (
    <main id="main" className="auth-layout">
      <aside className="auth-story">
        <Brand />
        <div>
          <h2>
            Votre prochain pas
            <br />
            commence ici.
          </h2>
          <p>Un espace pour comprendre Python, à votre rythme.</p>
        </div>
        <span>Comprendre. Essayer. Recommencer.</span>
      </aside>
      <section className="auth-main">
        <Link href="/" className="back-link">
          <ArrowLeft size={17} aria-hidden="true" />
          Retour à l’accueil
        </Link>
        <div className="auth-form-wrap">
          <h1>
            {signup ? "Faisons connaissance." : "Heureux de vous revoir."}
          </h1>
          <p className="intro">
            {signup
              ? "Préparez votre espace d’apprentissage Python."
              : "Retrouvez votre parcours Python."}
          </p>
          <form
            method="post"
            noValidate
            onSubmit={submit}
            onBlur={(e) => {
              if (e.target instanceof HTMLInputElement) {
                const name = e.target.name;
                const all = validate(new FormData(e.currentTarget));
                setErrors((old) => ({ ...old, [name]: all[name] || "" }));
              }
            }}
            onChange={(e) => {
              setError("");
              if (e.target instanceof HTMLInputElement) {
                const name = e.target.name;
                if (errors[name]) {
                  const all = validate(new FormData(e.currentTarget));
                  setErrors((old) => ({ ...old, [name]: all[name] || "" }));
                }
              }
            }}
          >
            {signup && (
              <>
                <div className="field">
                  <label htmlFor="name">
                    Prénom <span>(obligatoire)</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="given-name"
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby="name-help"
                  />
                  <p id="name-help" className="field-help">
                    {errors.name || "Pour vous accueillir dans votre espace."}
                  </p>
                </div>
                <div className="field">
                  <label htmlFor="lastName">
                    Nom <span>(obligatoire)</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    aria-required="true"
                    aria-invalid={!!errors.lastName}
                    aria-describedby="last-name-help"
                  />
                  <p id="last-name-help" className="field-help">
                    {errors.lastName}
                  </p>
                </div>
              </>
            )}
            <div className="field">
              <label htmlFor="email">
                Adresse e-mail <span>(obligatoire)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby="email-help"
              />
              <p id="email-help" className="field-help">
                {errors.email || "Exemple : vous@universite.ma"}
              </p>
            </div>
            <div className="field">
              <label htmlFor="password">
                Mot de passe <span>(obligatoire)</span>
              </label>
              <div className="password-wrap">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete={signup ? "new-password" : "current-password"}
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby="password-help"
                />
                <button
                  type="button"
                  aria-label={
                    show
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  aria-pressed={show}
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              <p id="password-help" className="field-help">
                {errors.password ||
                  (signup
                    ? "Au moins 8 caractères."
                    : "Saisissez le mot de passe de votre compte.")}
              </p>
            </div>
            <button
              className="button full"
              type="submit"
              disabled={busy}
              aria-busy={busy}
            >
              {busy
                ? "Vérification…"
                : signup
                  ? "Créer mon compte"
                  : "Se connecter"}
            </button>
            <p className="form-error" role="status">
              {error}
            </p>
          </form>
          {!signup && (
            <p className="auth-switch">
              <Link href="/forgot-password">Mot de passe oublié ?</Link>
            </p>
          )}
          <p className="auth-switch">
            {signup ? "Déjà un compte ?" : "Première visite ?"}{" "}
            <Link href={signup ? "/sign-in" : "/sign-up"}>
              {signup ? "Se connecter" : "Créer un compte"}
            </Link>
          </p>
          <div className="preview-entry">
            <p>Vous souhaitez explorer le premier parcours ?</p>
            <Link href="/onboarding" className="text-link">
              Essayer le diagnostic sans compte
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
