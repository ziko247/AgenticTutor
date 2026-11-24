"use client";

import { useState } from "react";
import { explanationLabels, type Explanation } from "./styles";

export type Exercise = Record<Explanation, string> & {
  id: string;
  title: string;
  prompt: string;
  code: string;
  hint: string;
  answer: string;
};

export function Practice({
  exercises,
  recommended,
  language,
}: {
  exercises: Exercise[];
  recommended: Explanation;
  language: string;
}) {
  const [index, setIndex] = useState(0);
  const [style, setStyle] = useState(recommended);
  const exercise = exercises[index];
  return (
    <div className="practice">
      <div className="practice-controls">
        <label>
          Exercice en {language}
          <select
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
          >
            {exercises.map((item, i) => (
              <option key={item.id} value={i}>
                {i + 1}. {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Style d’explication
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as Explanation)}
          >
            {Object.entries(explanationLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
                {key === recommended ? " (suggéré)" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div key={exercise.id} className="practice-sheet">
        <h3>{exercise.title}</h3>
        <p>{exercise.prompt}</p>
        <pre className="question-code">
          <code>{exercise.code}</code>
        </pre>
        <label className="field">
          Votre réponse
          <input type="text" autoComplete="off" />
        </label>
        <details>
          <summary>Lire un indice</summary>
          <p>{exercise.hint}</p>
        </details>
        <details>
          <summary>Comparer avec la correction</summary>
          <p>
            <strong>{exercise.answer}</strong>
          </p>
          <p aria-live="polite">{exercise[style]}</p>
        </details>
      </div>
    </div>
  );
}
