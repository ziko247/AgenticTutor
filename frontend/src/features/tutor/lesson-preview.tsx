"use client";
import { useState } from "react";
import { Lightbulb, Check } from "lucide-react";
export function LessonPreview() {
  const [hint, setHint] = useState(false);
  const [answer, setAnswer] = useState(false);
  return (
    <div
      className="lesson"
      data-slot="python-example"
      data-kind="product"
      data-alt="Exemple interactif de lecture d'une boucle Python"
    >
      <div className="lesson-heading">
        <span>Un petit pas en Python</span>
        <span>Les boucles</span>
      </div>
      <p className="lesson-question">Que va afficher ce programme ?</p>
      <pre>
        <code>
          <span className="code-key">for</span> nombre{" "}
          <span className="code-key">in</span> range(3):{"\n"} print(nombre)
        </code>
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
              <strong>0, 1, puis 2.</strong> La borne 3 est exclue.
            </p>
          </>
        ) : hint ? (
          <>
            <Lightbulb size={19} aria-hidden="true" />
            <p>Le comptage commence à 0. La borne finale est exclue.</p>
          </>
        ) : (
          <p>Comprendre le raisonnement, pas seulement trouver la réponse.</p>
        )}
      </div>
      <p className="caption">
        Exemple guidé prédéfini, sans réponse générée par IA.
      </p>
    </div>
  );
}
