import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only client using the project's secret key, which bypasses RLS. Used to write orders,
 * which no browser session may create or change. Only import from Server Actions / Route Handlers.
 */
export function createSecretClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set.");
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
