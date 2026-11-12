import Link from "next/link";
import {
  BookOpen,
  Code2,
  Compass,
  CornerDownRight,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { Header, Brand } from "@/components/brand";
import { LessonPreview } from "@/features/tutor/lesson-preview";

const topics = [
  {
    name: "Variables",
    code: "message = 'bonjour'",
    description:
      "Donner un nom à une valeur, manipuler du texte et des nombres.",
    outcome: "Lire et modifier vos premières données.",
  },
  {
    name: "Conditions",
    code: "if score >= 10:",
    description: "Comparer des valeurs et choisir ce que fait votre programme.",
    outcome: "Écrire un programme qui prend une décision.",
  },
  {
    name: "Boucles",
    code: "for n in range(3):",
    description: "Répéter une action et parcourir une suite de valeurs.",
    outcome: "Automatiser ce que vous faisiez à la main.",
  },
  {
    name: "Fonctions",
    code: "def saluer(nom):",
    description:
      "Regrouper des instructions, utiliser des paramètres et renvoyer un résultat.",
    outcome: "Organiser et réutiliser votre code.",
  },
  {
    name: "Listes",
    code: "notes = [12, 15, 18]",
    description:
      "Rassembler plusieurs valeurs, les retrouver et les transformer.",
    outcome: "Travailler avec une collection de données.",
  },
];

export default function Home() {
  return (
    <div className="landing">
      <Header />
      <main id="main">
        <div className="landing-opening">
          <section className="hero container">
            <div className="introduction">
              <h1>
                Programmer, une étape
                <br />à la fois.
              </h1>
              <p>
                Votre tuteur IA adapte explications et exercices à votre niveau.
              </p>
              <div className="hero-actions">
                <Link className="button" href="/sign-up">
                  Préparer mon parcours
                </Link>
                <a className="text-link" href="#approche">
                  Découvrir l’approche
                </a>
              </div>
            </div>
            <LessonPreview />
          </section>

          <div
            className="learning-rail container"
            aria-label="Les principes du parcours"
          >
            <span>
              <BookOpen size={20} aria-hidden="true" />
              Comprendre les bases
            </span>
            <span>
              <Code2 size={20} aria-hidden="true" />
              Apprendre en essayant
            </span>
            <span>
              <Compass size={20} aria-hidden="true" />
              Trouver son point de départ
            </span>
          </div>
        </div>
        <div className="landing-content">
          <section id="approche" className="section approach-surface">
            <div className="container approach-grid">
              <div>
                <h2>
                  Vous bloquez ?<br />
                  C’est là qu’on apprend.
                </h2>
                <p className="section-intro">
                  Un résultat inattendu n’est pas une impasse. C’est une
                  occasion de revenir au raisonnement.
                </p>
                <a className="text-link" href="#exemple">
                  Lire un exemple expliqué
                </a>
              </div>
              <div className="approach-list">
                <article>
                  <h3>Une explication qui vous parle</h3>
                  <p>
                    Posez votre question. Le tuteur explique, reformule et
                    illustre avec du code, en tenant compte de votre objectif.
                  </p>
                </article>
                <article>
                  <h3>Un indice avant la solution</h3>
                  <p>
                    Cherchez à votre rythme : un indice, une nouvelle tentative,
                    puis une correction qui explique votre erreur.
                  </p>
                </article>
                <article>
                  <h3>Vos réponses orientent la suite</h3>
                  <p>
                    Le tuteur choisit la prochaine activité : revenir à un
                    prérequis, consolider une notion ou augmenter la difficulté.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section id="programme" className="section curriculum">
            <div className="container">
              <div className="curriculum-header">
                <h2>
                  Votre langage.
                  <br />
                  Votre prochaine étape.
                </h2>
                <p>
                  Du premier programme au projet personnel, construisez des
                  bases solides dans les langages et technologies qui vous
                  intéressent.
                </p>
              </div>
              <div className="language-availability">
                <div>
                  <h3>Algorithmique et développement</h3>
                  <p>Python, C, C++, C#, Java, Go et Rust.</p>
                </div>
                <div>
                  <h3>Web et bases de données</h3>
                  <p>HTML, CSS, JavaScript et MySQL.</p>
                </div>
              </div>
              <div className="curriculum-index">
                {topics.map((topic, i) => (
                  <article className="curriculum-row" key={topic.name}>
                    <span className="topic-number" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{topic.name}</h3>
                      <p>{topic.description}</p>
                    </div>
                    <code>{topic.code}</code>
                    <p className="topic-outcome">{topic.outcome}</p>
                  </article>
                ))}
              </div>
              <p className="curriculum-note">
                Les fondamentaux en pratique, illustrés ici en Python.
              </p>
            </div>
          </section>

          <section id="exemple" className="section worked-section">
            <div className="container">
              <div className="worked-heading">
                <h2>
                  Trois lignes.
                  <br />
                  Un raisonnement à suivre.
                </h2>
                <p>
                  Un exemple de lecture de code, expliqué sans sauter d’étape.
                </p>
              </div>
              <div className="worked-example">
                <div className="worked-code">
                  <span className="example-file">exemple_boucle.py</span>
                  <pre>
                    <code>
                      {
                        "total = 0\nfor nombre in [1, 2, 3]:\n    total = total + nombre"
                      }
                    </code>
                  </pre>
                  <div className="example-output">
                    <span>Valeur finale de total</span>
                    <strong>6</strong>
                  </div>
                </div>
                <ol className="reasoning-list">
                  <li>
                    <strong>On commence à zéro.</strong>
                    <p>
                      La variable <code>total</code> garde le résultat au fil du
                      programme.
                    </p>
                  </li>
                  <li>
                    <strong>On prend chaque nombre.</strong>
                    <p>La boucle parcourt successivement 1, 2, puis 3.</p>
                  </li>
                  <li>
                    <strong>On ajoute à chaque passage.</strong>
                    <p>
                      Le total devient 1, puis 3, puis 6. L’indentation indique
                      l’instruction répétée.
                    </p>
                  </li>
                </ol>
              </div>
              <p className="example-disclosure">
                Lisez le code, suivez le raisonnement, puis réutilisez la notion
                dans votre prochain exercice.
              </p>
            </div>
          </section>

          <section id="fonctionnalites" className="section learner-section">
            <div className="container learner-layout">
              <div>
                <h2>
                  Un accompagnement
                  <br />
                  qui garde le fil.
                </h2>
                <p className="section-intro">
                  Chaque séance s’appuie sur votre parcours pour vous aider à
                  progresser.
                </p>
              </div>
              <div className="learner-scenarios">
                <article>
                  <h3>Votre tuteur, en conversation</h3>
                  <p>
                    Posez une question, demandez un exemple ou une
                    reformulation. Retrouvez les ressources qui étayent
                    l’explication.
                  </p>
                </article>
                <article>
                  <h3>Des exercices au bon niveau</h3>
                  <p>
                    Pratiquez avec des questions, du code à lire et des réponses
                    à construire. Recevez des indices et une correction
                    expliquée.
                  </p>
                </article>
                <article>
                  <h3>Une progression visible</h3>
                  <p>
                    Repérez vos acquis, retrouvez vos tentatives et reprenez
                    votre séance avec une prochaine étape adaptée.
                  </p>
                </article>
                <article>
                  <h3>Des révisions qui ont du sens</h3>
                  <p>
                    Revenez sur les notions à consolider et entretenez vos
                    acquis avec la révision espacée.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section className="section diagnostic-surface">
            <div className="container diagnostic-invitation">
              <div>
                <h2>
                  La première étape :<br />
                  faire le point.
                </h2>
                <p>
                  Précisez vos objectifs et vos préférences, puis explorez vos
                  acquis. Votre diagnostic donne un point de départ à votre
                  parcours.
                </p>
                <Link className="button" href="/onboarding">
                  Commencer le diagnostic
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <div className="diagnostic-details">
                <h3>Un parcours que vous contrôlez.</h3>
                <ul>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Vos objectifs, votre rythme et vos langages
                  </li>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Un diagnostic pour situer vos acquis
                  </li>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Retour arrière et modification des réponses
                  </li>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Un plan de travail adapté à votre profil
                  </li>
                </ul>
                <p>
                  <CornerDownRight size={18} aria-hidden="true" />À la fin : un
                  premier repère pour la suite.
                </p>
              </div>
            </div>
          </section>

          <section className="section approach-surface">
            <div className="container approach-grid">
              <div>
                <h2>
                  Apprendre ensemble.
                  <br />
                  Garder le cap.
                </h2>
                <p className="section-intro">
                  Des outils pour accompagner les étudiants et faire évoluer les
                  contenus.
                </p>
              </div>
              <div className="approach-list">
                <article>
                  <h3>Un regard enseignant</h3>
                  <p>
                    Suivez les groupes autorisés et repérez les notions qui
                    méritent un accompagnement.
                  </p>
                </article>
                <article>
                  <h3>Des contenus structurés</h3>
                  <p>
                    Cours, exercices et corrections de référence forment un
                    parcours cohérent. Les variantes enrichissent la pratique.
                  </p>
                </article>
                <article>
                  <h3>Votre retour compte</h3>
                  <p>
                    Signalez une explication ou une correction à revoir et
                    gardez la main sur vos données.
                  </p>
                </article>
              </div>
            </div>
          </section>
          <section className="section faq-surface">
            <div className="container faq-grid">
              <div>
                <h2>
                  Les questions
                  <br />
                  avant le premier pas.
                </h2>
                <p className="section-intro">
                  Quelques repères pour commencer votre parcours.
                </p>
              </div>
              <div>
                <details>
                  <summary>À qui s’adresse AgenticTutor ?</summary>
                  <p>
                    Aux étudiants qui découvrent la programmation, consolident
                    leurs cours ou avancent sur un projet.
                  </p>
                </details>
                <details>
                  <summary>Comment le tuteur s’adapte-t-il ?</summary>
                  <p>
                    Il s’appuie sur vos objectifs, votre diagnostic et vos
                    réponses pour ajuster explications, indices et difficulté.
                  </p>
                </details>
                <details>
                  <summary>Quels langages puis-je apprendre ?</summary>
                  <p>
                    Python, C, C++, C#, Java, HTML, CSS, JavaScript, Go, Rust et
                    MySQL, selon votre objectif.
                  </p>
                </details>
                <details>
                  <summary>Que se passe-t-il quand je me trompe ?</summary>
                  <p>
                    Un indice vous aide à réessayer. La correction explique le
                    raisonnement et le tuteur vous propose une suite adaptée.
                  </p>
                </details>
                <details>
                  <summary>Le diagnostic est-il une note officielle ?</summary>
                  <p>
                    Non. Il sert à situer vos acquis et à choisir votre point de
                    départ.
                  </p>
                </details>
                <details>
                  <summary>Comment commencer ?</summary>
                  <p>
                    Créez votre compte, précisez vos objectifs et commencez le
                    diagnostic pour préparer votre parcours.
                  </p>
                </details>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="site-footer landing-footer">
        <div className="container footer-row">
          <Brand />
          <p>Comprendre. Essayer. Recommencer.</p>
          <a className="text-link" href="#programme">
            Explorer les notions
          </a>
        </div>
      </footer>
    </div>
  );
}
