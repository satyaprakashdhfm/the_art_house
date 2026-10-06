import type { ReactNode } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchOverlay from "@/components/layout/SearchOverlay";
import MobileMenu from "@/components/layout/MobileMenu";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CatalogProvider } from "@/context/catalog";
import { getSiteData } from "@/lib/site-data";

/** Storefront chrome plus the database content its Client Components read. */
export default async function StoreShell({ children }: { children: ReactNode }) {
  const data = await getSiteData();

  return (
    <CatalogProvider data={data}>
      <AnnouncementBar messages={data.announcements} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
      <SearchOverlay />
      <MobileMenu />
    </CatalogProvider>
  );
}
