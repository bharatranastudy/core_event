import { NextResponse } from "next/server";
import { getAdminSessionUser } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

function csvCell(value: unknown): string {
  const str = String(value ?? "");
  // Guard against spreadsheet formula injection and properly quote CSV fields
  const safe = /^[=+\-@]/.test(str) ? `'${str}` : str;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const user = await getAdminSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminSupabase = createAdminSupabaseClient();
  if (!adminSupabase) {
    return NextResponse.json({ enquiries: [], configured: false });
  }

  const { data, error } = await adminSupabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("format") === "csv") {
    const headers = [
      "ID",
      "Submitted At",
      "Status",
      "Name",
      "Company",
      "Work Email",
      "Phone",
      "Event Type",
      "Expected Guests",
      "Preferred Date",
      "City / Venue",
      "Message",
    ];
    const rows = (data || []).map((row) =>
      [
        row.id,
        row.created_at,
        row.status,
        row.name,
        row.company,
        row.work_email,
        row.phone,
        row.event_type,
        row.expected_guests ?? "",
        row.preferred_date ?? "",
        row.city_venue,
        row.message,
      ]
        .map(csvCell)
        .join(",")
    );

    const csv = [headers.map(csvCell).join(","), ...rows].join("\r\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ enquiries: data || [], configured: true });
}
