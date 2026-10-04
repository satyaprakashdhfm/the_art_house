import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { getCatalog } from "@/lib/site-data";
import { subHref } from "@/components/layout/nav";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore spiritual art, portraits, animals, nature, art styles and mediums.",
};

export default async function CategoriesPage() {
  const { groups } = await getCatalog();

  return (
    <>
      <PageHeader
        title="Categories"
        description="Explore our collections by subject, style and medium."
        crumbs={[{ label: "Categories" }]}
      />
      <div className="container-page space-y-20 py-14">
        {groups.map((g) => (
          <section key={g.slug} id={g.slug} className="scroll-mt-28">
            <div className="mb-6">
              <p className="eyebrow">{g.tagline}</p>
              <h2 className="heading mt-2">{g.name}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {g.subs.map((s) => (
                <Link key={s.slug} href={subHref(g.slug, s.slug)} className="group">
                  <div className="relative aspect-square overflow-hidden bg-line">
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-sm group-hover:text-gold">{s.name}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
