import { getSession } from "@/lib/auth";

/** Admin reads go through the signed-in client, so RLS also returns hidden / inactive rows. */
export async function adminRows<T>(table: string, order = "sort_order"): Promise<T[]> {
  const { supabase } = await getSession();
  const { data, error } = await supabase.from(table).select("*").order(order);
  if (error) throw new Error(`Could not load ${table}: ${error.message}`);
  return data as T[];
}
