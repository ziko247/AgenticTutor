import { authClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { profileRequest, signOut } from "@/features/auth/actions";
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
  const client = await authClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) redirect("/sign-in");
  let response = await profileRequest("GET");
  if (response.status === 404)
    response = await profileRequest("PUT", {
      display_name: String(user.user_metadata.display_name || "Étudiant")
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

  return (
    <>
      <header className="dashboard-header">
        <div className="container dashboard-header-inner">
          <Brand />
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
            <h2 id="diagnostic-title">Faisons le point sur vos acquis.</h2>
            <p>
              Choisissez un langage et passez le diagnostic pour situer votre
              niveau.
            </p>
          </div>
          <Link href="/onboarding" className="button">
            Accéder au diagnostic
          </Link>
        </section>

        <section
          className="dashboard-upcoming"
          aria-labelledby="learning-title"
        >
          <h2 id="learning-title">Votre parcours</h2>
          <p>
            Les activités guidées et le suivi de progression seront ajoutés dans
            une prochaine version.
          </p>
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
          Votre profil est enregistré sur votre compte. Les réponses au
          diagnostic restent pour le moment dans ce navigateur.
        </p>
      </main>
    </>
  );
}
