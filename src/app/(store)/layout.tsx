import StoreShell from "@/components/layout/StoreShell";

// Pages are rebuilt instantly when an admin saves (revalidatePath); this is a fallback
// for edits made directly in the Supabase dashboard.
export const revalidate = 3600;

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return <StoreShell>{children}</StoreShell>;
}
