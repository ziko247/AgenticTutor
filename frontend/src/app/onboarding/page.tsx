import { Suspense } from "react";
import { loadDiagnostic } from "@/features/diagnostic/actions";
import { Onboarding } from "@/features/diagnostic/onboarding";
import { verifiedUser } from "@/lib/supabase/server";
import { loadOrCreateProfile } from "@/features/auth/profile";
import { redirect } from "next/navigation";

export const metadata = { title: "Votre diagnostic de programmation" };
export default async function Page() {
  const {
    data: { user },
    error,
  } = await verifiedUser();
  if (error && (!error.status || error.status >= 500 || error.status === 429))
    return (
      <main id="main" className="container flow-loading">
        Le service est indisponible. Rechargez la page.
      </main>
    );
  if (error || !user) redirect("/sign-in");
  const profile = await loadOrCreateProfile(user);
  if (!profile.ok)
    return (
      <main id="main" className="container flow-loading">
        Votre profil est indisponible. Rechargez la page.
      </main>
    );
  return (
    <Suspense
      fallback={
        <main id="main" className="container flow-loading" role="status">
          Préparation de votre parcours…
        </main>
      }
    >
      <Diagnostic />
    </Suspense>
  );
}

async function Diagnostic() {
  const result = await loadDiagnostic();
  if (result.error)
    return (
      <main id="main" className="container flow-loading" role="alert">
        <p>{result.error}</p>
        <form action="/onboarding" method="get">
          <button className="button">Réessayer</button>
        </form>
      </main>
    );
  return <Onboarding initialAttempt={result.attempt ?? null} />;
}
