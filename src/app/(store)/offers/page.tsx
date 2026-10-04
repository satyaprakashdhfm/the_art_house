import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import CopyCode from "@/components/ui/CopyCode";
import { getCatalog } from "@/lib/site-data";
import { couponIsScoped } from "@/lib/catalog";
import { subHref } from "@/components/layout/nav";
import type { GroupSlug } from "@/types";

export const metadata: Metadata = {
  title: "Offers",
  description: "Current coupons, festive sales and free-shipping offers at Verona Arts.",
};

export default async function OffersPage() {
  const catalog = await getCatalog();
  // Category-specific coupons get a feature banner linking to the matching collection.
  const featured = catalog.coupons.filter(couponIsScoped).slice(0, 2).map((c) => {
    const sub = c.subs[0];
    const group = sub ? catalog.groupOfSub(sub) : undefined;
    const href = c.groups[0] ? `/categories#${c.groups[0]}` : sub && group ? subHref(group as GroupSlug, sub) : "/shop";
    return { ...c, href };
  });

  return (
    <>
      <PageHeader title="Offers" description="Save on originals, prints and custom art." crumbs={[{ label: "Offers" }]} />
      <div className="container-page py-14">
        <h2 className="font-serif text-2xl">Coupon codes</h2>
        <p className="mt-1 text-sm text-muted">One coupon per order. Apply it in your cart or at checkout.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.coupons.map((c) => (
            <div key={c.code} className="flex flex-col border border-line bg-card p-6">
              <p className="font-serif text-xl">{c.title}</p>
              <p className="mt-2 text-sm text-muted">{c.description}</p>
              <p className="mt-2 text-xs text-muted">{c.terms}</p>
              <div className="mt-auto pt-6">
                <CopyCode code={c.code} />
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-16 font-serif text-2xl">Always on</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.offers.map((o) => (
            <div key={o.id} className="border-l-2 border-gold bg-card p-5">
              <p className="font-medium">{o.title}</p>
              <p className="mt-1 text-sm text-muted">{o.text}</p>
            </div>
          ))}
        </div>

        {featured.length > 0 && (
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {featured.map((c, i) =>
              i === 0 ? (
                <Link key={c.code} href={c.href} className="bg-ink p-10 text-paper transition-colors hover:bg-gold-dark">
                  <p className="text-xs tracking-[0.25em] text-gold uppercase">Featured offer</p>
                  <p className="mt-3 font-serif text-3xl">{c.title}</p>
                  <p className="mt-2 text-sm text-paper/70">
                    Use {c.code} · {c.description}
                  </p>
                </Link>
              ) : (
                <Link key={c.code} href={c.href} className="border border-ink p-10 transition-colors hover:bg-card">
                  <p className="eyebrow">Featured offer</p>
                  <p className="mt-3 font-serif text-3xl">{c.title}</p>
                  <p className="mt-2 text-sm text-muted">
                    Use {c.code} · {c.description}
                  </p>
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </>
  );
}
