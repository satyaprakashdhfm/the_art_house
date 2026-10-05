import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gem, Heart, Leaf } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "At Verona Arts, we believe art has the power to transform everyday spaces into places that feel personal, meaningful and alive.",
};

const BELIEFS = [
  { icon: Leaf, title: "Thoughtfully Created", text: "Hand-painted and curated with care." },
  { icon: Gem, title: "Quality Materials", text: "We choose materials and craftsmanship that last." },
  { icon: Heart, title: "Made for Your Space", text: "Art that brings warmth, character and meaning to your everyday spaces." },
];

// Soft watercolour decorations: fade their straight edges into the background.
const fadeLeftTop = "[mask-image:linear-gradient(to_right,transparent,black_30%),linear-gradient(to_bottom,transparent,black_20%)] [mask-composite:intersect]";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-card">
        <Image
          src="/images/about/hero_leaves.webp"
          alt=""
          width={900}
          height={950}
          preload
          sizes="(min-width: 1024px) 420px, 260px"
          className={`pointer-events-none absolute top-0 right-0 h-full w-auto opacity-50 sm:opacity-100 ${fadeLeftTop}`}
        />
        <div className="container-page relative py-12 lg:py-16">
          <Breadcrumbs crumbs={[{ label: "About" }]} />
          <p className="eyebrow mt-10">About Verona Arts</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] lg:text-6xl">
            Art that makes <br />a house a home
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            At Verona Arts, we believe art has the power to transform everyday spaces into places that feel personal,
            meaningful and alive. Our collection brings together hand-painted artworks and curated pieces, created with
            care, to add warmth, character and a deeper sense of home to your space.
          </p>
          <span aria-hidden className="mt-10 block h-px w-14 bg-gold" />
        </div>
      </section>

      {/* What we believe */}
      <section className="bg-[#f6ecdc]">
        <div className="container-page py-14 text-center">
          <p className="eyebrow">What we believe</p>
          <h2 className="heading mt-3">A love for art, a belief in timeless spaces</h2>
          <div className="mx-auto mt-12 grid max-w-5xl gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-gold/40">
            {BELIEFS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="px-8">
                <Icon className="mx-auto h-12 w-12 text-gold" strokeWidth={1} />
                <h3 className="mt-5 font-serif text-2xl">{title}</h3>
                <p className="mx-auto mt-2 max-w-60 leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom art call to action. -mb-24 cancels the footer's top margin so this band meets the footer. */}
      <section className="relative -mb-24 overflow-hidden bg-[#fbf6ee]">
        <Image
          src="/images/about/cta_leaves.webp"
          alt=""
          width={540}
          height={658}
          sizes="220px"
          className="pointer-events-none absolute top-0 left-0 hidden h-full w-auto md:block"
        />
        <Image
          src="/images/about/cta_brush.webp"
          alt=""
          width={660}
          height={584}
          sizes="280px"
          className="pointer-events-none absolute top-1/2 right-0 hidden h-[85%] w-auto -translate-y-1/2 md:block"
        />
        <div className="container-page relative py-16 text-center">
          <p className="eyebrow">Create something personal</p>
          <h2 className="heading mx-auto mt-3 max-w-2xl">
            Have a photo or idea you&apos;d love <br className="hidden sm:block" />
            to turn into artwork?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Our artists can bring your special moments, loved ones or unique ideas to life with a hand-painted custom
            artwork.
          </p>
          <Link href="/custom-art" className="btn-primary mt-8">
            Explore Custom Art <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
