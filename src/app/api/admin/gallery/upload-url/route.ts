import { NextResponse } from "next/server";
import { getAdminSessionUser } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getAdminSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminSupabase = createAdminSupabaseClient();
  if (!adminSupabase) {
    return NextResponse.json(
      { error: "Supabase service role is not configured." },
      { status: 503 }
    );
  }

  let body: {
    mimeType?: string;
    fileSizeBytes?: number;
    extension?: string;
    hasThumbnail?: boolean;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const mimeType = String(body.mimeType || "").toLowerCase();
  const fileSizeBytes = Number(body.fileSizeBytes || 0);
  const isImage = (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(mimeType);
  const isVideo = (ACCEPTED_VIDEO_TYPES as readonly string[]).includes(mimeType);

  if (!isImage && !isVideo) {
    return NextResponse.json(
      {
        error:
          "Unsupported file type. Accepted types: jpg, png, webp, mp4, webm.",
      },
      { status: 400 }
    );
  }

  if (isImage && fileSizeBytes > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Photo exceeds the 20 MB limit." },
      { status: 400 }
    );
  }

  if (isVideo && fileSizeBytes > MAX_VIDEO_BYTES) {
    return NextResponse.json(
      { error: "Video exceeds the 200 MB limit." },
      { status: 400 }
    );
  }

  const safeExt =
    String(body.extension || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") ||
    (isImage ? "webp" : "mp4");

  const id = crypto.randomUUID();
  const timestamp = Date.now();
  const storagePath = `media/${timestamp}-${id}.${safeExt}`;

  const { data: mainUpload, error: mainError } = await adminSupabase.storage
    .from("gallery")
    .createSignedUploadUrl(storagePath);

  if (mainError || !mainUpload) {
    return NextResponse.json(
      {
        error:
          mainError?.message ||
          "Could not create signed upload URL. Ensure the 'gallery' storage bucket exists.",
      },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = adminSupabase.storage.from("gallery").getPublicUrl(storagePath);

  let thumbnailPath: string | null = null;
  let thumbnailSignedUrl: string | null = null;
  let thumbnailPublicUrl: string | null = null;

  if (body.hasThumbnail) {
    thumbnailPath = `thumbs/${timestamp}-${id}.webp`;
    const { data: thumbUpload } = await adminSupabase.storage
      .from("gallery")
      .createSignedUploadUrl(thumbnailPath);

    if (thumbUpload) {
      thumbnailSignedUrl = thumbUpload.signedUrl;
      thumbnailPublicUrl = adminSupabase.storage
        .from("gallery")
        .getPublicUrl(thumbnailPath).data.publicUrl;
    } else {
      thumbnailPath = null;
    }
  }

  return NextResponse.json({
    mediaType: isImage ? "image" : "video",
    storagePath,
    signedUrl: mainUpload.signedUrl,
    publicUrl,
    thumbnailPath,
    thumbnailSignedUrl,
    thumbnailPublicUrl,
  });
}
