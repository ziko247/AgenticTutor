import { AuthForm } from "@/features/auth/auth-form";
export const metadata = { title: "Se connecter" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthForm mode="sign-in" callbackFailed={error === "callback_failed"} />
  );
}
