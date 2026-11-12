import { NextResponse } from "next/server";
import { getAdminSessionUser } from "@/lib/auth";
import { getAdminSettings } from "@/lib/settings";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { settingsSchema } from "@/lib/validation";

export async function GET() {
  const user = await getAdminSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getAdminSettings();
  return NextResponse.json({ settings });
}

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

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid settings values." },
      { status: 400 }
    );
  }

  const { data, error } = await adminSupabase
    .from("settings")
    .upsert({ id: 1, ...parsed.data }, { onConflict: "id" })
    .select(
      "company_name, city_region, notification_email, contact_email, contact_phone, updated_at"
    )
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Could not save settings." },
      { status: 500 }
    );
  }

  return NextResponse.json({ settings: data });
}
