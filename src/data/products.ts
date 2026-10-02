import type { Medium, Orientation, Product, ProductType, Room, Style, SubjectGroup } from "@/types";
import { SIZES } from "@/data/pricing";
import { imageFor } from "@/lib/images";
import { MEDIUM_LABELS, subName } from "@/data/categories";

type Seed = {
  title: string;
  group: SubjectGroup;
  sub: string;
  medium: Medium;
  style: Style;
  type: ProductType;
  orientation: Orientation;
  rooms: Room[];
  /** Fixed size for one-of-a-kind originals. */
  size?: string;
  subjects?: number;
  panels?: number;
  bestseller?: boolean;
  isNew?: boolean;
};

const SEEDS: Seed[] = [
  // Spiritual
  { title: "Radha Krishna in Vrindavan", group: "spiritual", sub: "radha-krishna", medium: "oil", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["pooja", "living"], bestseller: true },
  { title: "Flute of Krishna", group: "spiritual", sub: "radha-krishna", medium: "acrylic", style: "modern", type: "original", orientation: "portrait", rooms: ["living"], size: "18x24", isNew: true },
  { title: "Radha Krishna Line Sketch", group: "spiritual", sub: "radha-krishna", medium: "pencil", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["pooja", "bedroom"] },
  { title: "Serene Buddha", group: "spiritual", sub: "buddha", medium: "acrylic", style: "modern", type: "made-to-order", orientation: "square", rooms: ["living", "office"], bestseller: true },
  { title: "Golden Buddha Meditation", group: "spiritual", sub: "buddha", medium: "oil", style: "traditional", type: "original", orientation: "portrait", rooms: ["living"], size: "24x36" },
  { title: "Buddha Abstract Triptych", group: "spiritual", sub: "buddha", medium: "acrylic", style: "wall-art", type: "made-to-order", orientation: "landscape", rooms: ["living"], panels: 3 },
  { title: "Vighnaharta Ganesha", group: "spiritual", sub: "ganesha", medium: "oil", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["pooja", "living"], bestseller: true },
  { title: "Ganesha in Colour", group: "spiritual", sub: "ganesha", medium: "digital", style: "modern", type: "print", orientation: "square", rooms: ["office", "living"], isNew: true },
  { title: "Mahadev in Meditation", group: "spiritual", sub: "shiva", medium: "acrylic", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["pooja", "living"] },
  { title: "Shiva Tandava", group: "spiritual", sub: "shiva", medium: "digital", style: "modern", type: "print", orientation: "portrait", rooms: ["living", "office"] },
  { title: "Lakshmi Blessings", group: "spiritual", sub: "other-gods", medium: "oil", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["pooja"] },
  { title: "Hanuman Devotion", group: "spiritual", sub: "other-gods", medium: "pencil", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["pooja", "bedroom"] },

  // Portraits & People
  { title: "Classic Oil Portrait", group: "portraits-people", sub: "portraits", medium: "oil", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["living", "bedroom"], bestseller: true },
  { title: "Family Portrait (3 People)", group: "portraits-people", sub: "portraits", medium: "acrylic", style: "modern", type: "made-to-order", orientation: "landscape", rooms: ["living"], subjects: 3 },
  { title: "Graphite Pencil Portrait", group: "portraits-people", sub: "pencil-portraits", medium: "pencil", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["bedroom", "office"], bestseller: true },
  { title: "Grandparents Pencil Sketch", group: "portraits-people", sub: "pencil-portraits", medium: "pencil", style: "traditional", type: "made-to-order", orientation: "landscape", rooms: ["living"], subjects: 2 },
  { title: "Village Woman at Dusk", group: "portraits-people", sub: "people", medium: "oil", style: "traditional", type: "original", orientation: "portrait", rooms: ["living"], size: "18x24" },
  { title: "Street Musicians", group: "portraits-people", sub: "people", medium: "digital", style: "modern", type: "print", orientation: "landscape", rooms: ["office", "living"], isNew: true },
  { title: "Couple Under the Stars", group: "portraits-people", sub: "couple-art", medium: "acrylic", style: "modern", type: "made-to-order", orientation: "portrait", rooms: ["bedroom"], bestseller: true },
  { title: "Wedding Day Sketch", group: "portraits-people", sub: "couple-art", medium: "pencil", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["bedroom", "living"] },

  // Animals
  { title: "Seven Running Horses", group: "animals", sub: "horses", medium: "oil", style: "traditional", type: "made-to-order", orientation: "landscape", rooms: ["living", "office"], bestseller: true },
  { title: "White Stallion", group: "animals", sub: "horses", medium: "acrylic", style: "modern", type: "original", orientation: "portrait", rooms: ["office"], size: "24x36" },
  { title: "Golden Retriever Portrait", group: "animals", sub: "dogs", medium: "oil", style: "traditional", type: "made-to-order", orientation: "square", rooms: ["living", "bedroom"] },
  { title: "Playful Pup Sketch", group: "animals", sub: "dogs", medium: "pencil", style: "traditional", type: "made-to-order", orientation: "square", rooms: ["bedroom"], isNew: true },
  { title: "Curious Cat", group: "animals", sub: "cats", medium: "digital", style: "modern", type: "print", orientation: "portrait", rooms: ["bedroom", "office"] },
  { title: "Royal Bengal Tiger", group: "animals", sub: "wildlife", medium: "acrylic", style: "traditional", type: "made-to-order", orientation: "landscape", rooms: ["living", "office"] },
  { title: "Elephant Family", group: "animals", sub: "wildlife", medium: "pencil", style: "traditional", type: "made-to-order", orientation: "landscape", rooms: ["living"] },

  // Nature
  { title: "Lotus Pond", group: "nature", sub: "flowers", medium: "oil", style: "traditional", type: "original", orientation: "landscape", rooms: ["living", "pooja"], size: "18x24", bestseller: true },
  { title: "Wild Poppies", group: "nature", sub: "flowers", medium: "acrylic", style: "abstract", type: "made-to-order", orientation: "square", rooms: ["bedroom", "living"] },
  { title: "Spring Bouquet", group: "nature", sub: "bouquets", medium: "oil", style: "modern", type: "made-to-order", orientation: "portrait", rooms: ["bedroom", "living"], isNew: true },
  { title: "Roses in a Vase", group: "nature", sub: "bouquets", medium: "digital", style: "traditional", type: "print", orientation: "portrait", rooms: ["bedroom"] },
  { title: "Himalayan Morning", group: "nature", sub: "landscapes", medium: "oil", style: "traditional", type: "made-to-order", orientation: "landscape", rooms: ["living", "office"] },
  { title: "Kerala Backwaters", group: "nature", sub: "landscapes", medium: "acrylic", style: "modern", type: "made-to-order", orientation: "landscape", rooms: ["living"] },
  { title: "Golden Hour Fields", group: "nature", sub: "scenery", medium: "acrylic", style: "abstract", type: "original", orientation: "landscape", rooms: ["office", "living"], size: "24x36", isNew: true },
  { title: "Monsoon Scenery Diptych", group: "nature", sub: "scenery", medium: "digital", style: "wall-art", type: "print", orientation: "landscape", rooms: ["living", "office"], panels: 2 },
  { title: "Misty Forest Path", group: "nature", sub: "scenery", medium: "pencil", style: "traditional", type: "made-to-order", orientation: "portrait", rooms: ["bedroom", "office"] },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function describe(s: Seed) {
  const medium = MEDIUM_LABELS[s.medium].toLowerCase();
  const subject = subName(s.sub);
  const kind =
    s.type === "original"
      ? "a one-of-a-kind original, ready to ship"
      : s.type === "print"
        ? "a digital artwork, available as a high-resolution file or a premium archival print"
        : "hand-painted to order in our studio";
  return `“${s.title}” is a ${medium} artwork from our ${subject} collection — ${kind}. Every piece is finished with care, signed by the artist and shipped with a Certificate of Authenticity.`;
}

export const PRODUCTS: Product[] = SEEDS.map((s, i) => {
  const slug = slugify(s.title);
  const sizes = s.size ? [s.size] : SIZES[s.medium].map((x) => x.key);
  return {
    id: `p${String(i + 1).padStart(3, "0")}`,
    slug,
    title: s.title,
    description: describe(s),
    group: s.group,
    subCategory: s.sub,
    medium: s.medium,
    style: s.style,
    type: s.type,
    orientation: s.orientation,
    sizes,
    images: [1, 2, 3].map((n) => imageFor(`${slug}-${n}`, s.orientation)),
    rooms: s.rooms,
    subjects: s.subjects,
    panels: s.panels,
    isBestseller: s.bestseller,
    isNew: s.isNew,
    rating: Math.round((4.3 + ((i * 7) % 7) / 10) * 10) / 10,
    reviewCount: 8 + ((i * 13) % 90),
  };
});

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function relatedProducts(product: Product, limit = 4) {
  return PRODUCTS.filter((p) => p.id !== product.id && p.group === product.group).slice(0, limit);
}
