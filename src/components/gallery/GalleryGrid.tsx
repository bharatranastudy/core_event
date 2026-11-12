"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Film, X } from "lucide-react";
import type { GalleryItem } from "@/types/database";

type FilterValue = "all" | "image" | "video";

export function GalleryGrid({
  items,
  showFilters = false,
  initialFilter = "all",
  usingPlaceholders = false,
}: {
  items: GalleryItem[];
  showFilters?: boolean;
  initialFilter?: FilterValue;
  usingPlaceholders?: boolean;
}) {
  const [filter, setFilter] = useState<FilterValue>(initialFilter);
  const [lightboxItemId, setLightboxItemId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.media_type === filter);
  }, [items, filter]);

  const photoItems = useMemo(
    () => filteredItems.filter((item) => item.media_type === "image"),
    [filteredItems]
  );

  const activePhotoIndex = useMemo(() => {
    if (!lightboxItemId) return -1;
    return photoItems.findIndex((item) => item.id === lightboxItemId);
  }, [photoItems, lightboxItemId]);

  const activePhoto =
    activePhotoIndex >= 0 ? photoItems[activePhotoIndex] : null;

  const closeLightbox = useCallback(() => {
    setLightboxItemId(null);
  }, []);

  const showPrevPhoto = useCallback(() => {
    if (photoItems.length <= 1 || activePhotoIndex < 0) return;
    const prevIdx =
      (activePhotoIndex - 1 + photoItems.length) % photoItems.length;
    setLightboxItemId(photoItems[prevIdx].id);
  }, [photoItems, activePhotoIndex]);

  const showNextPhoto = useCallback(() => {
    if (photoItems.length <= 1 || activePhotoIndex < 0) return;
    const nextIdx = (activePhotoIndex + 1) % photoItems.length;
    setLightboxItemId(photoItems[nextIdx].id);
  }, [photoItems, activePhotoIndex]);

  useEffect(() => {
    if (!activePhoto) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrevPhoto();
      if (e.key === "ArrowRight") showNextPhoto();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePhoto, closeLightbox, showPrevPhoto, showNextPhoto]);

  return (
    <div>
      {showFilters && (
        <div
          role="group"
          aria-label="Filter gallery by media type"
          className="mb-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          {(
            [
              { value: "all", label: "All" },
              { value: "image", label: "Photos" },
              { value: "video", label: "Videos" },
            ] as const
          ).map((chip) => {
            const active = filter === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(chip.value)}
                className={`rounded-[8px] border px-4 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-white bg-white text-black"
                    : "border-[#262626] bg-black text-white/80 hover:border-white/40 hover:text-white"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      )}

      {usingPlaceholders && (
        <p className="mb-6 text-center text-xs text-[#9a9a9a]">
          Showing sample stage-lit placeholders until real event photos or
          videos are uploaded in the admin gallery.
        </p>
      )}

      {filteredItems.length === 0 ? (
        <div className="rounded-[12px] border border-[#262626] bg-[#08080a] px-6 py-16 text-center">
          <p className="text-sm text-[#9a9a9a]">
            No {filter === "video" ? "videos" : filter === "image" ? "photos" : "items"} found yet.
          </p>
        </div>
      ) : (
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filteredItems.map((item) => {
            const ratio =
              item.width && item.height
                ? `${item.width} / ${item.height}`
                : "4 / 3";

            if (item.media_type === "video") {
              return (
                <article
                  key={item.id}
                  className="mb-5 break-inside-avoid overflow-hidden rounded-[12px] border border-[#262626] bg-[#08080a]"
                >
                  <div className="relative bg-black">
                    <video
                      controls
                      preload="metadata"
                      playsInline
                      poster={item.thumbnail_url || undefined}
                      aria-label={item.caption || "Event video"}
                      className="block w-full bg-black object-cover"
                    >
                      <source
                        src={item.public_url}
                        type={item.mime_type || "video/mp4"}
                      />
                      Your browser does not support video playback.
                    </video>
                    <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white">
                      <Film className="h-3 w-3 text-[#e8508c]" />
                      Video
                    </span>
                  </div>
                  {(item.caption || item.category) && (
                    <div className="flex items-center justify-between gap-3 border-t border-[#262626] px-4 py-3">
                      <p className="text-xs text-white/90">
                        {item.caption || item.category}
                      </p>
                      {item.category && (
                        <span className="shrink-0 rounded-full bg-[#e8508c]/15 px-2.5 py-0.5 text-[11px] text-[#e8508c]">
                          {item.category}
                        </span>
                      )}
                    </div>
                  )}
                </article>
              );
            }

            return (
              <article
                key={item.id}
                className="mb-5 break-inside-avoid overflow-hidden rounded-[12px] border border-[#262626] bg-[#08080a]"
              >
                <button
                  type="button"
                  onClick={() => setLightboxItemId(item.id)}
                  aria-label={`Open photo: ${item.caption || "Event photograph"}`}
                  className="group relative block w-full overflow-hidden text-left"
                >
                  <div
                    className="relative w-full bg-[#0a0a0e]"
                    style={{ aspectRatio: ratio }}
                  >
                    <Image
                      src={item.thumbnail_url || item.public_url}
                      alt={item.caption || `${item.category} event photograph`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4">
                    <p className="text-xs font-medium text-white">
                      {item.caption || item.category}
                    </p>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Accessible Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.caption || "Photo preview"}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[12px] border border-[#262626] bg-[#070709]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#262626] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-white">
                  {activePhoto.caption || "Event photo"}
                </span>
                {activePhoto.category && (
                  <span className="rounded-full bg-[#e8508c] px-2.5 py-0.5 text-[11px] font-medium text-white">
                    {activePhoto.category}
                  </span>
                )}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeLightbox}
                aria-label="Close photo preview"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#262626] text-white/80 transition-colors hover:border-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex min-h-[320px] flex-1 items-center justify-center bg-black p-3 sm:min-h-[480px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.public_url}
                alt={activePhoto.caption || "Event photograph"}
                className="max-h-[72vh] w-auto max-w-full rounded-[8px] object-contain"
              />

              {photoItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevPhoto}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[#262626] bg-black/80 p-2 text-white transition-colors hover:border-[#0a6cf0] hover:bg-[#0a6cf0]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextPhoto}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#262626] bg-black/80 p-2 text-white transition-colors hover:border-[#0a6cf0] hover:bg-[#0a6cf0]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
