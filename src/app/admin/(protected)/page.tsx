import { GalleryManager } from "@/components/admin/GalleryManager";
import { getGalleryItems } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const { items } = await getGalleryItems({ fallbackToPlaceholders: false });

  return <GalleryManager initialItems={items} />;
}
