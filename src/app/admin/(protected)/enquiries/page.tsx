import { EnquiriesInbox } from "@/components/admin/EnquiriesInbox";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Enquiry } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  let enquiries: Enquiry[] = [];

  const adminSupabase = createAdminSupabaseClient();
  if (adminSupabase) {
    const { data } = await adminSupabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    enquiries = (data as Enquiry[]) || [];
  }

  return <EnquiriesInbox initialEnquiries={enquiries} />;
}
