import { Resend } from "resend";
import type { ParsedEnquiryInput } from "./validation";
import type { SiteSettings } from "@/types/database";

export interface EmailSendResult {
  ok: boolean;
  error?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || apiKey.includes("your_resend_api_key")) {
    return null;
  }
  return new Resend(apiKey);
}

export async function sendEnquiryEmails(
  enquiry: ParsedEnquiryInput,
  settings: SiteSettings
): Promise<EmailSendResult> {
  const resend = getResendClient();
  if (!resend) {
    return {
      ok: false,
      error:
        "Email service is not configured yet (missing RESEND_API_KEY). Your enquiry could not be emailed.",
    };
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `${settings.company_name} <onboarding@resend.dev>`;

  const ownerTo =
    settings.notification_email ||
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim();

  if (!ownerTo || ownerTo.includes("yourcompany.com")) {
    return {
      ok: false,
      error:
        "Notification email is not configured yet. Please set a real recipient in Admin Settings or .env.local.",
    };
  }

  const guestsText = enquiry.expected_guests
    ? `${enquiry.expected_guests} guests`
    : "Not specified";
  const dateText = enquiry.preferred_date || "Not specified";
  const cityVenueText = enquiry.city_venue || "Not specified";
  const phoneText = enquiry.phone || "Not provided";

  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; background:#0a0a0a; color:#ffffff; padding:32px; border-radius:8px; max-width:640px;">
      <p style="color:#ff5a14; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin:0 0 8px;">New Event Enquiry</p>
      <h1 style="margin:0 0 24px; font-size:24px; color:#ffffff;">${escapeHtml(enquiry.company)} — ${escapeHtml(enquiry.event_type)}</h1>
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <tr><td style="padding:8px 0; color:#9a9a9a; width:160px;">Contact name</td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(enquiry.name)}</td></tr>
        <tr><td style="padding:8px 0; color:#9a9a9a;">Company</td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(enquiry.company)}</td></tr>
        <tr><td style="padding:8px 0; color:#9a9a9a;">Work email</td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(enquiry.work_email)}</td></tr>
        <tr><td style="padding:8px 0; color:#9a9a9a;">Phone</td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(phoneText)}</td></tr>
        <tr><td style="padding:8px 0; color:#9a9a9a;">Event type</td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(enquiry.event_type)}</td></tr>
        <tr><td style="padding:8px 0; color:#9a9a9a;">Expected guests</td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(guestsText)}</td></tr>
        <tr><td style="padding:8px 0; color:#9a9a9a;">Preferred date</td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(dateText)}</td></tr>
        <tr><td style="padding:8px 0; color:#9a9a9a;">City / venue</td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(cityVenueText)}</td></tr>
      </table>
      <div style="background:#141414; border:1px solid #262626; border-radius:8px; padding:16px;">
        <p style="margin:0 0 8px; color:#9a9a9a; font-size:12px; text-transform:uppercase;">Message</p>
        <p style="margin:0; color:#ffffff; white-space:pre-wrap; line-height:1.6;">${escapeHtml(enquiry.message)}</p>
      </div>
      <p style="margin:24px 0 0; color:#9a9a9a; font-size:12px;">Reply directly to this email to respond to ${escapeHtml(enquiry.name)} (${escapeHtml(enquiry.work_email)}).</p>
    </div>
  `;

  const visitorHtml = `
    <div style="font-family: Arial, sans-serif; background:#0a0a0a; color:#ffffff; padding:32px; border-radius:8px; max-width:600px;">
      <p style="color:#ff5a14; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin:0 0 8px;">${escapeHtml(settings.company_name)}</p>
      <h1 style="margin:0 0 16px; font-size:22px; color:#ffffff;">We received your event enquiry</h1>
      <p style="margin:0 0 16px; color:#d4d4d4; line-height:1.6;">
        Hi ${escapeHtml(enquiry.name)},<br/><br/>
        Thanks for reaching out to ${escapeHtml(settings.company_name)} regarding your <strong>${escapeHtml(enquiry.event_type)}</strong> for <strong>${escapeHtml(enquiry.company)}</strong>.
        Our team is reviewing your brief and will get back to you within one business day.
      </p>
      <div style="background:#141414; border:1px solid #262626; border-radius:8px; padding:16px; margin-bottom:20px;">
        <p style="margin:0 0 6px; color:#9a9a9a; font-size:13px;">Summary</p>
        <p style="margin:0; color:#ffffff; font-size:14px; line-height:1.6;">
          Event type: ${escapeHtml(enquiry.event_type)}<br/>
          Expected guests: ${escapeHtml(guestsText)}<br/>
          Preferred date: ${escapeHtml(dateText)}<br/>
          City / venue: ${escapeHtml(cityVenueText)}
        </p>
      </div>
      <p style="margin:0; color:#9a9a9a; font-size:13px;">
        Need to add anything? Just reply to this email or contact us at ${escapeHtml(settings.contact_email)}.
      </p>
    </div>
  `;

  try {
    const ownerResponse = await resend.emails.send({
      from: fromEmail,
      to: [ownerTo],
      replyTo: enquiry.work_email,
      subject: `New enquiry: ${enquiry.company} (${enquiry.event_type})`,
      html: ownerHtml,
    });

    if (ownerResponse.error) {
      return {
        ok: false,
        error: ownerResponse.error.message || "Failed to deliver notification email.",
      };
    }

    const visitorResponse = await resend.emails.send({
      from: fromEmail,
      to: [enquiry.work_email],
      replyTo: settings.contact_email,
      subject: `We received your enquiry — ${settings.company_name}`,
      html: visitorHtml,
    });

    if (visitorResponse.error) {
      return {
        ok: false,
        error:
          visitorResponse.error.message ||
          "Enquiry saved, but the confirmation email could not be delivered.",
      };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Unexpected error while sending emails.",
    };
  }
}
