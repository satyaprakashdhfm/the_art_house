import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Brush, Flower2, Mountain, Palette, PawPrint, Users, type LucideIcon } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { getCatalog } from "@/lib/site-data";
import { groupShopHref, subHref } from "@/components/layout/nav";
import type { GroupSlug } from "@/types";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore spiritual art, portraits, animals, nature, art styles and mediums.",
};

/** The "Explore all" card at the end of each group's row. */
const EXPLORE: Record<GroupSlug, { label: string; icon: LucideIcon }> = {
  spiritual: { label: "Spiritual Art", icon: Flower2 },
  "portraits-people": { label: "Portraits & People", icon: Users },
  animals: { label: "Animal Art", icon: PawPrint },
  nature: { label: "Nature Art", icon: Mountain },
  "art-style": { label: "Art Styles", icon: Palette },
  medium: { label: "Mediums", icon: Brush },
};

function ArrowCircle({ className }: { className: string }) {
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${className}`}>
      <ArrowRight className="h-4 w-4" />
    </span>
  );
}

export default async function CategoriesPage() {
  const { groups } = await getCatalog();

  return (
    <>
      <PageHeader
        title="Categories"
        description="Explore our collections by subject, style and medium."
        crumbs={[{ label: "Categories" }]}
        aside={
          <div className="text-right">
            <span className="ml-auto block h-px w-12 bg-gold" />
            <p className="my-4 font-serif text-2xl leading-snug">
              Art for every space,
              <br />
              story and emotion.
            </p>
            <span className="ml-auto block h-px w-12 bg-gold" />
          </div>
        }
      />
      <div className="container-page space-y-14 py-12">
        {groups.map((g) => {
          const explore = EXPLORE[g.slug];
          const Icon = explore.icon;
          return (
            <section key={g.slug} id={g.slug} className="scroll-mt-28">
              <p className="eyebrow">{g.tagline}</p>
              <h2 className="heading mt-1 mb-5">{g.name}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex">
                {g.subs.map((s) => (
                  <Link
                    key={s.slug}
                    href={subHref(g.slug, s.slug)}
                    className="group relative aspect-[16/10] overflow-hidden rounded-md bg-line lg:aspect-auto lg:h-36 lg:flex-1"
                  >
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4 text-white">
                      <span className="text-base font-medium sm:text-lg">{s.name}</span>
                      <ArrowCircle className="border-white/80 group-hover:bg-white group-hover:text-ink" />
                    </div>
                  </Link>
                ))}
                <Link
                  href={groupShopHref(g.slug)}
                  className="group flex aspect-[16/10] flex-col justify-between rounded-md border border-line bg-card p-4 transition-colors hover:border-gold lg:aspect-auto lg:h-36 lg:w-44 lg:shrink-0"
                >
                  <Icon className="h-8 w-8 text-gold" strokeWidth={1.25} />
                  <div className="flex items-end justify-between gap-2">
                    <p className="text-sm leading-snug">
                      Explore all
                      <br />
                      {explore.label}
                    </p>
                    <ArrowCircle className="border-gold text-gold group-hover:bg-gold group-hover:text-paper" />
                  </div>
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
