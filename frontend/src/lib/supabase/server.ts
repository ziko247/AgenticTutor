import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function authClient() {
  const store = await cookies();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new Error(
      "Authentification indisponible. Vérifiez la configuration du serveur.",
    );
  return createServerClient(url, key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          /* Server components cannot write; proxy refreshes cookies. */
        }
      },
    },
  });
}

export const verifiedUser = cache(async () =>
  (await authClient()).auth.getUser(),
);
