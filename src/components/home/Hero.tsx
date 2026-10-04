"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/types";

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [i, slides.length]);

  if (slides.length === 0) return null;
  const activeTone = slides[i % slides.length].tone;

  return (
    <section className="relative h-[70vh] min-h-[480px] overflow-hidden bg-card" aria-roledescription="carousel">
      {slides.map((s, idx) => {
        const light = s.tone === "light";
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={idx !== i}
          >
            <Image
              src={s.image}
              alt=""
              fill
              preload={idx === 0}
              sizes="100vw"
              className="object-cover object-[70%_center]"
            />
            {/* Neutral scrim on the text side only, so the text stays readable on smaller screens */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                light ? "from-white/80 via-white/40 to-transparent sm:from-white/60 sm:via-white/10" : "from-black/60 via-black/25 to-transparent"
              }`}
            />
            <div className={`relative container-page flex h-full flex-col justify-center ${light ? "text-ink" : "text-white"}`}>
              <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">{s.eyebrow}</p>
              <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-6xl">{s.title}</h1>
              <p className={`mt-5 max-w-md leading-relaxed ${light ? "text-ink/80" : "text-white/85"}`}>{s.text}</p>
              <Link
                href={s.ctaHref}
                className="btn-gold group mt-8 w-fit rounded-full px-7 normal-case tracking-normal"
                tabIndex={idx === i ? 0 : -1}
              >
                {s.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        );
      })}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all ${
                idx === i ? `w-10 ${activeTone === "light" ? "bg-ink" : "bg-white"}` : `w-5 ${activeTone === "light" ? "bg-ink/30" : "bg-white/40"}`
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
