"use client";
import { useState } from "react";
import { examples, type Language } from "./examples";
import { LanguageSelect } from "./language-select";
export function WorkedExample() {
  const [language, setLanguage] = useState<Language>("python");
  const example = examples[language];
  return (
    <section id="exemple" className="section worked-section">
      <div className="container">
        <div className="worked-heading">
          <h2>
            Du code.
            <br />
            Un raisonnement à suivre.
          </h2>
          <p>Un exemple de lecture de code, expliqué sans sauter d’étape.</p>
        </div>
        <div className="worked-toolbar">
          <LanguageSelect
            id="worked-language"
            value={language}
            onChange={setLanguage}
          />
        </div>
        <div className="worked-example">
          <div className="worked-code">
            <span className="example-file">{example.file}</span>
            <pre>
              <code>{example.worked.code}</code>
            </pre>
            <div className="example-output">
              <span>{example.worked.outputLabel}</span>
              <strong>{example.worked.output}</strong>
            </div>
          </div>
          <ol className="reasoning-list">
            {example.worked.steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="example-disclosure">
          Lisez le code, suivez le raisonnement, puis réutilisez la notion dans
          votre prochain exercice.
        </p>
      </div>
    </section>
  );
}
