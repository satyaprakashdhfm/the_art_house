import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AnnouncementManager from "@/components/admin/managers/AnnouncementManager";
import { adminRows } from "@/app/admin/data";
import type { AnnouncementRow } from "@/lib/db";

export const metadata = { title: "Announcement bar" };

export default async function AnnouncementsAdminPage() {
  const rows = await adminRows<AnnouncementRow>("announcements");
  return (
    <>
      <AdminPageHeader
        title="Announcement bar"
        description="Short messages that rotate in the green strip above the header, every 4 seconds."
      />
      <AnnouncementManager rows={rows} />
    </>
  );
}
