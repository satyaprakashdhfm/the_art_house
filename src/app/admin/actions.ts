"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

export type TableName =
  | "products"
  | "hero_slides"
  | "announcements"
  | "coupons"
  | "offers"
  | "testimonials"
  | "faqs"
  | "gallery_items"
  | "category_groups"
  | "subcategories";

type TableConfig = { key: string; columns: string[]; images?: string[]; flags: string[] };

/** What the admin is allowed to write, per table. RLS enforces admin-only writes as well. */
const TABLES: Record<TableName, TableConfig> = {
  products: {
    key: "id",
    columns: [
      "slug", "title", "description", "group_slug", "sub_category", "medium", "style", "type", "orientation",
      "sizes", "images", "rooms", "subjects", "panels", "is_bestseller", "is_new", "rating", "review_count",
      "is_published", "sort_order",
    ],
    images: ["images"],
    flags: ["is_published", "is_bestseller", "is_new"],
  },
  hero_slides: {
    key: "id",
    columns: ["eyebrow", "title", "text", "cta_label", "cta_href", "image", "tone", "is_active", "sort_order"],
    images: ["image"],
    flags: ["is_active"],
  },
  announcements: { key: "id", columns: ["message", "is_active", "sort_order"], flags: ["is_active"] },
  coupons: {
    key: "code",
    columns: [
      "code", "title", "description", "terms", "percent", "max_discount", "min_items", "group_slugs", "sub_slugs",
      "is_active", "sort_order",
    ],
    flags: ["is_active"],
  },
  offers: { key: "id", columns: ["title", "text", "is_active", "sort_order"], flags: ["is_active"] },
  testimonials: {
    key: "id",
    columns: ["name", "city", "rating", "text", "date_label", "show_on_home", "is_active", "sort_order"],
    flags: ["is_active", "show_on_home"],
  },
  faqs: { key: "id", columns: ["section", "question", "answer", "is_active", "sort_order"], flags: ["is_active"] },
  gallery_items: {
    key: "id",
    columns: ["title", "medium", "size_label", "year", "note", "image", "sub_category", "is_sold", "is_active", "sort_order"],
    images: ["image"],
    flags: ["is_active", "is_sold"],
  },
  category_groups: { key: "slug", columns: ["name", "tagline", "image", "sort_order"], images: ["image"], flags: [] },
  subcategories: {
    key: "slug",
    columns: ["slug", "group_slug", "name", "image", "sort_order"],
    images: ["image"],
    flags: [],
  },
};

type Row = Record<string, unknown>;

async function requireAdmin() {
  const session = await getSession();
  if (!session.user) throw new Error("Your session has expired. Please sign in again.");
  if (!session.isAdmin) throw new Error("Your account doesn't have admin access.");
  return session;
}

function friendlyError(e: unknown): string {
  const err = e as { code?: string; message?: string };
  switch (err?.code) {
    case "23505":
      return "That slug / code is already in use. Please choose another.";
    case "23503":
      return "This item is still used elsewhere (for example by products). Move or delete those first.";
    case "23514":
      return "Some values aren't valid. Please check the form.";
    case "42501":
      return "You don't have permission to do that.";
    default:
      return err?.message || "Something went wrong. Please try again.";
  }
}

async function run(fn: () => Promise<void>): Promise<ActionResult> {
  try {
    await fn();
    // Refresh every storefront page that might show this content.
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
}

function pick(values: Row, columns: string[]) {
  return Object.fromEntries(Object.entries(values).filter(([k]) => columns.includes(k)));
}

/** Public URLs of images stored in our `media` bucket (external URLs are left alone). */
function mediaPaths(row: Row | null | undefined, fields: string[] = []) {
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`;
  return fields
    .flatMap((f) => {
      const v = row?.[f];
      return Array.isArray(v) ? v : [v];
    })
    .filter((u): u is string => typeof u === "string" && u.startsWith(prefix))
    .map((u) => decodeURIComponent(u.slice(prefix.length)));
}

/** Insert (no originalKey) or update a row. */
export async function saveRow(table: TableName, values: Row, originalKey?: string): Promise<ActionResult> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const cfg = TABLES[table];
    const data = pick(values, cfg.columns);
    if (table === "products") data.updated_at = new Date().toISOString();
    // "Gallery only" in the category dropdown means no category.
    if (table === "gallery_items" && !data.sub_category) data.sub_category = null;

    if (originalKey) {
      const { data: before } = await supabase.from(table).select("*").eq(cfg.key, originalKey).maybeSingle();
      const { data: updated, error } = await supabase.from(table).update(data).eq(cfg.key, originalKey).select(cfg.key);
      if (error) throw error;
      if (!updated?.length) throw new Error("Nothing was saved — the item may have been deleted.");
      const kept = new Set(mediaPaths(data, cfg.images));
      const removed = mediaPaths(before, cfg.images).filter((p) => !kept.has(p));
      if (removed.length) await supabase.storage.from("media").remove(removed);
    } else {
      // New items go to the end of the list.
      const { data: last } = await supabase.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
      data.sort_order = ((last?.[0]?.sort_order as number | undefined) ?? -1) + 1;
      const { error } = await supabase.from(table).insert(data);
      if (error) throw error;
    }
  });
}

export async function deleteRow(table: TableName, key: string): Promise<ActionResult> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const cfg = TABLES[table];
    const { data: before } = await supabase.from(table).select("*").eq(cfg.key, key).maybeSingle();
    const { data: deleted, error } = await supabase.from(table).delete().eq(cfg.key, key).select(cfg.key);
    if (error) throw error;
    if (!deleted?.length) throw new Error("Nothing was deleted — it may already be gone.");
    const paths = mediaPaths(before, cfg.images);
    if (paths.length) await supabase.storage.from("media").remove(paths);
  });
}

/** Turn a yes/no field (published, active, featured…) on or off. */
export async function setFlag(table: TableName, key: string, field: string, value: boolean): Promise<ActionResult> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const cfg = TABLES[table];
    if (!cfg.flags.includes(field)) throw new Error("That field can't be toggled.");
    const { error } = await supabase.from(table).update({ [field]: value }).eq(cfg.key, key);
    if (error) throw error;
  });
}

/** Save a new display order: keys listed first-to-last. */
export async function reorder(table: TableName, keys: string[]): Promise<ActionResult> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const cfg = TABLES[table];
    const results = await Promise.all(
      keys.map((k, i) => supabase.from(table).update({ sort_order: i }).eq(cfg.key, k)),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;
  });
}

export async function addAdmin(email: string): Promise<ActionResult> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new Error("Please enter a valid email address.");
    const { error } = await supabase.from("admins").insert({ email: clean });
    if (error?.code === "23505") throw new Error("That email is already an admin.");
    if (error) throw error;
  });
}

export async function removeAdmin(email: string): Promise<ActionResult> {
  return run(async () => {
    const { supabase, user } = await requireAdmin();
    if (email === user?.email.toLowerCase()) throw new Error("You can't remove your own admin access.");
    const { data: deleted, error } = await supabase.from("admins").delete().eq("email", email).select("email");
    if (error) throw error;
    if (!deleted?.length) throw new Error("That admin was not found.");
  });
}
