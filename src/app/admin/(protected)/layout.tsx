import type { ReactNode } from "react";
import { requireAdminUser } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdminUser();

  let newEnquiriesCount = 0;
  const adminSupabase = createAdminSupabaseClient();
  if (adminSupabase) {
    const { count } = await adminSupabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "New");
    newEnquiriesCount = count ?? 0;
  }

  return (
    <section className="mx-auto max-w-[1100px] px-5 pt-12 pb-24 sm:px-8 sm:pt-16">
      <AdminNav
        newEnquiriesCount={newEnquiriesCount}
        userEmail={user.email || "Owner"}
      />
      {children}
    </section>
  );
}
