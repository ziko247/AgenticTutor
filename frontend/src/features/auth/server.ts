import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { after } from "next/server.js";
import nodemailer from "nodemailer";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";

function authOptions() {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL;
  if (!secret || secret.length < 32 || !baseURL) {
    throw new Error("Configurez BETTER_AUTH_SECRET et BETTER_AUTH_URL.");
  }

  const database = new DatabaseSync(
    resolve(
      /* turbopackIgnore: true */ process.env.AUTH_DB_PATH ||
        "agentictutor.sqlite",
    ),
  );
  database.exec("PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL;");

  const smtpUrl = process.env.SMTP_URL;
  const from = process.env.AUTH_EMAIL_FROM;
  const mail = smtpUrl && from ? nodemailer.createTransport(smtpUrl) : null;

  return {
    database,
    secret,
    baseURL,
    advanced: {
      backgroundTasks: {
        handler: (task: Promise<unknown>) => after(() => task),
      },
    },
    emailAndPassword: {
      enabled: true,
      resetPasswordTokenExpiresIn: 30 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword:
        mail && from
          ? async ({
              user,
              token,
            }: {
              user: { email: string };
              token: string;
            }) => {
              const link = new URL("/reset-password", baseURL);
              link.searchParams.set("token", token);
              try {
                await mail.sendMail({
                  from,
                  to: user.email,
                  subject: "Réinitialisation du mot de passe AgenticTutor",
                  text: `Pour choisir un nouveau mot de passe, ouvrez ce lien valable 30 minutes :\n\n${link}\n\nSi vous n’avez pas demandé cette réinitialisation, ignorez ce message.`,
                });
              } catch {
                console.error("Échec de l’envoi du lien de réinitialisation.");
              }
            }
          : undefined,
    },
    user: {
      additionalFields: {
        lastName: { type: "string" as const, required: false },
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/sign-up/email") return;

        const { name, lastName } = ctx.body ?? {};
        if (typeof name !== "string" || !name.trim()) {
          throw new APIError("BAD_REQUEST", {
            message: "Indiquez votre prénom.",
          });
        }
        if (typeof lastName !== "string" || !lastName.trim()) {
          throw new APIError("BAD_REQUEST", { message: "Indiquez votre nom." });
        }
      }),
    },
  };
}

export { authOptions };

function createAuth() {
  return betterAuth(authOptions());
}

let auth: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  return (auth ??= createAuth());
}
