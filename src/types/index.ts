export type Medium = "pencil" | "oil" | "acrylic" | "digital";
export type Style = "abstract" | "modern" | "traditional" | "wall-art";
export type ProductType = "original" | "made-to-order" | "print";
export type Orientation = "portrait" | "landscape" | "square";
export type Room = "living" | "pooja" | "bedroom" | "office";

/** The four subject groups a painting belongs to. "Art Style" and "Medium" are attributes. */
export type SubjectGroup = "spiritual" | "portraits-people" | "animals" | "nature";
export type GroupSlug = SubjectGroup | "art-style" | "medium";

export type SubCategory = {
  slug: string;
  name: string;
  image: string;
};

export type CategoryGroup = {
  slug: GroupSlug;
  name: string;
  tagline: string;
  image: string;
  subs: SubCategory[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  group: SubjectGroup;
  subCategory: string;
  medium: Medium;
  style: Style;
  type: ProductType;
  orientation: Orientation;
  /** Size keys valid for this product's medium (see data/pricing.ts). */
  sizes: string[];
  images: string[];
  rooms: Room[];
  /** Number of people / pets in the artwork (portraits). */
  subjects: number;
  /** Number of panels for wall-art sets. */
  panels: number;
  isBestseller: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
};

export type Addons = {
  frame: boolean;
  giftWrap: boolean;
  express: boolean;
};

export type CartLine = {
  key: string;
  productId: string;
  size: string;
  addons: Addons;
  qty: number;
  /** Max quantity for this line (originals are one-of-a-kind). Older saved carts may not have it. */
  max?: number;
};

export type PaymentMethod = "online" | "cod";

export type Coupon = {
  code: string;
  title: string;
  description: string;
  /** Short rule text shown on offer cards. */
  terms: string;
  percent: number;
  maxDiscount: number | null;
  minItems: number;
  /** Restrict to these groups / sub-categories. Both empty = every product. */
  groups: string[];
  subs: string[];
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  /** "light" = dark text on a bright image, "dark" = white text on a dark image */
  tone: "light" | "dark";
};

export type Offer = { id: string; title: string; text: string };

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
  showOnHome: boolean;
};

export type FAQ = { id: string; section: "general" | "custom"; q: string; a: string };

/** Everything the storefront renders from the database. */
export type SiteData = {
  groups: CategoryGroup[];
  products: Product[];
  heroSlides: HeroSlide[];
  announcements: string[];
  coupons: Coupon[];
  offers: Offer[];
  testimonials: Testimonial[];
  faqs: FAQ[];
};
