"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { placeholder } from "@/lib/images";

const SLIDES = [
  {
    eyebrow: "Festive Collection",
    title: "Divine art for every celebration",
    text: "Radha Krishna, Ganesha, Shiva and more — 25% off with FESTIVE25.",
    cta: { href: "/categories#spiritual", label: "Shop spiritual art" },
    image: placeholder("hero-festive", 1800, 1000),
  },
  {
    eyebrow: "Custom Portraits",
    title: "Your photo, hand-painted",
    text: "Pencil, oil, acrylic or digital — with a free preview before we paint.",
    cta: { href: "/custom-art", label: "Create yours" },
    image: placeholder("hero-custom", 1800, 1000),
  },
  {
    eyebrow: "New Arrivals",
    title: "Fresh from the studio",
    text: "Original paintings and limited prints, added every week.",
    cta: { href: "/shop?sort=newest", label: "See what's new" },
    image: placeholder("hero-new", 1800, 1000),
  },
];

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [i]);

  return (
    <section className="relative h-[70vh] min-h-[440px] overflow-hidden bg-ink" aria-roledescription="carousel">
      {SLIDES.map((s, idx) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={idx !== i}
        >
          <Image src={s.image} alt="" fill priority={idx === 0} sizes="100vw" className="object-cover opacity-60" />
          <div className="relative container-page flex h-full flex-col justify-center text-paper">
            <p className="text-xs tracking-[0.25em] uppercase">{s.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">{s.title}</h1>
            <p className="mt-4 max-w-lg text-paper/85">{s.text}</p>
            <Link href={s.cta.href} className="btn mt-8 w-fit bg-paper text-ink hover:bg-gold hover:text-white" tabIndex={idx === i ? 0 : -1}>
              {s.cta.label}
            </Link>
          </div>
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
        {SLIDES.map((s, idx) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Show slide ${idx + 1}`}
            className={`h-1 transition-all ${idx === i ? "w-10 bg-paper" : "w-5 bg-paper/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
