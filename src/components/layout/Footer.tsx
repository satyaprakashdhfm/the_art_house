import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { CATEGORY_GROUPS } from "@/data/categories";

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

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-card">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-serif text-2xl">The Art House</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Handmade paintings, pencil sketches and digital art — created with love and delivered across India.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> +91 90000 00000 (WhatsApp)
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> hello@thearthouse.example
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Studio, India
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="text-muted hover:text-ink">
                All Paintings
              </Link>
            </li>
            {CATEGORY_GROUPS.slice(0, 4).map((g) => (
              <li key={g.slug}>
                <Link href={`/categories#${g.slug}`} className="text-muted hover:text-ink">
                  {g.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/offers" className="text-muted hover:text-ink">
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
                <Link href={l.href} className="text-muted hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="text-muted hover:text-ink">
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
                <Link href={l.href} className="text-muted hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-6">We accept</p>
          <p className="mt-3 text-sm text-muted">UPI · Cards · Net Banking · COD</p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} The Art House. All rights reserved.</p>
          <p>Instagram · Facebook · Pinterest · YouTube</p>
        </div>
      </div>
    </footer>
  );
}
