import { AuthForm } from "@/features/auth/auth-form";
export const metadata = { title: "Se connecter" };
export default function Page() {
  return <AuthForm mode="sign-in" />;
}
