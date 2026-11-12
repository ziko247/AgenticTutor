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
export const questions: Question[] = [
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
  {
    id: "print",
    topic: "Variables",
    title: "Que va afficher cette ligne ?",
    code: 'print("Bonjour")',
    options: ["Bonjour", '"Bonjour"', "print", "Je ne sais pas encore"],
    correct: 0,
  },
  {
    id: "variable",
    topic: "Variables",
    title: "Quelle valeur contient x à la fin ?",
    code: "x = 2\nx = x + 3",
    options: ["2", "3", "5", "Je ne sais pas encore"],
    correct: 2,
  },
  {
    id: "string",
    topic: "Variables",
    title: "Quelle valeur est une chaîne de caractères ?",
    options: ['"42"', "42", "4.2", "Je ne sais pas encore"],
    correct: 0,
  },
  {
    id: "list",
    topic: "Listes",
    title: "Combien d’éléments contient cette liste ?",
    code: "notes = [12, 15, 18]",
    options: ["2", "3", "18", "Je ne sais pas encore"],
    correct: 1,
  },
  {
    id: "index",
    topic: "Listes",
    title: "Que vaut couleurs[0] ?",
    code: 'couleurs = ["vert", "bleu", "jaune"]',
    options: ["vert", "bleu", "jaune", "Je ne sais pas encore"],
    correct: 0,
  },
  {
    id: "comparison",
    topic: "Conditions",
    title: "Quel symbole vérifie si deux valeurs sont égales ?",
    options: ["=", "==", "!=", "Je ne sais pas encore"],
    correct: 1,
  },
  {
    id: "condition",
    topic: "Conditions",
    title: "Quel message sera affiché ?",
    code: 'age = 18\nif age >= 18:\n    print("Bienvenue")',
    options: ["Bienvenue", "age", "Aucun message", "Je ne sais pas encore"],
    correct: 0,
  },
  {
    id: "else",
    topic: "Conditions",
    title: "Quand le bloc else est-il exécuté ?",
    options: [
      "Toujours",
      "Quand la condition if est fausse",
      "Avant le if",
      "Je ne sais pas encore",
    ],
    correct: 1,
  },
  {
    id: "range",
    topic: "Boucles",
    title: "Combien de fois print est-il appelé ?",
    code: 'for i in range(3):\n    print("Python")',
    options: ["2 fois", "3 fois", "4 fois", "Je ne sais pas encore"],
    correct: 1,
  },
  {
    id: "loop",
    topic: "Boucles",
    title: "Quelle est la dernière valeur affichée ?",
    code: "for i in range(3):\n    print(i)",
    options: ["1", "2", "3", "Je ne sais pas encore"],
    correct: 1,
  },
  {
    id: "function",
    topic: "Fonctions",
    title: "Quel mot commence une définition de fonction ?",
    options: ["function", "def", "return", "Je ne sais pas encore"],
    correct: 1,
  },
  {
    id: "return",
    topic: "Fonctions",
    title: "Que renvoie cette fonction ?",
    code: "def double(n):\n    return n * 2\n\ndouble(4)",
    options: ["2", "4", "8", "Je ne sais pas encore"],
    correct: 2,
  },
  {
    id: "append",
    topic: "Listes",
    title: "Que contient la liste après append ?",
    code: "valeurs = [1, 2]\nvaleurs.append(3)",
    options: ["[1, 2, 3]", "[3]", "[1, 2]", "Je ne sais pas encore"],
    correct: 0,
  },
  {
    id: "sum",
    topic: "Boucles",
    title: "Quelle est la valeur finale de total ?",
    code: "total = 0\nfor n in [1, 2, 3]:\n    total = total + n",
    options: ["3", "5", "6", "Je ne sais pas encore"],
    correct: 2,
  },
  {
    id: "languages",
    title: "Quels langages ou technologies vous intéressent ?",
    description:
      "Plusieurs choix possibles. Seul Python est proposé dans cette phase de découverte. Vos préférences restent locales pour préparer la personnalisation future ; elles ne débloquent aucun autre parcours.",
    multiple: true,
    options: [
      "Python",
      "C",
      "C++",
      "C#",
      "Java",
      "HTML",
      "CSS",
      "JavaScript",
      "Go",
      "Rust",
      "MySQL",
      "Je ne sais pas encore",
    ],
  },
];
