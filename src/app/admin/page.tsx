import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FolderTree, GalleryHorizontal, Palette, Plus, TicketPercent } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSession } from "@/lib/auth";
import type { ProductRow } from "@/lib/db";

export default async function AdminDashboard() {
  const { supabase, user } = await getSession();
  const count = async (table: string, filter?: [string, boolean]) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return (await q).count ?? 0;
  };

  const [products, published, slides, coupons, subs, recent] = await Promise.all([
    count("products"),
    count("products", ["is_published", true]),
    count("hero_slides", ["is_active", true]),
    count("coupons", ["is_active", true]),
    count("subcategories"),
    supabase.from("products").select("*").order("updated_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Products", value: products, note: `${published} live on the website`, href: "/admin/products", icon: Palette },
    { label: "Homepage slides", value: slides, note: "showing in the slideshow", href: "/admin/hero", icon: GalleryHorizontal },
    { label: "Active coupons", value: coupons, note: "customers can use", href: "/admin/offers", icon: TicketPercent },
    { label: "Sub-categories", value: subs, note: "across 6 groups", href: "/admin/categories", icon: FolderTree },
  ];

  return (
    <>
      <AdminPageHeader
        title={`Hello, ${user!.name.split(" ")[0]}`}
        description="Manage everything on the Verona Arts website. Changes go live as soon as you save."
        actions={
          <Link href="/admin/products/new" className="btn-primary px-4 py-2.5">
            <Plus className="h-4 w-4" /> Add product
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, note, href, icon: Icon }) => (
          <Link key={label} href={href} className="group border border-line bg-paper p-5 transition hover:border-gold hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-gold" />
            </div>
            <p className="mt-4 font-serif text-3xl">{value}</p>
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-0.5 text-xs text-muted">{note}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-lg">Recently updated products</h2>
          <Link href="/admin/products" className="text-sm text-gold-dark hover:underline">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {(recent.data as ProductRow[] | null)?.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/products/${p.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-card/60">
                <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-card">
                  {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted capitalize">
                    {p.medium} · {p.type.replace(/-/g, " ")}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] ${p.is_published ? "bg-green-50 text-green-700" : "bg-line text-muted"}`}>
                  {p.is_published ? "Live" : "Hidden"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/admin/hero", title: "Change the homepage slideshow", text: "Upload new banner images and edit their text." },
          { href: "/admin/offers", title: "Run a sale", text: "Create a coupon code and add it to the announcement bar." },
          { href: "/admin/categories", title: "Refresh category images", text: "Update the pictures shown for each collection." },
        ].map((t) => (
          <Link key={t.href} href={t.href} className="border border-line bg-card p-5 transition hover:border-gold">
            <p className="font-medium">{t.title}</p>
            <p className="mt-1 text-sm text-muted">{t.text}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
