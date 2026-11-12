import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryItems } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and videos from corporate events we have organised.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const initialFilter =
    params.type === "image" || params.type === "video" ? params.type : "all";

  const { items, usingPlaceholders } = await getGalleryItems({
    fallbackToPlaceholders: true,
  });

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1280px] px-5 pt-14 pb-24 sm:px-8 sm:pt-20">
        <div className="text-center">
          <p className="text-xs font-medium text-[#9a9a9a]">
            Photos and videos from past events
          </p>
          <h1 className="font-display page-headline mt-2 text-white">
            Gallery
          </h1>
        </div>

        <div className="mt-8">
          <GalleryGrid
            items={items}
            showFilters
            initialFilter={initialFilter}
            usingPlaceholders={usingPlaceholders}
          />
        </div>
      </section>
    </PageTransition>
  );
}
