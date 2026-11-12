import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { isAllowedAdminEmail } from "./admin-allowlist";

export { isAllowedAdminEmail };

export async function getAdminSessionUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  if (!isAllowedAdminEmail(user.email)) {
    return null;
  }

  return user;
}

export async function requireAdminUser(): Promise<User> {
  const user = await getAdminSessionUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}
