import Image from "next/image";

/**
 * Scattered "prints" of real Verona Arts paintings for the homepage Custom Art banner.
 * Transparent background: it sits on the banner's green gradient. Positions are percentages,
 * so the collage scales with the screen.
 */
const PRINTS = [
  { src: "/images/custom/collage/waterfall.jpg", alt: "Oil painting of a waterfall in a forest", w: 1600, h: 1011, pos: "left-[5%] top-[7%] w-[47%] -rotate-6 z-10" },
  { src: "/images/custom/collage/dogs.jpg", alt: "Oil painting of two white Spitz dogs", w: 1600, h: 1143, pos: "right-[4%] top-[5%] w-[44%] rotate-[5deg] z-20" },
  { src: "/images/custom/collage/roses.jpg", alt: "Painting of red roses in a blue vase", w: 1278, h: 1600, pos: "left-[30%] top-[38%] w-[27%] -rotate-2 z-30" },
  { src: "/images/custom/collage/sunset.jpg", alt: "Oil painting of a giraffe and tree at sunset", w: 1600, h: 1158, pos: "right-[6%] bottom-[7%] w-[42%] -rotate-[4deg] z-20" },
];

export default function CustomArtCollage() {
  return (
    <div className="relative aspect-[5/4] w-full lg:aspect-auto lg:h-full lg:min-h-[460px]">
      {PRINTS.map((p) => (
        <figure
          key={p.src}
          className={`absolute bg-white p-[1.2%] pb-[3.5%] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.55)] transition-[transform,box-shadow] duration-500 ease-out hover:z-40 hover:-translate-y-3 hover:scale-[1.15] hover:rotate-0 hover:shadow-[0_28px_50px_-12px_rgba(0,0,0,0.7)] motion-reduce:transition-none ${p.pos}`}
        >
          <div className="relative w-full" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
            <Image src={p.src} alt={p.alt} fill quality={90} sizes="(min-width: 1024px) 28vw, 55vw" className="object-cover" />
          </div>
        </figure>
      ))}
    </div>
  );
}
