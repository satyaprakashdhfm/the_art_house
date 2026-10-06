"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  ExternalLink,
  FolderTree,
  GalleryHorizontal,
  Images,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquareQuote,
  Palette,
  ShieldCheck,
  TicketPercent,
  X,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import SignOutButton from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Palette },
  { href: "/admin/hero", label: "Homepage slides", icon: GalleryHorizontal },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/offers", label: "Offers & coupons", icon: TicketPercent },
  { href: "/admin/announcements", label: "Announcement bar", icon: Megaphone },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: CircleHelp },
  { href: "/admin/admins", label: "Admin access", icon: ShieldCheck },
];

export default function AdminShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-card">
      <div className="flex items-start gap-2 px-4 pt-5 pb-4">
        <Link href="/admin" className="block flex-1">
          <Image
            src="/images/brand/emblem-light.png"
            alt="Verona Arts"
            width={1261}
            height={1072}
            className="mx-auto h-28 w-auto"
          />
          <span className="mt-3 block text-center text-[11px] font-medium tracking-[0.3em] text-gold uppercase">Admin dashboard</span>
        </Link>
        <button type="button" onClick={() => setOpen(false)} className="p-1 lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2" aria-label="Admin">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors ${
              isActive(href) ? "bg-white/10 font-medium text-white shadow-[inset_3px_0_0] shadow-gold" : "text-card/75 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" /> {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="mb-4 flex items-center gap-2 text-sm text-card/75 hover:text-gold">
          <ExternalLink className="h-4 w-4" /> View website
        </Link>
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <Image src={user.avatar} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm text-white">{user.name}</p>
            <p className="truncate text-xs text-card/60">{user.email}</p>
          </div>
        </div>
        <SignOutButton className="mt-3 text-xs text-card/60 hover:text-gold" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fbf8f2]">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <aside className={`absolute inset-y-0 left-0 w-72 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          {sidebar}
        </aside>
      </div>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper px-4 py-3 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="p-1">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif text-lg">Verona Arts Admin</span>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
