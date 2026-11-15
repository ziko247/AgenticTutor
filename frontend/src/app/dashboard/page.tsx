import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/brand";
import "@/styles/dashboard.css";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description:
    "Votre espace pour commencer le diagnostic et préparer votre apprentissage.",
};

export default function DashboardPage() {
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

        <p className="dashboard-notice">
          Espace de démonstration : aucun compte n’a été créé. Les réponses au
          diagnostic restent dans ce navigateur.
        </p>
      </main>
    </>
  );
}
