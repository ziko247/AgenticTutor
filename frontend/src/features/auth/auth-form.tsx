"use client";
import { useState } from "react";
import Link from "next/link";
import { authenticate, signInWithGoogle } from "./actions";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const signup = mode === "sign-up";
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const e: Record<string, string> = {};
    if (signup && !String(data.get("name") || "").trim())
      e.name = "Indiquez votre prénom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") || "")))
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
    const e = validate(form);
    setErrors(e);
    setGoogleError("");
    setError("");
    if (Object.keys(e).length) {
      (form.elements.namedItem(Object.keys(e)[0]) as HTMLElement)?.focus();
      return;
    }
    setBusy(true);
    try {
      const result = await authenticate(mode, new FormData(form));
      if (result.success) {
        router.replace("/dashboard");
        router.refresh();
      } else setError(result.error || result.message || "");
    } catch {
      setError("Service indisponible. Réessayez plus tard.");
    }
    setBusy(false);
  }
  async function googleSignIn() {
    setGoogleError("");
    setError("");
    setGoogleBusy(true);
    try {
      const result = await signInWithGoogle();
      if (result.url) {
        window.location.assign(result.url);
        return;
      }
      setGoogleError(result.error || "Connexion Google indisponible.");
    } catch {
      setGoogleError("Connexion Google indisponible. Réessayez.");
    }
    setGoogleBusy(false);
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
          <p>Un espace pour comprendre la programmation, à votre rythme.</p>
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
              ? "Préparez votre espace d’apprentissage de la programmation."
              : "Retrouvez votre parcours de la programmation."}
          </p>
          <button
            type="button"
            className="button full"
            disabled={busy || googleBusy}
            aria-busy={googleBusy}
            onClick={googleSignIn}
          >
            {googleBusy ? "Ouverture de Google…" : "Continuer avec Google"}
          </button>
          {googleError && (
            <p className="form-error" role="alert">
              {googleError}
            </p>
          )}
          <div className="auth-method-divider">ou par e-mail</div>
          <form
            noValidate
            data-endpoint=""
            onSubmit={submit}
            onBlur={(e) => {
              if (e.target instanceof HTMLInputElement) {
                const name = e.target.name;
                const all = validate(e.currentTarget);
                setErrors((old) => ({ ...old, [name]: all[name] || "" }));
              }
            }}
            onChange={(e) => {
              setError("");
              if (e.target instanceof HTMLInputElement) {
                const name = e.target.name;
                if (errors[name]) {
                  const all = validate(e.currentTarget);
                  setErrors((old) => ({ ...old, [name]: all[name] || "" }));
                }
              }
            }}
          >
            {signup && (
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
                    : "Saisissez votre mot de passe.")}
              </p>
            </div>
            <button
              className="button full"
              type="submit"
              disabled={busy || googleBusy}
              aria-busy={busy}
            >
              {busy
                ? "Vérification des champs…"
                : signup
                  ? "Créer mon compte"
                  : "Se connecter"}
            </button>
            <p className="form-error" role="status">
              {error}
            </p>
          </form>
          <p className="auth-switch">
            {signup ? "Déjà un compte ?" : "Première visite ?"}{" "}
            <Link href={signup ? "/sign-in" : "/sign-up"}>
              {signup ? "Se connecter" : "Créer un compte"}
            </Link>
          </p>
          {!signup && (
            <Link href="/forgot-password" className="text-link">
              Mot de passe oublié ?
            </Link>
          )}
          <div className="preview-entry">
            <p>Vous souhaitez explorer le premier parcours ?</p>
            <Link href="/onboarding" className="text-link">
              Accéder au diagnostic
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
