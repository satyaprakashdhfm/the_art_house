import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import CopyCode from "@/components/ui/CopyCode";
import { COUPONS, STANDING_OFFERS } from "@/data/offers";

export const metadata: Metadata = {
  title: "Offers",
  description: "Current coupons, festive sales and free-shipping offers at The Art House.",
};

export default function OffersPage() {
  return (
    <>
      <PageHeader title="Offers" description="Save on originals, prints and custom art." crumbs={[{ label: "Offers" }]} />
      <div className="container-page py-14">
        <h2 className="font-serif text-2xl">Coupon codes</h2>
        <p className="mt-1 text-sm text-muted">One coupon per order. Apply it in your cart or at checkout.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COUPONS.map((c) => (
            <div key={c.code} className="flex flex-col border border-line bg-card p-6">
              <p className="font-serif text-xl">{c.title}</p>
              <p className="mt-2 text-sm text-muted">{c.description}</p>
              <p className="mt-2 text-xs text-muted">{c.terms}</p>
              <div className="mt-auto pt-6">
                <CopyCode code={c.code} />
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-16 font-serif text-2xl">Always on</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STANDING_OFFERS.map((o) => (
            <div key={o.title} className="border-l-2 border-gold bg-card p-5">
              <p className="font-medium">{o.title}</p>
              <p className="mt-1 text-sm text-muted">{o.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <Link href="/categories#spiritual" className="bg-ink p-10 text-paper transition-colors hover:bg-gold-dark">
            <p className="text-xs tracking-[0.25em] text-gold uppercase">Festive sale</p>
            <p className="mt-3 font-serif text-3xl">25% off Spiritual art</p>
            <p className="mt-2 text-sm text-paper/70">Use FESTIVE25 · Radha Krishna, Ganesha, Shiva, Buddha & more</p>
          </Link>
          <Link href="/categories/portraits-people/couple-art" className="border border-ink p-10 transition-colors hover:bg-card">
            <p className="eyebrow">Gift of love</p>
            <p className="mt-3 font-serif text-3xl">15% off Couple Art & Portraits</p>
            <p className="mt-2 text-sm text-muted">Use LOVE15 · Anniversaries, Valentine&apos;s, Mother&apos;s & Father&apos;s Day</p>
          </Link>
        </div>
      </div>
    </>
  );
}
