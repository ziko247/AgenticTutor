import { getAuth } from "@/features/auth/server";

export const runtime = "nodejs";

function handleAuth(request: Request) {
  return getAuth().handler(request);
}

export { handleAuth as GET, handleAuth as POST };
