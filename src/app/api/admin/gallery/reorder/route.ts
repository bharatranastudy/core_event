import { NextResponse } from "next/server";
import { getAdminSessionUser } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { galleryReorderSchema } from "@/lib/validation";

export async function PATCH(request: Request) {
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

  const parsed = galleryReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid list of item IDs." },
      { status: 400 }
    );
  }

  const updates = parsed.data.orderedIds.map((id, index) =>
    adminSupabase
      .from("gallery_items")
      .update({ sort_order: index })
      .eq("id", id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((res) => res.error);
  if (failed?.error) {
    return NextResponse.json(
      { error: failed.error.message || "Failed to save order." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
