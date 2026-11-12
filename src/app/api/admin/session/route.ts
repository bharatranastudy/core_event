import { NextResponse } from "next/server";
import { isAllowedAdminEmail } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!isAllowedAdminEmail(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "This account is not authorized to access the admin area." },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, email: user.email });
}

export async function DELETE() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return NextResponse.json({ ok: true });
}
