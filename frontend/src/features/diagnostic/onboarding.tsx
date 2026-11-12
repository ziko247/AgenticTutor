/* eslint-disable react-hooks/set-state-in-effect -- Hydrate a validated browser-only draft after server rendering. */
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
import { questions } from "./questions";
import {
  emptyDraft,
  parseDraft,
  STORAGE_KEY,
  type Draft,
  answerLabel,
} from "./storage";
export function Onboarding() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [storage, setStorage] = useState(
    "Préparation de la sauvegarde locale…",
  );
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef(false);
  useEffect(() => {
    try {
      setDraft(parseDraft(localStorage.getItem(STORAGE_KEY)));
      setStorage("Réponses enregistrées sur cet appareil uniquement.");
    } catch {
      setStorage("Sauvegarde locale indisponible. Gardez cette page ouverte.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setStorage("Réponses enregistrées sur cet appareil uniquement.");
    } catch {
      setStorage("Sauvegarde locale indisponible. Gardez cette page ouverte.");
    }
    if (focusNext.current) {
      heading.current?.focus();
      focusNext.current = false;
    }
  }, [draft, ready]);
  function update(next: Draft) {
    focusNext.current = true;
    setError("");
    setDraft(next);
  }
  if (!ready)
    return (
      <main id="main" className="container flow-loading" role="status">
        Préparation de votre parcours…
      </main>
    );
  const q = questions[draft.step];
  const isSelected = (index: number) => {
    const a = draft.answers[q.id];
    return Array.isArray(a) ? a.includes(index) : a === index;
  };
  const count = questions.filter((q) => {
    const a = draft.answers[q.id];
    return a !== undefined && (!Array.isArray(a) || a.length > 0);
  }).length;
  const scored = questions.filter((q) => q.correct !== undefined);
  const correct = scored.filter(
    (q) => draft.answers[q.id] === q.correct,
  ).length;
  return (
    <>
      <header className="flow-header container">
        <Brand />
        <Link href="/" className="text-link">
          Quitter le diagnostic
        </Link>
      </header>
      <main id="main" className="flow-layout container">
        <aside className="flow-sidebar">
          <p className="flow-title">Votre point de départ.</p>
          <p>
            Pas de note officielle. Un premier repère pour apprendre Python.
          </p>
          <ol className="chapter-list">
            <li
              className={
                (draft.step < 6 || q.multiple) &&
                !draft.review &&
                !draft.completed
                  ? "current"
                  : ""
              }
            >
              Votre façon d’apprendre
            </li>
            <li
              className={
                draft.step >= 6 &&
                !q.multiple &&
                !draft.review &&
                !draft.completed
                  ? "current"
                  : ""
              }
            >
              Quelques bases de Python
            </li>
            <li className={draft.review || draft.completed ? "current" : ""}>
              Votre récapitulatif
            </li>
          </ol>
          <div className="storage-note">
            <HardDrive size={19} aria-hidden="true" />
            <p role="status">{storage}</p>
          </div>
          <p className="caption muted">
            Aucun compte nécessaire. Aucune réponse envoyée à un serveur.
          </p>
        </aside>
        <section className="flow-content">
          {draft.completed ? (
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
                Votre diagnostic est terminé sur cet appareil. Le tutorat
                personnalisé sera disponible après connexion du backend.
              </p>
              <div className="summary-line">
                <strong>
                  {correct} / {scored.length}
                </strong>
                <span>
                  réponses Python correctes sur ce questionnaire de découverte.
                  Ce résultat ne certifie pas votre niveau.
                </span>
              </div>
              <dl className="profile-summary">
                {questions
                  .filter((q) => q.correct === undefined)
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
                <Link href="/" className="text-link">
                  Retour à l’accueil
                </Link>
              </div>
              <button
                className="text-button reset"
                type="button"
                onClick={() => update({ ...emptyDraft, answers: {} })}
              >
                <RotateCcw size={16} aria-hidden="true" />
                Effacer et recommencer
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
                {q.description ??
                  (draft.step < 6
                    ? "Choisissez la réponse qui vous correspond le mieux."
                    : "Vous découvrez ? « Je ne sais pas encore » est une réponse utile.")}
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
                      type={q.multiple ? "checkbox" : "radio"}
                      name={q.id}
                      value={i}
                      checked={isSelected(i)}
                      onChange={() => {
                        setError("");
                        setDraft({
                          ...draft,
                          answers: {
                            ...draft.answers,
                            [q.id]: q.multiple
                              ? (() => {
                                  const a = draft.answers[q.id];
                                  const selected = Array.isArray(a) ? a : [];
                                  const unsure = q.options.length - 1;
                                  if (i === unsure)
                                    return selected.includes(i) ? [] : [i];
                                  return selected.includes(i)
                                    ? selected.filter((v) => v !== i)
                                    : [
                                        ...selected.filter((v) => v !== unsure),
                                        i,
                                      ];
                                })()
                              : i,
                          },
                        });
                      }}
                    />
                    <span>{option}</span>
                    {isSelected(i) && <Check size={18} aria-hidden="true" />}
                  </label>
                ))}
              </fieldset>
              <p className="form-error" role="alert">
                {error}
              </p>
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
                    if (
                      draft.answers[q.id] === undefined ||
                      (Array.isArray(draft.answers[q.id]) &&
                        (draft.answers[q.id] as number[]).length === 0)
                    ) {
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
              {count === questions.length && (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => update({ ...draft, review: true })}
                >
                  Revenir au récapitulatif
                </button>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}
