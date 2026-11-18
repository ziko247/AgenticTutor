import { PasswordForm } from "@/features/auth/password-form";
export const metadata = { title: "Mot de passe oublié" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return <PasswordForm invalidLink={params.error === "invalid_link"} />;
}
