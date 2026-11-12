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
                Python, une ligne
                <br />à la fois.
              </h1>
              <p>
                Un tuteur pensé pour expliquer, pratiquer et avancer avec vous.
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
                  <h3>Une notion, un exemple Python</h3>
                  <p>
                    Le tuteur est conçu pour relier l’explication à du code
                    concret, puis reformuler quand une notion reste floue.
                  </p>
                </article>
                <article>
                  <h3>Un indice avant la solution</h3>
                  <p>
                    L’accompagnement prévu laisse une place à la recherche : un
                    premier indice, une nouvelle tentative, puis une correction
                    expliquée.
                  </p>
                </article>
                <article>
                  <h3>Vos réponses orientent la suite</h3>
                  <p>
                    La prochaine étape du projet : proposer de consolider un
                    prérequis ou d’aborder un exercice plus exigeant selon vos
                    réponses.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section id="programme" className="section curriculum">
            <div className="container">
              <div className="curriculum-header">
                <h2>
                  Un langage.
                  <br />
                  Des bases qui tiennent.
                </h2>
                <p>
                  Le périmètre pédagogique de départ : cinq notions pour
                  apprendre à lire, comprendre et écrire du Python.
                </p>
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
                Programme prévu pour le tutorat. Le diagnostic vous permet déjà
                d’explorer ces notions.
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
                Exemple pédagogique prédéfini. La conversation avec le tuteur IA
                reste à connecter.
              </p>
            </div>
          </section>

          <section className="section learner-section">
            <div className="container learner-layout">
              <div>
                <h2>
                  Votre point de départ
                  <br />
                  vous appartient.
                </h2>
                <p className="section-intro">
                  Pas besoin de savoir où vous situer avant de commencer.
                </p>
              </div>
              <div className="learner-scenarios">
                <article>
                  <h3>« Je n’ai jamais codé. »</h3>
                  <p>
                    Commencez par découvrir les notions. Dans le diagnostic, «
                    Je ne sais pas encore » est une réponse utile.
                  </p>
                </article>
                <article>
                  <h3>« J’ai vu ça en cours. »</h3>
                  <p>
                    Relisez du code et repérez les notions à retravailler avant
                    d’aller plus loin.
                  </p>
                </article>
                <article>
                  <h3>« Je veux passer à la pratique. »</h3>
                  <p>
                    Indiquez votre objectif : cours, automatisation, données ou
                    projet personnel.
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
                  20 questions pour préciser vos objectifs et explorer vos bases
                  en Python. Aucun compte nécessaire pour essayer.
                </p>
                <Link className="button" href="/onboarding">
                  Essayer le diagnostic
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <div className="diagnostic-details">
                <h3>Un parcours que vous contrôlez.</h3>
                <ul>
                  <li>
                    <Check size={18} aria-hidden="true" />6 questions sur votre
                    contexte et vos préférences
                  </li>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    14 questions de découverte du langage Python
                  </li>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Retour arrière et modification des réponses
                  </li>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Reprise sur ce navigateur grâce à la sauvegarde locale
                  </li>
                </ul>
                <p>
                  <CornerDownRight size={18} aria-hidden="true" />À la fin : un
                  récapitulatif, sans note officielle.
                </p>
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
                  Ce que cette version permet déjà, et ce qui arrive ensuite.
                </p>
              </div>
              <div>
                <details>
                  <summary>Le tuteur IA est-il déjà disponible ?</summary>
                  <p>
                    Cette version propose une démonstration guidée et le
                    diagnostic local. La conversation IA, les exercices
                    adaptatifs et le suivi serveur restent à développer.
                  </p>
                </details>
                <details>
                  <summary>Faut-il déjà connaître Python ?</summary>
                  <p>
                    Non. Le parcours accueille aussi les débutants. Vous pouvez
                    répondre « Je ne sais pas encore » aux questions techniques.
                  </p>
                </details>
                <details>
                  <summary>
                    Mes réponses sont-elles envoyées quelque part ?
                  </summary>
                  <p>
                    Non. Elles sont conservées uniquement dans le stockage local
                    de ce navigateur. Vous pouvez les revoir ou les effacer à la
                    fin du diagnostic.
                  </p>
                </details>
                <details>
                  <summary>Est-ce un test noté ?</summary>
                  <p>
                    Le score est un premier repère sur les questions proposées,
                    pas une certification de niveau ni une note scolaire.
                  </p>
                </details>
                <details>
                  <summary>Puis-je créer un compte maintenant ?</summary>
                  <p>
                    Les écrans de connexion et d’inscription sont des aperçus.
                    Aucun compte réel n’est créé tant que l’authentification
                    n’est pas reliée au backend.
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
