import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { MEDIUM_LABELS } from "@/lib/labels";
import type { GalleryItem } from "@/types";

/** Sold pieces from the Gallery, shown on a category or medium page. Not for sale: no price, links to the Gallery. */
export default function SoldWorks({ items, collection }: { items: GalleryItem[]; collection: string }) {
  if (items.length === 0) return null;

  return (
    <section className="container-page mt-16">
      <SectionHeading
        eyebrow="Sold"
        title={`${collection} pieces that found a home`}
        description="These originals are sold, but we can paint something similar for you."
        link={{ href: "/custom-art", label: "Commission a piece" }}
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {items.map((item) => (
          <Link key={item.id} href="/gallery" className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-line">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover grayscale-[15%] transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-ink px-2 py-1 text-[10px] font-medium tracking-widest text-paper uppercase">Sold</span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-[11px] tracking-wider text-muted uppercase">{MEDIUM_LABELS[item.medium]}</p>
              <h3 className="text-sm leading-snug group-hover:text-gold">{item.title}</h3>
              <p className="text-sm text-muted">Sold</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
