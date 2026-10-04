import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminsManager from "@/components/admin/managers/AdminsManager";
import { adminRows } from "@/app/admin/data";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Admin access" };

export default async function AdminsPage() {
  const [rows, { user }] = await Promise.all([
    adminRows<{ email: string; created_at: string }>("admins", "created_at"),
    getSession(),
  ]);
  return (
    <>
      <AdminPageHeader
        title="Admin access"
        description="People who can open this dashboard. They sign in with “Continue with Google” using the exact email listed here."
      />
      <AdminsManager admins={rows} currentEmail={user!.email.toLowerCase()} />
    </>
  );
}
