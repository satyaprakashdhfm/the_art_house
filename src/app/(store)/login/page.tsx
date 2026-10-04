import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, LayoutDashboard, Package, Sparkles } from "lucide-react";
import GoogleButton from "@/components/auth/GoogleButton";
import SignOutButton from "@/components/auth/SignOutButton";
import { getSession, safeNext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create your Verona Arts account with Google.",
};

const PERKS = [
  { icon: Heart, text: "Save favourites to your wishlist" },
  { icon: Package, text: "Faster checkout and order updates" },
  { icon: Sparkles, text: "Early access to new collections and offers" },
];

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : null);
  const failed = params.error !== undefined;
  const { user, isAdmin } = await getSession();

  return (
    <section className="bg-card py-16 sm:py-24">
      <div className="container-page flex justify-center">
        <div className="w-full max-w-md border border-line bg-paper p-8 shadow-sm sm:p-10">
          <Image src="/images/logo.png" alt="Verona Arts" width={1241} height={581} className="mx-auto h-20 w-auto" />

          {user ? (
            <div className="mt-8 text-center">
              {user.avatar && (
                <Image
                  src={user.avatar}
                  alt=""
                  width={64}
                  height={64}
                  className="mx-auto h-16 w-16 rounded-full object-cover"
                />
              )}
              <h1 className="mt-4 font-serif text-2xl">Welcome, {user.name.split(" ")[0]}</h1>
              <p className="mt-1 text-sm text-muted">Signed in as {user.email}</p>
              <div className="mt-8 space-y-3">
                {isAdmin && (
                  <Link href="/admin" className="btn-primary w-full">
                    <LayoutDashboard className="h-4 w-4" /> Open admin dashboard
                  </Link>
                )}
                <Link href={next === "/login" ? "/" : next} className="btn-outline w-full">
                  Continue shopping
                </Link>
                <SignOutButton className="mx-auto pt-2 text-sm text-muted hover:text-gold" />
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 text-center">
                <h1 className="font-serif text-3xl">Welcome</h1>
                <p className="mt-2 text-sm text-muted">Sign in or create an account in one step.</p>
              </div>

              {failed && (
                <p className="mt-6 border border-sale/30 bg-sale/5 px-4 py-3 text-center text-sm text-sale">
                  We couldn&apos;t sign you in. Please try again.
                </p>
              )}

              <div className="mt-8">
                <GoogleButton next={next} />
              </div>

              <ul className="mt-8 space-y-3 border-t border-line pt-8">
                {PERKS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-muted">
                    <Icon className="h-4 w-4 shrink-0 text-gold" /> {text}
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-center text-xs leading-relaxed text-muted">
                By continuing you agree to our{" "}
                <Link href="/policies/terms" className="underline underline-offset-2 hover:text-gold">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/policies/privacy" className="underline underline-offset-2 hover:text-gold">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
