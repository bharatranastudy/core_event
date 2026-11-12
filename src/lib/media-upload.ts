"use client";

import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "./validation";
import type { GalleryMediaType } from "@/types/database";

export interface ProcessedMedia {
  mediaType: GalleryMediaType;
  mainBlob: Blob;
  mainMimeType: string;
  mainExtension: string;
  thumbnailBlob: Blob | null;
  thumbnailMimeType: string | null;
  width: number | null;
  height: number | null;
}

export function validateMediaFile(file: File): {
  valid: boolean;
  mediaType?: GalleryMediaType;
  error?: string;
} {
  const isImage = (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(
    file.type
  );
  const isVideo = (ACCEPTED_VIDEO_TYPES as readonly string[]).includes(
    file.type
  );

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: `Unsupported file "${file.name}". Accepted formats: JPG, PNG, WebP, MP4, WebM.`,
    };
  }

  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the 20 MB photo limit.`,
    };
  }

  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the 200 MB video limit.`,
    };
  }

  return {
    valid: true,
    mediaType: isImage ? "image" : "video",
  };
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not decode image "${file.name}".`));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas encoding failed."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

async function resizeImageCanvas(
  img: HTMLImageElement,
  maxDimension: number,
  mimeType: string,
  quality: number
): Promise<{ blob: Blob; width: number; height: number }> {
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas context unavailable.");
  }
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvasToBlob(canvas, mimeType, quality);
  return { blob, width, height };
}

function extractVideoThumbnail(
  file: File
): Promise<{ blob: Blob; width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    const timer = window.setTimeout(() => {
      cleanup();
      resolve(null);
    }, 6000);

    video.onloadeddata = () => {
      try {
        video.currentTime = Math.min(0.5, video.duration / 4 || 0);
      } catch {
        window.clearTimeout(timer);
        cleanup();
        resolve(null);
      }
    };

    video.onseeked = async () => {
      window.clearTimeout(timer);
      try {
        const maxWidth = 720;
        const scale = Math.min(1, maxWidth / (video.videoWidth || maxWidth));
        const width = Math.max(1, Math.round((video.videoWidth || 1280) * scale));
        const height = Math.max(
          1,
          Math.round((video.videoHeight || 720) * scale)
        );
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          resolve(null);
          return;
        }
        ctx.drawImage(video, 0, 0, width, height);
        const blob = await canvasToBlob(canvas, "image/webp", 0.8);
        cleanup();
        resolve({ blob, width, height });
      } catch {
        cleanup();
        resolve(null);
      }
    };

    video.onerror = () => {
      window.clearTimeout(timer);
      cleanup();
      resolve(null);
    };

    video.src = url;
  });
}

export async function processMediaBeforeUpload(
  file: File
): Promise<ProcessedMedia> {
  const check = validateMediaFile(file);
  if (!check.valid || !check.mediaType) {
    throw new Error(check.error || "Invalid media file.");
  }

  if (check.mediaType === "image") {
    const img = await loadImageElement(file);
    const targetMime =
      file.type === "image/png" ? "image/png" : "image/webp";
    const targetExt = targetMime === "image/png" ? "png" : "webp";

    const mainResized = await resizeImageCanvas(img, 1920, targetMime, 0.86);
    const thumbResized = await resizeImageCanvas(img, 640, "image/webp", 0.78);

    // Keep original if resizing somehow made a tiny image larger
    const useOriginal = mainResized.blob.size > file.size && img.width <= 1920;

    return {
      mediaType: "image",
      mainBlob: useOriginal ? file : mainResized.blob,
      mainMimeType: useOriginal ? file.type : targetMime,
      mainExtension: useOriginal
        ? file.type.split("/")[1] || "jpg"
        : targetExt,
      thumbnailBlob: thumbResized.blob,
      thumbnailMimeType: "image/webp",
      width: mainResized.width,
      height: mainResized.height,
    };
  }

  const videoThumb = await extractVideoThumbnail(file);
  const ext = file.type === "video/webm" ? "webm" : "mp4";

  return {
    mediaType: "video",
    mainBlob: file,
    mainMimeType: file.type,
    mainExtension: ext,
    thumbnailBlob: videoThumb?.blob ?? null,
    thumbnailMimeType: videoThumb ? "image/webp" : null,
    width: videoThumb?.width ?? null,
    height: videoThumb?.height ?? null,
  };
}

export function uploadBlobWithProgress(
  signedUrl: string,
  blob: Blob,
  contentType: string,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedUrl, true);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("x-upsert", "true");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`Storage upload failed (${xhr.status}).`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload."));
    };

    xhr.send(blob);
  });
}
