"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { EVENT_TYPES, type EventType } from "@/types/database";
import { enquirySchema } from "@/lib/validation";

interface FormState {
  name: string;
  company: string;
  work_email: string;
  phone: string;
  event_type: EventType;
  expected_guests: string;
  preferred_date: string;
  city_venue: string;
  message: string;
  website: string; // honeypot
}

export function EnquiryForm({
  initialEventType = "Seminar",
}: {
  initialEventType?: EventType;
}) {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    work_email: "",
    phone: "",
    event_type: initialEventType,
    expected_guests: "",
    preferred_date: "",
    city_venue: "",
    message: "",
    website: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [retryEnquiryId, setRetryEnquiryId] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function submitEnquiry(e?: FormEvent) {
    e?.preventDefault();
    setSubmitError(null);

    const parsed = enquirySchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "form");
        if (!nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          retryEnquiryId,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
        enquiryId?: string;
      };

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        if (data.enquiryId) {
          setRetryEnquiryId(data.enquiryId);
        }
        setSubmitError(
          data.error || "Could not send your enquiry. Please try again."
        );
        return;
      }

      setSubmittedSuccess(true);
      setRetryEnquiryId(null);
    } catch {
      setSubmitError(
        "Network error while sending your enquiry. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedSuccess) {
    return (
      <div className="rounded-[12px] border border-[#262626] bg-[#08080a] p-8 text-center sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ff5a14]/15 text-[#ff5a14]">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="font-display mt-5 text-3xl text-white sm:text-4xl">
          Enquiry received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#9a9a9a]">
          Thanks, {form.name}. We&apos;ve sent a confirmation to{" "}
          <span className="text-white">{form.work_email}</span> and our team
          will get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedSuccess(false);
            setForm({
              name: "",
              company: "",
              work_email: "",
              phone: "",
              event_type: initialEventType,
              expected_guests: "",
              preferred_date: "",
              city_venue: "",
              message: "",
              website: "",
            });
          }}
          className="mt-6 inline-flex items-center justify-center rounded-[8px] border border-white/25 px-5 py-2 text-xs font-medium text-white transition-colors hover:border-[#0a6cf0] hover:bg-[#0a6cf0]"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submitEnquiry} noValidate className="space-y-5">
      {/* Honeypot anti-spam field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => updateField("website", e.target.value)}
        />
      </div>

      {submitError && (
        <div
          role="alert"
          className="flex flex-col justify-between gap-3 rounded-[8px] border border-[#ff5a14]/60 bg-[#ff5a14]/10 p-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-2.5 text-xs leading-relaxed text-white">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a14]" />
            <span>{submitError}</span>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={() => submitEnquiry()}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#e54b09] disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="enquiry-name"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            Your name
          </label>
          <input
            id="enquiry-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            className="w-full rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2.5 text-sm text-white placeholder-[#666] transition-colors focus:border-[#0a6cf0]"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-[#ff5a14]">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-company"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            Company
          </label>
          <input
            id="enquiry-company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
            aria-invalid={Boolean(fieldErrors.company)}
            className="w-full rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2.5 text-sm text-white placeholder-[#666] transition-colors focus:border-[#0a6cf0]"
          />
          {fieldErrors.company && (
            <p className="mt-1 text-xs text-[#ff5a14]">{fieldErrors.company}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-email"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            Work email
          </label>
          <input
            id="enquiry-email"
            name="work_email"
            type="email"
            required
            autoComplete="email"
            value={form.work_email}
            onChange={(e) => updateField("work_email", e.target.value)}
            aria-invalid={Boolean(fieldErrors.work_email)}
            className="w-full rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2.5 text-sm text-white placeholder-[#666] transition-colors focus:border-[#0a6cf0]"
          />
          {fieldErrors.work_email && (
            <p className="mt-1 text-xs text-[#ff5a14]">
              {fieldErrors.work_email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-phone"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            Phone
          </label>
          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            aria-invalid={Boolean(fieldErrors.phone)}
            className="w-full rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2.5 text-sm text-white placeholder-[#666] transition-colors focus:border-[#0a6cf0]"
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-xs text-[#ff5a14]">{fieldErrors.phone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-type"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            Event type
          </label>
          <select
            id="enquiry-type"
            name="event_type"
            value={form.event_type}
            onChange={(e) =>
              updateField("event_type", e.target.value as EventType)
            }
            className="w-full rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-[#0a6cf0]"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-[#08080a]">
                {type}
              </option>
            ))}
          </select>
          {fieldErrors.event_type && (
            <p className="mt-1 text-xs text-[#ff5a14]">
              {fieldErrors.event_type}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-guests"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            Expected guests
          </label>
          <input
            id="enquiry-guests"
            name="expected_guests"
            type="number"
            min={1}
            placeholder="e.g. 150"
            value={form.expected_guests}
            onChange={(e) => updateField("expected_guests", e.target.value)}
            aria-invalid={Boolean(fieldErrors.expected_guests)}
            className="w-full rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2.5 text-sm text-white placeholder-[#666] transition-colors focus:border-[#0a6cf0]"
          />
          {fieldErrors.expected_guests && (
            <p className="mt-1 text-xs text-[#ff5a14]">
              {fieldErrors.expected_guests}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-date"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            Preferred date
          </label>
          <input
            id="enquiry-date"
            name="preferred_date"
            type="date"
            value={form.preferred_date}
            onChange={(e) => updateField("preferred_date", e.target.value)}
            aria-invalid={Boolean(fieldErrors.preferred_date)}
            className="w-full rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-[#0a6cf0]"
          />
          {fieldErrors.preferred_date && (
            <p className="mt-1 text-xs text-[#ff5a14]">
              {fieldErrors.preferred_date}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-city"
            className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
          >
            City / venue
          </label>
          <input
            id="enquiry-city"
            name="city_venue"
            type="text"
            value={form.city_venue}
            onChange={(e) => updateField("city_venue", e.target.value)}
            aria-invalid={Boolean(fieldErrors.city_venue)}
            className="w-full rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2.5 text-sm text-white placeholder-[#666] transition-colors focus:border-[#0a6cf0]"
          />
          {fieldErrors.city_venue && (
            <p className="mt-1 text-xs text-[#ff5a14]">
              {fieldErrors.city_venue}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="enquiry-message"
          className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
        >
          What should we know?
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          required
          rows={4}
          placeholder="Goals, budget range, anything special"
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          className="w-full rounded-[8px] border border-[#262626] bg-[#08080a] px-3.5 py-2.5 text-sm text-white placeholder-[#666] transition-colors focus:border-[#0a6cf0]"
        />
        {fieldErrors.message && (
          <p className="mt-1 text-xs text-[#ff5a14]">{fieldErrors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e54b09] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending enquiry..." : "Send enquiry"}
      </button>
    </form>
  );
}
