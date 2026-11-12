import type { Metadata } from "next";
import "@fontsource-variable/rethink-sans";
import "@fontsource-variable/hanken-grotesk";
import "@/styles/globals.css";
export const metadata: Metadata = {
  title: {
    default: "AgenticTutor | Apprendre Python, à votre rythme",
    template: "%s | AgenticTutor",
  },
  description:
    "Un premier pas vers un apprentissage de Python adapté à votre niveau. Découvrez AgenticTutor et préparez votre parcours.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#main">
          Aller au contenu
        </a>
        {children}
        <noscript>
          <p className="notice">
            JavaScript est nécessaire pour les formulaires et le diagnostic.
            Aucun compte ne sera créé dans cette version de démonstration.
          </p>
        </noscript>
      </body>
    </html>
  );
}
