/** "Radha Krishna in Vrindavan" → "radha-krishna-in-vrindavan" */
export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
