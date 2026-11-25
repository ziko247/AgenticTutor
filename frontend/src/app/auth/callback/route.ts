import { markRecovery } from "@/features/auth/recovery";
import { authClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const client = await authClient();
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    if (!error) {
      // The installed Auth SDK returns this PKCE metadata but omits it from its public type.
      const recovery =
        "redirectType" in data && data.redirectType === "recovery";
      if (recovery) await markRecovery(data.session.access_token);
      return NextResponse.redirect(
        new URL(
          recovery ? "/reset-password" : "/dashboard",
          process.env.APP_ORIGIN || request.nextUrl.origin,
        ),
      );
    }
  }
  return NextResponse.redirect(
    new URL(
      request.nextUrl.searchParams.get("flow") === "recovery"
        ? "/forgot-password?error=invalid_link"
        : "/sign-in?error=callback_failed",
      process.env.APP_ORIGIN || request.nextUrl.origin,
    ),
  );
}
