import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Package, RotateCcw, Star } from "lucide-react";
import { MEDIUM_LABELS, STYLE_LABELS, TYPE_LABELS } from "@/lib/labels";
import { getCatalog } from "@/lib/site-data";
import { subHref } from "@/components/layout/nav";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductGrid from "@/components/product/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";

export async function generateStaticParams() {
  const { products } = await getCatalog();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getCatalog()).getProduct(slug);
  if (!product) return {};
  return { title: product.title, description: product.description };
}

const SPEC_SURFACE = {
  pencil: "Graphite on 300 GSM acid-free cartridge paper",
  oil: "Oil on primed cotton canvas, gallery-stretched",
  acrylic: "Acrylic on primed cotton canvas, gallery-stretched",
  digital: "Archival giclée print on matte fine-art paper, or high-res JPG",
};

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = catalog.getProduct(slug);
  if (!product) notFound();

  const group = catalog.getGroup(product.group) ?? { slug: product.group, name: catalog.groupName(product.group) };
  const subName = catalog.subName(product.subCategory);
  const reviews = catalog.reviewsFor(product.id);
  const related = catalog.relatedProducts(product);
  const coupons = catalog.couponsFor(product).slice(0, 3);

  const specs = [
    ["Medium", MEDIUM_LABELS[product.medium]],
    ["Surface", SPEC_SURFACE[product.medium]],
    ["Style", STYLE_LABELS[product.style]],
    ["Availability", TYPE_LABELS[product.type]],
    ["Orientation", product.orientation[0].toUpperCase() + product.orientation.slice(1)],
    ...(product.panels > 1 ? [["Panels", `${product.panels}-piece set`]] : []),
    ...(product.subjects > 1 ? [["Subjects", `${product.subjects} people`]] : []),
  ];

  const tabs = [
    { title: "Description", body: <p>{product.description}</p> },
    {
      title: "Specifications",
      body: (
        <dl className="grid grid-cols-[120px_1fr] gap-y-2">
          {specs.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      title: "Shipping & Returns",
      body: (
        <p>
          Ready originals and prints ship in 5–7 days; made-to-order paintings take 12–18 days. Free shipping above
          ₹1,999. Returns accepted within 7 days for damage in transit — see our{" "}
          <Link href="/policies/shipping-returns" className="underline">
            shipping policy
          </Link>
          .
        </p>
      ),
    },
    {
      title: "Care",
      body: <p>Keep away from direct sunlight and moisture. Dust gently with a soft dry cloth. Do not use water or cleaning sprays.</p>,
    },
  ];

  return (
    <>
      <div className="container-page py-8">
        <Breadcrumbs
          crumbs={[
            { href: "/categories", label: "Categories" },
            { href: `/categories#${group.slug}`, label: group.name },
            { href: subHref(product.group, product.subCategory), label: subName },
            { label: product.title },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} title={product.title} />

          <div>
            <p className="eyebrow">
              {subName} · {MEDIUM_LABELS[product.medium]}
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{product.title}</h1>
            {product.reviewCount > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                <span className="flex items-center gap-1 text-ink">
                  <Star className="h-4 w-4 fill-gold text-gold" /> {product.rating}
                </span>
                <a href="#reviews" className="underline underline-offset-4">
                  {product.reviewCount} reviews
                </a>
              </div>
            )}
            {coupons.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {coupons.map((c) => (
                  <span key={c.code} className="bg-gold/15 px-2 py-1 text-xs text-gold-dark">
                    {c.code}: {c.title}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6">
              <ProductPurchase product={product} />
            </div>

            <ul className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center text-xs text-muted">
              <li className="flex flex-col items-center gap-2">
                <Award className="h-5 w-5 text-gold" /> Certificate of Authenticity
              </li>
              <li className="flex flex-col items-center gap-2">
                <Package className="h-5 w-5 text-gold" /> Safe, insured packaging
              </li>
              <li className="flex flex-col items-center gap-2">
                <RotateCcw className="h-5 w-5 text-gold" /> 7-day damage returns
              </li>
            </ul>

            <div className="mt-6 divide-y divide-line border-y border-line">
              {tabs.map((t, i) => (
                <details key={t.title} open={i === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium">
                    {t.title}
                    <span className="text-lg text-muted group-open:rotate-45">+</span>
                  </summary>
                  <div className="pb-5 text-sm leading-relaxed">{t.body}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {reviews.length > 0 && product.reviewCount > 0 && (
        <section id="reviews" className="container-page mt-16 scroll-mt-28">
          <SectionHeading eyebrow="Reviews" title={`${product.rating} out of 5`} description={`Based on ${product.reviewCount} reviews`} />
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.id} className="border border-line bg-card p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-gold text-gold" : "text-line"}`} />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-4 text-xs text-muted">
                  {r.name}, {r.city} · {r.date}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-page mt-20">
          <SectionHeading eyebrow="You may also like" title={`More ${group.name} art`} link={{ href: `/categories#${group.slug}`, label: "View all" }} />
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
