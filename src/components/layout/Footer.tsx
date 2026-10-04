import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { getCatalog } from "@/lib/site-data";
import { SUBJECT_GROUPS } from "@/lib/labels";

const HELP = [
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/policies/shipping-returns", label: "Shipping & Returns" },
  { href: "/custom-art", label: "Custom Orders" },
];

const POLICIES = [
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms of Service" },
  { href: "/policies/refund", label: "Refund Policy" },
];

export default async function Footer() {
  const { groups } = await getCatalog();

  return (
    <footer className="mt-24 bg-ink text-card">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-serif text-3xl leading-none">
            Verona
            <span className="mt-1.5 block font-sans text-sm font-medium tracking-[0.45em] text-gold uppercase">Arts</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-card/75">
            Handmade paintings, pencil sketches and digital art — created with love and delivered across India.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-card/75">
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gold" /> +91 90000 00000 (WhatsApp)
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" /> hello@veronaarts.example
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" /> Studio, India
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="text-card/75 transition-colors hover:text-gold">
                All Paintings
              </Link>
            </li>
            {groups.filter((g) => (SUBJECT_GROUPS as readonly string[]).includes(g.slug)).map((g) => (
              <li key={g.slug}>
                <Link href={`/categories#${g.slug}`} className="text-card/75 transition-colors hover:text-gold">
                  {g.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/offers" className="text-card/75 transition-colors hover:text-gold">
                Offers
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Help</p>
          <ul className="mt-4 space-y-2 text-sm">
            {HELP.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-card/75 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="text-card/75 transition-colors hover:text-gold">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Policies</p>
          <ul className="mt-4 space-y-2 text-sm">
            {POLICIES.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-card/75 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-6">We accept</p>
          <p className="mt-3 text-sm text-card/75">UPI · Cards · Net Banking · COD</p>
        </div>
      </div>
      <div className="border-t border-card/15">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-card/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Verona Arts. All rights reserved.</p>
          <p>Instagram · Facebook · Pinterest · YouTube</p>
        </div>
      </div>
    </footer>
  );
}
