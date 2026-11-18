import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { getAuth } from "@/features/auth/server";
import { SignOutButton } from "@/features/auth/sign-out-button";

export const metadata = { title: "Mon compte" };

export default async function AccountPage() {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session) redirect("/sign-in");
  const { name, lastName, email } = session.user;
  const fullName = [name, lastName].filter(Boolean).join(" ");

  return (
    <main id="main" className="auth-layout">
      <aside className="auth-story">
        <Brand />
        <div>
          <h2>Votre espace AgenticTutor</h2>
        </div>
      </aside>
      <section className="auth-main">
        <Link href="/" className="back-link">
          Retour à l’accueil
        </Link>
        <div className="auth-form-wrap">
          <h1>Bonjour, {fullName}.</h1>
          <p className="intro">{email}</p>
          <div className="preview-entry mb-4">
            <Link href="/onboarding" className="button full text-base">
              Continuer vers le diagnostic
            </Link>
          </div>
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
