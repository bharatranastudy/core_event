import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation";
import { checkEnquiryRateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { getAdminSettings } from "@/lib/settings";
import { sendEnquiryEmails } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers);
    const rate = checkEnquiryRateLimit(`enquiry:${ip}`);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many enquiries sent recently. Please wait ${rate.retryAfterSeconds} seconds and try again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.retryAfterSeconds),
          },
        }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "form");
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      return NextResponse.json(
        {
          ok: false,
          error: "Please fix the highlighted fields and try again.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    // Honeypot check: bots filling the hidden `website` field get a silent 200.
    if (parsed.data.website && parsed.data.website.trim().length > 0) {
      return NextResponse.json({
        ok: true,
        message: "Thank you. Your enquiry has been received.",
      });
    }

    const adminSupabase = createAdminSupabaseClient();
    if (!adminSupabase) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Backend database is not configured yet. Add Supabase keys in .env.local to save and send enquiries.",
        },
        { status: 503 }
      );
    }

    let enquiryId =
      typeof body.retryEnquiryId === "string" &&
      /^[0-9a-f-]{36}$/i.test(body.retryEnquiryId)
        ? body.retryEnquiryId
        : null;

    if (enquiryId) {
      const { data: existing } = await adminSupabase
        .from("enquiries")
        .select("id, work_email")
        .eq("id", enquiryId)
        .maybeSingle();

      if (
        !existing ||
        existing.work_email.toLowerCase() !==
          parsed.data.work_email.toLowerCase()
      ) {
        enquiryId = null;
      }
    }

    if (!enquiryId) {
      const { data: inserted, error: insertError } = await adminSupabase
        .from("enquiries")
        .insert({
          name: parsed.data.name,
          company: parsed.data.company,
          work_email: parsed.data.work_email,
          phone: parsed.data.phone || "",
          event_type: parsed.data.event_type,
          expected_guests: parsed.data.expected_guests,
          preferred_date: parsed.data.preferred_date || null,
          city_venue: parsed.data.city_venue || "",
          message: parsed.data.message,
          status: "New",
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        console.error("[/api/enquiries] Supabase insert failed:", insertError);
        const isMissingTable =
          insertError?.code === "42P01" ||
          insertError?.code === "PGRST205" ||
          insertError?.message?.toLowerCase().includes("schema cache");
        return NextResponse.json(
          {
            ok: false,
            error: isMissingTable
              ? "Database tables are not set up yet. Run supabase/migrations/001_initial_schema.sql in your Supabase SQL Editor."
              : insertError?.message ||
                "We could not save your enquiry right now. Please try again.",
          },
          { status: 500 }
        );
      }

      enquiryId = inserted.id;
    }

    const settings = await getAdminSettings();
    const emailResult = await sendEnquiryEmails(parsed.data, settings);

    if (!emailResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          saved: true,
          enquiryId,
          error:
            emailResult.error ||
            "Your enquiry was saved, but sending the email notification failed. Please retry.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      enquiryId,
      message:
        "Enquiry sent. We have emailed you a confirmation and will respond within one business day.",
    });
  } catch (err) {
    console.error("[/api/enquiries] Unexpected error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
