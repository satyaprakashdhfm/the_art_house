import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import WishlistButton from "@/components/product/WishlistButton";
import { MEDIUM_LABELS } from "@/data/categories";
import { startingPrice } from "@/lib/price";
import { formatINR } from "@/lib/format";

function Badge({ product }: { product: Product }) {
  const text = product.type === "original" ? "Original" : product.isNew ? "New" : product.isBestseller ? "Bestseller" : null;
  if (!text) return null;
  return (
    <span className="absolute top-3 left-3 bg-paper/95 px-2 py-1 text-[10px] font-medium tracking-widest uppercase">
      {text}
    </span>
  );
}

export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const from = startingPrice(product);
  const single = product.sizes.length === 1;

  return (
    <article className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-line">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge product={product} />
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-[11px] tracking-wider text-muted uppercase">{MEDIUM_LABELS[product.medium]}</p>
          <h3 className="text-sm leading-snug group-hover:text-gold">{product.title}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {single ? "" : "From "}
              {formatINR(from)}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <Star className="h-3 w-3 fill-gold text-gold" /> {product.rating}
            </p>
          </div>
        </div>
      </Link>
      <WishlistButton
        productId={product.id}
        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/95 hover:text-sale"
      />
    </article>
  );
}
