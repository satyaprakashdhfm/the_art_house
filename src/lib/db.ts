import type { CategoryGroup, Coupon, FAQ, GalleryItem, HeroSlide, Medium, Offer, Product, Testimonial } from "@/types";

/** Row shapes of the Supabase tables (see supabase/migrations). */
export type ProductRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  group_slug: string;
  sub_category: string;
  medium: string;
  style: string;
  type: string;
  orientation: string;
  sizes: string[];
  images: string[];
  rooms: string[];
  subjects: number;
  panels: number;
  is_bestseller: boolean;
  is_new: boolean;
  rating: number;
  review_count: number;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
};

export type GroupRow = { slug: string; name: string; tagline: string; image: string; sort_order: number };
export type SubRow = { slug: string; group_slug: string; name: string; image: string; sort_order: number };

export type HeroSlideRow = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  cta_label: string;
  cta_href: string;
  image: string;
  tone: "light" | "dark";
  is_active: boolean;
  sort_order: number;
};

export type GalleryItemRow = {
  id: string;
  title: string;
  medium: Medium;
  size_label: string;
  year: number | null;
  note: string;
  image: string;
  is_sold: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
};

export type AnnouncementRow = { id: string; message: string; is_active: boolean; sort_order: number };

export type CouponRow = {
  code: string;
  title: string;
  description: string;
  terms: string;
  percent: number;
  max_discount: number | null;
  min_items: number;
  group_slugs: string[];
  sub_slugs: string[];
  is_active: boolean;
  sort_order: number;
};

export type OfferRow = { id: string; title: string; text: string; is_active: boolean; sort_order: number };

export type TestimonialRow = {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  date_label: string;
  show_on_home: boolean;
  is_active: boolean;
  sort_order: number;
};

export type FAQRow = {
  id: string;
  section: "general" | "custom";
  question: string;
  answer: string;
  is_active: boolean;
  sort_order: number;
};

export function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    group: r.group_slug as Product["group"],
    subCategory: r.sub_category,
    medium: r.medium as Product["medium"],
    style: r.style as Product["style"],
    type: r.type as Product["type"],
    orientation: r.orientation as Product["orientation"],
    sizes: r.sizes,
    images: r.images,
    rooms: r.rooms as Product["rooms"],
    subjects: r.subjects,
    panels: r.panels,
    isBestseller: r.is_bestseller,
    isNew: r.is_new,
    rating: Number(r.rating),
    reviewCount: r.review_count,
    isPublished: r.is_published,
  };
}

export function toGroups(groups: GroupRow[], subs: SubRow[]): CategoryGroup[] {
  return groups.map((g) => ({
    slug: g.slug as CategoryGroup["slug"],
    name: g.name,
    tagline: g.tagline,
    image: g.image,
    subs: subs.filter((s) => s.group_slug === g.slug).map((s) => ({ slug: s.slug, name: s.name, image: s.image })),
  }));
}

export const toHeroSlide = (r: HeroSlideRow): HeroSlide => ({
  id: r.id,
  eyebrow: r.eyebrow,
  title: r.title,
  text: r.text,
  ctaLabel: r.cta_label,
  ctaHref: r.cta_href,
  image: r.image,
  tone: r.tone,
});

export const toCoupon = (r: CouponRow): Coupon => ({
  code: r.code,
  title: r.title,
  description: r.description,
  terms: r.terms,
  percent: Number(r.percent),
  maxDiscount: r.max_discount,
  minItems: r.min_items,
  groups: r.group_slugs,
  subs: r.sub_slugs,
});

export const toOffer = (r: OfferRow): Offer => ({ id: r.id, title: r.title, text: r.text });

export const toTestimonial = (r: TestimonialRow): Testimonial => ({
  id: r.id,
  name: r.name,
  city: r.city,
  rating: r.rating,
  text: r.text,
  date: r.date_label,
  showOnHome: r.show_on_home,
});

export const toFAQ = (r: FAQRow): FAQ => ({ id: r.id, section: r.section, q: r.question, a: r.answer });

export const toGalleryItem = (r: GalleryItemRow): GalleryItem => ({
  id: r.id,
  title: r.title,
  medium: r.medium,
  size: r.size_label,
  year: r.year,
  note: r.note,
  image: r.image,
  isSold: r.is_sold,
});
