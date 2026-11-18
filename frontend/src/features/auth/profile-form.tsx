"use client";
import { useState } from "react";
import { saveProfile } from "./profile-actions";
import { languages } from "@/lib/languages";
export function ProfileForm({
  name,
  language,
  revision,
}: {
  name: string;
  language: string | null;
  revision: number;
}) {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          const r = await saveProfile(new FormData(e.currentTarget));
          setMessage(r);
        } catch {
          setMessage("Enregistrement impossible. Réessayez.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <input type="hidden" name="revision" value={revision} />
      <div className="field">
        <label htmlFor="profile-name">Prénom</label>
        <input
          id="profile-name"
          name="display_name"
          defaultValue={name}
          required
          maxLength={80}
          autoComplete="given-name"
        />
      </div>
      <div className="field">
        <label htmlFor="profile-language">Langage préféré</label>
        <select
          id="profile-language"
          name="preferred_language"
          defaultValue={language || ""}
        >
          <option value="">Pas encore choisi</option>
          {Object.entries(languages).map(([id, l]) => (
            <option key={id} value={id}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="button quiet" disabled={busy}>
        {busy ? "Enregistrement…" : "Enregistrer le profil"}
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
