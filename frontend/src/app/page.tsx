import Link from "next/link";
import { authClient } from "@/lib/supabase/server";
import { RecoveryError } from "@/components/recovery-error";
import { BookOpen, Code2, Compass, Check, ArrowUpRight } from "lucide-react";
import { Header, Brand } from "@/components/brand";
import { WorkedExample } from "@/features/tutor/worked-example";
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

export default async function Home() {
  let authenticated = false;
  try {
    const client = await authClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    authenticated = !error && !!user;
  } catch {
    /* Landing remains accessible when Auth is unavailable. */
  }
  return (
    <div className="landing">
      <RecoveryError />
      <Header authenticated={authenticated} />
      <main id="main">
        <div className="landing-opening">
          <section className="hero container">
            <div className="introduction">
              <h1>
                Programmer, une étape
                <br />à la fois.
              </h1>
              <p>
                Explorez les exemples de code et situez votre niveau avec le
                diagnostic.
              </p>
              <div className="hero-actions">
                <Link
                  className="button"
                  href={authenticated ? "/dashboard" : "/sign-up"}
                >
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
                    Le futur tuteur expliquera et reformulera le code selon
                    votre objectif.
                  </p>
                </article>
                <article>
                  <h3>Un indice avant la solution</h3>
                  <p>
                    Essayez l’exemple interactif : demandez un indice, puis
                    comparez votre réponse au résultat.
                  </p>
                </article>
                <article>
                  <h3>Vos réponses orientent la suite</h3>
                  <p>
                    À terme, le tuteur proposera une activité selon vos acquis.
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
                  Le diagnostic et les exemples interactifs couvrent dix
                  langages. Les notions ci-dessous sont illustrées en Python.
                </p>
              </div>
              <div className="language-availability">
                <div>
                  <h3>Algorithmique et développement</h3>
                  <p>Python, C, C++, C#, Java, Go et Rust.</p>
                </div>
                <div>
                  <h3>Développement web</h3>
                  <p>HTML, CSS et JavaScript.</p>
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

          <WorkedExample />

          <section id="fonctionnalites" className="section learner-section">
            <div className="container learner-layout">
              <div>
                <h2>
                  Ce que le tuteur
                  <br />
                  proposera ensuite.
                </h2>
                <p className="section-intro">
                  Disponible aujourd’hui : exemples et diagnostic.
                </p>
              </div>
              <div className="learner-scenarios">
                <article>
                  <h3>Votre tuteur, en conversation</h3>
                  <p>Des réponses illustrées et sourcées.</p>
                </article>
                <article>
                  <h3>Des exercices au bon niveau</h3>
                  <p>Des indices et corrections adaptés.</p>
                </article>
                <article>
                  <h3>Une progression visible</h3>
                  <p>Les acquis et les notions à revoir.</p>
                </article>
                <article>
                  <h3>Des révisions qui ont du sens</h3>
                  <p>Des rappels pour consolider vos acquis.</p>
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
                <p>Choisissez un langage et situez vos acquis.</p>
                <Link className="button" href="/onboarding">
                  Commencer le diagnostic
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <div className="diagnostic-details">
                <h3>Ce que comprend le diagnostic</h3>
                <ul>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Vos objectifs et votre rythme
                  </li>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Dix questions techniques
                  </li>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Des réponses modifiables
                  </li>
                  <li>
                    <Check size={18} aria-hidden="true" />
                    Une note sur 20, enregistrée
                  </li>
                </ul>
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
                  Des outils sont prévus pour les enseignants et les étudiants.
                </p>
              </div>
              <div className="approach-list">
                <article>
                  <h3>Un regard enseignant</h3>
                  <p>
                    Les enseignants pourront suivre leurs groupes et repérer les
                    notions à retravailler.
                  </p>
                </article>
                <article>
                  <h3>Des contenus structurés</h3>
                  <p>
                    Des cours, des exercices et des corrections de référence
                    seront réunis dans le parcours.
                  </p>
                </article>
                <article>
                  <h3>Votre retour compte</h3>
                  <p>
                    Les étudiants pourront signaler les explications ou
                    corrections à revoir.
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
                  <summary>Comment le tuteur s’adaptera-t-il ?</summary>
                  <p>
                    Il utilisera votre diagnostic et vos réponses pour ajuster
                    les explications, les indices et la difficulté.
                  </p>
                </details>
                <details>
                  <summary>
                    Quels langages sont disponibles dans le diagnostic ?
                  </summary>
                  <p>
                    Python, C, C++, C#, Java, HTML, CSS, JavaScript, Go et Rust.
                  </p>
                </details>
                <details>
                  <summary>
                    Puis-je essayer un exemple avant de créer un compte ?
                  </summary>
                  <p>
                    Oui. L’exemple en haut de la page propose un indice et une
                    correction.
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
          <Brand href={authenticated ? "/dashboard" : "/"} />
          <p>Comprendre. Essayer. Recommencer.</p>
          <a className="text-link" href="#programme">
            Explorer les notions
          </a>
        </div>
      </footer>
    </div>
  );
}
