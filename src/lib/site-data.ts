import { cache } from "react";
import type { GalleryItem, SiteData } from "@/types";
import { createCatalog } from "@/lib/catalog";
import { createPublicClient } from "@/lib/supabase/public";
import {
  toCoupon,
  toFAQ,
  toGalleryItem,
  toGroups,
  toHeroSlide,
  toOffer,
  toProduct,
  toTestimonial,
  type AnnouncementRow,
  type CouponRow,
  type FAQRow,
  type GalleryItemRow,
  type GroupRow,
  type HeroSlideRow,
  type OfferRow,
  type ProductRow,
  type SubRow,
  type TestimonialRow,
} from "@/lib/db";

/** Loads everything the storefront shows. RLS only returns published / active rows to the public. */
export const getSiteData = cache(async (): Promise<SiteData> => {
  const db = createPublicClient();
  const [groups, subs, products, slides, announcements, coupons, offers, testimonials, faqs] = await Promise.all([
    db.from("category_groups").select("*").order("sort_order"),
    db.from("subcategories").select("*").order("sort_order"),
    db.from("products").select("*").eq("is_published", true).order("sort_order"),
    db.from("hero_slides").select("*").eq("is_active", true).order("sort_order"),
    db.from("announcements").select("*").eq("is_active", true).order("sort_order"),
    db.from("coupons").select("*").eq("is_active", true).order("sort_order"),
    db.from("offers").select("*").eq("is_active", true).order("sort_order"),
    db.from("testimonials").select("*").eq("is_active", true).order("sort_order"),
    db.from("faqs").select("*").eq("is_active", true).order("sort_order"),
  ]);

  const failed = [groups, subs, products, slides, announcements, coupons, offers, testimonials, faqs].find((r) => r.error);
  if (failed?.error) throw new Error(`Could not load site data: ${failed.error.message}`);

  return {
    groups: toGroups(groups.data as GroupRow[], subs.data as SubRow[]),
    products: (products.data as ProductRow[]).map(toProduct),
    heroSlides: (slides.data as HeroSlideRow[]).map(toHeroSlide),
    announcements: (announcements.data as AnnouncementRow[]).map((a) => a.message),
    coupons: (coupons.data as CouponRow[]).map(toCoupon),
    offers: (offers.data as OfferRow[]).map(toOffer),
    testimonials: (testimonials.data as TestimonialRow[]).map(toTestimonial),
    faqs: (faqs.data as FAQRow[]).map(toFAQ),
  };
});

export async function getCatalog() {
  return createCatalog(await getSiteData());
}

/** Finished / sold works for /gallery. Loaded separately so other pages don't fetch them. */
export const getGallery = cache(async (): Promise<GalleryItem[]> => {
  const { data, error } = await createPublicClient().from("gallery_items").select("*").eq("is_active", true).order("sort_order");
  if (error) throw new Error(`Could not load gallery: ${error.message}`);
  return (data as GalleryItemRow[]).map(toGalleryItem);
});
