import { verifiedUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { profileRequest, signOut } from "@/features/auth/actions";
import { loadDiagnostic } from "@/features/diagnostic/actions";
import { languages } from "@/lib/languages";
import { ProfileForm } from "@/features/auth/profile-form";
import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/brand";
import "@/styles/dashboard.css";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description:
    "Votre espace pour commencer le diagnostic et préparer votre apprentissage.",
};

export default async function DashboardPage() {
  const {
    data: { user },
    error,
  } = await verifiedUser();
  if (error && (!error.status || error.status >= 500 || error.status === 429))
    return (
      <main id="main" className="container dashboard-main">
        <h1>Service temporairement indisponible</h1>
        <p>
          La connexion est momentanément indisponible. Rechargez la page pour
          réessayer.
        </p>
      </main>
    );
  if (error || !user) redirect("/sign-in");
  let response = await profileRequest("GET");
  if (response.status === 404)
    response = await profileRequest("PUT", {
      display_name: String(
        user.user_metadata.display_name ||
          user.user_metadata.full_name ||
          "Étudiant",
      )
        .trim()
        .slice(0, 80),
      preferred_language: null,
    });
  if (!response.ok)
    return (
      <main id="main" className="container dashboard-main">
        <h1>Votre espace</h1>
        <p>
          Le profil est temporairement indisponible. Rechargez la page pour
          réessayer.
        </p>
        <form action={signOut}>
          <button className="button">Se déconnecter</button>
        </form>
      </main>
    );
  const profile = await response.json();
  const { attempt, error: diagnosticError } = await loadDiagnostic();
  const answered = attempt?.questions.filter(
    ({ id }) => attempt.answers[id] !== undefined,
  ).length;

  return (
    <>
      <header className="dashboard-header">
        <div className="container dashboard-header-inner">
          <Brand href="/dashboard" />
          <nav aria-label="Navigation de l’espace">
            <Link href="/dashboard" aria-current="page">
              Tableau de bord
            </Link>
            <Link href="/onboarding">Diagnostic</Link>
            <form action={signOut}>
              <button type="submit" className="text-button">
                Se déconnecter
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main id="main" className="container dashboard-main">
        <div className="dashboard-intro">
          <h1>Votre espace d’apprentissage</h1>
          <p>Un point de départ pour apprendre à votre rythme.</p>
        </div>

        <section className="dashboard-start" aria-labelledby="diagnostic-title">
          <div>
            <h2 id="diagnostic-title">
              {attempt
                ? "Votre diagnostic " + languages[attempt.language].label
                : "Faisons le point sur vos acquis."}
            </h2>
            {diagnosticError ? (
              <p>
                Le statut de votre diagnostic est temporairement indisponible.
              </p>
            ) : attempt?.completed ? (
              <p>Diagnostic terminé. Votre résultat : {attempt.score} / 20.</p>
            ) : attempt ? (
              <p>
                {answered} réponse{answered === 1 ? "" : "s"} sur{" "}
                {attempt.questions.length}. Vous pouvez reprendre où vous en
                étiez.
              </p>
            ) : (
              <p>
                Choisissez un langage et passez le diagnostic pour situer votre
                niveau.
              </p>
            )}
          </div>
          <Link href="/onboarding" className="button">
            {diagnosticError
              ? "Accéder au diagnostic"
              : attempt?.completed
                ? "Voir mon résultat"
                : attempt
                  ? "Reprendre le diagnostic"
                  : "Commencer le diagnostic"}
          </Link>
        </section>

        <section className="dashboard-upcoming" aria-labelledby="profile-title">
          <h2 id="profile-title">Mon profil</h2>
          <ProfileForm
            name={profile.display_name}
            language={profile.preferred_language}
            revision={profile.revision}
          />
        </section>
        <p className="dashboard-notice">
          Votre profil et votre diagnostic sont enregistrés sur votre compte.
        </p>
      </main>
    </>
  );
}
