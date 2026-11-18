import { Onboarding } from "@/features/diagnostic/onboarding";
import { verifiedUser } from "@/lib/supabase/server";
import { profileRequest } from "@/features/auth/actions";
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
  let profile = await profileRequest("GET");
  if (profile.status === 404)
    profile = await profileRequest("PUT", {
      display_name:
        String(user.user_metadata.display_name || "Étudiant")
          .trim()
          .slice(0, 80) || "Étudiant",
      preferred_language: null,
    });
  if (!profile.ok)
    return (
      <main id="main" className="container flow-loading">
        Votre profil est indisponible. Rechargez la page.
      </main>
    );
  return <Onboarding />;
}
