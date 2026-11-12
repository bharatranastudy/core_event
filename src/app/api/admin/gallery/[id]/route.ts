import { NextResponse } from "next/server";
import { getAdminSessionUser } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { galleryItemUpdateSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getAdminSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const adminSupabase = createAdminSupabaseClient();
  if (!adminSupabase) {
    return NextResponse.json(
      { error: "Supabase service role is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = galleryItemUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid update payload." },
      { status: 400 }
    );
  }

  const { data, error } = await adminSupabase
    .from("gallery_items")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Could not update gallery item." },
      { status: 500 }
    );
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getAdminSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const adminSupabase = createAdminSupabaseClient();
  if (!adminSupabase) {
    return NextResponse.json(
      { error: "Supabase service role is not configured." },
      { status: 503 }
    );
  }

  const { data: item, error: fetchError } = await adminSupabase
    .from("gallery_items")
    .select("id, storage_path, thumbnail_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !item) {
    return NextResponse.json(
      { error: "Gallery item not found." },
      { status: 404 }
    );
  }

  const pathsToRemove = [item.storage_path, item.thumbnail_path].filter(
    (p): p is string => Boolean(p)
  );

  if (pathsToRemove.length > 0) {
    await adminSupabase.storage.from("gallery").remove(pathsToRemove);
  }

  const { error: deleteError } = await adminSupabase
    .from("gallery_items")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message || "Failed to delete item." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
