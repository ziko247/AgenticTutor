import { account } from "@/features/auth/account";
import { loadDiagnostic } from "@/features/diagnostic/actions";
import { languages } from "@/lib/languages";
import { Practice } from "@/features/exercises/practice";
import { loadExercises } from "@/features/exercises/exercise-section";
import { loadActivity } from "@/features/exercises/activity";
import { ActivityOverview } from "@/features/exercises/activity-overview";
import { suggestedExplanation } from "@/features/exercises/styles";
import Link from "next/link";
export const metadata = { title: "Tableau de bord" };
export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ challenge?: string }>;
}) {
  const session = await account();
  if (!session) return null;
  const { profile } = session;
  const [{ attempt, error: diagnosticError }, activity, params] =
    await Promise.all([loadDiagnostic(), loadActivity(), searchParams]);
  const language = attempt?.completed
    ? (profile.preferred_language ?? attempt.language)
    : null;
  const bank = language ? await loadExercises(language) : [];
  const challengeIndex =
    activity && bank.length
      ? Math.floor(Date.parse(activity.today) / 86400000) % bank.length
      : 0;
  const challenge = bank[challengeIndex];
  const initialIndex =
    activity && params.challenge === activity.today ? challengeIndex : 0;
  const answered = attempt?.questions.filter(
    ({ id }) => attempt.answers[id] !== undefined,
  ).length;

  return (
    <main id="main" className="container dashboard-main">
      <div className="dashboard-intro">
        <h1>Votre espace d’apprentissage</h1>
      </div>

      {activity ? (
        <ActivityOverview
          activity={activity}
          challenge={challenge}
          unavailable={Boolean(
            diagnosticError || (attempt?.completed && !bank.length),
          )}
        />
      ) : (
        <p role="status">Statistiques temporairement indisponibles.</p>
      )}
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

      <section className="dashboard-upcoming" aria-labelledby="exercise-title">
        <h2 id="exercise-title" tabIndex={-1}>
          Exercices
        </h2>
        {diagnosticError ? (
          <p>Votre parcours est temporairement indisponible.</p>
        ) : attempt?.completed && attempt.score !== null ? (
          bank.length && language ? (
            <Practice
              key={language + initialIndex}
              exercises={bank}
              language={languages[language].label}
              languageCode={language}
              initialIndex={initialIndex}
              completed={activity?.completed ?? []}
              recommended={suggestedExplanation(attempt.score)}
            />
          ) : (
            <p>Exercices temporairement indisponibles.</p>
          )
        ) : (
          <p>
            Terminez votre diagnostic pour ouvrir les exercices de votre
            parcours.
          </p>
        )}
      </section>
    </main>
  );
}
