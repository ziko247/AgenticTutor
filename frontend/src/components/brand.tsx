import Link from "next/link";
import { Braces } from "lucide-react";
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="AgenticTutor, accueil">
      <Braces aria-hidden="true" size={28} />
      <span>AgenticTutor</span>
    </Link>
  );
}
export function Header({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <header className="site-header container">
      <Brand href={authenticated ? "/dashboard" : "/"} />
      <nav aria-label="Navigation principale">
        <Link href="/#approche" className="desktop-link">
          Notre approche
        </Link>
        {authenticated ? (
          <Link className="button quiet nav-cta" href="/dashboard">
            Mon espace
          </Link>
        ) : (
          <>
            <Link className="button quiet nav-cta" href="/sign-in">
              Se connecter
            </Link>
            <Link className="button quiet nav-signup" href="/sign-up">
              Créer un compte
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
