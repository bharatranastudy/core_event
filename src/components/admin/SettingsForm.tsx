"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { SiteSettings } from "@/types/database";

export function SettingsForm({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as {
        settings?: SiteSettings;
        error?: string;
      };

      if (!res.ok || !data.settings) {
        setError(data.error || "Could not save settings.");
        return;
      }

      setForm(data.settings);
      setSaved(true);
      router.refresh();
    } catch {
      setError("Network error while saving settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-[12px] border border-[#262626] bg-[#08080a] p-6 sm:p-8">
      <h2 className="font-display text-2xl text-white sm:text-3xl">
        Site &amp; notification settings
      </h2>
      <p className="mt-1 text-xs text-[#9a9a9a]">
        Control where new enquiry emails are delivered and the contact details
        shown in the website footer.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-[8px] border border-[#ff5a14]/60 bg-[#ff5a14]/10 p-3.5 text-xs text-white"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a14]" />
          <span>{error}</span>
        </div>
      )}

      {saved && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2.5 rounded-[8px] border border-emerald-500/50 bg-emerald-500/10 p-3.5 text-xs text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Settings saved and published to the live site.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="settings-company"
              className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
            >
              Company name
            </label>
            <input
              id="settings-company"
              type="text"
              required
              value={form.company_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, company_name: e.target.value }))
              }
              className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white focus:border-[#0a6cf0]"
            />
          </div>

          <div>
            <label
              htmlFor="settings-city"
              className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
            >
              City / region
            </label>
            <input
              id="settings-city"
              type="text"
              required
              value={form.city_region}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, city_region: e.target.value }))
              }
              className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white focus:border-[#0a6cf0]"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="settings-notification-email"
              className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
            >
              Notification email (private — receives new enquiries)
            </label>
            <input
              id="settings-notification-email"
              type="email"
              required
              value={form.notification_email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  notification_email: e.target.value,
                }))
              }
              className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white focus:border-[#0a6cf0]"
            />
          </div>

          <div>
            <label
              htmlFor="settings-contact-email"
              className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
            >
              Public contact email (shown in footer)
            </label>
            <input
              id="settings-contact-email"
              type="email"
              required
              value={form.contact_email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, contact_email: e.target.value }))
              }
              className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white focus:border-[#0a6cf0]"
            />
          </div>

          <div>
            <label
              htmlFor="settings-contact-phone"
              className="mb-1.5 block text-xs font-medium text-[#d4d4d4]"
            >
              Public contact phone (shown in footer)
            </label>
            <input
              id="settings-contact-phone"
              type="tel"
              required
              value={form.contact_phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, contact_phone: e.target.value }))
              }
              className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white focus:border-[#0a6cf0]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#e54b09] disabled:opacity-60"
          >
            {saving ? "Saving settings..." : "Save settings"}
          </button>
        </div>
      </form>
    </section>
  );
}
