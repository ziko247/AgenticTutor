"use client";

import { useState } from "react";
import { authClient } from "./client";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    setBusy(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (!result.error) {
        window.location.replace("/sign-in");
        return;
      }
    } catch {
      // Show the same message for transport and server failures.
    }
    setError("Déconnexion impossible. Réessayez.");
    setBusy(false);
  }

  return (
    <div>
      <button
        type="button"
        className="button full"
        onClick={signOut}
        disabled={busy}
      >
        {busy ? "Déconnexion…" : "Se déconnecter"}
      </button>
      <p className="form-error" role="status">
        {error}
      </p>
    </div>
  );
}
