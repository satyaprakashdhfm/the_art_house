import Image from "next/image";
import Link from "next/link";
import { Camera, Palette, Star, Truck } from "lucide-react";
import Hero from "@/components/home/Hero";
import CustomArtCollage from "@/components/home/CustomArtCollage";
import Newsletter from "@/components/home/Newsletter";
import ProductGrid from "@/components/product/ProductGrid";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { SUBJECT_GROUPS } from "@/lib/labels";
import { getCatalog } from "@/lib/site-data";
import { placeholder } from "@/lib/images";
import { BASE_PRICES } from "@/data/pricing";
import { formatINR } from "@/lib/format";

const MEDIUMS = [
  { slug: "pencil", name: "Pencil", text: "Fine graphite detail" },
  { slug: "oil", name: "Oil", text: "Rich, timeless texture" },
  { slug: "acrylic", name: "Acrylic", text: "Bold, vibrant colour" },
  { slug: "digital", name: "Digital", text: "Prints & instant files" },
] as const;

const CUSTOM_STEPS = [
  { icon: Camera, label: "Share your photo" },
  { icon: Palette, label: "Choose style & size" },
  { icon: Truck, label: "Delivered to your door" },
];

export default async function Home() {
  const catalog = await getCatalog();
  const bestsellers = catalog.products.filter((p) => p.isBestseller).slice(0, 8);
  const newArrivals = catalog.products.filter((p) => p.isNew).slice(0, 8);
  const subjectGroups = catalog.groups.filter((g) => (SUBJECT_GROUPS as readonly string[]).includes(g.slug));
  const testimonials = catalog.testimonials.filter((t) => t.showOnHome).slice(0, 4);
  const subImage = (group: string, sub: string, fallback: string) => catalog.getSub(group, sub)?.image || fallback;

  return (
    <>
      <Hero slides={catalog.heroSlides} />

      {/* Shop by category */}
      <section className="container-page py-20">
        <SectionHeading eyebrow="Explore" title="Shop by Category" link={{ href: "/categories", label: "All categories" }} />
        <div className="flex flex-wrap justify-center gap-x-[5%] gap-y-6 sm:flex-nowrap sm:justify-between sm:gap-4">
          {[...subjectGroups.map((g) => ({ href: `/categories#${g.slug}`, name: g.name, image: g.image })),
            { href: "/categories/art-style/abstract", name: "Abstract", image: subImage("art-style", "abstract", placeholder("sub-abstract", 600, 600)) },
            { href: "/categories/art-style/wall-art", name: "Wall Art", image: subImage("art-style", "wall-art", placeholder("sub-wall-art", 600, 600)) },
            { href: "/categories/art-style/madhubani", name: "Madhubani", image: subImage("art-style", "madhubani", "/images/categories/madhubani.jpg") },
          ].map((c) => (
            <Link key={c.name} href={c.href} className="group w-[30%] text-center sm:w-auto sm:flex-1">
              <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-line">
                <Image src={c.image} alt={c.name} fill quality={90} sizes="(min-width: 640px) 14vw, 30vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <p className="mt-3 text-sm group-hover:text-gold">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by medium */}
      <section className="container-page">
        <SectionHeading eyebrow="Mediums" title="Shop by Medium" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {MEDIUMS.map((m) => (
            <Link key={m.slug} href={`/categories/medium/${m.slug}`} className="group relative aspect-[3/4] overflow-hidden bg-line">
              <Image src={subImage("medium", m.slug, placeholder(`medium-${m.slug}`, 700, 900))} alt={m.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 text-white">
                <p className="font-serif text-2xl">{m.name}</p>
                <p className="text-xs text-white/85">
                  {m.text} · from {formatINR(Math.min(...Object.values(BASE_PRICES[m.slug])))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Madhubani feature */}
      <section className="container-page pt-20">
        <div className="grid items-center overflow-hidden bg-ink text-paper md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="relative aspect-[4/3] md:aspect-square md:h-full">
            <Image
              src={subImage("art-style", "madhubani", "/images/categories/madhubani.jpg")}
              alt="Madhubani painting of a fish pair around a lotus"
              fill
              quality={90}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="px-6 py-10 sm:px-10 lg:px-14">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">The Madhubani Collection</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/75 sm:text-base">
              Hand-painted in a centuries-old tradition — bold colours, fine line-work and timeless motifs of fish,
              peacocks and lotus, each a symbol of luck, love and new beginnings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/categories/art-style/madhubani" className="btn-primary">
                Explore Madhubani
              </Link>
              <Link href="/custom-art" className="btn border border-paper/40 text-paper hover:border-gold hover:bg-gold">
                Commission a piece
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container-page py-20">
        <SectionHeading eyebrow="Loved by collectors" title="Bestsellers" link={{ href: "/shop", label: "Shop all" }} />
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:gap-6">
          {bestsellers.map((p) => (
            <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Custom art banner */}
      <section className="container-page">
        {/* One green field, deep on the text side and brighter towards the paintings */}
        <div className="grid items-center overflow-hidden bg-ink bg-[radial-gradient(90%_120%_at_100%_50%,rgba(134,178,140,0.38),transparent_65%),linear-gradient(90deg,#1f3d2b_0%,#1f3d2b_30%,#2b5139_65%,#3a6a4c_100%)] text-paper lg:grid-cols-2">
          <div className="self-stretch lg:order-2">
            <CustomArtCollage />
          </div>
          <div className="px-6 py-10 sm:px-10 lg:px-14">
            <p className="eyebrow">Custom Art</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">Turn your favourite photo into a painting</h2>
            <p className="mt-4 text-sm leading-relaxed text-paper/75 sm:text-base">
              Portraits, couples, pets and places — painted by hand in the medium and size you choose.
            </p>
            <ol className="mt-8 grid max-w-md grid-cols-3 gap-4 text-center">
              {CUSTOM_STEPS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon className="mx-auto h-10 w-10 text-gold" strokeWidth={1.5} />
                  <p className="mx-auto mt-3 max-w-[7.5rem] text-xs leading-snug text-paper/85 sm:text-sm">{label}</p>
                </li>
              ))}
            </ol>
            <Link href="/custom-art" className="btn-primary mt-10">
              Start your custom art
            </Link>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-page py-20">
        <SectionHeading eyebrow="Just in" title="New Arrivals" link={{ href: "/shop?sort=newest", label: "View all" }} />
        <ProductGrid products={newArrivals} />
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-page pb-20">
          <SectionHeading eyebrow="Happy walls" title="What our customers say" center />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <figure key={t.id} className="border border-line bg-card p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="mt-4 font-serif leading-relaxed">“{t.text}”</blockquote>
                <figcaption className="mt-4 text-xs text-muted">
                  {t.name}, {t.city}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
