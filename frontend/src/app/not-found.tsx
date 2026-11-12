import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container flow-loading">
      <h1>Cette page reste à écrire.</h1>
      <p>Retrouvez le début de votre parcours Python.</p>
      <Link className="button" href="/">
        Retour à l’accueil
      </Link>
    </main>
  );
}
