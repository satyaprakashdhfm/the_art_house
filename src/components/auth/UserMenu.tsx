"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, User } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import SignOutButton from "@/components/auth/SignOutButton";

/** Header account icon: links to sign-in when signed out, opens an account menu when signed in. */
export default function UserMenu() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const load = async (u: AuthUser | null) => {
      setUser(u);
      if (!u) return setIsAdmin(false);
      // Only admins can read the admins table, so any row back means admin.
      const { data } = await supabase.from("admins").select("email").limit(1);
      setIsAdmin((data?.length ?? 0) > 0);
    };
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the menu after navigating.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  if (!user) {
    const next = pathname === "/login" ? "/" : pathname;
    return (
      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        aria-label="Sign in or create an account"
        className="transition-colors hover:text-gold"
      >
        <User className="h-5 w-5" />
      </Link>
    );
  }

  const meta = user.user_metadata as Record<string, string | undefined>;
  const name = meta.full_name ?? meta.name ?? user.email ?? "";
  const avatar = meta.avatar_url ?? meta.picture;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center transition-colors hover:text-gold"
      >
        {avatar ? (
          <Image src={avatar} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover ring-1 ring-line" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-3 w-64 border border-line bg-paper shadow-lg">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="py-1 text-sm">
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-gold-dark hover:bg-card">
                <LayoutDashboard className="h-4 w-4" /> Admin dashboard
              </Link>
            )}
            <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2.5 hover:bg-card">
              <Heart className="h-4 w-4" /> Wishlist
            </Link>
            <SignOutButton className="w-full px-4 py-2.5 text-left hover:bg-card" redirectTo={pathname} />
          </div>
        </div>
      )}
    </div>
  );
}
