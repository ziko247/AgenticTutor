import { AuthForm } from "@/features/auth/auth-form";
export const metadata = { title: "Créer un compte" };
export default function Page() {
  return <AuthForm mode="sign-up" />;
}
