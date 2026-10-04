"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({ className = "", redirectTo = "/" }: { className?: string; redirectTo?: string }) {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} className={`flex items-center gap-2 ${className}`}>
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
