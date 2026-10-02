import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import ShopView, { type LockedFilters } from "@/components/shop/ShopView";
import { CATEGORY_GROUPS, getGroup, getSub } from "@/data/categories";
import { subHref } from "@/components/layout/nav";

export function generateStaticParams() {
  return CATEGORY_GROUPS.flatMap((g) => g.subs.map((s) => ({ group: g.slug, sub: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/categories/[group]/[sub]">): Promise<Metadata> {
  const { group, sub } = await params;
  const s = getSub(group, sub);
  if (!s) return {};
  return {
    title: `${s.name} Paintings`,
    description: `Buy ${s.name.toLowerCase()} paintings online — handmade pencil, oil, acrylic and digital art.`,
  };
}

function lockedFor(group: string, sub: string): LockedFilters {
  if (group === "art-style") return { style: sub };
  if (group === "medium") return { medium: sub };
  return { group, sub };
}

export default async function SubCategoryPage({ params }: PageProps<"/categories/[group]/[sub]">) {
  const { group, sub } = await params;
  const g = getGroup(group);
  const s = getSub(group, sub);
  if (!g || !s) notFound();

  return (
    <>
      <PageHeader
        title={`${s.name} Paintings`}
        description={`Handpicked ${s.name.toLowerCase()} artworks — ${g.tagline.toLowerCase()}.`}
        crumbs={[{ href: "/categories", label: "Categories" }, { href: `/categories#${g.slug}`, label: g.name }, { label: s.name }]}
      />
      <div className="container-page no-scrollbar flex gap-2 overflow-x-auto pt-6">
        {g.subs.map((x) => (
          <Link
            key={x.slug}
            href={subHref(g.slug, x.slug)}
            className={`shrink-0 border px-4 py-2 text-sm ${x.slug === s.slug ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"}`}
          >
            {x.name}
          </Link>
        ))}
      </div>
      <Suspense fallback={<div className="container-page py-20 text-center text-muted">Loading…</div>}>
        <ShopView locked={lockedFor(group, sub)} />
      </Suspense>
      <section className="container-page mt-8 max-w-3xl">
        <h2 className="font-serif text-xl">About our {s.name} collection</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Every {s.name.toLowerCase()} artwork at The Art House is created by hand (or digitally painted) by our artist,
          signed and shipped with a Certificate of Authenticity. Choose a ready original, or order any design in the size
          that fits your wall. Want something personal? Try our{" "}
          <Link href="/custom-art" className="underline">
            custom art service
          </Link>
          .
        </p>
      </section>
    </>
  );
}
