import Link from "next/link";
import { Braces } from "lucide-react";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="AgenticTutor, accueil">
      <Braces aria-hidden="true" size={28} />
      <span>AgenticTutor</span>
    </Link>
  );
}
export function Header() {
  return (
    <header className="site-header container">
      <Brand />
      <nav aria-label="Navigation principale">
        <Link href="/#approche" className="desktop-link">
          Notre approche
        </Link>
        <Link href="/sign-in">Se connecter</Link>
        <Link className="button quiet nav-cta" href="/sign-up">
          Créer un compte
        </Link>
      </nav>
    </header>
  );
}
