"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Mail, Search, X } from "lucide-react";
import {
  ENQUIRY_STATUSES,
  type Enquiry,
  type EnquiryStatus,
} from "@/types/database";

const STATUS_BADGE_STYLES: Record<EnquiryStatus, string> = {
  New: "border-[#ff5a14]/60 bg-[#ff5a14]/15 text-[#ff5a14]",
  Contacted: "border-[#0a6cf0]/60 bg-[#0a6cf0]/15 text-[#66a8ff]",
  Won: "border-emerald-500/60 bg-emerald-500/15 text-emerald-400",
  Lost: "border-[#262626] bg-white/5 text-[#9a9a9a]",
};

export function EnquiriesInbox({
  initialEnquiries,
}: {
  initialEnquiries: Enquiry[];
}) {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | "All">(
    "All"
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((item) => {
      if (statusFilter !== "All" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.work_email.toLowerCase().includes(q) ||
        item.event_type.toLowerCase().includes(q) ||
        (item.city_venue || "").toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    });
  }, [enquiries, search, statusFilter]);

  const selected = useMemo(
    () => enquiries.find((e) => e.id === selectedId) || null,
    [enquiries, selectedId]
  );

  function openDetail(item: Enquiry) {
    setSelectedId(item.id);
    setNotesDraft(item.notes || "");
    setError(null);
  }

  async function updateEnquiry(
    id: string,
    payload: { status?: EnquiryStatus; notes?: string }
  ) {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        enquiry?: Enquiry;
        error?: string;
      };
      if (!res.ok || !data.enquiry) {
        setError(data.error || "Could not update enquiry.");
        return;
      }
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? data.enquiry! : item))
      );
      router.refresh();
    } catch {
      setError("Network error while updating enquiry.");
    } finally {
      setSavingId(null);
    }
  }

  function buildReplyMailto(item: Enquiry): string {
    const subject = encodeURIComponent(
      `Re: Your ${item.event_type} enquiry for ${item.company}`
    );
    const body = encodeURIComponent(
      `Hi ${item.name},\n\nThanks for reaching out about organising ${item.company}'s ${item.event_type.toLowerCase()}.\n\n`
    );
    return `mailto:${item.work_email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="rounded-[12px] border border-[#262626] bg-[#08080a] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-white sm:text-3xl">
            Enquiries ({filtered.length})
          </h2>
          <p className="mt-1 text-xs text-[#9a9a9a]">
            Newest first. Click any enquiry to inspect details or reply by
            email.
          </p>
        </div>

        <a
          href="/api/admin/enquiries?format=csv"
          download
          className="inline-flex items-center gap-2 rounded-[8px] border border-[#262626] bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:border-white/40"
        >
          <Download className="h-3.5 w-3.5" />
          Download CSV
        </a>
      </div>

      {/* Search & Status filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#666]" />
          <input
            type="search"
            aria-label="Search enquiries"
            placeholder="Search company, name, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[8px] border border-[#262626] bg-black py-2 pr-3.5 pl-9 text-xs text-white placeholder-[#666] focus:border-[#0a6cf0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["All", ...ENQUIRY_STATUSES] as const).map((status) => {
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-white bg-white text-black"
                    : "border-[#262626] bg-black text-white/80 hover:border-white/40"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-[8px] border border-[#ff5a14]/60 bg-[#ff5a14]/10 p-3 text-xs text-white"
        >
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-[#9a9a9a]">
          No enquiries match your current filter.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#262626] text-[#9a9a9a]">
                <th className="py-3 pr-4 font-medium">Company &amp; Event</th>
                <th className="py-3 pr-4 font-medium">Contact</th>
                <th className="py-3 pr-4 font-medium">Details</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 text-right font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-white/[0.03]"
                >
                  <td className="py-4 pr-4 align-top">
                    <button
                      type="button"
                      onClick={() => openDetail(item)}
                      className="text-left font-medium text-white hover:text-[#ff5a14]"
                    >
                      {item.company} · {item.event_type}
                    </button>
                    <p className="mt-1 line-clamp-1 max-w-xs text-[#9a9a9a]">
                      {item.message}
                    </p>
                  </td>
                  <td className="py-4 pr-4 align-top text-[#d4d4d4]">
                    <p>{item.name}</p>
                    <p className="text-[#9a9a9a]">{item.work_email}</p>
                    {item.phone && (
                      <p className="text-[#9a9a9a]">{item.phone}</p>
                    )}
                  </td>
                  <td className="py-4 pr-4 align-top text-[#9a9a9a]">
                    <p>
                      {item.expected_guests
                        ? `${item.expected_guests} guests`
                        : "Guests TBD"}
                    </p>
                    <p>
                      {item.preferred_date || "Date TBD"}
                      {item.city_venue ? ` · ${item.city_venue}` : ""}
                    </p>
                  </td>
                  <td className="py-4 pr-4 align-top">
                    <select
                      aria-label={`Status for ${item.company}`}
                      disabled={savingId === item.id}
                      value={item.status}
                      onChange={(e) =>
                        updateEnquiry(item.id, {
                          status: e.target.value as EnquiryStatus,
                        })
                      }
                      className={`rounded-[6px] border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE_STYLES[item.status]}`}
                    >
                      {ENQUIRY_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="bg-[#08080a] text-white"
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 text-right align-top whitespace-nowrap text-[#9a9a9a]">
                    <p>{new Date(item.created_at).toLocaleDateString()}</p>
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openDetail(item)}
                        className="text-white/80 underline hover:text-white"
                      >
                        View
                      </button>
                      <a
                        href={buildReplyMailto(item)}
                        className="text-[#ff5a14] underline hover:text-[#ff7840]"
                      >
                        Reply
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail view modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enquiry from ${selected.company}`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[12px] border border-[#262626] bg-[#08080a] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-4">
              <div>
                <p className="text-xs text-[#9a9a9a]">
                  Submitted {new Date(selected.created_at).toLocaleString()}
                </p>
                <h3 className="font-display mt-1 text-3xl text-white">
                  {selected.company} · {selected.event_type}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close detail view"
                onClick={() => setSelectedId(null)}
                className="rounded-[8px] border border-[#262626] p-2 text-[#9a9a9a] hover:border-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-[#9a9a9a]">Contact name</dt>
                <dd className="mt-1 text-sm text-white">{selected.name}</dd>
              </div>
              <div>
                <dt className="text-[#9a9a9a]">Work email</dt>
                <dd className="mt-1 text-sm text-white">
                  {selected.work_email}
                </dd>
              </div>
              <div>
                <dt className="text-[#9a9a9a]">Phone</dt>
                <dd className="mt-1 text-sm text-white">
                  {selected.phone || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-[#9a9a9a]">Expected guests</dt>
                <dd className="mt-1 text-sm text-white">
                  {selected.expected_guests ?? "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-[#9a9a9a]">Preferred date</dt>
                <dd className="mt-1 text-sm text-white">
                  {selected.preferred_date || "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-[#9a9a9a]">City / venue</dt>
                <dd className="mt-1 text-sm text-white">
                  {selected.city_venue || "Not specified"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 rounded-[8px] border border-[#262626] bg-black p-4">
              <p className="text-xs font-medium text-[#9a9a9a]">Message</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white">
                {selected.message}
              </p>
            </div>

            <div className="mt-5">
              <label
                htmlFor="enquiry-notes"
                className="mb-1.5 block text-xs font-medium text-[#9a9a9a]"
              >
                Internal notes
              </label>
              <textarea
                id="enquiry-notes"
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add follow-up notes, quotes, or venue ideas..."
                className="w-full rounded-[8px] border border-[#262626] bg-black px-3.5 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#0a6cf0]"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <select
                  aria-label="Update enquiry status"
                  value={selected.status}
                  disabled={savingId === selected.id}
                  onChange={(e) =>
                    updateEnquiry(selected.id, {
                      status: e.target.value as EnquiryStatus,
                    })
                  }
                  className={`rounded-[8px] border px-3 py-2 text-xs font-medium ${STATUS_BADGE_STYLES[selected.status]}`}
                >
                  {ENQUIRY_STATUSES.map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-[#08080a] text-white"
                    >
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={savingId === selected.id}
                  onClick={() =>
                    updateEnquiry(selected.id, { notes: notesDraft })
                  }
                  className="rounded-[8px] border border-[#262626] bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:border-white/40 disabled:opacity-50"
                >
                  {savingId === selected.id ? "Saving..." : "Save notes"}
                </button>
              </div>

              <a
                href={buildReplyMailto(selected)}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#ff5a14] bg-[#ff5a14] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#e54b09]"
              >
                <Mail className="h-3.5 w-3.5" />
                Reply by email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
