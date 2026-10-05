import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, ImageIcon, SlidersHorizontal, Truck, Wallet } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import FAQList from "@/components/ui/FAQList";
import CustomArtForm from "@/components/custom/CustomArtForm";
import WhatsAppHelp from "@/components/custom/WhatsAppHelp";
import { getCatalog, getGallery } from "@/lib/site-data";
import { MEDIUM_LABELS } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Custom Art from Your Photo",
  description: "Get a hand-painted pencil, oil, acrylic or digital portrait from your photo. Free preview, 2 free revisions.",
};

const STEPS = [
  { icon: Camera, title: "Upload photo", text: "Share one or more clear photos." },
  { icon: SlidersHorizontal, title: "Choose style & size", text: "See your price instantly." },
  { icon: Wallet, title: "Pay 50% advance", text: "We confirm details on WhatsApp." },
  { icon: ImageIcon, title: "Approve preview", text: "Free digital preview + 2 revisions." },
  { icon: Truck, title: "Delivered", text: "Painted, framed and shipped to you." },
];

export default async function CustomArtPage() {
  const [{ faqs }, gallery] = await Promise.all([getCatalog(), getGallery()]);
  const recentWork = gallery.slice(0, 4);

  return (
    <>
      {/* Hero */}
      {/* The background colour matches the cream of the hero artwork so its edges blend in. */}
      <section className="border-b border-line bg-[#f6eada]">
        <div className="container-page grid items-center gap-6 py-10 lg:grid-cols-[440px_1fr] lg:py-12">
          <div>
            <Breadcrumbs crumbs={[{ label: "Custom Art" }]} />
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-[3.4rem]">
              Your photo, <br className="hidden lg:block" />
              hand-painted
            </h1>
            <p className="mt-4 text-lg text-muted">Portraits, couples, families, pets and places — turned into art you&apos;ll keep forever.</p>
            <Link href="#start" className="btn-primary mt-8">
              Start your custom artwork <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Image
            src="/images/custom/hero.jpg"
            alt="A customer's photo of a golden retriever beside the hand-painted portrait made from it"
            width={1800}
            height={662}
            preload
            quality={90}
            sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw"
            className="h-auto w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_92%,transparent)]"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-line bg-paper">
        <div className="container-page py-14">
          <ol className="relative grid gap-8 sm:grid-cols-5 sm:gap-4">
            <span aria-hidden className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-gold/40 sm:block" />
            <span aria-hidden className="absolute top-6 bottom-6 left-6 w-px bg-gold/40 sm:hidden" />
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative flex items-start gap-5 sm:flex-col sm:items-center sm:gap-0 sm:text-center">
                <span
                  className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-serif text-lg ${
                    i === 0 ? "border-gold bg-gold text-white" : "border-gold bg-paper text-gold"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="sm:mt-4">
                  <Icon className="h-5 w-5 text-gold sm:mx-auto" strokeWidth={1.5} />
                  <p className="mt-2 text-sm font-medium">{title}</p>
                  <p className="mt-1 text-xs text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="start" className="container-page scroll-mt-28 py-16">
        <CustomArtForm />
      </section>

      {/* Recent work */}
      {recentWork.length > 0 && (
        <section className="bg-card">
          <div className="container-page py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Our work</p>
                <h2 className="heading mt-2">Custom work we&apos;ve loved creating</h2>
              </div>
              <Link href="/gallery" className="text-sm underline underline-offset-4 hover:text-gold">
                View full gallery
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {recentWork.map((w) => (
                <Link key={w.id} href="/gallery" className="group border border-line bg-paper p-3 transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/5] overflow-hidden bg-line">
                    <Image
                      src={w.image}
                      alt={w.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-1 pt-3 pb-1">
                    <p className="text-[11px] tracking-wider text-gold uppercase">{MEDIUM_LABELS[w.medium]}</p>
                    <p className="mt-0.5 font-serif text-lg leading-snug">{w.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container-page py-20">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 className="heading mt-2">Custom art FAQ</h2>
            <p className="mt-3 text-sm text-muted">Everything you need to know before you order. Can&apos;t find your answer?</p>
            <div className="mt-6">
              <WhatsAppHelp title="Ask us on WhatsApp" text="We usually reply within a few hours" />
            </div>
          </div>
          <FAQList faqs={faqs.filter((f) => f.section === "custom")} variant="cards" />
        </div>
      </section>
    </>
  );
}
