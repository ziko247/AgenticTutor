import type { Metadata } from "next";
import { SmoothScroll } from "@/components/smooth-scroll";
import "lenis/dist/lenis.css";
import "@fontsource-variable/rethink-sans";
import "@fontsource-variable/hanken-grotesk";
import "@/styles/tokens.css";
import "@/styles/globals.css";
export const metadata: Metadata = {
  title: {
    default: "AgenticTutor | Apprendre à programmer, à votre rythme",
    template: "%s | AgenticTutor",
  },
  description:
    "Votre tuteur IA pour apprendre à programmer : explications personnalisées, exercices adaptatifs et suivi de progression en Python, JavaScript, Java et plus encore.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <SmoothScroll />
        <a className="skip-link" href="#main">
          Aller au contenu
        </a>
        {children}
        <noscript>
          <p className="notice">
            JavaScript est nécessaire pour les formulaires et le diagnostic.
            Activez JavaScript pour utiliser votre espace.
          </p>
        </noscript>
      </body>
    </html>
  );
}
