"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { saveRow } from "@/app/admin/actions";
import { Chips, Field, Toggle } from "@/components/admin/fields";
import { ImageListUpload } from "@/components/admin/ImageUpload";
import { ui } from "@/context/ui";
import { SIZES } from "@/data/pricing";
import { toProduct, type GroupRow, type ProductRow, type SubRow } from "@/lib/db";
import { formatINR } from "@/lib/format";
import { MEDIUM_LABELS, ORIENTATION_LABELS, ROOM_LABELS, STYLE_LABELS, SUBJECT_GROUPS, TYPE_LABELS } from "@/lib/labels";
import { productPrice } from "@/lib/price";
import { slugify } from "@/lib/slug";
import type { Medium } from "@/types";

const opts = (labels: Record<string, string>) => Object.entries(labels).map(([value, label]) => ({ value, label }));

export const NEW_PRODUCT: ProductRow = {
  id: "",
  slug: "",
  title: "",
  description: "",
  group_slug: "spiritual",
  sub_category: "radha-krishna",
  medium: "acrylic",
  style: "traditional",
  type: "made-to-order",
  orientation: "portrait",
  sizes: SIZES.acrylic.map((s) => s.key),
  images: [],
  rooms: ["living"],
  subjects: 1,
  panels: 1,
  is_bestseller: false,
  is_new: true,
  rating: 4.8,
  review_count: 0,
  is_published: true,
  sort_order: 0,
};

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-paper p-6">
      <h2 className="font-serif text-lg">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function ProductForm({ initial, groups, subs }: { initial: ProductRow | null; groups: GroupRow[]; subs: SubRow[] }) {
  const router = useRouter();
  const isNew = !initial;
  const [p, setP] = useState<ProductRow>(initial ?? NEW_PRODUCT);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [saving, start] = useTransition();

  const set = <K extends keyof ProductRow>(key: K, value: ProductRow[K]) => setP((x) => ({ ...x, [key]: value }));
  const groupSubs = subs.filter((s) => s.group_slug === p.group_slug);
  const sizeOptions = SIZES[p.medium as Medium];

  function changeMedium(medium: Medium) {
    // Size keys differ per medium, so reset to every size for the new medium.
    setP((x) => ({ ...x, medium, sizes: SIZES[medium].map((s) => s.key) }));
  }

  function changeGroup(group: string) {
    setP((x) => ({ ...x, group_slug: group, sub_category: subs.find((s) => s.group_slug === group)?.slug ?? "" }));
  }

  function changeTitle(title: string) {
    setP((x) => ({ ...x, title, slug: slugTouched ? x.slug : slugify(title) }));
  }

  // Keep the size list in the medium's natural order.
  const orderedSizes = sizeOptions.filter((s) => p.sizes.includes(s.key));
  const product = toProduct({ ...p, sizes: orderedSizes.map((s) => s.key) });

  function save() {
    setError(null);
    if (!p.title.trim()) return setError("Please enter a title.");
    if (!p.slug.trim()) return setError("Please enter a web address (slug).");
    if (!p.sub_category) return setError("Please choose a sub-category.");
    if (orderedSizes.length === 0) return setError("Choose at least one size.");
    if (p.images.length === 0) return setError("Upload at least one image.");

    const data = { ...p, slug: slugify(p.slug), sizes: orderedSizes.map((s) => s.key) };
    start(async () => {
      const res = await saveRow("products", data, initial?.id);
      if (!res.ok) return setError(res.error);
      ui.toast(isNew ? `“${p.title}” added` : "Changes saved");
      router.push("/admin/products");
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> All products
          </Link>
          <h1 className="mt-2 font-serif text-3xl">{isNew ? "Add a product" : p.title || "Untitled"}</h1>
        </div>
        <div className="flex gap-2">
          {!isNew && initial.is_published && (
            <Link href={`/product/${initial.slug}`} target="_blank" className="btn-outline px-4 py-2.5">
              <ExternalLink className="h-4 w-4" /> View on website
            </Link>
          )}
          <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} {isNew ? "Add product" : "Save changes"}
          </button>
        </div>
      </div>
      {error && <p className="-mt-4 mb-6 border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Section title="Images" description="The first image is the cover. Upload clear photos of the artwork; portrait 4:5 works best.">
            <ImageListUpload value={p.images} onChange={(v) => set("images", v)} folder="products" />
          </Section>

          <Section title="Details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Title" className="sm:col-span-2">
                <input value={p.title} onChange={(e) => changeTitle(e.target.value)} className="input" placeholder="e.g. Radha Krishna in Vrindavan" />
              </Field>
              <Field label="Web address" help={`Page link: /product/${slugify(p.slug) || "…"}`} className="sm:col-span-2">
                <input
                  value={p.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value);
                  }}
                  className="input"
                />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea value={p.description} onChange={(e) => set("description", e.target.value)} rows={5} className="input resize-y" />
              </Field>
            </div>
          </Section>

          <Section title="Category & attributes">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category">
                <select value={p.group_slug} onChange={(e) => changeGroup(e.target.value)} className="input">
                  {SUBJECT_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {groups.find((x) => x.slug === g)?.name ?? g}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Sub-category">
                <select value={p.sub_category} onChange={(e) => set("sub_category", e.target.value)} className="input">
                  {groupSubs.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Medium">
                <select value={p.medium} onChange={(e) => changeMedium(e.target.value as Medium)} className="input">
                  {opts(MEDIUM_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Style">
                <select value={p.style} onChange={(e) => set("style", e.target.value)} className="input">
                  {opts(STYLE_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Availability">
                <select value={p.type} onChange={(e) => set("type", e.target.value)} className="input">
                  {opts(TYPE_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Orientation">
                <select value={p.orientation} onChange={(e) => set("orientation", e.target.value)} className="input">
                  {opts(ORIENTATION_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="People / pets in the artwork" help="Each extra person adds 40% to the price.">
                <input type="number" min={1} value={p.subjects} onChange={(e) => set("subjects", Math.max(1, Number(e.target.value) || 1))} className="input" />
              </Field>
              <Field label="Panels" help="For wall-art sets.">
                <select value={p.panels} onChange={(e) => set("panels", Number(e.target.value))} className="input">
                  <option value={1}>Single piece</option>
                  <option value={2}>2-piece set</option>
                  <option value={3}>3-piece set</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <span className="label">Sizes offered</span>
                <Chips
                  options={sizeOptions.map((s) => ({ value: s.key, label: `${s.label} · ${formatINR(productPrice(product, s.key))}` }))}
                  value={p.sizes}
                  onChange={(v) => set("sizes", v)}
                />
                <span className="mt-1 block text-xs text-muted">
                  Prices are calculated from the price list. For a one-of-a-kind original, pick its single size.
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="label">Suits these rooms</span>
                <Chips options={opts(ROOM_LABELS)} value={p.rooms} onChange={(v) => set("rooms", v)} />
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <div className="lg:sticky lg:top-6 lg:space-y-6">
            <Section title="Visibility">
              <div className="space-y-3">
                <Toggle checked={p.is_published} onChange={(v) => set("is_published", v)} label="Live on website" help="Turn off to hide without deleting." />
                <Toggle checked={p.is_bestseller} onChange={(v) => set("is_bestseller", v)} label="Bestseller" help="Shown in the homepage Bestsellers row." />
                <Toggle checked={p.is_new} onChange={(v) => set("is_new", v)} label="New arrival" help="Shown in New Arrivals." />
              </div>
            </Section>

            <Section title="Price">
              <p className="font-serif text-3xl">{orderedSizes.length ? formatINR(Math.min(...orderedSizes.map((s) => productPrice(product, s.key)))) : "—"}</p>
              <p className="text-xs text-muted">Starting price shown in the shop</p>
            </Section>

            <Section title="Rating shown">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stars">
                  <input type="number" min={0} max={5} step={0.1} value={p.rating} onChange={(e) => set("rating", Number(e.target.value))} className="input" />
                </Field>
                <Field label="Reviews">
                  <input type="number" min={0} value={p.review_count} onChange={(e) => set("review_count", Math.max(0, Number(e.target.value) || 0))} className="input" />
                </Field>
              </div>
            </Section>

            <div className="mt-6 border border-line bg-paper p-4 lg:mt-0">
              {error && <p className="mb-3 text-sm text-sale">{error}</p>}
              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} {isNew ? "Add product" : "Save changes"}
              </button>
              <Link href="/admin/products" className="mt-2 block text-center text-sm text-muted hover:text-ink">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
