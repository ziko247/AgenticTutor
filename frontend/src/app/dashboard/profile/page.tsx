import { account } from "@/features/auth/account";
import { ProfileForm } from "@/features/auth/profile-form";
import {
  loadLatestResult,
  loadDiagnostic,
} from "@/features/diagnostic/actions";
import { languages } from "@/lib/languages";
import Link from "next/link";
export const metadata = { title: "Mon profil" };
export default async function Profile() {
  const session = await account();
  if (!session) return null;
  const { user, profile } = session;
  const [latest, current] = await Promise.all([
    loadLatestResult(),
    loadDiagnostic(),
  ]);
  const attempt = latest.attempt;
  const answers = current.attempt ?? attempt;
  return (
    <main id="main" className="container dashboard-main profile-page">
      <Link href="/dashboard">Retour au tableau de bord</Link>
      <h1>Mon profil</h1>
      <dl className="profile-summary">
        <div>
          <dt>Adresse e-mail</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Inscription</dt>
          <dd>
            {new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "long",
              timeZone: "Africa/Casablanca",
            }).format(new Date(user.created_at))}
          </dd>
        </div>
        <div>
          <dt>Dernier diagnostic terminé</dt>
          <dd>
            {latest.error
              ? "Résultat indisponible"
              : attempt
                ? languages[attempt.language].label +
                  " · " +
                  attempt.score +
                  " / 20"
                : "Aucun résultat pour le moment"}
          </dd>
        </div>
        {answers?.questions
          .filter(
            (q) => q.kind === "profile" && answers.answers[q.id] !== undefined,
          )
          .map((q) => (
            <div key={q.id}>
              <dt>{q.title}</dt>
              <dd>{q.options[answers.answers[q.id]]}</dd>
            </div>
          ))}
      </dl>
      <section className="dashboard-upcoming">
        <h2>Mes informations</h2>
        <ProfileForm
          name={profile.display_name}
          language={profile.preferred_language}
          revision={profile.revision}
        />
      </section>
    </main>
  );
}
