export type Example = {
  label: string;
  file: string;
  lesson: {
    code: string;
    question: string;
    hint: string;
    result: string;
    detail: string;
  };
  worked: {
    code: string;
    outputLabel: string;
    output: string;
    steps: { title: string; text: string }[];
  };
};
const loopSteps = [
  {
    title: "On commence à zéro.",
    text: "La variable total garde le résultat au fil du programme.",
  },
  {
    title: "On prend chaque nombre.",
    text: "La boucle parcourt successivement 1, 2, puis 3.",
  },
  {
    title: "On ajoute à chaque passage.",
    text: "Le total devient 1, puis 3, puis 6.",
  },
];
function loop(
  label: string,
  file: string,
  code: string,
  sum: string,
  detail = "La condition arrête la boucle avant 3.",
): Example {
  return {
    label,
    file,
    lesson: {
      code,
      question: "Que va afficher ce programme ?",
      hint: "Le comptage commence à 0. La borne finale est exclue.",
      result: "0, 1, puis 2.",
      detail,
    },
    worked: {
      code: sum,
      outputLabel: "Valeur finale de total",
      output: "6",
      steps: loopSteps,
    },
  };
}
export const examples = {
  python: loop(
    "Python",
    "exemple_boucle.py",
    "for nombre in range(3):\n    print(nombre)",
    "total = 0\nfor nombre in [1, 2, 3]:\n    total = total + nombre",
    "La borne 3 est exclue.",
  ),
  c: loop(
    "C",
    "exemple_boucle.c",
    '#include <stdio.h>\n\nint main(void) {\n    for (int n = 0; n < 3; n++) {\n        printf("%d\\n", n);\n    }\n    return 0;\n}',
    '#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int n = 1; n <= 3; n++) {\n        total += n;\n    }\n    printf("%d\\n", total);\n    return 0;\n}',
  ),
  cpp: loop(
    "C++",
    "exemple_boucle.cpp",
    '#include <iostream>\n\nint main() {\n    for (int n = 0; n < 3; n++) {\n        std::cout << n << "\\n";\n    }\n}',
    '#include <iostream>\n\nint main() {\n    int total = 0;\n    for (int n : {1, 2, 3}) {\n        total += n;\n    }\n    std::cout << total << "\\n";\n}',
  ),
  csharp: loop(
    "C#",
    "Exemple.cs",
    "for (int n = 0; n < 3; n++)\n{\n    System.Console.WriteLine(n);\n}",
    "int total = 0;\nforeach (int n in new[] {1, 2, 3})\n{\n    total += n;\n}\nSystem.Console.WriteLine(total);",
  ),
  java: loop(
    "Java",
    "Exemple.java",
    "class Exemple {\n    public static void main(String[] args) {\n        for (int n = 0; n < 3; n++) {\n            System.out.println(n);\n        }\n    }\n}",
    "class Exemple {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int n : new int[] {1, 2, 3}) {\n            total += n;\n        }\n        System.out.println(total);\n    }\n}",
  ),
  javascript: loop(
    "JavaScript",
    "exemple_boucle.js",
    "for (let n = 0; n < 3; n++) {\n    console.log(n);\n}",
    "let total = 0;\nfor (const n of [1, 2, 3]) {\n    total += n;\n}\nconsole.log(total);",
  ),
  go: loop(
    "Go",
    "exemple_boucle.go",
    'package main\n\nimport "fmt"\n\nfunc main() {\n    for n := 0; n < 3; n++ {\n        fmt.Println(n)\n    }\n}',
    'package main\n\nimport "fmt"\n\nfunc main() {\n    total := 0\n    for _, n := range []int{1, 2, 3} {\n        total += n\n    }\n    fmt.Println(total)\n}',
  ),
  rust: loop(
    "Rust",
    "exemple_boucle.rs",
    'fn main() {\n    for n in 0..3 {\n        println!("{}", n);\n    }\n}',
    'fn main() {\n    let mut total = 0;\n    for n in [1, 2, 3] {\n        total += n;\n    }\n    println!("{}", total);\n}',
    "L’intervalle 0..3 exclut la borne 3.",
  ),
  mysql: {
    label: "MySQL",
    file: "exemple_somme.sql",
    lesson: {
      code: "SELECT 0 AS nombre\nUNION ALL SELECT 1\nUNION ALL SELECT 2\nORDER BY nombre;",
      question: "Quelles valeurs renvoie cette requête ?",
      hint: "UNION ALL rassemble les lignes. ORDER BY les trie.",
      result: "0, 1, puis 2.",
      detail: "La colonne nombre est triée par ordre croissant.",
    },
    worked: {
      code: "SELECT SUM(nombre) AS total\nFROM (\n    SELECT 1 AS nombre\n    UNION ALL SELECT 2\n    UNION ALL SELECT 3\n) AS nombres;",
      outputLabel: "Valeur de la colonne total",
      output: "6",
      steps: [
        {
          title: "On crée les lignes.",
          text: "La sous-requête contient les valeurs 1, 2 et 3.",
        },
        {
          title: "On les rassemble.",
          text: "UNION ALL conserve chaque ligne dans la table dérivée nombres.",
        },
        {
          title: "On calcule la somme.",
          text: "SUM additionne la colonne nombre : 1 + 2 + 3 = 6.",
        },
      ],
    },
  },
  html: {
    label: "HTML",
    file: "exemple_liste.html",
    lesson: {
      code: "<ol>\n    <li>Comprendre</li>\n    <li>Essayer</li>\n    <li>Recommencer</li>\n</ol>",
      question: "Combien d’éléments contient cette liste ?",
      hint: "Chaque balise li représente un élément de la liste.",
      result: "3 éléments.",
      detail: "La balise ol indique une liste ordonnée.",
    },
    worked: {
      code: "<article>\n    <h2>Mon parcours</h2>\n    <p>Apprendre à programmer.</p>\n</article>",
      outputLabel: "Titre de l’article",
      output: "Mon parcours",
      steps: [
        {
          title: "On regroupe le contenu.",
          text: "article rassemble un contenu autonome.",
        },
        {
          title: "On donne un titre.",
          text: "h2 affiche le titre « Mon parcours ».",
        },
        {
          title: "On ajoute le texte.",
          text: "p contient le paragraphe sous le titre. HTML décrit une structure, sans calcul.",
        },
      ],
    },
  },
  css: {
    label: "CSS",
    file: "exemple_style.css",
    lesson: {
      code: ".message {\n    font-size: 20px;\n    font-weight: bold;\n}",
      question: "Comment le texte .message sera-t-il affiché ?",
      hint: "font-size règle la taille, font-weight règle la graisse.",
      result: "En gras, à 20 pixels.",
      detail: "Ces règles s’appliquent aux éléments de classe message.",
    },
    worked: {
      code: ".parcours {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 16px;\n}",
      outputLabel: "Nombre de colonnes",
      output: "3",
      steps: [
        {
          title: "On active la grille.",
          text: "display: grid organise les enfants en grille.",
        },
        {
          title: "On partage la largeur.",
          text: "repeat(3, 1fr) crée trois colonnes de largeur égale.",
        },
        {
          title: "On espace les éléments.",
          text: "gap: 16px sépare les cellules. CSS définit la présentation.",
        },
      ],
    },
  },
} satisfies Record<string, Example>;
export type Language = keyof typeof examples;
export const languageOrder: Language[] = [
  "python",
  "c",
  "cpp",
  "csharp",
  "java",
  "html",
  "css",
  "javascript",
  "go",
  "rust",
  "mysql",
];
