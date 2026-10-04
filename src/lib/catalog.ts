import type { Coupon, Product, SiteData, Testimonial } from "@/types";

/** Lookup helpers over the site data. Pure, so it works on the server and in the browser. */
export function createCatalog(data: SiteData) {
  const productsById = new Map(data.products.map((p) => [p.id, p]));
  const productsBySlug = new Map(data.products.map((p) => [p.slug, p]));
  const subs = data.groups.flatMap((g) => g.subs.map((s) => ({ ...s, group: g.slug })));

  return {
    ...data,

    getGroup(slug: string) {
      return data.groups.find((g) => g.slug === slug);
    },
    getSub(groupSlug: string, subSlug: string) {
      return data.groups.find((g) => g.slug === groupSlug)?.subs.find((s) => s.slug === subSlug);
    },
    /** Group a sub-category belongs to (used for links). */
    groupOfSub(subSlug: string) {
      return subs.find((s) => s.slug === subSlug)?.group;
    },
    subName(subSlug: string) {
      return subs.find((s) => s.slug === subSlug)?.name ?? subSlug;
    },
    groupName(slug: string) {
      return data.groups.find((g) => g.slug === slug)?.name ?? slug;
    },

    getProduct(slug: string) {
      return productsBySlug.get(slug);
    },
    getProductById(id: string) {
      return productsById.get(id);
    },
    relatedProducts(product: Product, limit = 4) {
      return data.products.filter((p) => p.id !== product.id && p.group === product.group).slice(0, limit);
    },

    findCoupon(code: string) {
      return data.coupons.find((c) => c.code === code.trim().toUpperCase());
    },
    /** Coupons worth advertising on a product page. */
    couponsFor(product: Product) {
      return data.coupons.filter((c) =>
        couponIsScoped(c)
          ? c.groups.includes(product.group) || c.subs.includes(product.subCategory)
          : c.minItems <= 1,
      );
    },

    /** Deterministic sample of reviews for a product. */
    reviewsFor(productId: string, count = 3): Testimonial[] {
      const pool = data.testimonials;
      if (pool.length === 0) return [];
      const offset = [...productId].reduce((n, ch) => n + ch.charCodeAt(0), 0) % pool.length;
      return Array.from({ length: Math.min(count, pool.length) }, (_, i) => pool[(offset + i) % pool.length]);
    },
  };
}

export type Catalog = ReturnType<typeof createCatalog>;

export function couponIsScoped(c: Coupon) {
  return c.groups.length > 0 || c.subs.length > 0;
}
