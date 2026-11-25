import "server-only";
import { cookies } from "next/headers";

export async function darkMode() {
  return (await cookies()).get("agentictutor-theme")?.value === "dark";
}

export async function toggleDarkMode() {
  "use server";
  const dark = await darkMode();
  (await cookies()).set("agentictutor-theme", dark ? "light" : "dark", {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 31536000,
  });
}
