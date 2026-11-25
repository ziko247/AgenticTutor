import { Moon } from "lucide-react";
import { darkMode, toggleDarkMode } from "@/features/auth/theme";

export const metadata = { title: "Paramètres" };
export default async function Settings() {
  const dark = await darkMode();
  return (
    <main id="main" className="container dashboard-main">
      <h1>Paramètres</h1>
      <section className="settings-appearance" aria-labelledby="appearance">
        <h2 id="appearance">Apparence</h2>
        <form action={toggleDarkMode}>
          <Moon size={22} aria-hidden="true" />
          <div>
            <strong id="theme-label">Mode sombre</strong>
            <p>Préférence enregistrée dans ce navigateur.</p>
          </div>
          <button
            type="submit"
            role="switch"
            aria-checked={dark}
            aria-labelledby="theme-label"
          >
            <span />
          </button>
        </form>
      </section>
    </main>
  );
}
