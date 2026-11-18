import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const name = "agentictutor-recovery";
const lifetime = 600;

function signature(token: string, expires: number) {
  const secret = process.env.AUTH_RECOVERY_SECRET;
  if (!secret) throw new Error("AUTH_RECOVERY_SECRET is missing");
  return createHmac("sha256", secret)
    .update(expires + ":" + token)
    .digest("hex");
}

export async function markRecovery(token: string) {
  const expires = Math.floor(Date.now() / 1000) + lifetime;
  (await cookies()).set(name, expires + "." + signature(token, expires), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: lifetime,
    path: "/",
  });
}

export async function hasRecovery(token: string) {
  const value = (await cookies()).get(name)?.value;
  if (!value || !/^\d{10}\.[a-f0-9]{64}$/.test(value)) return false;
  const [time, digest] = value.split(".");
  const expires = Number(time);
  if (expires <= Date.now() / 1000) return false;
  return timingSafeEqual(
    Buffer.from(digest, "hex"),
    Buffer.from(signature(token, expires), "hex"),
  );
}

export async function clearRecovery() {
  (await cookies()).delete(name);
}
