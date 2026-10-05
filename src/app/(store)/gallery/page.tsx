import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import GalleryView from "@/components/gallery/GalleryView";
import { getGallery } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Paintings and sketches we've finished for collectors and families — pencil, oil, acrylic and digital.",
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <PageHeader
        title="Gallery"
        description="A look at paintings and sketches we've finished for collectors and families. These pieces have found their homes."
        crumbs={[{ label: "Gallery" }]}
      />
      <div className="container-page py-12">
        <GalleryView items={items} />
      </div>
      <section className="bg-card">
        <div className="container-page py-14 text-center">
          <p className="eyebrow">Custom Art</p>
          <h2 className="heading mt-2">Love a piece you see here?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">We can paint something similar for you — in the medium and size you choose.</p>
          <Link href="/custom-art" className="btn-primary mt-8">
            Commission your artwork
          </Link>
        </div>
      </section>
    </>
  );
}
