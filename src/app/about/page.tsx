import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { placeholder } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Verona Arts — handmade art from our studio to your walls.",
};

const STATS = [
  { value: "500+", label: "Paintings delivered" },
  { value: "120+", label: "Cities across India" },
  { value: "4.8★", label: "Average rating" },
  { value: "10 yrs", label: "Of painting" },
];

const VALUES = [
  { title: "Made by hand", text: "Every stroke is painted by a real artist. We never sell mass-produced prints as originals." },
  { title: "Made to last", text: "Archival paper, artist-grade paints and primed cotton canvas — built to last generations." },
  { title: "Made personal", text: "From custom portraits to sizes that fit your wall, we work with you until it feels right." },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="heading mt-3 sm:text-5xl">Art that makes a house a home</h1>
          <div className="prose-page mt-6">
            <p>
              Verona Arts began with a sketchbook and a simple belief: that every home deserves art made with real
              hands and real heart. What started as pencil portraits for friends and family grew into a studio creating
              spiritual art, portraits, animals and landscapes for homes across India.
            </p>
            <p>
              Today we work in pencil, oil, acrylic and digital — but the promise is the same. Each piece is created
              slowly and carefully, signed by the artist, and packed as if it were going to our own walls.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">
              Shop the collection
            </Link>
            <Link href="/custom-art" className="btn-outline">
              Commission a piece
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-line">
          <Image src={placeholder("about-artist", 900, 1100)} alt="The artist at work" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="border-y border-line bg-card">
        <dl className="container-page grid grid-cols-2 gap-8 py-12 text-center lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="order-2 mt-1 text-xs tracking-wider text-muted uppercase">{s.label}</dt>
              <dd className="font-serif text-4xl text-gold-dark">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title}>
              <p className="font-serif text-2xl">{v.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page">
        <p className="eyebrow">Inside the studio</p>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {["studio-1", "studio-2", "studio-3"].map((s, i) => (
            <div key={s} className={`relative overflow-hidden bg-line ${i === 0 ? "col-span-2 row-span-2 aspect-square lg:col-span-2" : "aspect-square"}`}>
              <Image src={placeholder(s, 900, 900)} alt="Studio" fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
