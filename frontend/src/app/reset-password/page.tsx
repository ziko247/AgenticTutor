import { PasswordForm } from "@/features/auth/password-form";
export const metadata = { title: "Nouveau mot de passe" };
export default function Page() {
  return <PasswordForm reset />;
}
