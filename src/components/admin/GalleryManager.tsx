"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Film,
  GripVertical,
  ImageIcon,
  Trash2,
  Upload,
} from "lucide-react";
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
} from "@/types/database";
import {
  processMediaBeforeUpload,
  uploadBlobWithProgress,
  validateMediaFile,
} from "@/lib/media-upload";

interface QueuedUpload {
  localId: string;
  file: File;
  caption: string;
  category: GalleryCategory;
  progress: number;
  status: "queued" | "processing" | "uploading" | "done" | "error";
  error?: string;
}

export function GalleryManager({
  initialItems,
}: {
  initialItems: GalleryItem[];
}) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [queue, setQueue] = useState<QueuedUpload[]>([]);
  const [defaultCaption, setDefaultCaption] = useState("");
  const [defaultCategory, setDefaultCategory] =
    useState<GalleryCategory>("Annual office event");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] =
    useState<GalleryCategory>("General");
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const enqueueFiles = useCallback(
    (fileList: FileList | File[]) => {
      setBannerError(null);
      const files = Array.from(fileList);
      if (files.length === 0) return;

      const nextEntries: QueuedUpload[] = files.map((file) => {
        const validation = validateMediaFile(file);
        return {
          localId: crypto.randomUUID(),
          file,
          caption:
            defaultCaption.trim() ||
            file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          category: defaultCategory,
          progress: 0,
          status: validation.valid ? "queued" : "error",
          error: validation.error,
        };
      });

      setQueue((prev) => [...prev, ...nextEntries]);
    },
    [defaultCaption, defaultCategory]
  );

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files?.length) {
      enqueueFiles(e.dataTransfer.files);
    }
  }

  async function handleStartUpload() {
    const pending = queue.filter((q) => q.status === "queued");
    if (pending.length === 0) return;

    setUploading(true);
    setBannerError(null);

    for (const entry of pending) {
      setQueue((prev) =>
        prev.map((q) =>
          q.localId === entry.localId
            ? { ...q, status: "processing", progress: 5 }
            : q
        )
      );

      try {
        const processed = await processMediaBeforeUpload(entry.file);

        setQueue((prev) =>
          prev.map((q) =>
            q.localId === entry.localId
              ? { ...q, status: "uploading", progress: 12 }
              : q
          )
        );

        const urlRes = await fetch("/api/admin/gallery/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mimeType: processed.mainMimeType,
            fileSizeBytes: processed.mainBlob.size,
            extension: processed.mainExtension,
            hasThumbnail: Boolean(processed.thumbnailBlob),
          }),
        });

        const urlData = (await urlRes.json()) as {
          error?: string;
          mediaType: "image" | "video";
          storagePath: string;
          signedUrl: string;
          publicUrl: string;
          thumbnailPath: string | null;
          thumbnailSignedUrl: string | null;
          thumbnailPublicUrl: string | null;
        };

        if (!urlRes.ok) {
          throw new Error(urlData.error || "Could not prepare upload URL.");
        }

        await uploadBlobWithProgress(
          urlData.signedUrl,
          processed.mainBlob,
          processed.mainMimeType,
          (pct) => {
            const scaled = 12 + Math.round(pct * 0.78);
            setQueue((prev) =>
              prev.map((q) =>
                q.localId === entry.localId ? { ...q, progress: scaled } : q
              )
            );
          }
        );

        if (
          processed.thumbnailBlob &&
          processed.thumbnailMimeType &&
          urlData.thumbnailSignedUrl
        ) {
          await uploadBlobWithProgress(
            urlData.thumbnailSignedUrl,
            processed.thumbnailBlob,
            processed.thumbnailMimeType,
            () => {}
          );
        }

        const createRes = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            media_type: urlData.mediaType,
            storage_path: urlData.storagePath,
            public_url: urlData.publicUrl,
            thumbnail_path: urlData.thumbnailPath,
            thumbnail_url: urlData.thumbnailPublicUrl,
            caption: entry.caption.trim(),
            category: entry.category,
            file_size_bytes: processed.mainBlob.size,
            mime_type: processed.mainMimeType,
            width: processed.width,
            height: processed.height,
          }),
        });

        const created = (await createRes.json()) as {
          error?: string;
          item?: GalleryItem;
        };

        if (!createRes.ok || !created.item) {
          throw new Error(created.error || "Could not save gallery record.");
        }

        setItems((prev) => [created.item!, ...prev]);
        setQueue((prev) =>
          prev.map((q) =>
            q.localId === entry.localId
              ? { ...q, status: "done", progress: 100 }
              : q
          )
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed.";
        setQueue((prev) =>
          prev.map((q) =>
            q.localId === entry.localId
              ? { ...q, status: "error", error: message }
              : q
          )
        );
      }
    }

    setUploading(false);
  }

  async function persistOrder(reordered: GalleryItem[]) {
    setItems(reordered);
    setSavingOrder(true);
    setBannerError(null);
    try {
      const res = await fetch("/api/admin/gallery/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: reordered.map((i) => i.id) }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setBannerError(data.error || "Could not save item order.");
      }
    } finally {
      setSavingOrder(false);
    }
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    void persistOrder(next);
  }

  function handleItemDrop(targetIndex: number) {
    if (!draggedItemId) return;
    const fromIndex = items.findIndex((i) => i.id === draggedItemId);
    setDraggedItemId(null);
    if (fromIndex < 0 || fromIndex === targetIndex) return;
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(targetIndex, 0, moved);
    void persistOrder(next);
  }

  async function handleSaveEdit(id: string) {
    setBannerError(null);
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caption: editCaption.trim(),
        category: editCategory,
      }),
    });
    const data = (await res.json()) as { item?: GalleryItem; error?: string };
    if (!res.ok || !data.item) {
      setBannerError(data.error || "Could not update item.");
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? data.item! : i)));
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    setBannerError(null);
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setBannerError(data.error || "Could not delete gallery item.");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const queuedCount = queue.filter((q) => q.status === "queued").length;

  return (
    <div className="space-y-8">
      {/* Add to gallery */}
      <section className="rounded-[12px] border border-[#262626] bg-[#08080a] p-6 sm:p-8">
        <h2 className="font-display text-2xl text-white sm:text-3xl">
          Add to gallery
        </h2>
        <p className="mt-1 text-xs text-[#9a9a9a]">
          Photos up to 20 MB (JPG, PNG, WebP — automatically resized and
          compressed) and videos up to 200 MB (MP4, WebM).
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="default-caption"
              className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
            >
              Caption
            </label>
            <input
              id="default-caption"
              type="text"
              placeholder="e.g. Annual day 2026, Acme Ltd"
              value={defaultCaption}
              onChange={(e) => setDefaultCaption(e.target.value)}
              className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#0a6cf0]"
            />
          </div>

          <div>
            <label
              htmlFor="default-category"
              className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
            >
              Category
            </label>
            <select
              id="default-category"
              value={defaultCategory}
              onChange={(e) =>
                setDefaultCategory(e.target.value as GalleryCategory)
              }
              className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white focus:border-[#0a6cf0]"
            >
              {GALLERY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-black">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag & drop area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          className={`mt-5 flex flex-col items-center justify-center rounded-[10px] border border-dashed px-6 py-8 text-center transition-colors ${
            isDraggingOver
              ? "border-[#0a6cf0] bg-[#0a6cf0]/10"
              : "border-[#262626] bg-black/60 hover:border-white/30"
          }`}
        >
          <Upload className="h-6 w-6 text-[#ff5a14]" />
          <p className="mt-3 text-sm font-medium text-white">
            Drag and drop photos or videos here
          </p>
          <p className="mt-1 text-xs text-[#9a9a9a]">
            or choose one or more files from your device
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            onChange={(e) => {
              if (e.target.files) enqueueFiles(e.target.files);
              e.target.value = "";
            }}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 rounded-[8px] border border-[#262626] bg-[#0d0d10] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-white/40"
          >
            Choose files
          </button>
        </div>

        {/* Upload queue */}
        {queue.length > 0 && (
          <div className="mt-5 space-y-3">
            {queue.map((entry) => (
              <div
                key={entry.localId}
                className="rounded-[8px] border border-[#262626] bg-black p-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white">
                      {entry.file.name}
                    </p>
                    <p className="text-[11px] text-[#9a9a9a]">
                      {(entry.file.size / (1024 * 1024)).toFixed(2)} MB ·{" "}
                      {entry.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      aria-label={`Caption for ${entry.file.name}`}
                      value={entry.caption}
                      disabled={entry.status !== "queued"}
                      onChange={(e) =>
                        setQueue((prev) =>
                          prev.map((q) =>
                            q.localId === entry.localId
                              ? { ...q, caption: e.target.value }
                              : q
                          )
                        )
                      }
                      placeholder="Caption"
                      className="w-44 rounded-[6px] border border-[#262626] bg-[#08080a] px-2.5 py-1 text-xs text-white disabled:opacity-60"
                    />
                    <select
                      aria-label={`Category for ${entry.file.name}`}
                      value={entry.category}
                      disabled={entry.status !== "queued"}
                      onChange={(e) =>
                        setQueue((prev) =>
                          prev.map((q) =>
                            q.localId === entry.localId
                              ? {
                                  ...q,
                                  category: e.target.value as GalleryCategory,
                                }
                              : q
                          )
                        )
                      }
                      className="rounded-[6px] border border-[#262626] bg-[#08080a] px-2 py-1 text-xs text-white disabled:opacity-60"
                    >
                      {GALLERY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a1f]">
                  <div
                    className={`h-full transition-all duration-200 ${
                      entry.status === "error"
                        ? "bg-[#ff5a14]"
                        : entry.status === "done"
                        ? "bg-[#0a6cf0]"
                        : "bg-[#e8508c]"
                    }`}
                    style={{ width: `${entry.progress}%` }}
                  />
                </div>
                {entry.error && (
                  <p className="mt-1.5 text-xs text-[#ff5a14]">{entry.error}</p>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                disabled={uploading}
                onClick={() => setQueue([])}
                className="text-xs text-[#9a9a9a] hover:text-white disabled:opacity-50"
              >
                Clear list
              </button>
              <button
                type="button"
                disabled={uploading || queuedCount === 0}
                onClick={handleStartUpload}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#e54b09] disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5" />
                {uploading
                  ? "Uploading..."
                  : `Upload${queuedCount > 0 ? ` (${queuedCount})` : ""}`}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Existing gallery items */}
      <section className="rounded-[12px] border border-[#262626] bg-[#08080a] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              Gallery items ({items.length})
            </h2>
            <p className="mt-1 text-xs text-[#9a9a9a]">
              Drag rows or use the arrows to reorder how items appear on the
              site. {savingOrder ? "Saving order..." : ""}
            </p>
          </div>
        </div>

        {bannerError && (
          <p
            role="alert"
            className="mt-4 rounded-[8px] border border-[#ff5a14]/60 bg-[#ff5a14]/10 p-3 text-xs text-white"
          >
            {bannerError}
          </p>
        )}

        {items.length === 0 ? (
          <p className="mt-6 text-sm text-[#9a9a9a]">
            No gallery items uploaded yet. The public site shows placeholders
            until you add your first photo or video.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-[#262626]">
            {items.map((item, idx) => {
              const isEditing = editingId === item.id;
              return (
                <li
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedItemId(item.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleItemDrop(idx)}
                  className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="cursor-grab text-[#666] hover:text-white"
                    >
                      <GripVertical className="h-4 w-4" />
                    </span>

                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-[6px] border border-[#262626] bg-black">
                      {item.thumbnail_url || item.media_type === "image" ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.thumbnail_url || item.public_url}
                          alt={item.caption || "Gallery thumbnail"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#9a9a9a]">
                          <Film className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            className="rounded-[6px] border border-[#262626] bg-black px-2.5 py-1 text-xs text-white"
                          />
                          <select
                            value={editCategory}
                            onChange={(e) =>
                              setEditCategory(
                                e.target.value as GalleryCategory
                              )
                            }
                            className="rounded-[6px] border border-[#262626] bg-black px-2 py-1 text-xs text-white"
                          >
                            {GALLERY_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item.id)}
                            className="inline-flex items-center gap-1 rounded-[6px] bg-[#0a6cf0] px-2.5 py-1 text-xs font-medium text-white"
                          >
                            <Check className="h-3 w-3" />
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="text-xs text-[#9a9a9a] hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="truncate text-sm font-medium text-white">
                            {item.caption || "Untitled item"}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-[#9a9a9a]">
                            <span className="inline-flex items-center gap-1">
                              {item.media_type === "video" ? (
                                <Film className="h-3 w-3 text-[#e8508c]" />
                              ) : (
                                <ImageIcon className="h-3 w-3 text-[#0a6cf0]" />
                              )}
                              {item.media_type}
                            </span>
                            <span>·</span>
                            <span>{item.category}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditCaption(item.caption);
                                setEditCategory(
                                  (GALLERY_CATEGORIES.includes(
                                    item.category as GalleryCategory
                                  )
                                    ? item.category
                                    : "General") as GalleryCategory
                                );
                              }}
                              className="ml-2 text-white/70 underline hover:text-white"
                            >
                              Edit
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, -1)}
                      aria-label="Move item up"
                      className="rounded-[8px] border border-[#262626] p-2 text-white/80 hover:border-white/40 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, 1)}
                      aria-label="Move item down"
                      className="rounded-[8px] border border-[#262626] p-2 text-white/80 hover:border-white/40 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#262626] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#ff5a14] hover:text-[#ff5a14]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
