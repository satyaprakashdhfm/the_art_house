import Image from "next/image";

/**
 * Scattered "prints" of real Verona Arts paintings for the homepage Custom Art banner.
 * Positions are percentages of the panel, so the collage scales with the screen.
 */
const PRINTS = [
  { src: "/images/custom/collage/waterfall.jpg", alt: "Oil painting of a waterfall in a forest", w: 1100, h: 695, pos: "left-[5%] top-[7%] w-[47%] -rotate-6 z-10" },
  { src: "/images/custom/collage/dogs.jpg", alt: "Oil painting of two white Spitz dogs", w: 1100, h: 786, pos: "right-[4%] top-[5%] w-[44%] rotate-[5deg] z-20" },
  { src: "/images/custom/collage/roses.jpg", alt: "Painting of red roses in a blue vase", w: 878, h: 1100, pos: "left-[30%] top-[38%] w-[27%] -rotate-2 z-30" },
  { src: "/images/custom/collage/sunset.jpg", alt: "Oil painting of a giraffe and tree at sunset", w: 1100, h: 796, pos: "right-[6%] bottom-[7%] w-[42%] -rotate-[4deg] z-20" },
];

export default function CustomArtCollage() {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#f3e9da] lg:aspect-auto lg:h-full lg:min-h-[440px]">
      {/* Watercolour decorations */}
      <Image src="/images/about/cta_brush.webp" alt="" width={660} height={584} aria-hidden="true" className="absolute -top-[6%] -right-[8%] w-[45%] opacity-60" />
      <Image src="/images/about/cta_leaves.webp" alt="" width={540} height={658} aria-hidden="true" className="absolute -bottom-[10%] -left-[6%] w-[30%] opacity-90" />

      {PRINTS.map((p) => (
        <figure
          key={p.src}
          className={`absolute bg-white p-[1.2%] pb-[3.5%] shadow-[0_10px_25px_-8px_rgba(31,61,43,0.45)] transition-transform duration-300 hover:z-40 hover:scale-105 hover:rotate-0 ${p.pos}`}
        >
          <div className="relative w-full" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          </div>
        </figure>
      ))}
    </div>
  );
}
