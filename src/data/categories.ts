import type { CategoryGroup, GroupSlug } from "@/types";
import { placeholder } from "@/lib/images";

const sub = (slug: string, name: string) => ({
  slug,
  name,
  image: placeholder(`sub-${slug}`, 600, 600),
});

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: "spiritual",
    name: "Spiritual",
    tagline: "Divine art for your home and pooja room",
    image: placeholder("group-spiritual", 1200, 800),
    subs: [
      sub("radha-krishna", "Radha Krishna"),
      sub("buddha", "Buddha"),
      sub("ganesha", "Ganesha"),
      sub("shiva", "Shiva"),
      sub("other-gods", "Other Gods"),
    ],
  },
  {
    slug: "portraits-people",
    name: "Portraits & People",
    tagline: "Faces, moments and the people you love",
    image: placeholder("group-portraits", 1200, 800),
    subs: [
      sub("portraits", "Portraits"),
      sub("pencil-portraits", "Pencil Portraits"),
      sub("people", "People"),
      sub("couple-art", "Couple Art"),
    ],
  },
  {
    slug: "animals",
    name: "Animals",
    tagline: "From loyal companions to the wild",
    image: placeholder("group-animals", 1200, 800),
    subs: [
      sub("horses", "Horses"),
      sub("dogs", "Dogs"),
      sub("cats", "Cats"),
      sub("wildlife", "Wildlife"),
    ],
  },
  {
    slug: "nature",
    name: "Nature",
    tagline: "Blooms, horizons and quiet places",
    image: placeholder("group-nature", 1200, 800),
    subs: [
      sub("flowers", "Flowers"),
      sub("bouquets", "Bouquets"),
      sub("landscapes", "Landscapes"),
      sub("scenery", "Scenery"),
    ],
  },
  {
    slug: "art-style",
    name: "Art Style",
    tagline: "Find the look that fits your space",
    image: placeholder("group-style", 1200, 800),
    subs: [
      sub("abstract", "Abstract"),
      sub("modern", "Modern"),
      sub("traditional", "Traditional"),
      sub("wall-art", "Wall Art"),
    ],
  },
  {
    slug: "medium",
    name: "Medium",
    tagline: "Graphite, oils, acrylics and pixels",
    image: placeholder("group-medium", 1200, 800),
    subs: [
      sub("pencil", "Pencil"),
      sub("oil", "Oil"),
      sub("acrylic", "Acrylic"),
      sub("digital", "Digital"),
    ],
  },
];

export function getGroup(slug: string) {
  return CATEGORY_GROUPS.find((g) => g.slug === slug);
}

export function getSub(groupSlug: string, subSlug: string) {
  return getGroup(groupSlug)?.subs.find((s) => s.slug === subSlug);
}

export function subName(subSlug: string) {
  for (const g of CATEGORY_GROUPS) {
    const s = g.subs.find((x) => x.slug === subSlug);
    if (s) return s.name;
  }
  return subSlug;
}

export function groupName(slug: GroupSlug) {
  return getGroup(slug)?.name ?? slug;
}

export const MEDIUM_LABELS = {
  pencil: "Pencil",
  oil: "Oil",
  acrylic: "Acrylic",
  digital: "Digital",
} as const;

export const STYLE_LABELS = {
  abstract: "Abstract",
  modern: "Modern",
  traditional: "Traditional",
  "wall-art": "Wall Art",
} as const;

export const TYPE_LABELS = {
  original: "Ready to ship (Original)",
  "made-to-order": "Made to order",
  print: "Print",
} as const;

export const ROOM_LABELS = {
  living: "Living Room",
  pooja: "Pooja Room",
  bedroom: "Bedroom",
  office: "Office",
} as const;
