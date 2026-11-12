"use client";
import { useState } from "react";
import { Lightbulb, Check } from "lucide-react";
import { examples, type Language } from "./examples";
import { LanguageSelect } from "./language-select";
export function LessonPreview() {
  const [language, setLanguage] = useState<Language>("python");
  const example = examples[language];
  const [hint, setHint] = useState(false);
  const [answer, setAnswer] = useState(false);
  return (
    <div
      className="lesson"
      data-slot="python-example"
      data-kind="product"
      data-alt={"Exemple interactif en " + example.label}
    >
      <div className="lesson-heading">
        <span>Un petit pas en {example.label}</span>
        <LanguageSelect
          id="lesson-language"
          value={language}
          onChange={(next) => {
            setLanguage(next);
            setHint(false);
            setAnswer(false);
          }}
        />
      </div>
      <p className="lesson-question">{example.lesson.question}</p>
      <pre>
        <code>{example.lesson.code}</code>
      </pre>
      <div className="lesson-actions">
        <button
          type="button"
          className="text-button"
          onClick={() => setHint(!hint)}
          aria-expanded={hint}
        >
          <Lightbulb size={17} aria-hidden="true" />
          {hint ? "Masquer l’indice" : "Un indice, s’il vous plaît"}
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => setAnswer(!answer)}
          aria-expanded={answer}
        >
          {answer ? "Masquer le résultat" : "Voir le résultat"}
        </button>
      </div>
      <div className="lesson-feedback" aria-live="polite">
        {answer ? (
          <>
            <Check size={19} aria-hidden="true" />
            <p>
              <strong>{example.lesson.result}</strong> {example.lesson.detail}
            </p>
          </>
        ) : hint ? (
          <>
            <Lightbulb size={19} aria-hidden="true" />
            <p>{example.lesson.hint}</p>
          </>
        ) : (
          <p>Comprendre le raisonnement, pas seulement trouver la réponse.</p>
        )}
      </div>
      <p className="caption">
        Explorez {example.label} avec un indice et sa correction.
      </p>
    </div>
  );
}
