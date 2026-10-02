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
  /** Number of people / pets in the artwork (portraits). Defaults to 1. */
  subjects?: number;
  /** Number of panels for wall-art sets. Defaults to 1. */
  panels?: number;
  isBestseller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
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
};

export type PaymentMethod = "online" | "cod";

export type Coupon = {
  code: string;
  title: string;
  description: string;
  /** Short rule text shown on offer cards. */
  terms: string;
};
