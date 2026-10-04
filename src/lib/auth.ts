import { createClient } from "@/lib/supabase/server";

export type SessionUser = { id: string; email: string; name: string; avatar: string | null };

/**
 * The signed-in user (verified with getClaims, which checks the JWT signature) and whether
 * they are an admin. The admins table is only readable by admins, so any row back means yes.
 */
export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return { supabase, user: null, isAdmin: false };

  const meta = (claims.user_metadata ?? {}) as Record<string, string | undefined>;
  const user: SessionUser = {
    id: claims.sub,
    email: claims.email ?? "",
    name: meta.full_name ?? meta.name ?? claims.email ?? "",
    avatar: meta.avatar_url ?? meta.picture ?? null,
  };
  const { data: rows } = await supabase.from("admins").select("email").limit(1);
  return { supabase, user, isAdmin: (rows?.length ?? 0) > 0 };
}

/** Only allow same-site relative redirects after sign-in. */
export function safeNext(next: string | null | undefined, fallback = "/") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
