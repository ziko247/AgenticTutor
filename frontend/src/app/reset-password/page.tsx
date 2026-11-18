import { PasswordResetForm } from "@/features/auth/password-reset-form";

export const metadata = {
  title: "Nouveau mot de passe",
  referrer: "no-referrer" as const,
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  return <PasswordResetForm token={typeof token === "string" ? token : ""} />;
}
