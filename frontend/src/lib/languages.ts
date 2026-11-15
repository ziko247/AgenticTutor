export const languages = {
  python: {
    label: "Python",
  },
  c: {
    label: "C",
  },
  cpp: {
    label: "C++",
  },
  csharp: {
    label: "C#",
  },
  java: {
    label: "Java",
  },
  html: {
    label: "HTML",
  },
  css: {
    label: "CSS",
  },
  javascript: {
    label: "JavaScript",
  },
  go: {
    label: "Go",
  },
  rust: {
    label: "Rust",
  },
} as const;
export type Language = keyof typeof languages;
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
];
