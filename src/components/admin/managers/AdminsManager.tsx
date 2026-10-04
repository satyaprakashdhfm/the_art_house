"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { addAdmin, removeAdmin } from "@/app/admin/actions";
import { useConfirm } from "@/components/admin/useConfirm";
import { ui } from "@/context/ui";

type Admin = { email: string; created_at: string };

export default function AdminsManager({ admins, currentEmail }: { admins: Admin[]; currentEmail: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const { confirm, dialog } = useConfirm();

  function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await addAdmin(email);
      if (!res.ok) return setError(res.error);
      ui.toast(`${email.trim().toLowerCase()} can now access the admin dashboard`);
      setEmail("");
    });
  }

  async function remove(a: Admin) {
    const ok = await confirm({
      title: "Remove admin access?",
      message: `${a.email} will no longer be able to open the admin dashboard.`,
      confirmLabel: "Remove",
    });
    if (!ok) return;
    start(async () => {
      const res = await removeAdmin(a.email);
      ui.toast(res.ok ? `Removed ${a.email}` : res.error);
    });
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@gmail.com"
          aria-label="Email address of new admin"
          className="input flex-1"
        />
        <button type="submit" disabled={pending || !email.trim()} className="btn-primary px-5 py-2.5">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add admin
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-sale">{error}</p>}

      <ul className="mt-6 divide-y divide-line border border-line bg-paper">
        {admins.map((a) => (
          <li key={a.email} className="flex items-center gap-4 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-gold">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {a.email}
                {a.email === currentEmail && <span className="ml-2 text-xs font-normal text-muted">(you)</span>}
              </p>
              <p className="text-xs text-muted">
                Added {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            {a.email !== currentEmail && (
              <button type="button" onClick={() => remove(a)} aria-label={`Remove ${a.email}`} className="p-2 text-muted hover:text-sale">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {dialog}
    </div>
  );
}
