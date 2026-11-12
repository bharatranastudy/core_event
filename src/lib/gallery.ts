import { PLACEHOLDER_GALLERY_ITEMS } from "@/config/site";
import { createServerSupabaseClient } from "./supabase/server";
import type { GalleryItem } from "@/types/database";

export async function getGalleryItems(options?: {
  limit?: number;
  fallbackToPlaceholders?: boolean;
}): Promise<{ items: GalleryItem[]; usingPlaceholders: boolean }> {
  const limit = options?.limit;
  const fallback = options?.fallbackToPlaceholders ?? true;

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return {
        items: fallback
          ? limit
            ? PLACEHOLDER_GALLERY_ITEMS.slice(0, limit)
            : PLACEHOLDER_GALLERY_ITEMS
          : [],
        usingPlaceholders: fallback,
      };
    }

    let query = supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return {
        items: fallback
          ? limit
            ? PLACEHOLDER_GALLERY_ITEMS.slice(0, limit)
            : PLACEHOLDER_GALLERY_ITEMS
          : [],
        usingPlaceholders: fallback,
      };
    }

    return {
      items: data as GalleryItem[],
      usingPlaceholders: false,
    };
  } catch {
    return {
      items: fallback
        ? limit
          ? PLACEHOLDER_GALLERY_ITEMS.slice(0, limit)
          : PLACEHOLDER_GALLERY_ITEMS
        : [],
      usingPlaceholders: fallback,
    };
  }
}
