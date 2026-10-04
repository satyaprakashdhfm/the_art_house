"use client";

import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { useWishlist, wishlistActions } from "@/context/wishlist";
import { cartActions } from "@/context/cart";
import { ui } from "@/context/ui";
import { useCatalog } from "@/context/catalog";
import { productPrice, startingPrice } from "@/lib/price";
import { formatINR } from "@/lib/format";
import type { Product } from "@/types";

export default function WishlistPage() {
  const ids = useWishlist();
  const catalog = useCatalog();
  const products = ids.map((id) => catalog.getProductById(id)).filter((p): p is Product => !!p);

  function moveToCart(p: Product) {
    // Smallest available size, no add-ons; the shopper can change it on the product page.
    const size = p.sizes.reduce((min, s) => (productPrice(p, s) < productPrice(p, min) ? s : min));
    cartActions.add(p, size, { frame: false, giftWrap: false, express: false });
    wishlistActions.remove(p.id);
    ui.toast(`Moved “${p.title}” to cart`);
  }

  return (
    <>
      <PageHeader title="Wishlist" crumbs={[{ label: "Wishlist" }]} />
      <div className="container-page py-12">
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-2xl">Your wishlist is empty</p>
            <p className="mt-2 text-sm text-muted">Tap the ♡ on any artwork to save it here.</p>
            <Link href="/shop" className="btn-primary mt-8">
              Discover art
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((p) => (
              <div key={p.id}>
                <Link href={`/product/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-line">
                    <Image src={p.images[0]} alt={p.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                  <p className="mt-3 text-sm group-hover:text-gold">{p.title}</p>
                  <p className="text-sm font-medium">From {formatINR(startingPrice(p))}</p>
                </Link>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => moveToCart(p)} className="btn-primary px-2 py-2 text-xs">
                    Move to cart
                  </button>
                  <button type="button" onClick={() => wishlistActions.remove(p.id)} className="btn-outline px-2 py-2 text-xs">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
