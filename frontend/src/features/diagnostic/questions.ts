export type Question = {
  id: string;
  title: string;
  description?: string;
  options: string[];
  code?: string;
  correct?: number;
  topic?: string;
  multiple?: boolean;
};
const originalQuestions: Question[] = [
  {
    id: "education",
    title: "Où en êtes-vous dans vos études ?",
    options: [
      "Lycée",
      "Licence ou formation technique",
      "Master ou cycle ingénieur",
      "En reconversion",
      "Autre parcours",
    ],
  },
  {
    id: "experience",
    title: "Avez-vous déjà programmé ?",
    options: [
      "Jamais, je découvre",
      "Un peu, dans un autre langage",
      "J’ai déjà essayé Python",
      "J’utilise déjà Python",
    ],
  },
  {
    id: "subject",
    title: "Dans quel contexte apprenez-vous Python ?",
    options: [
      "Informatique et algorithmique",
      "Data science et intelligence artificielle",
      "Sciences et ingénierie",
      "Projet personnel",
      "Je découvre encore",
    ],
  },
  {
    id: "goal",
    title: "Qu’aimeriez-vous accomplir en premier ?",
    options: [
      "Comprendre les bases",
      "Réussir mes cours",
      "Automatiser des tâches",
      "Analyser des données",
      "Construire un petit projet",
    ],
  },
  {
    id: "difficulty",
    title: "Quel point de départ vous rassure ?",
    options: [
      "Des explications très guidées",
      "Un équilibre entre indices et autonomie",
      "Des défis pour me tester",
    ],
  },
  {
    id: "rhythm",
    title: "Quel rythme aimeriez-vous adopter ?",
    options: [
      "Quelques minutes quand je peux",
      "Des séances courtes régulières",
      "Des séances plus approfondies",
    ],
  },
];

export const profileQuestions = originalQuestions.slice(0, 6).map((q) => ({
  ...q,
  title: q.title.replace("Python", "la programmation"),
  options:
    q.id === "experience"
      ? [
          "Jamais, je découvre",
          "Un peu, dans un autre langage",
          "J’ai déjà essayé ce langage",
          "J’utilise déjà ce langage",
        ]
      : q.options,
}));
