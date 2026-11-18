import { authClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const client = await authClient();
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(
        new URL(
          request.nextUrl.searchParams.get("flow") === "recovery"
            ? "/reset-password"
            : "/dashboard",
          process.env.APP_ORIGIN || request.nextUrl.origin,
        ),
      );
  }
  return NextResponse.redirect(
    new URL(
      "/forgot-password?error=invalid_link",
      process.env.APP_ORIGIN || request.nextUrl.origin,
    ),
  );
}
