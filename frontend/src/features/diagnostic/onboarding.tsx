"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HardDrive,
  RotateCcw,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { languages, languageOrder } from "@/lib/languages";
import { emptyDraft, type Draft, type Answer, answerLabel } from "./storage";
import {
  startDiagnostic,
  saveDiagnostic,
  resetDiagnostic,
  type DiagnosticAttempt,
} from "./actions";
const emptyStatus = "Vos réponses seront enregistrées sur votre compte.";
const savedStatus = "Diagnostic enregistré sur votre compte.";

function isAnswered(answer: Answer | undefined): boolean {
  return answer !== undefined;
}

export function Onboarding({
  initialAttempt,
}: {
  initialAttempt: DiagnosticAttempt | null;
}) {
  const [attempt, setAttempt] = useState(initialAttempt);
  const draft = attempt ?? emptyDraft;
  const [saving, setSaving] = useState(false);
  const [storage, setStorage] = useState(
    initialAttempt ? savedStatus : emptyStatus,
  );
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef(false);
  const active = useRef(false);
  const requestId = useRef<{ id: string; language: string } | null>(null);
  useEffect(() => {
    if (focusNext.current && !saving) {
      heading.current?.focus();
      focusNext.current = false;
    }
  }, [draft, saving]);
  async function persist(next: Draft): ReturnType<typeof saveDiagnostic> {
    if (!next.language && attempt)
      return resetDiagnostic(attempt.id, attempt.revision);
    else if (next.language && !attempt) {
      if (requestId.current?.language !== next.language)
        requestId.current = {
          id: crypto.randomUUID(),
          language: next.language,
        };
      return startDiagnostic(next.language, requestId.current.id);
    } else if (attempt)
      return saveDiagnostic(attempt.id, {
        revision: attempt.revision,
        step: next.step,
        review: next.review,
        answers: next.answers,
        complete: next.completed,
      });
    return { attempt: null };
  }
  async function update(next: Draft, focus = true) {
    if (active.current) return;
    active.current = true;
    setSaving(true);
    if (!focus && attempt) setAttempt({ ...attempt, answers: next.answers });
    setError("");
    setStorage("Enregistrement en cours…");
    const result = await persist(next).catch(() => ({
      error: "Enregistrement indisponible. Réessayez dans un instant.",
      attempt: undefined,
    }));
    if (result.error) {
      setAttempt(attempt);
      setError(result.error);
      setStorage("Modification non enregistrée.");
    } else {
      if (!next.language) requestId.current = null;
      setAttempt(result.attempt ?? null);
      setStorage(next.language ? savedStatus : emptyStatus);
      focusNext.current = focus;
    }
    active.current = false;
    setSaving(false);
  }
  const questions = attempt?.questions ?? [];
  const languageLabel = draft.language ? languages[draft.language].label : "";
  const q = questions[draft.step];
  const isSelected = (index: number) => {
    const a = draft.answers[q.id];
    return a === index;
  };
  const count = questions.filter((q) => isAnswered(draft.answers[q.id])).length;
  const scored = questions.filter((q) => q.kind === "technical");
  const correct = attempt?.correct_count ?? 0;
  return (
    <>
      <header className="flow-header container">
        <Brand href="/dashboard" />
        <Link href="/dashboard" className="text-link">
          Quitter le diagnostic
        </Link>
      </header>
      <main id="main" className="flow-layout container">
        <aside className="flow-sidebar">
          <p className="flow-title">Votre point de départ.</p>
          <p>
            Un diagnostic dans votre langage, une note sur 20 pour vous situer.
          </p>
          <ol className="chapter-list">
            <li
              className={
                draft.step < 6 && !draft.review && !draft.completed
                  ? "current"
                  : ""
              }
            >
              Votre façon d’apprendre
            </li>
            <li
              className={
                draft.step >= 6 && !draft.review && !draft.completed
                  ? "current"
                  : ""
              }
            >
              Votre diagnostic {languageLabel}
            </li>
            <li className={draft.review || draft.completed ? "current" : ""}>
              Votre récapitulatif
            </li>
          </ol>
          <div className="storage-note">
            <HardDrive size={19} aria-hidden="true" />
            <p role="status">{storage}</p>
          </div>
        </aside>
        <section className="flow-content" inert={saving} aria-busy={saving}>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {!draft.language ? (
            <>
              <h1 ref={heading} tabIndex={-1}>
                Quel langage souhaitez-vous apprendre ?
              </h1>
              <p className="intro">
                Choisissez votre parcours. Après quelques questions de profil,
                10 questions évaluent vos bases. Chaque bonne réponse vaut 2
                points sur 20.
              </p>
              <div className="diagnostic-language-grid">
                {languageOrder.map((language) => (
                  <button
                    type="button"
                    className="button quiet"
                    key={language}
                    onClick={() =>
                      update({ ...emptyDraft, answers: {}, language })
                    }
                  >
                    {languages[language].label}
                  </button>
                ))}
              </div>
            </>
          ) : draft.completed ? (
            <>
              <div className="completion-symbol">
                <Check size={32} aria-hidden="true" />
              </div>
              <h1 ref={heading} tabIndex={-1}>
                Un premier pas,
                <br />
                déjà accompli.
              </h1>
              <p className="intro">
                Votre diagnostic est enregistré sur votre compte. Le tutorat
                personnalisé sera disponible dans une prochaine version.
              </p>
              <div className="summary-line">
                <strong>{attempt?.score ?? 0} / 20</strong>
                <span>
                  Note de votre diagnostic {languageLabel} : {correct} bonnes
                  réponses sur {scored.length}. Ce résultat ne certifie pas
                  votre niveau.
                </span>
              </div>
              <dl className="profile-summary">
                {questions
                  .filter((q) => q.kind === "profile")
                  .map((q) => (
                    <div key={q.id}>
                      <dt>{q.title}</dt>
                      <dd>{answerLabel(q.options, draft.answers[q.id])}</dd>
                    </div>
                  ))}
              </dl>
              <div className="flow-buttons">
                <button
                  className="button"
                  type="button"
                  onClick={() =>
                    update({ ...draft, completed: false, review: true })
                  }
                >
                  Revoir mes réponses
                </button>
                <Link href="/dashboard" className="text-link">
                  Retour à mon espace
                </Link>
              </div>
              <button
                className="text-button reset"
                type="button"
                onClick={() => update({ ...emptyDraft, answers: {} })}
              >
                <RotateCcw size={16} aria-hidden="true" />
                Recommencer le diagnostic
              </button>
            </>
          ) : draft.review ? (
            <>
              <h1 ref={heading} tabIndex={-1}>
                Tout vous ressemble ?
              </h1>
              <p className="intro">
                Relisez vos réponses avant de terminer. Vous pouvez encore tout
                modifier.
              </p>
              <p className="caption">
                Diagnostic {languageLabel}. Les questions de profil ne sont pas
                notées.
              </p>
              <ol className="review-list">
                {questions.map((q, i) => (
                  <li key={q.id}>
                    <div>
                      <span>
                        {i + 1}. {q.title}
                      </span>
                      <strong>
                        {answerLabel(q.options, draft.answers[q.id])}
                      </strong>
                    </div>
                    <button
                      className="text-button"
                      type="button"
                      aria-label={"Modifier la réponse " + (i + 1)}
                      onClick={() =>
                        update({ ...draft, step: i, review: false })
                      }
                    >
                      Modifier
                    </button>
                  </li>
                ))}
              </ol>
              <div className="flow-buttons">
                <button
                  className="button quiet"
                  type="button"
                  onClick={() =>
                    update({
                      ...draft,
                      review: false,
                      step: questions.length - 1,
                    })
                  }
                >
                  Retour
                </button>
                <button
                  className="button"
                  type="button"
                  onClick={() =>
                    update({ ...draft, completed: true, review: false })
                  }
                >
                  Terminer le diagnostic
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="progress-label">
                <span>
                  Question {draft.step + 1} sur {questions.length}
                </span>
                <span>
                  {count} réponse{count > 1 ? "s" : ""} renseignée
                  {count > 1 ? "s" : ""}
                </span>
              </div>
              <progress
                value={draft.step + 1}
                max={questions.length}
                aria-label="Progression du questionnaire"
              />
              <h1 ref={heading} tabIndex={-1}>
                {q.title}
              </h1>
              <p className="question-helper">
                {draft.step < 6
                  ? "Choisissez la réponse qui vous correspond le mieux."
                  : "Vous découvrez ? « Je ne sais pas encore » est une réponse utile."}
              </p>
              {q.code && (
                <pre className="question-code">
                  <code>{q.code}</code>
                </pre>
              )}
              <fieldset className="answer-options">
                <legend className="sr-only">{q.title}</legend>
                {q.options.map((option, i) => (
                  <label
                    key={option}
                    className={isSelected(i) ? "option selected" : "option"}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={i}
                      checked={isSelected(i)}
                      onChange={() => {
                        update(
                          {
                            ...draft,
                            answers: { ...draft.answers, [q.id]: i },
                          },
                          false,
                        );
                      }}
                    />
                    <span>{option}</span>
                    {isSelected(i) && <Check size={18} aria-hidden="true" />}
                  </label>
                ))}
              </fieldset>
              <div className="flow-buttons">
                <button
                  type="button"
                  className="button quiet"
                  disabled={draft.step === 0}
                  onClick={() => update({ ...draft, step: draft.step - 1 })}
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                  Précédent
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    if (!isAnswered(draft.answers[q.id])) {
                      setError("Choisissez une réponse pour continuer.");
                      return;
                    }
                    update({
                      ...draft,
                      step: Math.min(questions.length - 1, draft.step + 1),
                      review: draft.step === questions.length - 1,
                    });
                  }}
                >
                  {draft.step === questions.length - 1
                    ? "Vérifier mes réponses"
                    : "Continuer"}
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
              <div className="diagnostic-secondary-actions">
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Changer de langage démarre un nouveau diagnostic. Continuer ?",
                      )
                    )
                      update({ ...emptyDraft, answers: {} });
                  }}
                >
                  Changer de langage
                </button>
                {count === questions.length && (
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => update({ ...draft, review: true })}
                  >
                    Revenir au récapitulatif
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
