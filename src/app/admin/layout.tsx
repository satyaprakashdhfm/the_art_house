import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SignOutButton from "@/components/auth/SignOutButton";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Dashboard · Admin", template: "%s · Admin | Verona Arts" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { user, isAdmin } = await getSession();
  if (!user) redirect("/login?next=/admin");

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-card p-4">
        <div className="w-full max-w-md border border-line bg-paper p-10 text-center shadow-sm">
          <Image src="/images/brand/emblem.png" alt="Verona Arts" width={1261} height={1072} className="mx-auto h-28 w-auto" />
          <span className="mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-sale/10 text-sale">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-serif text-2xl">No admin access</h1>
          <p className="mt-2 text-sm text-muted">
            You&apos;re signed in as <span className="font-medium text-ink">{user.email}</span>, which isn&apos;t an admin
            account. Ask an existing admin to add you under “Admin access”.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/" className="btn-primary w-full">
              Back to the shop
            </Link>
            <SignOutButton className="text-sm text-muted hover:text-gold" redirectTo="/login?next=/admin" />
          </div>
        </div>
      </main>
    );
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
