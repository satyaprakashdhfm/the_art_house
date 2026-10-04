import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only routes that use the signed-in session; storefront pages stay static.
  matcher: ["/admin/:path*", "/login", "/auth/:path*"],
};
