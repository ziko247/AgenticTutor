import { Brand } from "@/components/brand";
import { signOut } from "@/features/auth/actions";
import { AccountMenu } from "@/components/account-menu";
import { account } from "@/features/auth/account";
import "@/styles/dashboard.css";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await account();
  if (!session)
    return (
      <main id="main" className="container dashboard-main">
        <h1>Votre espace est temporairement indisponible</h1>
        <p>Rechargez la page pour réessayer.</p>
        <form action={signOut}>
          <button className="text-button" type="submit">
            Se déconnecter
          </button>
        </form>
      </main>
    );
  return (
    <>
      <header className="dashboard-header">
        <div className="container dashboard-header-inner">
          <Brand href="/dashboard" />
          <nav aria-label="Compte">
            <AccountMenu name={session.profile.display_name} />
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
