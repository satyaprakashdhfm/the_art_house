/** Display names for the fixed product attributes (these drive pricing, so they stay in code). */

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
  madhubani: "Madhubani",
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

export const ORIENTATION_LABELS = { portrait: "Portrait", landscape: "Landscape", square: "Square" } as const;

/** Groups that products belong to. "Art Style" and "Medium" are attribute views. */
export const SUBJECT_GROUPS = ["spiritual", "portraits-people", "animals", "nature"] as const;
