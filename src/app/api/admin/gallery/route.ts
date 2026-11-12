import { NextResponse } from "next/server";
import { getAdminSessionUser } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { galleryItemCreateSchema } from "@/lib/validation";

export async function GET() {
  const user = await getAdminSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminSupabase = createAdminSupabaseClient();
  if (!adminSupabase) {
    return NextResponse.json({ items: [], configured: false });
  }

  const { data, error } = await adminSupabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data || [], configured: true });
}

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = galleryItemCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid gallery item data." },
      { status: 400 }
    );
  }

  const { data: minRow } = await adminSupabase
    .from("gallery_items")
    .select("sort_order")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  const nextSortOrder =
    typeof minRow?.sort_order === "number" ? minRow.sort_order - 1 : 0;

  const { data, error } = await adminSupabase
    .from("gallery_items")
    .insert({
      ...parsed.data,
      sort_order: nextSortOrder,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to save gallery item." },
      { status: 500 }
    );
  }

  return NextResponse.json({ item: data }, { status: 201 });
}
